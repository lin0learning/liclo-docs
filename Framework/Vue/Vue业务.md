# Vue 业务实践



## 1. Vue组件内嵌套外部页面的视线与案例分享

### 1. 前言

> 在 web 页面开发中，常常会有这样需求：
>
> ​	**在当前页面内打开一个外部页面。**
>
> 如果仅仅是跳转到外部页面，对于有经验的开发者来说，应该没有什么难度。但常常，需要打开的页面仅仅是当前已有页面的一部分，即需要嵌套到当前页面内，往往就不太好实现了。



### 2. 解决方案

使用 **iframe** 加载外部页面。

html 页面内嵌套 iframe，并将 iframe 的 src 属性绑定为目标外部页面链接。

```html
<div id="iframe-container">
  <iframe :src="iframeSrc" scrolling="auto" frameborder="0" id="iframe"></iframe>
</div>
```



### 3. 示例

**需求：** 点击电商导航内菜单，打开相应页面，在新开页面中，显示页面加载状态，可以回退和直接关闭新开页面。

**分析：**

- 图一和图二顶部样式不一致，因此，是两个独立的组件。
- 点击图一页面中的菜单，跳转到图二页面，需要配置路由。
- 如何传递外部页面的地址？路由传参？vuex?



图一页面布局：
:::code-group
```vue [template]
<template>
 <div class="module-box">
    <div class="module-title">电商导航</div>
    <van-grid :column-num="3">
      <van-grid-item v-for="(item,index) in eShopNavItems"
        :key="index"
        :icon="item.iconPath"
        :text="item.name"
        @click="gotoPage(item.path)"
      />
    </van-grid>
 </div>
</template>
```
```vue [script]
<script setup>
import { useRouter,useRoute } from 'vue-router'
import store from '@/store/index'
  
const router = useRouter();
const route = useRoute();
const eShopNavItems = [
  {
    name: "京东",
    iconPath: require('@/assets/images/lifeServices/index/jd.png'),
    path: '/home/lifeServices/jd'
  }
]
const goJDPage = (path) => {
  router.push(path);
  store.state.iframeSrc = route.meta.link;
  store.state.iframeTitle = route.meta.title;
}
</script>
```
:::

路由配置：

```js
const routes = [
  {
    path: '/home/lifeServices/externalLink',
    name: 'externalLink',
    component: LinkHome,
    children: [
      {
        path: '/home/lifeServices/jd',
        meta: {
          link: 'https://m.jd.com/',
          title: '京东(jd.com)'
        }
      },
    ]
  }
];
```



`<LinkHome>` 组件：

```vue
<template>
  <div class="link-home">
    <div class="header">
      <van-nav-bar
        :title="store.state.iframeTitle"
        left-arrow
        @click-left="onClickLeft"
      ></van-nav-bar>
      <van-icon name="cross" class="close" @click="closeTab" />
    </div>

    <div id="iframe-container">
      <iframe :src="store.state.iframeSrc" scrolling="auto" frameborder="0" id="iframe" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import state from '@/store/index';
import NProgress from 'nprogress';

const router = useRouter();
let iframe = document.getElementById('iframe-container');
NProgress.start()
iframe.onload = function() {
  NProgress.done()
}
const onClickLeft = () => {
  router.go(-1)
  NProgress.done()
}
const closeTab = () => {
  router.replace('home/lifeServices/index')
  NProgress.done()
}
</script>
```

给 iframe 的 src 属性绑定值，且为目标外部页面地址。即可嵌套加载外部页面。

