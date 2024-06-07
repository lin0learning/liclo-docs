# miniprogram 项目开发

## Page/Component

- 生命周期函数中发送网络请求，获取数据
- 初始化一些数据，以被wxml引用
- 监听wxml中的事件，绑定对应事件函数
- 其他监听（页面滚动、点击、上拉刷新、下拉加载等）



## wxss

页面样式的三种写法：

- 行内样式、页面样式、全局样式



**hidden属性：**

- 共有属性，为true时组件被隐藏；为false时组件显示。

```css
view[hidden] {
  display: none;
}
```



**:empty** 伪类

```css
.default {
  display: none;
}
.content:empty + .default {
  display: block;
}
```





### rpx

> 微信建议使用`375px`作为视觉稿的标准。

微信小程序规定屏幕宽为750rpx，如屏幕物理宽度为750px，则1rpx = 1px。



### 全局字体

推荐在 `app.wxss`中设置以下全局字体，以保证在不同设备上提供较好体验：

```css
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
}
```







## wxml

### 内置组件

- Text文本
- Button按钮
- View视图
- Image图片
- ScrollView滚动
- Swiper轮播图

默认情况下，`/`在微信小程序项目中表示根目录。

 

`<Image/> `组件的初始固定宽高为320px * 240px，比例4:3。

**选择本地媒体文件（相册）**

```js
wx.chooseMedia({
  mediaType: 'image' // string[], default: ['image', 'video']
}).then(res => {
  let currentImage = res.tempFiles[0].tempFilePath
  this.setData({currentImage})
})
```



`<ScrollView/>` 组件设置滚动方向scroll-x / scroll-y。

> 对于横线滚动设置flex布局，需要设置 enable-flex属性以使 flexbox 布局生效。

scroll-view监听滚动的API：

- bindscrolltoupper
- bindsscrolltobelow

可通过回调函数参数中detail的delta值来判断是朝哪个方向滑动。



Input组件双向绑定：

```html
<input type='text' model:value="{{message}}" />
```



**wx:for**

- 数组中对应某项的数据，使用变量名item获取；

```html
<block wx:for="{{playlists}}" wx:key="id">
  	<view>{{item.xx}}</view>
	<!-- other -->
  <block wx:for="{{item.playlist}}" wx:key="id" wx:for-item="subItem">
  	<view>{{subItem.name}}</view>
  </block>
</block>
```

可以使用`wx:for-item`属性来指定item的名称。





**block标签**

类似于Vue中的`<template>`标签，仅仅是一个包装元素，不参与渲染，并只接受控制属性。目的是为`wx:for`等提供整体包裹。



**列表渲染 - item/index名称**

```html
<block wx:for="{{infos}}" wx:key="id" wx:for-item='info' wx:for-index="i"></block>
```



### 获取wxml

`wx.createSelectorQuery()`方法返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用 `this.createSelectorQuery()` 来代替，或使用`in()`方法绑定自定义组件的 `this` 。

```js
// tab标签页 line效果实现
// let query = wx.createSelectorQuery().in(this) 
let query = this.createSelectorQuery()
let _this = this
query.select(`.tab-item${currentIndex} > .tab-text`).boundingClientRect(rect => {
  nav.width = rect.width + 20
  nav.offsetLeft = rect.left - 10
  _this.setData({ nav })
}).exec()
```

`query.selector`返回一个 `NodesRef` 对象实例，可用于获取节点信息。selector 类似于 CSS 选择器，但仅支持下列语法：

- ID选择器：#the-id
- class选择器（可以连续指定多个）：.a-class.another-class
- 子元素选择器：.the-parent > .the-child
- 后代选择器：.the-ancestor .the-descendant
- 跨自定义组件的后代选择器：.the-ancestor >>> .the-descendant
- 多选择器的并集：#a-node, .some-other-nodes



`NodesRef.boundingClientRect(function callback)`：添加节点的布局位置的查询请求。功能与 HTML DOM 的 `getBoundingClientRect`相似，其返回一个 `DOMRect` 对象。

