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