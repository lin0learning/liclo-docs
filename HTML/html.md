# HTML



## 1.importmap

通过 `importmap` 定义 import 的映射关系，便于在原生html中导入模块。

```html
<script type="importmap">
{
  "imports": {
    "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js",
    "vue": "./node_modules/vue/dist/dist/vue.esm-browser.js"
  }
}
</script>
<script type="module">
  //  import {createApp} from 'vue'
  //  并发加载
  Promise.all([import("vue"), import('vue-router')]).then(() => {})
</script>
```





## 2.标签自定义属性 data-*

**data-*** 为 自定义数据属性，可以通过`HTMLElement.dataset`属性访问，类型为`Object`。

```html
<div data-desc="DivElement" data-tip="Template" id="template">Template</div>
<script>
  const template = document.getElementById("template")
  template.dataset // DOMStringMap {desc: 'DivElement', tip: 'Template'}
</script>
```

自定义属性 `data-*`，`*`有以下限制：

- 该名称不能以`xml`开头，无论这些字母是大写还是小写；
- 该名称不能包含任何分号 (`U+003A`)；
- 该名称不能包含 A 至 Z 的<font color="red">大写字母</font>。

当属性名称带大写字母时会转变为小写；此外，dataset 会自动把 `-` 转换为驼峰：

```bash
data-appId  >>> appid
data-app-id >>> appId
```





## 3.target 与 currentTarget

- <font color="#c7254e">target: 触发事件的元素</font>
- <font color="#c7254e">currentTargent: 事件绑定的元素</font>

- 当事件不支持冒泡时，两者指同一个元素
- 当事件支持冒泡时：比如父元素和子元素都绑定click事件，当点击子元素时，父元素的事件也会触发，此时父元素事件的currentTarget指向父元素，target指向子元素

```html
<div class="out">
  <div class="inner"></div>
</div>

<script>
  let out = document.getElementsByClassName('out')[0];
  let inner = document.getElementsByClassName('inner')[0];
  out.addEventListener('click', (e) => {
    console.log('out');
    console.log('out e.currentTarget: ', e.currentTarget);
    console.log('out e.target: ', e.target);
  })
  inner.addEventListener('click', (e) => {
    // e.stopPropagation()  // 阻止冒泡
    console.log('inner');
    console.log('inner e.currentTarget: ', e.currentTarget);
    console.log('inner e.target: ', e.target);
  })
</script>
```



## 4.img 图片异常处理

```html
<img alt="xxx" src="xxx" onerror="handleError" />
<script>
  function handleError() {
    // 图片加载失败时调用
  }
</script>
```

应用场景：当数据库不存在图片地址，或者存在图片地址，但图片已经被删除，这个时候会出现加载失败情况。

> 在 img 标签 加上`onerror="onerror=null;src='123.jpg'"` ,即当图片加载失败时会自动加载`123.jpg` ，例如

```html
<img src="abc.jpg" onerror="onerror=null;src='123.jpg'" />
```



## 5.原生 DOM 类名操作

补充：原生 js 给 DOM 元素添加、删除类名

**方案一：**

```js
DOMElement.classname = '类名'
```

说明：一次只能设置一个类值，如果当前属性本身存在类值，则会被新类值替换。



**方案二：**



```js
DOM.setAttribute("class", "类名")
 
DOM.removeAttribute("class", "类名")
```

说明：`setAttribute`用于创建或改变某个新属性，如果指定属性已经存在，则只设置该值并且会替换原来的值。



**方案三：**

```js
DOM.classList.add('类名一', '类名二', '类名三'); // 添加一个或多个类名
 
DOM.classList.remove('类名一', '类名二', '类名三'); // 删除一个或多个类名
 
DOM.classList.toggle('类名'); // 切换类名
```

说明：

- add() - 对类属性中添加类名，可以一次添加多个类名，如果存在多个类名，则不会清除替换原有的类名
- remove() - 移除类名列表内的指定类名，可一次移除多个
- replace() - 将 classList 列表中一个已存在的 token 替换为一个新 token。如果第一个参数 token 在列表中不存在， `replace()` 立刻返回`false` ，而不会将新 token 字符串添加到列表中。
- toggle() - 从 classList 列表中删除一个给定的标记并返回 `false`。如果标记不存在，则添加并且函数返回 `true`。





