import type { GraphNode, Node } from "@/lib/types";
import { flattenTree } from "@/lib/graph";
import bank from "@/data/interview/interview-bank-refined.json";

export type BankAnswer = {
  summary: string;
  bullets: string[];
  keyPoints?: string[];
};

export type BankQuestion = {
  id: string;
  chapter: string;
  chapterTitle: string;
  level: string;
  nodeId: string;
  nodeTitle: string;
  prompt: string;
  answer: BankAnswer;
};

export type InterviewQuestion = {
  id: string;
  prompt: string;
  answer?: BankAnswer;
};

export type InterviewSection = {
  title: string;
  questions: InterviewQuestion[];
};

export type InterviewGroup = {
  nodeId: string;
  title: string;
  sections: InterviewSection[];
};

export type InterviewBlock = {
  title: string;
  groups: InterviewGroup[];
};

export type InterviewCatalogQuestion = {
  id: string;
  prompt: string;
  answer?: {
    summary: string;
    bullets: string[];
    keyPoints?: string[];
  };
};

export type InterviewCatalogNode = {
  nodeId: string;
  title: string;
  questions: InterviewCatalogQuestion[];
};

export type InterviewCatalogSubsection = {
  title: string;
  nodes: InterviewCatalogNode[];
};

export type InterviewCatalogSection = {
  title: string;
  subsections: InterviewCatalogSubsection[];
};

export type InterviewCatalogFile = {
  file: string;
  sections: InterviewCatalogSection[];
};

type BankFile = {
  version: number;
  questions: BankQuestion[];
};

const interviewBank = bank as BankFile;

function sectionKey(question: BankQuestion): string {
  return question.level ? `${question.chapterTitle} · ${question.level}` : question.chapterTitle;
}

function buildNodeTitleMap(root: Node) {
  return new Map(flattenTree(root).map((node) => [node.id, node.title]));
}

function uniqueNodeIds(nodeIds: Array<string | undefined>): string[] {
  return Array.from(new Set(nodeIds.filter((id): id is string => Boolean(id))));
}

function buildInterviewGroupsForIds(root: Node, nodeIds: string[]): InterviewGroup[] {
  const titles = buildNodeTitleMap(root);
  const questionsByNode = new Map<string, BankQuestion[]>();

  for (const question of interviewBank.questions) {
    const list = questionsByNode.get(question.nodeId) ?? [];
    list.push(question);
    questionsByNode.set(question.nodeId, list);
  }

  return nodeIds
    .map((nodeId) => {
      const questions = questionsByNode.get(nodeId);
      if (!questions?.length) return null;
      const sectionsByKey = new Map<string, InterviewQuestion[]>();
      const orderedKeys: string[] = [];
      for (const question of questions) {
        const key = sectionKey(question);
        if (!sectionsByKey.has(key)) {
          sectionsByKey.set(key, []);
          orderedKeys.push(key);
        }
        sectionsByKey.get(key)!.push({
          id: question.id,
          prompt: question.prompt,
          answer: question.answer
        });
      }

      return {
        nodeId,
        title: titles.get(nodeId) ?? questions[0].nodeTitle ?? nodeId,
        sections: orderedKeys.map((key) => ({
          title: key,
          questions: sectionsByKey.get(key) ?? []
        }))
      };
    })
    .filter((group): group is InterviewGroup => Boolean(group));
}

function relatedNodeIds(node: GraphNode): string[] {
  return uniqueNodeIds([
    node.parentId,
    ...(node.links ?? [])
  ]).filter((nodeId) => nodeId !== node.id && !(node.children ?? []).some((child) => child.id === nodeId));
}

function buildNodeLookup(root: Node) {
  return new Map(flattenTree(root).map((node) => [node.id, node] as const));
}

export function buildInterviewGroups(root: Node, node: GraphNode): InterviewGroup[] {
  return buildInterviewGroupsForIds(root, uniqueNodeIds([
    node.id,
    ...(node.children ?? []).map((child) => child.id),
    ...(node.links ?? []),
    node.parentId
  ]));
}

export function buildInterviewBlocks(root: Node, node: GraphNode): InterviewBlock[] {
  const blocks: InterviewBlock[] = [
    {
      title: "本节点",
      groups: buildInterviewGroupsForIds(root, [node.id])
    },
    {
      title: "子节点",
      groups: buildInterviewGroupsForIds(root, (node.children ?? []).map((child) => child.id))
    },
    {
      title: "关联节点",
      groups: buildInterviewGroupsForIds(root, relatedNodeIds(node))
    }
  ];

  return blocks.filter((block) => block.groups.length);
}

