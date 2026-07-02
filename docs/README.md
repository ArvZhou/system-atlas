# 项目文档

## 这是一个什么站点

系统图谱是一个面向 Web 工程知识的可视化站点。它把知识拆成树状节点，再通过跨节点关联把“问题”和“方案”连起来，方便按主题浏览，也方便做面试复习。

## 页面

- `/`：主图谱页面
- `/interview`：面试页，支持选择节点、填写答案、复制或下载 Markdown

## 交互

- 点击节点进入子树或详情
- 搜索框可按标题、标签、问题描述检索
- 主页支持系统 / 问题 / 方案三种模式
- 图谱支持缩放、平移、回退和回到根节点

## 数据流

1. 节点数据放在 `data/system`、`data/problems`、`data/solutions`
2. `lib/graph-data.ts` 把分散数据合成一棵总树
3. `lib/graph.ts` 负责扁平化、搜索、布局和路径计算
4. `components/system-atlas-app.tsx` 负责主页交互
5. `components/interview-workbench.tsx` 负责面试页
6. `data/interview/interview-answers.json` 负责答案数据

## 运行与检查

- 开发：`npm run dev`
- 构建：`npm run build`
- 检查：`npm run lint`

## 更新内容时要注意

- `id` 用英文且保持稳定，跨文件引用都依赖它
- `links` 只能写存在的节点 id
- 新增节点时尽量补齐 `description`、`systemRole`、`problemSolved`、`tradeOffs` 和 `tags`
- 修改面试题源文档后，需要重新生成 `data/interview/interview-bank.json`
- 答案内容放在 `data/interview/interview-answers.json`
