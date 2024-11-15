# TypeScript

## 数据类型

### 1. any 和 unknow

在ts中，`any`类型和`unknow`顶级类型的区别：
```ts
// unknow类型变量 在赋值时只能赋值给自身，或者是any类型
let a:unknow = 1
let b:number = 5

a = b
b = a  // error
```



### 2. Tuple

元组（tuple）是 TypeScript 特有的数据类型，元组的成员类型是写在方括号里面（`[number]`）。

```typescript
let x: [string, number]
x = ['hello', 10] // true

type NestedTuple = [string, number[], [boolean, {name:string}]]
```

元组类型转换为对象：`Tuple[number]`

```typescript
const Tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
Tuple[number] // { tesla: 'tesla'; 'model 3': 'model 3'; 'model X': 'model X'; 'model Y': 'model Y' }
```

元组本身类似于 js 中的数组，有较多自身属性（比如`length`），可通过 ts 中的索引访问来获取其属性值：

```typescript
type Length<T extends readonly any[]> = T['length']
```

元组可以通过方括号，读取成员类型

```typescript
type Tuple = [string, number];
type Age = Tuple[1]; // number
```

上面示例中，`Tuple[1]`返回 1 号位置的成员类型。

由于元组的成员都是数值索引，即索引类型都是`number`，所以可以像下面这样读取:

```typescript
type Tuple = [string, number, Date];
type TupleEl = Tuple[number]; // string | number | Date
```

上面示例中，`Tuple[number]`表示元组`Tuple`的所有数值索引的成员类型，所以返回`string|number|Date`，即这个类型是三种值的联合类型**（元组转联合）**。

```typescript
type tuple = [string, number, boolean]
type Union = tuple[number] // string | number | boolean

type Tuple = [string, number]
type Case2 = Tuple[number] // string | number
```

Typescript 内置 `PropertyKey`类型`'string' | 'number' | 'symbol'`。将对象类型转换为元组类型时需要进行对象key类型的限制：

```typescript
type AnyTuple<T extends readonly PropertyKey[]> = {}
```





### 3. enum

枚举类型

```typescript
enum Param {
  Device,
  Detail = 5,
  Info
}

enum Color {
  red = 'red',
  green = 'green',
  blue = 'blue'
}

const enum Types { success, fail }

console.log(Param.Device)  // 0
console.log(Param.Detail)  // 5
console.log(Param.Info)    // 6
```







### 4. interface

interface 定义对象类型属性

```ts
interface propsType = {
  name: string
  [propName: string]: any
}
const userInfo: propsType = {
  name: 'ts'
}
```

**interface 与 type 不同点：**

1. type除了能描述对象还可以用来自定义其他类型
2. 同名的interface会合并（属性取并集，不能出现类型冲突），同名type会报错

**数据类型**：

- JavaScript

  - number 

  - string 

  - undifined 

  - null 

  - bigint  

  - boolean 

  - object 

  - array 

- Typescript
  - any 
  - never 
  - tuple 
  - enum 
  - void 
  - never



### 5. 数组类型

定义对象数组使用 interface 

**定义二维数组**

```typescript
let arr:number[][] = [[1],[2],[3]]
let arr:Array<Array<number>> = [[1],[2],[3]]  // 泛型
```



**定义类数组对象**

arguments内置参数的类型可以使用TS内置的`IArguments`声明





### 6. class

1. class 的基本用法 继承 和 类型约束 implements
2. class 的修饰符 readonly private protected public
3. super 原理
4. 静态方法
5. get set



**可访问性修饰符 private、protected 与 public 的区别：**

- private 只能在类内部使用
- protected 子类和内部中使用，但实例无法使用
- public 无限制



**Class 类型**

在 typescript 中， 类本身就是一种类型，但它代表该类的<font color="red">实例类型</font>，而不是 class 的自身类型。

```typescript
class Color {
  private name: string
  
  constructor(name: string) {
    this.name = name
  }
}

const green: Color = new Color("green")
```



**类的自身类型**

要获取一个类的自身类型，可以使用 `typeof` 运算符。

```typescript
class Point {}

function createPoint(PointClass: typeof Point, x: number, y: number): Point {
  return new PointClass(x, y)
}
```

还可以提取构造函数，定义单独的 interface：

```typescript
interface PointConstructor {
  new (x: number, y: number): Point
}

function createPoint(PointClass: PointConstructor, x: number, y: number): Point {
  return new PointClass(x, y)
}
```



