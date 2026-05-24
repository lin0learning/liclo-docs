# 设计模式 (Design Pattern)

> 文档内容学习自[Patterns.dev](https://www.patterns.dev/)
>
> Patterns.dev is a free online resource on design, rendering, and performance patterns for building powerful web apps with vanilla JavaScript or modern frameworks.

## 1. 命令模式

:::tip 命令模式(Command Pattern)

使用命令模式，我们可以将执行特定任务的对象与调用该方法的对象解耦

:::

以点餐平台为例，用户可以点餐、追踪和取消订单。

```typescript
class OrderManager() {
  constructor() {
    this.orders = []
  }

  placeOrder(order, id) {
    this.orders.push(id)
    return `You have successfully ordered ${order} (${id})`;
  }

  trackOrder(id) {
    return `Your order ${id} will arrive in 20 minutes.`
  }

  cancelOrder(id) {
    this.orders = this.orders.filter(order => order.id !== id)
    return `You have canceled your order ${id}`
  }
}
```

使用命令模式将方法与对象进行解耦：

```typescript
type Order= {
  id: string
  item: string
}

interface ICommand {
  execute: (orders: Order[], ...args: any[]) => void
}

class OrderManager {
  private orders: Order[]

  constructor() {
    this.orders = []
  }

  execute(command: ICommand, ...args: any[]) {
    return command.execute(this.orders, ...args)
  }
}

class Command implements ICommand {
  execute: ICommand['execute']

  constructor(execute: ICommand['execute']) {
    this.execute = execute
  }
}

function PlaceOrderCommand(order:string, id:string) {
  return new Command(orders => {
    orders.push({item: order, id})
    console.log(`You have successfully ordered ${order} (${id})`)
  })
}

function CancelOrderCommand(id:string) {
  return new Command(orders => {
    const index = orders.findIndex(order => order.id === id)
    if (index !== -1) {
      orders.splice(index, 1)
      console.log(`You have canceled your order ${id}`)
    } else {
      console.log(`Order ${id} not found`)
    }
  })
}

function TrackOrderCommand(id:string) {
  return new Command(() => {
    console.log(`Your order ${id} will arrive in 20 minutes.`)
  })
}
```

应用案例

```typescript
const manager = new OrderManager()

manager.execute(PlaceOrderCommand('Pizza', '24'))
manager.execute(TrackOrderCommand('24'))
manager.execute(CancelOrderCommand('24'))
manager.execute(TrackOrderCommand('24'))
```





## 2. 发布订阅模式

::: tip 发布-订阅模式(Publish-Subscribe Pattern)

- 发布-订阅模式是一种行为设计模式，它允许多个对象通过事件的发布和订阅来进行通信；

- 在这种模式中，发布者(又称为主题)负责发布事件，而订阅者(也称为观察者)则通过订阅主题来接收这些事件；

- 这种模式使得应用程序的不同部分能够松散耦合，并且可以动态地添加或删除订阅者；

:::

使用 `class`类实现

```typescript
type Callback = (...args: any[]) => void

interface instance {
  on: (eventName:string, callback: Callback) => void
  off: (eventName:string, callback: Callback) => void
  once: (eventName:string, callback: Callback) => void
  emit: (eventName:string, ...args: any[]) => void
  events: Map<string, Callback[]>
}

class Emitter implements instance {
  events: Map<string, Callback[]>
  constructor() {
    this.events = new Map()
  }

  on(eventName:string, callback: Callback) {
    if (this.events.has(eventName)) {
      const callbackList = this.events.get(eventName)
      callbackList && callbackList.push(callback)
    } else {
      this.events.set(eventName, [callback])
    }
  }

  off(eventName:string, callback: Callback) {
    const callbackList = this.events.get(eventName)
    if (callbackList.length > 0) {
      callbackList.splice(callbackList.indexOf(callback), 1)
    }
  }

  once(eventName:string, callback: Callback) {
    const cb = (...args: any[]) => {
      callback(...args)
      this.off(eventName, callback)
    }
    this.on(eventName, cb)
  }

  emit(eventName:string, ...args: any[]) {
    const callbackList = this.events.get(eventName)
    if (callbackList.length > 0) {
      callbackList.forEach(fn => fn(...args))
    }
  }
}
```

应用案例

:::code-group
```ts [A.ts]
// publish
emit.emit('message', false, 1)
```
```ts [B.ts]
const cb1 = () => {
  console.log('message one')
}

// subscribe
emit.on('message', cb1)

// unsubscribe
emit.off('message', cb1)

// once
emit.once('message', cb1)
```

```ts [C.ts]
emit.on('message', (...args) => (console.log(args)))
```

:::

