import type { GraphNode, Node } from "@/lib/types";
import { flattenTree } from "@/lib/graph";

type DetailSection = {
  title: string;
  body: string;
};

function implementationHint(node: Node): string {
  const joinedTags = (node.tags ?? []).join(" ");
  const text = `${node.title} ${joinedTags}`.toLowerCase();

  if (text.includes("cache") || text.includes("缓存")) return "常见实现是 LRU/TTL、读穿透保护、写穿透或写回策略，以及失效广播。";
  if (text.includes("frontend-foundation") || text.includes("html") || text.includes("css") || text.includes("javascript") || text.includes("typescript")) return "常见实现包括语义化标记、布局模型、事件循环、静态类型和浏览器原理的组合应用。";
  if (text.includes("browser-principles") || text.includes("web api") || text.includes("build-tools")) return "常见实现包括渲染流水线、存储与缓存、网络 API、构建链和资源优化。";
  if (text.includes("hooks") || text.includes("usestate") || text.includes("useeffect")) return "常见实现包括状态 Hook、副作用 Hook、自定义 Hook 和对依赖数组的严格管理。";
  if (text.includes("react") && text.includes("render")) return "常见实现包括渲染调度、协调、重渲染传播和 Suspense 边界协作。";
  if (text.includes("react")) return "常见实现包括函数组件、Hooks、受控状态、Suspense 和服务端/客户端组件边界。";
  if (text.includes("react core") || text.includes("react-state-management") || text.includes("react-performance") || text.includes("react-principles") || text.includes("react-new-features")) return "常见实现包括 JSX 转换、Fiber 调度、状态管理、性能优化和并发特性。";
  if (text.includes("app router") || text.includes("rsc") || text.includes("server components")) return "常见实现包括目录路由、布局嵌套、服务端组件、流式边界和数据缓存策略。";
  if (text.includes("reactivity") || text.includes("composition api") || text.includes("sfc")) return "常见实现包括 Proxy/依赖追踪、ref/reactive、setup 组织和单文件组件编译。";
  if (text.includes("next.js") || text.includes("nextjs") || text.includes("next")) return "常见实现包括文件路由或 App Router、SSR、RSC、流式渲染和数据预取。";
  if (text.includes("vue")) return "常见实现包括响应式系统、组合式 API、模板编译和单文件组件。";
  if (text.includes("modules") || text.includes("nitro") || text.includes("routing")) return "常见实现包括模块注入、运行时适配、文件路由和服务端渲染编排。";
  if (text.includes("pipes") || text.includes("guards") || text.includes("interceptors") || text.includes("di")) return "常见实现包括请求管道、权限守卫、拦截器链和容器级依赖解析。";
  if (text.includes("nestjs")) return "常见实现包括模块、控制器、提供者、装饰器、依赖注入和管道。";
  if (text.includes("node.js") || text.includes("nodejs-runtime") || text.includes("event-loop") || text.includes("buffer") || text.includes("stream") || text.includes("worker-threads")) return "常见实现包括事件循环、二进制缓冲、流式处理、子线程和模块加载机制。";
  if (text.includes("autoconfig") || text.includes("bean")) return "常见实现包括条件装配、Bean 生命周期、自动扫描和配置属性绑定。";
  if (text.includes("transaction") && text.includes("spring")) return "常见实现包括声明式事务、传播行为、回滚规则和事务代理。";
  if (text.includes("spring boot") || text.includes("spring")) return "常见实现包括自动配置、Bean 容器、Starter、AOP、事务和 MVC 分层。";
  if (text.includes("schema") || text.includes("migration") || text.includes("client")) return "常见实现包括 schema 驱动建模、迁移脚本、客户端生成和类型同步。";
  if (text.includes("mapper") || text.includes("xml") || text.includes("dynamic sql")) return "常见实现包括 Mapper 接口、XML 映射、结果映射、动态 SQL 和手写优化。";
  if (text.includes("prisma")) return "常见实现包括 schema 驱动、迁移、类型生成、客户端查询和连接池管理。";
  if (text.includes("mybatis")) return "常见实现包括 SQL 映射文件、Mapper 接口、结果映射和动态 SQL。";
  if (text.includes("database-engines") || text.includes("postgresql") || text.includes("mysql") || text.includes("mongodb") || text.includes("elasticsearch") || text.includes("timescaledb") || text.includes("vector-db")) return "常见实现包括事务、索引、复制、文档建模、搜索索引和时序/向量存储能力。";
  if (text.includes("sql-engineering")) return "常见实现包括执行计划、索引设计、Join 策略、事务隔离、锁和 MVCC。";
  if (text.includes("load balancing") || text.includes("负载均衡") || text.includes("路由")) return "常见实现包括轮询、最少连接、权重分配、健康检查和会话亲和。";
  if (text.includes("transaction") || text.includes("事务") || text.includes("mvcc")) return "常见实现包括锁、版本链、快照可见性、回滚日志和清理流程。";
  if (text.includes("query") || text.includes("索引")) return "常见实现包括 B-Tree、覆盖索引、查询规划器、执行计划缓存和统计信息。";
  if (text.includes("http") || text.includes("api") || text.includes("接口")) return "常见实现包括资源建模、状态码、幂等、分页、鉴权和缓存头。";
  if (text.includes("auth") || text.includes("安全") || text.includes("权限")) return "常见实现包括会话、Token、RBAC、CSRF 防护、CSP 和审计日志。";
  if (text.includes("queue") || text.includes("队列") || text.includes("事件")) return "常见实现包括消息队列、Outbox、重试、死信队列和幂等消费。";
  if (text.includes("ssr") || text.includes("hydration") || text.includes("渲染")) return "常见实现包括 SSR、流式传输、Suspense 边界、按需 Hydration 和代码分割。";
  if (text.includes("linux") || text.includes("systemd")) return "常见实现包括命令行、文件系统、权限、服务管理和性能排查。";
  if (text.includes("docker")) return "常见实现包括镜像分层、容器隔离、网络、卷和 Compose 编排。";
  if (text.includes("kubernetes")) return "常见实现包括声明式资源、工作负载、Service、Ingress、存储和弹性伸缩。";
  if (text.includes("devops")) return "常见实现包括 Git 流程、CI/CD、GitOps 和发布治理。";
  if (text.includes("cloud-native")) return "常见实现包括 IaC、公有云、对象存储、消息队列和平台抽象。";
  if (text.includes("testing-engineering") || text.includes("playwright") || text.includes("vitest")) return "常见实现包括测试金字塔、单元/集成/E2E 测试、Mock 和契约测试。";
  if (text.includes("ai-engineering") || text.includes("rag") || text.includes("agent") || text.includes("mcp")) return "常见实现包括模型路由、Prompt 模板、检索增强、工具调用和评估护栏。";
  if (text.includes("engineering-effectiveness") || text.includes("system-design") || text.includes("adr") || text.includes("scrum")) return "常见实现包括 RFC/ADR、评审流程、CI/CD、GitOps 和协作规范。";
  return "通常会落到边界控制、状态治理、监控告警和可回滚的实现路径。";
}

