# React Hooks

::: tip

- Hooks tutorial
- State/Effect
- Context/Reducer
- Callback/Memo
- Ref/LayoutEffect
- 自定义 Hooks

:::

> Functions starting with `use` are called *Hooks*.


React *Hooks* 在 React v16.8.0 被推出，可以在<font color="red">不编写class的情况下</font>使用<font color="red">state以及其他的React特性</font>。

- 普通函数，不能使用hooks
- 自定义hooks函数中（使用`use`开头），可以使用react提供的其他hooks








## React 范式

```jsx
function Users() {
  // State
  const [user, setUsers] = useState(newUser);
  
  // Derived state
  const activeUsers = users.filter(u => u.active);
  
  // Other hooks
  const logger = usLogger();
  
  // Functions
  function onSubmit() {
    
  }
  
  return (
  	// JSX here
  )
}
```





## 1. useState

函数式组件在修改自身state数据时，如果直接修改，不会重新执行render函数，导致没有重新渲染。

```tsx
import { useState } from 'react'

function MyButton() {
  const [count, setCount] = useState(0)
  const [list, setList] = useState([])
  // ...
}

```

从`useState`中解构的：

- `count`：初始state
- `setCount`：更新state的方法

```tsx
import { getScoreList, type HomeResult } from '@/services/index'

function App() {
  const [highScore, setHighScore] = useState<HomeResult | null>(null)
  
  useEffect(() => {
    getScoreList().then(res => {
      setHighScore(res)
    })
  }, [])
}
```







## 2. useEffect

```tsx
import {useEffect} from 'react'
```

```typescript
type EffectCallback = () => (void | (() => void | undefined))
```

清除Effect（副作用）：在class组件中，需要在`componentWillUnmount`中进行清除，可以多次使用useEffect，按功能单独执行。

```ts
useEffect(() => {}, [])
```

useEffect函数的第二个参数接收一个数组，数组元素关联useEffect的重新执行；如果为空数组，则不受其他数据关联，只会在组件首次渲染时执行一次。

**应用一**
```tsx
import React, { memo, useState, useEffect } from 'react'

const Effect = memo(() => {
  const [counter, setCounter] = useState(0)
  useEffect(() => {
    console.log('current counter: ', counter)
  }, [counter])
  
  useEffect(() => {
    document.title = 'React Hooks'
    console.log('React Hooks')
    return () => {
      // 取消监听等操作，第二个参数为空数组时，该回调函数只会在组件被卸载时，执行一次
    }
  }, [])
  return (
    <div>
      <h3>Effect</h3>
      <div>counter: {counter}</div>
      <button onClick={e => setCounter(counter + 1)}>+1</button>
    </div>
  )
})

export default Effect
```

**应用二**
```tsx
const FullScreenModal = memo((props: any) => {
  useEffect(() => {
    // 全屏模态框打开时，移除浏览器滚动条；关闭时恢复滚动条
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])
})
```


## 3. Context/Reducer

#### useContext

在<font color="red">类组件</font>编写中，对组件共享Context的两种方式：

- <font color="red">类名.contextType = MyContext</font>
- 通过<font color="red">MyContext.Consumer</font>



使用`useContext`hook：

```tsx
// user-context.js
import { createContext } from "react"
interface InfoType = {
  name?: string
  code?: string
}
export const UserContext = createContext<InfoType>({})

// App.jsx
import { UserContext } from '.context/user-context'

<UserContext.Provider value="the context">
  {/**/}
</UserContext.Provide>


// component
import { useContext } from 'react'
import { ThemeContext } from '../context/theme-context'

function xxxx() {
  const user = useContext(ThemeContext)
}
```



类组件使用

