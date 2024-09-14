# Axios 项目封装

::: tip INFO
在参与公司项目时，无论是Vue2还是Vue3，**原项目开发者** 都习惯于将自定义的 axios 绑定到 Vue全局实例（原型链）上，这样会导致 intelligence 失效。在不改动原项目结构的情况下，解决办法是对 Vue **扩展全局属性**
结合实际项目中与后端接口对接的开发过往以及在编写网络请求代码时获得全量的intelligence功能。
:::


## 封装目录
在 src 文件夹下创建 services 文件夹，services 文件夹目录如下：
```sh
services/
│  index.ts
│
├─api
│     home.ts
│     type.d.ts
│
├─request
│     config.ts
└─    index.ts
```

封装所需依赖：
- `axios`
- `qs`

**request 目录下：**
:::code-group
```ts [index.ts]
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { BASE_URL, TIME_OUT } from './config'

class Http {
  public instance: AxiosInstance
  constructor(baseURL: string, timeout: number) {
    this.instance = axios.create({
      baseURL,
      timeout
    })
    // 请求拦截
    this.instance.interceptors.request.use(
      (config) => {
        // 可根据特定 Content-Type 或属性对请求参数作查询字符串序列化(FormData)  qs.stringify(data)
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // 响应拦截
    this.instance.interceptors.response.use(
      (response) => {
        if (response.config.responseType === 'blob') return response
        return response.data
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  public request<T>(config: AxiosRequestConfig):Promise<T> {
    return this.instance.request(config)
  }

  public get<T>(config: Omit<AxiosRequestConfig, 'method'>) {
    return this.request<T>({ ...config, method: 'get' })
  }

  public post<T>(config: Omit<AxiosRequestConfig, 'method'>) {
    return this.request<T>({ ...config, method: 'post' })
  }

  // ... other method of request
}

const http = new Http(BASE_URL, TIME_OUT)

export default http
```

```ts [config.ts]
const BASE_URL = 'http://xxx'
const TIME_OUT = 8000

export { BASE_URL, TIME_OUT }
```
:::

**api 目录下：**
:::code-group
```ts [api.ts]
import http from '../request'

export type ListType = any[]

export function getSomeList() {
  return http.get<ListType>({ url: '/getList' })
}

export function queryList() {
  return http.post({
    url: '/query',
    data: {/* */},
    headers: {
      "Content-Type": 'application/json'
    }
  })
}
```
:::

最后，在 `services` 目录下的 `index.ts` 文件中作统一的导出：
```ts [index.ts]
import http from './request/'

export * from './api/home'
export type * from './api/type'

export default http
```



## 取消请求

### 1. CancelToken `deprecated`

> Axios 的 cancel token API 是基于被撤销的 cancelable promises proposal.
>
> 此 API 从 `v0.22.0` 版本开始已被弃用，<font color="red">不应在新项目中使用</font>。

可以使用 `CancelToken.source` 工厂方法创建一个 cancel token ，如下所示：

```js
import axios from 'axios'

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(err => {
  if (axios.isCancel(err)) {
    console.log('Request canceled', err.message)
  } else {
    // ...
  }
})

axios.post('/user/12345', {
  name: 'xxx'
}, {
  cancelToken: source.token
})

// 取消请求（message 为可选参数）
source.cancel('cancel xxx')
```

也可以通过传递一个 executor 函数到 `CancelToken` 的构造函数来创建一个 cancel token：

```js
import axios from 'axios'

const CancelToken = axios.CancelToken
let cancel

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    cancel = c
  })
})

// 取消请求
cancel()
```



### 2. AbortController

从 `v0.22.0`开始，Axios 支持以 fetch API 方式- [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) 取消请求：

```js
const controller = new AbortController()

axios.get('/foo/bar', {
  signal: controller.signal
}).then(res => {
  // ...
})

// 取消请求
controller.abort()
```

:::info

当 `abort()` 被调用时，这个 `fetch()` promise 将 `reject` 一个名为 `AbortError` 的 `DOMException`。 

:::

在下面的代码片段中，通过 Fetch API 下载一段视频，并提供取消下载的方式：

```js
let controller
const url = 'video.mp4'

const downloadBtn = document.querySelector(".download")
const abortBtn = document.querySelector(".abort")

downloadBtn.addEventListener("click", fetchVideo)

abortBtn.addEventListener("click", () => {
  if (controller) {
    controller.abort()
    console.log("中止下载")
  }
})

function fetchVideo() {
  controller = new AbortController()
  const signal = controller.signal
  fetch(url, {signal})
    .then(res => {
      // ...
    })
    .catch(err => {
      // ...
    })
}

controller?.abort()
```

### 3. 项目应用

在Vue3.5+项目中，我们可以使用 `onWatcherCleanup()` API 来注册一个清理函数，当侦听器失效并准备重新运行时会被调用，并取消请求（副作用清理）：

```js{9-12}
import {watch, onWatcherCleanup} from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()
  
  fetch(`/api/${newId}`, {signal: controller.signal}).then(() => {
    // ...
  })
  onWatcherCleanup(() => {
    // 终止过期请求
    controller.abort()
  })
})
```

请注意，onWatcherCleanup 仅在 Vue 3.5+ 中支持，并且必须在 watchEffect 效果函数或 watch 回调函数的同步执行期间调用：不能在异步函数的 await 语句之后调用它。

作为替代，onCleanup 函数还作为第三个参数传递给侦听器回调，以及 watchEffect 作用函数的第一个参数：
```js
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // 清理逻辑
  })
})

watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // 清理逻辑
  })
})
```


##  Axios 拦截器实现原理

:::info Axios 源码如何实现拦截器

Axios 的拦截器实现基于 Axios 的核心原理，即 Axios 实例是一个包含请求和响应拦截器堆栈的对象。当发出请求或接收响应时，Axios 会遍历这些拦截器，并按照添加的顺序执行请求拦截器，以及按照相反的顺序执行响应拦截器。

:::

在 Axios 的源码中，拦截器是通过一个 AxiosInterceptorManager 实例来管理的，它维护了一个拦截器数组。每个拦截器都是一个包含 `fulfilled` 和 `rejected` 函数的对象。这两个函数分别对应于拦截器成功处理和拦截器处理出错的情况。



