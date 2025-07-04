# JavaScript Utils

## JavaScript 工具函数

**1. 创建 svg 元素**

```js
/**
 * 创建svg tag
 * @param {'svg'|'g'|'path'|'filter'|'animate'|'marker'|'line'|'polyline'|'rect'|'circle'|'ellipse'|'polygon'|'text'} tagName 
 * @param {import('vue').SVGAttributes} [attrs] 
 * @returns {Element}
 * @example
 * ```js
 * let rect = createTag('rect', {
 *  x: 0,
 *  y: 0,
 *  width: '8',
 *  height: '8',
 *  stroke: '#26c7ff',
 *  'stroke-width': '2',
 *  rx: '2',
 *  ry: '2'
 * })
 * svg.appendChild(rect)
 * ```
 */
export function createTag(tagName, attrs) {
  let svgTags = ['svg', 'g', 'path', 'filter', 'animate', 'marker', 'line', 'polyline', 'rect', 'circle', 'ellipse', 'polygon', 'text'];
  let el;
  if (svgTags.indexOf(tagName) >= 0) {
    el = document.createElementNS('http://www.w3.org/2000/svg', tagName);
  } else {
    el = document.createElement(tagName);
  }
  if (attrs) {
    for (let attr in attrs) {
      el.setAttribute(attr, attrs[attr]);
    }
  }
  
  return el;
}
```

**2. 防抖函数**

```js
/**
 * 防抖
 * @param {Function} fn 需要进行防抖的函数
 * @param {Number} delay 延迟时间
 * @return {Function}
 * @example
 * const inputDebounce = debounce(input, 300);
 */
export function debounce(fn, delay = 300) {
  let timeout = null;
  return function (...args) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    } else {
      // 对第一次输入立即执行
      fn.apply(this, args);
    }
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

**3. ant-design-vue 分页**
```js
/**
 * 分页
 * @param {Number} current 
 * @param {Number} pageSize 
 * @param {string[]} pageSizeOptions 
 * @param {Number} total
 * @returns {import('ant-design-vue').TablePaginationConfig}
 */
export function getPagination(current = 1, pageSize = 10, pageSizeOptions = ['10', '20', '30', '40'], total = 0) {
  const pagination = reactive({
    total,
    current,
    pageSize,
    pageSizeOptions,
    showTotal: () => `共${pagination.total}条`,
    showSizeChanger: true,
    onChange(page, pageSize) {
      pagination.current = page;
      pagination.pageSize = pageSize;
    }
  });
  return pagination;
}
```

**4. Vue3 拖拽指令 - vDrag**
```js
const vDrag = {
  /**
   * @param {Element} el 
   */
  mounted(el) {
    const oDiv = el;
    const minTop = Number(oDiv.getAttribute('drag-min-top'));
    const ifMoveSizeArea  = 20;

    const onMouseDown = (e) => {
      let target = oDiv;
      while (window.getComputedStyle(target).position !== 'absolute' && target !== document.body) {
        target = target.parentElement;
      }
      document.onselectstart = () => false;

      if (!target.getAttribute('init_x')) {
        target.setAttribute('init_x', target.offsetLeft);
        target.setAttribute('init_y', target.offsetTop);
      }
      const offsetTop = target.clientHeight / 2;

      const initX = parseInt(target.getAttribute('init_x'));
      const initY = parseInt(target.getAttribute('init_y'));

      const disX = e.clientX - target.offsetLeft;
      const disY = e.clientY - target.offsetTop;

      const onMouseMove = (e) => {
        // 计算移动的距离
        const l = e.clientX - disX;
        const t = e.clientY - disY;
        // 计算移动当前元素的位置，并且给该元素样式中的left和top值赋值
        target.style.left = `${l}px`;
        target.style.top = `${t < (minTop + offsetTop) ? (minTop + offsetTop) : t}px`;

        if (Math.abs(l - initX) > ifMoveSizeArea || Math.abs(t - initY) > ifMoveSizeArea) {
          target.setAttribute('dragged', '');
        } else {
          target.removeAttribute('dragged');
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.onselectstart = null;
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      return false;
    };

    oDiv.addEventListener('mousedown', onMouseDown);
  },
  unmounted(el) {}
};

export default vDrag;
```


**5. blob文件下载**
```js
/**
 * 
 * @param {String} fileNameAndType 文件名与类型
 * @param {Blob} data 文件流 
 * @returns {Promise}
 */
export function downLoadFile(fileNameAndType, data, isBlob = false) {
  return new Promise((resolve, reject) => {
    if (!isBlob) {
      data = new Blob([data])
    }
    let url = window.URL.createObjectURL(data);
    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.setAttribute("download", fileNameAndType);
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
    resolve(true)
  })
}
```

**6. 读取文件转base64**
```js
/**
 * @param {File} file 
 */
function getFileBase64(file) {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = el => {
      resolve(el.target.result)
    }
  })
}
```

**7. 读取文件转buffer**
```js
import SparkMD5 from 'SparkMD5'

