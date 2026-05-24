#### Markdown扩展

VitePress折叠面板：

::: tip

- paragraph

:::



<VideoLink bvId="BV1k8411876y">【编程】新一代浏览器？| Arc 浏览器初体验，越用越爽 B 站视频传送门</VideoLink>

![image-20240201142640307](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402011427899.png)



[B 站 UP 主一百个 Chocolate](https://space.bilibili.com/351534170)

![image-20240201142853553](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402011428611.png)



VitePress 引入组件、ts/js：
```vue
<script setup>
import cssNav from './favorites/css.ts'
import Demo1 from './demo1.vue'
</script>
```



```ts
interface navItem {
  id: string | number
  text: string
  desc?: string
  link: string
  icon?: string
}

const css: navItem[] = [
  {
    id: 1,
    text: 'colorhunt',
    link: 'https://..',
    desc: '...'
  }
  // ...
]
```

```markdown
### CSS
<NavCard :navData=cssNav />
```



![image-20240201143455643](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402011434711.png)





**内嵌iframe**

![image-20240201144227204](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402011442256.png)



```markdown
<iframe src='https://stackblitz.com/edit/container-presentational-pattern?embed=1&file=src/DogImagesContainer.js'></iframe>
```



**代码组合**

![image-20240201144401730](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402011444800.png)

````markdown
::: code-group
```jsx [DogImagesContainer.js]
import React, { useEffect, useState } from 'react'
import DogImages from './DogImages'

function DogImagesContainer() {
  const [dogs, setDogs] = useState([])

  useEffect(() => {
    const fetchFn = () => {
      fetch('https://dog.ceo/api/breed/labrador/images/random/6')
        .then(res => res.json())
        .then(({ message }) => setDogs(message))
    }
    fetchFn()
  }, [])

  return <DogImages dogs={dogs} />
}

export default DogImagesContainer
```

```jsx [DogImages.js]
import React from 'react'

export default function DogImages({ dogs }) {
  return dogs?.map((dog, i) => <img src={dog} key={i} alt="Dog" />)
}
```
:::
````



**Emoji**

:tada: :100: :1234:

[所有支持的 emoji 列表。](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs)



**自定义容器**

输入：

```markdown
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

输出：

![image-20240202093327596](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402020933833.png)

自定义容器支持自定义标题，在容器的 "type" 之后附加文本来设置自定义标题。

````markdown
::: details 点我查看代码
```js
console.log('VitePress')
```
:::
````



**Github 风格的警报**

```markdown
> [!NOTE]
> xxx
```



**代码块中实现行高亮**

输入

```
```js{4}
export default {
	data() {
		return {
			msg: 'Highlighted'
		}
	}
}
```

输出

![image-20240202095922218](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402020959293.png)

除了单行之外，还可以指定多个单行、多行等：

- 多行：例如 `{5-8}`、`{3-10}`、`{10-17}`
- 多个单行：例如 `{4,7,9}`
- 多行与单行：例如 `{4,7-13,16,23-27,40}`

也可以使用`// [!code heightlight]`注释实现行高亮。



**代码块中聚焦**

在某一行上添加 `// [!code focus]` 注释将聚焦它并模糊代码的其他部分。此外，可以使用 `// [!code focus:<lines>]` 定义要聚焦的行数。

输入

````
```js
export default {
  data () {
    return {
      msg: 'Focused!' // [!code focus]
    }
  }
}
```
````

输出

![image-20240202100156735](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402021001797.png)



**代码块中的颜色差异**

在某一行添加 `// [!code --]` 或 `// [!code ++]` 注释将会为该行创建 diff，同时保留代码块的颜色。

输入

````
```js
export default {
  data () {
    return {
      msg: 'Removed' // [!code --]
      msg: 'Added' // [!code ++]
    }
  }
}
```
````

输出

![image-20240202100614535](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402021006559.png)



代码行注释用法：

- `// [!code highlight]`
- `// [!code focus]`
- `// [!code --]`
- `// [!code ++]`
- `// [!code error]`
- `// [!code warning]`



**代码组**

````markdown
::: code-group
```js [config.js]
export default defineConfig({}) {}
```

```ts [config.ts]
import type {UserConfig}} from 'vitepress'
const config:UserConfig = {}
```
:::
````



#### YAML frontmatter

frontmatter 必须位于 Markdown 文件的顶部 (在任何元素之前，包括 `<script>` 标签)，并且需要在三条虚线之间采用有效的 YAML 格式。例如：

```markdown
---
title: Docs with VitePress
editLink: true
---
```



#### 在 Markdown 中使用Vue

```html
---
hello: world
---

<script setup>
import {ref} from 'vue'
const count = ref(0)

## Markdown Content
The count is: {{count}}
<button :class='$style.button' @click="count++">Increment</button>
</script>
<style module>
.button {
  color: red;
  font-weight: bold
}
</style>
```

![image-20240202110835704](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402021108767.png)



**使用组件**

```markdown
<script setup>
import CustomComponent from '../../components/CustomComponent.vue'
</script>

# Docs
<CustomComponent />
```

