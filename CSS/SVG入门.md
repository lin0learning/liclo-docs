# SVG入门

可缩放矢量图形（Scalable Vector Graphics，SVG）基于 XML 标记语言，用于描述二维的矢量图形。

## SVG 和 Canvas 的区别

- 可扩展性：
  - SVG 基于矢量的点、线、形状和数学公式来构建图形，没有像素，放大和缩放时不会失真；
  - Canvas 由多个像素点构成图形，放大会使图形变得颗粒状和像素化；
  - SVG 可以在任何分辨率下以高质量打印。
- 渲染能力：
  - 当 SVG 很复杂时，渲染会变慢（DOM元素过于多）；
  - Canvas 提供了高性能的渲染和更快的图形处理能力；
  - 当图像中具有大量元素时，SVG 文件的大小会增长得更快（DOM结构复杂）
- 灵活度：
  - SVG 可以通过 JavaScript 和 CSS 进行修改；
  - Canvas 只能通过 JavaScript 进行修改，创建动画需要每帧重绘。

## SVG 的 XML 和 DTD 声明
**SVG 的 XML 声明格式：**`<?xml version="1.0" encoding="UTF-8" standalone="none" ?>`
- standalone：指定当前 XML 文档是否依赖于外部标记声明（可选，使用该属性时，需和DTD声明一起使用）
  - no(default)：依赖外部标记声明
  - yex：依赖内部默认的标记声明

**SVG 的文档类型声明（DTD）**
```xml
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
```


## 创建 svg
### 通过`.svg`文件创建
**SVG 1.0版本**
```xml
<?xml version="1.0" encoding="UTF-8" standalone="none" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg
  version="1.0"
  baseProfile="full"
  width="100"
  height="100"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect x="0" y="0" width="100" height="100"></rect>
</svg>
```

baseProfile：正确渲染 svg 内容时所需要最小SVG语言概述（版本）
- full
- basic
- tiny

**SVG 2.0版本**
```xml
<?xml version="1.0" standalone="none"?>
<svg
  width="100"
  height="100"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect x="0" y="0" width="100" height="100"></rect>
</svg>
```

### 在 html 中创建 svg
```html
<body>
  <svg
    width="100"
    height="100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0" y="0" width="100" height="100" fill="#13c2c2"></rect>
  </svg>
</body>
```

### JS 创建 svg
使用 JS 脚本来创建SVG时，<font color="red">创建的任何元素都需要添加命名空间</font>；如果没有显式地设置`xmlns` 的属性值（命名空间），那么创建的元素会在HTML-DOM结构中出现，但不会在浏览器中显示。
- 对于元素上的属性如何不带前缀，命名空间赋值为 null：`<image width='100' height='100' xlink:href="xxx.png" />`

创建 SVG 常用的 DOM2 API：
- `document.createElementNS(ns, tagname)`
- `Element.setAttributeNS(ns, name, value)`
- `Element.getAttributeNS(ns, name)`
- `Element.hasAttributeNS(ns, name)`
- `Element.removeAttributeNS(ns, name)`

```js
const SVG_NS = 'http://www.w3.org/2000/svg'
const XLink_NS = 'http://www.w3.org/1999/xlink'

const img = document.createElementNS(SVG_NS, 'image')
img.setAttributeNS(null, 'width', '100')
img.setAttributeNS(null, 'height', '100')
img.setAttributeNS(XLink_NS, 'xlink:href', 'flower.png')
```
如果不需要指定要设置的属性属于特定的命名空间，那么使用 `Element.setAttribute()` 方法即可。


**附加：创建 svg 元素封装函数**
```js
/**
 * 创建svg tag
 * @param {'svg'|'g'|'path'|'filter'|'animate'|'marker'|'line'|'polyline'|'rect'|'circle'|'ellipse'|'polygon'|'text'} tagName 
 * @param {import('vue').SVGAttributes} [attrs] 
 * @returns {Element}
 */
export function createTag(tagName, attrs) {
  let svgTags = ['svg', 'g', 'path', 'filter', 'animate', 'marker', 'line', 'polyline', 'rect', 'circle', 'ellipse', 'polygon', 'text'];
  let el;
  if (svgTags.indexOf(tagName) >= 0) {
    el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  } else {
    el = document.createElement(tagName);
  }
  if (attrs) {
    for (let attr in attrs) {
      el.setAttribute(attr, attrs[attr]);
    }
  }
  
  return el;
}
```


### HTML 引入 SVG
1. img 元素 指定 `src` 属性引入（不支持交互）
2. css `background-image` 属性引入（不支持交互）
3. HTML 文件引用 svg 源文件（支持交互）

  

## SVG Grid 和坐标系
- `<svg>` 元素默认宽度为 300px，高为 150px

`viewport` 视口 与 `viewBox` 视图框
- viewport 是 SVG 画布的大小，而 viewBox 是用来定义用户坐标系中的位置和尺寸

## SVG 元素

**SVG的基本形状**

