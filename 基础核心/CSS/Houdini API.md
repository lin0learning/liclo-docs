# Houdini API
Houdini 是一组底层 API，它们公开了 CSS 引擎的各个部分，从而使开发人员能够通过加入浏览器渲染引擎的样式和布局过程来扩展 CSS。Houdini 是一组 API，它们使开发人员可以直接访问 CSS 对象模型（CSSOM），使开发人员可以编写浏览器可以解析为 CSS 的代码，从而创建新的 CSS 功能，而无需等待它们在浏览器中本地实现。

## Houdini 优点
当样式改变时 Houdini 相比 JavaScript.style 的方式能够更快的解析。浏览器在脚本影响的样式更新前，会对 CSSOM 进行解析。

## 使用 Houdini API 自定义属性
```css
@property --p {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}

@property --stop-color {
  syntax: '<color>';
  initial-value: 'orangered';
  inherits: false
}

```