```typescript
let el = document.querySelector("div")
let rect = el.getBoundingClientRect() // DOMRect
```



<img src="https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect/element-box-diagram.png" alt="img" style="zoom: 33%;" />









## wxs

> wxs允许使用<font color="red">es5及以下</font>语法，且必须使用CommonJS导出以供使用。

在WXML中不能直接调用Page/Component中定义的函数，在`.vue`文件中，`template`能调用`script`中的函数。

WXS 代码可以编写在 wxml 文件中的 `<wxs>`标签内，或以`.wxs`为后缀名的文件内。

- wxs标签
- src引用

```html
<wxs module=""></wxs>
<wxs src="" module=""/>
```

### module 属性

module 属性是当前 `<wxs>` 标签的模块名。在单个 wxml 文件内，建议其值唯一。有重复模块名则按照先后顺序覆盖（后者覆盖前者）。不同文件之间的 wxs 模块名不会相互覆盖。

```html
<wxs module="foo">
var some_msg = 'hello world'
</wxs>
<view>{{foo.msg}}</view>
```



### src 属性

src 属性可以用来引用其他的 `wxs` 文件模块：

- 只能引用 `.wxs` 文件模块，且必须使用相对路径；
- 仅当标签为**单闭合标签**或**标签的内容为空**时有效；
- `wxs` 模块均为单例，多次引用，使用的都是同一个 `wxs` 模块对象；
- 若 `wxs` 模块在定义后未被引用，则该模块不会被解析与运行





## 事件处理

- 事件监听
- 事件类型划分
- 事件对象属性
- 事件参数传递
- 冒泡和捕获

事件<font color="red">通过bind/catch属性</font>绑定在组件上，除了公共事件，组件也会有自己的特殊事件。

 target、currenttarget、touches、changedTouches





### 事件参数传递

在Vue中，我们可能会对一些事件传递参数，如 `@click="itemClick(item, index)"`，但在小程序中不存在上述写法。适配性最好的是使用自定义属性 `data-*="{{}}"`，并在事件回调参数的 `target.dataset` 对象中获取。

注意：<font color="red">HTML5 自定义属性 不支持大写字母</font>，`data-*` 的属性名称 * 会转变为小写；此外，dataset 会自动把 `-` 转换为驼峰。

```
data-appId  ---> appid
data-app-id ---> appId
```







### 捕获与冒泡

- 捕获点击事件：`capture-bind:tap` （由外到内）
- 冒泡点击事件：`bind:tap` （由内到外）
- 捕获阻止冒泡事件：`catch:tap` （捕获到事件并阻止冒泡）

```html
<view capture-bind:tap="view1CaptureTap" bind:tap="view1Tap">
	<view capture-bind:tap="view2CaptureTap" bind:tao="view2Tap">
  	<view capture-bind:tap="view3CaptureTap" bind:tap="view3Tap"></view>
  </view>
</view>
```

执行顺序：

```
 view1CaptureTap
 view2CaptureTap
 view3CaptureTap
 view1Tap
 view2Tap
 view3Tap
```







## 组件化开发



```js
Component({
  // 组件属性列表
  properties: {},
  // 组件初始数据
  data:{},
  // 组件方法列表
  methods:{},
  // 组件外部样式定义
  externalClasses: ["xxx"],
  options: {
    // styleIsolation: 'shared', // 样式隔离
    multipleSlots: true, // 多插槽
  },
  // 组件生命周期声明对象
  lifetimes: {
    created() {},
    attached() {},
    detached() {},
  },
  // 组件所在页面的生命周期声明对象
  pageLifetimes: {},
  // 
  observers: {
    innerText(innerText) {
      // 当properties指定的字段内容发生改变时，触发函数
    }
  }
})
```





### 组件样式

组件内的样式对外部样式的影响：

- 组件内的class样式，只对组件wxml内的节点生效，对于引用组件的Page页面不生效；
- **组件(Component)**内不用使用id选择器、属性选择器、标签选择器。（在Page中能使用）