页面加载状态使用[NProgress](https://link.segmentfault.com/?enc=wc%2FSBwzzrKEWze%2FeeyOvcg%3D%3D.Ebj5WW4kHtE3h8N6dZAjnf4rqqd%2FXOnncqTyb%2BUB9elnepaDQP8%2BhXAzHsnTleEE)。

在 vue.js 的 mounted 生命周期内，开始加载进度条。

```js
NProgress.start()
```

获取 iframe 元素，当 iframe 页面加载完成后，关闭进度条。

```js
iframe.onload = function() {
  NProgress.done()
}
```

当后退或者关闭当前页面时，也应该一并关闭进度条提示。因为当页面还没有加载完时，后退或者关闭页面，将会导致进度条一直存在。

**特别提示:** 关闭页面，即回到主页时，应使用 **`router.replace`** 而不是 `router.push`

这两个同样是跳转到指定的 url，但是：

1. `router.replace` 不会向 history 里面添加新的记录。

2. 回到主页，再后退，应该是回到进入主页的上一个页面，而不是刚才打开的外部页面。





## 2. `el-pagination` 前端分页

```vue
<template>
  <el-pagination
    :total="total"
    :page-sizes="[10, 20, 30, 40]"
    :page-size="pageSize"
    :current-page="currentPage"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
const allData = ref([]);     // 后端一次性传来的所有数据
const pagedData = ref([]);   // 当前页显示的数据
const currentPage = ref(1);  // 当前页数
const pageSize = ref(10);    // 每页显示条数
const total = ref(0);        // 总条数

const handleCurrentChange = (val) => {
  currentPage.value = val;
  updatePagedData();
};

const getData = () => {
  // 向后端请求数据，然后更新 allData.value 和 total.value
  // 示例：假设后端返回的数据是一个数组
  allData.value = [...res]; // 更新为实际的数据
  total.value = allData.value.length;
  updatePagedData();
};
// 关键函数，对数据进行虚拟分段
const updatePagedData = () => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  pagedData.value = allData.value.slice(startIndex, endIndex);
};
</script>
```





## 3. Vue 设置全局属性

1. `Provide` / `Inject`

```js
import { createApp } from "vue"

const app = createApp({})
app.provide(/* 注入名 */ 'message', /* 值 */ 'hello!')
```

应用范围内接收

```vue
<script setup>
import { inject } from "vue"

const message = inject("message")
</script>
```

2. `globalProperties`

```js
import { createApp } from "vue"

const app = createApp({})
app.config.globalProperties.myName = "globalName"
```

在任意组件模板中**直接使用**：

```vue
<template>
  <p>{{ myName }}</p>
</template>
```

在`<script setup>`中使用：

```js
import { getCurrentInstance } from "vue"
  
const { proxt } = getCurrentInstance()
console.log(proxy.message)
```



## 4. a-table 行点击事件

Ant Design Vue - 表格 `<a-table>` 组件绑定行点击事件（点击表格行事件）。

> Ant Design Vue customRow

```vue
<template>
  <a-table :customow="rowClick"></a-table>
</template>
<script setup>
function rowClick(record, index) {
  return {
    on: {
      click: () => {}   // single click
      dbclick: () => {} // double click
    }
  }
}
</script>
```



## 5. tooltip实现

使用 `@mousenter` 和 `@mouseleave` 事件

```vue
<template>
<div @mouseenter="showDetail" @mouseleave="hideDetail">
  <slot></slot>
</div>
</template>

<script setup>
import { reactive, ref } from "vue";
const hoverRef = ref(null);
// 展示完整详情
const showDetial = () => {
  let { x, y } = getMousePos();
  let targetBox = hoverRef.value;
  targetBox.style.top = `${y + 10}` + "px";
  targetBox.style.left = x + "px";
  hoverRef.value.style.opacity = "1";
};
const hideDetail = () => {
  hoverRef.value.style.opacity = "0";

};
// 获取鼠标的位置
const getMousePos = (event) => {
  let e = event || window.event;
  let scrollX = hoverRef.value.scrollLeft || document.body.scrollLeft;
  let scrollY = hoverRef.value.scrollTop || document.body.scrollTop;
  let x = e.pageX || e.clientX + scrollX;
  let y = e.pageY || e.clientY + scrollY;
  return { x, y };
};
const hoverSty = {
  position: 'absolute',
  color: 'white',
  background: '#454b58',
  borderRadius: '10%',
  boxShadow: '4px 4px 8px #1f232dff',
  padding: '4px 8px',
  opacity: '0'
}
</script>
```





## 6. Ant-design-vue darkmode

```js
// webpack.config.js
const { getThemeVariables } = require('ant-design/vue/dist/theme')

module.exports = {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
      options: { // [!code ++]
        lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。 // [!code ++]
          modifyVars: getThemeVariables({ // [!code ++]
            dark: true, // 开启暗黑模式 // [!code ++]
          }), // [!code ++]
          javascriptEnabled: true, // [!code ++]
       },
      },
    }]
  }]
}
```



## 7. router-link 样式修改

router-link默认样式为蓝色，它的背后是a标签，设置样式时推荐设置它的父元素下的a标签，然后设置样式。

比如：

```vue
<template>
  <div class="container">
    <router-link to="home">主页</router-link>  
  </div>
</template>
<style scoped>
.container > a {
  text-decoration: none;
  color: inherit;
}
</style>
```



## 8. a-table rowKey

ant design vue `<table>` 组件三种加 `rowKey` 的方式：

```vue
<!-- record的某个属性 -->
<a-table :rowKey="record => record.id"></a-table>

<!-- 索引 index -->
<a-table :rowKey="(record, index) => index"></a-table>

<!-- record的某个属性，这里的rowKey不需要冒号 -->
<a-table rowKey="id"></a-table>
```





## 9. Echarts 点击事件

Echarts 柱状图监听点击事件的实现方法。

```js
// 简单点击事件
chart.on('click', params => { // 对于没有数据的区域，点击无效
  console.log(params)
})

// 有/无数据部分的点击事件
chart.getZr().on('click', params => {
  let pointInPixel = [params.offsetX, params.offsetY]
  if (chart.containPixel('grid', pointInPixel)) {
    let xIndex = chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
  }
})
```

`getZr()` 方法可以监听到整个画布的点击事件，`xIndex` 是被点击的柱形的 index 。若要实现获取 id 的效果，则需要拿到 series 的数组，再通过 index 拿到对应的数据对象。



**移除事件**

echarts绑定点击事件后，如果未对事件进行清除再重置option，则会多次调用点击事件回调：

1. 第1次click，请求后台1次；
2. 第2次click，请求后台2次；
3. 第3次click，请求后台3次；

解决办法：
1. 使用 `off` 方法解除监听
2. 避免在回调函数中再次注册监听器
3. 使用一次性事件监听器（`once`）

```js
this.chart = echarts.init(document.getElementById('chartId'))
this.chart.clear()
this.chart.showLoading()
this.chart.setOption(option)
this.chart.hideLoading()
this.chart.resize()
this.chart.off('click')  // [!code ++]
this.chart.on('click', params => {
  // ...
})
```





## 10. 重置路由

后台管理系统当用户退出登录时，如果页面没有刷新，动态路由的配置依然存在。重置路由的方法：

```js {9,10}
import router from '@/router/index.js'

const whiteList = ['root', '/', 'login', '404']

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const {name} = route
    if (name && !whiteList.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}
```





## 11. resize 指令

```vue
<template>
	<div class="container">
    <div v-resize="handleSizeChange" ref="chartRef"></div>
  </div>
</template>
<script setup>
import {ref} from 'vue'
import {useCharts} from './useCharts.ts'

const chartRef = ref(null)
const width = ref(500)
useCharts(width, chartRef)
  
function handleSizeChange(size) {  // v-resize 指令实现
  width.value = size.width
}
</script>
```

v-resize 指令使用：

- 在`<script setup>` 中声明
- options API，在`directives`选项中注册
- 自定义全局指令，`app.directive('xxx', {})`中挂载

```ts
const map = new WeakMap()
const ob = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const handler = map.get(entry.target) // entry.target为元素本身(el)
    if (handler) {
      const { blockSize, inlineSize } = entry.borderBoxSize[0]
      handler({
        width: blockSize,
        height: inlineSize
      })
    }
  }
})

export default {
  mounted: (el, binding) => {
    // v-resize:content-box="xxx"  ----  binding.arg = 'content-box'
    ob.observe(el)
    map.set(el, binding.value)  // binding.value 为指令所绑定的值（回调函数）
  },
  unmounted: (el, binding) => {
    ob.unobserve(el)
		// map.delete(el) // 在dom被卸载时移除Map中的节点，或使用WeakMap
  }
}
```



## 12. Vue-simple-uploader

```vue
<template>
  <uploader
    :options="options"
    :fileStatus="fileStatusText"
    :autoStart="autoStart"
    @file-added="fileadded"
    @files-added="filesadded"
    @file-removed="fileremoved"
    @file-progress="fileProgress"
    @file-success="fileSuccess"
    @file-complete="fileComplete"
    ref="uploaderRef"
  >
  	<uploader-unsupport>
  		不支持HTML5 File API 时会显示。
  	</uploader-unsupport>
    <uploader-drop>
  		<p>拖动文件上传 或</p>
      <uploader-btn>选择文件</uploader-btn>
      <uploader :directory="true">选择文件夹</uploader>
  	</uploader-drop>
    <uploader-list>文件、文件夹列表</uploader-list>
  </uploader>
</template>

<script setup>
const fileStatusText =  {
  success: '成功',
  error: '失败',
  uploading: '上传中',
  paused: '暂停',
  waiting: '等待'
}
const options = {
  // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
  target: 'api/xx'
}
</script>
```



## 13. 声明全局组件/属性类型

### 1. 声明全局组件类型

定义全局组件：使用 `GlobalComponents` 类型接口声明类型。该接口是Volar专门为了解决全局组件类型而新增的类型接口：

```ts [components.d.ts]
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    DemoButton: typeof import('./Button/index.vue')
    UPopView: typeof import('../lib/unittec-component.esm')['UPopView']
  }
}

export {}
```

或者扩充模块 `vue` （element-plus库采用方式）：

```ts
// global.d.ts
import Button from './Button/index.vue';
declare module 'vue' {
  export interface GlobalComponents {
    DemoButton: typeof Button;
  }
}

export {}
```



### 2. 声明全局属性类型

某些插件会通过 [`app.config.globalProperties`](https://cn.vuejs.org/api/application.html#app-config-globalproperties) 为所有组件都安装全局可用的属性。比如，`this.$http` 用于请求。Vue 暴露了一个被设计为可以通过 TypeScript 模块扩展来扩展的 `ComponentCustomProperties` 接口：

```ts [global.d.ts]
declare module 'vue' {
  interface ComponentCustomProperties {
    $http: import('axios').AxiosStatic
  }
}

export {} // 被识别为 TS模块，正常工作；若没有顶级 `import` 或 `export`，则它将覆盖原始类型
```

在 Vue2 版本中，通过对 `Vue.prototype` 添加的全局属性，属性声明方式为：
```ts [global.d.ts]
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    http: import('axios').AxiosStatic
    moment: import('moment').Moment
    // ...
  }
}
```

无论是全局组件还是全局属性的类型扩充，`*.d.ts` 都要被 `tsconfig.json` includes：
```json
{
  "include": ["types/*.d.ts"]
}
```





## 14. JSX/TSX 支持

Vite 环境需安装 `@vitejs/plugin-vue-jsx`

```bash
npm i @vitejs/plugin-vue @vitejs/plugin-vue-jsx -D
```

```ts
// vite.config.ts
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ]
})
```





## 15. 自定义 Vue3 hooks

**1）更改网站 title**

```typescript [useTitle.ts]
import { reef, watchEffect, onUnmounted } from 'vue'

export function useTitle(title: string, restoreOnUnMount = true) {
  const cache = document.title
  const titleRef = ref(title)
  
  watchEffect(() => {
    document.title = titleRef.value
  })
  
  if (restoreOnUnMount) {
    onUnmounted(() => {
      document.title = cache
    })
  }
  
  const setTitle = (title: string) => {
    titleRef.value = title
  }
  return setTitle
}
```

组件中使用：

```ts
import {useTitle} from './xxx'

const setTitle = useTitle('custom title')
```



**2）分页器**

```ts [usePagination.ts]
import { reactive } from 'vue'

export function usePagination(
	total: number = 0,
  current: number = 1,
  pagiSize: number = 10
  pageSizeOptions: string[] = ["10", "20", "30", "40"],
  const pagination = reactive({
    total,
    current,
    pageSize,
    pageSizeOptions,
    showTotal: () => `共${pagination.total}条`,
    showSizeChanger: true,
    onChange(page, pageSize) {
      pagination.current = page;
      pagination.pageSize = pageSize;
    },
  })
  return pagination
)

// 使用
const pagination = usePagination()
```





## 16. 模块化 Echarts

:::code-group

```js [echarts.js]
import * as echarts from 'echarts/core' // echarts 核心模块 
import { BarChart, PieChart, LineChart } from 'echarts/charts' // 图标（按需导入）
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components' // 提示框，标题，直角坐标系，数据集，内置数据转换器组件...
import { LabelLayout, UniversalTransition } from 'echarts/features'  // // 标签自动布局、全局过渡动画
import { CanvasRenderer } from 'echarts/renderers'  // Canvas 渲染器  | SVGRenderer

echarts.use([
  BarChart,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

export default echarts
```



```vue [Charts.vue]
<template>
  <div class="pie-container">
    <div id="pie" ref="line"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import echarts from '@/utils/echarts'

const pie = ref(null)
let pieChart

function initPie() {
  let pieOption = {/* echarts option */}
  pieChart.setOption(pieOption, true)
}

async function SomeDataRequest() {
  await //...
  initPie()
}

onMounted(() => {
  pieChart = echarts.init(pie.value)
  window.addEventListener('resize', pieChart.resize())
})
onUnmounted(() => {
  window.removeEventListener("resize", pieChart.resize())
})
</script>
```



:::

当`option`发生更新时，调用`setOption()`的优化方式：

```js
export default {
  watch: {
    handler(val) {
      this.$nextTick(() => {
        let dom = document.getElementById(this.id)
        if (!dom) return
        let myChart = this.$echarts.getInstanceByDom(dom)
        if (!myChart) {
          myChart = this.$echarts.init(dom)
        } else {
          myChart.dispose()
          myChart = this.$echarts.init(dom)
        }
        myChart && myChart.resize()
        myChart.clear()
        myChart.setOption(this.option)
      })
    },
    deep: true,
    immediate: true
  }
}
```



## 17. 获取组件实例方法
期望使用 `ref()` 来获取组件实例的同时时，获得其组件实例的属性。
**封装 `useCompRef`**

```ts [useCompRef.ts]
import { ref } from 'vue'

export function useCompRef<T extends abstract new (...args: any) => any>(
  _comp: T
) {
  return ref<InstanceType<T>>()
}
```

**组件中使用**
```vue
<template>
  <Form ref="formRef"></Form>
</template>

<script lang="ts" setup>
import { Form } from 'ant-design-vue'
import { useCompRef } from '@utils/index'

const formRef = useCompRef(Form)
</script>
```

## 18. 模块自动导入
`unplugin-auto-import` 插件可用于模块的自动导入，支持 Vite, Webpack, Rspack, Rollup and esbuild.
通常情况下，我们在Vue 或者 React 开发时，需要导入框架的各个方法：
```ts
import {computed, ref} from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
```

在配置了以上插件后，可以不显示的导入 `computed`、`ref` 等方法，在运行时，插件会自动导入。
以 Vite 为例，配置方法如下：
1. 安装插件
```sh
npm i unplugin-auto-import -D
```
2. 使用插件
```ts [vite.config.ts]
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({
      import: ['vue', 'vue-router', 'pinia'],
      dirs: ['./src/api'], // 自定义导入路径
      dts: './types/auto-imports.d.ts' // 导入模块的全局类型声明文件，需添加到`tsconfig.json`中
    }),
  ],
})
```
3. ESLint 配置
   1. Enable `eslintrc.enabled`
   ```ts [vite.config.ts]
    AutoImport({
      eslintrc: {
        enabled: true
      }
    })
   ```

   2. Update `eslintrc`
    ```ts [.eslintrc.js]
    module.exports = {
      extends: ['./.eslintrc-auto-import.json']
    }
    ```



## 19. Vue JSX 组件及 CSS 方案

以`<Popup>`(Modal) 组件为例，在 Vue 中，JSX组件中没有直接的方式来应用 scoped 样式，但是可以使用 CSS 模块(CSS Modules)或 BEM(Block, Element, Modifier) 命名规范来解决样式冲突问题。
原始组件及样式：
:::code-group
```jsx
import {ref, defineComponent, Transition} from 'vue';
import {CloseOutlined} from '@ant-design/icons-vue';
import './Popup.less';

const Popup = defineComponent({
  name: 'Popup',
  props: {
    title: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 500
    },
    closable: {
      type: Boolean,
      default: true
    },
    footer: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确认'
    }
  },
  emits: ['cancel', 'confirm'],
  setup(props, {emit, slots, expose}) {
    const visible = ref(false);

    const show = () => {
      visible.value = true;
    };
    const close = () => {
      visible.value = false;
    };

    expose({show, close});

    return () => (
      <div>
        {slots.default?.()}
        <Transition name="popup__fade">
          {visible.value && (
            <div class="popup__container">
              <div class="popup__content-wrapper" style={{width: `${props.width}px`}}>
                {props.title.length > 0 && (
                  <div class="popup__header">
                    <div class="popup__title">{props.title}</div>
                    {props.closable && <CloseOutlined onClick={close} />}
                  </div>
                )}
                <div class="popup__content">
                  {slots.content?.()}
                </div>
                {props.footer && (
                  <div class="popup__footer">
                    <div class="popup__cancel" onClick={() => emit('cancel')}>{props.cancelText}</div>
                    <div class="popup__confirm" onClick={() => emit('confirm')}>{props.confirmText}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Transition>
      </div>
    );
  }
});

export default Popup;
```
```less
.container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.67) 100%
  );
  .content-wrapper {
    background: url("@/assets/images/data-board/popup.png");
    background-size: cover;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate3d(-50%, -50%, 0);
    border-radius: 4px;
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        width: 100px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        border-bottom: 1px solid #91b0bd;
        padding-bottom: 10px;
        position: relative;
        &:after {
          width: 30px;
          height: 3px;
          position: absolute;
          background: #4a84d2;
          bottom: -2px;
          left: 0;
          content: "";
        }
      }
    }
    .content {
      min-height: 100px;
    }
    .footer {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 12;
      display: flex;
      justify-content: center;
      column-gap: 80px;
      font-size: 16px;
      color: #fff;
      font-family: PingFangSC;
      div {
        width: 112px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
      }
      .confirm {
        background: url('@/assets/images/data-board/output-button.png') no-repeat;
      }
      .cancel {
        background: url('@/assets/images/data-board/cancel.png') no-repeat;
      }
    }
  }
}

.fade-enter-active {
  animation: to-show 0.3s ease;
}
.fade-leave-active {
  animation: to-hide 0.3s ease;
}
@keyframes to-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes to-hide {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```
:::

### 1. CSS Modules
CSS Modules 可以为 CSS 类生成唯一的标识符，避免样式冲突。确保构建工具配置支持 CSS Modules，以 Vue CLI(webpack) 为例，可以在 `vue.config.js` 中配置：
```js [vue.config.js]
module.exports = {
  css: {
    loaderOptions: {
      css: {
        modules: {
          localIdentName: '[name]__[local]___[hash:base64:5]',
        }
      }
    }
  }
}
```
**组件实现**
假设 CSS 文件名为`Popup.module.less`：

```jsx {Popup.jsx}
import styles from './Popup.module.less'

export default defineComponent({
  //...
  setup(props, { emit, slots, expose }) {
    //...
    return () => (
      <div>
        {slots.default?.()}
        <Transition
          enterActiveClass={UPop['fade-enter-active']}
          leaveActiveClass={UPop['fade-leave-active']}
          enterFromClass={UPop['fade-enter-from']}
          leaveToClass={UPop['fade-leave-to']}
        >
          {visible.value && (
            <div class={styles.container}>
              {/** ... */}
            </div>
          )}
        </Transition>
      </div>
    )
  }
})
```

### 2. 使用 BEM 命名规范

如果不想配置CSS Modules，可以通过 BEM 命名规范来减少样式冲突。BEM 使用一组命名约定来确保样式的唯一性。
```less Popup.less
.u-popup__container {
  position: fixed;
  /* 其他样式 */
}
.u-popup__content-wrapper {
  /* 其他样式 */
}
/* 其他样式 */
```



## 20. 自定义指令

### 1. vDrag 元素拖拽

`vDrag`：指令作用元素或其父元素的 `position` CSS 属性值为 `absolute`时，元素可拖拽。

**相关功能：**
1. 绝对定位的父元素：作用于父元素可使整个元素可拖拽，作用于子元素，在子元素范围内可拽拖整个元素；
2. 指令作用的元素，可设置 `drag-min-top` attribute 距离顶部的最小拽拖距离；
3. 当拽拖移动的距离超过 `20px` 时，对元素设置`dragged` attribute，可针对该属性设置对应样式；
4. 当父元素存在类名 'u-popup__content-wrapper-mini' 和 'u-popup__content-wrapper-fullscreen' 其中的一个时，无法拽拖

```js [drag.js]
import {onUnmounted} from 'vue';

const vDrag = {
  /**
   * @param {Element} el
   */
  mounted(el) {
    let oDiv = el;
    let minTop = oDiv.getAttribute('drag-min-top');
    const ifMoveSizeArea  = 20;

    while (window.getComputedStyle(oDiv).position !== 'absolute' && oDiv !== document.body) {
      oDiv = oDiv.parentElement;
    }
    minTop = Number(minTop) + Number(oDiv.clientHeight / 2); // 应对绝对定位时的transform: translateY(-50%);

    function handleReturn(target) {
      let classArray = Array.from(target.classList);
      let targetClasses = ['u-popup__content-wrapper-mini', 'u-popup__content-wrapper-fullscreen'];
      if (classArray.some(className => targetClasses.includes(className))) return true;
    }

    const onMouseDown = (e) => {
      if (handleReturn(oDiv)) return;

      let target = oDiv;
      document.onselectstart = () => false;

      if (!target.getAttribute('init_x')) {
        target.setAttribute('init_x', target.offsetLeft);
        target.setAttribute('init_y', target.offsetTop);
      }

      const initX = parseInt(target.getAttribute('init_x'));
      const initY = parseInt(target.getAttribute('init_y'));

      const disX = e.clientX - target.offsetLeft;
      const disY = e.clientY - target.offsetTop;

      const onMouseMove = (e) => {
        if (handleReturn(oDiv)) return;

        // 计算移动的距离
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        // 计算移动当前元素的位置，并且给该元素样式中的left和top值赋值
        target.style.left = `${l}px`;
        target.style.top = `${t < minTop ? minTop : t}px`;

        if (Math.abs(l - initX) > ifMoveSizeArea || Math.abs(t - initY) > ifMoveSizeArea) {
          target.setAttribute('dragged', '');
        } else {
          target.removeAttribute('dragged');
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.onselectstart = null;
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      return false;
    };

    oDiv.addEventListener('mousedown', onMouseDown);
  },
  unmounted(el) {}
};

export default vDrag;
```

**使用方式一：组件内使用**

```vue
<template>
  <div v-drag>
    <!-- -->
  </div>
</template>

<script>
import vDrag from '@/utils/drag.js'
</script>
```



**使用方式二：全局指令挂载**

```js [main.js]
import {createApp} from 'vue'
import App from './App.vue'
import vDrag from '@/utils/drag.js'

const app = createApp(App)

app.directive('drag', vDrag)

app.mount("#app")
```



### 2. vFocus 光标聚焦

::: code-group

```ts [vFocus.ts]
const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus()
}

export default vFocus
```

```ts [main.ts]
import vFocus from './directives/vFocus'

// ...
app.directive('focus', vFocus)
```

```html
<input vFocus />
```



:::



**补充：Array.prototype.some()**
`some()` 方法测试数组中是否至少有一个元素通过了由提供的函数实现的测试。如果在数组中找到一个元素使得提供的函数返回 true，则返回 true；否则返回 false。它不会修改数组。
举例一：判断数组 `numList: number[]` 所有元素是否都大于0

```js
const array1 = [1,2,3,4,5]
const array2 = [0,1,2,3,4]

const aboveZero = num => num > 0

array1.some(aboveZero)  // true
array2.some(aboveZero)  // false
```


## 21. `<a-table>` 可编辑行

通过创建 `reactive` 对象记录所点击编辑的行，通过判断该对象是否存在指定表格行实现切换展示与编辑。

```vue
<template>
  <a-table>
    <template #bodyCell="{text, record, column}">
      <template v-if="column.dataIndex === 'currentTitle'">
        <div>
          <a-input v-if="editableData[record.id]" v-model:value="editableData[record.id]['currentTitle']" style="margin: -5px 0;" />
          <template v-else>{{ text }}</template>
        </div>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <span v-if="editableData[record.id]">
          <a @click="handleSaveTitle(record)">保存</a>
          <a-popconfirm title="取消保存？" @confirm="handleTitleCancel(record)">
            <a style="margin-left: 20px;">取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a @click="handleEditTitle(record)">修改</a>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script>
const editableData = reactive({});
const handleEditTitle = (record) => {
  const {id} = record;
  editableData[id] = {...customTitles.value.filter(item => item.id === id)[0]};
};
const handleSaveTitle = (record) => {
  const {id} = record;
  Object.assign(customTitles.value.filter(item => item.id === id)[0], editableData[id]);
  delete editableData[id];
};
const handleTitleCancel = (record) => {
  const {id} = record;
  delete editableData[id];
};
</script>
```



## 22. 动态组件
使用 Vue 的 `<component>` 元素和 `is` attribute 实现：
```vue [App.vue]
<template>
  <div class="demo">
    <button
      v-for="(_, tab) in tabs"
      :key="tab"
      :class="['tab-button', {active: currentTab === tab}]"
      @click="currentTab = tab"
    >
      {{ tab }}
    </button>
    <component :is="tabs[currentTab]" class="tab"></component>
  </div>
</template>
<script setup>
import Home from './Home.vue'
import Posts from './Posts.vue'
import Archive from './Archive.vue'
import {ref} from 'vue'

const currentTab = ref('Home')
const tabs = {Home, Posts, Archive}
</script>
```



## 23.事件叠加 Hook

```ts
import {ref} from 'vue'

export const useBasicComp = () => {
  const compInstance = ref<any>()
  const register = (instance: any) => {
    compInstance.value = instance
  }
  
  const changeShow = () => {
    compInstance.value?.changeShow() // custom
  }
  
  return [register, {changeShow}]
}
```

**在 JavaScript 中访问透传 Attributes：**

在`<script setup>` 中使用 `useAttrs()` 来访问一个组件的所有透传 attribute：

```vue
<script setup>
import {useAttrs} from 'vue'
  
const attrs = useAttrs()
</script>
```



## 24. optionsAPI this指向

箭头函数和普通函数在处理 `this` 绑定时的不同。在使用防抖函数对组件进行包裹时，两种函数类型在作为参数传递时，this的指向不同：

```js
// 防抖函数
export function debounce(fn, delay = 300) {
  let timeout = null;
  return function (...args) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    } else {
      // 对第一次输入立即执行
      fn.apply(this, args);
    }
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

```js
export default {
  methods: {
    testThis1: debounce(() => {
      console.log(this) // undefined
    }),
    testThis2: debounce(function() {
      console.log(this)  // VueInstance
    })
  }
}
```

**箭头函数的 `this`**

- 箭头函数不会创建自己的 `this`，而是从它定义时的上下文中继承 `this`。
- 在 Vue 的 `Options API` 中，如果你使用箭头函数，`this` 将被固定为定义时的上下文。因此，`this` 在 `testThis1` 中是 `undefined`，因为箭头函数没有自己的 `this`，而且在当前上下文中（即在 `debounce` 函数内），`this` 是未定义的。

**普通函数的 `this`**

- 普通函数的 `this` 是动态的，它取决于函数的调用方式。
- 在 `testThis2` 中使用普通函数时，`this` 的值取决于调用时的上下文。在 Vue 中，由于 `testThis2` 是作为 Vue 实例的一个方法被调用的，因此 `this` 指向 Vue 实例。



## 25. 动态路由

**首先在`Login`组件中，处理登录相关逻辑，并将登录信息存储到Vuex中：**

```vue [Login.vue]
<script setup>
const onLogin = async () => {
  await formRef.value.validateFields();
  logining.value = true;
  store.dispatch("user/Login", formState).then((info) => {
    if (info) {
      errMsg.value = info;
      isFalse.value = true;
      throw info
    } else {
      let menus = store.state.user.menus;
      if (!menus || menus.length === 0) {
        message.error("当前用户无角色权限，请联系管理员修改！");
      } else {
        store.dispatch("user/loadRoutes").then(() => {
          router.push(`${store.state.user.menus[0].url}`);
        });
      }
    }
  }).catch((error) => {
    throw error
  }).finally(() => {
    logining.value = false;
  })
}
</script>
```

**Vuex 登录相关处理**

::: code-group

```js [index.js]
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import user from "./modules/user";

const store = createStore({
  state: () => ({}),
  mutations: {},
  actions: {},
  modules: {
    user,
  },
  plugins: [createPersistedState()],
});

store.dispatch("user/loadRoutes");  // 刷新不丢失路由报404关键

export default store;
```

```js [user.js]
import axios from "@/utils/axios";
import router from "@/router";
import { mapMenus } from "@/utils/mapMenus";
import { resetRouter } from "@/utils/resetRouter";
import { channel } from "@/utils/common";

const user = {
  namespaced: true,  // 开启模块命名空间  store.state.user.xxx
  state: () => ({
    userInfo: {},
    menus: [],
    token: undefined,
  }),
  mutations: {
    loginInfo(state, data) {
      const { token, menus, userInfo } = data;
      state.menus = menus;
      state.token = token;
      state.userInfo = userInfo;
    },
    logoutRemove(state) {
      state.userInfo = {};
      state.menus = [];
      state.token = undefined;
      resetRouter();
      channel.postMessage("logout")
      localStorage.clear();
    },
  },
  actions: {
    Login({ commit }, formState) {
      const { username, password } = formState;
      return new Promise((resolve, reject) => {
        axios.post("/login", { username, password }).then((res) => {
          if (res.success) {
            let { token, userInfo, menus } = res.data;
            axios.defaults.headers["Authorization"] = token;
            commit("loginInfo", { token, userInfo, menus });
            channel.postMessage("login")
            resolve();
          } else {
            resolve(res.errMsg);
          }
        })
        .catch((error) => {
          reject(error);
        });
      });
    },
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit("logoutRemove");
        resolve(true);
      });
    },
    async loadRoutes({ state, commit }) {
      const userMenus = state.menus;
      if (!userMenus || userMenus.length === 0) return;
      const routes = mapMenus(userMenus);
      routes.forEach((route) => router.addRoute("/", route));
    },
  },
};