**`super` 关键字**

```typescript
class A extends Dom implements VueCls {
  constructor() {
    super()  // 父类的 prototype.constructor.call
  }
}
```



**抽象类**

abstract  所定义的方法，都只能描述而不能进行实现

```typescript
abstract class Vue {}
```







## TS 类型运算符

- keyof
- in
- []
- extends ... ? : 
- infer
- is
- 模板字符串
- typeof



### 1. keyof

keyof 是一个单目运算符，接受一个对象类型作为参数，返回该对象的所有键名组成的联合类型。

```typescript
type Obj = {
  foo: number
  bar: string
}
type Keys = keyof Obj // 'foo' | 'bar'
```

由于 JavaScript 对象的键名只有三种类型，所以对于任意对象的键名的联合类型就是`string|number|symbol`。

```typescript
// string | number | symbol
type KeyT = keyof any
```

对于没有自定义键名的类型使用 keyof 运算符，返回 `never` 类型。

```typescript
type keyT = keyof object // never
```

对于联合类型，keyof 返回成员共有的键名。

```typescript
type A = {a: string, z: boolean}
type B = {b:string, z: boolean}

type keyT = keyof (A | B) // 'z'
```

对于交叉类型，keyof 返回所有键名。

```typescript
type A = { a: string; x: boolean };
type B = { b: string; y: number };

type KeyT = keyof (A & B); // 'a' | 'x' | 'b' | 'y'
```

keyof 取出的是以键名组成的联合类型，如果想取出键值组成的联合类型，可以这样：

```typescript
type MyObj = {
  foo: number
  bar: string
}

type Keys = keyof MyObj
type Values = MyObj[Keys] // number|string
```

用途：

对于取出对象的某个指定属性的值，TS可精确表达返回值类型：

```typescript
function prop<T，K extends keyof T>(obj: T, key: K):T[K] {
  return obj[key]
}
```



### 2. in

在 JavaScript 中，`in` 运算符用于确定对象是否包含某个属性名：

```js
const obj = { a: 123 }
if ('a' in obj) console.log('found a')
```

在 Typescript 中，`in` 运算符用于取出（遍历）**联合类型**的每一个成员类型：