外部样式对组件内样式的影响：

- 外部使用class、id、属性选择器的样式，对组件内不生效（实际生效了）；
- 外部使用标签选择器样式，会对组件内产生影响

外部class及style支持：

- 使用`externalClasses` 属性，例如：`externalClasses: ['num-class', 'desc-class']`

**组件样式暴露实践：**

```html
<!-- Tab.wxml -->
<view>
	<view class="tab-title">本段落样式可由外部class修改</view>
  <slot></slot>
  <slot name="sumb"></slot>
</view>
```

```js
// Tab.js
Component({
  extarnalClasses: ['tab-title']
})
```

页面使用：

```html
<!-- page.wxml -->
<Tab tab-title="tab-title"></Tab>
```

```css
/* page.less */
.tab-title {
  font-size: 36rpx;
  color: red;
  margin: 20rpx 0;
  border: 1px solid #333;
  padding: 2px;
}
```



### 组件通信

- 数据 `properties`
- 样式 `externalClasses`
- 标签 slot
- 自定义事件 `methods`

```js
Component({
  properties: {
    title: {
      type: String,
      value: "default"
    }
  },
  externalClasses: ["a-title"],
  data: {},
  methods: {}
})
```

组件传递数据支持的类型：

- String、Number、Boolean
- Object、Array、null（不限制类型）



**自定义事件**

简单例子：

```html
<view class="tab-title" bind:tap="tabTap">components/tab/Tab.wxml 由外部class决定</view>
```

```js
Component({
  externalClasses: ['tab-title'],
  methods: {
    tabTap() {
      let eventDetail = {
        method: 'the tabTap'
      } // detail对象
      let eventOption = {} // 触发事件的选项
      this.triggerEvent('tabTap', eventDetail, eventOption)
    }
  }
})
```

page使用

```html
<Tab tab-title="tab-title-class" bind:tabTap="tabTap" />
```

```js
Page({
  tabTap({detail: emits}) {
    emits
  }
})
```



### 页面调用组件方法

调用组件方法，首先获取**组件实例对象**：`this.selectComponent`，该方法使用选择器选择组件实例节点。

```js
Page({
  excuFCMethod() {
    const component = this.selectComponent('.a-component')
    
    component.innerTest(/*some parameters*/)
  }
})
```



### 组件插槽

默认情况下，一个组件的 wxml 中只能有一个 slot。需要使用多 slot 时，可以在组件 js 中声明启用。

```js
Component({
  options: {
    multipleSlots: true
  }
})
```

以不同的 `name` 来区分 slot（具名插槽）

```html
<view>
	<slot name="before"></slot>
  <slot name="after"></slot>
</view>
```



### 组件生命周期/页面

组件的生命周期可以在 `lifetimes` 字段内进行声明（推荐方式，其优先级最高）

```js
Component({
  lifetimes: {
    attached: function() {},
    detached: function() {},
  },
  pageLifetimes: {
    show() {},
    hide() {}
  }
})
```





### behaviors

`behaviors` 是用于组件间代码共享的特性，类似于一些编程语言中的 “mixins” 或 “traits”。

```js
// my-behavior.js
module.exports = Behavior({
  behaviors: [],
  methods: {
    myBehaviorMethod: function() {}
  }
})

// my-component.js
var myBehavior = require('my-behavior')
Component({
  behaviors: [myBehavior]
})
```



### Component 构造器

```js
Component({
  behaviors: [],
  properties: {},
  data: {},
  lifetimes: {},
  pageLifetimes: {},
  externalClasses: [],
  method: {}
})
```



## 自定义Tabbar

首先在`app.json`中配置 `tabbar`的基本设置，并添加`"custom": true`：

```json
{
  "tabBar": {
    "custom": true, /* key property */
    "color": "black",
    selectedColor: "#3F56D9",
    "backgroundColor": "#fff",
    "list": [
      // ...
    ]
  }
}
```

然后在根目录下创建 `custom-tab-bar` 文件夹并新建 `Component`，