/**
 * @param {File} file
 */
function getFileBuffer(file) {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = el => {
      let buffer = el.target.result
      let spark = new SparkMD5.ArrayBuffer()
      spark.append(buffer)
      let hashName = spark.end()
      let suffix = /\.([0-9a-zA-Z]+)$/.exec(file.name)[1]
      resolve({
        buffer,
        hashName,
        suffix,
        filename: `${hashName}.${suffix}`
      })
    }
  })
}
```


**8. echarts 模块封装**
```js
import * as echarts from "echarts/core"; // echarts 核心模块
import { BarChart, PieChart, LineChart } from "echarts/charts"; // 图表
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
} from "echarts/components"; // 提示框，标题，直角坐标系，数据集，内置数据转换器组件
import { LabelLayout, UniversalTransition } from "echarts/features"; // 标签自动布局、全局过渡动画
import { CanvasRenderer } from "echarts/renderers"; // Canvas 渲染器  | SVGRenderer
echarts.use([
  BarChart,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

export default echarts;

```

**9. Vue3 重置路由**
重置白名单以外的路由
```js
import router from "@/router/index";

const whiteList = ["root", "/", "login", "404"];

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !whiteList.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}
```

**10. 时间格式化**
```js
/**
 *
 * @param {Date} date
 * @param {String} format 格式化格式
 * @returns String
 */
function formatTime(date, format) {
  const map = {
    YY: date.getFullYear(),
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1, // 月份从0开始，所以要加1
    DD: date.getDate(),
    hh: date.getHours(),
    HH: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds(),
  };
  return format.replace(/YYYY|YY|MM|DD|hh|HH|mm|ss/g, (match) => {
    return String(map[match]).padStart(2, "0");
  });
};
```

**11. 获取当前浏览器名称**
```ts
function getExplorer() {
  const ua = window.navigator.userAgent;
  const isExplorer = (exp: string) => {
    return ua.indexOf(exp) > -1;
  };
  if (isExplorer("MSIE")) return "IE";
  else if (isExplorer("Firefox")) return "Firefox";
  else if (isExplorer("Chrome")) return "Chrome";
  else if (isExplorer("Opera")) return "Opera";
  else if (isExplorer("Safari")) return "Safari";
}
```

**12. 滚动到顶/底部（H5原生）**
```ts
function scrollToTop(el: HTMLElement) {
  el.scrollIntoView({
    behavior: 'smooth',
    block: 'start' // 'start' | 'end' | 'center' | 'nearest'
  })
}
```

**13. 检查元素是否在屏幕中**

```ts
const callback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log(`${entry.target.id} is visible`);
    }
  });
};
const options = {
  threshold: 1.0 // 100%屏幕外
};

