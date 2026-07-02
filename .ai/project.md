# AI 工作约定

## 项目定位

这是一个 Web 知识点网站，不是营销站，也不是通用 CMS。改动时优先保持“图谱浏览 + 节点详情 + 面试题”这三条主线。

## 修改原则

- 优先沿用现有的树状数据结构和组件拆分
- 新增知识点时，先补数据，再补展示
- 不要随意改 `id`，它们被搜索、关联和面试题引用
- `links` 必须是已存在的节点 id
- 新内容尽量补齐 `description`、`systemRole`、`problemSolved`、`tradeOffs`、`tags`

## 内容规则

- `title`、`description`、`systemRole`、`problemSolved`、`tradeOffs` 使用中文
- `id` 保持英文、稳定、可复用
- 问题节点和方案节点要保持“症状 -> 根因 -> 解法”的关系
- 不要为了凑分类而制造重复节点

## 面试题规则

- 修改题库源文件后，重新生成 `data/interview/interview-bank.json`
- 面试题应该围绕节点本身、父节点、子节点和 `links` 展开
- 题目要能追问实现、权衡和失效模式，而不是只问定义

## 代码改动边界

- 主页入口在 `components/system-atlas-app.tsx`
- 3D 图谱在 `components/knowledge-scene.tsx`
- 详情面板在 `components/detail-panel.tsx`
- 面试页在 `components/interview-workbench.tsx`
- 图数据入口在 `lib/graph-data.ts`
- 布局、搜索和路径逻辑在 `lib/graph.ts`

## 交付前检查

- 先看文档和数据是否同步
- 再运行 `npm run lint`
- 涉及交互改动时，确认主页和面试页都还能正常浏览
