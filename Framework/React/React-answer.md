#### 1. render()

> <font color="red">已废弃</font>

通过调用 `render` 函数，可以在浏览器的 DOM 元素中展示 React 组件。

```react
import { render } from 'react-dom'
import App from './app.js'

const root = document.getElementById('root')

render(<App/>, root)
```

注意：在 React 18 中，`render` 函数将被 [`createRoot`](https://zh-hans.react.dev/reference/react-dom/client/createRoot) 函数替换。

调用 `createRoot` 以在浏览器 DOM 元素中创建根节点显示内容：

```react
import { createRoot } from 'react-dom/client'
import App from './app.js'

const node = document.getElementById('root')
const root = createRoot(node)

root.render(<App/>)
```

