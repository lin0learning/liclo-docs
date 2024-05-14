# Vue docs

## `<script setup>`

- 自定义指令
- defineModel()
- defineExpose()
- defineOptions()
- defineSlots()
- useSlots()、useAttrs()
- 泛型



**自定义指令**

一个自定义指令由一个包含类似组件生命周期钩子的对象来定义。钩子函数会接收到指令所绑定元素作为其参数。在使用 `<script setup>`的情况下：
```vue
<template>
  <input v-focus />
  <h1 v-my-directive>This is a Heading</h1>
</template>

<script setup>
const vFocus = {
  mounted: (el) => el.focus()
}
const vMyDirective = {
  beforeMount: (el) => {
    // 在元素上做些操作
  }
}
</script>
```



在没有使用 `<script setup>`的情况下，自定义指令需要通过`directives`选项注册：

```js
export default {
  setup() {},
  directives: {
    focus: {
      /* ... */
    }
  }
}
```



全局注册自定义指令：

```js
const app = createApp({})

app.directive('focus', {
  /* ... */
})
```



实践：Vue自定义指令实现light、dark主题切换。





**泛型**

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  seleccted: T
}>()
</script>
```













## TS 与 组合式 API 类型声明

>[TS 与 组合式 API](https://cn.vuejs.org/guide/typescript/composition-api.html)

### 1. Props

使用`<script setup>`的<font color="red">运行时声明</font>：

```vue
<script setup>
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})
</script>
```

通过泛型参数声明的<font color="red">基于类型的声明</font>：

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}
defineProps<Props>()
</script>
```

当使用基于类型的声明时，我们失去了为 props 声明默认值的能力。这可以通过 `withDefaults` 编译器宏解决：

```typescript
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

针对类型的 props/emits 声明

```vue
<!-- 父组件 -->
<template>
	<child :name="['hello']"></child>
</template>

<!-- 子组件 -->
<script lang='ts' setup>
// 泛型字面量
  defineProps<{
    name: string[]
  }>()
</script>

<!-- Vue3.3 对defineProps的改进，新增泛型支持 需要再script标签上加generic="T" -->
<script generic='T' lang='ts' setup>
  defineProps<{
    name: T[]
  }>()
</script>
```



### 2. emits

可通过<font color="red">运行时声明</font>或者是<font color="red">类型声明</font>：

```vue
<script setup lang="ts">
// 运行时
const emits = defineEmits(['change', 'update'])

// 基于选项
const emits = defineEmits({
  change: (id: number) => {},
  update: (value: string) => {}
})

// 基于类型
const emits = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
  
// Vue3.3+
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

**泛型**

可以使用 `<script>` 标签上的 `generic` 属性声明泛型类型参数：

```vue
<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  selected: T
}>()
</script>
```







### 3. ref()

```typescript
import { ref } from 'vue'
import type { Ref } from 'vue'

// Ref
const year: Ref<string | number> = ref('2020')
// 泛型参数
const year = ref<string | number>('2020')
```



### 4. reactive()

显示标注`reactive`变量的类型，可以使用接口：

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

<div style="border: 1px solid #42b883; border-radius: 5px; padding: 20px;background-color: rgba(36, 36, 36, .9); color: #fff;" >不推荐使用<code>reactive()</code>的泛型参数，因为处理了深层次 ref 解包的返回值与泛型参数的类型不同</div>



### 5. computed()

1. 从返回值推导出类型，无需声明
2. 使用泛型参数

```typescript
const double = computed<number>(() => {})
```



### 6. 事件处理函数

类型声明 + 类型断言

```vue
<template>
  <input type='text' @change='handleChange' />
</template>

<script setup lang='ts'>
function handleChange(e: Event) {
  console.log((e.target as HTMLInputElement).value)
}
</script>

```



### 7. provide / inject

provide 和 inject 通常会在不同的组件中运行。Vue 提供了一个 `InjectionKey` 接口，它是一个继承自 `Symbol` 的泛型类型，可以用来在提供者和消费者之间<text style="color: red;">同步注入值的类型</text>：

```typescript
import {provide, inject} from 'vue'
import type {InjectionKey} from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'the provide string')

const foo = inject(key)
```



### 8. 模板引用（DOM）

```vue
<template>
  <input ref="el" />
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue'

const el = ref<HMTLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>
```



### 9. 组件模板引用

举例，一个 `MyModal` 子组件，它定义并向外暴露了打开模态框的方法：

```vue {6,8}
<!-- MyModal.vue -->
<script setup lang='ts'>
import {ref} from 'vue'
  
const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({ open })
</script>
```

