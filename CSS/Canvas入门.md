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

笑脸案例：

```js
const canvas = document.querySelector("#canvas")
let ctx = canvas.getContext('2d');
ctx.beginPath()
ctx.arc(75, 75, 50, 0, Math.PI * 2, true)
ctx.moveTo(110, 75)
ctx.arc(75, 75, 35, 0, Math.PI, false)
ctx.moveTo(65, 65)
ctx.arc(60, 65, 5, 0, Math.PI * 2, true)
ctx.moveTo(95, 65)
ctx.arc(90, 65, 5, 0, Math.PI * 2, true)
ctx.stroke()
```



## 绘画状态
Canvas 绘图都是通过 `JavaScript` 去操控。

**保存和恢复绘画状态**

```js
let ctx = canvasEl.getContext('2d')

// save: 保存状态（以栈队列的形式存储并保存，恢复时按照栈先进后出的顺序调用）
// restore: 恢复状态
ctx.fillStyle = 'red'
ctx.fillRect(10, 10, 30, 15)
ctx.save()

ctx.fillStyle = 'green'
ctx.fillRect(60, 10, 30, 15)
ctx.save()

ctx.fillStyle = 'blue'
ctx.fillRect(110, 10, 30, 15)
ctx.save()

ctx.restore()
ctx.fillRect(110, 40, 30, 80)

ctx.restore()
ctx.fillRect(60, 40, 30, 80)

ctx.restore()
ctx.fillRect(10, 40, 30, 80)
```

![image-20240528110314928](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405281103154.png)


**变形 Transform**
canvas 有4种形变方法：
- translate(x,y)
- rotate(angle)
- scale(x, y)
- transform(a,b,c,d,e,f)
:::tip 注意事项
- 在 canvas transform 之前先调用 `save()` 方法保存状态是很好的习惯；
- 调用 `restore` 方法比手动恢复原先状态要简单的多。
:::

**canvas 动画**
canvas 图像一旦绘制完成，会一直保持；如需执行动画，不得不对画布上所有图形进行每帧的重绘（比如在1秒绘60帧就可给出流畅的动画）。

**canvas 画出一帧动画基本步骤：**
1. `clearRect()` 方法清空 canvas
2. 保存 canvas 状态
3. 绘制动画图形，即绘制动画中的一帧
4. 恢复 canvas 状态

**canvas 多帧动画使用setInterval定时器的缺点**
- setInterval 定时器<span style="color:red;">不是非常精准的</span>，因为 setInterval 的回调函数是在异步任务的宏任务队列中等待执行；
- 如果微任务队列有一直未处理完成的任务，那么 setInterval 的回调函数就有<span style="color:red;">可能不会在指定时间内触发回调</span>；
- 要更加平稳和精准的定时执行任务，可以使用 [`requestAnimationFrame`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame) 函数。

以 60Hz 刷新率显示器为例：
```js
requestAnimationFrame(draw)

let startTime = new Date().getTime()
function draw() {
  let endTime = new Date().getTime()
  if (endTime - startTime > 1000) return
  console.log('draw') // (61) draw
  requestAnimationFrame(draw)
}
```

![image-20240528143446515](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405281435657.png)

地球：
```js
ctx.rotate(
  Math.PI * 2 / 60 * second +
  Math.PI * 2 / 60 / 1000 * millseconds
)
```

月球：
```js
ctx.rotate(
  Math.PI * 2 / 10 * second +
  Math.PI * 2 / 10 / 1000 * millseconds
)
```

## 使用 Canvas 实现钟表动画
<script setup>
import ClockVue from '../.vitepress/theme/components/Clock.vue'
</script>
<ClockVue />
**HTML 结构如下：**
```html [index.html]
<div class="bg">
  <canvas id="clock" width="300" height="300">请升级浏览器</canvas>
</div>
<style>
  body {
    background-color: gray;
  }
  .bg {
    width: 300px;
    height: 300px;
    border-radius: 50px;
    margin: 10px;
    background-color: #000;
  }
</style>
```
**相关 JS 逻辑：**
```js [index.js]
/** @type {HTMLCanvasElement} */
const canvasEl = document.querySelector("#clock")

const ctx = canvasEl.getContext('2d')

requestAnimationFrame(draw)
function draw() {
  ctx.clearRect(0, 0, 300, 300)
  ctx.save()

  let time = new Date()
  let hour = time.getHours()
  let minutes = time.getMinutes()
  let seconds = time.getSeconds()
  let mill = time.getMilliseconds()

  // 1. 背景
  ctx.save()
  ctx.translate(150, 150)
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.arc(0, 0, 130, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // 2. 数字
  let list = [3,4,5,6,7,8,9,10,11,12,1,2]
  ctx.save()
  ctx.translate(150, 150)
  ctx.font = "30px fangsong"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
    for (let i = 0; i < list.length; i++) {
    let x = 100 * Math.cos(Math.PI * 2 / 12 * i)
    let y = 100 * Math.sin(Math.PI * 2 / 12 * i)
    ctx.fillText(list[i], x, y)
  }
  ctx.restore()

  // 3. 时针
  ctx.save()
  ctx.translate(150, 150)
  ctx.rotate(
    Math.PI * 2 / 12 * (hour > 12 ? hour - 12 : hour) +
    Math.PI * 2 / 360 * 30 * minutes / 60
  )
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 10)
  ctx.lineTo(0, -50)
  ctx.stroke()
  ctx.restore()

  // 4. 分针
  ctx.save()
  ctx.translate(150, 150)
  ctx.rotate(
    Math.PI * 2 / 60 * minutes +
    Math.PI * 2 / 60 / 60 * seconds
  )
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 20)
  ctx.lineTo(0, -70)
  ctx.stroke()
  ctx.restore()

  // 5. 秒针
  ctx.save()
  ctx.translate(150, 150)
  ctx.rotate(
    Math.PI * 2 / 60 * seconds + 
    Math.PI * 2 / 60 / 1000 * mill
  )
  ctx.strokeStyle = 'red'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 25)
  ctx.lineTo(0, -75)
  ctx.stroke()
  ctx.restore()

  // 6. 圆心
  ctx.save()
  ctx.translate(150, 150)
  ctx.beginPath()
  ctx.arc(0, 0, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // 7.1 时针刻度
  ctx.save()
  ctx.translate(150, 150)
  // 方法一：计算坐标点
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    let deg = Math.PI * 2 / 12 * i
    ctx.lineWidth = 3
    ctx.moveTo(130 * Math.sin(deg), 130 * Math.cos(deg))
    ctx.lineTo(120 * Math.sin(deg), 120 * Math.cos(deg))
    ctx.stroke()
  }
  // 方法二：旋转坐标轴
  // for (let i = 0; i < 12; i++) {
  //   ctx.rotate(Math.PI * 2 / 12)
  //   ctx.lineWidth = 3
  //   ctx.beginPath()
  //   ctx.moveTo(0, -130)
  //   ctx.lineTo(0, -122)
  //   ctx.stroke()
  // }
  ctx.restore()

  // 7.2 分针刻度
  ctx.save()
  ctx.translate(150, 150)
  for (let i = 1; i <= 60; i++) {
    if (i % 5 === 0) continue
    ctx.beginPath()
    let deg = Math.PI * 2 / 60 * i
    ctx.lineWidth = 1
    ctx.moveTo(130 * Math.sin(deg), 130 * Math.cos(deg))
    ctx.lineTo(125 * Math.sin(deg), 125 * Math.cos(deg))
    ctx.stroke()
  }
  ctx.restore()

  // end
  ctx.restore()
  requestAnimationFrame(draw)
}
```