```html
<view class="tab-bar">
  <view
    wx:for="{{list}}" 
    wx:key="index" 
    class="tab-bar-item"
    data-path="{{item.pagePath}}"
    data-index="{{index}}"
    bind:tap="switchTab"
  >
    <image src="{{selected === index ? item.selectedIconPath : item.iconPath }}" class="icon"/>
    <view style="color: {{selected === index ? selectedColor : color}}">{{item.text}}</view>
  </view>
</view>
```

```js
// index.js
Component({
  properties: {
    selected: {
      type: Number,
      value: 0
    }
  },
  data: {
    color: '#000',
    selectedColor: '#3F56D9',
    list: [/*数据与`app.json`中一致*/]
  },
  methods: {
    const data = e.currentTarget.dataset
    const url = data.path
    wx.switchTab({ url })
    this.setData({
      selected: this.properties.selected  // 使用 properties 解决图标及文字闪烁问题
    })
  }
})
```

为了解决 icon 图标闪烁及点击两次才正常显示问题，使用 properties 传值来解决 selected 当前值，在每个tab页面定义一下函数：

```js
Page({
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0 // 对应tabbar 的 index，为当前页面在 tabBar 配置 list 数组的索引
      })
    }
  }
})
```







## APIs

### 一、网络请求

`wx.request(Object, object)`

```js
wx.request({
  url: 'http://123.207.32.32:1888/api/home/houselist',
  data: { // 参数
    page: 1
  }
})
```



### 二、展示弹窗效果

- showToast
- showModal
- showLoading
- showActionSheet



### 三、分享功能

小程序的两种分享方式：

1. 点击右上角菜单按钮，点击转发
2. 点击某个按钮执行转发操作 `<button open-type="share">`

