# TypeScript 实现发布订阅模式

::: tip 发布-订阅模式
- 发布-订阅模式是一种行为设计模式，它允许多个对象通过事件的发布和订阅来进行通信；
- 在这种模式中，发布者(又称为主题)负责发布事件，而订阅者(也称为观察者)则通过订阅主题来接收这些事件；
- 这种模式使得应用程序的不同部分能够松散耦合，并且可以动态地添加或删除订阅者；
:::

实现 `Emitter`
- on
- off
- emit
- once

## 类型
```ts
interface Instance {
  on: (event: string, callback: Function) => void
  off: (event: string, callback: Function) => void
  once: (event: string, callback: Function) => void
  emit: (event: string, ...args: any[]) => void
  events: Map<string, Function[]>  /* Map<事件名称, [Fn]订阅者集合> */
}
```

## 使用 Class 类实现
```ts
class Emitter implements Instance {
  events:  Map<string, Function[]>
  constructor() {
    this.events = new Map()
  }

  on(event: string, callback: Function) {
    if (this.events.has(event)) {
      const callbackList = this.events.get(event)
      callbackList && callbackList.push(callbackList)
    } else {
      this.events.set(event, [callback])
    }
  }

  off (event: string, callback: Function) {
    const callbackList = this.events.get(event)
    if (callbackList.length > 0) {
      callbackList.splice(callbackList.indexOf(callback), 1)
    }
  }

  once(event: string, callback: Function) {
    const cb = (...args: any[]) => {
      callback(...args)
      this.off(event, cb)
    }
    this.on(event, cb)
  }

  emit(event: string, ...args: any[]) {
    const callbackList = this.events.get(event)
    if (callbackList.length > 0) {
      callbackList.forEach(fn => {
        fn(...args)
      })
    }
  }
}

export default Emitter

export const emit = new Emitter()
```

## Example
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