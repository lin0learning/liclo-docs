# 现代 Web 布局

## 书写模式

书写模式：`writting-mode`

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061728005.webp" alt="img" style="zoom:50%;" />

总结，**块元素遵循流方向，内联元素遵循写入方向**：

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061728411.webp" alt="img" style="zoom:50%;" />

## 盒模型

CSS盒模型：`box-sizing: content-box/border-box/inherit;`

在标准盒子模型(content-box)下，元素的width和height只包括内容的宽和高。不包括边框(border)，内边距(padding)，外边距(margin)。

在怪异盒子模型（IE盒模型，boder-box）下，width和height属性包括内容，内边距和边框，但不包括外边距，即

- `width` = border + padding + 内容的宽度
- `height` = border + padding + 内容的高度





<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061728861.webp" alt="img" style="zoom: 25%;" />

Flex项目在Flex容器中的排列方向同时会受 <span style="color: #ff502c;">` flex-direction` </span> 属性和 CSS 的书写模式 <span style="color: #ff502c;">` writing-mode` </span> 或阅读模式 <span style="color: #ff502c;">` direciton` </span> 影响

- 可以使用主轴的对齐方式 `justify-content` 来分配主尺寸的剩余空间；

- 可以使用侧轴的对齐方式 `align-content` 来分配侧尺寸的剩余空间。



![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061728928.webp)

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061728133.webp" alt="img" style="zoom: 25%;" />





## CSS 简写属性

CSS 中有很多简写属性，简写属性可以包含多个子属性。如果需要同时显示设置 ` flex-direction`  和` flex-wrap`  属性时，可以使用简写属性` flex-flow`  ：

```css
.flex-container {
  display: flex;
  flex-flow: column wrap;
}

/* 等同于 */
.flex-container {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
```



```html
<body>
  <header></header>
  <main></main>
  <aside></aside>
  <footer></footer>
</body>
```



> `order`在实际开发中很少用到

使用` order`  属性可以为 Flex 容器中的项目重新排序。项目按照 `flex-direction` 指定的方向排列，最小值在最前面。

`order` 初始值是 `0` ，可以是正值，也可以是负值，属性值越大，越排在主轴的后面，反之越在主轴的前面。



<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061728425.webp" alt="img" style="zoom:50%;" />



## Flex 布局

在Flexbox 布局中，可以使用 `gap` 属性来设置元素与元素之间的间距。实质上，`gap` 是用来定义**列与列** 或 **行与行** 之间的间距。

```css
:root {
  --gap: 1rem;
  --columns: 5;
}

.container {
  gap: var(--gap);
}
```

`gap`属性可设置一个值或两个值，如果设置两个值，第一个值是 `row-gap` 属性的值，第二个则是 `column-gap` 属性的值：

```css
.flex-container {
  gap: 10px;
}

/* 等同于 */
.flex-container {
  row-gap: 10px;
  column-gap: 10px;
}
```



分别使用`margin`和`gap`实现以下效果：

![image-20230424173121072](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304241731176.png)

```html
<!-- margin -->
<div class="container">
  <div class="flex__container flex__container--margin" data-gutter="margin">
    <div class="flex__item">Flex Item 1</div>
    <div class="flex__item">Flex Item 2</div>
    <div class="flex__item">Flex Item 3</div>
    <div class="flex__item">Flex Item 4</div>
    <div class="flex__item">Flex Item 5</div>
    <div class="flex__item">Flex Item 1</div>
    <div class="flex__item">Flex Item 2</div>
    <div class="flex__item">Flex Item 3</div>
    <div class="flex__item">Flex Item 4</div>
    <div class="flex__item">Flex Item 5</div>
  </div>
</div>
<!-- gap -->
<div class="container">
  <div class="flex__container flex__container--gap" data-gutter="gap">
    <div class="flex__item">Flex Item 1</div>
    <div class="flex__item">Flex Item 2</div>
    <div class="flex__item">Flex Item 3</div>
    <div class="flex__item">Flex Item 4</div>
    <div class="flex__item">Flex Item 5</div>
    <div class="flex__item">Flex Item 1</div>
    <div class="flex__item">Flex Item 2</div>
    <div class="flex__item">Flex Item 3</div>
    <div class="flex__item">Flex Item 4</div>
    <div class="flex__item">Flex Item 5</div>
  </div>
</div>
```