![img](https://cdn.nlark.com/yuque/0/2024/png/274425/1710000442468-2bac5715-31b6-4deb-97ab-cf21658c014c.png)

```typescript
type AnimalKind = 'dog' | 'cat' | 'bird'

type AnimalCounts = {
  [key in AnimalKind]: number
}

type U = "a" | "b" | "c"

type Foo = {
  [P in U]: number
}
// 等同于
type Foo = Record<U, number>
```

`[Prop in U]`表示依次取出联合类型`U`的每一个成员；`[Prop in keyof Obj]`表示取出对象`Obj`的每一个键名。





### 3. []

方括号运算符（`[]`）用于取出对象的键值类型，比如`T[K]`会返回对象`T`的属性`K`的类型。

```typescript
type Person = {
  age: number
  name: string
  alive: boolean
}

type Age = Person["age"]  // number
type T = Person['age' | 'name'] // number|string
```



### 4. extends...?:

TypeScript 提供类似 JavaScript 的`?:`运算符这样的三元运算符，但多出了一个`extends`关键字。条件运算符`extends...?:`可以根据当前类型是否符合某种条件，返回不同的类型：

```typescript
T extends U ? X : Y
```

上面式子中的`extends`用来判断，类型`T`是否可以赋值给类型`U`，即`T`是否为`U`的子类型，这里的`T`和`U`可以是任意类型。





### 5. infer

`infer` 关键字用于定义**从泛型中推断而来的类型参数**，而不是外部传入的类型参数。它通常跟条件运算符一起使用，用在 `extends` 关键字后的父类型中：

```typescript
type Flatten<T> = T extends Array<infer R> ? R : T

type numberPromise = Promise<number>
type n = numberPromise extends Promise<infer P> ? P : never // number
```

- infer 只能在 extends 的右边使用，为确保这个已知类型是由右侧的泛型推导而来；
- infer P 的泛型 P 只能在条件类型为 true 的一边使用。



**获取参数类型 Parameters**

```typescript
type Parameters<T extends (...args: any[]) => any> =
	T extends (...args: infer R) => any ? R : never
```

**获取返回值类型 ReturnType**

```typescript
type ReturnType<T extends (...args: any[]) => any> =
	T extends (...args: any[]) => infer R ? R : never
```

**获取`Promise<any>`的类型**

```typescript
type Awaited<T> = T extends Promise<infer R> ? R : T
type Atype = Awaited<Promise<number>> // number
```

返回函数的Promise版本 **ReturnPromise**

```typescript
type ReturnPromise<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : T
```

获取对象指定属性的类型

```typescript
type MyType<T> = T extends {
  a: infer M
  b: infer N
}
  ? [M, N]
  : never

type T = MyType<{a:string; b:number}>  // [string, number]
```





**通过 infer 遍历 元组**

```typescript
type TraverseTuple<T extends any[]> = T extends [infer F, ...infer R]
  ? [F, ...TraverseTuple<R>]
  : [];
```

**通过 infer 遍历字符串类型**

```ts
T extends `${F}${R}`

// 距离
type Str = "foo-bar"

type Bar = Str extends `foo-${infer R}` ? R : never // 'bar'
```



### 6. typeof

<div style="background: #faf0d5; padding: 10px;">注意：尽管typeof类型运算符在外观上类似于JS中的运行时typeof运算符，但是俩者是不同的，在TS中typeof 变量的运算结果依旧是类型，而在JS中 typeof 变量 运算结果是一个值</div>

typeof 类型检查

- bigint
- boolean
- function
- numer
- object
- string
- symbol
- undefined

### 7. is

函数返回布尔值时，可以使用`is`运算符，限定返回值与参数之间的关系。

`is`运算符用来描述返回值属于`true`还是`false`

```typescript
type A = {a: string}
type B = {b: string}

function isTypeA(x: A | B): x is A {
  if ("a" in x) return true
  return false
}
```

上面示例中，返回值类型 `x is A`可以准确描述函数体内部的运算逻辑。



## 定义`this`类型

为了说明在 typescript 中 this 的声明方法，我们首先需要更改 tsconfig.json 的配置：

```json
"compilerOptions": {
   "noImplicitThis": true
}
```

默认情况下，如果ts没有this对象类型声明，this是自动隐式定义。如果noImplicitThis设置为true，此时不允许this上下文隐式定义。

- this必须声明在函数参数声明中的<font color="red">第一个</font>
- this在函数参数中的声明，不作为形参和实参

```ts
interface Obj {
  user: number[]
  add: (this:Obj,num:number)=>void
}
let obj:Obj = {
  user: [1,2,3],
  add(this: Obj, num) {
    this.user
  }
}
```

```typescript
Page({
  onSliderChanging: throttle(function(this: any, event: WechatMiniprogram.SliderChanging) {
    const {value: currentTime} = event.detail
    this.data.isSlider = true
    this.setData({ currentTime })
  }, 300)
})
```





## 函数重载

为函数的多种调用方式提供对应类型

```ts
function findNum(add:number[]):number[]
function findNum(id:number):number[]
function findNum():number[]
function findNum(ids?: number | number[]):number[]{}
```











## 类型断言

一、as 断言

```typescript
const rawData = `["grace", "frankie"]`

cnst jsonData = JSON.parse(rawData) as string[]

// as const -> readonly
// readonly ['tesla', 'model 3', 'model X', 'modelY']
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
```







二、! 非空断言

>把可能为 **null 或者 undefined 的值称为空值**，如果明确知道当前值不是空值，可以使用`!`进行标注

```typescript
let Dss = Math.random() > 0.5 ? undefined : new Date()

Dss!.getDate()
```



三、 as const 特殊断言

> as const 是一个类型断言，用于将表达式的类型推断为其`字面量类型的只读形式`,

```typescript
const colors = ['default', 'primary', 'success']

// const colors: string[]

const colors = ['default', 'primary', 'success'] as const

// const colors: readonly ['default', 'primary', 'success']
```

实际应用

```typescript
const config = {
  API_URL: 'https://api.example.com',
  MAX_RESULTS: 50
} as const;

// { readonly API_URL: "https://api.example.com"; readonly MAX_RESULTS: 50; }
```

以上效果为：配置文件为只读，不允许被修改。

















## TypeScript 内置工具

1. `Partial<T>`
2. `Required<T>`
3. `Pick<T, K>`
4. `Record<K, T>`
5. other
   - `Readonly<T>`
   - `Exclude<T, U>`
   - `Extract<T, U>`
   - `NonNullable<T>`
   - `ReturnType<T>`
   - `Parameters<T>`

利用 `infer` 关键字，可以从正在比较的类型中推断类型，然后在 true 分支里引用该推断结果。

实现：

```typescript
type MyPartial<T> = {[P in keyof T]?: T[P] | undefined}

type MyRequired<T> = {[P in keyof T]-?: T[P]}

type MyPick<T, K extends keyof T> = { [P in K]: T[P]}

type MyRecord<K extends keyof any, T> = {[P in K]: T}

type MyReadonly<T> = {readonly [P in keyof T]: T[P]}

type MyExclude<T, U> = T extends U ? never : T

type MyExtract<T, U> = T extends U ? T : never

type MyNonNullable<T> = T & {}

type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

type MyParameters<T extends (...args: any) => any> = T extends (...args: infer R) => any ? R : any
```





**分发特性**

- 当在泛型中使用条件类型时，如果传入一个联合类型，就会变成 <font color="red">分发的(distributive)</font>。以 `Exclude`工具函数举例：

```typescript
type Exclude<T, U> = T extends U ? never : T

type Options = 'a' | 'b' | 'c' | 'd'

type filter = Exclude<Options, 'd'> // 'a' | 'b' | 'c'
```

上述代码中，如果泛型 `T` 是联合类型，那么就会触发 ts 的分发特性，需要注意，`T` 在分发后还是用 `T` 表示，但此时的 `T` 仅仅表示联合类型中的那一项，而非整个联合类型

```ts
type Example<T> = T extends string ? T : boolean

type Case1 = Example<1 | '3' | {} | []> // boolean | '3' | boolean | boolean => boolean | '3'
```







## 类型声明文件-`d.ts`

`_.d.ts`和一般的`ts`文件的区别：

- `_d.ts`文件中只能包含类型声明代码;
- `_d.ts`文件不参与编译，不会生成JS代码。

举例：

```js
// index.js
const add = (a, b) => a + b

export {add}
```

```ts
// index.d.ts
declare const add: (a:number, b:number) => number

export {add}
```



```typescript
declare var 声明全局变量
declare function 声明全局方法
declare class 声明全局类
declare enum 声明全局枚举类型
declare namespace 声明（含子属性）全局对象
interface 和 type 声明全局类型
/// <reference />
```







library的类型文件如何生效：

![img](https://cdn.nlark.com/yuque/0/2023/png/274425/1686982314424-34b56c39-d420-4b3b-ae1c-4b5d37b4be1d.png)









## 工程化 TS - webpack

一、使用Vite

```bash
npm create vite@latest project-name -- --template vanilla-ts
```

- `npm create vite@latest`
- `project-name`
- `-- --template vanilla-ts`



二、webpack手动搭建

1. 创建项目文件夹
   ```bash
   mkdir webpack
   ```

2. 初始化 `package.json`
   ```bash
   npm init -y
   ```

   

3. 安装所需依赖

   - `webpack`
   - `webpack-cli`
   - `webpack-dev-server`
   - `html-webpack-plugin`
   - `ts-loader`

   ```bash
   npm install webpack webpack-cli webpack-dev-server html-webpack-plugin ts-loader -D
   ```

4. 创建所需文件

   - 项目根目录创建`webpack.config.js`和`tsconfig.ts`

   ```bash
   tsc --init
   ```

   ```bash
   // webpack.config.js
   const path = require("path");
   const HtmlWebpackPlugin = require("html-webpack-plugin");
   
   module.exports = {
     mode: "development",
     entry: "./src/index.ts",
     output: {
       path: path.resolve(__dirname, "./dist"),
       filename: "bundle.js",
     },
     resolve: {
       extensions: [".ts", ".js", ".cjs", ".json"],
     },
     module: {
       rules: [
         {
           test: /\.ts$/,
           loader: "ts-loader",
         },
         {
           test: /\.(jpe?g|png|svg|gif)$/,
           type: "asset/resource"
         }
       ],
     },
     plugins: [
       new HtmlWebpackPlugin({
         template: "./index.html",
         title: "Webpack App" // <% = htmlWebpackPlugin.options.title %>
       })
     ],
   };
   ```

5. 修改 `package.json`文件
   ```json
   {
     ...
     "scripts": {
       "serve": "webpack serve"
     },
   }
   ```

   





Record

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
}
```





## TS 遍历对象

在 JS 中遍历对象，常用`for...in`、`Object.keys`：

```js
const obj = {
  name: 'musizike',
  address: 'tollto'
}
// for...in
for (const key in obj) {
  console.log(key, obj[key].toUpperCase())
}
// Object.keys
Object.keys(obj).forEach(key => {
  console.log(key, obj[key].toUpperCase())
})
```

以上用法在 TypeScript 中使用会报错：

```typescript
for (const key in obj) {
  // ❌
  // key:string 不能分配给 { name:string; age:number }类型
  console.log(key, obj[key].toUpperCase());
}
```

解决办法：

- 使用 `keyof` 来解决`for...in`报错；
- 使用 `as`  来解决 `Object.keys` 报错

```typescript
type Person = {
  name: string
  address: string
};
const obj: Person = {
  name: 'itsuki',
  address: 'hangzhou',
};

let type: keyof Person
for (key in obj) { // 这种方式不能形成闭包，在Promise等异步任务中，key为最终循环的值
  // ✅
  obj[key]
}

Object.keys(obj).forEach((k) => {
  // ✅
  cobj[k as keyof Person]
});
```



```typescript
type Indicators = NodeListOf<HTMLSpanElement>
const indicators: Indicators = document.querySelectorAll('.indicator span')
```















## TS 类型体操





**1. 实现类型标记 Pick 和 Omit**

测试用例：

```typescript
interface User {
  id: number
  age: number
  name: string
}
type OmitUser = Omit<User, 'id'>
type PickUser = Omit<Uer, 'id' | 'age'>   // OmitUser = PickUser
```

TS源码：

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type Exclude<T, U> = T extends U ? never : T

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
```

`keyof T`本身为联合类型，`[P in keyof T]`便是将联合类型取出，遍历对象类型。



**2. 实现类型 Partial**

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P] | undefined
}
```



## setTimeout() 函数的类型

**使用 ReturnTyp 推断**

```js
const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
  // ...
}, 500)
```

**使用 number**

由于`setTimeout()`的返回值是一个数字类型的`id`，使用`number`作为返回类型将仅仅在`JavaScript`环境下是正确的。

> 在`Node.js`中，可能会遇到这样的错误："`Type 'Timer' is not assignable to type 'number'`"。这是因为在`Node.js`中`setTimeout()`返回的是一个`Timer`对象而不是一个数字类型的`id`。



## 包的类型声明

在 TypeScript 中，`declare module "xxx" {}` 和 `declare namespace xxx {}` 是用来声明模块或命名空间的两种不同语法。

**1. `declare module "xxx" {}`**：

- 该语法通常用于声明外部模块的形态，它告诉 TypeScript 编译器某个字符串（"xxx"）在模块系统中的类型和结构
- 该语法通常用于描述像 CommonJS、AMD 或 UMD 等模块系统导出的模块。
- 当你导入这个模块时，你可以使用 `import` 或 `require` 来引入它。

示例：

```typescript
import {AxiosStatic, AxiosRequestConfig} from 'axios'
import Vue from 'vue'

