## 1.Options API与Composition Api的区别

1. 表现形式：Options API是将data、methods生命周期钩子等封装成一个对象然后传入Vue构造函数然后通过init初始化数据方法等等
          Composition Api是把组件视为一个函数，所有的代码逻辑都在setUp函数中
2. this指向问题: Options API由于是通过Vue构造函数new出来的所以需要注意this的指向问题，但是Composition Api是通过执行setup函数来避免了复杂的this指向问题
3. 阅读性，使用Options API时代码的可读性随着组件变变大变差
4. 逻辑复用性，在vue2中通过mixin去复用代码逻辑, Compositon API 直接定义函数引用即可

```js
// 定义 mouse.js
export const MoveMixin = {
  data() {
    return {
      x: 0,
      y: 0,
    };
  },
  methods: {
    handleKeyup(e) {
      console.log(e.code);
      // 上下左右 x y
      switch (e.code) {
        case "ArrowUp":
          this.y--;
          break;
      }
    },
  },
  mounted() {
    window.addEventListener("keyup", this.handleKeyup);
  },
  unmounted() {
    window.removeEventListener("keyup", this.handleKeyup);
  },
};
```

```vue
// 使用
<template>
  <div>
  Mouse position: x {{ x }} / y {{ y }}
  </div>
</template>
<script>
  import mousePositionMixin from './mouse'
  export default {
    mixins: [mousePositionMixin]
  }
</script>
```


## 2.Vue3有哪些新特性

1. 舍弃了Options API引入了Compositon API
2. 提供了Teleport传送门允许将组件的一部分渲染到DOM树中的其他位置，这对于在组件内部创建模态框、对话框等非常有用
3. 更好的 TypeScript支持
4. Suspense支持，异步组件加载的机制
5. 响应式原理


## 3.vue3与vue2响应式的区别
### vue2
1. vue2底层实现用的是Object.defineProperty()，但是当数据类型是数组时vue2重写了可以改变原数组的的方法push,pop，shift，unshift,splice,sort,
2. 通过options对象传入Vue，在init函数中通过initState初始化状态，在initState中初始化Poprs、方法、data，wtach、computed


## 4.ref与reactive的区别
1. ref定义的是原始类型数据，reactive定义的是引用类型的数据
2. 但是当使用ref定义引用类型的数据值，ref的源码会判断值的类型如果是原始值的话会直接返回value，如果是引用类型的话会经过reactive方法再包装一次
```js
const mutableHandlers = {
  get(target, key, receive) { 
   return Reflect.get(target, key, receive)
  },
  set: () => { },
  deleteProperty: () => { },
  has: () => { },
  ownKeys: () => { },
};
function ref(value) {
  return createRef(value, false)
}
function createRef(rawValue, shallow) {
  return new RefImpl(rawValue, shallow);
}
function toReactive(value) {
  if (typeof value === 'object' && value !== null) 
    return reactive(value)
  } else {
    return value
  }
}
function reactive(target) {
  return createReactiveObject(target, mutableHandlers);
}
function createReactiveObject(target, collectionHandlers) {
  const proxy = new Proxy(target, collectionHandlers)
  return proxy;
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    return this._value;
  }
  set value(newVal) {

  }
}
```


## 5.watchEffect
1. 会取追踪副作用函数中的响应式依赖，当这些依赖改变时会去重新执行副作用函数
2. 它的第二个参数配置中的flush有三个选项pre(dom更新前执行), post(后执行)，sync(异步监听，响应式依赖发生改变时立即触发侦听器)


## 6.依赖注入(父子通信)
1. 如果有多个注入，会被最近的覆盖掉
```js
// 父组件
provide('key', '1')
// 子组件
const red = inject('key')
```


## 7.ref 注册模板引用
1.因为 ref 本身是作为渲染函数的结果来创建的,必须等待组件挂载后才能对它进行访问, 也是非响应式的

```vue
<p ref="p">hello</p>

<script setup>
import { ref } from 'vue'
const p = ref(null)
</script>
```





## 8.组件v-model
1.可以在组件上使用实现双向绑定，不用子属性修改后传给父组件再修改
```vue
<!-- 父 -->
<template>
  <h1>{{ msg }}</h1>
  <Child v-model="msg" />
</template>
<script setup>
import Child from './Child.vue'
import { ref } from 'vue'
const msg = ref('Hello World!')
</script>

<!-- 子 -->
<template>
  <span>My input</span> <input v-model="model">
</template>
<script setup>
const model = defineModel()
</script>
```


