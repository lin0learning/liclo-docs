# ES7~ES12 新特性

## ES7

### 1.`Array.prototype.includes`

`includes` 方法用来判断一个数组或字符串中是否包含指定的值。

**返回值**：如果包含返回 `true`，否则返回 `false`

```js
const status = [1,2,3,4]
status.includes(3) // true
status.includes(3, 1) // true
status.includes(3, 4) // false
```



### 2.`Exponentiation Operator`幂运算

幂运算符`**`，相当于`Math.pow()`

```js
5 ** 2          // 25
Math.pow(5, 2)  // 25
```



## ES8

- `Async functions`
- `Object.entries`
- `Object.values`
- `Object.getOwnPropertyDescriptors`
- `String.prototype.padStart`

### 1.Async functions

`Async functions` 是 `async` 声明的函数，`async` 函数是 `AsyncFunction` 构造函数的实例，其中允许使用 `await` 关键字。

```js
async function queryData() {
  // ...
}
```

async function 返回值为 `Promise`



### 2.Object.entries

`Object.entries()`方法返回一个给定对象自身**可枚举属性的键值对数组**

```js
let obj = {
  a: 1,
  b: 2
}
Object.entries(obj)   // [['a', 1], ['b', 2]]
```



### 3.Object.values

`Object.values()`方法返回一个给定对象自身**可枚举属性值的数组**

```js
let obj = {
  a: 1,
  b: 2
}
Object.values(obj)  // [1,2]
```



### 4.`Object.getOwnPropertyDescriptors`

`Object.getOwnPropertyDescriptors()` 方法用来获取一个对象的所有自身属性的描述符

```js
let obj = {
  a: 1,
  b: 2
}
Object.getOwnPropertyDescriptors(obj)

{
  "a": {
    "value": 1,
     "writable": true,
     "enumerable": true,
     "configurable": true
  },
  "b": {
     "value": 2,
     "writable": true,
     "enumerable": true,
     "configurable": true
  }
}
```

### 5.`String.prototype.padStart()`

`padStart()` 用另一个字符串填充当前字符串。

```js
'abc'.padStart(10);         // "       abc"
'abc'.padStart(10, "foo");  // "foofoofabc"
'abc'.padStart(6,"123465"); // "123abc"
'abc'.padStart(8, "0");     // "00000abc"
'abc'.padStart(1);          // "abc"
```



### 6.`String.prototype.padEnd()`

padEnd() 方法会用一个字符串填充当前字符串。

```js
'abc'.padEnd(10);          // "abc       "
'abc'.padEnd(10, "foo");   // "abcfoofoof"
'abc'.padEnd(6, "123456"); // "abc123"
'abc'.padEnd(1);           // "abc"
```



## ES9

ES2018（ES9）新增了如下特性👇

- `Async iterators` 异步迭代器
- `Object rest properties` 剩余属性
- `Object spread properties` 扩展属性
- `Promise.prototype.finally`



### 1.`Async iterators` 异步迭代器

`Async iterator` 对象的 next() 方法返回一个 `Promise`，这个 `Promise` 的返回值可以被解析成 `{value, done}` 的格式：

```js
iterator.next().then({value, done} => {})
```

举例：

```js
const asyncIterator = () => {
  const array = [1, 2];
  return {
    next: function() {
      if(array.length) {
        return Promise.resolve({
          value: array.shift(),
          done: false
        });
      }
      return Promise.resolve({
        done: true
      });
    }
  }
}

const iterator = asyncIterator()

const test = async () => {
  await iterator.next().then(console.log)  // {value: 1, done: false}
  await iterator.next().then(console.log)  // {value: 2, done: false}
  await iterator.next().then(console.log)  // {done: true}
}
```



还可以使用 `for-await-of` 在循环中国异步调用函数：

```js
const promises = [
  new Promise((resolve) => resolve(1)),
  new Promise((resolve) => resolve(2)),
  new Promise((resolve) => resolve(3)),
]

async function Test() {
  for await (const res of promises) {
    res  // 1 2 3
  }
}
Test()
```



### 2.`Object rest properties`

对象的剩余参数特性：

```js
let test = {
  a: 1,
  b: 2,
  c: 3,
  d: 4
}

let {a, b, ...rest} = test
rest // {c:3, d: 4}
```



### 3.`Object spread properties`

```js
let test = {
  a: 1,
  b: 2
}
let result = {c: 3, ...test};
console.log(result);             // {c: 3, a: 1, b: 2}
```



### 4.`Promise.prototype.finally`

在`Promise`结束的时候，不管是结果是`resolved`还是`rejected`，都会调用`finally`中的方法。

`finally`中的回调函数不接受任何参数。



## ES10

ES2019（ES10）新增了如下新特性👇：

- `Array.prototype.{flat, flatMap}`扁平化嵌套数组
- `Object.fromEntries`
- `String.prototype.{trimStart, trimEnd}`
- `Symbol.prototype.description`
- `Optional catch binding`



### 1. `Array.prototype.{flat, flatMap}`

`flat()`方法会按照一个可指定的深度遍历递归数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```js
arr.flat([depth])
```

该方法返回一个新数组，不会改变原数组。

- `flat()` 会移除数组中的空项

```js
let arr = [1,2, , , 3]
arr.flat() // [1,2,3]
```



`flatMap()` 方法首先使用映射函数映射数组（深度值为1）的每个元素，然后将结果压缩成一个新数组。返回一个新数组，并且每个元素都是回调函数的结果：

```js
arr.flatMap(function callback(currentVal[, index[, array]]) {
  
}[, thisArg])
```

```js
let arr = ['My name', 'is', '', 'Lisa']

arr.flatMap(cur => cur.split(' '))  // ["My", "name", "is", "", "Lisa"]
```



