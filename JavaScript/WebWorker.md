# Web Worker

Web Worker 是一种在后台线程中运行 JavaScript 代码的机制，不会影响用户界面的响应。通过 Web Worker，可以在不阻塞主线程（即用户界面线程）的情况下执行计算密集型任务，例如数据处理、文件操作等。此外，worker可以使用 XMLHTTPRequest 或 fetch 执行I/O。worker可以将消息发送到创建它的 JavaScript 代码，由事件处理器接收数据。



:::info

阮一峰：Web Worker 使用教程：[链接](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)

:::



Web Worker 能创建一个独立于 Web 应用程序主执行程序的后台线程，并运行脚本操作，使主线程的运行（通常是 UI 线程）的运行不会被阻塞。

## Web Worker 使用限制

1. 同源限制：只能运行同源脚本文件
2. DOM限制：无法获取 DOM 对象，但可以使用 `navigator` 和 `location` 对象
3. 通信联系：Worker线程和主线程不在同一个上下文环境，它们必须通过消息完成
4. 脚本限制：Worker线程不能执行 `alert()` 和 `confirm()` 方法，但可以使用 XMLHttpRequest
5. 文件限制：Worker线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本必须来自网络，且有专门的方法 `importScripts()`



```js
function createWorker(f) {
  const blob = new Blob[`(${f.toString()})()`]
  const url = URL.createObjectURL(blob)
  const worker = new Worker(url)
  return worker
}
```





## Web Worker 的优点

1. **非阻塞操作**：Web Worker 允许在后台线程中执行任务，不会阻塞主线程，从而保持用户界面的流畅和响应性。
2. **并行处理**：利用 Web Worker 可以实现并行处理，提高应用程序的性能。
3. **隔离性**：Web Worker 在独立的上下文中运行，与主线程隔离，这意味着它们有自己的作用域和全局对象。



## 简单示例

**1. 创建一个 Web Worker 文件(worker.js)**

```js
self.onmessage = function(event) {
  // 接收主线程发来的消息
  const data = event.data
  
  // 执行一些计算
  let result = data * 2
  
  // 将结果发送回主线程
  self.postMessage(result)
}
self.onerror = function(event) {
  console.log(event.error)
}
```

**2. 在主线程中使用 Web Worker**

```js
if (!window.Worker) /**/ return
// 创建新的 Web Worker 实例
const worker = new Worker('worker.js')
// 向 Web Worker 发送消息
worker.postMessage(5)
// 接收来自 Web Worker 的消息
worker.onmessage = function(event) {
  event.data
}

worker.terminate() // 用于立即终止 worker 的行为
```



## 项目应用

在基于 `webpack` 和 `vite` 项目中加载 worker脚本方式有所区别，但都可以引入public目录（项目根目录）下的worker脚本。

### 一、基于 Webpack

采用 `worker-loader` 导入，首先安装 `worker-loader`：

```bash
npm install worker-loader --save-dev
```

**webpack 配置**

```js [webpack.config.js]
module.exports = {
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {loader: 'worker-loader'}
      }
    ]
  }
}
```

```js App.js
import Worker from './file.worker.js'

const worker = new Worker()

worker.postMessage({a: 1})
worker.onmessage = function(event) {}

worker.addEventListener('message', function(event) {})
```

也可不进行webpack配置，在导入时添加 `webpack-loader!`前缀：

```js
import Worker from 'worker-loader!../../worker/stationmap.js'

const worker = new Worker()
```



**案例一：**

```js [stationmap.js]
const Switch =  require('./switch.js')
const CommonMeth =  require('./until.js')

class StationMapTaskQueue extends mix(Switch, CommenMeth) {}

let queue = new StationMapTaskQueue()
// worker 数据入口
onmessage = function(event) {
  const data = event.data
  switch (data.type) {
    case 'config':
      queen.setStationMapConfig(data.data)
      break
    case 'train':
      queen.setTrainsStatus(data.data)
    	queen.parseTrainData()
      break
    case 'trainDetail':
      queen.setTrainsDetail(data.data)
      break
    default:
      if (queue) queue.enterQueue(data)
  }
}

onerror = function(error) {
  throw error
}
```

在Vue组件中使用：

