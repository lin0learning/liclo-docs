# 主流时间库`dayjs`与`moment`横向对比

## Momentjs

- 解决解析问题和格式化问题
  ```js
  const date = moment('2024-07-12')
  date.format()  // 2024-07-12T00:00:00+08:00
  date.toArray() // [2024, 7, 12, 0, 0, 0, 0]，注：月份的起始数为0
  date.toJSON()  // 2024-07-12T16:00:00.000Z
  ```

- **包体积大**：Momentjs 包体积庞大，接近300kb，且基于 OOP (Object Oriented Programming)设计，使用时需先引入 moment 对象，再使用对象中的方法，导致无法通过 tree-shaking，引用后会打包所有方法。

- **时间对象可变**(mutable)：对时间对象的计算操作会改变对象本身，通常需要拷贝后操作。

  ```js
  const startDate = moment(); // Sun Oct 23 2022 23:11:34 GMT+0800
  const endDate = startDate.add(1, 'year'); // Mon Oct 23 2023 23:11:34 GMT+0800
  console.log(startDate === endDate);   // true
  ```

目前 moment.js 已经停止维护。对于项目希望更换时间库，可以安装 `eslint-plugin-you-dont-need-momentjs` 来获取提示帮助升级：

```json [package.json]
"extends" : ["plugin:you-dont-need-momentjs/recommended"]
```





## Dayjs

Moment.js 的轻量化方案，拥有同样强大的 API，但包体积只有 6.5KB。

- <font color="red">不可变（Immutable）</font>
- 体积小。为了减小体积，day.js 将一些复杂功能抽离到插件中，使用时需额外引入
- 拥有和 MomentJS 相同的 API，迁移成本低。



## 常用用法

1. 引入中文

```js
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
```

2. 设置当日开始和结束时间段
   ```js
   const defaultTime = [dayjs().startOf('day'), dayjs().endOf('day')]
   ```

3. 获取指定以前日期
   ```js
   const startTime = dayjs().substract(30, 'days')
   ```

4. 解析今日、本周、本月、本季、本年
   ```js
   dayjs().startOf('day')
   dayjs().startOf('week')
   dayjs().startOf('month')
   dayjs().startOf('quarter')
   dayjs().startOf('year')
   ```

   