export function serializeInterview(root: Node, node: GraphNode, answers: Record<string, string>) {
  const blocks = buildInterviewBlocks(root, node);
  const lines: string[] = [];

  lines.push(`# ${node.title} 面试稿`);
  lines.push("");
  lines.push(`- 系统角色: ${node.systemRole ?? "未设置"}`);
  lines.push(`- 问题驱动: ${node.problemSolved ?? "未设置"}`);
  lines.push(`- 权衡: ${(node.tradeOffs ?? []).join("；") || "未设置"}`);
  lines.push("");

  for (const block of blocks) {
    lines.push(`## ${block.title}`);
    lines.push("");
    for (const group of block.groups) {
      lines.push(`### ${group.title}`);
      lines.push("");
      for (const section of group.sections) {
        lines.push(`#### ${section.title}`);
        lines.push("");
        for (const question of section.questions) {
          const answer = answers[question.id]?.trim() || "（未填写）";
          lines.push(`##### ${question.prompt}`);
          lines.push("");
          lines.push(answer);
          lines.push("");
        }
      }
    }
  }

  return lines.join("\n");
}

export function buildInterviewCatalog(root: Node, includeAnswers = false): InterviewCatalogFile[] {
  const nodeMap = buildNodeLookup(root);
  const seenQuestions = new Set<string>();
  const files = new Map<
    string,
    Map<
      string,
      Map<
        string,
        Map<
          string,
          {
            title: string;
            questions: InterviewCatalogQuestion[];
          }
        >
      >
    >
  >();

  for (const question of interviewBank.questions) {
    const questionKey = [question.chapter, question.level, question.nodeId, question.prompt.trim()].join("||");
    if (seenQuestions.has(questionKey)) continue;
    seenQuestions.add(questionKey);

    const fileGroup = files.get(question.chapter) ?? new Map();
    const sectionGroup = fileGroup.get(question.chapterTitle) ?? new Map();
    const subsectionTitle = question.level || "未分类";
    const subsectionGroup = sectionGroup.get(subsectionTitle) ?? new Map();
    const node = nodeMap.get(question.nodeId);
    const nodeTitle = node?.title ?? question.nodeTitle ?? question.nodeId;
    const nodeGroup = subsectionGroup.get(question.nodeId) ?? { title: nodeTitle, questions: [] as InterviewCatalogQuestion[] };

    const catalogQuestion: InterviewCatalogQuestion = {
      id: question.id,
      prompt: question.prompt
    };

    if (includeAnswers) {
      catalogQuestion.answer = question.answer;
    }

    nodeGroup.questions.push(catalogQuestion);
    subsectionGroup.set(question.nodeId, nodeGroup);
    sectionGroup.set(subsectionTitle, subsectionGroup);
    fileGroup.set(question.chapterTitle, sectionGroup);
    files.set(question.chapter, fileGroup);
  }

  return [...files.entries()].map(([file, sectionsMap]) => ({
    file,
    sections: [...sectionsMap.entries()].map(([section, subsectionMap]) => ({
      title: section,
      subsections: [...subsectionMap.entries()].map(([subsection, nodeGroups]) => ({
        title: subsection,
        nodes: [...nodeGroups.entries()].map(([nodeId, nodeGroup]) => ({
          nodeId,
          title: nodeGroup.title,
          questions: nodeGroup.questions
        }))
      }))
    }))
  }));
}

export function serializeInterviewCatalog(root: Node, includeAnswers = false) {
  const files = buildInterviewCatalog(root, includeAnswers);
  const lines: string[] = [];

  lines.push(`# 面试题库`);
  lines.push("");

  for (const file of files) {
    lines.push(`## ${file.file}`);
    lines.push("");
    for (const section of file.sections) {
      lines.push(`### ${section.title}`);
      lines.push("");
      for (const subsection of section.subsections) {
        lines.push(`#### ${subsection.title}`);
        lines.push("");
        for (const node of subsection.nodes) {
          lines.push(`##### ${node.title}`);
          lines.push("");
          for (const question of node.questions) {
            lines.push(`- ${question.prompt}`);
            if (includeAnswers && question.answer) {
              lines.push(`  - 参考答案: ${question.answer.summary}`);
              for (const bullet of question.answer.bullets) {
                lines.push(`  - ${bullet}`);
              }
              for (const keyPoint of question.answer.keyPoints ?? []) {
                lines.push(`  - 关键点: ${keyPoint}`);
              }
            }
          }
          lines.push("");
        }
      }
    }
  }

  return lines.join("\n");
}