CSS：

```css
.container {
  width: calc(100px * 5 + 1rem * 4 +6px);
}
/* margin */
.flex_container {
  display: flex;
  flex-flow: row wrap;
}
.flex__container--margin {
  margin: calc(-1 * 1rem) 0 0 calc(-1 * 1rem);
}
.flex__container--margin > .flex__item {
  margin: 1rem 0 0 1rem;
}

/* gap */
.flex__container--gap {
  gap: 1rem;
}
.flex__item {
  inline-size: 100px;
  aspect-ratio: 1;
}
```



- `justify-content`：沿 Flex 容器的主轴分配 Flex 容器的剩余空间；

- `align-content`：沿 Flex 容器的侧轴分配 Flex 容器的剩余空间；

- `place-content`：它是 `justify-content` 和 `align-content` 的简写属性。



对于`place-content`属性，第一个值为`align-content`属性，第二个值为`justify-content`，属性值有：

- start
- end
- flex-start
- flex=end
- center
- left
- right
- space-between
- baseline( first baseline、last baseline)
- space-around
- space-evenly
- stretch



Flex容器的主轴和侧轴的方向可以被以下属性改变：

1. 用于 Flex 容器上的 `flex-direction`；
2. CSS 的书写模式 `writing-mode` 属性；
3. CSS 阅读模式 `direction`；
4. HTML 元素的 `dir`属性。



设置 `justify-content` 的值，来改变 Flex 项目在 Flex 容器上的对齐方式，即 **调整 Flex 容器剩余空间的位置**。

设置 `align-content` 的值，用于 **分配 Flex 容器侧轴方向的剩余空间**。

设置 `align-items` 属性的值，是用来控制 Flex 项目沿着侧轴方向对齐。



在 Flexbox 布局中，可以使用 `place-content: certer` 构建一个 **水平垂直居中** 的布局效果：

```css
/* 水平垂直居中 */
.flex-container {
  display: flex;
  flex-wrap: wrap;
  place-content: center;
}
```

注意，**`align-content`** **只有当** **`flex-wrap`** **属性的值为非** **`nowrap`** **（即** **`wrap`** **或** **`wrap-reverse`** **）时才能生效** 。



`align-content` 和 `align-items` 本质性的差异：

- `align-content` 属性必须要在 `flex-wrap` 属性值为 `wrap` 或 `warp-reverse` 条件下才能正常工作；但 `align-items` 属性不需要；

  > `flex-wrap`属性的默认值为 `nowrap`

- `align-content` 属性除了可以让 Flex 项目所在行在 Flex 容器侧轴对齐之外，还可以用来分配 Flex 容器侧轴方向的剩余空间，比如 `space-around`、`space-between` 和 `space-evenly`等属性；但 `align-items` 属性则只用于控制 Flex 项目在 Flex 行侧轴方向的对齐方式。

在 Flex 项目中使用 `align-self` 让下面示例中的按钮居右显示：

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304251121588.png" alt="image-20230425112100859" style="zoom:50%;" />

```css
.card_button {
  display: inline-flex;
  align-self: flex-end;
  box-shadow: 0 2px 8px -1px var(--shadow);
}
```







设置如下title隐藏效果：

![image-20230425114029847](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304251140905.png)

```css
h3 {
  /* 关键属性 */
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
```



![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061728903.webp)

```html
<header>
    <Logo />
    <Nav />
    <UserProfile />
</header>
<style>
	header {
    display: flex;
    gap: var(--gap, 1rem);
    align-items: center;
  }
</style>
```