```tsx
type Props = {
  children: React.ReactNode[]
}
type State = {
  color: string
  setColor: (color:string)=>void
}

class ThemeProvide extends React.Component<Props, State>{
  constructor(props: Props) {
    super(props)
    this.state = {
      color: 'blue',
      setColor: (color:string) => this.setState({...this.state, color})
    }
  }
  
  render() {
    const {color, setColor} = this.state
    return (
    	<ThemeCtx.Provider value={{color, setColor}}>
        {this.props.children}
      </ThemeCtx.Provider>
    )
  }
}
```







### useReducer

以基本reduer为例：

```tsx
const initialState = {}
function reducer(state, action) {
  switch(action.type) {
    case "increment":
      return {...state, counter: state.counter + 1}
    case "decrement":
      return {...state, counter: state.counter - 1}
    case "add_number":
      return {...state, counter: state.counter + action.num}
    default:
      return state
  }
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, initialState, init?)
                                       
  const [state, dispatch] = useReducer(reducer, {counter: 0, friends: [], user: {} })
  const [counter, setCounter] = useState()
  const [friends, setFriends] = useState()
  const [user, setUser] = useState()
  
  return (
  	<button onClick={e => dispatch({type: 'increment'})}>+1</button>
  )
}
```

- useReducer为某些情况下useState的替代方案
- 数据不能共享，只是使用了相同的reducer函数



## 4. Callback/Memo

### useCallback

```js
useCallback(fn, dependencies) // 性能优化
```

在组件顶层调用`useCallback`以便在多次渲染中缓存函数：

```tsx
import React, {memo, useState, useCallback} from 'react'

const App = memo(() => {
  const [count, setCount] = useState(0)
  const handleCount = useCallback(() => {
    setCount(count + 1)
  }, [count])
})
```





### useMemo

```js
useMemo(calculateValue, dependencies)
```

在组件的顶层调用`useMemo`来缓存每次重新渲染都需要计算的结果。

```tsx
const ChangeButton = () => {
  return useMeon(() => {
    return (
    	<div>
      	<button onClick={e => setValue(value => (!value))}>change value</button>
      </div>
    )
  }, [setValue])
}

export default ChangeButton
```

```tsx
function calcTotal() {}

const Memo = memo(() => {
  let result = useMemo(() => calcTotal, [])
})
```

useCallback 和 useMemo：

```js
useCallback(fn, [])
useMemo(() => fn, [])
```





## 5. useRef

useRef 返回一个 ref 对象，返回的 ref对象在组件的整个生命周期保持不变。

**通过 ref 操作 DOM**

> 在类组件中，使用 `createRef` 创建 ref 对象

首先，声明一个 初始值 为 null 的 `ref对象`

```tsx
import {useRef} from 'react'

function MyComponent() {
  const inputRef = useRef(null)
}
```

将 ref 对象 作为 ref属性传递给DOM节点的 JSX：

```tsx
return <input ref={inputRef} />
```

渲染完成时，React 会把 DOM 节点设置为 ref 对象的 `current`属性。

```js
function handleClick() {
  inputRef.current.focus();
}
```





**解决闭包陷阱**

```tsx
function App() {
  const [count, setCount] = useState(0)
  
  // useRef
 	const countRef = useRef()
  countRef.current = count
  
  const increment = useCallback(() => {
    setCount(countRef.current + 1)
  }, [])
}
```



## 6. useImperativeHandle(了解)

```typescript
function useImperativeHandle<T, R extends T>(
	ref: Ref<T> | undefined,
  init: () => R,
  deps?: DependencyList
): void
```

案例：
```tsx
type InputRef = {
  click:() => void
  setValue:(params: string) => void
}
type Props = {}

const HelloWorld = memo(
	forwardRef<InputRef, Props>((props, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    
    // 子组件对父组件传入并绑定的ref进行处理
    useImperativeHandle(ref, () => {
      return {
        click() {
          inputRef.current!.focus()
        },
        setValue(value) {
          inputRef.current!.value = value
          inputRef.current!.focus()
        }
      }
    }, [])
    return <input type="text" ref={inputRef} />
  })
)

const App = () => {
  const inputRef = useRef<InputRef>(null)
  
  return <div>
  	<HelloWorld ref={inputRef} />  {/* 父组件中对子组件中绑定的 ref 为useImperativeHandle 对 ref 进行处理的自定义对象 */}
  </div>
}
```



