# Socket.IO

Socket.IO 是一个库，可以在客户端和服务器之间实现 **低延迟**, **双向** 和 **基于事件的** 通信。

## 安装

在浏览器客户端，可以使用`socket.io-client`。

```bash
npm install socket.io-client
```

::: tip Note

从 v3 开始，Socket.IO 已经支持 TypeScript，`@types/socket.io-client` 库已被标记为 ~~deprecated~~。

:::

##  封装Socket.IO

将 `io` 封装成类，以便通过实例来管理自己的状态：

```ts [socketIO.ts]
import {io, type Socket} from 'socket.io-client'

type Fn = (...args: any[]) => void

interface Options{
  param: Object
  emit: string
}

class SocketIO {
  private url: string
  private option: Options
  private callback: Fn
  private errback: Fn
  private socket: Socket | null
  private errCount: number
  private isConnected: boolean
  private maxError: number

  constructor(url: string, option: Options, callback?: Fn, errback?: Fn) {
    this.url = url
    this.option = option
    this.callback = callback
    this.errback = errback
    this.socket = null
    this.errCount = 0
    this.isConnected = false
    this.maxError = 5
    this.initSocket()
  }

  initSocket() {
    // 创建io实例
    this.socket = io(this.url, {
      reconnection: true,
      reconnectionDelay: 2000,
      timeout: 30000
    })

    // connect
    this.socket.on('connect', () => {
      this.isConnected = true
      this.errCount = 0
      setTimeout(() => {
        console.log(this.option)
        let param = ''
        let str = JSON.stringify(this.option.param)
        if (this.option.emit === 'query') {
          param = eval(`(${str})`)  // `eval()` 函数会将传入的字符串当做 JavaScript 代码进行执行
        }
        this.socket.emit(this.option.emit, param)  // 发送消息
      }, 200);
    })

    // disconnect
    this.socket.on('disconnect', () => {
      this.isConnected = false
    })

    // connect_error
    this.socket.on('connect_error', (error) => {
      this.errback(error)
      this.errCount++
      if (this.errCount >= this.maxError) { // 连接失败次数大于或等于给定最大连接数 则断开连接
        this.socket.disconnect()
      }
    })

    // connect_timeout
    this.socket.on('connect_timeout', () => {
      this.errback('connect_timeout')
      this.errCount++
      this.socket.disconnect()
      if (this.errCount >= this.maxError) { // 连接超时次数大于或等于给定最大连接数 则断开连接
        this.socket.disconnect()
      }
    })

    // error
    this.socket.on('error', (error) => {
      this.errback(data)
      //if (this.errback && Object.prototype.toString.call(this.errback) === '[object Function]') {
      //  this.errback(error)
      //}
      this.errCount++
      if (this.errCount >= this.maxError) { // 连接失败次数大于或等于给定最大连接数 则断开连接
        this.socket.disconnect()
      }
    })

    // message
    this.socket.on('message', (res) => {
      this.callback(res)
      //if (this.callback && Object.prototype.toString.call(this.callback) === '[object Function]') {
      //  this.callback(res)
      //}
    })
    
    // 监听重连事件 （可选）
    this.socket.on('reconnect_attempt', () => {
      // ...
    })
    this.socket.on('reconnect', () => {
      // ...
    })
  }

  close() {
    this.socket?.close()
  }

  disconnect() {
    this.socket?.disconnect()
  }

  emit(emit:string, param: Object) {
    this.socket?.emit(emit, param)
  }
}

const initSocketIO = (url: string, option: Options, callback?: Fn, errback?: Fn) => {
  return new SocketIO(url, option, callback, errback)
}

export {initSocketIO}
export default SocketIO
```



## 使用

```ts
import {ref} from 'vue'
import SocketIO from '@utils/socketIO'

let params = {
  emit: 'query',
  param: {
    msgType: 'S1',
    devIds: [121001, 121003, 121005, 121007]
  }
}

const socket = ref<SocketIO | null>(null)

function onConnect() {
  socket.value = new SocketIO('your url', params,
    res => {
      console.log(res)
    },
    err => {
      throw err
    }
  )
}

function disconnect() {
  socket.value && socket.value.close()
}
```



在浏览器的网络监视器中可以看到：

![image-20240801140653095](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202408011407415.png)

大致分为以下几个步骤：

1. handshake (contains the session ID — here, `zBjrh...AAAK` — that is used in subsequent requests)
2. send data (HTTP long-polling)
3. receive data (HTTP long-polling)
4. upgrade (WebSocket)
5. receive data (HTTP long-polling, closed once the WebSocket connection in 4. is successfully established)





## 事件

Socket 实例发出三个特殊事件：

- `connect`
- `connect_error`
- `disconnect`

从 Socket.IO v3 开始，Socket 实例不再发出任何与重新连接逻辑相关的事件。



## 断开连接

Engine.IO 连接在以下情况下被视为关闭：

- 一个 HTTP 请求（GET或POST）失败
- websocket 连接关闭
- `socket.disconnect()` 在服务端或客户端被调用

此外，还有一个心跳机制检查服务器和客户端之间的连接是否正常运行：

在给定的时间间隔（ `pingInterval`握手中发送的值），服务器发送一个 PING 数据包，客户端有几秒钟（该`pingTimeout`值）发送一个 PONG 数据包。如果服务器没有收到返回的 PONG 数据包，则认为连接已关闭。反之，如果客户端在 `pingInterval + pingTimeout` 内没有收到 PING 包，则认为连接已关闭。



