import type { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Sidebar | undefined = {
  '/': [
    {
      text: '👋 开始阅读',
      items: [
        { text: ' Guide', link: '/guide' },
        { text: 'HTML', link: '/HTML/html' },
        { text: '样式&布局', link: '/CSS/样式&布局' },
        { text: 'JavaScript', link: '/JavaScript/JavaScript' },
      ]
    },
    {
      text: '✨ 框架',
      collapsed: false,
      items: [
        { text: 'Vue', link: '/Framework/Vue/Vue' },
        { text: 'React', link: '/Framework/React/1_React-Component' },
        { text: '微信小程序', link: '/Framework/MiniProgram/Weapp' },
      ]
    },
    {
      text: '🎉 工程化',
      collapsed: false,
      items: [
        { text: 'Git', link: '/Production/Git' },
        { text: 'Node', link: '/Production/node' },
        { text: 'Project', link: '/Production/Project' },
      ]
    }
  ],
  '/CSS/': [
    {
      text: 'CSS',
      collapsed: false,
      items: [
        { text: '样式&布局', link: '/CSS/样式&布局' },
        { text: '现代Web布局', link: '/CSS/现代Web布局' },
        { text: 'Canvas入门', link: '/CSS/Canvas入门' },
        { text: 'Grid布局', link: '/CSS/Grid布局' },
        { text: 'Sass基本用法', link: '/CSS/Sass基本用法' },
      ]
    },
  ],
  '/JavaScript/': [
    {
      text: 'JavaScript',
      collapsed: false,
      items: [
        { text: 'JavaScript', link: '/JavaScript/JavaScript' },
        { text: 'ESModule', link: '/JavaScript/ESModule' },
        { text: 'Promise', link: '/JavaScript/Promise' },
      ]
    },
  ],
  '/TypeScript/': [
    {
      text: 'TypeScript',
      items: [
        { text: 'TypeScript Docs', link: '/TypeScript/TypeScript' },
        { text: '装饰器 Decorator', link: '/TypeScript/Decorator' },
        { text: '发布订阅模式', link: '/TypeScript/Publish-Describe Mode' }
      ]
    }
  ],
  '/Framework/': [
    {
      text: 'Vue',
      collapsed: false,
      items: [
        { text: 'Vue Memo', link: '/Framework/Vue/Vue' },
        { text: 'Vue 业务', link: '/Framework/Vue/Vue业务' },
        { text: 'Vue Interview', link: '/Framework/Vue/vue1' },
      ]
    },
    {
      text: 'React',
      collapsed: false,
      items: [
        { text: 'React tutorial', link: '/Framework/React/0_React-tutorial' },
        { text: 'React Component', link: '/Framework/React/1_React-Component' },
        { text: 'React CSS', link: '/Framework/React/2_React-CSS' },
        { text: 'React Redux', link: '/Framework/React/3_React-Redux(RTK)' },
        { text: 'React Router', link: '/Framework/React/4_React-Router' },
        { text: 'React Hooks', link: '/Framework/React/5_React-Hooks' },
        { text: 'React TypeScript', link: '/Framework/React/6_React-TypeScript' },
      ]
    },
    {
      text: '微信小程序',
      collapsed: false,
      items: [
        { text: 'Weapp Memo', link: '/Framework/MiniProgram/Weapp' },
        { text: 'miniProgram', link: '/Framework/MiniProgram/miniprogram' },
      ]
    }
  ],
  '/HTTP/': [
    {
      text: 'HTTP',
      items: [
        { text: 'HTTP Docs', link: '/HTTP/http' },
        { text: '基本请求方式', link: '/HTTP/基本请求方式' },
        { text: 'Axios 封装', link: '/HTTP/封装axios' }
      ]
    }
  ]
}

export default sidebar