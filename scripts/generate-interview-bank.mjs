import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd(), "..", "fullstack-interview-2026");
const outFile = path.resolve(process.cwd(), "data/interview/interview-bank.json");

const FILE_MAP = {
  "01-前端基础.md": {
    defaultNodeId: "frontend-foundation",
    sectionMap: {
      HTML: "html",
      CSS: "css",
      JavaScript: "javascript",
      TypeScript: "typescript",
      浏览器原理: "browser-principles",
      "Web API": "web-api",
      "构建工具": "build-tools"
    }
  },
  "02-React生态.md": {
    defaultNodeId: "react-core",
    sectionMap: {
      "React 核心": "react-core",
      Hooks: "react-hooks",
      状态管理: "react-state-management",
      性能优化: "react-performance",
      "React 原理": "react-principles",
      "React 18/19 新特性": "react-new-features"
    }
  },
  "03-Next.js.md": {
    defaultNodeId: "nextjs",
    sectionMap: {
      "App Router": "next-app-router",
      "SSR / SSG / ISR": "rendering-pipeline",
      "Server Actions": "next-server-actions",
      Middleware: "next-middleware",
      "缓存机制": "next-data-cache",
      "部署方案": "next-deployment"
    }
  },
  "04-Node.js.md": {
    defaultNodeId: "nodejs-runtime",
    sectionMap: {
      "Event Loop": "event-loop",
      Buffer: "buffer",
      Stream: "stream",
      "Cluster / Worker Threads": "worker-threads",
      "Node 底层原理": "nodejs-runtime"
    }
  },
  "05-后端框架.md": {
    defaultNodeId: "backend-system",
    sectionMap: {
      NestJS: "nestjs",
      "Spring Boot": "spring-boot"
    }
  },
  "06-API设计.md": {
    defaultNodeId: "api-design",
    sectionMap: {
      RESTful: "rest",
      GraphQL: "graphql",
      "RPC / gRPC": "api-design",
      tRPC: "api-design",
      "MCP (Model Context Protocol)": "ai-engineering",
      "OpenAPI / Swagger": "api-design",
      Webhooks: "api-design"
    }
  },
  "07-数据库.md": {
    defaultNodeId: "database-system",
    sectionMap: {
      PostgreSQL: "postgresql",
      MySQL: "mysql",
      Redis: "redis",
      MongoDB: "mongodb",
      "向量数据库": "vector-db",
      "搜索引擎": "elasticsearch",
      "时序数据库": "timescaledb"
    }
  },
  "08-SQL.md": {
    defaultNodeId: "sql-engineering",
    sectionMap: {
      "查询优化": "query-planner",
      索引: "covering-index",
      Join: "sql-engineering",
      事务: "transaction-isolation",
      锁: "deadlock",
      MVCC: "mvcc"
    }
  },
  "09-缓存.md": {
    defaultNodeId: "caching",
    sectionMap: {
      "缓存策略": "caching",
      "本地缓存": "caching",
      "分布式缓存": "redis-cache",
      "缓存一致性": "cache-invalidation",
      "分布式锁": "distributed-lock"
    }
  },
  "10-认证与安全.md": {
    defaultNodeId: "authn-authz",
    sectionMap: {
      "认证方案": "authn-authz",
      "常见攻击与防御": "xss",
      "零信任架构": "mtls"
    }
  },
  "11-网络.md": {
    defaultNodeId: "network-system",
    sectionMap: {
      "TCP/IP": "tcp-udp",
      HTTP: "http2",
      DNS: "dns",
      CDN: "cdn-cache",
      WebSocket: "websocket",
      "反向代理 & API Gateway": "api-gateway"
    }
  },
  "12-Linux.md": {
    defaultNodeId: "linux-system",
    sectionMap: {
      "常用命令": "linux-system",
      "文件系统": "linux-system",
      "权限系统": "linux-system",
      Systemd: "systemd",
      "性能排查": "linux-perf"
    }
  },
  "13-Docker.md": {
    defaultNodeId: "docker",
    sectionMap: {
      镜像: "docker",
      容器: "containers",
      "Volume & Network": "docker-volume",
      "Docker Compose": "docker-compose"
    }
  },
  "14-Kubernetes.md": {
    defaultNodeId: "kubernetes",
    sectionMap: {
      "核心概念": "kubernetes",
      工作负载: "containers",
      "服务发现 & 网络": "service-mesh",
      "配置 & 密钥": "secrets-management",
      存储: "kubernetes",
      "弹性伸缩": "autoscaling",
      "安全 & 权限": "rbac",
      "Helm": "kubernetes",
      "Operator 模式": "kubernetes"
    }
  },
  "15-DevOps.md": {
    defaultNodeId: "devops",
    sectionMap: {
      Git: "devops",
      "CI/CD": "ci-cd",
      GitOps: "gitops"
    }
  },
  "16-可观测性.md": {
    defaultNodeId: "observability",
    sectionMap: {
      "三大支柱": "observability",
      OpenTelemetry: "distributed-tracing",
      "监控告警": "alerting",
      "日志工程": "observability"
    }
  },
  "17-云原生与基础设施.md": {
    defaultNodeId: "cloud-native",
    sectionMap: {
      "IaC (Infrastructure as Code)": "terraform",
      "公有云": "cloud-native",
      "对象存储": "object-storage",
      "消息队列": "message-queue",
      "MQTT (IoT)": "cloud-native"
    }
  },
  "18-系统设计.md": {
    defaultNodeId: "system-design",
    sectionMap: {
      "高并发": "microservices",
      "高可用": "circuit-breaker",
      "分布式系统": "service-mesh",
      "架构模式": "system-design",
      "设计方法论": "adr",
      "理论基础": "system-design"
    }
  },
  "19-AI工程化.md": {
    defaultNodeId: "ai-engineering",
    sectionMap: {
      "LLM 基础": "ai-engineering",
      "Prompt Engineering": "ai-engineering",
      "RAG（检索增强生成）": "vector-db",
      "Function Calling / Tool Use": "ai-engineering",
      Agent: "ai-engineering",
      "MCP（Model Context Protocol）": "ai-engineering",
      "A2A（Agent-to-Agent）": "ai-engineering",
      "AI 工程化": "guardrails",
      "AI Coding": "ai-engineering",
      "模型部署": "ai-engineering"
    }
  },
  "20-测试工程.md": {
    defaultNodeId: "testing-engineering",
    sectionMap: {
      "测试金字塔": "testing-engineering",
      "前端测试": "vitest",
      "后端测试": "testcontainers",
      "测试策略": "contract-testing"
    }
  },
  "21-软技能与工程效能.md": {
    defaultNodeId: "engineering-effectiveness",
    sectionMap: {
      "技术方案": "engineering-effectiveness",
      项目管理: "engineering-effectiveness",
      "工程效能": "engineering-effectiveness"
    }
  }
};

