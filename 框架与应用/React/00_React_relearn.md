## tsx



#### 类组件与函数式组件类型声明

函数组件定义 props 类型：

1. 将类型添加到函数参数中

```tsx
interface TodoListItemProps { 
    todo: { 
        text:string 
        complete:boolean 
    } 
}
const TodoListItem = ({ todo }: TodoListItemProps) => {
    console.log(todo)
    return ( 
    // ... 
    ); 
};
```



2. 将类型作为泛型参数添加到FC类型

```tsx
interface TodoListItemProps { 
    todo: { 
        text:string 
        complete:boolean 
    } 
}
const TodoListItem: React.FC<TodoListItemProps> = ({ todo }) => {
    return( 
        // ... 
    );
};
```

使用`React.FC`来定义 React 组件时，<font color="red">不能使用</font> `setState()`函数，取而代之的是`useState()`、`useEffect` 等 Hooks API



类组件定义 state 和 props 类型：

```tsx
type StateType = {
  username: string;
};
type propType = {
  name: string;
  [propName: string]: any;
};
interface User {
  state: StateType;
  props:propType
}

class User extends Component {
  constructor(props: propType) {
    super(props)
  }
}
export default User
```





#### 生命周期

三个阶段：

- Mounting
- Updating
- Unmounting

![image-20231208144344798](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202312081443055.png)





**Mounting**

生命周期函数：`componentDidMount()`

```tsx
import CComponent from "./CComponent.tsx"
class App extends React.Component {
  // 1. 构造方法： constructor
  constructor() {
    // ...
    super()
    this.state = {
      isShow: true
    }
  }
  
  // 2. 执行 render 函数
  render() {
    const { isShow } = this.state
    // ..
    return (
    	// ..
      { isShow && <CComponent /> }
    )
  }
  
  // 3. 组件被渲染到DOM：被挂载到HTML DOM
  componentDidMount() {
    // ...
  }
  
  // 4. 组件更新 调用setstate()函数
  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>, snapshot?: any): void {
    // ..
  }
  
  // 5. 组件即将卸载
  componentWillUnmount(): void {
    // ...
  }
}
```



**Updating**

生命周期函数：`componentDidUpdate()`

- new props
- setstate()
- forceUpdate()

调用 `setstate()`函数时会执行`render()`函数



**Unmounting**

生命周期函数：`componentWillUnmount()`



**不常用生命周期**

```tsx
class App extends Component {
    shouldComponentUpdate(nextProps: Readonly<{}>, nextState: Readonly<{}>, nextContext: any): boolean {
    return true
  }

  getSnapshotBeforeUpdate(prevProps: Readonly<{}>, prevState: Readonly<{}>) {

  }
}
```









#### 组件通信

##### 1、父组件传递子组件

```tsx
// 父组件
import Header from "./docs-cpnts/tHeader";

const DocsPage = () => {
  const listData:string[] = ["home", "docs", "text", "github"]
  return (
  	<Header listData={listData}></Header>
  )
}

// 子组件
type propType = {
  listData?: string[]
}
type stateType = any
interface Header {
  props: propType
  state: stateType
}
class Header extends Component {
  // constructor(props: any) {
  //   super(props)
  //   // this.props = props  // 源码进行了以上操作，以将props保存到当前实例中，并能通过this获取
  // }
  render() {
    const { listData } = this.props
    return (
    	<div>{listData?.map((item, index) => (
        	<div key={index}>{item}</div>
        )})}</div>
    )
  }
}
```

**默认值及类型校验**

对于`类组件`时，对父组件传值进行默认值声明时，可以使用`defaulProps`属性来进行声明：

```tsx
export class MainBanner extends Component {
  // 写法2  (ES13)
  static defaultProps = { 
    banners: [],
  	title: "默认标题"
  }
}
// 写法1
MainBanner.defaultProps = {
  banners: [],
  title: "默认标题"
}
```

对于`函数式组件`，与类组件同理，进行类型限制时添加属性`propTypes`，默认值添加属性`defaultProps`



**补充：属性展开**

如果有了一个 `props` 对象，可以使用展开运算符 `...` 来在 JSX 中传递整个 props 对象。以下两个组件等价：

```jsx
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />
}
function App2() {
  const props = { firstName: "Ben", lastName: "Hector" }
  return <Greeting {...props} />
}
```





##### 2、子组件传递父组件

子组件向父组件传递消息：

- Vue中，通过自定义事件来完成；
- 在React中，通过`props`传递消息，父组件给子组件传递回调函数，并在父组件进行回调执行

>父组件传递回调函数给子组件，子组件自身事件执行后触发props回调函数，携带参数并执行父组件传递的回调函数，该回调函数会拿到传递的参数在父组件作用域执行，至此完成了子组件向父组件通信的流程