为了获取 `MyModal` 的类型，我们首先需要通过 `typeof` 得到其类型，再使用 Typescript 内置的 `InstanceType` 工具类型来获取其实例类型：

```vue
<!-- App.vue -->
<script setup lang='ts'>
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)  // [!code focus:4]
const openModal = () => {
  modal.value?.open()
}
  
</script>
```



## API

### defineExpose

向外暴露的时候变量会自动解包，比如下面子组件的 `name:Ref<string>` 暴露到父组件的时候自动变成了`name:string`

```vue
<script setup>
import {ref} from 'ref'
  
const name = ref('hello')  // Ref<string>
defineExpose({
  name  // string
})
</script>
```





### defineModel()

> 从 Vue 3.4 开始，组件上使用以实现双向绑定的推荐实现方式是使用 `defineModel()` 宏。

子组件使用：

```vue
<!-- Child.vue  -->
<template>
	<div>the v-model value: {{ model }} </div>
</template>

<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>
```

父组件绑定：

```vue
<!-- Parent.vue -->
<Child v-model="count" />
```

`defineModel()` 返回的值是一个 ref。它可以像其他 ref 一样被访问以及修改，不过它能起到在父组件和当前变量之间的双向绑定的作用：

- 它的 `.value` 和父组件的 `v-model` 的值同步；
- 当它被子组件变更了，会触发`update:modelValue`事件，使得父组件绑定的值一起更新。

**底层机制**

`defineModel` 是一个便利宏。 编译器将其展开为以下内容：

- 一个名为 `modelValue` 的 prop，本地 ref 的值与其同步；
- 一个名为 `update:modelValue` 的事件，当本地 ref 的值发生变更时触发。

Vue 3.4 版本之前的实现：

```vue
<template>
  <input :value="props.modelValue" @input="emit('update:modelValue', $event.target.value)" />
</template>

<script setup lang='ts'>
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])
</script>
```

```js
const model = defineModel({ required: true })

const model = defineModel({ default: 0 })
```





### defineSlots()

> Vue 3.3+

这个宏可以用于为 IDE 提供插槽名称和 props 类型检查的类型提示。

```vue
<script setup lang='ts'>
const slot = defineSlots<{
  default(props: {msg: string }): any
}>()
</script>
```





### defineExpose()

通过`defineExpose`编译器宏来显示指定在`<script setup>`组件中要暴露出去的属性：

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

defineExpose({
  a,
  b
})
</script>
```

当父组件通过模板引用(ref)的方式获取到当前组件的实例，获取到的实例会像这样 `{ a: number, b: number }` (ref 会和在普通实例中一样被自动解包)





### defineComponent()

vue3中，新增了 defineComponent ，它并没有实现任何的逻辑，只是把接收的 Object 直接返回，它的存在是完全让传入的整个对象获得对应的类型，并且为 TypeScript 服务。

```vue
<script>
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import { defineComponent } from 'vue

export default defineComponent({
  components: { SmileOutlined, DownOutlined }
  setup() {
	  return {}
  }
})
</script>
```





### defineOptions

> Vue3.3+

这个宏可以用来直接在 `<script setup>` 中声明组件选项（<font color="red">添加与 setup 平级的属性</font>），而不必使用单独的 `<script>` 块。常用于定义组件的 `name` 或其他自定义属性（在component实例中获取）。

```vue
<script setup>
defineOptions({
  name: 'Table',
  inheritAttrs: false
})
</script>
```

在Vue2-Options API中的体现：

```vue
<script>
import CarInfo from './CarInfo'
export default {
  name: 'AlarmForCarTemplate',
  components: {CarInfo},
  props: {}
}
</script>
```







### mutations/mapMutations

```js
// index.js (store)
import {createStore} from 'vuex'

const store = createStore({
  state() {
    return {
      name: 'hhh',
      age: 20
    }
  },
  mutations: {
    changeName(state, params) {
      state.name = params.name
    },
    changeAge(state, params) {
      state.age = params.age
    }
  }
})
export default store
```

写法一：Vue3 options API

```vue
<script>
import { mapMutations } from 'vuex'

methods: {
    ...mapMutations(["changeName"])
}
</script>
```

写法二：Vue3 composition API

```vue
<script setup>
import store from "../../store/";
    
store.commit('setUserObj', res.user)
</script>
```





### v-bind

简写形式：`:`

```html
<img v-bind:src="imageSrc" />
```

**CSS 绑定变量**

还可以在`<style>`标签中使用`v-bind`绑定css属性值：

```vue
<style>
  .active {
    color: v-bind("props.color")
  }
