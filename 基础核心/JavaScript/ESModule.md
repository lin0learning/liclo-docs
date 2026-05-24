# export & import

>  文章出处：张鑫旭博客[《万岁，浏览器原生支持ES6 export和import模块啦！》](https://www.zhangxinxu.com/wordpress/2018/08/browser-native-es6-export-import-module/)



## 一、静态import

```html	
<script type="module">
	import * as module from "./xxx.mjs";
  module.default();
</script>
```



## 二、nomodule与向下兼容

模块脚本可以使用`type="module"`进行设定。对于并不支持`export`和`import`的浏览器，可以使用nomodule进行向下兼容。

```html
<script type="module" src="module.mjs"></script>
<script nomodule src="fallback.js"></script>
```

但在一些低端浏览器`.mjs`资源会冗余加载。



## 三、静态import细节

### 1. 默认 Defer 行为

传统`<script>`属性支持一个名为`defer`的属性值，可以让JS资源异步加载，同时保持顺序。

对于`type="module"`的`<script>`元素，天然外挂`defer`特性，也就是天然异步，所有module脚本按顺序：

```html
<!-- 2 -->
<script type="module" src="1.mjs"></script>

<!-- 1 -->
<script src="2.js"></script>

<!-- 3 -->
<script defer src="3.js"></script>
```



### 2. 内联script同样defer特性

```html
<script type="module">
  console.log("Inline module执行");
</script>

<script src="1.js"></script>

<script defer>
  console.log("Inline script执行");
</script>

<script defer src="2.js"></script>
```

最后的执行顺序是：`1.js`，`Inline script`，`Inline module`，`2.js`。原因在于，传统的内联`<script>`是没有`defer`这种概念的，从不异步。



### 3. 支持async

无论是内联的module `<script>`还是外链的`<script>`，都支持`async`这个异步标识属性。

`async`和`defer`都可以让JavaScript异步加载，区别在于`defer`保证执行顺序，而`async`谁先加载好谁先执行。这个特性表现在`type="module"`的`<script>`元素这里同样适用。



### 4. 模块只会执行一次

传统的`<script>`如果引入的JS文件地址是一样的，则JS会执行多次。但是，对于`type="module"`的`<script>`元素，即使模块地址一模一样，也只会执行一次。

```html
<!-- 1.mjs只会执行一次 -->
<script type="module" src="1.mjs"></script>
<script type="module" src="1.mjs"></script>
<script type="module">
  import "./1.mjs";
</script>

<!-- 下面传统JS引入会执行2次 -->
<script src="2.js"></script>
<script src="2.js"></script>
```



### 5. 总是CORS跨域

正常CDN引入js资源不会跨域，如果是esmodule，则会CORS跨域。

```html
<script type="module" src="//apps.bdimg.com/.../jquery.min.js"></script>
```



### 6. 无凭证

如果请求来自同一个源（域名一样），大多数基于CORS的API将发送凭证（如cookie等），但`fetch()`和模块脚本是例外 – 除非您要求，否则它们不会发送凭证：

```html
<!-- ① 获取资源会带上凭证（如cookie等）-->
<script src="1.js"></script>

<!-- ② 获取资源不带凭证 -->
<script type="module" src="1.mjs"></script>
```



### 7. 天然严格模式

import的JS模块代码天然严格模式



## 四、require和import的区别



|                 | 年份 | 出处                 |
| --------------- | ---- | -------------------- |
| require/exports | 2009 | CommonJS             |
| import/export   | 2015 | ECMAScript2015 (ES6) |

浏览器引入模块的 `<script>`元素要添加 `type="module"` 属性，但 **module 不支持 FTP文件协议 (file://)，只支持 HTTP 协议**，所以本地需要使用 http-server 等本地网络服务器打开页面。



动态导入 import()

```js
import('/modules/my-module.js').then((module) => {
  // Do something with the module.
})
```





## 五、模块重导(Re-export)

> 在优化文件`import`语句以防止占用较多代码行（满屏）方面，模块重导不失为一种较好方式。

以组件库为例，通过重导在`components/index.tsx`文件中，使用一个`import`可同时导入多个组件。

```ts
// 不使用重导
import Modal from '@arco-design/web-react/es/Modal'
import Checkbox from '@arco-design/web-react/es/Checkbox'
import Message from '@arco-design/web-react/es/Message'

// 使用模块重导
import { Modal, Checkbox, Message} from '@arco-design/web-react'
```

Re-export的几种形式

1. 直接重导出
   ```ts
   export {foo, bar} from './moduleA'
   ```

2. 重命名并重导出（含默认导出）
   ```ts
   // 通过export导出
   export { foo as newFoo, bar as newBar } from './moduleA'
   // 通过export default导出的
   export { default as ModuleDDefault } from './moduleD'
   ```

3. 重导出整个模块（不含默认导出）
   ```ts
   export * from './moduleA'
   ```

4. 收拢、结合导入与重导
   ```ts
   import { foo, bar } from './moduleA'
   export { foo, bar }
   ```

   



