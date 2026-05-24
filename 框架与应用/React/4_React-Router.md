# React Router

:::tip React Router include

- 认识 React-Router
- Router 基本使用
- Router 路由嵌套
- Router 代码跳转
- Router 参数传递
- Router 配置方式

:::



:::details 目录

[[TOC]]

:::





[TOC]



### 安装React-Router

- react-router-dom
- react-router包含一些react-native的内容，web开发不需要

```bash
npm install react-router-dom
```



### Router 基本使用

BrowserRouter 或 HashRouter，并对`<App />`组件包裹，

- BrowserRouter 使用 history 模式
- HashRouter 使用 hash 模式

关于HashRouter：

> Using hash URLs is not recommended.



**路由映射配置：**

- Routes：包裹所有的 Route，在其中匹配一个路由
  - Router5.x 使用的是 Switch 组件
- Route：用于路径的匹配
  - `path`属性：用于设置匹配到的路径
  - `element`属性：设置匹配到路径后，渲染的组件
    - Router5.x使用的是`component`属性
  - `exact`：精准匹配
    - Router6.x 不再支持该属性

```tsx
<Routes>
	<Route path='/' element={<Home/>} />
  <Route path='/about' element={<About/>} />
  <Route path='/profile' element={<Profile/>} />
</Routes>
```



**路由配置和跳转**

组件：`Link`和`NavLink`：

- 通常路径的跳转是使用`Link`组件，最终被渲染成a元素
- NavLink是在Link基础之上增加了一些样式（类名active）
- to属性：用于设置跳转到的路径

```typescript
interface LinkProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  replace?: boolean
  state?: any
  to: To
  reloadDocument?: boolean
}
```



**Navigate 导航**

用于路由重定向，当指定组件出现时，会执行跳转到对应的to路径中。



**404 Not Found 匹配**

使用通配符`"*"`来匹配路由菜单未配置的url

```tsx
<Routes>
	<Route path="*" element={<NotFound/>} />
</Routes>
```





### Router 路由嵌套/导航

#### **嵌套路由**

**方式一：通过Route组件**

```tsx
<Routes>
	<Route path="/home" element={<Home/>}>
    <Route path="/home" element={<Navigate to="/home/recommend"/>}/>
  	<Route path="/home/recommend" element={<Recommend/>}/>
    <Route path="/home/ranking" element={<Ranking/>}/>
  </Route>
</Routes>
```

**方式二：通过配置Routes**

```jsx
const routes = [
  {
    path: '/'
    element: <App/>
    children: [
    	{
    		path: '/detail',
    		element: <Detail/>
  		}
    ]
  }
]
```



**占位组件**：`<Outlet />`

通过内置组件`<Outlet>`渲染二级路由组件，与Vue-Router的`<RouterView>`对应，用于在父路由元素中作为子元素的占位元素。



#### **Router 导航**

**声明式导航**：使用内置组件`<Link>`

**编程式导航：**

除`<Link>`组件跳转外，可以使用`useNavigate` API进行跳转（hook，只能在函数式组件中进行使用）;

对于类组件，则使用高阶组件来实现路由的跳转，<font color="red">react-router5</font>提供`withRouter`高阶组件，它将`history`对象作为`props`传递给组件，使得在组件中使用`history.push`方法来进行手动路由的跳转。

在<font color="red">react-router6</font>中，<font color="red">不再提供</font> `withRouter`高阶组件，通过函数组件创建HOC：

```tsx
import React, {type ComponentType} from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'

function withRouter<P>(WrapperComponent: ComponentType<P & RouterProps>): React.FC<P> {
  return (props: P):JSX.Element => {
    const navigate = useNavigate()
    return <WrapperComponent {...props} router={{navigate}} />
  }
}

export default withRouter
```

路由跳转：

```js
const navigate = useNavigate()

navigate('/about', {replace: true})
```



#### 默认二级路由渲染

```tsx
const router = [
  {
    path: '/',
    element: <Layout/>
    children: [
    	{
    		index: true,
    		element: <Board/>
  		},
  		{
        path: 'artic',
        element: <Article/>
      }
    ]
  }
]
```







### Router 参数传递

**1. 动态路由的参数**：`/detail/:id`

```tsx
<Route path='/detail/:id' element={<Detail/>} />
navigate('/detail/' + param)
```

通过react-router提供的`useParams()` hook 来获取路由参数：

```tsx
function withRouter<P extends RouterProps>(WrapperComponent: ComponentType<P>): React.FC<Omit<P, keyof RouterProps>> {
  const WithRouter: React.FC<Omit<P, keyof RouterProps>> = (props) => {
    const navigate = useNavigate()
    const params = useParams()  // useParams
    const router = { navigate, params }
    return <WrapperComponent {...props as P} router={router} />
  }
  return WithRouter
}

export default withRouter
```