</style>
```

**传入多个参数的简写形式**

将一个对象的所有 property 都作为 prop 传入， 可以使用不带参数的 `v-bind`（取代 `v-bind:prop-name`）。例如，对于一个给定的对象 `post`：

```js
let post =  {
  id: 1,
  title: "Vue Title"
}
```

```vue
<blog-post v-bind="post"></blog-post>
<!-- 等价于↓ -->
<blog-post :id="post.id" :title="post.title"></blog-post>
```

**绑定方法并传参**

以`el-switch`组件为例：

```vue
<template>
  <el-table>
  	<el-table-column #default="{row, column, $index}">
      <!-- 方式一 -->
      <el-switch :before-change="beforeChange.bind(obj, row)" />
      <!-- 方式二 -->
      <el-switch :before-change="() => beforeChange.bind(row)" />
  	</el-table-column>
  </el-table>
</template>
<script setup lang="ts">
import {ref} from 'vue'
const obj = ref({})
const beforeChange: Promise<boolean> = async (row) => {
  // ...
}
</script>
```

该组件的`before-change` Attribute类型为`boolean` / `Function`. (`() => Promise<boolean> `)，部分源代码如下：

```vue
<script lang="ts">
import type {PropType} from 'vue' 

const definePropType = <T>(val: any): PropType<T> => val

const props = defineProps({
  /*
  * @type { Promise<boolean> | boolean } beforeChange
  */
  beforeChange: {
    type: definePropType<() => Promise<boolean> | boolean>(Function),
  }
})
const switchValue = () => {
  const { beforeChange } = props
  if (!beforeChange) {
    handleChange()
    return
  }
  const shouldChange = beforeChange()
  if (isPromise(shouldChange)) {
    shouldChange.then(res => {
      if (res) {
        handleChange()
      }
    })
  } else if (shouldChange) { // true
    handleChange()
  }
}
</script>
```

**绑定方法**

```vue
<!-- 父组件 -->
<template>
	<ChildComponent :customMethod="handleCustomMethod" />
</template>

<script setup>
const handleCustomMethod = (param) => {}
</script>

<!-- 子组件 -->
<template>
	<button @click="invokeCustomMethod">调用自定义方法</button>
</template>
<script setup>
const props = defineProps({
  customMethod: {
    type: Function,
    required: true
  }
})
const invokeCustomMethod = () => {
  props.customMethod("xxx")
}
</script>
```













### v-model

**表单输入绑定**

```vue
<input v-model="text" />
```

等价于：

```vue
<input :value="text" @input="e => text = e.target.value" />
```

**v-model 原始形态**

```vue
<template>
	<input :value="text" @input='handleUpdate' />
</template>
<script setup>
import {ref} from 'vue'
const text = ref('')
const handleUpdate = (e) => {
  text.value = e.target.value;
}
</script>
```

**v-model 默认参数**

```vue
<!-- App.vue -->
<template>
	<h1>{{ title }}</h1>
	<MyComponent v-model:title="title" />
</template>
<script setup>
import { ref } from 'vue'
import MyComponent from './MyComponent.vue'
  
const title = ref('v-model argument example')
</script>
```

```vue
<!-- MyComponent -->
<template>
	<input type="text" v-model="title" />
</template>
<script setup>
const title = defineModel('title')
</script>
```

![image-20240123162448669](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202401231624939.png)









### Transition组件

会在一个元素或组件进入和离开 DOM 时应用动画，由以下条件之一触发：

- `v-if`
- `v-show`
- `<component>`切换的动态组件
- 特殊属性 `key` 的改变

基于 CSS 的过渡效果，CSS 过渡 class

一共有 6 个应用于进入与离开过渡效果的 CSS class。

1. `v-enter-from`：进入动画的起始状态。在元素插入之前添加，在元素插入完成后的下一帧移除。
2. `v-enter-active`：进入动画的生效状态。应用于整个进入动画阶段。在元素被插入之前添加，在过渡或动画完成之后移除。这个 class 可以被用来定义进入动画的持续时间、延迟与速度曲线类型。
3. `v-enter-to`：进入动画的结束状态。在元素插入完成后的下一帧被添加 (也就是 `v-enter-from` 被移除的同时)，在过渡或动画完成之后移除。
4. `v-leave-from`：离开动画的起始状态。在离开过渡效果被触发时立即添加，在一帧后被移除。
5. `v-leave-active`：离开动画的生效状态。应用于整个离开动画阶段。在离开过渡效果被触发时立即添加，在过渡或动画完成之后移除。这个 class 可以被用来定义离开动画的持续时间、延迟与速度曲线类型。
6. `v-leave-to`：离开动画的结束状态。在一个离开动画被触发后的下一帧被添加 (也就是 `v-leave-from` 被移除的同时)，在过渡或动画完成之后移除。

`v-enter-active` 和 `v-leave-active` 给我们提供了为进入和离开动画指定不同速度曲线的能力，我们将在下面的小节中看到一个示例。

```vue
<Transition name="fade">
	...