export default user;
```



:::

**相关功能函数如下：**

**1. 重置路由**

```js [resetRouter.js]
import router from "@/router/index";

const whiteList = ["root", "/", "login", "404"];

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const {name} = route;
    if (name && !whiteList.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}
```

**2. 遍历菜单生成路由**

```ts [mapMenus.ts]
interface MenuItem {
  id: number
  parentId: number
  name: string
  url: string
  type: string
  icon: string|null
  orderId: number
  component: string
  children: MenuItem[]
}

export function mapMenus(userMenus: MenuItem[]) {
  return userMenus.map(item => {
    const {url, component, children} = item
    const route = {
      path: url,
      component: () => import(`@/pages${component}.vue`),
      children: [],
      name: url.split("/")[1]
    }
    if (children && children.length > 0) {
      route.children = mapMenus(children)
    }
    return route
  })
}
```

**3. BroadcastChannel**

```js
export const channel = new BroadcastChannel("my_channel")
```



在完成登录获取菜单遍历生成路由后，此时刷新页面，相关的路由信息会被重置（404），需要在项目重新加载时执行相关菜单处理逻辑。在导出store之前执行`store.dispatch("user/loadRoutes")`，这样在刷新页面时，`main.js`在执行`use`时会重新加载路由：

```js [main.js]
import store from './store'