通过`onShareAppMessage`监听用户点击页面内转发按钮（[button](https://developers.weixin.qq.com/miniprogram/dev/component/button.html) 组件 `open-type="share"`）或右上角菜单“转发”按钮的行为，并自定义转发内容。

> **注意：只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮**

```js
Page({
  onShareAppMessage() {
    return {
      title: 'test share',
      path: 'pages/08_APIs/index',
      imageUrl: 'xxx'
    }
  }
})
```



### 四、设备信息和位置信息

- 获取设备信息： `wx.getSystemInfo(Object object)`
- 获取位置信息：`wx.getLocation`

注意：自 2022 年 7 月 14日后发布的小程序，使用8个地理位置相关接口，需要在 `app.json` 中声明该字段

```json [app.json]
{
  "requiredPrivateInfos": [
    "getLocation"
  ],
  "permission": {
    "scope.userLocation": {
      "desc": "授权小程序获取您的当前位置"
    }
  }
}
```
在 Page/Component 中使用：
```js
const location = await wx.getLocation({type: 'wgs84'})
if (location.errMsg !== 'getLocation:ok') return
const {latitude, longitude} = location
// ...
```

![image-20240306161603399](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202403061616575.png)





### 五、Storage存储

setStorage/getStorage/removeStorage/clearStorage - Sync异步



### 六、界面跳转的方式

- 通过`<navigator>`组件
- 通过 wx API
  - wx.switchTab        跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
  - wx.reLaunch         关闭所有页面，打开到应用内的某个页面
  - wx.redirectTo       关闭当前页面，跳转到某个页面
  - wx.navigateTo      保留当前页面，跳转到某个页面（不能跳转到 tabbar 页面）
  - wx.navigateBack  关闭当前页面，返回上一页面或多级页面（由当前页面栈决定）

```js
// 页面A
onNavTap() {
  wx.navigateTo({
    // 方式一：queryString
    url: '/xxx/xxx?name=dekki&age=18',
  })
}
// 跳转页面B
Page({
  onLoad(options) {
    options // {name:'dekki', age: 18}
  }
})
```

`wx.navigateBack`返回页面时传递参数：

- 获取上一级页面的Page实例，再`setData`（可能会造成数据异常）
- 基础库<font color="red">2.7.3</font>开始支持 events 参数，可用于数据传递



```js
// 设置事件
wx.navigateTo({
  url: 'xxx',
  events: {
    backEvent(data) {/**/},
    why(data) {/**/}
  }
})
// 拿到eventChannel，emit事件
const eventChannel = this.getOpenerEventChannel()
eventChannel.emit('backEvent', ...args)
eventChannel.emit('why', ...args)
```



**navigator**组件

用于界面的跳转，也可以跳转到其他小程序中。

```html
<navigator url="/pages/xxx">跳转</navigator>
<navigator open-type="navigateBack">返回</navigator>
```





### 七、小程序登录

是被小程序用户身份：

- openuid、unionid
- code
- authToken

```js
wx.login({
  success (res) {
    if (res.code) {
      //发起网络请求
      wx.request({
        url: 'https://example.com/onLogin',
        data: {
          code: res.code
        }
      })
    } else {
      console.log('登录失败！' + res.errMsg)
    }
  }
})
```













## web-view

承载网页的容器（小程序不支持使用iframe）。会自动铺满整个小程序页面，**个人类型的小程序暂不支持使用。**

```html
<web-view src="https://www.bilibili.com"></web-view>
```

`<web-view>`组件注意事项：

- web-view组件中的网页必须是HTTPS协议，并且需要添加到小程序的后台配置白名单，网页内 iframe 的域名也需要配置到域名白名单；
- web-view组件的跳转链接需要使用小程序的跳转方式，不能直接使用a标签的href属性；
- web-view组件中的网页和小程序之间是独立的，无法进行数据传递和交互。

在项目中可单独注册一个`web-view` page：

```json
{
  "pages": [
    "pages/web/index"
  ]
}
```

```html
<!-- ./pages/web/index.wxml -->
<web-view src="{{webUrl}}"></web-view>
```

```typescript
interface Options {
  url?: string
  title?: string
}
Page({
  onLoad(options: Options) {
    const {url, title} = options
    if (url) {
      this.setData({
        webUrl: url
      })
      if (title) {
        wx.setNavigationBarTitle({ title })
      }
    } else {
      wx.navigateBack({ delta: 1 })
    }
  }
})
```

实际使用：

```js
{
  // ...
  goOfficialWebsite() {
    const url = 'https://docs.cloudbase.net/toolbox/quick-start';
    wx.navigateTo({
      url: `../web/index?url=${url}`,
    });
  },
}
```





## 下拉刷新
应用场景：下拉刷新页面数据或执行`onLoad`函数中的相关功能
:::code-group
```js [index.js]
Page({
  onPullDownRefresh() {
    wx.showNavigationBarLoading() // navBar显示loading状态

    /* your code here */

    wx.hideNavigationBarLoading() // navBar隐藏loading状态
    wx.stopPullDownRefresh()  // 停止下拉刷新
  }
})
```
```json [index.json]
{
  "enablePullDownRefresh": true, // 当前页
  "backgroundTextStyle": "dark"  // 顶部显示颜色为深色的三个点
}
```
:::





## 媒体播放

### 1. 音乐播放

```js
// 1. 创建播放器（公共）
const audioContext = wx.createInnerAudioContext()

Page({
  onLoda() {
    // 2. 播放歌曲
    audioContext.src = 'https://music.163.com/...'
    // 3. 自动播放
    audioContext.autoplay = true
    // audioContext.play() // 可能会存在未缓冲数据播放失败
    // audioContext.onCanplay(() => {/* */})
    // 4. 设置播放进度
    audioContext.onTimeUpdate(() => {
      // 当前播放时间
      audioContext.currentTime  // second
    })
  }
})
```

格式化 minute

```js
function formatMinute(num) {
  num = num / 1000
  if (num >= 60) {
    var second = Math.floor(num) % 60
    var minute = Number(Math.floor(num) / 60)
    return padLeft(minute) + ':' + padLeft(second)
  } else {
    return '00:' + padLeft(Math.floor(num))
  }
}

function padLeft(time) {
  time = time + ""
  return ('00' + time).slice(time.length)
}
```

功能实现：

一、歌曲播放

- audioContext = wx.createInnerAudioContext()
- src属性
- autoplay

二、歌曲进度条控制

- onTimeUpdate(() => {}) 播放回调

三、进度条点击控制

- slider-bindchange、bindchanging
- 通过audioContext.seek() 传入时间设置当前播放时间

四、播放/暂停

- audioContext.pause()
- audioContext.play()

五、歌词匹配

- lrc字符串处理（正则表达式）
- 时间匹配（大于当前歌词时间则显示）



### 2. 视频播放

使用微信小程序提供的`<video>`组件

```html
<video 
 src="{{videoURL}}"
 class="video"
 autoplay
 danmu-list="{{danmuList}}"
 referer-policy="origin"
 enable-danmu
/>
```







## 分包加载

```bash
├── app.js
├── app.json
├── packageA
│   └── pages
│       ├── cat
├── packageB
│   └── pages
│       ├── apple
├── pages
│   ├── index
│   └── logs
```

```json
// app.json
{
  "pages": [
    "pages/index",
    "pages/logs"
  ],
  "subpackages": [
    {
      "root": 'packageA',
      "pages": [
        "pages/cat"
      ]
    },
    {
      "root": 'packageB',
      "pages": [
        "pages/apple"
      ]
    }
  ]
}
```





## 云开发

云开发有以下主要方面：

- 云数据库
- 云存储
- 云函数



小程序端开始使用云能力前，需先调用 `wx.cloud.init` 方法完成云能力初始化。

```js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      // error
    } else {
      wx.cloud.init({
        env: 'your env code',
        traceUser: false
      })
    }
    this.globalData = {}
  }
})
```

云数据库的增删改查操作：

```js
Page({
  onOperate() {
    // 0. 获取数据库和集合
    const db = wx.cloud.database()
    const userCol = db.collection('users')
    
    // 1. 查询数据
    // 1.1 通过 ID 精确查询某一条数据 doc(id).get()
    // 1.2 条件查询满足条件的数据 where
    // 1.3 通过指令过滤数据 db.command
    // 1.4 通过正则表达式 db.RegExp
    // 1.5 获取集合 get
    // 1.6 过滤、分页、排序等 field skip limit orderBy
    let page = 1
    userCol.field({
      _id: true,
      nickname: true,
      roomName: true,
      rid: true
    }).skip(page * 5).limit(5).orderBy("rid", "asc").get().then(res => {
      // ...
    })
    
    
    // 2. 在数据库中添加数据 // add
    collection.add({
      data: {
        // ...
      },
			success: (res) => {
        // ...
      }
    })
    
    // 3. 修改数据
    // 3.1更新某一字段 // update
    userCol.doc("the_Data_id").update({
      data: {
        // ...
      }
    })
    // 3.2替换整条数据 // set
    userCol.doc("the_Data_id").set({
      data: {
        // ...
      }
    })
    
    // 4. 删除数据 (根据用户权限，流水等不能删除、修改)  // remove
    userCol.doc("the_Data_id").remove()
  }
})
```

查询语句：`db.command`

```js
const db = wx.cloud.database()
const _ = db.command
```

上传文件：

```js
wx.chooseMedia({
  count: 1,
  success: chooseResult => {
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: 'my-photo.png',
      // 指定要上传的文件的小程序临时文件路径
      filePath: chooseResult.tempFilePaths[0],
      config: {
        env: this.data.envId
      }
    }).then(res => {}).catch(e => {})
  },
  fail: error => {}
})
```





## 多人协作开发

在多人协作开发微信小程序时，微信开发者工具的appid和服务端设置的appid必须一致，否则在调用code2session的时候，会返回40029代码，在小程序里设置开发者账号也不行。







- van-search
- van-skeleton
- van-popup
- van-icon
- van-field
- van-overlay
- van-info
- van-cell
- van-transition
