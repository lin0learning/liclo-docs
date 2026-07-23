# Agent 开发

## AGENTS.md

标准版 AGENTS.md 模板（适合大多数项目）：

```markdown
你是AGENTS.md生成专家，基于GitHub Top 10开源项目（AutoGPT、Transformers、LangChain、Dify等）的最佳实践，为我的项目生成专业的AGENTS.md配置文件。

## 生成要求

### 核心原则
1. **具体胜过抽象** - 提供具体命令而非模糊描述
2. **可执行性优先** - 每个命令都能直接运行
3. **突出项目特色** - 重点说明项目独特的约定和工具

### 必须包含
- **项目概述**：项目类型、核心功能、技术栈、架构说明
- **开发命令**：安装、启动、测试、构建、检查的具体命令（带包管理器）
- **项目结构**：核心目录说明，重要模块职责
- **代码规范**：命名约定、风格要求、项目特有的编码标准
- **测试策略**：测试框架、运行命令、覆盖率要求

### 格式规范
- 使用Markdown格式
- 命令使用代码块标注，如 `npm install`
- 重要提示使用加粗，如 **关键**
- 严重警告使用 ⚠️ 标记
- 目录结构使用代码块展示

### 质量标准
✅ 优秀实践：
- 具体命令：`pytest tests/` 而非 "运行测试"
- 清晰结构：按重要性排序，常用信息在前
- 项目特色：明确说明与其他项目不同的地方

❌ 避免问题：
- 模糊表述："遵循良好规范"、"确保代码质量"
- 通用内容：千篇一律的模板文字
- 过度复杂：冗长说明和深层嵌套

## 我的项目信息

[在这里粘贴你的项目信息：
- 项目类型和主要功能
- 技术栈（语言、框架、数据库）
- package.json、requirements.txt等配置文件
- 项目特有的工具和约定]

## 输出格式

请直接生成AGENTS.md文件内容，从 `# AGENTS.md` 标题开始。

```



## Codex 代码审查

推荐流程

1. 在 Codex Desktop 打开指定仓库

2. 确保本地拿到远端最新合并结果：
```bash
git fetch --all --prune
git status -sb
git branch --show-current
```

3. 明确要审查的 diff 范围
    如果是审查某个合并分支相对目标分支的整体改动，常用：
```powershell
git diff origin/main...HEAD
```
如果是审查一个已经产生的 merge commit，例如 `MERGE_SHA`，并想看“这次合并落到目标分支上的最终变化”，用：
```powershell
git diff MERGE_SHA^1..MERGE_SHA
```
如果重点是冲突解决本身，也可以补充看：
```powershell
git show --cc MERGE_SHA
```

4. 在 Codex Desktop 当前线程里直接发类似这段：
```text
请对当前项目做一次指定合并审查。

审查范围：
- 目标分支：origin/main
- 合并结果：HEAD
- diff 使用：git diff origin/main...HEAD

要求：
1. 按 code review 方式输出，优先列出 bug、回归风险、遗漏测试、类型问题、运行时风险。
2. 结合本仓库 AGENTS.md 的规范，特别注意 Vue3/TypeScript/Vite/Pinia/Element Plus、配置加载、WebSocket/Protobuf、监控页面分层约定。
3. 不要修改代码，只审查。
4. 输出中文审查报告。
5. 每个问题给出严重级别、文件路径、行号、原因、建议修复方式。
6. 最后列出建议运行的验证命令：pnpm lint:check、pnpm type-check、pnpm exec vitest run 等。
```
如果已经 merge commit，可以把审查范围改成：
```text
审查范围：
- merge commit：<MERGE_SHA>
- diff 使用：git diff <MERGE_SHA>^1..<MERGE_SHA>
- 冲突解决补充检查：git show --cc <MERGE_SHA>
```

报告建议格式
```text
# 合并审查报告

## 高风险问题
- [P1] 文件:行号
  问题：
  影响：
  建议：

## 中低风险问题
...

## 冲突解决重点检查
...

## 测试与验证建议
...

## 总结
...
```

## MCP Server
> MCP(Model Context Protocol) is a protocol for communicating with models that support context.

[参考文档](https://www.anthropic.com/news/mcp)

```python
from mcp.server.fastmcp import FastMCP

server = FastMCP()

@server.tool
def add(a: int, b: int) -> int:
    return a + b
