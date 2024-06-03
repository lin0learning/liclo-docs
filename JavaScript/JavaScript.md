# JavaScript

## 1. 构造函数

使用`function*`所声明的函数为`Generator`函数：

```js
function* foo(x) {
  let y = 2 * (yield(x + 1))
  let z = yield(y / 3)
  return x + y + z
}
let it = foo(5)  // yield 6
it.next()  			 // value: 6, done: false
it.next(12)			 // value: done: false
it.next(13)      // value: 42, done: false
```

Generator函数返回一个迭代器。

当执行第一次next时，传参会被忽略，并且函数暂停在 `yield(x+1)`处，所以返回5+1=6；

当执行第二次next时，传入的参数`12`会被当作上一个yield表达式的返回值。如果不传参，则yield的返回值是undefined。此时`let y = 2 * 12`，所以第二个yield等于`2*12/3=8`

当执行第三次next时，传入的参数13会被当作上一个yield表达式的返回值，所以z=13，x=5，y=24，相加等于42。



## 2. 双冒号(::)与双感叹号(!!)

**`::`**

在JS中，双冒号(::)通常用于处理函数绑定和方法引用，在ES6 (ECMAScript 2015)被引入，称为“函数绑定运算符”

```js
let obj = {
  value: 42,
  getValue: function(){
    return this.value
  }
}
let getValue = obj::obj.getValue
getValue() // 42
```

双冒号运算符并<font color="red">不是标准语法</font>



**`!!`**

`!!` 的作用是强制将一个值转换为布尔值，如果 `value` 是一个假值（例如空字符串、`null`、`undefined`、`0`、`NaN` 等），则转换后的布尔值为 `false`。

```js
let item = {
  appId: 'acms-web',
  component: 'components/statistics/FaultStatistics',
  icon: 'bar-chart',
  id: "13",
  leaf: 1,
  menuCode: 'fault_statistics',
  menuName: '故障统计',
  parentId: '12',
  redirect: null,
  sortNo: 1,
  status: 1,
  url: '/fault-statistics'
}
routes[0].children.push({
  path: '/MainPage' + menu.url,
  name: menu.menuCode,
  meta: {
    title: menu.menuName
  },
  component: resolve => require([`@/${menu.component}`], resolve)
})
```



## 3. 变量的解构赋值

**嵌套结构对象的解构**

```js
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
}
let { p: [x, { y }] } = obj
x // 'Hello'
y // 'World'
```

注意，此时 `p` 为模式，不是变量，因此不会被赋值。如果`p`也要作为变量赋值，可以写成下面这样：

```js
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p, p: [x, { y }] } = obj
x // "Hello"
y // "World"
p // ["Hello", {y: "World"}]
```



**解构的别名与默认值**

```js
let { foo: baz = 'test' } = { foo: 'aaa', bar: 'bbb' }
baz // 'aaa'
```

`foo`是匹配的模式，`baz`是变量。



**字符串的解构**

```js
const [a,b,c,d,e] = 'hello'
```

类数组对象都有一个 `length` 属性，因此可以对该属性解构赋值。

```js
let {length: len} = 'hello'
len // 5
```



**数值和布尔值的解构赋值**

解构赋值时，如果等号右边是数值和布尔值，则会先转为对象。

```js
let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true
```

上面代码中，数值和布尔值的包装对象都有`toString`属性，因此变量`s`都能取到值。







## 4. Reflect

调用原始对象的基本方法 

```js
const obj = {
  a: 0,
  b: 1,
  get c() {
    return this.a + this.b
  }
}

obj.a = 1  // [[SET]]
Reflect.set(obj, 'a', 2)  // [[SET]]

obj.c // 2
Reflect.get(obj, 'c', { a: 3, b: 4 }) // 7  | 修改了obj的this绑定
```

Vue3 Proxy + Reflect理解

