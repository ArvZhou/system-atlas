import type { GraphNode } from "@/lib/types";
import answerBank from "@/data/interview/interview-answers.json";

export type AnswerCard = {
  summary: string;
  bullets: string[];
  keyPoints?: string[];
};

type NodeLike = Pick<
  GraphNode,
  "id" | "title" | "description" | "systemRole" | "problemSolved" | "tradeOffs" | "tags" | "type"
>;

type AnswerRule = {
  patterns: string[];
  summary: string;
  bullets: string[];
  keyPoints?: string[];
};

type NodeAnswer = {
  default: AnswerCard;
  rules: AnswerRule[];
};

type InterviewAnswerBank = {
  version: number;
  nodes: Record<string, NodeAnswer>;
  fallback: AnswerCard;
};

const bank = answerBank as InterviewAnswerBank;

function normalize(text: string): string {
  return text.toLowerCase();
}

function defaultCard(node: NodeLike): AnswerCard {
  return {
    summary: node.problemSolved ?? node.systemRole ?? node.description ?? `围绕 ${node.title} 的职责、实现和边界展开。`,
    bullets: [
      node.systemRole ? `定位：${node.systemRole}` : `定位：${node.title} 在系统里的职责。`,
      node.problemSolved ? `解决：${node.problemSolved}` : "说明它要解决的核心问题。",
      node.tradeOffs?.length ? `权衡：${node.tradeOffs[0]}` : "补上适用边界、成本和替代方案。"
    ]
  };
}

function promptMatches(prompt: string, patterns: string[]): boolean {
  const text = normalize(prompt);
  return patterns.some((pattern) => text.includes(normalize(pattern)));
}

function ruleToCard(rule: AnswerRule): AnswerCard {
  return {
    summary: rule.summary,
    bullets: rule.bullets.slice(0, 4),
    keyPoints: rule.keyPoints ?? []
  };
}

export function buildInterviewAnswer(node: NodeLike, prompt: string): AnswerCard {
  const entry = bank.nodes[node.id];
  if (!entry) return bank.fallback ?? defaultCard(node);

  const rule = entry.rules.find((item) => promptMatches(prompt, item.patterns));
  if (rule) {
    return ruleToCard(rule);
  }

  return entry.default ?? defaultCard(node);
}