## 6.原生 URL 操作

**新标签页打开指定页面**

```js
window.open(`/msgPage?music=${item}`, '__blank')
```

**修改Tab页标题**

```js
document.title = 'xxx'
```

**不刷新页面修改**url

```js
let newUrl = `${window.location.pathname}?music=${e.data}`
history.pushState({}, '', newUrl)
```

**获取url参数**

```js
// http://127.0.0.1:5173/msgPage?music=vampare
const url = new URL(location.href)
const music = url.searchParams.get('music')
```



## 7.BroadcastChannel

```typescript
// 创建channel，传入的name为频道唯一值
const channel = new BroadcastChannel('my_channel')

// 发送消息
channel.postMessage('logout')

// 接收消息（监听）
channel.addEventListener('message', channelEvent)
function channelEvent(e: MessageEvent<any>) {
  const { data } = e
  // ...
}
```



## 8.关闭页面执行事件

一、`beforeunload`

```js
window.addEventListener("beforeunload", () => {
  // event 如果是异步任务则有概率执行失败
})
```



二、`Navigator.sendBeacon`

> caniuse usage: <font color="#277c32">97.74% </font>. 通过 HTTP POST 传输少量异步数据。它主要用于将统计数据发送到 Web 服务器，同时避免了用传统技术（如：[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)）发送分析数据的一些问题。

```js
navigator.sendBeacon(url, data)
```

data数据支持的四种类型：

- text/plain
- application/x-www-form-urlencoded
- Blob
- FormData

该方法主要用于满足统计和诊断代码的需要，通常在卸载（unload）文档之前向 Web 服务器发送数据。最可靠的方法是在 `visibilitychange` 事件发生时发送数据：

```js
document.addEventListener('visibilitychange', function logData() {
  if (document.visibilityState === 'hidden') {
    navigator.sendBeacon('/log', analyticsData)
  }
})
```







## 9.关闭/刷新页面全局提示

```js
window.isCloseHint = true;
//初始化关闭
window.addEventListener("beforeunload", function(e) {
  if (window.isCloseHint) {
    var confirmationMessage = "要记得保存！你确定要离开我吗？";
    (e || window.event).returnValue = confirmationMessage; // 兼容 Gecko + IE
    return confirmationMessage; // 兼容 Gecko + Webkit, Safari, Chrome
  }
});
```



## 10.script标签的修饰符

```html
<script src='xxx.js'></script>
<script async src='xxx.js'></script>
<script defer src='xxx.js'></script>
```

- `<script src='xxx.js'>`当解析到该标签时，会暂停html解析，并触发js文件下载并执行，然后继续html解析；
- `<script async src='xxx.js'>`浏览器并行js下载和浏览器解析，下载完之后暂停html的解析，执行js，然后继续html解析；
- `<script defer src='xxx.js'>`js下载和html解析并行，等待html解析完成之后再执行js。



## 11.link 标签的修饰符

```html
<!-- preload -->
<link rel="preload" href="style.css" as="css">
<link rel="preload" href="main.js" as="script">

<!-- prefetch -->
<link rel="prefetch" href="other.css" as="script">

<!-- 引入css -->
<link rel="stylesheet" href="style.css" >
```

preload、prefetch以及dns-prefetch的区别：

- preload表示资源在当前页面使用时，浏览器会<font color="red">**优先加载**</font>；
- prefetch表示资源可能在**未来的页面**（如通过链接打开下一个页面）使用，浏览器将会在<font color="red">空闲时预加载</font>；
- **`DNS-prefetch`** (**DNS 预获取**) 是尝试在请求资源之前解析域名。这可能是后面要加载的文件，也可能是用户尝试打开的链接目标。

当浏览器从（第三方）服务器请求资源时，必须先将该[跨域](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)域名解析为 IP 地址，然后浏览器才能发出请求。此过程称为 DNS 解析。DNS 缓存可以帮助减少此延迟，而 DNS 解析可以导致请求增加明显的延迟。对于打开了与许多第三方的连接的网站，此延迟可能会大大降低加载性能。