### forwardRef（回顾）

`React.forwardRef`字面意思理解为转发Ref，它会创建一个React组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。其主要作用是：

**1.转发refs到DOM组件**（ref不像props作为参数可以传递，所以要想传递ref得用forwardRef）

```tsx
const FancyButton = React.forwardRef((props, ref) => (
	<button ref={ref} className="FancyButton">
  	{props.children}
 	</button>
))

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

**2.在高阶组件中转发 refs**

>**注意：**在使用 `memo`时，应注意函数调用顺序，forwardRef requires a render function.Instead of `forwardRef(memo(...))`, use `memo(forwardRef(...))`

```tsx
import {memo, forwardRef} from 'react'

const App = memo(
	forwardRef<RefType, PropsType>((props, ref) => {
    // ...
  })
)
```



## 7. useLayoutEffect

> React **不推荐使用** useLayoutEffect

useLayoutEffect 和 useEffect 非常相似，它们仅有的区别为：

- useEffect 会在渲染的内容更新到 DOM 上后执行，不会阻塞 DOM 的更新；
- useLayoutEffect 会在渲染的内容更新到 DOM 上之前执行，会阻塞 DOM 的更新



## 自定义 Hook

### 1. Context 共享

```tsx
const useUserToken = () => {
  const user = useContext(UserContext)
  const token = useContext(TokenContext)
  
  return [user, token]
}
```



### 2. 获取 document 滚动高度

```tsx
import {useState} from 'react'

function useScrollPosition() {
  const [scrollX, setScrollX] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    function handleScroll() {
      setScrollX(window.scrollX)
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return [scrollX, scrollY]
}
```



## React v18.0 新增 hooks

- useDeferredValue
- useTransition
- useId

针对 Library 的 hooks， `Library Hooks`：

- useSyncExternalStore
- useInsertionEffect



赋值表达式左侧不能是可选属性访问

```typescript
type InputRef = HTMLInputElement | null
let inputRef:InputRef = useRef<InputRef>(null)

inputRef.current!.value = "xxx"  // ! not null 断言
```





## Redux Hooks

redux使用经历：

1. `redux`：

   - actionCreator.ts

   - constants.ts

   - reducer.ts

   - index.ts

2. `react-redux`：使用`connect`高阶组件 

   ```js
   connect(mapStateToProps, mapDispatchToProps)(App)
   ```



Redux v7.1开始，提供 Hook 方式

- useSelector
- useDispatch



### 1. useSelector

将`state`映射到组件中。

>  note: Selectors that return a new reference (such as an `object` or an `array`) should be memoized. [Optimizing Selectors with Memoization](https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization)

```tsx
// 写法一（推荐）
const counter = useSelector<RootState, number>((state) => state.counter.counter)

// 写法二（会导致重复渲染，不推荐）
const state = useSelector<RootState, {counter: number}>((state) =>({
  counter: state.counter.counter
}))
```

> Selector unknown returned a different result when called with the same parameters. This can lead to unnecessary rerenders.

解决方法：

1. 使用写法一
2. 使用`shallowEqual`

```tsx
import { useSelector, shallowEqual } from 'react-redux'

const state = useSelector<RootState, {counter: number}>((state) =>({
  counter: state.counter.counter
}), shallowEqual)
```



### 2. useDispatch

直接获取`dispatch`函数，在组件中直接使用。

```typescript
import {useDispatch} from 'react'
import { calcNumber } from './store/modules/counter'

const dispatch = useDispatch()
// 方式一
dispatch(calcNumber(num))
// 方式二
dispatch({ type: 'counter/calcNumber', payload: num })
```



meme高阶组件包裹的组件有以下特点：

- 只有props发生改变时，才会重新渲染