实现以上效果，最简单的方法是在 `<UserProfile />` 使用 `margin-left: auto` 或 `margin-inline-start: auto` ：

```css
.header {
  display: flex;
  gap: var(--gap, 1rem);
}

.section {
  margin-inline-start: auto;
}
```



`align-items` 将所有 Flex 项目（即 `span` 元素）沿着侧轴水平居中对齐。当 Flex 容器 `.container` 有足够空间时一切都完美，但如果容器没有足够多的空间来容纳 Flex 项目的内容时，就会出现“数据丢失”的情况：

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061729082.webp" alt="img" style="zoom: 50%;" />

就是给对齐属性新增了 `safe` 和 `unsafe` 两个关键词：

- `safe`关键字会将因为对齐方式导致溢出时，将设置的对齐模式切换到 `start` 对齐模式下，目的是避免“数据丢失”，其中部分项目超出对齐容器的边界并且无法滚动到。

- `unsafe`，即使会导致此类数据丢失，也会遵守对齐方式。

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: safe center;
}
```

**注意：**![image-20230425140914399](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304251409458.png)

<span style="color:red;">（几乎无兼容性）</span>



Flexbox的对齐属性：

- 可用于 Flex 容器的属性有 `justify-content` 、`align-content` 和 `align-items`；

- 可用于 Flex 项目的属性有 `align-self` 和 `margin: auto`；

- Flexbox 布局中的溢出对齐 `safe` 和 `unsafe` ；

- Flexbox 布局中没有 `justify-items` 和 `justify-self` 属性。





**flex-basis**

CSS 属性 `flex-basis` 指定了 flex 元素在主轴方向上个的初始大小。

**备注：** 当一个元素同时被设置了 `flex-basis` (除值为 `auto` 外) 和 `width` (或者在 `flex-direction: column` 情况下设置了`height`) , `flex-basis` 具有更高的优先级。





`flex` 的基础使用

`flex` 是一个只能用于 Flex 项目的属性，它可以**让 Flex 项目根据 Flex 容器的可用空间对自身做伸缩计算** ，它包含三个子属性：

- `flex-basis` ；
- `flex-grow` ；
-  `flex-shrink` 。

`flex` 属性的**单值语法**时，其值必须为以下其中之一：

- 一个无单位的数值（`<number>`），比如 `flex: 1` ，这个时候它（即`1`）会被当作 `flex-grow` 属性的值；

- 一个有效的长度值（`<length-percentage>` ），比如 `flex: 30vw` ，这个时候它（即 `30vw`）会被当作 `flex-basis` 属性的值；

- 关键词 `none` 、 `auto` 或 `initial` （即初始值）。

比如：

```css
.item {
  flex: 1;
    
  /* 等同于 */
  flex-grow: 1;
  flex-shrink: 1; 
  flex-basis: 0%; 
}

.item {
  flex: 30vw;
    
  /* 等同于 */
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 30vw;
}
```

`flex` 属性的**双值语法**，其第一个值必须为 **一个无单位的数值（`<number>`）** ，并且它会**被当作** **`flex-grow`** **属性的值** ；第二个值必须为以下之一：

- 一个无单位的数值（`<number>`），它会被当作 `flex-shrink` 属性的值；

- 一个有效的长度值（`<length-percentage>`），它会被当作 `flex-basis` 属性的值。

比如：

```css
.item {
  flex: 1 2;
  
  /* 等同于 */
  flex-grow: 1;
  flex-shrink: 2;
  flex-basis: 0%;
}

.item {
  flex: 2 30vw;
  
  /* 等同于 */
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 30vw;
}
```

`flex` 属性的**三值语法**：

- 第一个值必须是一个无单位的数值（`<number>`），并且它会被当作 `flex-grow` 属性的值；

- 第二个值必须是一个无单位的数值（`<number>`），并且它会被当作 `flex-shrink` 属性的值；

- 第三个值必须是一个有效的长度值（`<length-percentage>`），并且它会被当作 `flex-basis` 属性的值。

比如：

```css
.items {
  flex: 2 1 200px;
    
  /* 等同于 */
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 200px;
}