父组件

```tsx
// 父组件向子组件传递回调函数
import RoleManage from "./RoleManage"

class App extends Component {
  getProps(props) {
    console.log(props)
  }
  <RoleManage extendProps={(props) => this.getProps(props)}></RoleManage>
}
```

子组件

```tsx
type propType = {
  extendProps: (props: any) => void
}
type stateType = {}

interface RoleManage {
  props: propType
  state: stateType
}


class RoleManage extends Component {
  return (
  	<div onClick={() => this.extendProps("传递数据")}>子组件</div>
  )
  extendProps(props: any):void {
    this.props.extendProps(props)  // 父组件传递的方法(getProps)，通过回调函数参数传递
  }
}
```



##### 3. 子组件“插槽”的实现

在`Vue`中，通过`<slot></slot>`标签，可以在子组件中传递HTML内容，及其相关逻辑。

React对于插槽的两种方案：

1. 组件的`children`子元素（props属性children）

```jsx
import Header from "./header"

render() {
  return (
  	<Header>
    	<div>...content</div>
      {/* content */}
    </Header>
  )
}
```

子组件`Header`在props的children属性中获取到传递的`React.createElement`元素

1. `props`属性传递React元素（推荐）



##### 4、 子组件“作用域插槽”的实现

```tsx
// 父组件
class TabControl extends Component {
  render() {
    return (
    	<Typography itemType={(data) => <button>{data}</button>}></Typography>
    )
  }
}

// 子组件
type propsType = {
  itemType?: (el: any) => ReactNode
}

class Typography extends Component<propsType> {
  render() {
    const { itemType } = this.props
    return (
    	<div>
      	<div>作用域插槽：{ itemType ? itemType("h") : undefined }</div>
      </div>
    )
  }
}
```



##### 5. 非父子组件通信-Context

**Context应用场景**：非父子组件数据的共享，实现Vue `provide/inject` 、`app.provide`，共享“全局”的数据。

```jsx
import React from "react"
import Home from "./home"
import Header from "./header"

const ThemeContext = React.createContext()

function App() {
  return (
    <div>
    	<Home />
      <ThemeContext.Provider value={{color： "red"}}>
        <Header />
      </ThemeContext.Provider>
    </div>
  )
}
```

对要进行传递数据的组件用`ThemeContext.Provider`进行包裹，未包裹的组件将无法从 `context` 中获取数据。

```jsx
// 子组件
import { ThemeContext } from "./context/theme-context"

export class Header extends Component {
  render() {
    console.log(this.context)
  }
}

Header.contextType = ThemeContext
```

函数式组件中使用`Context`共享的数据：

方式一（<font color="red">遗留方式，不推荐！！</font>）

```jsx
import { ThemeContext } from "./context/theme-context"

function HomeBanner() {
  return <div>
  	<ThemeContext.Consumer>
    	{ value => { return <h2>{value.color}</h2> } }
    </ThemeContext.Consumer>
  </div>
}
```

```jsx
function HomeBanner() {
  const theme = useContext(ThemeContext)
  return <div>{theme}</div>
}
```





类组件也可使用`xxxContext.Consumer`来获取context传递的数据

```jsx
const ThemeContext = createContext('light');

return (
  <Home />
  <ThemeContext.Provider>
  </ThemeContext.Provider>
)
```

由于 `Home`组件并没有作为`ThemeContext.Provider`的后代元素，在获取context值时，只能获取themecontext的默认值。



##### 6. 非父子组件通信-事件总线

第三方eventBus库



#### setState

与Vue的区别：React 没有使用 类似`Object.defineProperty` 或者 `Proxy` 的方式来监听数据的变化或者劫持数据，<font color="red">必须通过setState来告知React数据发生了变化</font>；

setState方法是从Ccomponent中继承过来

```js
Component.prototype.setState = function(partialState, callback) {}
```

```js
// setState 可以传入一个回调函数
// 好处一：可以编写新的state的逻辑
// 好处二：当前的回调函数会将之前的state和props传递过来
this.setState((state, props) => {
  //...
  return {
    // ...
  }
})
```

##### 1. 异步还是同步

 `setState()`为<font color="red">异步调用</font>（React18及以后）。   `setState(state, callback)`中的callback会在数据合并后执行。



##### 2. PureComponent

```jsx
class App extends Component {
  render() {
    const curTitle = this.state
    return (
      <div>
        <Header title={curTitle}/>
        <Main />
        <Footer />
      </div>
    )
  }
}
```



如果当前的组件为<font color="red">类组件</font>，为了减少由于setState函数的执行而带来的非props、state改变而调用`render()`函数的影响，可以使用 `PureComponent`来降低负担

