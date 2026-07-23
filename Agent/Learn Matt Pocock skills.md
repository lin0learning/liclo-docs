# Learn Matt Pocock skills

> 项目地址：https://github.com/mattpocock/skills

## Install Skills

```bash
npx skills@latest add mattpocock/skills
```

## Setup First

```bash
/setup-matt-pocock-skills
```



## Ask Matt

ask matt what i do first, or how to start?

```text
/ast-matt How do I get started? I want to make some code changes here. What is the main flow I should do?
```





## Base Flow

1. `grill-with-docs`
2. `to-spec`
3. `to-tickets`
4. `implement`
5. `code-review`

如果觉得工作量大，并需要多个智能体并行执行，那么可以跳过 `to-spec` 与 `to-tickets` ，直接进行 `implement`。

## grill with docs

just a blur idea or thoughts to do:

```text
/grill-with-docs what you want to do...
```



## to spec

将当前上下文（包含项目代码、需求改动以及 grill with docs 的所有结论）全部压缩成一个以后可以继续使用的规范文档（通常是 YAML ），功能跟 github 发布的 `Speckit` 类似。

这需要问题追踪器（如 PR, Jira, Issue等），如果是公司项目，通常可选择本地 Markdown 文档作为载体跟踪。





## to tickets

> 产物：`tickets.md`

将 `to-spec` 的结论转变成一个清晰的实施计划，包含多个 ticket。每个 ticket 适合单一上下文窗口或单个智能区（LLM 不超过 16M 的上下文会话）。

执行后，可根据生成的 ticket 进行修改，比如将某几个 ticket 合并，或者整体合并为一个 ticket（可按照需求大小灵活分配）。





## implement

```bash
/implement @tickets.md
```



## code review

避免使用同一智能体上下文去审查它刚生成的代码，推荐 subagent（独立上下文）去执行审查任务，并将结构反馈给主 agent。