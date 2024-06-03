# Javascript 工具函数

**1. 创建 svg 元素**
```js
/**
 * 创建svg tag
 * @param {'svg'|'g'|'path'|'filter'|'animate'|'marker'|'line'|'polyline'|'rect'|'circle'|'ellipse'|'polygon'|'text'} tagName 
 * @param {import('vue').SVGAttributes} [attrs] 
 * @returns {Element}
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