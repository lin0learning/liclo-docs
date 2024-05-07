### TypeScript 装饰器
:::info
阮一峰：[TypeScript 装饰器](https://typescript.p6p.net/typescript-tutorial/decorator.html)
:::




装饰器（Decorator）是一种语法结构，用来在定义时修改类（class）的行为。在语法上，装饰器有如下几个特征。

1. 第一个字符（或者说前缀）是`@`，后面是一个表达式。
2. @`后面的表达式，必须是一个函数（或者执行后可以得到一个函数）。
3. 这个函数接受所修饰对象的一些相关值作为参数。
4. 这个函数要么不返回值，要么返回一个新对象取代所修饰的目标对象。

举例来说，有一个函数`Injectable()`当作装饰器使用，那么需要写成`@Injectable`，然后放在某个类的前面：


```ts
@Injectable
class A {
  // ...
}
```

上面示例中，由于有了装饰器`@Injectable`，类`A`的行为在运行时就会发生改变。



在使用装饰器时，为避免 IDE 无法识别装饰器而报错：<font color="red">作为表达式调用时,无法解析类修饰器的签名。</font>需要将 `jsconfig.json` 或 `tsconfig.json` 中的 `experimentalDecorators` 属性设置为 `true`：

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "experimentalDecorators": true
  }
}
```



实现 `withDisplayName` 装饰器

```ts
import React from 'react'

function withDisplayName(displayName?: string) {
  return function <T extends { new(...args: any[]): React.Component }>(constructor: T) {
    return class extends constructor {
      static displayName = displayName ? displayName : constructor.name
    }
  }
}

export {withDisplayName}
```

使用：

```tsx
import React from 'react'
import { withDisplayName } from '../../decorator/index.tsx'

@withDisplayName('DecoratorComponent')
class DecoratorComponent extends React.Component {
  render(): React.ReactNode {
    return (
      <div>class Component</div>
    )
  }
}
```

