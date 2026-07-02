import type { Node } from "@/lib/types";
import webSystem from "@/data/system/web-system.json";
import frontend from "@/data/system/frontend.json";
import backend from "@/data/system/backend.json";
import database from "@/data/system/database.json";
import network from "@/data/system/network.json";
import infra from "@/data/system/infra.json";
import problems from "@/data/problems/problems.json";
import solutions from "@/data/solutions/solutions.json";

const modules: Node[] = [
  webSystem as Node,
  frontend as Node,
  backend as Node,
  database as Node,
  network as Node,
  infra as Node,
  problems as Node,
  solutions as Node
];

function mergeChildren(root: Node, children: Node[]): Node {
  return {
    ...root,
    children: [...(root.children ?? []), ...children]
  };
}

export const atlasRoot: Node = mergeChildren(webSystem as Node, [
  frontend as Node,
  backend as Node,
  database as Node,
  network as Node,
  infra as Node,
  problems as Node,
  solutions as Node
]);

export const sourceModules = modules;