## 9.插槽
1. 默认插槽
   ```vue
   <Component>
   	Title
   </Component>
   
   <template>
   	<slot>Default</slot>
   </template>
   ```

2. 具名插槽
   ```vue
   <BaseLayout>
     <template #header>
       <h1>Here might be a page title</h1>
     </template>
   
     <template #default>
       <p>A paragraph for the main content.</p>
       <p>And another one.</p>
     </template>
   
     <template #footer>
       <p>Here's some contact info</p>
     </template>
   </BaseLayout>
   
   <template>
   <div class="container">
     <header>
       <slot name="header"></slot>
     </header>
     <main>
       <slot></slot>
     </main>
     <footer>
       <slot name="footer"></slot>
     </footer>
   </div>
   </template>
   ```

3. 动态具名插槽
   ```vue
   <base-layout>
     <template v-slot:[dynamicSlotName]>
       ...
     </template>
     <!-- 缩写为 -->
     <template #[dynamicSlotName]>
       ...
     </template>
   </base-layout>
   
   <script setup>
   	const dynamicSlotName = "xxx"
   </script>
   ```

4. 默认插槽+作用域插槽

   ```vue
   <MyComponent v-slot="slotProps">
     {{ slotProps.text }} {{ slotProps.count }}
   </MyComponent>
   
   <div>
     <slot :text="greetingMessage" :count="1"></slot>
   </div>
   ```

5. 具名作用域插槽
   ```vue
   <MyComponent>
     <template #header="headerProps">
       {{ headerProps }}
     </template>
   
     <template #default="defaultProps">
       {{ defaultProps }}
     </template>
   
     <template #footer="footerProps">
       {{ footerProps }}
     </template>
   </MyComponent>
   
   <div>
     <slot name="header" message="hello"></slot>
   </div>
   ```

   

## 10.Attributes 继承（透传）
1. 透传 attribute”指的是传递给一个组件，却没有被该组件声明为 props 或 emits 的 attribute 或者 v-on 事件监听器。最常见的例子就是 class、style 和 id
```js
// <MyButton> 的模板 
<button>click me</button>
// 父组件使用
<MyButton class="large" />
// 最后渲染
<button class="large">click me</button>
```


## 11.keepAlive
1. 组价缓存缓存的机制，通过`<component :is="">`来加载组件
2. 接收三个prop，`include`、`exclude`、`max`， max最大缓存数采用lru算法
3. 可以通过onActivated和onDeactivated注册相应的两个状态

```js
import { onActivated, onDeactivated } from 'vue'
onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
```


## 12.Teleport
1. Vue内置组件，它运行将一个组件内部的一部分模板渲染至DOM的不同部分（外层 DOM 结构位置，如body）；
2. 方便实现modal、message等组件；
3. 功能与 React 的 `createPortal` 相似，
4. 区别在于
   1.  `portal` 只改变 DOM 节点所处位置，其行为与 React 组件的子节点一致。该子节点可以访问父节点树提供的 `context` 对象、事件将从子节点冒泡至父节点；
   2. `<Teleport>` 只改变了渲染的 DOM 结构，它不会影响组件间的逻辑关系


```vue
<!-- Vue - Teleport -->
<Teleport to="body">
  <div v-if="open">
		<p>from the modal</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

```jsx
// React - createPortal
import {createPortal} from 'react-dom'

function App() {
  return (
  	<div>
    	{createProtal(
      <p>render in document.body</p>
      , document.body)}
    </div>
  )
}
```





## 13.nextTick
1. vue的渲染方式采用的是异步更新策略，在一个更新任务回收集所有的更新形成一个队列，然后再进行批处理。 内部就是使用了nextTick(多个nextTick调用 会被合并成一次 内部会合并回调)最后在异步任务中批处理
主要应用场景就是异步更新(认调度的时候就会添加一个nextTick任务) 用户为了获取最终的染结果需要在内部任务执行之后在执行.
```js
const cbs = []
let pending = false