</Transition>

<style>
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
  @keyframs to-hide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
```

```css
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
```

```css
.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
```





### useSlots() & useAttrs()

在模板中可直接通过 `$slots` 和 `$attrs` 来访问它们。





### Vue2/3 响应式

```js
// Vue2

```



```js
// Vue3
let obj = '111'
new Proxy(obj, {
  get(target, key, receiver) {
    // 收集副作用函数
    const res = Reflect.get(target, key, receiver)
    return res
  },
  set(target, key, value, receiver) {
    // touch update
    const res = Reflect.set(target, key, value, receiver)
    return res;
  }
})
```

`Proxy`与`Object.defineProperty`：

1. `Object.defineProperty` 只能遍历对象属性进行劫持，无法检测对象属性的添加和移除，Vue2为了解决这一问题提供了 `$set` 和 `$delete`实例方法，Proxy可以劫持整个对象，并返回一个新对象，通过操作新对象来达到响应式目的（Proxy+Reflect）；
2. `Object.defineProperty`无法监听数组下标及数组长度的变化，Proxy可以（push、shift、splice）；
3. Proxy有13种代理拦截方法，不限于apply、ownKeys、deleteProperty；
4. 性能问题，当data数据较多且层级较深，`Object.defineProperty`要遍历data中所以数据并设置响应式，性能不佳；Proxy只在getter时才会对对象的下一层进行劫持，真正访问到的内部对象才会变成响应式。









### getCurrentInstance()

Vue2中可以通过`this.$refs.xxx`来获取组件实例，在Vue3 setup语法糖中this指向组件失效，可以通过`getCurrentInstance()` 这个API来获取组件的实例

```vue
<script setup>
import { getCurrentInstance } from 'vue';
  
