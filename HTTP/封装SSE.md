# HTTP SSE(EventSource)

> 注意：当**不使用 HTTP/2** 时，并发请求的数量限制最大为 **6** (chrome)，若采用轮询方案，则轮询接口会一直占用并发请求数量；当使用 **HTTP/2** 时，最大并发 *HTTP 流* 的数量由服务器和客户端协商（默认为 **100**）。
>
> websocket不会占用 HTTP 并发限制数量，并且单个域名下 websocket 连接数限制较宽泛（chrome为256），可解决并发占用问题。
>
> 原文章地址：[掘金](https://juejin.cn/post/7325730345840066612)

## EventSource实例

`type: eventsource` 。一个 `EventSource` 实例会对 HTTP 服务器开启一个持久化的连接，以`text/event-stream`格式发送事件，此连接会一直保持开启直到通过调用 `EventSource.close()` 关闭。EventStore实质上是一个<font color="red">不断开连接的 HTTP 请求</font>，也会占用一个并发请求连接数。

![image-20240422145810453](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202404221458722.png)

响应头：

- Content-Type: "text/event-stream"  文本返回格式
- Cacheh-Control: "no-cache"  拒绝缓存
- Connection: "keep-alive"  长连接标识

![image-20240418102341015](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202404181023263.png)

**与 WebSocket 的不同**

- websocket 支持全双工，浏览器和服务器之间可以双向交互式通信；
- 而 eventsource 只支持服务器发送事件，消息只能从服务端发送到客户端。



**实例的状态**

在 eventsource 实例中，有属性 `readyState`，可能的值包含：

- 0，connecting
- 1，open
- 2，closed

## 封装EventSource类

```ts [SSE.ts]
class EventSourceWrapper {
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

export default EventSourceWrapper
```

## 实践

### 1. 后端示例

**Node.js** + **Express**

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

**Java - Spring**

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



### 2. 前端应用

```ts
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

export {closeAlive}
```

