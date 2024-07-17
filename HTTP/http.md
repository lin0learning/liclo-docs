# HTTP

## 1. 部署

Apache程序基于**IP地址**、**主机名（域名）**、**端口号**的虚拟主机功能

- IP地址：`10.254.249.19`、`10.254.249.10`
- 主机名（域名）：`liclo.fun`、`abc.liclo.fun`
- 端口号：`10.254.249.19:8080`、`10.254.249.19:9090`、`www.liclo.fun:9999`



1. 安装 Apache 服务程序

```bash
yum install httpd
```

2. 启动服务

```bash
systemctl start httpd

// 或者设置开机自启动
systemctl enable httpd
```

### 1. 基于 IP 地址

1. 添加对应 IP 地址
2. ping 测试
3. 配置 `httpd.conf`

```	xml
<VirtualHost 192.168.42.110>
DocumentRoot /home/wwwroot/110
ServerName www.linuxprobe.com
<Directory /home/wwwroot/110>
AllowOverride None
Require all granted
</Directory>
</VirtualHost>

<VirtualHost 192.168.10.120>
DocumentRoot /home/wwwroot/120
ServerName bbs.linuxprobe.com
<Directory /home/wwwroot/120 >
AllowOverride None
Require all granted
</Directory>
</VirtualHost>

<VirtualHost 192.168.10.130>
DocumentRoot /home/wwwroot/130
ServerName tech.linuxprobe.com
<Directory /home/wwwroot/130 >
AllowOverride None
Require all granted
</Directory>
</VirtualHost>
```



4. 重启 httpd服务

```shell	
systemctl restart httpd
```



### 2. 基于主机名（域名）

1. 配置网卡 **IP 地址**与 **hosts 文件**，hosts 文件的作用是定义 IP 地址与主机名的映射关系，**<u>即强制将某个主机名地址解析到指定的 IP 地址</u>**。

```shell
vim /etc/hosts
```

```shell
127.0.0.1		localhost localhost.localdomain localhost4 localhost4.localdomain
::1					localhost localhost.localdomain localhost6 localhost6.localdomain
192.168.42.10  yum.nulige.com
192.168.42.100 www.linuxprobe.com
192.168.42.100 bbs.linuxprobe.com
192.168.42.100 tech.linuxprobe.com
```

2. 分别在网站目录中写入不同的首页文件

3. 在主配置文件中(`/etc/httpd/conf/httpd.conf`)配置基于主机名称的虚拟主机

```xml
<VirtualHost 192.168.42.100>
DocumentRoot "/home/wwwroot/www"
ServerName "www.linuxprobe.com"
<Directory "/home/wwwroot/www">
AllowOverride None
Require all granted
</directory>
</VirtualHost>
 <VirtualHost 192.168.42.100>
DocumentRoot "/home/wwwroot/bbs"
ServerName "bbs.linuxprobe.com"
<Directory "/home/wwwroot/bbs">
AllowOverride None
Require all granted
</Directory>
</VirtualHost>
<VirtualHost 192.168.42.100>
DocumentRoot "/home/wwwroot/tech"
ServerName "tech.linuxprobe.com"
<Directory "/home/wwwroot/tech">
AllowOverride None
Require all granted
</directory>
</VirtualHost>
```