.item {
  flex: 30vw 2 1;
  
  /* 等同于 */
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 30vw;
}
```



```css
.item {
  flex: 1;
  
  /*等同于*/
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
    
  flex: 30vw;
  
  /*等同于*/
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 30vw;
  
  flex: 1 2;
  
  /*等同于*/
  flex-grow: 1;
  flex-shrink: 2;
  flex-basis: 0%;
  
  flex: 1 30vw;
  
  /*等同于*/
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 30vw;
  
  flex: 2 1 200px;
    
  /* 等同于 */
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 200px;
  
  flex: 30vw 2 1;
  
  /* 等同于 */
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 30vw;
  
  flex: auto;
    
  /* 等同于 */
  flex-grow: 1;     /* Flex 项目可以扩展到超过其 flex-basis */
  flex-shrink: 1;   /* Flex 项目可以收缩到小于其 flex-basis */
  flex-basis: auto; /* Flex 项目为基本大小 auto，即 max-content */
}
```





关于尺寸：

CSS 属性 `inline-size` 根据元素的书写模式定义元素的横向或纵向尺寸，即根据 `writing-mode` 的值，此属性对应于 `width` 或 `height`。查看[` writing-mode`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/writing-mode)的详细信息。

在 Flexbox 布局中， `flex-basis` 可用来指定 Flex 项目在 Flex 容器主轴方向的初始值。，除了 `auto` 和 `content`，`flex-basis` 都以与水平书写模式中 `width`相同的方式解析（除了 `width` 值设置为 `auto`，`flex-basis` 设置为 `content`）。

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061729787.webp" alt="img" style="zoom: 50%;" />



显示设置 `flex: 1;`的误区：不是所有 Flex 项目的宽度（或高度）都占比相等，比如某个 Flex 项目的`max-content` 超过了设置 `flex: 1;`所占比的长度，也就没有实现所有 Flex 项目等宽的效果。

如果要真的实现所有 Flex 项目宽度相等，除了在 Flex 项目上设置为 `flex:1` 之外，还需要显式设置 `min-width` 值为 `0` ：

```css
.item {
  flex: 1;
  min-width: 0;
}
```

Flex 项目收缩后，它的尺寸大小不会小于 `min-content`。





关于 Flex 项目中 `flex-grow` 扩展因子比例的计算，规定容器出现剩余空间时的分配比例，总结：

- 只有 Flex 容器有剩余空间，且 `flex-grow` 值不为 `0` 时，Flex 项目才会按照扩展因子（`flex-grow` 值）比率来分割 Flex 容器的剩余空间。
- 如果 Flex 容器中所有 Flex 项目的 `flex-grow` 值的总和小于 `1` 时，Flex 容器的剩余空间是分不完的（有留存），只有 `flex-grow` 值的总和大于或等于 `1` 时，Flex 容器的剩余空间才能全部分完。
- Flex 容器中的所有 Flex 项目的 `flex-grow` 值设置为 `1` ，并不能平均分配 Flex 容器的剩余空间，它和 Flex 项目自身的内容最小尺寸以及它的内部固定尺寸的元素有关。
- Flex 项目的 `flex-grow` 会给 Flex 项目的 `flex-basis` 值带来变化，但它也会受 `min-*` （比如 `min-width` 、 `min-inline-size` 、`min-height` 、`min-block-size`）和 `max-*` （比如 `max-width` 、`max-inline-size` 、`max-height` 和 `max-block-size` ）等属性的影响。





关于 Flex 项目中 `flex-shrink` 收缩因子比例的计算，`flex-shrink` 属性所起的作用和 `flex-grow` 刚好相反，它是在 Flex 容器出现不足空间时，让 Flex 项目根据自身收缩因子 `flex-shrink` 来缩小尺寸，总结：

- 如果计算出的 `flex-basis` 仍小于内容的 `min-content`，则会取该 Flex 项目内容的最小长度值。
- `flex-grow` 按比例分配 Flex 容器剩余空间，Flex 项目会按比例变大，但不会造成 Flex 项目溢出 Flex 容器（除非所有 Flex 项目自身的最小内容总和就大于 Flex 容器空间）。
- `flex-shrink` 按比例分配 Flex 容器不足空间，Flex 项目会按比例变小，但 Flex 项目仍然有可能溢出 Flex 容器。
- 当 `flex-grow` 属性值总和小于 `1` 时，Flex 容器的剩余空间分不完；同样的，当 `flex-shrink` 属性值总和小于 `1` 时，Flex 容器的不足空间分不完。







`flex-shrink` 与 `flex-grow` 的不同：

- `flex-grow`按扩展因子分配 Flex 容器的剩余空间；
- `flex-shrink`按收缩因子分配 Flex 容器的不足空间



设置**`flex:1`** 的 Flex 项目需要显式设置 **`min-height`** 的值为 **`0`** ，即滚动容器的父元素 。即， 在设置了`flex:1`的 Flex 项目上应该尽可能地重置它的最小尺寸值：

- 当主轴在水平方向时（`flex-direction: row`），设置`min-width` （或 `min-inline-size`）的值为 `0` ；
- 当主轴在水平方向时（`flex-direction: row`），设置`min-width` （或 `min-inline-size`）的值为 `0` ；

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061729713.webp)

```css
flex: 1 1 calc((100% - 1rem) / 2);
/* 等同于 */
flex-grow: 1;
flex-shrink: 1;
flex-basis: calc((100% - 1rem) / 2);
```



自 2021 年开始，可以在 CSS 中使用 `aspect-ratio` 属性设置元素的宽高比（不需要使用 `padding-top` 或 `padding-bottom` 来模拟）：

```css
.aspect-ratio-box {
    width: 400px;
    aspect-ratio: 16 / 9;
}
```



## 检查浏览器属性支持

以`gap`属性为例，使用 `gap` 属性，我们可以在容器内的项目之间定义等距离的间隔，不需要为每个项目都手动设置 margin 或 padding。

```css
.container {
  display: flex;
  gap: 20px;
  row-gap: 20px;
  column-gap: 20px;
}
```

由于 `gap` 属性是 Flexbox 布局的新特性，因此在使用 `gap` 属性前，需要检查浏览器是否支持该特性，并在不支持时提供备用方案。

为了检查 `gap` 属性的支持，我们可以使用 `@supports` 媒体查询。`@supports` 是 CSS 中的一个条件规则，用于检测浏览器是否支持某个 CSS 特性或属性。

:::info

`@supports: selector()` 为比较新的 CSS3 属性，其兼容性<font color="red">也欠佳</font>，在较低版本的浏览器中，不可用。一般支持`@supports`选择器的浏览器也支持 `gap` 属性。

:::

```css
@supports (gap: 20px) {
  /* 支持 gap 属性时应用 */
  .container {
    display: flex;
    gap: 20px;
  }
}

