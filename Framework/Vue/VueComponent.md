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

