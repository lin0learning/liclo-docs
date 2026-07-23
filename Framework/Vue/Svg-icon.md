#  Vite 项目中引入 Svg-Icon全局组件

## 实现说明

### 1. 安装依赖

```bash
pnpm add -D vite-plugin-svg-icons fast-glob
```

### 2. `vite.config.ts`配置 SVG 雪碧图插件

注册 `createSvgIconsPlugin`，指定图标目录为 `src/assets/svg-icon/`，symbolId 格式为 `icon-[name]`。

### 3. 全局组件`src/components/SvgIcon/index.vue`

```vue
<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /**
   * svg 图标名称，对应 src/assets/svg-icon/ 下的 svg 文件（不含 .svg 后缀）。
   * 支持嵌套目录，例如：
   *   - 根目录：    iconClass="example"          -> /svg-icon/example.svg
   *   - 子目录：    iconClass="stationMap/devRoom"
   *                 或 iconClass="stationMap-devRoom"
   *                 -> /svg-icon/stationMap/devRoom.svg
   */
  iconClass: string
  /** 自定义类名，支持普通 class 或 tailwindcss 原子类 */
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
})

const symbolId = computed(() => {
  // 同时兼容 "dir/name" 与 "dir-name" 两种写法
  const normalized = props.iconClass
    .replace(/^\/+|\/+$/g, '') // 去掉首尾斜杠
    .replace(/\//g, '-') // 斜杠转为连字符，匹配 [dir]-[name] 规则
    .replace(/-+/g, '-') // 连字符去重
  return `#icon-${normalized}`
})
</script>

<template>
  <svg aria-hidden="true" class="svg-icon" :class="className">
    <use :xlink:href="symbolId" fill="currentColor" />
  </svg>
</template>

<style scoped>
.svg-icon {
  /* width: 1em; */
  /* height: 1em; */
  width: 20px;
  height: 20px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

```

组件定义了两个 props：

- `iconClass: string` —— 必填，对应 `src/assets/svg-icon/xxx.svg` 的文件名（不含扩展名）
- `className?: string` —— 可选，自定义类名（支持普通 class 或 tailwindcss 原子类）

### 4. `src/main.ts`全局注册

```typescript [main.ts]
// 引入 svg-icon 雪碧图
import 'virtual:svg-icons-register'
// 全局 svg-icon 组件
import SvgIcon from '@/components/SvgIcon/index.vue'

// 全局挂载
app.component('SvgIcon', SvgIcon) 
```

### 5. 类型声明

`env.d.ts` 中补充了 `virtual:svg-icons-register` 模块声明和 `SvgIcon` 的全局组件类型，使模板里使用时也有完整 TS 提示。

```typescript [env.d.ts]
/// <reference types="vite/client" />

declare module 'virtual:svg-icons-register'

declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: (typeof import('@/components/SvgIcon/index.vue'))['default']
  }
}

export {}

```

## 使用示例

将 svg 文件放入 `src/assets/svg-icon/`（例如 `example.svg`），任意 `.vue` 文件中直接使用（无需 import）：

```vue
<template>
  <!-- 基础用法 -->
  <SvgIcon icon-class="example" />

  <!-- 搭配 tailwindcss -->
  <SvgIcon icon-class="example" class-name="w-6 h-6 text-blue-500 hover:text-red-500" />

  <!-- 自定义普通类名 -->
  <SvgIcon icon-class="example" class-name="my-icon" />
</template>
```

>*注意：新增的 svg 图标文件会被 vite-plugin-svg-icons 自动扫描并注入到全局雪碧图中；如果在 dev 已运行时新增图标未生效，需要重启一次 dev server。*

## 嵌套使用

假设如下目录结构：

```
src/assets/svg-icon/
├── example.svg
└── stationMap/
    ├── devRoom.svg
    └── sub/
        └── foo.svg
```

在模板里就能这样用（`SvgIcon` 已全局注册，无需 import）：

```vue
<template>
  <!-- 根目录图标 -->
  <SvgIcon icon-class="example" class-name="w-6 h-6 text-blue-500" />

  <!-- 嵌套目录：推荐用 / 分隔，更直观 -->
  <SvgIcon icon-class="stationMap/devRoom" class-name="w-8 h-8" />

  <!-- 也支持用 - 分隔（等价于上面） -->
  <SvgIcon icon-class="stationMap-devRoom" />

  <!-- 更深层嵌套同样 OK -->
  <SvgIcon icon-class="stationMap/sub/foo" />
</template>
```

## 注意事项

1. 生成的 symbolId 规则（`icon-[dir]-[name]`）：
   - 根目录文件 `example.svg` → `icon-example`
   - 子目录文件 `stationMap/devRoom.svg` → `icon-stationMap-devRoom`
2. 多级目录会被 `-` 拼接。如果你希望目录名里的 `-` 不与分隔符冲突，建议文件夹名使用 camelCase（如 `stationMap` 而不是 `station-map`）。
3. 新增或移动 svg 文件后需要重启 dev server（`vite-plugin-svg-icons` 是在启动时扫描生成雪碧图的，不会热更新文件增删）。