![img](https://img2018.cnblogs.com/blog/1835656/201910/1835656-20191030210855784-473621088.png)

4. 重启 httpd 服务



### 3. 基于端口

1. 创建基于端口的网站数据目录，并添加文件
2. 修改配置文件 `/etc/httpd/conf/httpd.conf`

```xml
Listen 80
Listen 6111
Listen 6222
```

3. 主配置文件末尾按格式定义虚拟主机信息

```xml
<VirtualHost 192.168.42.100:6111>
DocumentRoot “/home/wwwroot/6111”
ServerName www.linuxprobe.com
<Directory “/home/wwwroot/6111”>
AllowOverride None
Require all granted
</Directory>
</VirtualHost>

<VirtualHost 192.168.42.100:6222>
DocumentRoot “/home/wwwroot/6222”
ServerName bbs.linuxprobe.com
<Directory “/home/wwwroot/6222”>
AllowOverride None
Require all granted
</Directory>
</VirtualHost>
```



## 2. HTTPS地址加载HTTP资源

在`https`地址中，如果加载了`http`资源，浏览器会认为是不安全的资源，将会<u>默认阻止</u>。可在文档中添加以下`meta`标签解决：

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```



## 3. PC/H5切换-Nginx

js项目中使用`navigator.userAent`进行相关判断，而使用`Nginx`则更佳：

```nginx
# nginx.conf
http {
  map $http_user_agent $isMobile {
    default 0;
    "~*android|iphone|ipad" 1;
  }
  
  server {
    location / {
      root html;
      if ($isMobile) {
        root mobile;
      }
      index index.html index.htm;
    }
  }
}
```



## 4. HTTPS地址加载HTTP资源

在`https`地址中，如果加载了`http`资源，浏览器会认为是不安全的资源，将会<u>默认阻止</u>。可在文档中添加以下`meta`标签解决：

```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```







## 5. 浏览器触发下载

### 服务器方式

链接服务器地址，后端需设置添加响应头`Content-Disposition`设置为附件格式，并指定文件名来触发下载

```js
app.get('/es6.pdf', (req,res) => {
  res.setHeader('Content-Disposition', 'attachment;filename=es6.pdf') // function
  res.sendFile(__dirname+'/es6.pdf')
})
```

### js处理

对`a`标签添加 download 属性，要求为<u>同源url</u>

```html
<a download='es6.pdf' href="http://xxx/es6.pdf">点击下载</a>
```



不经过浏览器中转的文件下载：校验请求下载文件的权限，验证成功返回url，再通过上述方式下载文件。（不使用ajax请求接收blob数据来创建文件的本地url链接）





## 6. FormData 表单请求

在发送`FormData`表单类型的POST请求时，为了让后端解析出正确的数据，HTTP请求的`Content-Type`的类型为`multipart/form-data`，完整的设置为：

```http
Content-Type: multipart/form-data; boundary=xxxx
```

前半部分代表数类型，而`boundary`代表分隔符，对应的值为请求方自定义设置。采用`FormData`格式的数据实际的消息格式如下：

```http
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary5VHiAbbEyGxjHRBD
```

![image-20231026142338797](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202310261423015.png)

值用 `boundary`分隔。在这种表单提交的情景下，我们**不需要手动设置**Content-Type，所以也不用去管Body中的数据是如何排列的，不需要知道boundary是什么，这些都有浏览器来自动完成。

使用`FormData`发送文本和文件：

```js
const formData = new FormData();

// 文件列表
if (fileList.lenght > 0) {
  fileList.forEach(file => {
    formData.append("files", file)
  })
}
let temp = {
  userCount: "liclo",
  userInfo: "xxx"
}
for (let key in temp) {
  formData.append(key, temp[key])
}
await http({
  url: "xxx",
  method: "post",
  data: formData
})
```

在使用组件`<a-upload>`并设置手动上传时，组件对双向绑定的文件进行了封装，即继承自`File`，但附带额外属性用于渲染：`UploadFile`。[文档链接](https://3x.antdv.com/components/upload-cn#UploadFile)





## 7. 预检请求(preflight request)

为了防止对数据库数据产生影响，规范要求，对这种可能对服务器数据产生副作用的HTTP请求方法，浏览器必须先使用<span style="color: orange">`OPTIONS`</span>方法发起一个预检请求，从而获知服务器是否允许该跨域请求：如果允许，就发送带数据的真实请求；如果不允许，则阻止发送带数据的真实请求。

HTTP请求包括：

- 简单请求
- 需预检的请求



### 1. 简单请求

若满足所有下述条件，则该请求可视为“简单请求”：

- 使用下列方法之一：
  - `GET`
  - `HEAD`
  - `POST`
    - `Content-Type` : (仅当POST方法的Content-Type值等于下列之一才算做简单需求)
      - `text/plain`
      - `multipart/form-data`
      - `application/x-www-form-urlencoded`

### 2. 预检请求

当请求满足下述任一条件时，即应首先发送预检请求：

- 使用了下面任一 HTTP 方法：
  - `PUT`
  - `DELETE`
  - `CONNECT`
  - `OPTIONS`
  - `TRACE`
  - `PATCH`
- 人为设置了对 CORS 安全的首部字段集合之外的其他首部字段。该集合为：
  - `Accept`
  - `Accept-Language`
  - `Content-Language`
  - `Content-Type`
  - `DPR`
  - `Downlink`
  - `Save-Data`
  - `Viewport-Width`
  - `Width`
  - `Content-Type`的值不属于下列之一:
    - `application/x-www-form-urlencoded`
    - `multipart/form-data`
    - `text/plain`

<span style="color:orange">`OPTIONS`</span>是HTTP/1.1协议中定义的方法，用以从服务器获取更多信息。该方法不会对服务器资源产生影响。遇见请求中同时携带了下面两个首部字段：

```
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PRODUCT
```

首部字段 Access-Control-Request-Method 告知服务器，实际请求将使用 POST 方法。首部字段 Access-Control-Request-Headers 告知服务器，实际请求将携带两个自定义请求首部字段：X-PINGOTHER 与 Content-Type。服务器据此决定，该实际请求是否被允许。





## 8. HTTP状态码记录：

1. **101**：`Switching Protocols`（协议切换）表示服务器应客户端升级协议的请求，正在切换协议。（如websocket）
2. **302**：`Found`。请求的目标资源临时移动到了另一个 URI 上，服务器会在响应头的 Location 字段放上这个不同的 URI，浏览器可以使用 Location 中的 URI 进行自动重定向
3. **304**：`Not Modified`。如果客户端发送了一个带条件的GET 请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个304状态码。简单表述：服务端执行了 `GET` 请求，但文件未变化。首次请求服务端返回`ETab`，在第二次请求后请求头携带这个`Etag`，会跟第二次的`Etag`对比。
4. **307**：`Internal Redirect`。307 的定义实际上和  302 是一致的，唯一的区别在于：307 状态码不允许浏览器将原本为 POST 的请求重定向到 GET 请求上。
5. **400**：连接`mysql`失败，数据源驱动不存在
6. **401**：在使用POST请求进行登录时，未成功登录并返回401，代表客户端错误，指的是由于缺乏目标资源要求的身份验证凭证，发送的请求未得到满足
7. **403**：`forbidden`。无权限访问此站，如在请求时出现了跨域(CORS)，那么预检请求`Preflight`会报错403状态码。
8. **405**： Not Allowed (nginx)请求的静态文件采用的是post方法，nginx是不允许post访问静态资源
9. **429**：太多请求，get方法。detail为`Too many requests in 1 hour. Try again later. You have being rate limited`.
10. **503**：服务不可访问，比如上传图片链接，采用POST请求等出现跨域
11. **426**: `Upgrade Required`。一种错误状态码，表示服务器拒绝处理客户端使用当前协议发送的请求，但是可以接受其使用升级后的协议发送的请求。
12. **415**: `Unsupported Media Type` 



## 9. prefetch & preload

`rel="prefetch"`和`rel="preload"`都属于Resource-Hints（资源提示）。

[**`as`**](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link#attr-as)

该属性仅在`<link>`元素设置了 `rel="preload"` 或者 `rel="prefetch"` 时才能使用。它规定了`<link>元素`加载的内容的类型，对于内容的优先级、请求匹配、正确的[内容安全策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)的选择以及正确的 [`Accept`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Accept)请求头的设置，这个属性是必需的。

```html
<head>
    <link rel="preload" as="font" href="<%= require('/assets/fonts/AvenirNextLTPro-Demi.otf') %>" crossorigin>
    <link rel="preload" as="font" href="<%= require('/assets/fonts/AvenirNextLTPro-Regular.otf') %>" crossorigin>
</head>
```

> 注意：preload link必须设置as属性来声明资源的类型（font/image/style/script等)，否则浏览器可能无法正确加载资源。

[**`crossorigin`**](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link#attr-crossorigin)

此枚举属性指定在加载相关资源时是否必须使用 CORS. [启用 CORS 的图片](https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image) 可以在 [`canvas`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas) 元素中重复使用，并避免其被*污染*. 可取的值如下：



**最佳实践**

- 大部分场景下无需特意使用preload
- 类似字体文件这种隐藏在脚本、样式中的首屏关键资源，建议使用preload
- 异步加载的模块（典型的如单页系统中的非首页）建议使用prefetch
- 大概率即将被访问到的资源可以使用prefetch提升性能和体验



## 10. HTTP SSE(eventsource)

原文章地址：[掘金](https://juejin.cn/post/7325730345840066612)

> 注意：当**不使用 HTTP/2** 时，并发请求的数量限制最大为 **6**，若采用轮询方案，则轮训接口会一直占用并发请求数量；当使用 **HTTP/2** 时，最大并发 *HTTP 流* 的数量由服务器和客户端协商（默认为 **100**）。
>
> websocket不会占用 HTTP 并发限制数量，并且单个域名下 websocket 连接数限制较宽泛（chrome为256），可解决并发占用问题。

`type: eventsource` 。一个 `EventSource` 实例会对 HTTP 服务器开启一个持久化的连接，以`text/event-stream`格式发送事件，此连接会一直保持开启直到通过调用 `EventSource.close()` 关闭。EventStore实质上是一个不断开连接的 HTTP 请求，也会占用一个并发请求连接数。

![image-20240422145810453](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202404221458722.png)

响应头：

- Content-Type: "text/event-stream"
- Cacheh-Control: "no-cache"
- Connection: "keep-alive"

![image-20240418102341015](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202404181023263.png)

**与 WebSocket 的不同**

- websocket 支持全双工，浏览器和服务器之间可以双向交互式通信；
- 而 eventsource 只支持服务器发送事件，消息只能从服务端发送到客户端。



**应用实践**

一、后端

Nodejs - Express

```ts
app.get('/sse', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream', //设定数据类型
    'Cache-Control': 'no-cache',// 长链接拒绝缓存
    'Connection': 'keep-alive' //设置长链接
  })
  setInterval(() => {
  	// 业务代码
    const data = {
      message: `Current time is ${new Date().toLocaleTimeString()}`
    }
    res.write(`data: ${JSON.stringify(data)}\n\n`)
	}, 2000)
})
```

Java - Spring

```java
@ResponseBody
@RequestMapping(value = '/sse', produces="text/event-stream;charset=UTF-8")
public void loopWrite(HttpServletResponse response) throws Exception {
  response.setContennType("text/event-stream")
  response.setCharacterEncoding("UTF-8")
  response.setStatus(200)
  while(!response.getWriter().checkError()) {
    // ...
  }
  response.getWriter().close()
}
```





二、前端

```ts
// [source.readyState]
// · 0, connecting
// · 1, open
// · 2, closed

