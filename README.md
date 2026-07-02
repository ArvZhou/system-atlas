# 系统图谱

一个基于 Next.js + Three.js 的 Web 知识点网站，用于把前端、后端、数据库、网络、基础设施、问题与方案组织成可浏览的系统图谱。

## 快速开始

```bash
npm install
npm run dev
```

打开本地开发地址后，默认进入图谱主页；右上角可以切换系统 / 问题 / 方案视图，并进入面试页。

## 功能

- 3D 知识图谱浏览
- 节点搜索与路径聚焦
- 节点详情、权衡、跨节点关联
- 面试题浏览、填写与 Markdown 导出

## 文档

- [项目文档](docs/README.md)
- [内容模型](docs/content-model.md)
- [AI 约定](.ai/project.md)

## 脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 生产构建
- `npm run lint` - 代码检查

## 内容组织

知识数据位于 `data/`，由 `lib/graph-data.ts` 组合为总图。

`id` 保持英文用于内部引用，`title`、`description`、`systemRole`、`problemSolved` 和 `tradeOffs` 使用中文展示。
