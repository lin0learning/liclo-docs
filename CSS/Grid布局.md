# Grid 布局

## 定义网格

给一个元素显示设置`display` 的值为 `grid` 或 `inline-grid`

```html
<div class="container">
  <div class="item"></div>
  <!-- ... -->
</div>
```

```css
.container {
  display: grid;
}
```



## 网格属性

**使用 grid-template-rows 和 grid-template-columns 定义网格**

`grid-template-*`：

- `grid-template-rows`
- `grid-template-columns`
- `grid-template-areas`
- 简写属性：`grid-template`

`grid-auto-*`：

- `grid-auto-rows`
- `grid-auto-columns`
- `grid-auto-flow`

根据不同的属性定义的网格又分为 **显式网格** 和 **隐式网格** ：

- `grid-template-*` 属性定义的网格是一个显式网格；
- `grid-auto-*` 属性定义的网格是一个隐式网格。



`repeat`的语法如下：

```
repeat(number of columns/rows, the column width we want);
```

```css
.container {
  display: grid;
  height: 300px;
  grid-template-columns: repeat(4, 1fr); /* 子元素没有overflow父元素 fr单位 */
  grid-column-gap: 10px;
}
```

`grid-template-columns` 的值类型大致可分为三种：

1. 不同单位的长度值，比如 `px` 、`em` 、`rem` 、`vw` 、`vh` 、`%` 、`ch` 、`ex` 和 `fr` 等；
2. 关键词，比如 `none` 、`auto` 、`min``-content` 和 `max-content` 等；
3. CSS函数，比如 `min()` 、`max()` 、`clamp()` 、`calc()` 、`fit-content()` 、`minmax()` 和 `repeat()` 等。



### 构建  5 x 3 的网格

```css
.container {
  display: flex;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto 200px 10vh;
}
```



### 指定网格位置

通过 `grid-column` 、`grid-row` 或 `grid-area` 属性来指定网格项目放置在什么位置：

```html
<div class="container">
  <header></header>
  <main></main>
  <nav></nav>
  <aside></aside>
  <footer></footer>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: 220px 1fr 220px;
  grid-template-rows: auto 1fr auto;
}
header {
  grid-column: 1 / 4;
  grid-row: 1 / 2;
}
main {
  grid-column: 2 / 3;
  grid-row: 2 / 3;
}
nav {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
aside {
  grid-column: 3 / 4;
  grid-row: 2 / 3;
}
footer {
  grid-column: 1 / 4;
  grid-row: 3 / 4;
}
```



实际效果（三列布局）:

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/909866500c784ae7930ec67c0cb19743~tplv-k3u1fbpfcp-jj-mark:1512:0:0:0:q75.awebp)

