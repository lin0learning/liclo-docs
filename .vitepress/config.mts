import { defineConfig } from 'vitepress'
import { title, description, docsVersion } from './meta.ts'
import sidebar from './sidebar.ts'
import socialLinks from './links.ts'

export default defineConfig({
  base: '/liclo-docs/',

  title,
  description,

  lastUpdated: true,

  themeConfig: {
    logo: './logo.svg',
    outline: {
      level: 'deep',
      label: '导航栏',
    },
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '归档',
    nav: [
      {
        text: '开始',
        items: [
          { text: '文档导读', link: '/guide' },
          { text: '文档重构方案', link: '/文档重构方案' },
        ]
      },
      {
        text: '基础核心',
        items: [
          { text: '总览', link: '/基础核心' },
          { text: 'HTML', link: '/基础核心/HTML/html' },
          { text: 'CSS', link: '/基础核心/CSS/样式&布局' },
          { text: 'JavaScript', link: '/基础核心/JavaScript/JavaScript' },
          { text: 'TypeScript', link: '/基础核心/TypeScript/TypeScript' }
        ]
      },
      {
        text: '浏览器与通信',
        items: [
          { text: '总览', link: '/浏览器与通信' },
          { text: 'HTTP', link: '/浏览器与通信/HTTP/http' },
          { text: 'Web Worker', link: '/浏览器与通信/浏览器能力/WebWorker' },
          { text: 'IndexedDB', link: '/浏览器与通信/浏览器能力/IndexedDB' },
        ]
      },
      {
        text: '框架与应用',
        items: [
          { text: '总览', link: '/框架与应用' },
          { text: 'Vue', link: '/框架与应用/Vue/Vue' },
          { text: 'React', link: '/框架与应用/React/1_React-Component' },
          { text: '微信小程序', link: '/框架与应用/微信小程序/Weapp' },
        ]
      },
      {
        text: '工程化与交付',
        items: [
          { text: '总览', link: '/工程化与交付' },
          { text: 'Git', link: '/工程化与交付/协作与环境/Git' },
          { text: 'Node', link: '/工程化与交付/协作与环境/node' },
          { text: 'Project', link: '/工程化与交付/协作与环境/Project' },
          { text: 'VitePress', link: '/文档站与知识库维护/VitePress' },
        ]
      },
      {
        text: '实践与维护',
        items: [
          { text: '实践案例与封装', link: '/实践案例与封装' },
          { text: '文档站与知识库维护', link: '/文档站与知识库维护' },
          { text: 'Axios 封装', link: '/实践案例与封装/请求与通信封装/封装axios' },
          { text: 'Vue 业务实践', link: '/实践案例与封装/业务方案/Vue业务' },
        ]
      }
    ],
    sidebar,
    socialLinks
  },
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/liclo-docs/favicon.ico' }]
  ],
  markdown: {
    image: {
      lazyLoading: true // 图片懒加载
    }
  }
})
