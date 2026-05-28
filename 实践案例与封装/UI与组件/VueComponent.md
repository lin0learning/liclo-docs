# 自定义组件

## 1. Button

```vue
<template>
  <div
    class="u-button_wrapper reaction-item text-white cursor-pointer text-sm select-none"
    :class="{loading: loading, 'grayscale-[0.6]': gray, 'disabled': disable}"
    :style="{width: width + 'px', height: height + 'px'}"
    @click="handleClick"
  >
    <div class="h-full flex justify-center items-center relative">
      <svg v-if="loading" class="loading-icon" width="20" height="20" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 10 A 40 40 0 0 1 90 50" stroke="white" stroke-width="10" fill="none" />
      </svg>
      <span class="text-slot text-white" style="transition: transform 0.2s ease-in-out, font-size 0.2s ease-in-out">
        <slot>{{ text }}</slot>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// vue3.5+ Props 解构默认值
const {
  width = 112,
  height = 36,
  loading = false,
  gray = false,
} = defineProps<{
  text: string
  width?: number
  height?: number
  loading?: boolean
  gray?: boolean
  disable?: boolean
}>()

const emits = defineEmits(['click'])

function handleClick() {
  if (loading) return
  emits('click')
}
</script>

<style scoped lang="less">
.u-button_wrapper {
  background: url('@images/button_bg.png') no-repeat center;
  background-size: 100% 100%;
  &.loading {
    cursor: not-allowed;
    filter: brightness(0.8);
    &:hover {
      transform: none;
    }
    .loading-icon {
      opacity: 1;
    }
    .text-slot {
      transform: translateX(4px);
    }
  }

  .loading-icon {
    opacity: 0;
    margin-right: 5px;
    animation: rotate 1s linear infinite;
    transition: opacity 0.2s ease-in-out;
  }
}
.disabled {
  cursor: not-allowed;
  filter: brightness(0.8);
  pointer-events: none;
  &:hover {
    transform: none;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
```



## 2. Chart

```vue
<template>
  <div class="w-full h-full rounded" ref="chartRef" :class="{'bg-slate-700': props.options?.xAxis}"></div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'
import type {EChartsOption, EChartsType} from 'echarts'
import echarts from '@/utils/echarts'

interface Options extends EChartsOption {}

const props = defineProps<{
  options: Options
}>()

defineExpose({
  updateChart
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: EChartsType | null = null

function resizeCharts() {
  chartInstance?.resize()
  chartInstance?.setOption(props.options)
}

function initChart() {
  // @ts-ignore
  chartInstance = echarts.init(chartRef.value)
  chartInstance?.setOption(props.options)
}

function updateChart() {
  if (!chartInstance) {
    // @ts-ignore
    chartInstance = echarts.init(chartRef.value)
  }
  chartInstance?.clear()
  chartInstance?.setOption(props.options)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeCharts)
})
onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts)
})
</script>

<style scoped lang="less"></style>
```



## 3. Modal