```js
const obj = {
  a:1,
  b:2,
  get c() { return this.a + this.b }
}

const proxy = new Proxy(obj, {
  get(target, key) {
    console.log('read', key)
    return target[key]
  }
})

proxy.c // read c   (调用obj的c方法时，由于该方法内部也引用了obj的a与b，但proxy未被捕获到，this指向原始的obj对象)

// 修改
const newProxy = new Proxy(obj, {
  get(target, key) {
    console.log('read', key)
    return Reflect.get(target, key, newProxy)  // 修改this指向为代理对象
  }
})

proxy.c // read c; read a; read b;
```



## 5. 0 与 1 取反：异或

```js
0 ^ 1 // 1
1 ^ 1 // 0
status ^ 1 //  status 为1时输出0；status为0时输出1
```



## 6. axios 处理 blob 数据

```js
axios.post("xxx", {}, {
  responseType: "blob",
  disableResponseInterceptor: true, // 自定义config属性
})
```

通过自定义config属性，在`axios`响应拦截中进行相关判断：

```js
axios.interceptors.response.use(
  (response) => {
    if (response.config.disableResponseInterceptor) {
      return response
    } else {
      return response.data
    }
  },
  (error) => {
    throw error
  }
)
```



## 7. Promise.all、allSettled

`Promise.all()`静态方法接受一个 Promise 可迭代对象(`Promise[]`)作为输入，并返回一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

```typescript
const promise1 = new Promise<any>((resolve, reject) => {
  setTimeout(() => resolve('Promise 1 resolved'), 1000)
})

const promise2 = new Promise<any>((resolve, reject) => {
  setTimeout(() => reject('Promise 2 rejected'), 500)
})

const promise3 = new Promise<any>((resolve, reject) => {
  setTimeout(() => resolve('Promise 3 resolved'), 1500)
})

Promise.all([promise1, promise2, promise3]).then(res => console.log(res)).catch(err => console.log(err))
// 'Promise 2 rejected' 
```

`Promise.allSettled()`静态方法也接受一个 Promise 可迭代对象(`Promise[]`)作为输入，并返回一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。

```typescript
Promise.allSettled([promise1, promise2, promise3])
  .then(res => console.log(res))
  .catch(err => console.log(err))
// 'Promise 2 rejected'
// [
//   { status: 'fulfilled', value: 'Promise 1 resolved' },
//   { status: 'rejected', reason: 'Promise 2 rejected' },
//   { status: 'fulfilled', value: 'Promise 3 resolved' }
// ]
```

**区别**

1. Promise.all() 在其中任何一个 Promise 被拒绝时就会被拒绝；而 Promise.allSettled() 则会在所有 Promise 实例都完成(无论成功还是失败)时才完成。
2. Promise.all() 返回的是一个数组，数组中的值是传入的 Promise 实例的结果值,而 Promise.allSettled() 返回的是一个数组，数组中的值是对象，每个对象表示对应的 Promise 实例的状态和结果值。
3. 当你需要获取所有异步操作的结果时，无论是成功还是失败，应该使用 Promise.allSettled()。如果只关心所有操作都成功的情况，可以使用 Promise.all()。



## 8. delete 操作符

在JavaScript中，使用`delete`操作符删除对象的属性时遵循以下原则：

1. 如果属性不存在，不会报错。相反，它会返回`true`，表示删除成功；
2. 如果属性无法被删除（例如，如果属性是通过`Object.defineProperty`方法定义的，并且`configurable`属性被设置为`false`），`delete`操作符将返回`false`，表示删除失败。

```js
let myObj = {
  prop1: 'value1',
  prop2: 'value2'
};

// 删除存在的属性
delete myObj.prop1;
console.log(myObj.prop1); // undefined

// 删除不存在的属性
let result = delete myObj.prop3;
console.log(result); // true


// 尝试删除不可配置的属性（失败）
Object.defineProperty(myObj, 'prop2', {
  configurable: false
})
let result2 = delete myObj.prop2;
console.log(result2); // false
console.log(myObj.prop2); // value2，属性未被删除
```



## 9. image、blob与file之间转化

```js
const type = res.headers["content-disposition"].split(".")[1]
const blob = new Blob([res.data], {
  type: `image/${type}`
})

const url = URL.createObjectURL(blob) // url
const rawFile = new File([blob], filename, {  // file
  type: blob.type
})
```