const app = createApp(App);
app.use(store).use(router).use(Antd).mount("#app");
```



**导航守卫**

在`main.js`中引入该文件(`permission.js`)进行导航守卫，并加载nProgress动画：

```js [permission.js]
import router from "@/router";
import store from "@/store";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

nProgress.configure({ showSpinner: false });

const whiteList = ["/login"];

router.beforeEach((to, from, next) => {
  nProgress.start();
  let token = store.state.user.token;
  let menus = store.state.user.menus;

  if (token) {
    // has token
    if (to.path === "/login") {
      next({ path: `${menus[0].url}` });
    } else {
      next();
    }
  } else {
    // no token
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
    }
  }
});

router.afterEach(() => {
  nProgress.done();
});
```





**Header组件退出登录**

Header组件进行退出登录操作时，需要清除用户信息和路由菜单缓存，并重定向到login页面，此时如果有多Tab页同时登录的情况，在A页面退出登录后，B页面仍可进行路由切换。处理方法有很多，根据各自的项目需求，我采用`BroadcastChannel`来监听登录和登出，在监听的回调函数中，使用`location.reload`来重载页面（清除缓存、路由菜单）。

```js
// 修改密码
const editPwd = async () => {
  await formRef.value.validateFields();
  try {
    let res = await editPwdAPI(password)
    if (res.success) {
      store.dispatch('user/LogOut').then(res => {
        router.push('/login')
      })
    }
  }
}