@supports not (gap: 20px) {
  /* 不支持 gap 属性的备用方案 */
  .container {
    display: flex;
    margin: -10px;
  }
  .container > * {  /* 匹配所有一级子元素 */
    margin: 10px;
  }
}
```









## CSS 自定义属性

```html
<div class="container grid-row">
    <div class="item grid-column" style="--ratio: 4 / 3">4:3</div>
    <div class="item grid-column" style="--ratio: 2 / 3">2:3</div>
</div>
```

```css
.container {
  display: flex;
  align-items: flex-start;
  aspect-ratio: 6 / 3;
}

.item {
  aspect-ratio: var(--ratio);
  flex: 1 1 0%;
  height: 100%; /* 重要 */
}
```



![image-20231013091507928](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202310130915257.png)



```html
<div class="aspect-ratio-box">16 : 9</div>
<style>
.aspect-ratio-box {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  width: 400px;
  aspect-ratio: 16 / 9;
  outline: 1px dashed #09f;
}
</style>
```

![image-20231013100446398](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202310131005968.png)

## `outline` 和 `border` 的区别

```css
outline: 1px dashed #09f;
```

- outline-width
- outline-style
- outline-color

```css
border: 5px solid red;
```

- border-width
- border-style
- border-color

**区别：**

1. outline （轮廓）是绘制于元素周围的一条线，位于边框边缘的外围，不占据空间，可起到突出元素的作用。outline 不会像border那样影响元素的尺寸或者位置，outline不占据空间

2. border 可应用于几乎所有有形的html元素，而 outline 是针对链接、表单控件和ImageMap等元素设计。

3. outline 的效果将随元素的 focus 而自动出现，相应的由 blur 而自动消失。这些都是浏览器的默认行为，无需JavaScript配合CSS来控制。



css选择器取 奇数 与 偶数

```css
.item:nth-child(2n) {} /* 奇数 */
.item:nth-child(2n-1) {} /* 偶数 */
```



## 不同对齐方式的导航栏

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061729707.webp)



![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405061729640.webp)



实现badges效果：

1. 使用 `line-clamp`

```css
.badges { 
  overflow: hidden; 
  text-overflow: ellipsis; 
  display: -webkit-box; 
  -webkit-line-clamp: 1; 
  -webkit-box-orient: vertical; 
} 
 