```

主流 Agent 框架都支持 MCP Server，如：
- [LangChain](https://www.langchain.com/mcp)
- [OpenAI](https://www.openai.com/mcp)
- [Anthropic](https://www.anthropic.com/mcp)
- [Google](https://www.google.com/mcp)
- [Microsoft](https://www.microsoft.com/mcp)
- [Amazon](https://www.amazon.com/mcp)
- [IBM](https://www.ibm.com/mcp)
- [Oracle](https://www.oracle.com/mcp)
- [SAP](https://www.sap.com/mcp)
- [Salesforce](https://www.salesforce.com/mcp)


日常开发使用 MCP Server 可以大大提高开发效率，如：
- 获取外部数据
- 执行外部任务
- 执行外部计算
- 连接数据库

软件开发必备 MCP ：
- Codegraph
- blender
- antd
- node_repl
- ffmpeg
- chrome-devtools
- dbx-app（需配合 DBX）





## Codex 子代理

**并行处理**

当任务可以分解为独立的部分时，子代理可以并行工作：

```text
任务：审查整个代码库
- 子代理1：审查 src/auth/ 目录
- 子大力2：审查 src/api/ 目录
主代理：汇总结果
```

**顺序处理**

当任务有依赖关系时，子代理按顺序工作：

```text
任务：实现新功能
  - 子代理1：创建数据模型
    - 子代理2：创建API端点
       - 子代理3：编写测试
```





## Workflow

**最适合你的主流程**

1. **`grill-with-docs`**
   用在 PRD 还比较产品化、边界不清的时候。它会把需求追问成更工程化的上下文，比如权限、状态流、异常、角色、数据归属。
   适合你说的“PRD 转开发语言时前后端表现不一致”。

2. **Speckit 流：`speckit-specify` → `speckit-clarify` → `speckit-plan` → `speckit-tasks` → `speckit-analyze`**
   这是这个项目里最值得用的“翻译器”。
   建议把 PRD 先落成：

   - `spec.md`：用户故事、业务规则、验收标准
   - `plan.md`：技术方案、前后端边界
   - `contracts/`：OpenAPI / DTO / 权限契约
   - `tasks.md`：按前端、后端、联调切成可执行任务

   其中 `speckit-analyze` 很关键，它能专门检查 spec、plan、tasks 之间有没有漂移。

3. **`to-prd` / `to-issues`**
   如果功能较大，不要让一个会话从 PRD 一路写到联调。
   推荐：先用 `to-prd` 固化需求，再用 `to-issues` 拆成独立 issue。每个 issue 单独开上下文实现，效率和一致性会明显好很多。

4. **`prototype`**
   用在“不确定 UI 交互或状态机怎么做”的地方。比如审批流、权限矩阵、表格批量操作、设备状态变更。
   先做一次 throwaway 原型，比在正式前后端里边猜边改快。

5. **`diagnosing-bugs` / `superpowers:systematic-debugging`**
   联调卡住时用这个，不要直接猜 Java 问题。它会强制你走：复现 → 定位边界 → 查请求/响应 → 查 controller/service/data path → 最小修复。

**固定项目内翻译格式**

每个 PRD 功能先生成一张“前后端契约表”：

| 维度     | 前端语言                       | 后端语言                                |
| -------- | ------------------------------ | --------------------------------------- |
| 页面入口 | route / menu / permission meta | controller permission annotation        |
| 用户动作 | button / form / table action   | endpoint / service method               |
| 数据结构 | TS type / API client           | DTO / VO / entity                       |
| 校验     | form rules / disabled states   | request validation / business exception |
| 权限     | route guard / operation code   | permission code / menu seed             |
| 异常     | toast / empty / retry          | error code / message                    |
| 验收     | UI state + network result      | API test / service behavior             |

这张表可以放进 `specs/<feature>/plan.md` 或单独的 `contracts/` 文档里。它会大幅减少“前端以为是 A，后端实现成 B”的情况。



**推荐日常组合**

小需求：

```
`grill-with-docs` → `speckit-specify` → `speckit-tasks` → 实现 → `speckit-analyze`
```

中大型前后端联调：

`grill-with-docs` → `speckit-specify` → `speckit-clarify` → `speckit-plan` → `contracts/OpenAPI` → `speckit-tasks` → 分 issue 实现

Bug 修复：

`diagnosing-bugs` → 查前端请求/后端 controller/service/data path → 最小修复 → 对应验证

Java 学习补强：

用 `teach` 针对项目里的真实代码学，比如：
```text
“用当前 backend 代码教我 Spring Controller → Service → Mapper 的调用链”
```

