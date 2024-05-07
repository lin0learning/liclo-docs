# React 组件



## 类组件与函数式组件类型声明

**函数组件定义 props 类型：**

1. 将类型添加到函数参数中

```tsx
interface Props { 
    todo: { 
        text:string 
        complete:boolean 
    } 
}
const TodoListItem = ({ todo }: Props) => {
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

使用`React.FC`来定义 React 组件时，<font color="red">不能使用</font> `setState()`函数，取而代之的是`useState()`、`useEffect` 等 Hooks API。换言之，函数组件只能使用 hooks 来定义状态。



**类组件定义 state 和 props 类型：**

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



**组件的 displayName 属性：**

在React中，为组件添加`displayName`属性的主要作用是方便调试和识别组件。在开发过程中，尤其是在查看浏览器开发者工具（如React DevTools扩展）时，`displayName`属性的值会显示为组件的名称，这对于追踪组件层次结构、查找特定组件以及理解组件之间的交互非常有用。

对于类组件：

```tsx
class MyComponent extends React.Component {
  static displayName = 'MyComponentDisplayName'
  // ...
}
```

对于函数组件：

```tsx
const MyComponent = (props) => {
  // ...
}
MyComponent.displayName = 'MyComponentDisplayName'
```

另外，若项目使用了 `create-react-app`、TypeScript 或其他<font color="red">支持装饰器的工具链</font>，还可通过装饰器自动设置 `displayName`：

```tsx
import { withDisplayName } from 'some-decorator-library'

@withDisplayName('MyDecoratedComponent)
class DecoratedComponent extends React.Component {
  // ...
}
```



## 生命周期

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









## 组件通信

### 1、父组件传递子组件

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
    	<div>
        {listData?.map((item, index) => (
        	<div key={index}>{item}</div>
        )})}
      </div>
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





### 2、子组件传递父组件

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



### 3. 子组件“插槽”的实现

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

2. `props`属性传递React元素（推荐）

```tsx
```







### 4、 子组件“作用域插槽”的实现

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



### 5. 非父子组件通信-Context

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



### 6. 非父子组件通信-事件总线

第三方eventBus库



## setState

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

### 1. 异步还是同步

 `setState()`为<font color="red">异步调用</font>（React18及以后）。   `setState(state, callback)`中的callback会在数据合并后执行。



### 2. PureComponent

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



### 3. memo

判断函数式组件 props 是否发生改变，如果未发生改变则不再次调用 render 函数。

如果当前的组件为<font color="red">函数式组件</font>：

```tsx
import { memo } from 'react'

const Profile = memo((props) => {
  return <h2>Profile</h2>
})
```



## ref

### 1. Refs与类组件

```tsx
import React, {createRef, PureComponent} from 'react'

class MyComponent extends PureComponent {
  private buttonRef = createRef<HTMLButtonElement>()
  
  render() {
    return <Button ref={this.buttonRef}></Button>
  }
}
```



### 2. Refs与函数式组件

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



### 3. forwardRef()

`forwardRef` 允许组件使用 [ref](https://zh-hans.react.dev/learn/manipulating-the-dom-with-refs) 将 DOM 节点暴露给父组件。

```tsx
const SomeComponent = forwardRef(render)

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
})
```

参数：

- `render`：组件的渲染函数。React 会调用该函数并传入父组件传递的 props 和 `ref`。返回的 JSX 将作为组件的输出。

应用案例：

```tsx
import { forwardRef, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
    	<input type={type} className={className} ref={ref} {...props} />
    )
  }
)
```











## 受控组件

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



## 非受控组件

- 受控组件，表单数据由 React 组件来管理；
- 非受控组件，表单数据交由 DOM 节点来处理。



## React 高阶组件(HOC)

第三方库应用举例：

- redux中的  connect
- react-router中的 withRouter

高阶组件(HOC)

使用`React.ComponentType`定义组件的类型

```ts
type ComponentType<P = {}> = ComponentClass<P> | FunctionComponnet<P>
```

### 1. 应用

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



### 2. 缺点

- HOC需要在原组件上进行包裹或嵌套，如果大量使用HOC，会产生多层嵌套，使得调试变得困难；
- HOC可以劫持 props，在不遵守约定的情况下也可能造成冲突。



### 3. createPortals

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



### 4. Fragment

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



## React-transition-group（了解）

**暂时跳过**

该npm包提供四个主要组件：

1. `Transition`
2. `CSSTransition`
3. `SwitchTransition`
4. `TransitionGroup`