function deeperLayerHint(node: GraphNode): string {
  if (node.depth <= 1) return "这一层通常是系统总览或领域划分，面试会更关注边界和职责。";
  if (node.depth === 2) return "这一层开始进入具体工程问题，常会追问实现方式和权衡。";
  return "这一层已经接近实现细节，面试更常追问失效模式、调优和落地策略。";
}

export function buildDetailSections(node: GraphNode): DetailSection[] {
  return [
    {
      title: "在系统中的位置",
      body: node.systemRole ?? "未定义系统角色。"
    },
    {
      title: "它解决的问题",
      body: node.problemSolved ?? "暂无问题说明。"
    },
    {
      title: "常见实现方式",
      body: implementationHint(node)
    },
    {
      title: "深层理解",
      body: `${deeperLayerHint(node)} ${node.depth >= 2 ? "这类节点不只要会定义，还要能说明如何验证、监控和回退。" : ""}`
    }
  ];
}

function questionBase(node: GraphNode): string[] {
  if (node.type === "problem") {
    return [
      `这个“${node.title}”在系统里通常会出现什么症状？`,
      `它最常见的根因是什么？`,
      `如何监控或发现这个问题？`,
      `短期缓解方案是什么？`,
      `长期根治需要改哪些边界或结构？`,
      `它和哪些方案节点形成对应关系？`
    ];
  }

  if (node.type === "solution") {
    return [
      `为什么系统会需要“${node.title}”？`,
      `它通常解决哪一类问题？`,
      `最常见的实现方式是什么？`,
      `它最大的权衡是什么？`,
      `什么时候不应该使用它？`,
      `它的失效模式或副作用是什么？`
    ];
  }

  if (node.type === "concept") {
    return [
      `“${node.title}”在系统分层里处于什么位置？`,
      `它的边界和上下游分别是什么？`,
      `它和哪些问题、方案节点最相关？`,
      `它最容易在哪些地方出错？`,
      `面试时如何把这个概念讲清楚？`,
      `如果要落地，它通常怎么实现？`
    ];
  }

  if (node.type === "domain") {
    return [
      `这个领域在整个系统中负责什么？`,
      `它和其他领域之间的输入输出是什么？`,
      `这个领域最核心的瓶颈是什么？`,
      `它最常见的工程权衡是什么？`,
      `面试时如何系统性地介绍这个领域？`,
      `这个领域最常见的演进方向是什么？`
    ];
  }

  return [
    `“${node.title}”在系统图谱中的角色是什么？`,
    `它要解决的工程问题是什么？`,
    `它和哪些节点存在关联？`,
    `它最重要的权衡是什么？`,
    `面试中如何向别人解释它？`,
    `它的典型实现是什么？`
  ];
}

