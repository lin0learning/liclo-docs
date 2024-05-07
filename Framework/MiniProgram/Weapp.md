# Weapp - 微信小程序

## 1. 底层架构

小程序的运行环境分成渲染层和逻辑层，其中 WXML 模板和 WXSS 样式工作在渲染层，JS 脚本工作在逻辑层。

![img](https://res.wx.qq.com/wxdoc/dist/assets/img/4-1.ad156d1c.png)

小程序的逻辑层和渲染层是分开的，逻辑层运行在 JSCore 中，并没有一个完整浏览器对象，因而缺少相关的DOM API和BOM API。

## 2. 目录结构

一个**<u>小程序主体部分</u>**由三个文件组成，必须放在项目的根目录，如下：

| 文件                                                         | 必需                        | 作用             |
| :----------------------------------------------------------- | :-------------------------- | :--------------- |
| [app.js](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html) | 是                          | 小程序逻辑       |
| [app.json](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html) | 是                          | 小程序公共配置   |
| [app.wxss](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html) | <font color="red">否</font> | 小程序公共样式表 |

一个**<u>小程序页面</u>**由四个文件组成，分别是：

| 文件类型                                                     | 必需                        | 作用       |
| :----------------------------------------------------------- | :-------------------------- | :--------- |
| [js](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html) | 是                          | 页面逻辑   |
| [wxml](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/) | 是                          | 页面结构   |
| [json](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#页面配置) | <font color="red">否</font> | 页面配置   |
| [wxss](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html) | <font color="red">否</font> | 页面样式表 |



## 3. 配置

**项目配置文件**

1. `project.config.json` 和 `project.private.config.json` 文件可以对项目进行配置
2. `project.private.config.json`  中的相同设置优先级高于 `project.config.json`
3. 可以将 `project.private.config.json` 写到 `.gitignore` 避免版本管理的冲突



基本数据结构：

- String : 字符串
- Hash：散列
- List：列表
- Set：集合
- Sorted Set：有序集合



**全局配置**

`app.json`

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/index"
  ],
  "window": {
    "navigationBarTitleText": "Demo"
  },
  "tabBar": {
    "list": [{
      "pagePath": "pages/index/index",
      "text": "首页"
    }, {
      "pagePath": "pages/logs/index",
      "text": "日志"
    }]
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": true
}
```

**页面配置**

`pageName.json`

```json
{
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "navigationBarTitleText": "微信接口功能演示",
  "backgroundColor": "#eeeeee",
  "backgroundTextStyle": "light"
}
```



**注册页面**

简单页面使用 `Page()`进行构造。

```js
//index.js 示例
Page({
  data: {
    text: "This is page data."
  },
  onLoad: function(options) {
    // 页面创建时执行
  },
  onShow: function() {
    // 页面出现在前台时执行
  },
  onReady: function() {
    // 页面首次渲染完毕时执行
  },
  onHide: function() {
    // 页面从前台变为后台时执行
  },
  onUnload: function() {
    // 页面销毁时执行
  },
  onPullDownRefresh: function() {
    // 触发下拉刷新时执行
  },
  onReachBottom: function() {
    // 页面触底时执行
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
  onPageScroll: function() {
    // 页面滚动时执行
  },
  onResize: function() {
    // 页面尺寸变化时执行
  },
  onTabItemTap(item) {
    // tab 点击时执行
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
  // 事件响应函数
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    }, function() {
      // this is setData callback
    })
  },
  // 自由数据
  customData: {
    hi: 'MINA'
  }
})
```

[Page 参考文档](https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html)。

**使用 Component 构造器构造页面**

`Page` 构造器适用于简单的页面。但对于复杂的页面， `Page` 构造器可能并不好用。

此时，可以使用 `Component` 构造器来构造页面。 `Component` 构造器的主要区别是：方法需要放在

 `methods: { }` 里面。

```js
// index.js 示例
Component({
  data: {
    text: "This is page data."
  },
  methods: {
    onLoad: function(options) {
      // 页面创建时执行
    },
    onPullDownRefresh: function() {
      // 下拉刷新时执行
    },
    // 事件响应函数
    viewTap: function() {
      // ...
    }
  }
})
```

页面的生命周期方法（即 `on` 开头的方法），应写在 `methods` 定义段中。

使用 `Component` 构造器来构造页面的一个好处是可以使用 `behaviors` 来提取所有页面中公用的代码段。

例如，在所有页面被创建和销毁时都要执行同一段代码，就可以把这段代码提取到 `behaviors` 中。

<u>代码示例</u>：

```js
// page-common-behavior.js
module.exports = Behavior({
  attached: function() {
    // 页面创建时执行
    console.info('Page loaded!')
  },
  detached: function() {
    // 页面销毁时执行
    console.info('Page unloaded!')
  }
})
```

```js
// 页面 A
var pageCommonBehavior = require('./page-common-behavior')
Component({
  behaviors: [pageCommonBehavior],
  data: { /* ... */ },
  methods: { /* ... */ },
})
```

```js
// 页面 B
var pageCommonBehavior = require('./page-common-behavior')
Component({
  behaviors: [pageCommonBehavior],
  data: { /* ... */ },
  methods: { /* ... */ },
})
```



## 4. 页面生命周期

![img](https://res.wx.qq.com/wxdoc/dist/assets/img/page-lifecycle.2e646c86.png)

逻辑



## 5. 页面路由

所有页面的路由全部由框架进行管理。框架以栈的形式维护了当前所有页面。

使用 `getCurrentPages()` 函数获取当前页面栈。

路由的触发方式及页面生命周期函数：

| 路由方式   | 触发时机                                                     | 路由前页面 | 路由后页面         |
| :--------- | :----------------------------------------------------------- | :--------- | :----------------- |
| 初始化     | 小程序打开的第一个页面                                       |            | onLoad, onShow     |
| 打开新页面 | 调用 API [wx.navigateTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateTo.html) 使用组件 [`<navigator open-type="navigateTo" />`](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html) | onHide     | onLoad, onShow     |
| 页面重定向 | 调用 API [wx.redirectTo](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.redirectTo.html) 使用组件 [`<navigator open-type="redirectTo" />`](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html) | onUnload   | onLoad, onShow     |
| 页面返回   | 调用 API [wx.navigateBack](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.navigateBack.html) 使用组件[`<navigator open-type="navigateBack" />`](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html) 用户按左上角返回按钮 | onUnload   | onShow             |
| Tab 切换   | 调用 API [wx.switchTab](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html) 使用组件 [`<navigator open-type="switchTab" />`](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html) 用户切换 Tab |            | 各种情况请参考下表 |
| 重启动     | 调用 API [wx.reLaunch](https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.reLaunch.html) 使用组件 [`<navigator open-type="reLaunch" />`](https://developers.weixin.qq.com/miniprogram/dev/component/navigator.html) | onUnload   | onLoad, onShow     |

**注意事项**

- `navigateTo`, `redirectTo` 只能打开非 tabBar 页面。
- `switchTab` 只能打开 tabBar 页面。
- `reLaunch` 可以打开任意页面。
- 页面底部的 tabBar 由页面决定，即只要是定义为 tabBar 的页面，底部都有 tabBar。
- 调用页面路由带的参数可以在目标页面的`onLoad`中获取。



## 6. 模块化

```js
// common.js
function sayHello(name) {
  console.log(`Hello ${name}`)
}
function sayGoodbye(name) {
  console.log(`sayGoodbye ${name}`)
}