// 封装
class EventSorceWrapper {
  private url: string
  private eventSource: EventSource | null

  constructor(url: string) {
    this.url = url
    this.eventSource = null

    if (!('EventSource' in window)) {
      console.log('EventSource is not supported in this browser.')
      return
    }
    this.eventSource = new EventSource(url)
  }

  public onOpen(callback: (this:EventSource, event: Event) => any) {
    this.eventSource!.onopen = callback
  }

  public onMessage(callback: (this: EventSource, event: MessageEvent) => any) {
    this.eventSource!.onmessage = callback
  }

  public onError(callback: (this: EventSource, event: Event) => any) {
    this.eventSource!.onerror = callback
  }

  public onClose(callback?: () => any) {
    this.eventSource?.close()
    callback && callback()
  }
}

export default EventSorceWrapper
```

```ts
// 应用
import EventSorceWrapper from "../utils/SSE";

const closeBtn = document.querySelector("#close")
const opneBtn = document.querySelector('#open')

opneBtn?.addEventListener('click', KeepAlive)
closeBtn?.addEventListener('click', closeAlive)

let source: EventSorceWrapper | null = null

function KeepAlive() {
  source = new EventSorceWrapper('http://localhost:8081/sse')

  source.onOpen(function(event) {
    console.log('the eventSource readyState: ',this.readyState)
  })

  source.onMessage(function(event) {
    console.log(JSON.parse(event.data))
  })
  
  source.onError(function(event) {
    console.log('the eventSource readyState is error: ',this.readyState)
    console.log('开启长连接失败')
  })
}


function closeAlive() {
  source?.onClose(() => {
    console.log("关闭长连接")
  })
}
```



## 11. new::ERR_CRET_COMMON_NAME_INVALID

在调用 `https` 请求时，使用IP + 端口而非域名时会请求失败，并报以上错误。
