# 面试题精简改造计划

## 背景
旧题库 2323 题，题太碎、重复多、"必考题"与前缀基础题内容重复、答案靠 pattern 匹配不确定、大量题无匹配规则落 default。

## 新方案
重新构建精简题库 `data/interview/interview-bank-refined.json`，schema 版本 3：
- 每章 8-12 题，按基础题/进阶题/场景题三层结构
- 每题内联完整答案（summary + 4-6条 bullets + keyPoints），不存在"默认兜底"

## UI 改动
- `lib/interview-bank.ts`：切换到精简题库源，类型扩展含 answer 字段
- `components/interview-answer.tsx`：支持内联 answer，优先用内联答案不走 rule 匹配
- `components/interview-workbench.tsx`：传递内联答案

## 旧数据保留
- `data/interview/interview-bank.json`（旧题库）保留不删
- `data/interview/interview-answers.json`（旧答案库）保留不删

## 完成状态

### 状态：✅ 全部完成

- 182 题 / 21 章，每章 8-12 题
- 全部含完整答案（summary + bullets + keyPoints）
- 零默认兜底
- lint / tsc / build 全通过

### 各章题数

| 章节 | 题数 |
|------|------|
| 01-前端基础 | 10 |
| 02-React生态 | 10 |
| 03-Next.js | 10 |
| 04-Node.js | 8 |
| 05-后端框架 | 8 |
| 06-API设计 | 10 |
| 07-数据库 | 8 |
| 08-SQL | 8 |
| 09-缓存 | 8 |
| 10-认证与安全 | 9 |
| 11-网络 | 9 |
| 12-Linux | 9 |
| 13-Docker | 8 |
| 14-Kubernetes | 8 |
| 15-DevOps | 8 |
| 16-可观测性 | 8 |
| 17-云原生 | 9 |
| 18-系统设计 | 9 |
| 19-AI工程化 | 9 |
| 20-测试工程 | 8 |
| 21-软技能 | 8 |
| **总计** | **182** |
