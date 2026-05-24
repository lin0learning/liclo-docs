import type { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Sidebar | undefined = {
  '/': [
    {
      text: '👋 开始阅读',
      items: [
        { text: '文档导读', link: '/guide' },
        { text: '文档重构方案', link: '/文档重构方案' },
      ]
    },
    {
      text: '📚 基础核心',
      collapsed: false,
      items: [
        { text: '总览', link: '/基础核心' },
        { text: 'HTML', link: '/基础核心/HTML/html' },
        { text: '样式&布局', link: '/基础核心/CSS/样式&布局' },
        { text: 'JavaScript', link: '/基础核心/JavaScript/JavaScript' },
        { text: 'TypeScript', link: '/基础核心/TypeScript/TypeScript' },
      ]
    },
    {
      text: '🌐 浏览器与通信',
      collapsed: false,
      items: [
        { text: '总览', link: '/浏览器与通信' },
        { text: 'HTTP', link: '/浏览器与通信/HTTP/http' },
        { text: '基本请求方式', link: '/浏览器与通信/HTTP/基本请求方式' },
        { text: 'IndexedDB', link: '/浏览器与通信/浏览器能力/IndexedDB' },
        { text: 'Web Worker', link: '/浏览器与通信/浏览器能力/WebWorker' },
        { text: 'MediaRecorder API', link: '/浏览器与通信/浏览器能力/MediaRecorderAPI' },
      ]
    },
    {
      text: '✨ 框架与应用',
      collapsed: false,
      items: [
        { text: '总览', link: '/框架与应用' },
        { text: 'Vue', link: '/框架与应用/Vue/Vue' },
        { text: 'React', link: '/框架与应用/React/1_React-Component' },
        { text: '微信小程序', link: '/框架与应用/微信小程序/Weapp' },
      ]
    },
    {
      text: '🛠️ 工程化与交付',
      collapsed: false,
      items: [
        { text: '总览', link: '/工程化与交付' },
        { text: 'Git', link: '/工程化与交付/协作与环境/Git' },
        { text: 'Node', link: '/工程化与交付/协作与环境/node' },
        { text: 'Project', link: '/工程化与交付/协作与环境/Project' },
        { text: 'VitePress', link: '/文档站与知识库维护/VitePress' },
      ]
    },
    {
      text: '🧩 实践案例与封装',
      collapsed: false,
      items: [
        { text: '总览', link: '/实践案例与封装' },
        { text: 'Axios 封装', link: '/实践案例与封装/请求与通信封装/封装axios' },
        { text: 'websocket 封装', link: '/实践案例与封装/请求与通信封装/封装websocket' },
        { text: 'BroadcastChannel 封装', link: '/实践案例与封装/请求与通信封装/封装BroadcastChannel' },
        { text: 'Vue 业务实践', link: '/实践案例与封装/业务方案/Vue业务' },
      ]
    },
    {
      text: '🗂️ 文档站与知识库维护',
      collapsed: false,
      items: [
        { text: '总览', link: '/文档站与知识库维护' },
        { text: 'guide', link: '/guide' },
        { text: '文档重构方案', link: '/文档重构方案' },
        { text: 'VitePress', link: '/文档站与知识库维护/VitePress' },
      ]
    },
    {
      text: '🛀 工具与补充',
      collapsed: false,
      items: [
        { text: '总览', link: '/工具与补充' },
        { text: 'VS Code', link: '/工具与补充/VS%20Code' },
        { text: 'dayjs & momentjs', link: '/工具与补充/dayjs%20momentjs' },
        { text: '设计模式', link: '/工具与补充/DesignPattern' }
      ]
    }
  ],
  '/基础核心/': [
    {
      text: '基础核心',
      collapsed: false,
      items: [
        { text: '总览', link: '/基础核心' },
        { text: 'HTML', link: '/基础核心/HTML/html' },
        { text: '样式&布局', link: '/基础核心/CSS/样式&布局' },
        { text: '现代 Web 布局', link: '/基础核心/CSS/现代Web布局' },
        { text: 'Grid 布局', link: '/基础核心/CSS/Grid布局' },
        { text: 'JavaScript', link: '/基础核心/JavaScript/JavaScript' },
        { text: 'Promise', link: '/基础核心/JavaScript/Promise' },
        { text: 'TypeScript', link: '/基础核心/TypeScript/TypeScript' },
      ]
    },
  ],
  '/浏览器与通信/': [
    {
      text: '浏览器与通信',
      collapsed: false,
      items: [
        { text: '总览', link: '/浏览器与通信' },
        { text: 'HTTP', link: '/浏览器与通信/HTTP/http' },
        { text: '基本请求方式', link: '/浏览器与通信/HTTP/基本请求方式' },
        { text: 'IndexedDB', link: '/浏览器与通信/浏览器能力/IndexedDB' },
        { text: 'Web Worker', link: '/浏览器与通信/浏览器能力/WebWorker' },
        { text: 'Speech API', link: '/浏览器与通信/浏览器能力/SpeechAPI' },
        { text: 'MediaRecorder API', link: '/浏览器与通信/浏览器能力/MediaRecorderAPI' },
      ]
    },
  ],
  '/框架与应用/': [
    {
      text: '框架与应用',
      collapsed: false,
      items: [
        { text: '总览', link: '/框架与应用' },
        { text: 'Vue', link: '/框架与应用/Vue/Vue' },
        { text: 'Vue Interview', link: '/框架与应用/Vue/vue1' },
        { text: 'React tutorial', link: '/框架与应用/React/0_React-tutorial' },
        { text: 'React Component', link: '/框架与应用/React/1_React-Component' },
        { text: 'React Hooks', link: '/框架与应用/React/5_React-Hooks' },
        { text: '微信小程序', link: '/框架与应用/微信小程序/Weapp' },
      ]
    },
  ],
  '/工程化与交付/': [
    {
      text: '工程化与交付',
      collapsed: false,
      items: [
        { text: '总览', link: '/工程化与交付' },
        { text: 'Git', link: '/工程化与交付/协作与环境/Git' },
        { text: 'Node', link: '/工程化与交付/协作与环境/node' },
        { text: 'Project', link: '/工程化与交付/协作与环境/Project' },
        { text: '文档站维护', link: '/文档站与知识库维护' },
      ]
    },
  ],
  '/实践案例与封装/': [
    {
      text: '实践案例与封装',
      collapsed: false,
      items: [
        { text: '总览', link: '/实践案例与封装' },
        { text: 'Axios 封装', link: '/实践案例与封装/请求与通信封装/封装axios' },
        { text: 'websocket 封装', link: '/实践案例与封装/请求与通信封装/封装websocket' },
        { text: 'Socket.IO', link: '/实践案例与封装/请求与通信封装/封装SocketIO' },
        { text: 'BroadcastChannel 封装', link: '/实践案例与封装/请求与通信封装/封装BroadcastChannel' },
        { text: 'SSE', link: '/实践案例与封装/请求与通信封装/封装SSE' },
        { text: 'Vue 自定义组件', link: '/实践案例与封装/UI与组件/VueComponent' },
        { text: 'Vue 业务实践', link: '/实践案例与封装/业务方案/Vue业务' },
      ]
    },
  ],
  '/文档站与知识库维护/': [
    {
      text: '文档站与知识库维护',
      collapsed: false,
      items: [
        { text: '总览', link: '/文档站与知识库维护' },
        { text: 'guide', link: '/guide' },
        { text: '文档重构方案', link: '/文档重构方案' },
        { text: 'VitePress', link: '/文档站与知识库维护/VitePress' },
      ]
    },
  ],
  '/工具与补充/': [
    {
      text: '工具与补充',
      collapsed: false,
      items: [
        { text: '总览', link: '/工具与补充' },
        { text: 'VS Code', link: '/工具与补充/VS%20Code' },
        { text: 'dayjs & momentjs', link: '/工具与补充/dayjs%20momentjs' },
        { text: '设计模式', link: '/工具与补充/DesignPattern' },
      ]
    },
  ],
}

export default sidebar
