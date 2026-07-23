"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight, Home, Search, Sigma, Layers3, Filter, RefreshCcw, BriefcaseBusiness, BookOpen, GitBranch } from "lucide-react";
import { atlasRoot } from "@/lib/graph-data";
import { buildIndex, buildSearch, findNode, getModeRoot, pathToNode } from "@/lib/graph";
import { useAtlasStore } from "@/lib/use-atlas-store";
import { KnowledgeScene } from "@/components/knowledge-scene";
import { DetailPanel } from "@/components/detail-panel";
import type { GraphNode } from "@/lib/types";

const index = buildIndex(atlasRoot);
const searchIndex = buildSearch(atlasRoot);
const TYPE_LABELS: Record<string, string> = {
  root: "根节点",
  domain: "领域",
  concept: "概念",
  problem: "问题",
  solution: "方案"
};

export function SystemAtlasApp() {
  const mode = useAtlasStore((state) => state.mode);
  const selectedId = useAtlasStore((state) => state.selectedId);
  const query = useAtlasStore((state) => state.query);
  const setMode = useAtlasStore((state) => state.setMode);
  const setSelectedId = useAtlasStore((state) => state.setSelectedId);
  const setQuery = useAtlasStore((state) => state.setQuery);
  const setZoom = useAtlasStore((state) => state.setZoom);
  const [isPending, startTransition] = useTransition();
  const [split, setSplit] = useState(64);
  const [isCompact, setIsCompact] = useState(false);
  const shellRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startSplit: number }>({ active: false, startX: 0, startSplit: 64 });

  const activeRoot = useMemo(() => getModeRoot(atlasRoot, mode), [mode]);
  const selectedNode = useMemo<GraphNode>(() => {
    const rootNode = index.map.get(activeRoot.id);
    if (!rootNode) {
      throw new Error(`无法定位根节点: ${activeRoot.id}`);
    }
    if (!selectedId) return rootNode;
    return index.map.get(selectedId) ?? (findNode(atlasRoot, selectedId) as GraphNode | undefined) ?? rootNode;
  }, [activeRoot, selectedId]);

  const selectedPath = useMemo(() => pathToNode(atlasRoot, selectedNode.id), [selectedNode.id]);
  const pathTitles = useMemo(() => selectedPath.map((id) => index.map.get(id)?.title ?? id), [selectedPath]);
  const linkTitles = useMemo(
    () =>
      Object.fromEntries(
        Array.from(index.map.values()).flatMap((node) =>
          (node.links ?? []).map((link) => [link, index.map.get(link)?.title ?? link] as const)
        )
      ),
    []
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchIndex.search(query).slice(0, 8).map((item) => item.item);
  }, [query]);

  const handleMode = (nextMode: typeof mode) => {
    startTransition(() => {
      setMode(nextMode);
      const root = getModeRoot(atlasRoot, nextMode);
      setSelectedId(root.id);
      setQuery("");
      setZoom(1);
    });
  };

  const handleWheel = (delta: number) => {
    const next = Math.min(2.2, Math.max(0.8, useAtlasStore.getState().zoom + delta));
    setZoom(next);
  };

  const handleBack = () => {
    if (selectedPath.length > 1) {
      setSelectedId(selectedPath[selectedPath.length - 2]);
    }
  };

  const handleHome = () => {
    setSelectedId(activeRoot.id);
    setZoom(1);
  };

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!dragRef.current.active || !shellRef.current) return;
      const rect = shellRef.current.getBoundingClientRect();
      const ratio = ((event.clientX - rect.left) / rect.width) * 100;
      setSplit(Math.min(74, Math.max(46, ratio)));
    };

    const up = () => {
      dragRef.current.active = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    const updateCompact = () => setIsCompact(window.innerWidth <= 1024);
    updateCompact();
    window.addEventListener("resize", updateCompact);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("resize", updateCompact);
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <h1>系统图谱</h1>
          <p>面向高可靠 Web 系统构建的系统化知识图谱。</p>
        </div>
        <div className="toolbar">
          <button className="chip" onClick={handleBack} disabled={selectedPath.length <= 1}>
            <ArrowLeft size={15} /> 返回上级
          </button>
          <button className="chip" onClick={handleHome}>
            <Home size={15} /> 回到根节点
          </button>
          <button className="chip" data-active={mode === "system"} onClick={() => handleMode("system")}>
            <Layers3 size={15} /> 系统视图
          </button>
          <button className="chip" data-active={mode === "problem"} onClick={() => handleMode("problem")}>
            <Filter size={15} /> 问题模式
          </button>
          <button className="chip" data-active={mode === "solution"} onClick={() => handleMode("solution")}>
            <Sigma size={15} /> 方案模式
          </button>
          <Link className="chip" href="/interview">
            <BriefcaseBusiness size={15} /> 面试页
          </Link>
          <Link className="chip" href="/story">
            <BookOpen size={15} /> 故事
          </Link>
          <Link className="chip" href="/evolution">
            <GitBranch size={15} /> 演化史
          </Link>
          <button className="icon-button" onClick={() => handleMode(mode)} title="重置当前模式">
            <RefreshCcw size={15} />
          </button>
          <div style={{ position: "relative", flex: "1 1 16rem" }}>
            <Search size={14} style={{ position: "absolute", left: "0.85rem", top: "0.63rem", color: "var(--muted)" }} />
            <input
              className="search-input"
              placeholder="搜索标题、标签、问题..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              style={{ paddingLeft: "2.1rem", width: "100%" }}
            />
          </div>
          <button className="chip" data-active={isPending} onClick={() => setSelectedId(activeRoot.id)}>
            <ArrowLeftRight size={15} /> 聚焦当前根节点
          </button>
        </div>
      </header>

      <main
        ref={shellRef}
        className="content"
        style={isCompact ? undefined : { gridTemplateColumns: `${split}fr 10px ${100 - split}fr` }}
      >
        <section className="scene-shell">
          <KnowledgeScene
            root={activeRoot}
            selectedId={selectedNode.id}
            onSelect={(id) => setSelectedId(id)}
            onBack={handleBack}
            onWheel={handleWheel}
          />
          <div className="scene-overlay">
            <div className="hint">
              <h2>操作说明</h2>
              <p>滚轮缩放，拖动画布平移，点击节点进入子树，右键或使用“返回上级”按钮回退。</p>
            </div>
            {results.length > 0 ? (
              <div className="results result-panel">
                <h3>搜索结果</h3>
                {results.map((node) => (
                  <button key={node.id} onClick={() => setSelectedId(node.id)}>
                    <strong>{node.title}</strong>
                    <small>{node.systemRole ?? node.description ?? TYPE_LABELS[node.type] ?? node.type}</small>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="footer-note">当前路径：{pathTitles.join(" / ")}</div>
        </section>

        {!isCompact ? (
          <div
            className="splitter"
            onPointerDown={(event) => {
              event.preventDefault();
              dragRef.current.active = true;
              dragRef.current.startX = event.clientX;
              dragRef.current.startSplit = split;
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
              (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
            }}
          >
            <span />
          </div>
        ) : null}

        <DetailPanel root={atlasRoot} node={selectedNode} linkTitles={linkTitles} />
      </main>
    </div>
  );
}
