# React Redux

## Redux 上手

核心模块：

- action
- reducer
- ...



1. 使用store中的数据

```js
import { createStore } from 'redux'
const initialState = { url: 'xxx' }

function reducer() {
  return initialState
}

const store = createStore(reducer)
// getState
store.getState() // { url: 'xxx' }
```



2. 修改store中的数据（通过action）

```js
function reducer(state = initialState, action) {
  // reducer函数自身逻辑
  return state
}
const nameAction = { type: "cname", url: "xxx"}
store.dispatch(nameAction) // 执行reducer函数
```

3. 订阅store中的数据

```js
store.subscribe(() => {
  // 当数据变化时触发回调
  store.getState()
})
```

4. 动态生成 action

```js
const { createStore } = require('redux')
const reducer = require('./reducer.js')

// 创建store
const store = createStore(reducer)

module.exports = store
```



与Vuex/Pinia一致，Redux修改state的状态必须触发action(dispatch)来进行修改。推荐以下Redux结构划分：

```
-store
--actionCreators.js
--constants.js
--reducer.js
--index.js
```



## React + Redux

在项目中，推荐使用`react-redux`库，可以直接在项目中使用，并且更加高效。`Redux`库可以在较多JavaScript环境中使用，与`React`没有直接的关系

**核心API**：

- connect
- Provider
- useSelector (hooks)
- useDispatch (hooks)

**connect**高阶组件

基于React Context API 原理，对数据进行劫持，利用HOC进行包裹并注入props

```tsx
// index.tsx
import { Provider } from 'react-redux'
import store from '@/store/index'

export function Layout() {
  return (
  	<Provider store={store}><Outlet /></Provider>
  )
}

// About.tsx
import { connect } from 'react-redux'
import type { Dispatch } from 'redux'
import type { UpdateUrlAction } frm '@/store/actionCreators'

interface stateType {
  url: string
}

// state
const mapStateToProps = (state: stateType) => ({
  url: state.url
})

// dispatch
const mapDispatchToProps = (dispatch: Dispatch<UpdateUrlAction>) => ({
  updateUrl:(url: string) => dispatch(updateUrl(url))
})
export default connect(mapStateToProps, mapDispatchToProps)(About)
```



useNavigate：无法在 class 组件使用。



## Redux 异步数据请求与存储

redux 引入了中间件 (Middleware) 的概念：

- 目的是在 dispatch 的 action 和 reducer 之间，扩展所需功能；
- 推荐中间件：`redux-thunk`。

通过 redux 的`applyMiddleware`应用中间件`thunk`(redux-thunk)，在 `action`中传递函数，并在redux作用域中执行然后调用 dispatch，在组件中，只显示调用了action方法。

```typescript
// index.ts

import {createStore, applyMiddleware} from 'redux'
import { thunk } from 'redux-thunk'
import reducer from './reducer'

const store = createStore(reducer, applyMiddleware(thunk))

export default store

// actionCreators.ts
import { Dispatch } from 'redux'
import { CHANGE_BANNERS } from './constants'

export interface SetBannersAction {
  type: typeof CHANGE_BANNERS
  payload: {
    banners: any[]
  }
}
export type AppAction = SetBannersAction

export const changeBanners = (banners: any[]): SetBannersAction => ({
  type: CHANGE_BANNERS,
  payload: { banners },
})

export const fetchMultidata = () => {
  return (dispatch: Dispatch<SetBannersAction>) => {
    let xhr = new XMLHttpRequest()
    xhr.open('get', 'http://123.207.32.32:8000/home/multidata')
    xhr.send()
    xhr.onload = () => {
      if (xhr.status === 200) {
        let res = JSON.parse(xhr.responseText)
        // dispatch({type: 'CHANGE_BANNERS', payload: { banners: res.data.banner.list}})
        dispatch(changeBanners(res.data.banner.list)) // 同上
      }
    }
  }

```



**开启Redux devtools**：

```ts
// index.ts -- store
import {createStore, applyMiddleware, compose} from 'redux'
import { thunk } from 'redux-thunk'
import reducer from './reducer'

// redux-devtools
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

export default store 
```