module.exports.sayHello = sayHello
exports.sayGoodbye = sayGoodbye
```

```js
// 使用
const common = require("./common.js")
Page({
  helloMINA: function() {
    common.sayHello("MINA")
  }
})
```



## 7. API

约定：

- 以 `on` 开头的 API 用来监听某个事件是否触发
- 以 `Sync` 结尾的 API 都是同步 API
- 大多数 API 都是异步 API

```js
wx.request({
  url: 'xxx',
  data: {
    x: "",
  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success (res) {
    console.log(res.data)
  },
  fail: (error) {
  
	},
  complete: () {}
})
```



## 8. 视图层

**获取界面节点信息**

```js
const query = wx.createSelectorQuery()
query.select('#the-id').boundingClientRect(function(res){
  res.top // #the-id 节点的上边界坐标（相对于显示区域）
})
query.selectViewport().scrollOffset(function(res){
  res.scrollTop // 显示区域的竖直滚动位置
})
query.exec()
```

在自定义组件或包含自定义组件的页面中，推荐使用 `this.createSelectorQuery` 来代替 `wx.createSelectorQuery`，这样可以确保在正确的范围内选择节点。



**响应显示区域变化**

启用屏幕旋转支持（基础库版本`2.4.0`），在`app.json`的 `window` 段设置：

```json
{
  "pageOrientation": "auto"
}
```



**媒体查询**

```css
.my-class {
  width: 40px;
}

@media (min-width: 480px) {
  /* 仅在 480px 或更宽的屏幕上生效的样式规则 */
  .my-class {
    width: 200px;
  }
}
```



## 9.  小程序运行时

**无法被 Polyfill 的 API：**

- `Proxy`对象

**Promise 时序差异**

iOS 环境下的 `Promise` 是一个使用 `setTimeout` 模拟的 Polyfill。这意味着 `Promise` 触发的任务为普通任务，而非微任务，进而导致 **在 iOS 下的 `Promise` 时序会和标准存在差异**。

```js
var arr = []

setTimeout(() => arr.push(6), 0)
arr.push(1)
const p = new Promise(resolve => {
  arr.push(2)
  resolve()
})
arr.push(3)
p.then(() => arr.push(5))
arr.push(4)
setTimeout(() => arr.push(7), 0)

setTimeout(() => {
  // 应该输出 [1,2,3,4,5,6,7]
  // 在 iOS 小程序环境，这里会输出 [1,2,3,4,6,5,7]
  console.log(arr)
}, 1000)
```



**小程序更新机制**

1. 启动时同步更新：定期检查发现版本更新 或 用户长时间未使用小程序 会在小程序启动时同步更新代码包。同步更新会阻塞小程序的启动流程，影响小程序的启动耗时。
2. 启动时异步更新：

```js
const updateManager = wx.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate)
})

updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success(res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})

updateManager.onUpdateFailed(function () {
  // 新版本下载失败
})
```



## 10.  自定义组件

1. 创建自定义组件

在 `json` 文件中自定义组件声明：

```json	
{
  "component": true
}
```

**注意：在组件wxss中不应使用ID选择器、属性选择器和标签名选择器。**

**代码示例：**

```js
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    innerText: {
      type: String,
      value: 'default value',
    }
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function(){}
  }
})
```

**使用自定义组件**

在页面的 `json` 文件中进行引用声明：

```json
{
  "usingComponents": {
    "component-tag-name": "path/to/the/custom/component"
  }
}
```



**组件 wxml 的 slot**

默认情况下，一个组件的 wxml 中只能有一个 slot，需要使用<u>多个 slot</u> 时，可以再组件 js 中声明启用：

```js
Component({
  options: {
    multipleSlots: true
  },
  properties: { /* ... */ },
  methods: { /* ... */ }
})
```



**组件样式**

推荐只使用 `class` 选择器：

```css
#a {} /* 无法使用 */
[a] {} /* 无法使用 */
button {} /* 无法使用 */
.a > .b {} /* 除非.a是 view 组件节点，否则不一定生效 */
```



此外，组件可以指定它所在节点的默认样式，使用 `:host` 选择器（1.7.2+）：

```css
/* 组件 custom-component.wxss */
:host {
  color: yellow;
}
```



**获取组件实例**

调用 `this.selectComponent`，获取子组件实例对象。



**Component 构造器**

[Component 参考文档](https://developers.weixin.qq.com/miniprogram/dev/api/xr-frame/classes/Component.html)

[Component 构造器指南](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html)

使用 Component 构造器构造页面

```json
// index.json
{
  "usingComponents": {}
}
```

组件的属性可以用于接收页面的参数，如访问页面 `/pages/index/index?paramA=123&paramB=xyz` ，如果声明有属性 `paramA` 或 `paramB` ，则它们会被赋值为 `123` 或 `xyz` 。

```js
// index.js
Component({
  properties: {
    paramA: Number,
    paramB: String,
  },
  methods: {
    onLoad: function() {
      this.data.paramA // 页面参数 paramA 的值
      this.data.paramB // 页面参数 paramB 的值
    }
  }
})
```



## 11. 微信小程序登录流程

### 官方流程

官方流程图：

![img](https://res.wx.qq.com/wxdoc/dist/assets/img/api-login.2fcc9f35.jpg)

**说明**

1. 调用 [wx.login()](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html) 获取 **临时登录凭证code** ，并回传到开发者服务器。
2. 调用 [auth.code2Session](https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html) 接口，换取 **用户唯一标识 OpenID** 、 用户在微信开放平台账号下的**唯一标识UnionID**（若当前小程序已绑定到微信开放平台账号） 和 **会话密钥 session_key**。

之后开发者服务器可以根据用户标识来生成自定义登录态，用于后续业务逻辑中前后端交互时识别用户身份。



### 个人实现

![](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202401250947897.png)

调用`wx.login()`
```js
wx.login({
  success: (res) => {
    // 获取code
    if (res.code) {
      // 调用后端接口发送code
      wx.request({
        url: '...',
        data: {code},
        success: (res) => {
          const token = res.data.token
          wx.setStorageSync('token', token)  // 保存登录凭证至本地
        }
      })
    }
  }
})
```

改进：

```js
export const getCode = () => {
  return new Promise((resolve) => {
    wx.login({
      success: res => resolve(res.code), // 获取code
    })
  })
}

export const WXLogin = () => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: '...',
      data: {code},
      success: res => resolve(res.data),
      fail: err => reject(err)
    })
  })
}
```