### 2. Object.fromEntries

`fromEntries()` 方法会把键值对列表转换成一个对象，并返回一个新的对象。

```js
Object.fromEntries(iterable)
```

- iterable: Array、Map等可迭代对象

```js
let map = new Map([['a', 1], ['b', 2]])
Object.fromEntries(map)  // {a: 1, b: 2}

let arr = [['a', 1], ['b', 2]]
Object.fromEntries(arr)  // {a: 1, b: 2}

let obj = {a: 1, b: 2}
Object.fromEntries(
  Object.entries(obj).map(
    ([key, val]) => [key, val * 2]
  )
)  //  {a: 1, b: 2} => [['a', 1], ['b', 2]] => [['a', 2], ['b', 4]] => {a: 2, b: 4}
```



### 3. `String.prototype.{trimStart, trimEnd}`

`trimStart()` 方法用来删除字符串的开头的空白字符。`trimLeft()` 是它的别名。该方法返回一个新的字符串

```js
let str = '    a b cd  '
str.trimStart()   // 'a b cd  '
```

`trimEnd()` 方法用来删除字符串末尾的空白字符。`trimRight()` 是它的别名。该方法返回一个新的字符串

```js
let str = '    a b cd  '
str.trimEnd()   // '    a b cd'
```



### 4. `Symbol.prototype.description`

`description` 是一个只读属性,它返回Symbol对象的可选描述的字符串:

```js
Symbol('myDescription').description
let key1 = Symbol('export')
key1.description  // export
```



### 5. `Optional catch binding`

可选的捕获绑定，允许省略catch绑定和它后面的圆括号

ES10之前的用法：

```js
try {

} catch(err) {
  console.log('err', err)
}
```

ES10的用法：

```js
try {

} catch {

}
```







## ES11

ES2020(ES11)新增了如下新特性👇：

- 空值合并运算符（Nullish coalescing Operator）
- 可选链 Optional chaining
- globalThis
- BigInt
- `String.prototype.matchAll()`
- `Promise.allSettled()`
- Dynamic import（按需 import）



### 1.空值合并运算符（Nullish coalescing Operator）

#### 1.1 空值合并操作符（`??`）

**空值合并操作符**（`??`）是一个逻辑操作符，当左边的操作数为 `null` 或 `undefined` 的时候，返回其右侧操作符，否则返回左侧操作符。

```js
undefined ?? 'foo'  // 'foo'
null ?? 'foo'  // 'foo'
'foo' ?? 'bar' // 'foo'
```

#### 1.2 逻辑或操作符（`||`）

**逻辑或操作符**（`||`），会在左侧操作数为假值时返回右侧操作数，也就是说如果使用 `||` 来为某些变量设置默认值，可能会出现意料之外的情况。比如 0、''、NaN、false：

```js
0 || 1  // 1
0 ?? 1  // 0

'' || 'bar'  // 'bar'
'' ?? 'bar'  // ''

NaN || 1  // 1
NaN ?? 1  // NaN

false || 'bar'  // 'bar'
false ?? 'bar'  // false
```



### 2. 可选链

**可选链操作符**（`?.`）允许读取位于连接对象链深处的属性的值，而不必明确验证链中的每个引用都是否有效。`?.` 操作符的功能类似于`.`链式操作符，不同之处在于，在引用为 `null` 或 `undefined` 时不会报错，该链路表达式返回值为 `undefined`。

```js
const street = user?.address?.street
```



### 3. globalThis

`globalThis` 提供了一个标准的方式来获取不同环境下的全局对象自身值。



### 4. BigInt

BigInt 是一种内置对象，用来创建比 2^53 - 1（Number 可创建的最大数字） 更大的整数。可以用来表示任意大的**整数**



#### 4.1 定义一个 BigInt

- 在一个整数字面量后面加 n，例如 `10n`
- 调用函数 `BigInt()` 并传递一个整数值或字符串值，例如 `BigInt(10)`

#### 4.2 BigInt的特点

- BigInt 不能用于 Math 对象中的方法；
- BigInt 不能与任何 Number 实例混合运算，两者必须转换成同一种类型。但是需要注意，BigInt 在转换成 Number 时可能会丢失精度。
- 当使用 BigInt 时，带小数的运算会被向下取整
- BigInt 和 Number 不是严格相等，但是宽松相等



### 5. `String.prototype.matchAll()`

返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器。

```js
const regexp = /t(e)(st(d?))/g;
const str = 'test1test2';

const array = [...str.matchAll(regexp)];
console.log(array[0]);  // ["test1", "e", "st1", "1"]
console.log(array[1]); // ["test2", "e", "st2", "2"]
```



### 6. Promise.allSettled()

类方法，返回一个在所有给定的 promise 都已经 fulfilled 或 rejected 后的 promise，并带有一个对象数组，每个对象表示对应的 promise 结果。

```js
Promise.allSettled([
  Promise.resolve(33),
  new Promise((resolve) => setTimeout(() => resolve(66), 0)),
  99,
  Promise.reject(new Error("an error")),
]).then((values) => console.log(values)); 

// [
//   { status: 'fulfilled', value: 33 },
//   { status: 'fulfilled', value: 66 },
//   { status: 'fulfilled', value: 99 },
//   { status: 'rejected', reason: Error: an error }
// ]
```



### 7. Dynamic import

`import` 现在可以在需要的时候，再加载某个模块

```js
button.addEventListener('click', event => {
  import('./utils.js')
  .then(utils => {
    utils.initHost({/**/})
  })
  .catch(error => {
    /* error */
  })
})
```





## ES12

ES 2021（ES12）新增了如下新特性👇：

- 逻辑运算符和赋值表达式（&&=，||=，??=）
- `String.prototype.replaceAll()`
- 数字分隔符
- `Promise.any`



