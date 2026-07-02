"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Download, Copy, FileText, Search, ArrowLeft, BookOpen } from "lucide-react";
import { atlasRoot } from "@/lib/graph-data";
import { flattenTree } from "@/lib/graph";
import type { GraphNode, Node } from "@/lib/types";
import { buildInterviewBlocks, serializeInterview, serializeInterviewCatalog } from "@/lib/interview-bank";
import { InterviewAnswer } from "@/components/interview-answer";

type InterviewWorkbenchProps = {
  root?: Node;
};

type AnswerMap = Record<string, string>;

type TreeNode = Node & { children?: TreeNode[] };

const TYPE_LABELS: Record<string, string> = {
  root: "根节点",
  domain: "领域",
  concept: "概念",
  problem: "问题",
  solution: "方案"
};

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function nodeText(node: Node) {
  return [node.title, node.description, node.systemRole, node.problemSolved, ...(node.tags ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesQuery(node: Node, text: string) {
  if (!text) return true;
  return nodeText(node).includes(text);
}

function filterTree(node: TreeNode, text: string): TreeNode | null {
  if (!text) return node;

  const children = (node.children ?? []).map((child) => filterTree(child, text)).filter(Boolean) as TreeNode[];
  if (matchesQuery(node, text) || children.length) {
    return { ...node, children };
  }

  return null;
}

function collectPathIds(node: GraphNode | undefined): string[] {
  return node?.path ?? [];
}

export function InterviewWorkbench({ root = atlasRoot }: InterviewWorkbenchProps) {
  const nodes = useMemo(() => flattenTree(root), [root]);
  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node] as const)), [nodes]);
  const [selectedId, setSelectedId] = useState(nodes[0]?.id ?? root.id);
  const [query, setQuery] = useState("");
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set([root.id]));

  const selectedNode = useMemo(() => {
    return nodes.find((item) => item.id === selectedId) ?? nodes[0];
  }, [nodes, selectedId]) as GraphNode;

  useEffect(() => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      for (const id of collectPathIds(selectedNode).slice(0, -1)) {
        next.add(id);
      }
      return next;
    });
  }, [selectedNode]);

  const blocks = useMemo(() => buildInterviewBlocks(root, selectedNode), [root, selectedNode]);

  const filteredRoot = useMemo(() => {
    const text = query.trim().toLowerCase();
    return filterTree(root as TreeNode, text);
  }, [root, query]);

  const visibleIds = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text || !filteredRoot) return new Set(nodes.map((node) => node.id));

    const ids = new Set<string>();
    const walk = (node: TreeNode): boolean => {
      const childMatched = (node.children ?? []).map(walk).some(Boolean);
      const matched = matchesQuery(node, text) || childMatched;
      if (matched) ids.add(node.id);
      return matched;
    };
    walk(filteredRoot);
    return ids;
  }, [filteredRoot, nodes, query]);

  const treeRoot = filteredRoot ?? (root as TreeNode);

  const exportText = useMemo(() => serializeInterview(root, selectedNode, answers), [root, selectedNode, answers]);
  const catalogText = useMemo(() => serializeInterviewCatalog(root, false), [root]);
  const catalogWithAnswersText = useMemo(() => serializeInterviewCatalog(root, true), [root]);

  function renderTree(node: TreeNode, depth = 0): ReactNode {
    if (!visibleIds.has(node.id)) return null;

    const children = node.children ?? [];
    const hasChildren = children.length > 0;
    const isExpanded = query.trim() ? true : expandedIds.has(node.id);
    const isActive = node.id === selectedId;

    return (
      <div key={node.id} className="tree-branch">
        <div className="tree-row" data-depth={depth} data-active={isActive} style={{ paddingLeft: `${depth * 0.8}rem` }}>
          <button
            className="tree-toggle"
            onClick={() => {
              if (!hasChildren) return;
              setExpandedIds((prev) => {
                const next = new Set(prev);
                if (next.has(node.id)) next.delete(node.id);
                else next.add(node.id);
                return next;
              });
            }}
            aria-label={hasChildren ? (isExpanded ? "折叠" : "展开") : "无子级"}
            disabled={!hasChildren}
            type="button"
          >
            {hasChildren ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : null}
          </button>
          <button
            className="node-list-item"
            data-active={isActive}
            onClick={() => setSelectedId(node.id)}
            type="button"
          >
            <strong>{node.title}</strong>
            <small>{TYPE_LABELS[node.type] ?? node.type} · {node.systemRole ?? node.description}</small>
          </button>
        </div>
        {hasChildren && isExpanded ? <div className="tree-children">{children.map((child) => renderTree(child, depth + 1))}</div> : null}
      </div>
    );
  }

  return (
    <div className="interview-shell">
      <header className="interview-topbar">
        <div>
          <div className="interview-title">面试页面</div>
          <p className="interview-subtitle">选择一个节点，填写问题答案，然后复制或下载整份 Markdown 面试稿。</p>
        </div>
        <div className="toolbar">
          <Link className="chip" href="/">
            <ArrowLeft size={15} /> 返回图谱
          </Link>
          <Link className="chip" href="/story">
            <BookOpen size={15} /> 故事
          </Link>
          <button
            className="chip"
            onClick={async () => {
              await navigator.clipboard.writeText(exportText);
            }}
          >
            <Copy size={15} /> 复制全部
          </button>
          <button
            className="chip"
            onClick={() => downloadText(`${selectedNode.title}-面试稿.md`, exportText)}
          >
            <Download size={15} /> 下载 Markdown
          </button>
          <button
            className="chip"
            onClick={() => downloadText(`interview-bank.md`, catalogText)}
          >
            <FileText size={15} /> 下载题库
          </button>
          <button
            className="chip"
            onClick={() => downloadText(`interview-bank-with-answers.md`, catalogWithAnswersText)}
          >
            <FileText size={15} /> 下载题库+答案
          </button>
        </div>
      </header>

      <main className="interview-content">
        <aside className="interview-sidebar">
          <div className="search-shell">
            <Search size={14} style={{ position: "absolute", left: "0.85rem", top: "0.7rem", color: "var(--muted)" }} />
            <input
              className="search-input"
              placeholder="搜索节点、标签、问题..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={{ width: "100%", paddingLeft: "2.1rem" }}
            />
          </div>
          <div className="node-tree">
            {query.trim() && !visibleIds.size ? (
              <div className="tree-empty">没有找到匹配的模块。</div>
            ) : (
              renderTree(treeRoot)
            )}
          </div>
        </aside>

        <section className="interview-panel">
          <div className="interview-card">
              <div className="interview-card-header">
                <div>
                  <div className="detail-kicker">{TYPE_LABELS[selectedNode.type] ?? selectedNode.type}</div>
                  <h2 style={{ margin: "0.35rem 0" }}>{selectedNode.title}</h2>
                </div>
              <p style={{ margin: 0, color: "var(--muted)" }}>{selectedNode.systemRole ?? selectedNode.description}</p>
              </div>
            <div className="detail-grid">
              {blocks.map((block) => (
                <section className="detail-block" key={block.title}>
                  <p className="detail-label">{block.title}</p>
                  <div className="interview-blocks">
                    {block.groups.map((group) => (
                      <div className="interview-node-group" key={group.nodeId}>
                        <p className="detail-label" style={{ marginBottom: "0.55rem" }}>{group.title}</p>
                        <div className="interview-questions">
                          {group.sections.map((section) => (
                            <div key={section.title} style={{ display: "grid", gap: "0.55rem" }}>
                              <p className="detail-label" style={{ marginBottom: 0 }}>{section.title}</p>
                              {section.questions.map((question) => (
                                <div className="question-item" key={question.id}>
                                  <span>{question.prompt}</span>
                                  <textarea
                                    value={answers[question.id] ?? ""}
                                    onChange={(event) => setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))}
                                    placeholder="在这里写答案..."
                                    rows={4}
                                  />
                                  <InterviewAnswer node={nodeMap.get(group.nodeId) ?? selectedNode} prompt={question.prompt} />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