.badges li { 
  display: inline-flex; /* inline-block */ 
} 
```

2. 使用 `text-overflow`

```css
.badges  { 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
} 

.badges li { 
  display: inline-block; /* inline-flex */ 
}
```

示例：https://codepen.io/airen/full/KKRoexo



**CSS百分比padding实现比例固定图片自适应布局**

https://image.zhangxinxu.com/video/blog/202307/image-resize.mp4

```css
div {
  padding: 100% 100% 0 0;
}
```

会撑起一个 1:1 的 div 元素

```html
<ul class="box">
    <li class="list">
        <div class="cover">
            <img src="0.jpg" />
        </div>
    </li>
    <li class="list">
        <div class="cover">
            <img src="1.jpg" />
        </div>
    </li>
    ...
</ul>
```

CSS 代码使用传统浮动布局：

```css
.box {
  overflow: hidden;
}
.list {
  width: calc(25% - 1.5rem / 4);
  float: left;
  margin-bottom: .5rem;
}
.list:not(:nth-child(4n + 1)) {
  margin-left: .5rem;
}
.cover {
  padding: 100% 100% 0 0;
  position: relative;
}
.cover img {
  position: absolute;    
    left: 0; top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
```

**优化方式**：`flex`布局 + `aspect-ratio`属性

```css
.box {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
}
.list {
  flex-basis: calc(25% - 1.5rem / 4);
  aspect-ratio: 1 / 1;
}
.list img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**2023年新方法**：容器元素 + `cpw`单位

html 结构：

```html
<div class="box">
  <img src="0.jpg" />
  <img src="1.jpg" />
  <img src="2.jpg" />
  <img src="3.jpg" />
  <img src="4.jpg" />
  <img src="5.jpg" />
</div>
```

CSS代码：

```css
.box {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  container-type: inline-size;
}
.box img {
  width: calc(25cpw - 1.5rem / 4);
  height: calc(25cpw - 1.5rem / 4);
  object-fit: cover;
}
```

`container-type:inline-size`可以让普通元素变成container容器元素，而cqw是容器宽度单位，1cqw=1%的容器宽度，100cqw就是容器宽度。



**网格属性**

1. `grid-template-*` ：显示网格
   - `grid-template-rows`
   - `grid-template-columns`
   - `grid-template-areas`
   - 简写属性 `grid-template`
2. `grid-auto-*` ： 隐式网格
   - `grid-auto-rows`
   - `grid-auto-columns`
   - `gird-auto-flow`



```css
.container {
  display: grid; /* 或 inline-grid */
  grid-template-columns: 180px 20% auto 1fr 10vw;
}
```

定义了一个五列 N 行的网格，即将网格容器分成五列（沿网格容器内联轴 Inline Axis 方向），而且每列的列宽分别是 `180px` 、 `20%` 、 `auto` 、`1fr` 和 `10vw` ：

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405070928175.webp)

