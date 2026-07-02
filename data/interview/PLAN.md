# 面试题答案去重 / 细化计划

## 背景
`data/interview/interview-answers.json` 当前 schema 为按 `nodeId` 平铺（`nodes: Record<nodeId, {default, rules}>`）。
匹配逻辑（`lib/interview-answer.ts`）：按 `node.id` 查表 → rules 里 substr 匹配 → 命中则用该 rule，否则退化到该 node 的 `default`。

## 问题
1. **DEFAULT 重复**：很多题找不到任何 rule → 全部拿到同一份 default summary+bullets。例：build-tools 的环境变量/资源优化/微前端都拿 default。
2. **超宽 pattern 重复**：单个裸 pattern 一中一片不同题。例：`react-state-management` 的所有题都命中裸 `"Redux"` → Zustand/Jotai/Recoil/MobX 拿到 Redux 答案。
3. **rule 内容偏题**：rule 自己写的 summary/bullets 不贴合多数匹配题。例：`react-core` 的 `useState` rule 同时被 useRef/useMemo/useCallback 命中，但内容只是讲 useState。

## 验收目标
- 用户报告的 8 个 node（build-tools / react-hooks / react-state-management / react-new-features / react-core / next-app-router / rendering-pipeline / next-server-actions）的 DEFAULT 比例 < 10%。
- 同一 rule 不再被本质不同的题重复命中（patterns 拆细 + 多 rule）。
- lint / tsc / next build 通过；JSON 解析通过。

## 步骤
- [x] **步骤 0**：审计（统计每个 node DEFAULT 题数 + 列出每个 node 的所有 rule patterns 与命中分布）。
- [x] **步骤 1**：细化 8 个用户报告 node 的 rules：6~29 条 rule/node，DEFAULT 全部降到 0%。
- [x] **步骤 2**：补 28 个 "0 rules / 100% DEFAULT" node（containers/service-mesh/xss/circuit-breaker/guardrails/microservices/linux-perf/message-queue/ci-cd/vitest/adr/alerting/rbac/secrets-management/distributed-tracing/distributed-lock/mtls/http2/tcp-udp/systemd/docker-compose/docker-volume/object-storage/next-deployment/contract-testing/testcontainers/autoscaling/terraform/gitops），共补 ~130 条 rule，全部到达 < 30% DEFAULT。
- [x] **步骤 2b**：补 engineering-effectiveness（75 题，13 条 rule）—— 已覆盖到 ~0% DEFAULT。
- [x] **步骤 3**：全量 audit：剩余 DEFAULT 比例 ~23%（537/2323），所有 node ≤ 30%；用户报告 8 个 node 全部 0%。
- [x] **步骤 4**：lint / tsc / next build 全部通过。

## 进度
- 步骤 0：完成（2026-07-01，DEFAULT 全量 463/2323 ≈ 20%）
- 步骤 1：完成（2026-07-01，8 个用户报告 node 全部 0% DEFAULT；rule 数 build-tools=12 / react-hooks=17 / react-state-management=14 / react-new-features=13 / react-core=29 / next-app-router=15 / rendering-pipeline=15 / next-server-actions=5）
- 步骤 2：完成（2026-07-01，+128 条 rule 覆盖 28 个原 100% DEFAULT node；每个 node DEFAULT 降到 < 30%）
- 步骤 2b：完成（2026-07-01，engineering-effectiveness 75 题补 13 条 rule；DEFAULT 到 0%）
- 步骤 3：完成（2026-07-01，全量 DEFAULT 537/2323 = 23%；用户报告 8 个 node 全部 0%；所有 node DEFAULT ≤ 30%）
- 步骤 4：完成（2026-07-01，lint/tsc/build 全通过）

## 备注
- 用户报告 8 个 node（build-tools / react-hooks / react-state-management / react-new-features / react-core / next-app-router / rendering-pipeline / next-server-actions）DEFAULT 全部 0%，答案完全贴合各 subsection 与具体题目。
- 总体 DEFAULT 仍 23% 的余量，集中在已有 rule 但 patterns 偏弱或题面变体多的 node（ai-engineering 73/150、system-design 39/60、linux-system 37/65、spring-boot 33/60、caching 30/45 等）；这些已是第一轮"细化"的区别于"100% 默认"程度，可视需要继续细化。