declare module "vue/types/vue" {
  interface Vue {
    /** 获取cookie */
    getCookie: (name: string) => string | null
    
    /** axios */
    http: AxiosStatic
    
    Common: {
      /** post */
      post: (vue: Vue, url: string, params: any, opts?: AxiosRequestConfig) => Promise<any>
    }
  }
}
```



**2. `declare namespace xxx {}`**

- 这种语法用于在全局命名空间中声明命名空间，用于组织代码结构。
- 声明一个命名空间会创建一个包含特定名称的对象，你可以在其中定义变量、函数、类等等。
- 这种声明允许你在代码中使用<font color="red">点操作符</font>来访问其成员。
- namespace 所有的变量及方法必须要导出才能访问。
- 支持特性：嵌套、抽离、导出、简化、**合并**

示例：

```typescript
declare namespace moment {
  
  namespace unitOfTime {
    type Base = ( "year" | "years" | "y" | "..." );
  }
  
  interface Moment extends Object {
    format(format?: string): string;
    
    clone(): Moment;
    
    startOf(unitOfTime: unitOfTime.StartOf): Moment;
    endOf(unitOfTime: unitOfTime.StartOf): Moment;
  }
  
  export var fn: Moment;
}

export = moment;
```

总结：

- `declare module "xxx" {}` 用于声明外部模块的形状；
-  `declare namespace xxx {}` 用于在全局命名空间中创建命名空间以组织代码。





## 函数的参数与返回值类型

```ts
import { login } from './api'

