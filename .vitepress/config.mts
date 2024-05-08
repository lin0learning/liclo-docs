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
          { text: '基本请求方式', link: '/HTTP/基本请求方式' }
        ]
      }
    ],
    sidebar,
    socialLinks
  }
})
