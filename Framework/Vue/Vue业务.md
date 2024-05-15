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
<a-table :rowKey="record => record.id" />

<!-- 索引 index -->
<a-table :rowKey="(record, index) => index" />

<!-- record的某个属性，这里的rowKey不需要冒号 -->
<a-table rowKey="id" />
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

```js {7-10}
this.chart = echarts.init(document.getElementById('chartId'))
this.chart.clear()
this.chart.showLoading()
this.chart.setOption(option)
this.chart.hideLoading()
this.chart.resize()
this.chart.off('click')
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

```ts
// components.d.ts
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    DemoButton: typeof import('./Button/index.vue')
    UPopView: typeof import('../lib/unittec-component.esm')['UPopView']
  }
}

export {}
```

或者扩充模块 `vue` (element-plus库采用方式）：

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