const observer = new IntersectionObserver(callback, options);
const btn = document.getElementById("btn");
observer.observe(btn as Element);
```

**14. 读取URL中的参数**
```ts
function getParamByUrl(key: string) {
  const url = new URL(location.href);
  return url.searchParams.get(key);
};
```

**15. 延迟函数**
```ts
/**
 * 
 * @param ms 
 * @returns 
 * @example
 * const asyncFn = async () => {
 *   await wait(1000)
 *   console.log('xxx')
 * }
 */
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
```

**16. 检测暗色主题**
```ts
/** 检测暗色主题 */
const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
```

**17. 请求json文件获取配置**

```ts
function queryJSONConfig(url: string) {
  return new Promise((resolve, reject) => {
    fetch(url).then(res => res.json()).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
```



**18. 对象数组按照指定顺序进行排序**

通过使用一个映射（map）来存储排序顺序，然后根据顺序映射对数据进行排序（使用`sort()`方法）

```ts
const orderMap = ['车载', 'ZC', '联锁', 'ATS', 'DCS', '道岔', '电源', '计轴', '信号机', 'LEU', '漏缆'].reduce(
  (prev, cur, index) => {
    prev[cur] = index
    return prev
  }, {}
)

const adviceList = ref<device[]>([])
const sortedList = computed(() => {
  return adviceList.value.sort((a, b) => {
    return orderMap[a.deviceTypeName] - orderMap[b.deviceTypeName]
  })
})
```

**传入字符串/数字数组生成对象索引Map：**

```ts
type Item = string | number | symbol
function ArrayToMap(arr: Item[]) {
  return arr.reduce((prev, cur, index) => {
    prev[cur] = index
    return prev
  }, {})
}
```



**19. 对象数组按照指定键名进行去重**

```ts
function deduplicateArray<T>(arr: T[], key: keyof T) {
  if (!Array.isArray(arr) || arr.length === 0) return []

  if (typeof key !== 'string' || !(key in arr[0])) return arr // 如果 key 不是对象的属性，则返回原数组
  
  // 使用 Map 数据结构来根据 `key` 属性值去重
  const uniqueMap = new Map<any, T>()

  arr.forEach(item => {
    const keyValue = item[key]
    if (!uniqueMap.has(keyValue)) {
      uniqueMap.set(keyValue, item)
    }
  })

  return Array.from(uniqueMap.values())
}
```

```js
function unique(arr) {
  const res = []
  const map = new Map()
  for (let item of arr) {
    if (!map.has(item.name)) {
      map.set(item.name)
      res.push(item)
    }
  }
  return res
}
```



**20. 大小单位转换**

```js
function formatSizeUnits(kb) {
  let units = ['KB', 'MB', 'GB', 'TB', 'PB']
  let unitIndex = 0
  
  while(kb >= 1024 && unitIndex < units.length - 1) {
    kb /= 1024
    unitIndex++
  }
  
  return `${kb.toFixed(2)} ${units[unitIndex]}`
}
```



**21. 将对象的key大写**

```ts
function transformKeys(obj, ignoreKeys = []) { //需补充ts类型
  const newObj = {}
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (ignoreKeys.includes(key)) {
        newObj[key] = obj[key]
      } else {
        const newKey = capitalizeFirstLetter(key)
        newObj[newKey] = obj[key]
      }
    }
  }
  return newObj
}


function capitalizeFirstLetter(str:string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
```



**22. 深拷贝**

```js
/**
 * 深拷贝
 * @template T
 * @param {T} obj 
 * @param {*} map 
 * @returns {T}
 */
export function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (map.has(obj)) return map.get(obj);
  
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Map) return new Map(Array.from(obj, ([key, val]) => [deepClone(key), deepClone(val)]));
  if (obj instanceof Set) return new Set(Array.from(obj, (val) => deepClone(val)));
  
  const objClone = Array.isArray(obj) ? [] : {};
  
  map.set(obj, objClone);
  
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      objClone[key] = deepClone(obj[key], map);
    }
  }
  
  return objClone;
}
```



**23. 对象&数组遍历**

```typescript
/**
* @param {Object} obj 数组&对象
* @param {(...params: any[]) => void} callback 回调函数
*/
function forEachObj(obj: Object, callback: (...params: any[]) => void) {
  if (!obj) return
  if (Array.isArray(obj)) {
    obj.forEach((item, index, obj) => callback(item, index, obj))
  } else {
    Object.keys(obj).forEach((key, index) =>{callback(obj[key], key, index, obj)})
  }
}
```



**24. 封装await不抛出错误 noErrorAwait**

```typescript
async function noErrorAwait(f: () => Promise<any>){
  try {
    const res = await f()
    return {flag: true, data: res}
  } catch(e){
    return {flag: false, data:e}
  }
}
```

实际使用中，以下请求执行时并非按照顺序执行：

```typescript
const js = noErrorAwait(requestJS)
const sy = noErrorAwait(requestSY)
const yh = noErrorAwait(requestYH)
```

保证顺序执行，使用 `Generator`函数与`yield`关键字，并进行封装：

```typescript
```



**25. 按指定长度分隔数组，并返回嵌套数组**

```typescript
function splitArrayByLineLen(arr: any[], lineLen:number = 5) {
	const result = []
  for (let i = 0; i < arr.length; i += lineLen) {
    result.push(arr.slice(i, i + lineLen))
  }
  return result
}
```



**26. 类的多继承**

```typescript
function mix<T extends object>(...mixins: (new (...args: any[]) => object)[]): new (...args: any[]) => T {
  class Mix {
    constructor() {
      for (const mixin of mixins) {
        copyProperties(this, new mixin())
      }
    }
  }

  for (const mixin of mixins) {
    copyProperties(Mix, mixin)
    copyProperties(Mix.prototype, mixin.prototype)
  }

  return Mix as new (...args: any[]) => T
}