// 登出
const logout = () => {
  Modal.confirm({
    title: "系统提示",
    icon: createVNode(ExclamationCircleOutlined),
    content: "确定注销并退出系统？",
    okText: "确定",
    okType: "primary",
    cancelText: "取消",
    closable: true,
    maskClosable: true,
    async onOk() {
      store.dispatch("user/LogOut").then((res) => {
        router.push("/login");
      });
    },
    onCancel() {},
  });
};
```

**App组件监听退出**

```js
import { channel } from "@/utils/common";

channel.addEventListener("message", e => channelEvent(e))
/**
 * @param {MessageEvent<any>} e 
 */
function channelEvent(e) {
  const data = e.data;
  let actions = ["login", "logout"];
  if (actions.includes(data)) {
    location.reload();
  }
}
```



## 26. 全局 loading

创建一个全局变量`loading`，通过该变量设置页面loading状态

```ts
import {ref, computed} from 'vue'

const _loadingCount = ref(0)

export const loading = computed({
  get() {
    return _loadingCount.value > 0
  },
  set(val) {
    _loadingCount.value += val ? 1 : -1
    _loadingCount.value = Math.max(0, _loadingCount.value)
  }
})
```

在公共请求方法中，根据请求改变loading状态

```ts
import {loading} from '@/loading'

export async function request(url:string, ...params: any[]) {
  try {
    loading.value = true
    return await yourRequestFn(url)
  } finally {
    loading.value = false
  }
}
```

