## 12.复制DOM节点

`Node.cloneNode(deep*)` 方法返回调用该方法节点的一个副本

`deep`：可选参数，是否采用深度克隆，如果为 `true` ，则该节点的所有后代节点也都会被克隆，如果为 `false`，则只克隆该节点本身。

::: code-group

```html [index.html]
<div class="slider-list">
  <div class="slider-item item-1">1</div>
  <div class="slider-item item-2">2</div>
  <div class="slider-item item-3">3</div>
</div>
```

```typescript [index.ts]
const sliderList = document.querySelector('.slider-list')

const firstSwipe = sliderList?.firstElementChild?.cloneNode(true) as HTMLDivElement
const lastSwipe = sliderList?.lastElementChild?.cloneNode(true) as HTMLDivElement

sliderList?.appendChild(firstSwipe) // 尾部insert
sliderList?.insertBefore(lastSwipe, sliderList.firstElementChild)  // 头部insert
```

:::



## 13.浏览器立即渲染

当浏览器触发回流时，浏览器会立即渲染。触发回流的关键：读取元素的位置信息。

```js
sliderList.clientHeight // 强制回流操作，触发浏览器立即渲染
```



## 14.点击 a 标签保存文件

1. `a.download='xxx.xx'` 当指定 a 标签的 `download` 属性时，点击该链接会直接保存为文件，文件名为 `download` 属性；
2. 通过对 a 标签指定的 URL 在服务器设置响应头`Content-Disposition: attachment; filename="filename.jpg"` 可直接下载。



## 15.自定义右键菜单

html部分包含：

- 右键区域
- “右键菜单”元素
- 菜单出现时的蒙版



::: code-group

```html [index.html]
<div id="rtcl"></div>
<div id="mask"></div>
<div id="contextmenu"></div>
```

```ts [index.ts]
const areaEl = document.querySelector('#rtcl')
const mask = document.querySelector("#mask")
const context = document.querySelector('#contextmenu')

function adjustPos(x:number, y:number, w:number, h:number) {
  const PADDING_RIGHT = 6
  const PADDING_BOTTOM = 6
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight
  if (x + w > vw - PADDING_RIGHT) x -= w
  if (y + h > vh - PADDING_BOTTOM) y -= h
  return { x, y }
}

function onContextMenu(e: Event) {
  e.preventDefault()
  mask.style.display = 'block'
  const rect = context.getBoundingClientRect()
  const { x, y } = adjustPos(e.clientX, e.clientY, rect.width, rect.height)
  showContextMenu(x, y)
}

function showContextMent(x:number, y:number) {
  context.style.left = x + 'px'
  context.style.top = y + 'px'
}

function hideContext() {
  mask.style.display = 'none'
  context.style.top = '99999px'
  context.style.left = '99999px'
}

areaEl.addEventListener("context", onContextMenu, false)

mask.addEventListener('mousedown', () => {
  hideContextMenu()
}, false)

context.addEventListener('click', (e) => {
  console.log('点击：', e.target.textContent)
  // 执行菜单项对应命令
  hideContextMenu()
}, false)
```

:::


## 16. 阻止默认行为 & 阻止冒泡
- `event.preventDefault()`: 阻止默认行为
- `event.stopPropagation()`: 阻止事件冒泡



## 17. 音视频采集 `getUserMedia`

```js
const localVideo = ref()

const getLocalStream = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
  })
  localVideo.value.srcObject = stream
  localVideo.value.play()
}
```





## 18. 动态创建 SVG 元素

:::info