- 将 `class` 继承自 `PureComponent`

```tsx
import { PureComponent } from 'react'

class App extends PureComponent {}
```



##### 3. memo

判断函数式组件 props 是否发生改变，如果未发生改变则不再次调用 render 函数。

如果当前的组件为<font color="red">函数式组件</font>：

```tsx
import { memo } from 'react'

const Profile = memo((props) => {
  return <h2>Profile</h2>
})
```



#### ref

##### 1. Refs与类组件

```tsx
import React, {createRef, PureComponent} from 'react'

class MyComponent extends PureComponent {
  private buttonRef = createRef<HTMLButtonElement>()
  
  render() {
    return <Button ref={this.buttonRef}></Button>
  }
}
```



##### 2. Refs与函数式组件

```tsx
import React, {createRef} from 'react'

type Props = {}

const CustomTextInput = (props: Props) => {
  const textInput = createRef<HTMLButtonElement>()
  
  function handleClick() {
    if (textInput) {
      textInput.current.focus()
    }
  }
  return (
  	<div>
    	<input type="text" ref={textInput} />
    </div>
  )
}

export default React.memo(CustomTextInput)
```

对组件的绑定类似，可以获取组件本身及其内部方法等。

```tsx
return (
	<div>
  	<HelloWorld ref={this.hwRef} />
    <HelloTS ref={this.htRef} />
  </div>
)
```

对函数组件而言，<font color="red">函数组件没有实例</font>，绑定ref将会抛出警告：
```
Warning: Function components cannot be given refs.
```

ref不能应用于函数式组件：

- 函数式组件没有实例，不能获取到对应的组件对象
- 通过`React.forwardRef()`函数来获取函数式组件



#### 受控组件

> You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field.

当表单元素绑定`value`属性时，该组件为受控组件，当前元素的值不再由浏览器用户输入/选择的内容决定。

- 被React 以 state 控制取值的表单输入元素为 “受控组件”

```tsx
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: "admin"
    }
  }
  render() {
    const { username } = this.state
    return (
    	<div>
      	<input value={username} onChange={e => this.inputChange(e)} />
      </div>
    )
  }
  inputChange(e) {
    this.setState({username: e.target.value})
  }
}
```



补充：`Array.from`参数

将类数组对象转换成数组元素，第一个参数为可迭代对象，第二个参数为map函数



#### 非受控组件

- 受控组件，表单数据由 React 组件来管理；
- 非受控组件，表单数据交由 DOM 节点来处理。





#### React 高阶组件(HOC)

第三方库应用举例：

- redux中的  connect
- react-router中的 withRouter

高阶组件(HOC)

使用`React.ComponentType`定义组件的类型

```ts
type ComponentType<P = {}> = ComponentClass<P> | FunctionComponnet<P>
```

##### 1. 应用

应用：将`Context.Provider`提供的`value`通过高阶组件注入到原始组件的`props`中

```tsx
// withContext
import type { ComponentType } from 'react'
import { SomeContext } from './some_context'

function withContext(OriginComponent: ComponentType) {
  return (props: any) => {
    return (
    	<ThemeContext.Consumer>
      	{(value) => {
          {/* {...value}  关键 */}
          return <OriginComponent {...value} {...props}></OriginComponent>
        }}
      </ThemeContext.Consumer>
    )
  }
}
```



##### 2. 缺点

- HOC需要在原组件上进行包裹或嵌套，如果大量使用HOC，会产生多层嵌套，使得调试变得困难；
- HOC可以劫持 props，在不遵守约定的情况下也可能造成冲突。



##### 3. Portals的使用

某些情况下，希望渲染的内容独立于父组件，或独立于当前挂载到的DOM元素中，可以使用 `Portals`，类似Vue中的`Teleport`组件

```ts
// createPortal 类型
export function createPortal(
	children: ReactNode,
  container: Element | DocumentFragment,
   key?: null | string
): ReactPortal
```

```tsx
import { PureComponent } from 'react'
import { createPortal } from 'react-dom'

class App extends PureComponent {
  return (
  	<div>
      {/* other content */}
    	{
      	createPortal(<h2>Content</h2>, document.querySelector("#root") as Element)
      }  
    </div>	
  )
}
```

最佳实践：

- `Modal`组件
- `Message`组件



##### 4. Fragment

`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node.

`Vue3` template 支持同样功能

1. 写法一

```tsx
import {Fragment} from 'react'

const App = () => {
  return (
  	<Fragment>
      <title>App 标题</title>
      <header>Header</header>
      <nav>Nav</nav>
      <main>Main</main>
      <footer>Footer</footer>
    </Fragment>
  )
}
```

2. 写法二（短语法）

```html
<>
  <OneChild />
  <AnotherChild />