function copyProperties(target: {}, source: {}) {
  const ignoreKeys: (string|symbol)[] = ['constructor', 'prototype', 'name']
  for (const key of Reflect.ownKeys(source)) {
    if (!ignoreKeys.includes(key)) {
      Object.defineProperty(
        target,
        key,
        Object.getOwnPropertyDescriptor(source, key)
      )
    }
  }
}

// Example
class A {
  static staticMethod() {
    return 'static A'
  }
  instanceMethodA() {
    return 'instance A'
  }
}

class B {
  static staticMethod() {
    return 'static B'
  }
  instanceMethodB() {
    return 'instance B'
  }
}

const Mixed = mix<A & B>(A, B)

const mixedInstance = new Mixed()
Mixed.staticMethod() // 'static B'
mixedInstance.instanceMethodA() // 'instance A'
mixedInstance.instanceMethodB() // 'instance B'
```



**27. 分页器Pagination封装**

```js
import type { PaginationProps } from "ant-design-vue"
import { reactive } from "vue"

export interface PaginationOption extends PaginationProps {
  current?: number
  pageSize?: number
  pageSizeOptions?: (string | number)[]
  total?: number
  callback?: Function
}

export default ({
  current = 1,
  pageSize = 10,
  pageSizeOptions = ['10', '20', '40', '80'],
  total = 0,
  showSizeChanger = false,
  callback
}: PaginationOption) => {
  const pagition = reactive<PaginationOption>({
    total,
    current,
    pageSize,
    pageSizeOptions,
    showSizeChanger,
    showTotal: () => `共${pagition.total}条`,
    onChange(page, pageSize) {
      pagition.current = page
      pagition.pageSize = pageSize
      callback && callback()
    },
    onShowSizeChange(current, pageSize) {
      pagition.current = current
      pagition.pageSize = pageSize
      callback && callback()
    }
  })

  return pagition
}
```



**28. 取消回调任务**

```typescript
export function createCancelTask(asyncTask: (...args: any[]) => Promise<any>) {
  const NOOP = () => {}
  let cancel = NOOP  //  闭包

  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      cancel()  // 首次执行为空函数

      cancel = () => {
        resolve = reject = NOOP  // 第二次将前一次的resolve和reject置为空函数，相当于取消第一次Promiose的回调
      }
      asyncTask(...args).then(resolve).catch(reject)
    })
  }
}