**文件传递给服务器的方式：**

1. FormData表单

```js
const formData = new FormDate()
formData.append("file", file.raw)
axios.post('/xxx', formData, {
  transformRequest: data => data
})
```

2. BASE64

```js
function getFileBase64(file) {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file)
    fileReader.onload = el => resolve(e.target.result)
    reader.onerror = (error) => reject(error)
  })
}

upload_input.addEventListener("change", async () => {
  let file = this.files[0]
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { // 2 MB
    //...
  }
  let base64 = await getFileBase64(file)
  axios.post("/xxx", {
    file: encodeURIComponent(base64)
  })
})
```

**监听文件上传进度**：

`XMLHttpRequest.upload` 属性返回一个 [`XMLHttpRequestUpload` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestUpload)对象，用来表示上传的进度。这个对象是不透明的，但是作为一个[`XMLHttpRequestEventTarget`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequestEventTarget)，可以通过对其绑定事件来追踪它的进度。

```js
// axios已对其进行封装
axios.post("/xxx", formData, {
  // 文件上传进度回调 xhr.upload.onprogres
  onUploadProgress(ev) {
    const {loaded, total} = ev
    let percent = `${(loaded/total*100).toFixed(2)}%`
  }
})
```



## 10. 条件判断if的值

当`if`语句表达式为数值`0`、`null`、`undefined`、`false`、空字符串时，条件不成立

```js
if (0) {
  // 不执行
}
if (!0) {
  // 执行
}
```



## 11. dayjs 格式化日期（带星期）

`dayjs()`工具库已覆盖绝大部分时间/日期相关功能，将字符放在方括号中，即可原样返回而不被格式化替换 (例如， `[MM]`)。

```js
// 1. 手动索引星期
let day = new Date().getDay();
const weeks = {
  0: "星期日",
  1: "星期一",
  2: "星期二",
  3: "星期三",
  4: "星期四",
  5: "星期五",
  6: "星期六",
};
return weeks[day]
// 2. dayjs 格式化
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import zhCN from "dayjs/locale/zh-cn"

dayjs.extend(weekday)
dayjs.locale(zhCN)

return dayjs().format("YYYY-MM-DD [\xa0\xa0\xa0] dddd")
```



## 12. 验证手机号、汉字正则

```js
const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/; // 11位手机号
const cnReg = /^[\u4e00-\u9fa5]{2,9}$/;   // 2-9个汉字
```





## 13. 同源Tab页通信

### 1. LocalStorage

当 LocalStorage 变化时，会触发`storage`事件：

```js
window.addeventListener("storage", function(e) {
  // ...
})
```

### 2. BroadCast Channel

```js
// channel.js
exprot const channel = new BroadcastChannel("my_channel")

// 广播消息
import { channel } from './utils/channel'
channel.posetMessage("xxx channel")

// 监听
import { channel } from './utils/channel'
channel.addEventListener("message", function(e) {
  // ... e.data
})
```

### 3. Service Worker

[Service Worker](https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FService_Worker_API) 是一个可以长期运行在后台的 Worker，能够实现与页面的双向通信。多页面共享间的 Service Worker 可以共享，将 Service Worker 作为消息的处理中心（中央站）即可实现广播效果。

>Service Worker 也是 PWA 中的核心技术之一。

**4. Shared Worker**

尚待补充。





## 14. 跨源通信

### 1. PostMessage

`window.postMessage()`方法可以安全地实现跨源通信：

```js
targetWindow.postMessage(message, targetOrigin, [transfer])
window.top.postMessage({type: 'alarm'}, '*')
```



## 15. 获取页面所有 a 标签 href 值

```js
var allATags = document.getElementByTagName("a")
Array.from(allATags).map(item => item.getAttribute("href"))
```



## 16. 防抖 & 节流

### **防抖 ** - debounce

```typescript
/**
 * 防抖
 * @param {Function} fn 需要进行防抖的函数
 * @param {Number} delay 延迟时间
 * @return {Function}
 * @example
 * const inputDebounce = debounce(input, 300);
 */
export function debounce(fn, delay = 300) {
  let timeout = null
  return function (...args) {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    } else {
      // first immediately callback
      fn.apply(this, args)
    }
    timeout = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// typescript类型声明
```