- SVG所支持的基本形状有：矩形、圆形、椭圆、线条、折线、多边形、路径；



SVG 矩形

```xml
<rect x="0" y="0" width="50" height="50" rx="2" ry="2"></rect>
```

- `x`：矩形左上角的x轴位置
- `y`：矩形左上角的y轴位置
- `width`
- `height`
- `rx`：圆角的x轴方位的半径
- `ry`：圆角的y轴方位的半径



SVG 圆形（circle）3个基本属性：

```xml
<circle cx="25" cy="75" r="20"></circle>
```

- `r`
- `cx`
- `cy`



SVG 椭圆（ellipse）

```xml
<ellipse cx="100" cy="100" rx="25" ry="25"></ellipse>
```



SVG 线条（line）

```xml
<line x1="100" y1="100" x2="200" y2="100" stroke="red" stroke-width="5"></line>
```



SVG 折线（polyline）

```xml
<polyline points="20 0, 10 15, 25 30"></polyline>
```



SVG 多边形（polygon）

```xml
<polygon point=""></polygon>
```



SVG 路径（path）

可以用 `<path>` 元素绘制矩形、圆形、椭圆、折线、多边形，以及贝塞尔曲线、2次曲线等。

```xml
<path d="M 120 10, L 190 10, 190 50 Z" stroke="orange" fill="transparent"></path>
```

- `d`：点集数列，以及其它关于如何绘制路径的信息，<font color="red">必须 M 命令开头</font>;
  - M moveTo
  - Z close Path 闭合路径（没有则不闭合）
  - L lineTo （可省略）



SVG 文字

`<text>`、`<tspan>`

`<text>`元素的基本属性

- x 和 y 属性决定文本在坐标系中显示的位置
- text-anchor 文本流方向属性
- dominant-baseline

tspan 用于标记大块文字的字部分，它必须是一个text元素或者别的tspan元素的子元素。



元素组合 `<g>`

- g 元素用来组合元素，添加到g 元素上的变换会应用到其所有的子元素上。
- 核心属性：id

元素复用`<defs>`

- 把可复用的元素定义在`<defs>`元素中，通过`<use>`元素来引用和显示。
- `<use>` 等同于深度克隆DOM节点，其`weight/height`属性在引入svg或symbol元素时才会生效。

```html
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="theGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#52c41a" />
      <stop offset="50%" stop-color="#13c2c2" />
      <stop offset="1" stop-color="#1677ff" />
    </linearGradient>
    <line id="theLine" x1="10" y1="10" x2="120" y2="120" stroke="#2f54eb"></line>
  </defs>
  <circle cx="50" cy="50" r="40" fill="url('#theGradient')"></circle>
  <use href="#theLine"></use>
</svg>
```

在其他svg标签下也能复用`<defs>`中的元素。通常对专门用于定义复用图形的`svg`标签，又没有参与其他功能的情况下会将其隐藏。



图形元素复用`<symbol>`

该元素和defs元素类型，用于定义可复用元素，然后通过`<use>`元素来引用显示。

- symbol元素中定义的图形元素默认不会显示在界面上
- 常用于定义各种小图标





## 业务功能

1. svg 元素沿自身旋转（上下颠倒）
```css
.tag {
  transform-origin: 50% 50%;
  transform-box: fill-box;
  transform: rotate(180deg);
}
```

2. svg 元素插入图片
```html
<svg>
  <g>
    <image width="200" height="200" href="static/xx/xx.png"></image>
  </g>
</svg>
```

3. svg 元素水平镜像翻转
```html
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <image id="myImage" href="your-image-path.jpg" x="50" y="50" width="100" height="100"
    transform="translate(150, 0) scale(-1, 1)"></image>
</svg>
```

4. svg line 实线/虚线切换

采用动态样式类

```css
.line-connect {
  stroke-width: 1;
  stroke: #74d13d;
  stroke-dasharray: none;
}

.line-disconnect {
  stroke: rgba(255, 255, 255, 0.7);
  stroke-dasharray: 3, 3;
}
```

5. `<linearGradient>` 定义线性渐变并复用

```html
<svg>
  <defs>
    <linearGradient id="myGradient" x1="96.34" y1="694.86" x2="104.44" y2="694.86" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" />
      <stop offset="1" />
    </linearGradient>
  </defs>
  <!-- using my linear gradient -->
  <circle cx="5" cy="5" r="4" fill="url('#myGradient')" />
</svg>
```

6. 动态切换svg（v-html）

```vue
<template>
  <div ref="svgRef" v-html="svgString"></div>
</template>
<script setup>
const svgString = ref('')
function loadSvg(stationId) {
  return axios.get(`conf_axleSvg/${stationId}.svg`).then(res => {
    svgString.value = res.data
  }).catch(err => {
    svgString.value = ''
  })
}
</script>
```

数据处理操作DOM原则：

- 单个数据处理更新会使浏览器重绘，应该统一收集数据更新，再一次性更新，浏览器只重绘一次；
- 将新数据与原数据做比较，如果没有变化，则不更新视图，只更新数据。