const instance = getCurrentInstance();
</script>
```



### nextTick()

事件循环机制event Loop 是nextTick的核心。作为单线程语言，JavaScript在HTML5后也支持了多线程web Worker，但是不允许操作DOM。异步的概念使得JS有更广的作用。

Vue在更新DOM是异步的，数据更新是同步的。当我们操作dom时发现数据读取的是上次时，就需要使用nextTick()。  

Vue3 nextTick源码：

```ts
export function nextTick<T = void>(
	this: T,
  fn?: (this： T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```

原理是将传入的回调函数放入一个Promise中，在微任务队列中去执行，使其成为异步程序。







### Vue2 自定义Vue API类型

在 Vue2 项目的开发中，我们经常把常用的属性、方法挂载到 Vue 的原型上面，比如：

```js
Vue.prototype.$foo = 'Hello, world!'
```

如此一来，所有组件都可以通过 `this.$foo` 访问该属性（原型链委托）。

当我们在组件代码中使用 `this` 访问 Vue 提供的 API 时，是自带提示的，这里的 `this` 是组件实例，类型声明文件路径为 `node_modules > vue > types > vue.d.ts > Vue > xxx`

我们可以使用 `interface` 在项目根目录下新建 `shime-global.d.ts` 文件：

```typescript
declare module "vue/types/vue" {
  interface Vue {
    /** 应用名称 */
    $APP_NAME: string
    /** foo */
    $foo(): void
}
```

> 为什么要加上 `declare module "vue/types/vue"` ？
>
> 因为 Vue 提供的类型声明文件位于 `node_modules/vue/types/vue.d.ts` ，此文件中使用了 import 和 export，导致该类型声明成为模块，外部无法与之产生“羁绊”。
>
> 如果不加，声明的 `interface Vue { }`和 Vue 提供的 `interface Vue { }` 是两个不同的类型，也就不会合并。







### Vue3.4 非原型链方法

- component
- createApp
- config
- directive
- mixin
- mount
- provide
- runWithContext
- unmount
- use
- version
- _component
- _context





### 自定义Vue3 Cli

```js
// webpack.config.js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader/dist/index");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// ElementPlus按需引入
const AutoImport = require('unplugin-auto-import/webpack');
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers")


let isProd = process.env.NODE_ENV === 'production'

/** 
* @type {import('webpack'.Configuration)}
*/
module.exports = {
  entry: "./src/main.js",
  mode: process.env.NODE_ENV,
  output: {
    filename: "js/[name].[hash:8].js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/"  // history模式资源url匹配
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      "@": path.resolve(__dirname, "../src"), // 别名
    },
  },
  devServer: {
    historyApiFallback: { // history模式404重定向
      rewrites: [
        { from: /.*/g, to :'/index.html' }
      ]
    }
  }
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["vue-loader"],
      },
      {
        test: /\.less$/,
        use: [isProd ? MiniCssExtractPlugin.loader : "style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.css$/,
        use: [isProd ? MiniCssExtractPlugin.loader : "style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              [
                "import",
                {
                  libraryName: "ant-design-vue",  // ant-design-vue按需引入
                  libraryDirectory: "es",
                  style: "css", // `style: true` 会加载 less 文件
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10 * 1024, // 10kb
              name: "[name].[hash:8].[ext]",
              outputPath: "media",
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|bmp|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8 * 1024, // 8Kb以下编译成base64，8Kb及以上按文件单独打包
              name: "[name].[hash:8].[ext]",
              outputPath: "img",
              esModule: false,
            },
          },
        ],
        type: "javascript/auto",
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: {
            warnings: true,
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,  // 单独编译npn包源文件，形成缓存
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../index.html"), // 我们要使用的 html 模板地址
      filename: "index.html", // 打包后输出的文件名
      title: "Webpack App", // inject to index.html，by <%= htmlWebpackPlugin.options.title %>
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(), // 清除 dist 文件夹
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(process.env.NODE_ENV === "production"),
      __VUE_OPTIONS_API__: true, // 支持options api
      __VUE_PROD_DEVTOOLS__: false, // prod版本不启用devtools
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(__dirname, "../favicon.ico"), to: "./favicon.ico" }],
    }),
    isProd ? new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }) : () => {},
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
};
```

```json
// package.json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config ./build/webpack.config.js",
    "serve": "cross-env NODE_ENV=development webpack serve --config ./build/webpack.config.js"
  }
}
```







### DOM内模板解析注意事项

**闭合标签**

Vue 模板解析器支持任意标签使用 `/>` 作为标签关闭的标志（闭合标签）。

然而在 DOM 内模板中，必须显式地写出关闭标签：

```vue	
<my-component></my-component>
```



**元素位置限制**

某些 HTML 元素对于放在其中的元素类型有限制，例如 `<ul>`，`<ol>`，`<table>` 和 `<select>`，相应的，某些元素仅在放置于特定元素中时才会显示，例如 `<li>`，`<tr>` 和 `<option>`。

```vue
<table>
  <blog-post-row></blog-post-row>
</table>
```

自定义的组件 `<blog-post-row>` 将作为无效的内容被忽略。

可以使用特殊的 [`is` attribute](https://cn.vuejs.org/api/built-in-special-attributes.html#is) 作为一种解决方案：

```vue
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```



**传递 prop 的细节**

为了和 `HTML attribute` 对齐，通常会将向子组件传递的 props 写为 `kebab-case` 形式：

```vue
<MyComponent greeting-message="hello" />
```

而对于组件名，推荐使用 `PascalCase`。(Vue)



**使用一个对象绑定多个prop**

想要将一个对象的所有属性都当做 props 传入，可以使用没有参数的 `v-bind`，即只使用 `v-bind` 而非 `:prop-name`。例如：

```js
const post = {
  id: 1,
  title: "My Journey with Vue"
}
```

模板：

```vue
<BlogPost v-bind="post" />
```

上述模板等价于：

```vue
<BlogPost :id="post.id" :title="post.title" />
```



补充细节：

- 所有 prop 默认都是可选的，除非声明了 `required: true`。



## 渲染函数 & JSX

JSX组件渲染插槽：

```tsx
// 默认插槽
<div>{slots.default()}</div>
// 具名插槽
<div>{slots.footer({ text: props.message })}</div>
```

传递插槽：

```tsx
<MyComponent>{() => 'hello'}</MyComponent>

<MyComponent>{{
    default: () => 'default slot',
    foo: () => <div>foo</div>,
    bar: () => [<span>one</span>, <span>two</span>]
}}</MyComponent>
```

作用域插槽：

```tsx
<MyComponent>{{
    default: ({text}) => <p>{text}</p>
}}</MyComponent>
```



`v-model`

```tsx
export default defineComponent {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    return () => (
    	<SomeComponent
       	modelValue={props.modelValue}
        onUpdate:modelValue={(value) => emit("update:modelValue", value)}
      ></SomeComponent>
    )
  }
}
```