```tsx
import { defineComponent, ref, Teleport, PropType, VNode, onUnmounted } from 'vue';
import { UButton } from '..';

export const useConfirmModal = () => {
  const visible = ref(false);
  const options = ref<ModalConfirmProps>({
    title: '提示',
    content: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const open = (opts: ModalConfirmProps) => {
    options.value = opts;
    visible.value = true;
  };

  const close = () => {
    visible.value = false;
  };

  const ConfirmModal = () =>
    visible.value ? (
      <ModalConfirm
        {...options.value}
        visible={visible.value}
        onUpdateVisible={v => (visible.value = v)}
      />
    ) : null;

  return {
    open,
    close,
    ConfirmModal,
  };
};

type ModalConfirmProps = {
  title?: string;
  content?: string | VNode;
  confirmText?: string;
  cancelText?: string;
  visible?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onUpdateVisible?: (v: boolean) => void;
  footer?: () => VNode;
};

const modalStyle = {
  bg: {
    background: 'linear-gradient(179deg, rgba(55, 71, 104, 0.88), rgba(25, 34, 55, 0.82)) rgba(0, 0, 0, 0.42)',
    backdropFilter: 'blur(10px)'
  }
}

const ModalConfirm = defineComponent({
  name: 'ModalConfirm',
  props: {
    title: String,
    content: [String, Object] as PropType<string | VNode>,
    confirmText: {
      type: String,
      default: '确定',
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    visible: Boolean,
    onConfirm: Function as PropType<() => void>,
    onCancel: Function as PropType<() => void>,
    onUpdateVisible: Function as PropType<(v: boolean) => void>,
    footer: Function as PropType<() => VNode>,
  },
  setup(props, { slots }) {
    const close = () => {
      props.onUpdateVisible?.(false);
    };

    const handleConfirm = () => {
      props.onConfirm?.();
      close();
    };

    const handleCancel = () => {
      props.onCancel?.();
      close();
    };

    onUnmounted(() => {
      props.onUpdateVisible?.(false);
    });

    return () =>
      props.visible ? (
        <Teleport to="body">
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 text-white">
            <div class="rounded-md p-4 w-[400px]" style={modalStyle.bg}>
              <h2 class="text-lg font-semibold mb-2 text-center">{props.title}</h2>
              <div class="my-8 text-center">
                {slots.default ? slots.default() : props.content}
              </div>
              <div class="flex justify-center space-x-2 gap-3">
                {props.footer ? (
                  props.footer()
                ) : (
                  <>
                    <button
                      class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={handleCancel}
                    >
                      {props.cancelText}
                    </button>
                    <button
                      class="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleConfirm}
                    >
                      {props.confirmText}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Teleport>
      ) : null;
  },
});

export default ModalConfirm;
```

## 4. ConnectorLine

## Hook 设计方案：`useDomConnectorLine`

### 职责

在 `containerRef` 的坐标系里画一条 水平线段，连接 `fromRef` 与 `toRef`（默认：`from` 的右边缘 → `to` 的左边缘，竖直位置取二者垂直中心的中点）。

### 文件位置

```
src/composables/useDomConnectorLine.ts
```

### 入参

| 参数           | 含义                                                         |
| :------------- | :----------------------------------------------------------- |
| `fromRef`      | 起点锚点（如左侧 `.cc-line-left`）                           |
| `toRef`        | 终点锚点（如右侧 `.cc-line-right`）                          |
| `containerRef` | `position: relative/absolute` 的祖先，线段 `left/top` 相对该盒模型 |
| `options`      | 可选：`lineHeight`（默认 2）、`fromRightToLeft`（默认 `true`） |

### 返回值

| 字段            | 用途                                                         |
| :-------------- | :----------------------------------------------------------- |
| `ConnectorLine` | 用 `<component :is="ConnectorLine" class="…" />` 挂在 template；根节点为 `div`，合并传入的 `class` / 其它 attrs |
| `lineMetrics`   | `reactive({ left, top, width })`，便于调试或别处只读使用     |
| `update()`      | 手动刷新几何（锚点被 `v-if` 换掉、仅子树布局变化而 container 尺寸未变 时可调用） |

### 实现要点（为何这样设计）

1. 几何用 `reactive`：`ResizeObserver` 回调里改字段；返回的内联组件在 `render` 里读 `lineMetrics`，自动建立依赖并刷新 DOM。
2. `ConnectorLine` 用 `defineComponent` + `h` + `mergeProps`：composition API 里「返回组件」的常见写法；`mergeProps(attrs, { style: … })` 保留父级传的 `class` / `:class`，并用绝对定位样式覆盖 `left/top/width/height`。
3. `useResizeObserver(containerRef)`：只在 容器尺寸变化 时触发；若将来需要锚点自身缩放但容器不变，可再给两个锚点加 observer 或在相关 `watch` 里调 `update()`。

### 在 template 中的用法示例（`part-two.vue` 已采用）

<component :is="CcConnectorLine" class="line" :class="todInfo.frontBackLinkStatus" />

const { ConnectorLine: CcConnectorLine } = useDomConnectorLine(

  ccLineLeftRef,

  ccLineRightRef,

  partTwoRef,

)