可用于 `grid-template-columns` 的值类型大致可分为三种：

- 带有不同单位的长度值，比如 `px` 、`em` 、`rem` 、`vw` 、`vh` 、`%` 、`ch` 、`ex` 和 `fr` 等；
- 关键词，比如 `none` 、`auto` 、`min``-content` 和 `max-content` 等；
- CSS 函数，比如 `min()` 、`max()` 、`clamp()` 、`calc()` 、`fit-content()` 、`minmax()` 和 `repeat()` 等。



```css
.container {
  display: grid;
  grid-template-columns: 180px 20% auto 1fr 10vw;
  grid-template-rows: auto 200px 10vh;
}
```

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405070928829.webp)

使用 `grid-template-columns` 和 `grid-template-rows` 显式的创建了一个网格时，它们主要做了三件事：

- 定义网格线
- 定义网格轨道数量
- 定义网格轨道尺寸







## overflow hidden属性作用

1. `overflow:hidden` 清除浮动

```html
<div class="box">
  <div class="item">item</div>
</div>
```

```css
.box {
  overflow: hidden; /* 清除浮动 */
  border: 1px solid red;
}
.item {
  float: left;
  width: 200px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: #fff;
  border: 1px solid #fff;
}
```

![image-20231020142725430](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202310201427659.png)



2. 解决外边距塌陷

父元素内部的子元素添加`margin-top`样式时，该`margin-top`值会作用于父元素，造成外边距塌陷：

```html
<div class="box">
  <div class="item">item</div>
</div>
```

```css
.box {
  overflow: hidden;
  /* 设置 border/padding 属性值有同样效果，但不建议，会撑大盒子 */
 /*	border: 1px solid red; */
  background: rgba(0,0,0,0.1);
}
.item {
  margin-top: 100px;
  width: 200px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  color: #fff;
  border: 1px solid #fff;
}
```











## 经典 Web 布局

### 一、水平垂直居中

单行（或单列）与多行（或多列）水平垂直居中：

（1） `justify-content` 配合 `align-items`

```css
.container {
    display: flex; /* inline-flex */
}

/* 单行(或单列)水平垂直居中 */
.container--single {
   justify-content: center; /* 水平居中 */ 
   align-items: center;     /* 垂直居中 */
}

/* 多行（或多列）水平垂直居中 */
.container--multiple {
    flex-direction: column;
    align-items: center;     /* 水平居中 */
    justify-content: center; /* 垂直居中 */
}
```

（2）`justify-content` 配合 `align-self`

```css
.container {
    display: flex; /* 或 inline-flex */
    justify-content: center;  /* Flex 项目水平居中 */
}

.item {
    align-self: center;
}
```

（3）单个 Flex 项目在容器中，使用 `margin: auto;`

```css
.container {
    display: flex;
}

.item {
    margin: auto;
}
```

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304271405707.png" alt="image-20230427140537438" style="zoom: 67%;" />











### 二、等高布局

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304271409825.webp)

一个等高布局的卡片组件：

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304271409686.webp)

HTML 结构及布局相关 CSS：

```html
<div class="cards">
  <div class="card">
    <figure>
    	<img src="xx.pn" alt="略缩图" />
    </figure>
    <h3>Card Title</h3>
    <p>Card Describe</p>
    <button>Button</button>
  </div>
</div>
```

与布局相关的 CSS 代码：

```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  flex: 1 1 300px;
}
```



Flex 项目等高的原因：Flex 容器的 `align-items` 属性的默认值是 `stretch` ，如果没有调整 `align-items` 属性的值，那么该容器中的所有子元素（即 Flex 项目 `.card`）在侧轴方向就会被拉伸，并且等于侧轴尺寸。

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304271427641.webp)

