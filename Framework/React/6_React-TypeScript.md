# React & TypeScript

## Typescript基础

### Partial`<T>`

> 将传入的类型T中的所有属性设置为可选

```typescript
type Person =  {
  name: string
  age: number
}

type PartialPerson = Partial<Person>

// 相当于类型：

// type PartialPerson =  { name?:string , age?:number }
```



### Required`<T>`

> 将类型T的所有属性设置为必需

```typescript
type Person =  {
  name?: string
  age?: number
}

type RequiredPerson = Required<Person>

// 相当于类型：

// type RequiredPerson = { name: string, age: number }
```



### Pick`<T,K>`

> 从类型T中选择指定属性K的子集生成新类型

```typescript
type Person = {
  name: string
  age: number
  address: string
}

type PersonNameAndAge = Pick<Person, "name" | "age">
```



### Record`<K,T>`

```typescript
type Fruit = "apple" | "banana" | "orange"
type FruitInventory = Record<Fruit, number>
// type FruitInventory = { apple: number, banana: number, orange: number }
```



### 其他工具类型

**ReadOnly`<T>`**

> 将类型T的所有属性设置为只读

**Exclude`<T,U>`**

> 从类型T中排除可以赋值给类型U的子类型

**Extract`<T,U>`**

> 从类型T中提取出可以赋值给类型U的子类型

**NonNullable`<T>`**

> 从类型T中排除null和undefined

**ReturnType`<T>`**

> 获取函数类型T的返回值类型





### 类型声明文件-d.ts

和一般ts文件的区别：

1. d.ts文件只能包含类型声明代码
2. d.ts文件不参与编译，不会生成JS代码



## TypeScript 与 React

### Hooks与TypeScript

**useState**

```typescript
import {useState} from 'react'

type User = {
  name: string
  age?: number
}

const [user, setUser] = useState<User | null>(null)
```



**useRef**

```typescript
import {useRef} from 'react'

const divRef = useRef<HTMLDivElement>(null)
```



**useReducer**

```typescript
import { type Reducer, useReducer } from 'react'

type State = number

type Action = 
	|{ type: 'INCREASE' } |{ type: 'DECREASE' }

const reducer: Reducer<State, Action> = (state, action) => {
  case 'INCREASE':
  	return state + 1
  case 'DECREASE':
  	return state - 1
}

function App() {
  const [state, dispatch] = useReducer(reducer, 0)
}
```



**useContext**

```typescript
import { createContext, useContext } from 'react'

type UserContextType = {
  name: string
  age: number
}

const UserContext = createContext<UserContextType>({
  name: 'jack',
  age: 18
})

function Parent() {
  return (
  	<>
      <UserContext.Provider value={{name: 'sss', age: 28}}>
    		<Son/>
      </UserContext.Provider>
    </>
  )
}

function Son() {
  const userInfo = useContext(UserContext)
}
```



### `styled-components` props

在使用 `styled-components`的CSS in JS库时，对样式组件传入props，并声明时控制台报错：

```
styled-components: it looks like an unknown prop "xxx" is being sent through to the DOM, which will likely trigger a React console error. If you would like automatic filtering of unknown props, you can opt-into that behavior via `<StyleSheetManager shouldForwardProp={...}>` (connect an API like `@emotion/is-prop-valid`) or consider using transient props (`$` prefix for automatic filtering.) 
```

```tsx
import styled from 'styled-components'

const ItemWrapper = styled.div<{
  $columns: number
}>`
	--gap: 1rem;
	--columns: ${props => props.$columns};
	width: calc((100% - var(--columns - 1) * var(--gap)) / var(--columns));
`

type Props = {
  item: List1
  columns?: number
}

const RoomItem = (props: Props) => {
  const {item, columns = 4} = props
  return (
  	<ItemWrapper $columns={columns}></ItemWrapper>
  )
}
```

可以声明props变量时，对变量前加`$`符号或使用类似插件。





### immutable in react

> - **our reducers are \*never\* allowed to mutate the original / current state values!**
> - **A critical rule of immutable updates is that you must make a copy of \*every\* level of nesting that needs to be updated.**

```js
/** illegal and wrong */
state.value = 123

/** safe, made a copy */
return {
  ...state,
  value: 123
}
```

typical example look like:

```js
function handlewrittenReducer(state, action) {
  return {
    ...state,
    first: {
      ...state.first,
      // overwrite part
      second: {
        ...state.first.second,
        [action.someId]: {
          ...state.first.second[action.someId],
          // overwrite part
          fourth: action.someValue
        }
      }
    }
  }
}
```





### 组件库打包

<img src="https://cdn.nlark.com/yuque/0/2023/png/274425/1699422457859-c7f5cd77-8db6-4f83-8e8f-5d80dc086cab.png" alt="img" style="zoom: 50%;" />

`Vite` 除了常规web项目的打包之外，也支持 `库模式打包`，只需要简单配置。

```typescript
// vite.config.ts
/// <reference types="vitest" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/package/index.ts'),
      name: 'AntDMiniUI',
      fileName: 'antd-mini-ui',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React',
          'react-dom': 'ReactDom',
        },
      },
    },
  },
})
```



### 生成 `d.ts` 类型文件

借助插件 `vite-plugin-dts`