样式仍由 `.part-two .line` 负责颜色、`opacity`、`z-index` 等；线段长度与位置由 hook 内联样式承担。

```typescript
/**
 * 两点 DOM 锚点之间的水平连线（容器坐标系内 absolute 定位）。
 *
 * 设计说明：
 * - 入参三个 Ref：from / to 为锚点元素，container 为 `position: relative|absolute` 的定位参照（与线段的 `left/top` 同源）。
 * - 几何量放在 reactive `lineMetrics` 上，便于返回的内联组件在 render 中订阅依赖并随 ResizeObserver 更新。
 * - `ConnectorLine` 为 `defineComponent` + `h`，可通过 `<component :is="ConnectorLine" class="line" />` 写在 template，
 *   `class` / `style`（除 left、top、width、height 外）等 attrs 会合并进根节点；连线尺寸相关样式由 hook 写入并覆盖同名键。
 * - 可选暴露 `update()` 用于锚点 DOM 变更、`v-if` 切换等场景下手动刷新（ResizeObserver 仅监听 container 尺寸）。
 */
import {
  defineComponent,
  h,
  mergeProps,
  nextTick,
  onMounted,
  reactive,
  type Component,
  type Ref,
} from 'vue'
import { useResizeObserver } from '@vueuse/core'

export interface UseDomConnectorLineOptions {
  /** 线段厚度（px），默认 2 */
  lineHeight?: number
  /** true：from 右边缘 → to 左边缘（默认）；false：from 左边缘 → to 右边缘 */
  fromRightToLeft?: boolean
}

export interface DomConnectorLineMetrics {
  left: string
  top: string
  width: string
}

/**
 * 水平连接线Hook 接收三个Ref：from / to 为锚点元素，container 为 `position: relative|absolute` 的定位参照（与线段的 `left/top` 同源）。
 * 返回连接线dom组件
 * @param fromRef 起点元素Ref
 * @param toRef 终点元素Ref
 * @param containerRef 容器元素Ref
 * @param options 选项
 * @returns 连接线dom组件、连接线几何量、更新函数
 */
export function useDomConnectorLine(
  fromRef: Ref<HTMLElement | null>,
  toRef: Ref<HTMLElement | null>,
  containerRef: Ref<HTMLElement | null>,
  options: UseDomConnectorLineOptions = {},
): {
  ConnectorLine: Component
  lineMetrics: DomConnectorLineMetrics
  update: () => void
} {
  const lineHeight = options.lineHeight ?? 2
  const fromRightToLeft = options.fromRightToLeft ?? true

  const lineMetrics = reactive<DomConnectorLineMetrics>({
    left: '0px',
    top: '0px',
    width: '0px',
  })

  function update() {
    const container = containerRef.value
    const fromEl = fromRef.value
    const toEl = toRef.value
    if (!container || !fromEl || !toEl) return

    const c = container.getBoundingClientRect()
    const a = fromEl.getBoundingClientRect()
    const b = toEl.getBoundingClientRect()

    const x1 = fromRightToLeft ? a.right : a.left
    const x2 = fromRightToLeft ? b.left : b.right
    const cy = (a.top + a.height / 2 + b.top + b.height / 2) / 2

    lineMetrics.left = `${x1 - c.left}px`
    lineMetrics.top = `${cy - c.top - lineHeight / 2}px`
    lineMetrics.width = `${Math.max(0, x2 - x1)}px`
  }

  useResizeObserver(containerRef, update)

  onMounted(() => {
    nextTick(update)
  })

  const ConnectorLine = defineComponent({
    name: 'DomConnectorLine',
    inheritAttrs: false,
    setup(_, { attrs }) {
      return () =>
        h(
          'div',
          mergeProps(attrs, {
            style: {
              position: 'absolute',
              left: lineMetrics.left,
              top: lineMetrics.top,
              width: lineMetrics.width,
              height: `${lineHeight}px`,
            },
          }),
        )
    },
  })

  return { ConnectorLine, lineMetrics, update }
}
```