redux reducer 拆分逻辑，与Vuex module一致。



## Redux Toolkit (RTK)

Redux Toolkit 是官方推荐的编写 Redux 逻辑的方法。

**安装 Rudux Toolkit、react-redux**

```bash
npm install @reduxjs/toolkit react-redux
```

在`store`文件夹中，创建`store`和各模块的`reducerSlice`，并且可以<font color="red">声明根state的类型</font>：

```ts
// index.ts
import {configureStore} from '@reduxjs/toolkit'
import counterReducer from './features/counter'
import homeReducer from './features/home'

//export inteface RootState {
//  counter: ReturnType<typeof counterReducer>
//  home: ReturnType<typeof homeReducer>
//}

const store = configureStore({
  reducer: {
    counter: counterReducer,
    home: homeReducer
  }
})

// 导出 RootState 类型
export type RootState = ReturnType<typeof store.getState>

// 导出 AppDispatch 类型
export type AppDispatch = typeof store.dispatch

export default store
// 通过 react-redux 提供的 <Provider store={store}>高阶组件对后代组件进行store数据和方法的注入
```

```ts
// /store/features/counter.ts
import {createSlice} from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    counter: 888
  },
  reducers: {
    addNumber(state, action) {},
    subNumber(state, action) {}
  }
})

// actions
export const { addNumber, subNumber } = counterSlice.actions // 通过 dispatch 执行
// reducer
export default counterSlice.reducer
```



## 组件Props类型获取

组件自身的props类型和 redux connect props类型

```typescript
import { connect, type ConnectedProps } from 'react-redux'
import { addNumber, subNumber } from '@/store/features/counter'
import type RootType from '@/store'

// 定义组件需要的属性类型
interface OwnProps {}

const mapStateToProps = (state: RootType) => ({
  counter: state.counter.counter
})
const mapDispatchToProps = (dispatch: any) => ({
  addNumber(num: number) {
    dispatch(addNumber(num))
  }
})
// 使用 connect 函数连接组件和 Redux store，并生成一个高阶组件
const connector = connect(mapStateToProps, mapDispatchToProps)

// 使用 ConnectedProps 获取连接后的组件的属性类型
type PropsFromRedux = ConnectedProps<typeof connector>
                                     
// 将组件的原始属性和从 Redux 中获取的属性合并
type propsType = OwnProps & PropsFromRedux
```



## RTK的异步操作

在之前的开发中，通过 redux-thunk 中间件让 dispatch 进行异步操作。

### createAsyncThunk

Redux Toolkit 默认集成了 thunk 相关的功能： `createAsyncThunk`

> It does not generate any reducer functions, since it does not know what data you're fetching, how you want to track loading state, or how the data you return needs to be processed. 

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit'

interface MultidataType {
  name: string
}
// 在组件中dispatch时可传入参数
export const fetchMultidata = createAsyncThunk('home/fetchMultidata', async (param: MultidataType, thunkAPI) => {
  // ...
  thunkAPI.dispatch(xxx)
})
```

当`createAsyncThunk`创建的`action`被`dispatch`时，会存在三种状态：

- `pending`
- `fulfilled`
- `rejected`

### extraReducers

```ts
const userSlice = createSlice({
  // ...
  extraReducers: (builder) => {
    builder
      .addCase(fetchMultidata.fulfilled, (state, action) => {
      	// ... 
        action.payload // 包含 fetchMultidata 返回 （Promise）
      })
    	.addCase(fetchMultidata.rejected, (state, action) => {
      	// ...
    	})
  }
})
```



### 实现 connect函数

类组件实现：

```tsx
import { PureComponent, type ReactNode } from 'react'
import store from '@/store'

export default function connect(mapStateToProps: any, mapDispatchToProps: any) {
  return function (WrapperComponent: any) {
    class NewComponent extends PureComponent {
      private unsubscribe:any
      constructor(props: any) {
        super(props)

        this.state = mapStateToProps(store.getState())
      }
      componentDidMount(): void {
        this.unsubscribe =  store.subscribe(() => {
          // this.forceUpdate()
          this.setState(mapStateToProps(store.getState()))
        })
      }
      componentWillUnmount(): void {
        this.unsubscribe()
      }
      render(): ReactNode {
        const stateObj = mapStateToProps(store.getState())
        const dispatchObj = mapDispatchToProps(store.dispatch)
        return (
          <WrapperComponent {...this.props} {...stateObj} {...dispatchObj} />
        )
      }
    }

    return NewComponent
  }
}
```



函数式组件实现：

```tsx
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'

