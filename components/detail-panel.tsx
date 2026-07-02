"use client";

import Link from "next/link";
import type { GraphNode, Node } from "@/lib/types";
import { flattenTree } from "@/lib/graph";
import { buildDetailSections } from "@/lib/knowledge-notes";
import { buildInterviewGroups } from "@/lib/interview-bank";
import { InterviewAnswer } from "@/components/interview-answer";

type DetailPanelProps = {
  root: Node;
  node: GraphNode;
  linkTitles?: Record<string, string>;
};

const TYPE_LABELS: Record<Node["type"], string> = {
  root: "根节点",
  domain: "领域",
  concept: "概念",
  problem: "问题",
  solution: "方案"
};

export function DetailPanel({ root, node, linkTitles }: DetailPanelProps) {
  const detailSections = buildDetailSections(node);
  const interviewGroups = buildInterviewGroups(root, node);
  const nodeMap = new Map(flattenTree(root).map((item) => [item.id, item] as const));

  return (
    <aside className="detail-panel">
      <div className="detail-head">
        <div>
          <span className="detail-kicker">{TYPE_LABELS[node.type]}</span>
          <h2 style={{ margin: "0.35rem 0 0.45rem", fontSize: "1.2rem" }}>{node.title}</h2>
        </div>
        <Link className="chip" href="/interview">
          去面试页
        </Link>
      </div>
      <p style={{ marginBottom: "1rem" }}>{node.description ?? node.systemRole ?? "暂无描述。"}</p>

      <div className="detail-grid">
        {detailSections.map((section) => (
          <section className="detail-block" key={section.title}>
            <p className="detail-label">{section.title}</p>
            <p>{section.body}</p>
          </section>
        ))}

        <section className="detail-block">
          <p className="detail-label">权衡</p>
          {node.tradeOffs?.length ? (
            <ul className="detail-list">
              {node.tradeOffs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>暂无权衡项。</p>
          )}
        </section>

        <section className="detail-block">
          <p className="detail-label">标签</p>
          <div className="meta-row">
            {node.tags?.length ? node.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>) : <span className="tag">无</span>}
          </div>
        </section>

        <section className="detail-block">
          <p className="detail-label">跨节点关联</p>
          {node.links?.length ? (
            <ul className="detail-list">
              {node.links.map((link) => (
                <li key={link}>{linkTitles?.[link] ?? link}</li>
              ))}
            </ul>
          ) : (
            <p>暂无跨节点关联。</p>
          )}
        </section>

        <section className="detail-block">
          <p className="detail-label">面试题</p>
          <div className="interview-preview">
            {interviewGroups.map((group) => (
              <details key={group.nodeId} open={group.nodeId === node.id}>
                <summary>{group.title}</summary>
                {group.sections.map((section) => (
                  <div key={section.title} style={{ marginTop: "0.55rem" }}>
                    <p className="detail-label" style={{ marginBottom: "0.35rem" }}>{section.title}</p>
                    <div className="question-stack">
                      {section.questions.map((question) => (
                        <div className="question-preview" key={question.id}>
                          <p className="question-preview-title">{question.prompt}</p>
                          <InterviewAnswer node={nodeMap.get(group.nodeId) ?? node} prompt={question.prompt} compact />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </details>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