const options: Parameters<typeof login>[0] = {} // 参数类型
                          
let resp: ReturnType<typeof login> | null = null  // 返回值类型
```



## 联合类型判断某个类型属性

回调函数参数 date 的类型为 `date: Dayjs | string`，

```ts
const onEndChange = (date: Dayjs | string) => {
  //...
  date.isAfter(/*...*/) // ts-error: 类型 `string` 上没有属性 `isAfter`
}
```

解决方法1：类型断言 `as`

```ts
const onEndChange = (date: Dayjs | string) => {
  //...
  (date as Dayjs).isAfter(/*...*/)
}
```

解决方法2：类型缩小

```ts
function isDayjs(date: string | Dayjs): date is Dayjs {
  return (date as Dayjs).isBefore !== undefined
}

const onEndChange = (date: Dayjs | string) => {
  if (isDayjs(date)) {
    // ...
  }
}
```


## 条件类型的分发特性避免

当条件类型的形式是泛型时，如果泛型的类型是联合类型，那么它就具有分发特性。比如：
```ts
type ToArray<T> = T extends any ? T[] : never
```
当我们对 `ToArray` 类型工具传入一个联合类型时，条件类型的判断将会作用于联合类型的每一项：
```ts
type ToArray<T> = T extends any ? T[] : never

