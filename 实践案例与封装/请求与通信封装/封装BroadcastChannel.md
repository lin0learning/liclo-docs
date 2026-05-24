# 使用发布订阅模式封装BroadCastChannel

**使用发布订阅模式对 `BroadcastChannel` 进行封装的示例类：**

```ts
type MsgCallback = (message: any) => void

class BroadcastChannelWrapper {
  private channelName: string
  private channel: BroadcastChannel | null
  private subscribers: MsgCallback[]

  constructor(channelName: string) {
    this.channelName = channelName
    this.channel = null
    this.subscribers = []

    if (!('BroadcastChannel' in window)) {
      console.error('BroadcastChannel is not supported in this browser.')
      return
    }

    this.channel = new BroadcastChannel(channelName)
    this.channel.onmessage = this.handleMessage.bind(this)
  }

  public subscribe(callback: MsgCallback) {
    this.subscribers.push(callback)
  }

  public unsubscribe(callback: MsgCallback) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== callback)
  }

  public publish(message: any) {
    if (this.channel) this.channel.postMessage(message)
  }

  private handleMessage(event: MessageEvent) {
    const message = event.data
    this.subscribers.forEach(subscriber => subscriber(message))
  }

  public close() {
    if (this.channel) {
      this.channel.close()
      this.channel = null
    }
  }
}

const myChannel = new BroadcastChannelWrapper('myChannel')

export {myChannel}

export default BroadcastChannelWrapper
```

这个类可以通过创建一个 `BroadcastChannelWrapper` 实例来在多个标签页之间进行通信。可以在需要通信的标签页上创建一个实例，并使用 `subscribe()` 方法来监听消息，使用 `publish()` 方法来发送消息。

**示例用法：**

```js
import {myChannel} from '@utils/index'

// 订阅消息
myChannel.subscribe(message => {
  console.log('Received message:', message);
});

// 发布消息
myChannel.publish('Hello, world!');

// 取消订阅
// myChannel.unsubscribe(callback);

// 关闭通道
// myChannel.close();
```

