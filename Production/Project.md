# Project dev

## pnpm

### 优点：

- 采用硬链接和软链接的方式进行依赖包的管理，硬链接共享同一份硬盘地址，软连接相当于快捷方式，其不占用资源；
- 安装的包在`.pnpn sotre`中，通过软链接到这个仓库，为非扁平化方式。

使用如下命令查看pnpm store的位置：

```bash
pnpm store path
```

### pnpm常用命令：

```bash
pnpm add/install/uninstall/remove xxx
pnpm link
pnpm rebuild
pnpm update
```

![图像](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202304142127987.jpeg)



### monorepo使用

1. 在根目录下`pnpm init`创建`package.json`
2. 在根目录下创建`pnpm-workspace.yaml`文件
3. 对`.yaml`文件进行配置

```yaml
packages:
  # all packages in direct subdirs of packages/
  - 'packages/*'
  # all packages in subdirs of components/
  - 'components/**'
  # exclude packages that are inside test directories
  - '!**/test/**'
```

4. 在根目录下安装依赖

5. 在根目录下运行子应用
   pnpm支持filter，Selectors may be specified via the `--filter` (or `-F`) flag:

   ```bash
   pnpm --filter <package_selector> <command>
   ```

6. 子模块复用





## package 幽灵依赖

幽灵依赖 — 项目的`dependencies`中依赖`ant-design-vue`，由于"ant-design-vue"依赖了`lodash`和`dayjs`(devDenpendencies)，且不是开发依赖，

- 如果在项目中间接引入`lodash`和`dayjs`，在build后不会报错，

- 如果`ant-design-vue`是以`devDenpencies`开发依赖`lodash`和`dayjs`，则项目在build后会出现错误。



## webpack - 局域网IP配置

项目本地和局域网访问。

![image-20240305150337540](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202403051503605.png)

一、在 `config/index.js`文件的dev属性修改：

```js
module.exports = {
  dev: {
    // ...
    host: '0.0.0.0',
    port: 8081
  }
}
```

二、在`package.json`中添加

```json
{
  "script": {
    "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js --host 0.0.0.0"
  }
}
```

三、修改`webpack.dev.config.js`

```js
module.exports = new Promise((resolve, reject) => {
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      process.env.PORT = port
      devWebpackConfig.devServer.port = port
      
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [
            `App running at: `,
            `Local: http://localhost:${port}`,
            `Netword: http://${require('ip').address()}:${port}`,
          ],
        },
      }))
      
      resolve(devWebpackConfig)
    }
  })
})
```



## webpack 智能提示

通过导入webpack Configuration配置类型来获得 IDE intelligence

```js
/**
* @type {import('webpack'.Configuration)}
*/
module.exports = {
  //
}
```



## webpack history路由配置

`devServer.historyApiFallback`

```js
module.exports = {
  //...
  output: {
    //...
    publicPath: "/"
  },
  devServer: {
    historyApiFallback: true, // 默认配置  404重定向
    historyApiFallback: {     // 具体rewrite
      rewrites: [
        { from: /.*/g, to: "/index.html" }
      ]
    }
  }
}
```





## webpack 搭建vue3项目

文章链接：[webpack搭建vue3项目](https://www.jianshu.com/p/0605989c8b4e)

1. 打包压缩
2. 热更新
3. 编译ES6+使兼容主流浏览器
4. 安装vue
5. 支持编译scss
6. css分离打包
7. 固定模块单独打包
8. css3兼容处理
9. 响应式单位处理
10. 静态资源处理
11. 接口代理
12. 多页面开发



## 从 webpack 迁移到 Vite

- Vite只支持现代浏览器(ES6 module)，所以不需要`babel`、`core-js` 等其相关依赖；
- 在`.vue`文件中使用`require()`导入的图片等资源，可以替换成`import()`；
- 添加 `.vue` 等文件拓展名以支持 SFC，不建议省略自定义导入类型，它可能会干扰 IDE 和类型支持：

```js
// vite.config.js
export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  }
})
```

- Vite 不能正确的分析动态导入

```js
/** previous in webpack */
component:() => import(`@pages${component}.vue`)

/** vite */ 
const modules = import.meta.glob("../pages/**/**.vue")
component: modules[`../pages${component}.vue`]
```



## Proxy代理

常见浏览器跨域警告：`XMLHttpRequest at 'http://192.168.0.222:8080/login' from origin 'http://localhost:3030' cors`，可配置 Proxy 前端代理

```js
// axios
axios.defaults.baseURL = "/api"

// vite.config.js
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.222:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```



## Webpack 简洁终端输出

```js
// webpack.config.js
const WebpackBar = require("webpackbar")

/**
 * @type {import('webpack'.Configuration)}
 */
module.exports = {
  stats: {
    all: false,
    errors: true
  },
  plugins: [
    new WebpackBar({
      color: '#85d',
      basic: false,
      profile: false
    })
  ]
}
```



## Vite 构建项目并接入微前端(qiankun)

文档链接：[Vite 构建项目并接入微前端(qiankun)](https://everfind.github.io/posts/2022/01/13/vite-and-microfrontend.html#%E5%9F%BA%E7%A1%80%E9%85%8D%E7%BD%AE)



## Prettier & ESLint

**Prettier**

开箱即用，安装 VS Code Prettier并配置` Code formatter`

```json
// .prettierrc
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "arrowParens": "always"
}
```

要解决代码换行困难的问题(`printWidth`)，推荐使用 Antfu 的 eslint 配置：

[why not prettier](https://antfu.me/posts/why-not-prettier-zh)、[eslint-config](https://github.com/antfu/eslint-config)

**ESLint**

Wizard - CLI tool

```bash
npx @antfu/eslint-config@latest
```

Install

```bash
npm i -D eslint @antfu/eslint-config
```

Config file

```js
// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu()
```

Add script for package.json

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```



VS Code support  (auto fix)

`.vscode/settings.json`:

```json
{
  // Enable the ESlint flat config support
  "eslint.experimental.useFlatConfig": true,

  // Disable the default formatter, use eslint instead
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // Silent the stylistic rules in you IDE, but still auto fix them
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off" },
    { "rule": "format/*", "severity": "off" },
    { "rule": "*-indent", "severity": "off" },
    { "rule": "*-spacing", "severity": "off" },
    { "rule": "*-spaces", "severity": "off" },
    { "rule": "*-order", "severity": "off" },
    { "rule": "*-dangle", "severity": "off" },
    { "rule": "*-newline", "severity": "off" },
    { "rule": "*quotes", "severity": "off" },
    { "rule": "*semi", "severity": "off" }
  ],

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml",
    "toml"
  ]
}
```

