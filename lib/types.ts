export type NodeType = "root" | "domain" | "concept" | "problem" | "solution";

export type Node = {
  id: string;
  title: string;
  description?: string;
  type: NodeType;
  systemRole?: string;
  problemSolved?: string;
  tradeOffs?: string[];
  children?: Node[];
  tags?: string[];
  links?: string[];
};

export type GraphNode = Node & {
  parentId?: string;
  depth: number;
  path: string[];
};

export type GraphEdge = {
  from: string;
  to: string;
  kind: "tree" | "cross";
};