function tagSpecificQuestions(node: GraphNode): string[] {
  const tags = new Set([node.title, ...(node.tags ?? [])].map((tag) => tag.toLowerCase()));
  const questions: string[] = [];

  const add = (match: string[], qs: string[]) => {
    if (match.some((item) => [...tags].some((tag) => tag.includes(item.toLowerCase())))) {
      questions.push(...qs);
    }
  };

  add(["缓存", "cache"], [
    "缓存命中率和一致性如何权衡？",
    "TTL、失效广播和写穿透各有什么特点？"
  ]);
  add(["数据库", "transaction", "mvcc", "索引"], [
    "如何解释索引、锁和隔离级别之间的关系？",
    "为什么 MVCC 能改善读写并发？"
  ]);
  add(["前端", "render", "hydration", "ssr"], [
    "为什么会发生 Hydration 不一致？",
    "SSR、CSR 和流式渲染的适用边界是什么？"
  ]);
  add(["react"], [
    "React 的渲染模型和状态更新机制是什么？",
    "Hooks 为什么能表达组件逻辑复用？"
  ]);
  add(["hooks", "useState", "useEffect"], [
    "useState 和 useReducer 各适合什么场景？",
    "useEffect 的依赖数组为什么容易出问题？"
  ]);
  add(["next"], [
    "Next.js 为什么适合做生产级前端？",
    "App Router、SSR、RSC 和路由预取怎么配合？"
  ]);
  add(["app router", "rsc", "server components"], [
    "App Router 解决了什么路由和布局问题？",
    "RSC 为什么能减少客户端包体积？"
  ]);
  add(["vue"], [
    "Vue 的响应式系统是怎么工作的？",
    "模板、组合式 API 和组件组织方式有什么关系？"
  ]);
  add(["reactivity", "composition api", "sfc"], [
    "Vue 的响应式追踪依赖是怎么做的？",
    "组合式 API 什么时候比 Options API 更合适？"
  ]);
  add(["nuxt"], [
    "Nuxt 和 Vue 之间是什么关系？",
    "Nuxt 的 SSR 和模块化能力适合解决什么问题？"
  ]);
  add(["modules", "nitro", "routing"], [
    "Nuxt 模块系统为什么适合扩展大型项目？",
    "Nitro 在 SSR 和部署里负责什么？"
  ]);
  add(["安全", "auth", "csrf", "xss"], [
    "如何防止 XSS 和 CSRF？",
    "认证和授权为什么要分开设计？"
  ]);
  add(["nestjs"], [
    "NestJS 的模块、控制器和 Provider 各自负责什么？",
    "NestJS 为什么适合做企业级 Node.js 后端？"
  ]);
  add(["di", "pipes", "guards", "interceptors"], [
    "NestJS 的依赖注入容器怎么帮助测试和解耦？",
    "Pipes、Guards 和 Interceptors 的执行顺序是什么？"
  ]);
  add(["spring", "spring boot"], [
    "Spring Boot 为什么在 Java 后端里这么常见？",
    "自动配置、Bean 容器和事务管理各解决什么问题？"
  ]);
  add(["autoconfig", "bean", "transaction"], [
    "Spring Boot 自动配置如何生效？",
    "声明式事务为什么能减少样板代码？"
  ]);
  add(["prisma"], [
    "Prisma 适合解决哪类数据访问问题？",
    "Prisma 的 schema、迁移和类型生成如何协同？"
  ]);
  add(["schema", "migration", "client"], [
    "Prisma schema 驱动为什么适合 TypeScript 项目？",
    "迁移系统和客户端生成分别解决什么问题？"
  ]);
  add(["mybatis"], [
    "MyBatis 适合什么样的业务场景？",
    "MyBatis 为什么更适合复杂 SQL 和手工优化？"
  ]);
  add(["mapper", "xml", "dynamic sql"], [
    "MyBatis Mapper 和 XML 映射各自负责什么？",
    "动态 SQL 适合解决哪些查询组合问题？"
  ]);
  add(["队列", "事件", "async"], [
    "如何保证异步消息的幂等和可恢复？",
    "Outbox 为什么能减少消息丢失？"
  ]);
  add(["负载均衡", "路由", "network", "tls"], [
    "负载均衡、反向代理和 API 网关有什么区别？",
    "mTLS 和普通 TLS 的边界在哪里？"
  ]);

  return questions;
}