type StrArr = ToArray<string | number> // type StrArr = string[] | number[]
```
以上是条件类型的分发特性（分发条件类型）。
通常，我们希望这种分发特性。但在特定情况下为了避免这种特性，可以将 `extends` 两边的关键字用方括号括起来：
```ts {2,5}
type A<T> = T extends any ? T[] : never
type B<T> = [T] extends [any] ? T[] : never

type u1 = A<string | number> // type u1 = string[] | number[]
type u2 = B<string | number> // type u2 = (string | number)[]
```





## 元组生成联合类型

在 TypeScript 中，使用 `typeof` 关键字和索引类型查询操作符 `number` 可以创建一个联合类型。

```ts
const colors = ['a', 'b', 'c'] as const
type Colors = typeof colors[number]  // "a" | "b" | "c"
```

1. `as const` 断言：

   ```ts
   const colors1 = ['a', 'b', 'c']  // string[]
   const colors2 = ['a', 'b', 'c'] as const  // readonly ["a", "b", "c"]
   ```

   - `as const` 是 TypeScript 的一种断言，它将数组 `colors` 中的每个元素的类型设置为字面量类型，而不是更宽泛的 `string` 类型。也就是说，`colors` 的类型变为 `readonly ['a', 'b', 'c']` 而不是 `string[]`。

2. `typeof colors`：

   - `typeof colors` 获取常量 `colors` 的类型。在这个例子中，`typeof colors` 的类型是 `readonly ['a', 'b', 'c']`。

3. 索引类型查询操作符 `number`：
   ```ts
   type Colors = typeof colors[number]
   ```

   `typeof colors[number]` 表示获取数组 `colors` 中每个元素的类型。这实际上是获取数组类型 `readonly ['a', 'b', 'c']` 的每个元素类型的联合类型。因此，`typeof colors[number]` 生成的类型是 `'a' | 'b' | 'c'`。

4. 封装泛型工具
   ```ts
   type Array2Union<T extends readonly any[]> = T[number]
   ```






## 从字段到函数的推导

以下 `watch` 函数，使用方式为：

```js
const personWatcher = watch({
  name: 'Edward',
  age: 26,
  sex: '男'
})

personWatcher.on('ageChanged', (val, oldVal) => {})
```

不关注与函数的具体实现，使用 TS 完善其类型：

```typescript
type Watcher<T> = {
  on<K extends keyof T & string>(
    eventName: `${K}Changed`,
    handler: (newVal: T[K], oldVal: T[K]) => void
  ): void
}

declare function watch<T>(obj: T): Watcher<T>
```



## declare 关键字

> declare 关键字用来告诉编译器，某个类型是存在的，可以在当前文件（项目）中使用。
>
> 举例，当引入外部库定义的函数而缺少类型说明时，可以使用 `declare` 关键字，手动编写外部函数的类型，这样就不会因为类型缺失而导致TS报错。

declare 关键字可以描述一下类型：

- 变量（const、let、var）
- type 或者 interface 命令声明的类型
- class
- enum
- 函数（function）
- 模块（module）
- 命名空间（namespace）

declare 只能用来描述已经存在的变量和数据结构，不能用来声明新的变量和数据结构。另外，所有 declare 语句都不会出现在编译后的文件里面。

```typescript
declare function satHello(name: string): void
```



