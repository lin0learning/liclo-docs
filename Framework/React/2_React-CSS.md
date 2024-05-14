# React CSS

:::tip Overview

React中的CSS方案，大致分为以下几种：

- 内联样式CSS
- 普通CSS文件引入
- CSS Module
- CSS in JS
- classnames库
- tailwindcss

:::info 案例

umijs 各 react css方案 案例：[examples](https://github.com/umijs/umi/blob/master/examples/with-styled-components/)

:::









## 1. 内联样式

在 jsx/tsx 中，style属性接收一个由小驼峰命名属性的 JavaScript 对象，而不是 css 字符串。

**缺点：**

- 使用驼峰标识
- 缺少提示
- 伪类、伪元素等样式无法编写



## 2. Stylesheet

创建`.css`文件并进行样式的编写，之后再进行引入。在生产环境，所有的 CSS 文件会被集中并打包成一个被压缩的`.css`文件。

**缺点**：

- 普通 css 属于全局css，样式之间会互相影响；



## 3. css modules

- 所有使用了类似 webpack配置的环境下可以使用。
- 命名规则：`[name].module.css`

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



## 4. Less 的编写

`umijs`内置支持 less，不支持 sass 和 stylus，但如果有需求，可以通过 chainWebpack 配置或者 umi 插件的形式支持。

在React官方脚手架中，如果想进行配置CSS预处理器的`loader`等配置，可以使用npm库：`craco` 



## 5. CSS in JS

回顾：ES6 标签模板字符串

```ts
// 基本使用
const name = 'liccc'
const str = `my name is ${name}`

// 标签模板字符串使用
function foo(strs, ...args) {
  console.log(strs)
  console.log(args)
}
foo("a1", "b2", "c3")  // ['a1', 'b2', 'c3']  []

foo`my name is ${name}`  // [['my name is ', '', raw: []], 'liccc']  ['liccc']
```





### styled-components

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



在VSCode中，安装`vscode-styled-components`插件以提高编写效率。

`styled-components`支持样式的`<font color="red">继承</font>：

```tsx
// style.tsx
import styled from 'styled-components'

const MyButton = styled.button`
  padding: 8px 30px;
  border-radius: 5px;
  &:hover {
    transform: scale(1.05);
  }
  .second_text {
    background-color: cyan;
    color: black;
  }
`
const WarnButton = styled(MyButton)`
  background-color: red;
  color: #fff;
`

// app.tsx
import {MyButton} from './style'
const App = () => (
  <>
    <Title type='submit'>The styled component</Title>
    <Title as='a' href='#'>
      This is <span className='second_text'>styled component</span>
    </Title>
  </>
)
```

`styled-components` 提供 `<ThemeProvider>`组件来支持主题模式，底层原理为 React 的 `context` API，可以添加 `theme` prop 属性并添加属性值，在被 `<ThemeProvider>` 所包裹的组件，不管组件的层级有多深，都可以通过 `props` 访问到 `theme`：

:::code-group

```tsx {6,8} [App.tsx]
// App.tsx
import {ThemeProvider} from 'styled-components'
import theme from '../'

root.render(
  <ThemeProvider theme={theme}>
    <App/>
  </ThemeProvider>
)
```

```ts [theme.ts]
// theme.ts
const theme = {
  color: {
    pimaryColor: '#ff385c',
    secondaryColor: '#00848a'
  }
}
```

```typescript {5} [Children.ts]
// 后代组件样式
import styled from 'styled-components'

const HeaderWrapper = styled.css`
  color: ${props => props.theme.color.primaryColor}
`
```
:::



**创建带有 props 的样式组件**

```typescript
import styled from 'styled-components'

interface ButtonProps {
  color: string
  size: 'small' | 'medium' | 'large'
}

const Button = styled.button<ButtonProps>`
  color: ${props => props.color };
  font-size: ${props => {
    switch (props.size) {
      case 'small':
        return '12px'
        break
      case 'medium':
        return '16px'
        break
      case 'large':
        return '20px'
        break
      default:
        return '16px'
    }
  }}
`
```






### @emotions/css

```tsx
// style.ts
import { css } from '@emotion/css'

const ButtonClass = css`
	display: inline-block;
  margin-top: 20px;
  margin-left: 20px;
  .a-button {
  	&::before {}
  	&:active::before {}
  	&-primary {}
  }
`
export { ButtonClass }

// Button.tsx
import {ButtonClass} from './style'

const App = () => {
  return (
  	<div className={ButtonClass}></div>
  )
}
```



### 补充

针对父级元素的`content`类名，防止影响子元素样式，可使用`直接子元素选择器`

```tsx
<HomeWrapper>
  <div class='content'>
    <div class='section'>
      <div class='title'></div>
      <div class='content'></div>
    </div>
  </div>
</HomeWrapper>
```

```typescript
// 任何 css in js
const HomeWrapper = styled.div`
  > .content {
    width: 1032px;
    margin: 0 auto;
  }
`
```









## 6. classNames

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



## 7. CSS 预处理器

### sass
待完善...


### less
待完善...