function normalizeHeading(heading) {
  return heading
    .replace(/^\d+(?:\.\d+)?\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .trim();
}

function parseQuestions(fileName, text) {
  const lines = text.split(/\r?\n/);
  const fileConfig = FILE_MAP[fileName] ?? { defaultNodeId: "system-design", sectionMap: {} };
  const records = [];
  let currentSection = null;
  let currentSubsection = null;
  let currentNodeId = fileConfig.defaultNodeId;
  let currentNodeTitle = fileConfig.defaultNodeId;
  let pendingQuestions = [];

  const flush = () => {
    if (!pendingQuestions.length) return;
    for (const prompt of pendingQuestions) {
      records.push({
        id: `${slugify(fileName)}-${slugify(currentSection ?? "section")}-${slugify(currentSubsection ?? "group")}-${records.length + 1}`,
        file: fileName,
        section: currentSection ?? "未分类",
        subsection: currentSubsection ?? "",
        nodeId: currentNodeId,
        nodeTitle: currentNodeTitle,
        prompt
      });
    }
    pendingQuestions = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("## ")) {
      flush();
      const heading = normalizeHeading(line.slice(3));
      currentSection = heading;
      currentSubsection = null;
      const sectionNodeId = fileConfig.sectionMap[heading] ?? fileConfig.defaultNodeId;
      currentNodeId = sectionNodeId;
      currentNodeTitle = sectionNodeId;
      continue;
    }
    if (line.startsWith("### ")) {
      flush();
      currentSubsection = normalizeHeading(line.slice(4));
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      if (
        currentSection &&
        !/面试技巧|总结/.test(currentSection)
      ) {
        const prompt = stripMarkdown(line.replace(/^\d+\.\s+/, ""));
        pendingQuestions.push(prompt);
      }
    }
  }

  flush();
  return records;
}

function main() {
  const files = fs
    .readdirSync(rootDir)
    .filter((file) => /^\d+-.*\.md$/.test(file))
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

  const questions = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(rootDir, file), "utf8");
    questions.push(...parseQuestions(file, text));
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify({ version: 1, questions }, null, 2) + "\n");
  console.log(`wrote ${questions.length} questions to ${outFile}`);
}

main();
