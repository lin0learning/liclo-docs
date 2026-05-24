# Node日常使用



## 判断路径是文件还是文件夹

- isFile()：检测是否为常规文件
- isDirectory()：检测是否为文件夹



## Node.js 大前端领域应用

1. **服务端开发**：Node.js 提供了一个基于事件驱动的、非阻塞式的 I/O 模型，能够轻松构建高性能的服务器端应用程序，进而可以在服务端进行编程；
2. **构建RESTful API**：Express、Koa、Next.js；
3. **前端构建工具**：Webpack、Parcel、Gulp、Vite等，可帮助开发者优化前端项目的开发流程、代码打包、资源压缩等工作；
4. **实时应用程序**：处理大量并发连接，实现数据双向通信；
5. **中间件开发**
6. **npm** 及 **package.json**
7. **编写命令行工具**



## `npm i` 与 `npm ci`

`npm i`用于安装/更新项目依赖，但在 NPM v6 版本后，更推荐使用 `npm ci`



**`npm i` 与 `npm ci`** 的区别

执行 `npm i` 命令后：

- 根据 `package.json` 文件，创建 `node_modules` 文件夹并安装对应的依赖版本；
- 生成/更新 `package-lock.json` 文件。

执行 `npm ci` 命令后：

- 首先删除 `node_modules` 文件夹；
- 依照 `package_lock.json` 文件创建新的 `node_modules` 文件夹并**精准安装对应的依赖版本**。



**`npm i` 不能精准安装依赖**

`package.json` 文件里面的依赖版本往往是一个范围，并不是一个固定的版本，它允许依赖的升级。

:::tip 语义版本控制 semver

软件的版本号通常由版本符号和三个数字组成；

例如版本号：`2.1.3`，其中

- 第一个数字`2`代表主版本号，表示进行了不兼容的更新；
- 第二个数字`1`代表次版本号，表示以向后兼容的方式添加功能的更新；
- 第三个数字`3`代表补丁版本号，表示进行向后兼容的缺陷修复的更新；
- `2.1.3` 指定特定的版本号`2.1.3`；
- `~2.1.3` 当运行 `npm update` 时,会匹配所有 2.1.x 版本，但是不包括 2.2.0；
- `^2.1.3` 当运行 `npm update` 时,会匹配所有 2.x.x 版本，但是不包括 3.0.0；
- `*2.1.3` 当运行 `npm update` 时,会匹配安装最新版本；

:::

## 检测项目中未被使用的依赖

```js
const fs = require("fs");
const path = require("path");

const projectDir = path.resolve("."); // 当前项目目录
const excludeDirs = ["node_modules", ".git", "dist", "public"]; // 应该排除的目录

// 读取并解析package.json
function readPackageJson() {
  const packageJsonPath = path.join(projectDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.error("package.json not found.");
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
}

// 递归遍历目录获取所有文件路径
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      if (!excludeDirs.includes(file)) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

// 检查依赖是否在文件中被引用，包括动态引用
function isDependencyUsed(files, dependency) {
  const regexStaticImport = new RegExp(
    `require\\(['"\`]${dependency}['"\`]|from ['"\`]${dependency}['"\`]`,
    "i"
  );
  const regexDynamicImport = new RegExp(
    `import\\(['"\`]${dependency}['"\`]\\)`,
    "i"
  );
  return files.some((file) => {
    const fileContent = fs.readFileSync(file, "utf8");
    return (
      regexStaticImport.test(fileContent) ||
      regexDynamicImport.test(fileContent)
    );
  });
}

function findUnusedDependencies() {
  const {dependencies} = readPackageJson();
  const allFiles = getAllFiles(projectDir);
  const unusedDependencies = [];

  Object.keys(dependencies).forEach((dependency) => {
    if (!isDependencyUsed(allFiles, dependency)) {
      unusedDependencies.push(dependency);
    }
  });

  return unusedDependencies;
}

const unusedDependencies = findUnusedDependencies();
if (unusedDependencies.length > 0) {
  console.log("未使用的依赖:", unusedDependencies.join(", "));
} else {
  console.log("所有依赖都已使用。");
}
```



## 快速删除node_modules依赖文件夹

> 借助命令行工具 `rimraf`

全局安装`rimraf`

```bash
npm install rimraf -g
```

执行命令删除

```bash
rimraf node_modules
```

重新下载依赖

```bash
npm install
```

> 如果使用的是 `npx`，则无需全局安装 rimraf

```bash
npx rimraf node_modules
```

