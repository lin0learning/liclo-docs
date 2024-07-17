# 封装 websocket 请求

## 1. 封装代码

```ts
interface Options {
  param?: any
}

/**
 * @description websocket请求封装，初次连接失败后，会发起5次重连。连接成功后，每隔30秒发送心跳包
 * @param {string} url 请求地址
 * @param {Object} option 请求的一些参与，可配置请求响应的解析体、发送的数据、重连5次后需要重置状态的mutation名称
 * @param {Function} callback 响应回调
 * @param {Function} errback 回调函数
 */

class Socket {
  private socket: WebSocket | null = null // Websocket实例
  private timeout: number = 3000 // 连接超时时间
  private timeoutFlag: boolean = true  // 超时开关
  private reconnectLock: boolean = false // 避免重复连接
  private reconnectNum: number = 0 // 当前重连次数
  private timeoutId: number | undefined  // 连接超时id
  private heartId: number | undefined  // 心跳延时id
  private serverTimeoutId: number | undefined  // 心跳服务延时id
  private heartTime: number = 30000  // 心跳频率
  private reconnectInterval: number = 5000  // 重连间隔
  private maxReconnectAttempts: number = 5  // 最大重连次数
  private reconnectId: undefined | number

  constructor(
    private url: string,
    public option: Options,
    public callback: (data: any) => void,
    public errback?: (err: any) => void
  ) {
    this.url = url
    this.option = option
    this.callback = callback
    this.errback = errback
    this.initWebsocket()
  }

  private initWebsocket() {
    this.clearTimeouts()

    // socket连接失败，发起5次重连（间隔3秒）
    this.timeoutId = setTimeout(() => {
      if (this.timeoutFlag && this.reconnectNum <= this.maxReconnectAttempts) {
        this.socket?.close()
        this.reconnect()
        this.timeoutFlag = false
      }
    }, this.timeout)

    // 创建 websocket 实例
    this.socket = new WebSocket(this.url)

    // websocket 连接
    this.socket.onopen = () => {
      this.reconnectNum = 0
      this.timeoutFlag = false
      // 发送心跳
      this.heartCheck()
      if (this.option.param) {
        this.socket?.send(this.option.param)
      }
    }

    // websocket 接收message
    this.socket.onmessage = (res) => {
      this.heartCheck()
      if (res.data === 'pong') return
      this.callback(res.data)
    }

    // websocket 断开连接
    this.socket.onclose = () => {
      this.errback?.('websocket close')
    }

    // websocket error
    this.socket.onerror = (error) => {
      this.errback?.(error)
      this.reconnect()
    }
  }

  private clearTimeouts() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
    if (this.heartId) clearTimeout(this.heartId)
    if (this.serverTimeoutId) clearTimeout(this.serverTimeoutId)
  }

  private heartCheck(){
    this.clearTimeouts()

    this.heartId = setTimeout(() => {
      this.socket?.send('ping')
      this.serverTimeoutId = setTimeout(() => {
        this.socket?.close()
        this.reconnect()
      }, this.heartTime)
    }, this.heartTime)
  }

  public sendData(params: any) {
    this.socket?.send(params)
  }

  private reconnect() {
    this.clearTimeouts()

    if (this.reconnectLock) return
    this.reconnectLock = true
    if (this.reconnectNum < this.maxReconnectAttempts) {
      this.reconnectId = setTimeout(() => {
        this.timeoutFlag = true;
        this.initWebsocket();
        this.reconnectNum++;
        this.reconnectLock = false;
      }, this.reconnectInterval);
    }
  }

  public close() {
    this.clearTimeouts()
    if (this.reconnectId) clearTimeout(this.reconnectId)
    this.reconnectLock = true
    this.socket?.close()
  }
}

function createSocket(url: string, option: Options, callback: (data: any) => void, errback?: (err: any) => void) {
  return new Socket(url, option, callback, errback)
}

export {createSocket}
```

## 2. Example
```ts
import {createSocket} from '@utils'

let socketInstance = null

function getSomeValue() {
  socketInstance?.close();
  let params = {/* */}
  socketInstance = createSocket(
    `ws://${yourUrl}`,
    {
      param: JSON.stringify(params)
    },
    res => {/* */},
    error => {/* */}
  )
}
```