**2. 查询字符串的参数**：`/user?name=xx&age=xx`

**方式一**：通过react-router提供的`useLocation()` hook 来获取路由查询字符串参数：

```typescript
interface Location<State = any> {
  state: State
  key: string
  pathname: string
  search: string
  hash: string
}
```

**方式二**：通过react-router提供的`useSearchParams()` hook 来获取路由查询字符串参数：

> 关于URLSearchParams：MDN：[URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)

```tsx
import {useSearchParams} from 'react-router-dom'

function withRouter() {
  const [searchParams] = useSearchParams()
  const query = Object.fromEntries(searchParams)
  for (const [key, value] of searchParams.entries()) {
    // ...
  }
}
```





### Router 配置文件

React Router5（include 5）之前，对路由进行配置需要单独安装npm包：`react-router-config`；在React Router6后，不需要单独安装上述npm包。

```tsx
import {useRoutes} from 'react-router-dom'
import routes from './router'

function App() {
  return (
    <div className="App">
    	{useRoutes(routes)}
    </div>
  )
}
```

```tsx
// router/index.tsx
import Home from '../pages/Home'
const routes = [
  {
    path: '/home',
    element: <Home />  // 同步加载
  }
]
```

组件分包处理，需使用异步加载组件`<Suspense>`进行包裹，该功能由React提供，Vue与之对应的Suspense为实验性功能。

```tsx
// router/index.ts
const Home = React.lazy(() => import('../pages/Home'))  // 基于webpack的import特性单独build
```

```tsx
<HashRouter>
  <Suspense fallback={<h3>Loading...</h3>}>
    <App/>
  </Suspense>
</HashRouter>
```









### Routers v6.4

- createBrowserRouter
- createHashRouter
- createMemoryRouter
- createStaticRouter

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/teams/:teamId',
    element: <div>Hello router!</div>,
    children: [],
    loader: async ({ request, params }) => {
      return fetch(
        `/fake/api/teams/${params.teamId}.json`,
        { signal: request.signal }
      );
    },
    action: async ({ request }) => {
      return updateFakeTeam(await request.formData());
    },
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
  	<RouterProvider router={router} />
  </React.StrictMode>
)
```





### Example

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202401191654778.png" alt="image-20240119165435523" style="zoom: 67%;" />

上图导航的两种实现方式：

**方式一：**路由映射

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
  	<BrowserRouter>
    	<Link to='/'>首页</Link>
      <Link to='/about'>关于</Link>
      <Routes>
      	<Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
      </Routes>
    </BrowserRouter>
  )
}
```



**方式二：**配置文件

```tsx
import { BrowserRouter, useRoutes, Link } from 'react-router-dom'

const routes = [
  {
    path: '/',
    element: <Hooks/>
  },
  {
    path: '/component',
    element: <Component/>
  },
  {
    path: '*',
    element: <NotFound/>
  }
]

function App() {
  return (
  	<BrowserRouter>
    	<Link to='/'>首页</Link>
      <Link to='/about'>关于</Link>
			{useRoutes(routes)}
    </BrowserRouter>
  )
}
```



**方式三：**createRouter

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from 'pages/home/index'

const router = [
  {
    path: '/',
    element: <Home/>,
    children: [
      {
        path: '/home',
        element: ''
      }
    ]
  },
  {
    path: '*',
    element: <NotFound/>
  }
]
```



### history 与 hash

> 常用路由 history路由 和 hash路由，分别由 `createBrowserRouter` 和 `createHashRouter` 创建

- history
  - url表现：url/login
  - 底层原理：history对象 + pushState
  - 兼容性：ie10
- hash
  - url表现：url/#/login
  - 底层原理：监听 hashchange 事件 (`window.addEventListener('hashchange ')`w)
  - 兼容性：ie8



### lazy 动态加载组件

> React v18.x 在 React Router v6.x 使用 `lazy()` <font color="red">动态加载组件</font>

在 React Router 的 `RouteObject[]`类型中传入 `React.lazy()`所包裹的组件，最新版<font color="red">已不会提示类型错误</font>：

```tsx
const Home = React.lazy(() => import('page/home'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home/>
  }
]
```

向下兼容实现办法（HOC组件）：

```tsx
import React, { memo, type LazyExoticComponent } from 'react'
import GlobalLoading from './globalLoading'

type Props = {
  lazyChildren: LazyExoticComponent<() => JSX.Element>
}

/**
 * @example
 * const DashboardLazy = React.lazy(() => import('./dashboard'));
 * <LazyImportComponent lazyChildren={DashboardLazy} />
 */
const LazyImportComponent = memo((props: Props) => {
  return (
    <React.Suspense fallback={<GlobalLoading/>}>
      <props.lazyChildren/>
    </React.Suspense>
  )
})

export default LazyImportComponent
```