// example
const loadSomething = createCancelTask(async () => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
  return 123
})
```



**29. hexStringToByteArray**

```js
function hexStringToByteArray(hexString) {
  // 去掉可能存在的空格和换行符
  hexString = hexString.replace(/\s+/g, '').toLowerCase();

  // 检查字符串长度是否为偶数
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string length. Length must be even.");
  }

  // 创建字节数组
  const byteArray = new Uint8Array(hexString.length / 2);

  // 遍历字符串，每两个字符转换为一个字节
  for (let i = 0; i < byteArray.length; i++) {
    const byteValue = parseInt(hexString.substr(i * 2, 2), 16);
    byteArray[i] = byteValue;
  }

  return byteArray;
}
```

**30. 防抖函数**

```typescript
/**
 * 防抖函数
 * @example
 * const inputDebounce = debounce(input, 300);
 */
export function debounce<T, A extends any[]>(
  fn: (this: T, ...args: A) => void,
  delay = 300
) {
  let timeout: null | ReturnType<typeof setTimeout> = null;
  return function (this: T, ...args: A) {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    } else {
      // 对第一次输入立即执行
      fn.apply(this, args);
    }
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

**31. SVG缩放自定义指令(Vue)**

::: code-group

```typescript [vDrag.ts]
import type { DirectiveBinding } from 'vue'


interface Position {
  x: number
  y: number
}

interface DragOptions {
  min?: number
  max?: number
}

// 默认配置
const DEFAULT_OPTIONS: Required<DragOptions> = {
  min: 0.5,
  max: 3,
}

export const vDrag = {
  mounted(el: HTMLElement, binding: DirectiveBinding<DragOptions | undefined>) {
    let isDragging = false
    let lastPosition: Position = { x: 0, y: 0 }
    let translate: Position = { x: 0, y: 0 }
    let scale = 1

    const container = el.parentElement
    if (!container) return

    // 合并配置
    const options: Required<DragOptions> = {
      min: binding.value?.min ?? DEFAULT_OPTIONS.min,
      max: binding.value?.max ?? DEFAULT_OPTIONS.max,
    }

    el.style.cursor = 'grab'
    el.style.userSelect = 'none'

    const applyTransform = () => {
      el.style.transform = `translate(${translate.x}px, ${translate.y}px) scale(${scale})`
    }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      lastPosition = { x: e.clientX, y: e.clientY }
      el.style.cursor = 'grabbing'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const dx = e.clientX - lastPosition.x
      const dy = e.clientY - lastPosition.y
      lastPosition = { x: e.clientX, y: e.clientY }

      translate.x += dx
      translate.y += dy

      applyTransform()
    }

    const onMouseUp = () => {
      isDragging = false
      el.style.cursor = 'grab'
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()

      const containerRect = container.getBoundingClientRect()
      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top

      const prevScale = scale
      const deltaScale = e.deltaY > 0 ? -0.1 : 0.1
      scale = Math.min(options.max, Math.max(options.min, scale + deltaScale))

      const scaleRatio = scale / prevScale

      translate.x = (translate.x - mouseX) * scaleRatio + mouseX
      translate.y = (translate.y - mouseY) * scaleRatio + mouseY

      applyTransform()
    }

    // 绑定事件
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    el.addEventListener('wheel', onWheel, { passive: false })

    // 清理
    el.__dragCleanup__ = () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('wheel', onWheel)
    }
  },

  unmounted(el: HTMLElement) {
    el.__dragCleanup__ && el.__dragCleanup__()
  },
}
```



```typescript [dom.d.ts]
// 补充HTMLElement的类型
declare global {
  interface HTMLElement {
    __dragCleanup__?: () => void
  }
}

export {}
```



:::

## JavaScript 数据处理

**1. 对象数组按照指定键名进行去重**

```js
let alarmList = [
  {
    key: 260012,
    value: 260012,
    title: 'CPU占用过高',
    deviceTypeId: 2,
    checked: false
  }
]

// 按照键名`key`进行去重
const uniqueAlarmList = Array.from(
  alarmList.reduce((map, item) => {
    if (!map.has(item.key)) {
      map.set(item.key, item)
    }
    return map
  }, new Map()).values()
)
```



**2. 数组A与数组B值对应，同步进行过滤**

```js
const alarmIds = [1,2,3,4,5]
const alarmTitles = ['Alarm 1', 'Alarm 2','Alarm 3','Alarm 4','Alarm 5']
const alarmList = [
  {key: 2, name: 'Alarm 2'},
  {key: 4, name: 'Alarm 4'}
]

// 提取 alarmList 中的 key 值数组
const validKeys = alarmList.map(alarm => alarm.key)

// 过滤 alarmIds 和 alarmTitles
const filterArr = alarmIds
	.map((id, index) => {
    if (validKeys.includes(id)) {
      return {id, title: alarmTitles[index]}
    }
    return null
  })
	.filter(item => item !== null)

// 将过滤结果分解
filterArr.map(item => item.id) // [2,4]
filterArr.map(item => item.title) // ['Alarm 2', 'Alarm 4']
```



**3. Vue2 mixin 事件传递**

::: code-group

```vue [Main.vue]
<script>
import mixin from './mixin'
export default {
  name: 'alarm-parameter-set',
  mixins: [mixin],
  mounted() {
    this.$on("vitrual-check-change", (...params) => {
      // ...
    })
  }
}
</script>
```

```vue [Item.vue]
<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  props: {
    source: {
      type: Object,
      default: () => {}
    }
  }
  methods: {
    onChange(e) {
      this.dispatch(
        'alarm-parameter-set',
        'virtual-check-change',
        this.source.value,
        this.source.title,
        e.target.checked
      )
    }
  }
}
</script>
```

```js [mixin.js]
export default {
  methods: {
    dispatch(componentName, eventName, ...rest) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name
      
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        if (parent) name = parent.$options.name
      }
      
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(rest))
      }
    }
  }
}
```



:::

**4. 解析16进制报文**

```javascript
function hexStringToByteArray(hexString) {
  // 去掉可能存在的空格和换行符
  hexString = hexString.replace(/\s+/g, "").toLowerCase()
  
  // 检查字符串长度是否为偶数
  if (hexString.length % 2 !== 0) {
    throw new Error("Invalid hex string length. Length must be even.");
  }
  
  // 创建字节数组
  const byteArray = new Uint8Array(hexString.length / 2)
  
  // 遍历字符串，每两个字符转换为一个字节
  for (let i = 0; i < byteArray.length; i++) {
    const byteValue = parseInt(hexString.subStr(i * 2, 2), 16)
    byteArray[i] = byteValue
  }
  return byteArray
}

// ------------- example -----------
import protoRoot from "@/proto/proto"
const hexStr = "080210850418002002280130a08d0638364000480050c1d2941058a0b70960c1d2941068cde4017081d6941078e8fb03800100880106900101980100a00100a80100b00100b80100c00100c80104d001ff01d801ff01e001ff01e801ff01";

const buffer = hexStringToByteArray(hexStr)

const responseProto = protoRoot.lookupType("MSS.CC2MMI.TrainInfo")

const obj = responseProto.decode(buffer)

console.log("obj", obj)
```

```js [proto.js]
"use strict";

var $protobuf = require("protobufjs/light")

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root())).addJSON({
  // ... your proto rules
})

module.exports = $root
```