type MapStateToProps = (state: RootState) => any
type MapDispatchToProps = (dispatch: AppDispatch) => any

export default function connect(
  mapStateToProps: MapStateToProps,
  mapDispatchToProps?: MapDispatchToProps,
) {
  return function (WrapperComponent: React.ComponentType<any>) {
    return function ConnectedComponent(props: any) {
      const stateProps = useSelector((state: RootState) =>
        mapStateToProps(state),
      )
      const dispatch = useDispatch()

      // Call the mapDispatchToProps to get dispatchProps
      const dispatchProps = mapDispatchToProps && mapDispatchToProps(dispatch)

      // Merge stateProps, dispatchProps, and ownProps into the final props
      const finalProps = {
        ...props,
        ...stateProps,
        ...dispatchProps,
      }

      // Render the connected component with the final props
      return <WrapperComponent {...finalProps} />
    }
  }
}
```



### overview

#### 一、Redux 用法

**1.1 react-redux**

- Provider  : 包裹组件并提供store `<Provider store={store}></Provider>`
- connect
- useDispatch (hooks)
- useSelector (hooks)



**1.2 redux 异步操作**

- dispatch(function)? false
- redux-thunk - applyMiddleware
- 函数中发送异步请求
  - dispatch()



**1.3 reducer 的拆分**

- combineReducers({})



#### 二、ReduxToolKit(RTK)

**2.1 RTK介绍**



**2.2 RTK基本使用**

- configureStore: reducer
- createSlice
  - name
  - initialState
  - reducers
  - extraReducers()



**2.3 RTK异步操作**

- createAsyncThunk('actionName', async () => {})
- 三种状态
  - pending
  - fulfilled
  - rejected



**2.4 RTK 其他用法**

- extraReducers(builder => builder.addCase())
- createAsyncThunk('actionName', async (params, thunkAPI) => {})



**2.5 connect 实现**

HOC高阶组件：

```tsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store'

type MapStateToProps = (state: RootState) => any
type MapDispatchToProps = (dispatch: AppDispatch) => any

function connect(
	mapStateToProps?: MapStateToProps,
  mapDispatchToProps?: MapDispatchToProps,
) {
    return function (WrapperComponent: React.ComponentType<any>) {
      return function ConnectedComponent(props: any) {
        const stateProps = useSelector((state: RootState) => mapStateToProps(state))
        const dispatch = useDispatch()
        const dispatchProps = mapDispatchToProps(dispatch)
        return <WrapperComponent {...props} {...stateProps} {...dispatchProps} />
      }
    }
  }
```



### 实现 thunk 中间件

```js
function thunk(store) {
  const next = store.dispatch
  function dispatchThunk(action) {
    if (typeof actoin === 'function') {
      action(store.dispatch, store.getState)
    } else {
      next(action) // store.dispatch(action)
    }
  }
  store.dispatch = dispatchThunk
}
```



### dispatch异步函数存储数据方式汇总

首先是在组件中通过redux提供的hook派发异步函数：

```tsx
import {useEffect} from 'react'
import {useDispatch} from 'react-redux'

import {fetchRoomPrice} from '@/store/modules/home'

function Home() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchRoomPrice('xxx'))
  }, [dispatch])
  
  return ()
}
```



方式一：`createAsyncThunk`+`extraReducers`（<font color="red">最新rtk版本已不再支持此写法，类型报错</font>）

```typescript
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { getRoomPrice } from '@/services'

/** 组件中执行此函数 */
export const fetchRoomPrice = createAsyncThunk('fetchprice', async () => {
  const res = await getRoomPrice()
  return res
})