### **节流** - throttle

```js
function throttle(fn, delay = 300) {
  let pre = 0
  let timeout = null
  return function (...args) {
    const now = Date.now()
    // 超过节流间隔时执行
    if (now - pre > delay) {
      pre = now
      fn.apply(this, args)
    } else {
      // 如果在节流间隔内，则后续的事件会被清除
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      // 最后一次的事件会被触发
      timout = setTimeout(() => {
        pre = now
        fn.apply(this, args)
      }, delay)
    }
  }
}
// typescript类型声明
```





## 17. 文件下载

`URL.revokeObjectURL()` 静态方法用来释放一个之前已经存在的、通过调用 [`URL.createObjectURL()`](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL) 创建的 URL 对象。调用`revokeObjectURL()` 使这个潜在的对象回到原来的地方，允许平台在合适的时机进行垃圾收集。

```js
axiosInstance({
    method: 'post',
    url: '',
    responseType: 'blob',
    data： {}
}).then((res) => {
    let data = res.data;
    let fileName = "司机值班信息.xlsx";
    let url = window.URL.createObjectURL(new Blob([data]));
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.setAttribute("download", fileName);
    document.body.appendChild(a);
    a.click(); //执行下载
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
    message.success("导出成功");
})
```





## 18. wsConnect

```js
/**
 * 等待建立连接并发送参数
 * @param {WebSocket} ws 
 * @param callback 
 * @param interval 
 */
function waitForConnection<T extends (...args: any[]) => any>(
  ws: WebSocket,
  callback: T,
  interval: number
) {
  if (ws.readyState === 1) {
    callback()
  } else {
    setTimeout(() => {
      waitForConnection(ws, callback, interval)
    }, interval);
  }
}

/**
 * 判断接口是否存在，存在则关闭并重新建立连接
 * @param ws 
 * @param url 
 * @param param 
 */
function wsConnection(ws: WebSocket | null, url: string, param: string | ArrayBufferLike | Blob | ArrayBufferView) {
  if (ws) {
    ws.close()
    ws = null
  }
  ws = new WebSocket(url)
  ws.onopen = (e) => {
    waitForConnection(
      ws!,
      () => {
        ws?.send(param)
      },
      1000
    )
  }
  return ws
}

export { wsConnection }
```





## 20. Ajax

```js
// fetch
fetch('https://example.com/movies.json')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```



```js
// XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://example.com/movies.json');
xhr.setRequestHeader('Content-Type', 'application/json');
xhr.onload = function() {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  } else {
    console.error('Request failed.  Returned status of ' + xhr.status);
  }
};
// 发送
xhr.send();
```



## 21. 数组操作业务案例

对一对象数组，提取其键名`title`与`value`单独作为数组，并作为`Echart` options中的`series`与`data`值。现要求对 `value` 进行降序排列：

**不考虑 value 相等的情况：**

```js
let objArray = [
    { title: "John", value: 30 },
    { title: "Alice", value: 20 },
    { title: "Bob", value: 25 },
]
let series = objArray.map(obj => obj.value)
let titles = objArray.map(obj => obj.title)

series.sort((a, b) => b - a)
titles.sort((a, b) => {
  let indexA = series.indexOf(objArray.find(obj => obj.value === a).value)
  let indexB = series.indexOf(objArray.find(obj => obj.value === b).value)
  return indexA - indexB
})
```

**考虑 value 相等的情况：**

如果原数组可遍历操作：

