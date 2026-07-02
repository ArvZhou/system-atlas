import Fuse from "fuse.js";
import type { GraphEdge, GraphNode, Node } from "@/lib/types";

export type Mode = "system" | "problem" | "solution";

export type PositionedNode = GraphNode & {
  position: [number, number, number];
  size: number;
  color: string;
  visible: boolean;
  focusWeight: number;
};

const COLOR_MAP: Record<string, string> = {
  root: "#7dd3fc",
  domain: "#4de0c9",
  concept: "#8ec5ff",
  problem: "#ff6b6b",
  solution: "#52f0a1"
};

const DEPTH_Y_SPACING = 5.6;
const NODE_X_SPACING = 4.4;
const NODE_Z_SPACING = 1.4;

export function flattenTree(node: Node, parentId?: string, depth = 0, path: string[] = []): GraphNode[] {
  const current: GraphNode = {
    ...node,
    parentId,
    depth,
    path: [...path, node.id]
  };

  return [
    current,
    ...(node.children ?? []).flatMap((child) =>
      flattenTree(child, node.id, depth + 1, current.path)
    )
  ];
}

export function buildIndex(root: Node) {
  const flat = flattenTree(root);
  const map = new Map(flat.map((node) => [node.id, node]));
  const edges: GraphEdge[] = [];

  for (const node of flat) {
    if (node.parentId) {
      edges.push({ from: node.parentId, to: node.id, kind: "tree" });
    }

    for (const link of node.links ?? []) {
      if (map.has(link)) {
        edges.push({ from: node.id, to: link, kind: "cross" });
      }
    }
  }

  return { flat, map, edges };
}

export function getModeRoot(root: Node, mode: Mode): Node {
  if (mode === "system") {
    return root;
  }

  const targetId = mode === "problem" ? "problem-space" : "solution-space";
  const found = flattenTree(root).find((node) => node.id === targetId);
  return found ?? root;
}

function colorForNode(node: GraphNode): string {
  return COLOR_MAP[node.type] ?? "#8ec5ff";
}

function sizeForNode(node: GraphNode): number {
  if (node.type === "root") return 1.35;
  if (node.depth === 1) return 0.86;
  if (node.depth === 2) return 0.6;
  if (node.depth === 3) return 0.42;
  if (node.depth >= 4) return 0.3;
  return 0.55;
}

function hasRelevantTag(node: GraphNode, mode: Mode): boolean {
  if (mode === "system") return true;
  const tags = new Set([...(node.tags ?? []), node.type, ...(node.title ? [node.title.toLowerCase()] : [])]);
  if (mode === "problem") {
    return node.type === "problem" || [...tags].some((tag) => /问题|故障|性能|死锁|并发|安全|一致性|延迟|瓶颈/.test(tag));
  }

  return node.type === "solution" || [...tags].some((tag) => /方案|缓存|负载均衡|分片|CDN|Redis|平衡|修复|优化/.test(tag));
}

export function buildLayout(root: Node, mode: Mode, focusId?: string) {
  const index = buildIndex(root);
  const baseRoot = getModeRoot(root, mode);
  const anchorId = focusId ?? baseRoot.id;
  const anchor = index.flat.find((node) => node.id === anchorId) ?? index.flat.find((node) => node.id === baseRoot.id);
  if (!anchor) {
    throw new Error(`Unable to resolve layout anchor: ${anchorId}`);
  }
  const nodes = flattenTree(anchor);
  const map = new Map(nodes.map((node) => [node.id, node]));
  const positionMap = new Map<string, PositionedNode>();
  const nodesByDepth = new Map<number, GraphNode[]>();
  for (const node of nodes) {
    const list = nodesByDepth.get(node.depth) ?? [];
    list.push(node);
    nodesByDepth.set(node.depth, list);
  }

  const positioned: PositionedNode[] = [];
  const edges: GraphEdge[] = [];

  for (const [depth, depthNodes] of nodesByDepth.entries()) {
    const width = Math.max(1, depthNodes.length - 1);
    depthNodes.forEach((node, index) => {
      const spread = (index - width / 2) * NODE_X_SPACING;
      const lane = (index % 2 === 0 ? -1 : 1) * (depth * 0.35);
      const position: [number, number, number] = [
        spread,
        -depth * DEPTH_Y_SPACING,
        lane * NODE_Z_SPACING
      ];
      const focusWeight = anchor.path.includes(node.id) ? 1 : node.depth <= 1 ? 0.72 : 0.46;
      const visible =
        node.type === "root" ||
        (anchor.path.includes(node.id) || node.depth <= 1 || (node.depth === 2 && node.parentId === anchor.id)) && hasRelevantTag(node, mode);
      positioned.push({
        ...node,
        position,
        size: sizeForNode(node),
        color: colorForNode(node),
        visible,
        focusWeight
      });
      positionMap.set(node.id, positioned[positioned.length - 1]);
    });
  }

  for (const node of nodes) {
    if (node.parentId && map.has(node.parentId)) {
      edges.push({ from: node.parentId, to: node.id, kind: "tree" });
    }
  }

  for (const node of nodes) {
    for (const link of node.links ?? []) {
      if (map.has(link)) {
        edges.push({ from: node.id, to: link, kind: "cross" });
      }
    }
  }

  return { anchor, positioned, edges, map, positionMap };
}

export function buildSearch(root: Node) {
  const flat = flattenTree(root);
  return new Fuse(flat, {
    keys: ["title", "description", "tags", "problemSolved", "systemRole"],
    threshold: 0.32,
    ignoreLocation: true
  });
}

export function findNode(root: Node, id: string): Node | undefined {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop()!;
    if (node.id === id) return node;
    for (const child of node.children ?? []) stack.push(child);
  }
  return undefined;
}

export function pathToNode(root: Node, id: string): string[] {
  const walk = (node: Node, path: string[]): string[] | null => {
    if (node.id === id) return [...path, node.id];
    for (const child of node.children ?? []) {
      const result = walk(child, [...path, node.id]);
      if (result) return result;
    }
    return null;
  };

  return walk(root, []) ?? [];
}
