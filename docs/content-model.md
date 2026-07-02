# 内容模型

## 节点结构

每个节点都遵循 `lib/types.ts` 里的 `Node` 结构：

- `id`: 稳定的内部标识
- `title`: 展示标题
- `type`: `root | domain | concept | problem | solution`
- `description`: 简述
- `systemRole`: 在系统中的位置
- `problemSolved`: 解决了什么问题
- `tradeOffs`: 主要权衡
- `children`: 子节点
- `tags`: 搜索标签
- `links`: 跨节点关联

## 内容分层

- `root`：总入口，例如 `web-system`
- `domain`：领域划分，例如前端、后端、数据库
- `concept`：概念层，例如缓存、一致性、浏览器原理
- `problem`：问题空间里的故障与症状
- `solution`：问题空间对应的方案

## 目录约定

- `data/system/`：系统领域树
- `data/problems/`：问题树
- `data/solutions/`：方案树
- `data/interview/interview-bank.json`：面试页使用的题库
- `data/interview/interview-answers.json`：面试页使用的答案数据

## 搜索与关联

- 主页搜索会读取 `title`、`description`、`tags`、`problemSolved`、`systemRole`
- `links` 用于建立跨节点边，必须指向已有 `id`
- 主页会根据模式过滤节点可见性，所以问题和方案节点要写清标签

## 面试题生成

`scripts/generate-interview-bank.mjs` 会扫描按编号命名的 Markdown 文件，把一级题目导出成 JSON。

- 文件名格式：`01-前端基础.md`
- 章节标题：`##`
- 小节标题：`###`
- 题目格式：数字列表，例如 `1. ...`

生成后写入 `data/interview/interview-bank.json`，面试页和详情面板都会读取它。
答案内容单独放在 `data/interview/interview-answers.json`，这样后续迁移到数据库时只需要替换数据源。
