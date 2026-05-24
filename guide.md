# Liclo's Docs

::: tip
这里不再只是零散笔记，而是一个持续整理中的前端知识库。
:::

## 这个文档库现在怎么读

当前内容已经覆盖前端基础、浏览器能力、框架实践、工程化以及文档站维护。为了让阅读路径更清晰，建议先按“知识域”而不是按“文件夹名字”来理解整个站点。

### 1. 基础核心

适合回顾长期稳定、可反复复习的前端基础知识。

- HTML：[HTML](/基础核心/HTML/html)
- CSS：[样式与布局](/基础核心/CSS/样式&布局)、[现代 Web 布局](/基础核心/CSS/现代Web布局)、[Grid 布局](/基础核心/CSS/Grid布局)
- JavaScript：[JavaScript](/基础核心/JavaScript/JavaScript)、[Promise](/基础核心/JavaScript/Promise)、[ESModule](/基础核心/JavaScript/ESModule)
- TypeScript：[TypeScript](/基础核心/TypeScript/TypeScript)

### 2. 浏览器与通信

适合查阅浏览器运行时能力、请求方式和实时通信方案。

- HTTP：[HTTP 基础](/浏览器与通信/HTTP/http)、[基本请求方式](/浏览器与通信/HTTP/基本请求方式)
- 浏览器能力：[IndexedDB](/浏览器与通信/浏览器能力/IndexedDB)、[Web Worker](/浏览器与通信/浏览器能力/WebWorker)、[Speech API](/浏览器与通信/浏览器能力/SpeechAPI)
- 实时通信与消息通道：[websocket 封装](/实践案例与封装/请求与通信封装/封装websocket)、[Socket.IO](/实践案例与封装/请求与通信封装/封装SocketIO)、[SSE](/实践案例与封装/请求与通信封装/封装SSE)

### 3. 框架与应用

适合按框架体系阅读语法、组件、状态管理与业务实践。

- Vue：[Vue](/框架与应用/Vue/Vue)、[Vue 业务实践](/实践案例与封装/业务方案/Vue业务)、[自定义组件](/实践案例与封装/UI与组件/VueComponent)
- React：[React Component](/框架与应用/React/1_React-Component)、[React Hooks](/框架与应用/React/5_React-Hooks)、[React TypeScript](/框架与应用/React/6_React-TypeScript)
- 小程序：[Weapp](/框架与应用/微信小程序/Weapp)

### 4. 工程化与交付

适合查阅协作开发、项目环境、依赖管理与交付流程。

- [Git](/工程化与交付/协作与环境/Git)
- [Node](/工程化与交付/协作与环境/node)
- [Project / pnpm](/工程化与交付/协作与环境/Project)
- [VitePress 记录](/文档站与知识库维护/VitePress)

### 5. 实践案例与封装

这一部分主要沉淀项目里可复用的方案，而不是概念科普。

- 请求封装：[Axios 封装](/实践案例与封装/请求与通信封装/封装axios)
- 通信封装：[BroadcastChannel](/实践案例与封装/请求与通信封装/封装BroadcastChannel)、[SSE](/实践案例与封装/请求与通信封装/封装SSE)
- 组件与业务案例：[Vue 自定义组件](/实践案例与封装/UI与组件/VueComponent)、[Vue 业务实践](/实践案例与封装/业务方案/Vue业务)

## 当前文档整理方案

完整的重构思路、文章重分类建议、后续新增内容的归档规则，见：

- [文档重构方案](/文档重构方案)

## 后续新增内容的放置原则

新增一篇文章时，优先判断它属于哪一类：

- 原理型：放进“基础核心 / 浏览器与通信 / 框架与应用”
- 实践型：优先放进“实践案例与封装”
- 工程型：放进“工程化与交付”
- 站点维护型：放进“文档站与知识库维护”
- 零散备忘型：先收敛到补充区，成熟后再升级为正式分类

## 这份文档库接下来适合扩展什么

在现有内容基础上，后续最值得继续补全的方向有：

- Vue 3 组合式 API、状态管理、路由与工程实践
- React 18/19、Server Components、性能优化与数据获取
- 前端工程化：构建、Lint、测试、Monorepo、CI/CD
- 浏览器专题：缓存、渲染、存储、多线程、媒体能力
- 部署专题：GitHub Pages、Vercel、Nginx、Docker
- 文档站维护：导航设计、内容模板、自动化发布