function flushCbs() {
  cbs.forEach(cb => cb())
}
function timerFunc(cb) {
  // settimeout MutationObserver
  if (window.Promise) {
    Promise.resolve(() => cb())
  } 
}
function nextTict(cb) {
  cbs.push(cb)
  if (!pending) {
    timerFunc(flushCbs)
    pending = true
  }
  
}

```

## 14.vuex是怎么注册插件的
1. 基于<font color="red">发布订阅模式</font>
2. 首先vue根据options的plugins然后通过registerPlugin去注册插件，这些插件的本质是一个函数，当运行时vuex会提供一个subscibe方法将这些插件放入一个数组中，然后再commit修改时去执行这些数组方法
```js
  publish(newState, oldState, method) {

    that.cbs.forEach(cb => cb(newState, oldState, method))
  }
  subscrib(cb) {
    this.cbs.push(cb)
  }
```

## 15.父子组件生命周期图
挂载： parent beforeCreate => parent created => parent beforeMount => child beforeCreate => child created => child beforeMount => child mounted => parent mounted

更新： parent beforeUpdate => child beforeUpdate => child updated => parent updated

销毁： parent beforeDestroy => child beforeDestroy => child destroyed => parent destroyed

## 16.vue3与vue2生命周期对比



## 17.组件通信
1. props与emits
2. vuex、Pinia
3. provide与inject
4. ref属性获取子组件的属性和状态
5. 作用域插槽（具名）

## 18.组件的渲染



## 19.组件更新



## 20.vue的动态组件



## 21.vue指令



## 22.解决非工程化项目初始化页面闪动问题(好题,理解)



## 23.vue自定义指令



## 24.$set原理
1. $set是vue2响应式的一个补丁，由于通过修改数组下标以及添加对象属性无法更新页面，所以通过$set实现，当是数组时
   通过splice方法来试下响应式，当是对象时重新给对象定义了一个响应式属性，然后去通知页面更新视图`
```js
  function set(target, key, val) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }

    var ob = (target).__ob__;
    if (!ob) {
      target[key] = val;
      return val
    }

    defineReactive$$1(ob.value, key, val);

    ob.dep.notify();
    return val
  }
```

## 25.$del原理
```js
  function del(target, key) {
    var ob = (target).__ob__;
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

```
## 26.依赖收集
所谓的依赖收集(观察者模式) 被观察者指代的是数据 (dep)， 观察者 (watcher 3中染wather、计算属性、用户watcher)一个watcher中可能对应着多个数据 watcher中还需要保存dep (重新染的时候可以让属性重新记录watcher) 计算属性也会用到
>多对多的关系 一个dep 对应多个watcher 一个watcher有多个dep 。 黑认渲染的时候会进行依赖收集(会触发get方法》，数据更新了就找到属性对应的watcher去触发更新





## 27.other

- 组件通信总结

- 虚拟DOM详解

- v-model

- 数据响应原理

- diff

- 生命周期详解

- computed

- filter过滤器(Vue2)
  自定义过滤器，常用于文本格式化。过滤器可以用在两个地方：

  - 双花括号插值
  - `v-bind` 表达式

  ```vue
  <template>
  	<span>{{detailName | detailNameFilter}}</span>
  	<div v-bind:id="rawId | formatId"></div>
  </template>
  <Script>
  export default {
    filters: {
      detailNameFilter: function(val) {
        if (val.length > 12) {
          return val.replace(/^(.{12})(.*)$/, '$1...')
        } else {
          return val
        }
      },
      formatId: function(val) {
        // ...
      }
    }
  }
  </Script>
  ```

  除了组件选项，还可在创建Vue实例之前全局定义过滤器：

  ```js
  Vue.filter("capitalize", function(val) {
    if (!val) return ''
    val = val.toString()
    return val.charAt(0).toUpperCase() + val.slice(1)
  })
  new Vue({
    // ...
  })
  ```

  Vue3版本下选项 `filters`已被废弃，可以使用计算属性 `computed` 或方法替代。

- 作用域插槽

- 过渡和动画

- 优化

- keep-alive

  ```vue
  <template>
    <KeepAlive>
      <component :is="current" />
    </KeepAlive>
  </template>
  <script setup>
  import { shallowRef } from 'vue'
  import CompA from './CompA.vue'
    
  const current = shallowRef(CompA)
  </script>
  ```

- 长列表优化

- 其他API

- 模式和环境变量

- 嵌套路由

- 路由切换动画

- 导航守卫