export type InterviewQuestion = {
  id: string;
  prompt: string;
};

export type InterviewGroup = {
  nodeId: string;
  title: string;
  questions: InterviewQuestion[];
};

export function buildInterviewGroups(root: Node, node: GraphNode): InterviewGroup[] {
  const map = new Map(flattenTree(root).map((item) => [item.id, item]));
  const primaryQuestions = [...questionBase(node), ...tagSpecificQuestions(node)];
  const groups: InterviewGroup[] = [
    {
      nodeId: node.id,
      title: node.title,
      questions: primaryQuestions.map((prompt, index) => ({
        id: `${node.id}-${index}`,
        prompt
      }))
    }
  ];

  const relatedIds = new Set<string>([
    ...(node.children ?? []).map((child) => child.id),
    ...(node.links ?? [])
  ]);

  for (const relatedId of relatedIds) {
    const linked = map.get(relatedId);
    if (!linked) continue;
    const questions = [...questionBase(linked), ...tagSpecificQuestions(linked)];
    groups.push({
      nodeId: linked.id,
      title: linked.title,
      questions: questions.map((prompt, index) => ({
        id: `${linked.id}-${index}`,
        prompt
      }))
    });
  }

  return groups;
}

export function serializeInterview(root: Node, node: GraphNode, answers: Record<string, string>) {
  const groups = buildInterviewGroups(root, node);
  const lines: string[] = [];

  lines.push(`# ${node.title} 面试稿`);
  lines.push("");
  lines.push(`- 系统角色: ${node.systemRole ?? "未设置"}`);
  lines.push(`- 问题驱动: ${node.problemSolved ?? "未设置"}`);
  lines.push(`- 权衡: ${(node.tradeOffs ?? []).join("；") || "未设置"}`);
  lines.push("");

  for (const group of groups) {
    lines.push(`## ${group.title}`);
    lines.push("");
    for (const question of group.questions) {
      const answer = answers[question.id]?.trim() || "（未填写）";
      lines.push(`### ${question.prompt}`);
      lines.push("");
      lines.push(answer);
      lines.push("");
    }
  }

  return lines.join("\n");
}
