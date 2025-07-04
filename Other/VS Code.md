# VS Code 插件列表与个人配置

## 插件列表

**1. 基本插件列表：**
- Chinese Language
- Material Icon Theme
- Image preview
- Auto Rename Tag
- Code Runner
- CodeSpap
- CSS Formatter
- Live Server
- open in browser
- Svg Preview
- Easy LESS
- Markdown All in One
- json2ts
- Sass
- SCSS Formatter
- SCSS IntelliSense
- vscode-proto3
- XML
- i18n Ally

**2. 工程化相关**
- Remote - SSH
- GitLens
- Git Graph
- GitHub Actions
- Project Manager

**3. Vue & React & WeApp**

- Vetur
- Vue - Official
- ES7+ React/Redux/React-Native snippets
- vscode-styled-components
- CSS Modules
- 微信小程序开发工具

**其他**
- ESLint
- Prettier - Code formatter
- Type Challenges
- Path Intellisense


## vs code 配置
```json
{
  "Files": {
    "Auto Save": "off"
  },
  "Editor": {
    "Font Size": 14,
    "Font Family": "'JetBrains Mono',Consolas, 'Courier New', monospace",
    "Tab Size": 2,
    "Render Whitespace": "none"
  }
}
```

光标快速移动到行尾 - 键盘快捷方式-cursorLineEnd - `Ctrl` + `;`

## JSconfig

**`jsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "baseUrl": "./",
    "paths": {
      "@/*": ["./src/*"]
    },
    "moduleResolution": "Node",
    "jsx": "preserve",
    "types": ["vite/client", "ant-design-vue/typings/global"],
    "ignoreDeprecations": "5.0",
    "lib": [
      "ESNext",
      "DOM",
      "DOM.Iterable",
      "ScriptHost"
    ]
  },
  "include": ["src/**/*.js", "src/**/*.jsx", "src/**/*.vue", "types/*.d.ts"],
  "exclude": ["node_modules", "dist"]
}

```