</>
```

在对元素内容绑定`key`值时，`<></>`的写法不可取，需完整的写出`Fragment`：

```html
<Fragment key={xxx}>
  <!-- content  -->
</Fragment>
```



#### React-transition-group （了解）

**暂时跳过**

该npm包提供四个主要组件：

1. `Transition`
2. `CSSTransition`
3. `SwitchTransition`
4. `TransitionGroup`



#### React CSS

React中的CSS方案，大致分为以下几种：

- 内联样式CSS
- 普通CSS文件引入
- CSS Module
- CSS in JS
- classnames库
- tailwindcss



##### 1. 内联样式

在 jsx/tsx 中，style属性接收一个由小驼峰命名属性的 JavaScript 对象，而不是 css 字符串。

**缺点：**

- 使用驼峰标识
- 缺少提示
- 伪类、伪元素等样式无法编写



##### 2. 普通 css 

创建`.css`文件并进行样式的编写，之后再进行引入。

**缺点**：

- 普通 css 属于全局css，样式之间会互相影响；



##### 3. css modules

- 所有使用了类似 webpack配置的环境下可以使用。

自行配置`webpack.config.js`：

```js
{
  modules: true,
}
```



- React 脚手架 内置了 css modules 的配置：
  - .css/.less/.scss 等样式文件都需要修改成 .moduule.css/ .module.less/ .module.scss 等；
  - 在jsx/tsx文件中，以模块的方式引入样式文件，并且对className使用对象属性方式添加类名：

```tsx
import Index from "./index.module.css"

const CSSModule = () => {
  return (
  	<div className={Index.title}>css modules</div>
  )
}
```

- **缺陷**：
  - 引用的类名，<font color="red">不能使用连接符(.home-title)</font>，这在 JavaScript中不能被识别；
  - 所有的<font color="red"> className 都必须使用 `{style.cassName}` 的形式</font>来编写;
  - 不适合<font color="red">动态修改样式</font>，依然<font color="red">需要使用内联样式的方式</font>；



##### 4. Less 的编写

`umijs`内置支持 less，不支持 sass 和 stylus，但如果有需求，可以通过 chainWebpack 配置或者 umi 插件的形式支持。

在React官方脚手架中，如果想进行配置CSS预处理器的`loader`等配置，可以使用npm库：`craco` 



##### 5. CSS in JS

- `@emotion/react`、`@emotion/styled`
- `styled-components`
- `glamorous`

在 umi 中，需要先安装`@umijs/plugins`，再通过配置开启：

```js
$ npm i @umijs/plugins -D
export default {
  plugins: ['@umijs/plugins/dist/styled-components'],
  styledComponents: {},
}
```



回顾：ES6 标签模板字符串

```ts
// 基本使用
const name = 'liccc'
const str = `my name is ${name}`

// 标签模板字符串使用
function foo(...args) {
  console.log(args)
}
foo("a1", "b2", "c3")  // ['a1', 'b2', 'c3']

foo`my name is ${name}`  // [['my name is ', '', raw: []], 'liccc']
```



在VSCode中，安装`vscode-styled-components`插件以提高编写效率。

`styled-components`支持样式的`<font color="red">继承</font>：

```tsx
const MyButton = styled.button`
	padding: 8px 30px;
	border-radius: 5px;
`

const WarnButton = styled(MyButton)`
	background-color: red;
	color: #fff;
`
```



##### React 中添加 class

除了js进行判断，可以使用`classnames`库：

![image-20240102171408328](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202401021714793.png)

```bash
npm install classnames
```

```tsx
import _ from "classnames"
const App = () => {
  return (
  	<div className={_("classAs")}>App</div>
  )
}
```







#### Redux

##### 1. Redux 上手

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



##### 2. React + Redux

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



##### 3. Redux 异步数据请求与存储

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



#### Redux Toolkit (RTK)

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



##### 组件Props类型获取

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



##### RTK的异步操作

在之前的开发中，通过 redux-thunk 中间件让 dispatch 进行异步操作。

##### 1. createAsyncThunk

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
})
```

当`createAsyncThunk`创建的`action`被`dispatch`时，会存在三种状态：

- `pending`
- `fulfilled`
- `rejected`

##### 2. extraReducers

```ts
const userSlice = createSlice({
  // ...
  extraReducers: (build) => {
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



##### 3. 实现 connect函数

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



##### 4. 回顾

**一、Redux 用法**

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



**二、ReduxToolKit(RTK)**

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



#### React Hooks

> Functions starting with `use` are called *Hooks*.

##### 1. useState

```js
import { useState } from 'react'

function MyButton() {
  const [count, setCount] = useState(0)
  // ...
}

```

从`useState`中解构的：

- `count`：初始state
- `setCount`：更新state的方法