```js
let objArray = [
    { title: "John", value: 30 },
    { title: "Alice", value: 20 },
    { title: "Bob", value: 25 },
    { title: "Dave", value: 25 } // 添加一个value重复的对象
];
let series = objArray.map(obj => obj.value)
let titles = objArray.map(obj => obj.title)

// 构建映射，将value映射到对应的所有name
let valueToNames = objArray.reduce((acc, obj) => {
  if (acc[obj.value]) {
    acc[obj.value].push(obj.title)
  } else {
    acc[obj.value] = [obj.title]
  }
  return acc
}, {})

// 对value数组进行降序排列，并根据其顺序对titles数组进行排序
series.sort((a, b) => b - a)
titles.sort((a, b) => {
  let indexA = values.indexOf(a)
  let indexB = values.indexOf(b)
  // 如果value值相同，根据原始对象数组中的顺序排序
  if (indexA === indexB) {
    let titleA = valueToNames[a].shift()
    let titleB = valueToNames[b].shift()
    return titles.indexOf(titleA) - titles.indexOf(titleB)
  }
  return indexA - indexB
})
```

如果原数组不能遍历操作：

```js
let objArray = [
    { title: "John", value: 30 },
    { title: "Alice", value: 20 },
    { title: "Bob", value: 25 },
    { title: "Dave", value: 25 } // 添加一个value重复的对象
];
let series = objArray.map(obj => obj.value)
let titles = objArray.map(obj => obj.title)

// 创建一个临时数组，包含title和对应的name
let tempArray = series.map((value, index) => ({ value: value, title: titles[index] }))
tempArray.sort((a, b) => {
  // 降序
  if (b.value !== a.value) {
    return b.value - a.value
  }
  // 相同则不变
  return tempArray.findIndex(obj => obj.title === a.title) - tempArray.findIndex(obj => obj.title === b.title)
  
  // 直接 return b.value - a.value 好像也行？
})

// 更新 series 和 titles 数组
series = tempArray.map(obj => obj.value)
titles = tempArray.map(obj => obj.title)
```

补充：`Array.prototype.shift()`

`shift()` 方法从数组中删除第一个元素，并返回该元素的值，此方法会更改数组的长度。

```js
const array = [1,2,3]
array.shift() // 1
array.shift() // 2
array.shift() // 3
array // Array []
```



## 22. 对象转换String

```js
String({time:1000}) // '[object Object]'
String({}) // '[object Object]'
```





## 23. JSDoc 文档注释

```js
/**
 * @typedef {Object} MenuItem
 * @property {number} id
 * @property {number} parentId
 * @property {string} name
 * @property {string} url
 * @property {number} type
 * @property {string|null} icon
 * @property {number} orderId
 * @property {string} component
 * @property {MenuItem[]} children
 */
/**
 * @param {MenuItem[]} userMenus
 * @returns {Object[]}
 * @throws {Error}
 */
export function mapMenus(userMenus) {
  return userMenus.map((item) => {
    const { url, component, children } = item;
    const route = {
      path: url,
      component: import(`../pages${component}.vue`),
      children: [],
      name: url.split("/")[1]
    };
    if (children && children.length > 0) {
      route.children = mapMenus(children);
    }
    return route;
  });
}
```

使用 `@typedef` 描述自定义类型，并可在后续复用：

```js
/**
 * @typedef {{text: string, id: number, isFinished: boolean}[]} Todos
*/

/** @type {Todos} */
const todos = []
```

使用 `@param` 声明参数类型时，使用中括号可描述可选类型：

```js{4}
/**
 * 创建svg tag
 * @param {'svg'|'g'|'path'|'filter'|'animate'|'marker'|'line'|'polyline'|'rect'|'circle'|'ellipse'|'polygon'} tagName 
 * @param {import('vue').SVGAttributes} [attrs] 
 * @returns {Node}
 */
```





## 24. case 条件

当 index 的值为 0 或 1时，执行同一种情况处理（case 穿透）。

```js
switch (index) {
  case 0:
  case 1:
    // ...
    break
  default:
    break
}
```



## 25. import 与 export 细则

`export default A` 与 `export { A as default }` 

