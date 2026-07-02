"use client";

import { ChevronDown, Eye } from "lucide-react";
import type { GraphNode } from "@/lib/types";
import { buildInterviewAnswer } from "@/lib/interview-answer";

type InterviewAnswerProps = {
  node: Pick<GraphNode, "id" | "title" | "description" | "systemRole" | "problemSolved" | "tradeOffs" | "tags" | "type">;
  prompt: string;
  compact?: boolean;
};

export function InterviewAnswer({ node, prompt, compact = false }: InterviewAnswerProps) {
  const answer = buildInterviewAnswer(node, prompt);

  return (
    <details className="answer-reveal" data-compact={compact || undefined}>
      <summary className="answer-summary">
        <span className="answer-summary-label">
          <Eye size={14} />
          答案
        </span>
        <ChevronDown size={14} />
      </summary>
      <div className="answer-body">
        <p className="answer-summary-text">{answer.summary}</p>
        <ul className="answer-list">
          {answer.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {answer.keyPoints && answer.keyPoints.length > 0 ? (
          <div className="answer-keypoints">
            <p className="answer-keypoints-label">需要弄清的知识点</p>
            <ul className="answer-keypoints-list">
              {answer.keyPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}