const homeReducer = createSlice({
  name: 'home',
  initialState: {
    roomPrice: {}
  },
  extraReducers: {
    [fetchRoomPrice.fulfilled](state, {payload}) {
      state.roomPrice = payload
    }
  }
})
```



方式二：`createAsyncThunk`+`extraReducers`（新版本写法）

```typescript
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { getRoomPrice } from '@/services'

/** 组件中执行此函数 */
export const fetchRoomPrice = createAsyncThunk('fetchprice', async () => {
  const res = await getRoomPrice()
  return res
})

const homeReducer = createSlice({
  name: 'home',
  initialState: {
    roomPrice: {}
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoomPrice.fulfilled, (state, action) => {
      state.roomPrice = action.payload
    })
  }
})
```



方式三：`createAsyncThunk` dispatch + `reducer`（推荐）

```typescript
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import { getRoomPrice } from '@/services'

/** 组件中执行此函数 */
export const fetchRoomPrice = createAsyncThunk('fetchprice', async (_, {dispatch}) => {
  const res = await getRoomPrice()
  dispatch(getRoomPriceAction(res))
})

const homeReducer = createSlice({
  name: 'home',
  initialState: {
    roomPrice: {}
  },
	reducers: {
    getRoomPriceAction(state, { payload } ) {
      state.roomPrice = payload
    }
  },
})

export const { getRoomPriceAction } = homeReducer.actions
```

**解决bug**：`dispatch(fetchRoomPrice('xxx'))`

>  类型“AsyncThunkAction<void, void, AsyncThunkConfig>”的参数不能赋给类型“UnknownAction”的参数。

在使用`useDispatch` hook时应传入 `Redux store` 的 `dispatch` 类型：

```typescript
import {configureStore} from '@reduxjs/toolkit'
// ...

const store = configureStore({
  reducer: {
    home: homeReducer,
    entire: entireReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
```



**Define Typed Hooks**

- For `useSelector`, it saves you the need to type `(state: RootState)` every time
- For `useDispatch`, the default `Dispatch` type does not know about thunks or other middleware. In order to correctly dispatch thunks, you need to use the specific customized `AppDispatch` type from the store that includes the thunk middleware types, and use that with `useDispatch`. Adding a pre-typed `useDispatch` hook keeps you from forgetting to import `AppDispatch` where it's needed.



```typescript
//app/hooks.ts

import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {RootState,AppDispatch} from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: ()=> AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// 或者在组件中给 useSelector 或 useDispatch 传入泛型
```

**在组件中使用**

```tsx
// Counter.tsx
import React, {useState} from 'react'

import {useAppSelector, useAppDispatch} from 'app/hooks'

import {decrement, increment} from './counterSlice'

export function Counter() {
  const count = useAppSelector(state => state.counter.value)
  const dispatch = useAppDispatch()
}
```



## Redux with TS

### hooks

> hooks with TypeScript

首先声明store的`state`和`dispatch`类型

```typescript
// store/index.ts
import {configureStore} from '@reduxjs/toolkit'
// ...

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer
  }
})

/** TS 定义 */
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```



### connect hoc

如果任然使用`connect`，应该使用`ConnectedProps<T>`

```typescript
import {connect, type ConnectedProps} from 'react-redux'
import type {RootState} from '@/store/reducer'

// state
const mapStateToProps = (state: RootState) => ({
  url: state.url,
  banners: state.banners
})

// dispatch
const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => ({
  updateUrl: (url: string) => dispatch(updateUrl(url)),
  changeBanners: (banners: any[]) => dispatch(changeBanners(banners)),
})

// ConnectedProps<T>
const connector = connect(mapStateToProps, mapDispatchToProps)
// redux props 类形
type PropsFromRedux = ConnectedProps<typeof connector>
                                     
// 被connect包裹的组件 props 类型
type Props = PropsFromRedux & {}         
```





### Redux Hooks

#### 1.useSelector

```typescript
interface RootState {
  isOn: boolean
}

const selectIsOn = (state: RootState) => state.isOn

const isOn = useSelector(selectIsOn)
```

与下列代码同理：

```ts
const isOn = useSelector((state: RootState) => stat)
```





#### 2.useDispatch





### React 管理 state

1. 组件中自己的state管理
2. Context数据的共享
3. 状态管理包 (Redux)