要将卡片按钮都在底部对齐，只需要将剩余空间分配给卡片中的 `p` 元素（描述文本），将其 `flex-grow` 值设置为 `1`：

```css
.card p {
    flex-grow: 1;
}
```

除了上面这种方案之外，还可以在 `button` 元素显式设置 `margin-top` 的值为 `auto` ：

```css
.card button {
    margin-top: auto;
}
```

如果你不希望按钮宽度占满整个卡片，还可以改变 `button` 的 `algin-self` 值，比如：

```css
/* 按钮居左 */
.card button {
    align-self: flex-start; 
}

/* 按钮居右 */
.card button {
    align-self: flex-end;
}
```

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304271432018.webp)



练习：等高布局的 Web 页面：

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304271433443.webp)

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304271433388.webp)













### 三、均分列（等分列）布局

![img](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304271527730.webp)

在移动端开发中，底部的菜单栏中的列大多都是均分的。

如下案例：

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304281716209.png" alt="image-20230428171527338" style="zoom:80%;" />

HTML 的结构为：

```html
<footer>
	<div class="item">
    <Icon /> Icon name
  </div>
</footer>
```

CSS 样式为：

```less
footer {
  display: flex;
  
  .item {
    flex: 1;
    min-width: 0;  /* 重要 */
  }
}
/* 菜单项图标和文字的布局 */
.item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
```

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304281720207.png" alt="image-20230428172011135"  />





使用 `flex: 1` 来均分列，需要配合 `min-width: 0` 一起使用。**原因为**显示设置 `flex: 1`时，浏览器会把`flex`属性的属性值计算为：

```css
.box {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
}
```

小作业，卡片等宽且等高：

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405070928203.webp" alt="img" style="zoom: 67%;" />









### 四、圣杯布局

圣杯布局（Holy Grail Layout）是 Web 中典型的布局模式。它看上去像下图这样：

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405070929211.webp" alt="img" style="zoom: 50%;" />

就上图而言，这就是一个非常普通的三列布局。对圣杯布局有一定了解的同学都应该知道，构建圣杯布局时，对 HTML 的结构是有一定的要求，即 **主内容为先** 。早期这样做，是让用户在 Web 页面加载缓慢时，就能先看到主内容。

对于经典的圣杯布局，它有：

- 页头 `<header>`；
- 页脚 `<footer>`；
- 主内容 `<article>`；
- 左侧边栏 `<aside>`；
- 右侧边栏 `<aside>`。

它应该具备的能力：

- 在 HTML 文档的源码中，主内容 `<article>` 要位于两个侧边栏 `<aside>` 之前；
- 页头 `<header>` 和页脚 `<footer>` 并没有固定高度，即它们的 `height` 为 `auto`，由其内容或相关盒模型属性值（比如 `padding` 、`margin` 或 `border`）决定大小；
- 在垂直方向，中间三列（`<main>`）的高度占据 `<header>` 和 `<footer>` 之外的浏览器视窗高度，并且随着内容增多而变高；
- 在水平方向，一般情况之下两个侧边栏也是由其内容来决定大小，但多数情况之下会给两个侧边栏设置一个固定宽度，比如左侧边栏是 `220px` ，右侧边栏是 `320px` 。中间主内容列 `<article>` 占据两侧边栏之外的浏览器视窗宽度，并且随着内容增加，不会出现水平滚动条。



```html
<header></header>
<main>
	<article></article>
  <nav></nav>
  <aside></aside>
</main>
<footer></footer>
```

> Demo 地址：https://codepen.io/airen/full/YzLeRZx





### 五、两列布局

使用 grid 布局可快速实现：

```html
<div class="container">
  <div class="item">元素1</div>
  <div class="item">元素2</div>
  <div class="item">元素3</div>
  <div class="item">元素4</div>
  <!-- ... -->
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.item {
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
}
```



