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
        text: 'Origin',
        items: [
          { text: 'HTML', link: '/HTML/html' },
          { text: 'CSS', link: '/CSS/样式&布局' },
          { text: 'JavaScript', link: '/JavaScript/JavaScript' },
          { text: 'TypeScript', link: '/TypeScript/TypeScript' }
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'Vue', link: '/Framework/Vue/Vue' },
          { text: 'React', link: '/Framework/React/1_React-Component' },
          { text: '微信小程序', link: '/Framework/MiniProgram/Weapp' },
        ]
      },
      {
        text: '工程化',
        items: [
          { text: 'Git', link: '/Production/Git' },
          { text: 'Node', link: '/Production/node' },
          { text: 'Project', link: '/Production/Project' },
        ]
      },
      {
        text: 'HTTP',
        items: [
          { text: 'HTTP', link: '/HTTP/http' },
          { text: '基本请求方式', link: '/HTTP/基本请求方式' },
          { text: 'Axios 封装', link: '/HTTP/封装axios' },
          { text: 'websocket 封装', link: '/HTTP/封装websocket.md' },
          { text: 'socket.io 封装', link: '/HTTP/封装SocketIO.md' },
          { text: 'BroadcastChannel 封装', link: '/HTTP/封装BroadcastChannel' },
          { text: 'EventSource 封装', link: '/HTTP/封装SSE'}
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