```vue [stationMap.vue]
<script>
import Worker from 'worker-loader!../../worker/stationmap.js'
  
export default {
  data() {
    worker: null
  },
  methods: {
    // 创建 webWorker
    createWorker() {
      let _this = this
      this.worker = new Worker()
      this.worker.onmessage = function(event) {
        _this.resolveWorkerMessage(event.data)
      }
      this.worker.onerror = function(error) {
        _this.worker = new Worker()
        _this.setWorkerConfig()
      }
      this.setWorkerConfig()
    },
    // 设置worker配置
    setWorkerConfig() {
      if (this.worker) {
        let config = {/*...*/}
        this.worker.postMessage({type: 'config', data: config})
      }
    }
  }
}
</script>
```



**案例二：**

```js [worker.js]
let limitTime = null

onmessage = function(event) {
  let data = event.data
  if (data.type === 'lint') {
    limitTime = data.data.limitTime
  } else if (data.type === 'data') {
    let curveGroupInfo = {}
    let curveDataList = data?.data?.curveDataList || []
    // ... 
    curveGroupInfo = handleHistoryData(/*...*/)
  }
  postMessage({
    type: 'data',
    data: {
      // ...
      curveGroupInfo
    }
  })
}

onerror = function(e) {
  // ...
}

function handleHistoryData(list) {
  // ...
}
```

在Vue组件中使用：

```vue
<script>
import Worker from 'worker-loader!./worker.js'
  
export default {
  data() {
    return {
      worker: null  // web worker 实例
    }
  },
  created() {
    this.createWorker()
  },
  beforeDestroy() {
    this.worder && this.worker.terminate()
  },
  methods: {
    createWorker() {
      const _this = this
      this.worker = new Worker()
    	// 监听worker线程message事件
      this.worker.onmessage = function(event) {
        let data = event.data
        _this.switchList = data.data.switchList
        _this.curveGroupInfo = data.data.curveGroupInfo
      }
      this.worker.onerror = function(event) {
        self.worker = new Worker()
      }
      this.worker.postMessage({type: 'init', data: {limit: this.limitTime}})
    },
    onRuldIdChange(data) {
      // ...
      this.worker.postMessage({type: 'data', data: {
        curveDataList: this.curveDataList，
        dateSelectType: this.dateSelectType
      }})
    }
  }
}
</script>
```





### 二、基于 Vite

#### 通过构造器导入

一个 Web Worker 可以使用 `new Worker()` 和 `new SharedWorker()` 导入。与 worker 后缀相比，这种语法更接近于标准，是创建 worker 的 **推荐** 方式

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

worker 构造函数会接受可以用来创建 “模块” worker 的选项：

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

#### 带有查询后缀的导入

可以在导入请求上添加 `?worker` 或 `?sharedworker` 查询参数来直接导入一个 web worker 脚本。默认导出会是一个自定义 worker 的构造函数：

```ts
import MyWorker from './worker?worker'

const worker = new MyWorker()
```



案例：

在public目录绝对路径下新增 `calc.js` 或在相对路径下新增 `calc.ts` 引入：

```js [calc.js]
self.onmessage = function(event) {
  const data = event.data

  let result = data * 2
  self.postMessage(result)
}

self.onerror = function(event) {
  throw event
}
```

```vue [index.vue]
<script setup lang="ts">
import calcWorker from '@/worker/calc?worker' // 带有查询后缀的导入

const worker1 = new calcWorker()

const worker2 = new Worker(new URL('@/worker/calc.ts', import.meta.url)) // 通过构造器导入

const worker3 = new Worker('calc.js')   // 通过构造器导入
</script>
```

需要考虑实际部署情况来选择导入方式，在生成环境可能会出现路径问题。









## 附录

**类的多继承实现**

```js
function mix(...mixins) {
  class Mix {
    constructor() {
      for (let mixin of mixins) {
        copyProperties(this, new mixin())
      }
    }
  }
  for (let mixin of mixins) {
    copyProperties(Mix, mixin)
    copyProperties(Mix.prototype, mixin.prototype)
  }
  return Mix
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
      let desc = Object.getOwnPropertyDescriptor(source, key)
      Object.defineProperty(target, key, desc)
    }
  }
}
```



