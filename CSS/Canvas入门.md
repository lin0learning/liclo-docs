# Canvas 入门

## `<canvas>` 标签

`<canvas>`标签有且仅有两个属性：`width` 和 `height`

```html
<canvas id="canvas" width="500" height="500"></canvas>
```

如果不设置画布的宽度和高度，则 canvas  画布的默认大小为 `300px * 150px`

**需要注意的是，** 通过 CSS 也可以定义 canvas 的尺寸，但此元素尺寸非彼画布尺寸，在绘制时图像会伸缩以适应它的画布尺寸；如果元素尺寸和画布尺寸比例不一样，绘制出来的图像是扭曲的。



## getContext()

`getContext()` 方法用于获取画布的渲染上下文和它的绘画功能。

```js
let ctx = canvas.getContext(contextType, contextAttributes?)
```

- **上下文类型（contextType）**

  - `2d`：创建一个二维渲染上下文

  - `webgl`：创建一个三维渲染上下文（WebGL 版本 1）

  - `webgl2`：创建一个三维渲染上下文（WebGL 版本 2）

  - `bitmaprenderer`：创建一个只提供将 canvas 内容替换为指定 ImageBitmap 功能的 ImageBitmapRenderingContext。（safari 还不支持）



## 路径

路径绘制步骤：

1. 创建路径起始点，`beginPath()`
2. 画出路径, `moveTo()`
3. 闭合路径（路径生成），`closePath()`
4. 通过描边或者填充路径区域来渲染图形，`stroke()` / `fill()`
   - 调用 `fill()`，所有没有闭合的形状都会自动闭合。
   - 调用 `stroke()`，不会自动闭合。

```js
// 填充三角形
ctx.beginPath();
ctx.moveTo(25, 25);
ctx.lineTo(105, 25);
ctx.lineTo(25, 105);
ctx.fill(); // 自动闭合

// 描边三角形
ctx.beginPath();
ctx.moveTo(25, 25);
ctx.lineTo(105, 25);
ctx.lineTo(25, 105);
ctx.closePath(); // 手动闭合路径
ctx.stroke();
```



## 圆弧

```js
ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise?);
```