> `export default A` 和 `export { A as default }` 似乎在 `import` 时是一样的，但是有细微区别。原文章出处：[everfind](https://everfind.github.io/)



### 一、`import` 语句导入的是引用，不是值

```ts
import { A } from './module.ts'
```

上述代码中，`A` 和 `./module.js` 中的 A 是相同的。

```ts
const module = await import('./module.ts')
const { A: destructuredA } = await import('./module.ts')

module.A == destructuredA   // true
module.A === destructuredA  // true
```

再看`./module.ts`

```ts
export let A = 'initial'

setTimeout(() => {
  A = 'changed'
})
```

```ts
// main.ts
import { A as importedA } from './module.ts'
const module = await import('./module.ts')
let { A } = await import('./module.ts')

setTimeout(() => {
  console.log(importedA)  // 'changed'
  console.log(module.A)   // 'changed'
	console.log(A) 					// 'initial'
}, 1000)
```

`import` 语句导入的是引用，也就是说，当 `./module.js` 中 `A` 的值发生变化的时候，`./main.js` 中也会跟着变化。解构赋值获得的 `A` 不会变化是因为解构过程中是使用的值赋值给了新变量，而不是引用。

> 静态语句 `import { A } ...` 虽然看着像解构赋值，实际上与解构赋值并不相同。



### 二、`export default`

修改下 `./module.ts`、 `./main.ts`

```ts
// module.js
let A = 'initial'

export { A }
export default A

setTimeout(() => {
  A = 'changed'
}, 500)
```

```ts
// main.ts
import { A, default as defaultA } from './module.js'
import anotherDefaultA from './module.js'

setTimeout(() => {
  console.log(A) 								// "changed"
  console.log(defaultA) 				// "initial"
  console.log(anotherDefaultA) 	// "initial"
}, 1000)
```

`export default` 后面的将会被作为表达式对待。因此我们可以 `export default 'hello';`， 甚至可以 `export default 1 + 2;`。因此，在 `export default A` 中，`A` 是作为表达式语句使用的，因此使用的是 A 的值。因此，当 `A` 的值在 `setTimeout` 中被改变的时候，`export default` 的值<font color="red">并没有变化</font>。

小结：

```ts
// 引用
import { A } from './module.js';
import { A as otherName } from './module.js';
import * as module from './module.js';
const module = await import('./module.js');
// 值
let { A } = await import('./module.js');

// 导出引用
export { A };
export { A as otherName };
// 导出值
export default A;
export default 'hello!';
```



### 三、`export {A as default}`

> `export {}` 导出的始终是一个引用

```ts
// module.ts
let A = 'initial'

export {A, A as default}

setTimeout(() => {
  A = 'changed'
}, 500)
```

```ts
// main.ts
import { A, default as defaultA } from './module.js'
import anotherDefaultA from './module.js'

setTimeout(() => {
  console.log(A) 								// "changed"
  console.log(defaultA) 				// "changed"
  console.log(anotherDefaultA) 	// "changed"
}, 1000)
```



### 四、`export default function`

虽然，前面说过 `export default` 后面的会被作为表达式使用。但是也有一些例外：

```ts
// module.ts
export default function A() {}

setTimeout(() => {
  A = 'changed';
}, 500);
```

```ts
// main.ts
import A from './module.js';

setTimeout(() => {
  console.log(A); // "changed"
}, 1000);
```

输出 `"changed"`，因为 `export default function` 有其特殊的语法，在这个语法中，<font color="red">函数是作为引用传递</font>的。对代码稍作修改：

```ts
// module.ts
function A() {}

export default A
setTimeout(() => {
  A = 'changed'
}, 500)
```

此时控制台输出：`ƒ A() {}`





## 26. 浅拷贝引发的问题

```ts
let dataSource = [
  {
    name: 'liclo',
    age: 20,
    type: 'level1'
  },
  {
    name: 'dekki',
    age: 24,
    type: 'level2'
  }
]

console.log("before", dataSource)

let store: Record<string, any> = {}

dataSource.forEach((item, index) => {
  if (index === 1) {
    store = item
    store.name = 'changed'
  }
})

console.log('after', dataSource)
```

打印结果：

![image-20240423154659632](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202404231546858.png)

可见，两次打印的结果相等。

```ts
dataSource.forEach((item, index) => {
  if (index === 1) {
    store = {...item}
    store.name = 'changed'
  }
})
```





## 27. 获取日期函数

```ts
// 输入格式字符串 获取日期
const formatTime = (date:Date, format:string) => {
  const map = {
    YY: date.getFullYear(),
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    HH: date.getHours(),
    hh: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds()
  }
  return format.replace(/YYYY|YY|MM|DD|HH|hh|mm|ss/g, (match) => {
    return String(map[match]).padStart(2, '0')
  })
}
const [curYear, curMonth, curDay] = formatTime(new Date(), 'YY-MM-DD-hh-mm-ss')
```

获取指定某年某月共多少天

```ts
function getThisMonthDays(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}
```

获取指定某年某月第一天星期几

```ts
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(Date.UTC(year, month - 1, 1)).getDay()
}
```


## 28. 对象的迭代

对对象添加迭代器属性即可使用 `for of` 方法遍历对象，对象的 `key` 必须为number，并且索引从数值 `0` 开始，且必须添加 `length` 属性：
```typescript
let obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator]
}

for (let item of obj) {
  console.log(item)  // 'a' 'b' 'c'
}

for (let key in obj) {
  console.log(key)  // '0' '1' '2' 'length'
}
```


## 29. 数组的分段
实现函数：将长度为 `n` 的数组按照 `splitCount` 进行分段，并返回一个新的数组，新数组的每一项为原数组分段所组成的数组。
**方法一：`for`**
```js
function splitArray(array, splitCount) {
  const result = []
  /* 原始 */
  for (let i = 0; i < Math.ceil(array.length / splitCount); i++) {
    result.push(array.slice(i * count, (i + 1) * count))
  }

  /* 改进 */
  for (let i = 0; i < array.length; i += splitCount) {
    result.push(array.slice(i, i + splitCount))
  }
  return result
}
```

**方式二：`reduce`**
```js
function splitArray(array, splitCount) {
  return array.reduce((prev, cur, index) => {
    const chunkIndex = Math.floor(index / splitCount)
    if (!prev[chunkIndex]) {
      prev[chunkIndex] = []
    }
    prev[chunkIndex].push(cur)
    return prev
  }, [])
}
```

## 30. 事件回调传递参数
在使用 `addEventListener` 监听DOM元素的事件时，默认情况下，回调函数只能接收一个 `Event` 对象参数。想在回调函数中传递除了Event对象之外的其他参数，有几种方法：
方法一：闭包/箭头函数
```js
const extraParameter = 'hello world'
button.addEventListener('click', event => callback(event, extraParameter))
```

方法二：使用 `bind`
```js
const extraParameter = 'hello world'
button.addEventListener('click', callback.bind(null, extraParameter))
```

方法三：自定义属性 `dataset`
:::code-group

```js
button.addEventListener('click', callback)
function callback(event) {
  const {extra} = event.target.dataset
}
```
```html
<button data-extra="hello world">click</button>
```
:::


## 31. Web Worker API
Web Worker 能创建一个独立于 Web 应用程序主执行程序的后台线程，并运行脚本操作，使主线程的运行（通常是 UI 线程）的运行不会被阻塞

Web Worker 使用限制

1. 同源限制：只能运行同源脚本文件
2. DOM限制：无法获取 DOM 对象，但可以使用 `navigator` 和 `location` 对象

```js
function createWorker(f) {
  const blob = new Blob[`(${f.toString()})()`]
  const url = URL.createObjectURL(blob)
  const worker = new Worker(url)
  return worker
}
```


## 链接

[![NPM Version][npm-image]][npm-url] 

[![NPM Downloads][downloads-image]][downloads-url]

[![juejin likes][juejin-image]][juejin-url]

[npm-image]: https://img.shields.io/npm/v/vue-simple-uploader.svg?style=flat
[npm-url]: https://npmjs.org/package/vue-simple-uploader
[downloads-image]: https://img.shields.io/npm/dm/vue-simple-uploader.svg?style=flat
[downloads-url]: https://npmjs.org/package/vue-simple-uploader
[juejin-image]: https://img.shields.io/badge/%E6%8E%98%E9%87%91-446Likes-blue.svg
[juejin-url]: https://juejin.im/entry/599dad0ff265da248b04d7b8/detail