**可缩放矢量图形**（**Scalable Vector Graphics，SVG**）基于 [XML](https://developer.mozilla.org/zh-CN/docs/Web/XML) 标记语言，用于描述二维的[矢量图形](https://zh.wikipedia.org/wiki/矢量图形)。

:::

方式一：`document.createElementNS()`

使用`document.createElement()`方法创建 `<svg>` 元素时，会出现在页面中不显示的情况，这是由于 `<svg>` 不属于 HTML5 元素，而属于 XML 标准。创建 svg 元素需要使用`document.createElementNS()`,并在第一个参数中传入指定的命名空间 URI：`http://www.w3.org/2000/svg`。svg 元素一般通过 `setAttribute` 方法来设置属性值。

动态创建 svg 及其子元素时，如果 svg 子元素的命名空间与 svg 容器的<font color="red">命名标签不一致</font>时，子元素会<font color="red">无法显示</font>，但在浏览器F12-Elements中能看到 DOM 结构。

举例说明：

```html
<svg id="svg" xmlns="http://www.w3.org/2000/svg"></svg>

<script>
const oSvg = document.getElementById('svg')

const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
text1.innerHTML = 'hello world'

const text2 = document.createElementNS('http://www.w3.org/1999/svg', 'text')
text2.innerHTML = 'hello world'

const text2 = document.createElement('text')
text2.innerHTML = 'hello world'
  
oSvg.appendChild(text1)  // 正常显示
oSvg.appendChild(text1)  // 不显示
oSvg.appendChild(text1)  // 不显示
</script>
```



**封装代码：**

```ts
type Tags = 'svg'|'g'|'path'|'filter'|'animate'|'marker'|'line'|'polyline'|'rect'|'circle'|'ellipse'|'polygon'|'text'
type Attrs = import('vue').SVGAttributes
type Numberish = number | string

function createTag(tagName:Tags, attrs: Attrs): Node {
  let svgTags = ['svg','g','path','filter','animate','marker','line','polyline','rect','circle','ellipse','polygon','text']
  let el
  if (svgTags.indexOf(tagName) >= 0) {
    el = document.createElementNS('http://www.w3.org/2000/svg', tagName)
  } else {
    el = document.createElement(tagName)
  }
  
  for (let attr in attrs) {
    el.setAttribute(attr, attrs[attr])
  }
  return el
}
```

**实际使用：**
```js
// 1. rect
let devRectLeft = createTag('rect', {
  x: 100,
  y: 32,
  width: '8',
  height: '8',
  stroke: "#4dff4b",
  rx: '2',
  ry: '2',
  'stroke-width': '2'
})

// 2. line
let lineLeft = createTag('line', {
  x1: 154,
  y1: 32,
  x2: 160,
  y2: 44,
  stroke: '#26c7ff',
  'stroke-width': '2'
})
```

实践：![image-20240529113428900](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405291135780.png)



方式二：`v-html`

> `v-html`directive can lead to XSS attack

```vue
<template>
  <div class="svg-container">
    <div
      ref="svgContainer"
      class="svg-item"
      v-html="svgString"
    ></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      svgString: ""
    }
  },
  methods() {
    loadSVG(stationId) {
      let url = `conf_AP/${stationId}.svg`
      if (stationId < 1000) {
        url = "conf_AP/mainTrack.svg"
      }
      return this.$axios.get(url).then(res => {
        this.svgString = res.data
      }).catch(e => {
        this.svgString = ""
        throw e
      })
    }
  }
}
</script>
```



## 19. 嵌套iframe页面通信

**方式一：URL Params**

通过对iframe页面的`src`属性添加url参数进行数据传递：

```vue
<template :src="stationMapUrl"></template>

<script setup>
const stationMapUrl = computed(() => {
  let str = ""
  let index = 1
  for (let key in route.query) {
    str += ((index++ === 1 ? "?" : "&") + key + "=" + route.query[key])
  }
  return window.iframeUrl + "/#/data-board" + str
})
</script>
```

iframe界面中接收：

```typescript
let page = getParameterByName('page')

function getParameterByName(name: string) {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(name)
}
```



**方式二：window.postMessage**

使用`postMessage`适用于非跨域与跨域场景：

:::code-group

```js [main]
onMounted(() => {
  let iframe = document.getElementById('data-iframe')
  
  let userObj = JSON.parse(JSON.stringify(store.state.userObj))
  
  iframe.onload = function() {
    // targetOrigin 应为具体窗口的URI，而不应为"*"（无限制），后者可能会被劫持。
    iframe.contentWindow.postMessage({userObj}, "targetOrigin")
  }
})
```

```js [iframe]
window.addEventListener('message', (msg) => {
  const {userObj} = msg.data
  // ...
})
```



:::

## 20. 错误收集

unhandleRejection => Promise



