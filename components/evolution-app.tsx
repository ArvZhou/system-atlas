"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, GitBranch, Lightbulb, TriangleAlert, CheckCircle2, MessageCircleQuestion } from "lucide-react";
import { evolutionTracks, verdictMeta } from "@/lib/evolution-data";
import { EvolutionScene } from "@/components/evolution-scene";

export function EvolutionApp() {
  const [trackId, setTrackId] = useState(evolutionTracks[0].id);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const track = useMemo(
    () => evolutionTracks.find((t) => t.id === trackId) ?? evolutionTracks[0],
    [trackId]
  );
  const stage = track.stages[selectedIndex] ?? track.stages[0];
  const accent = track.accent;

  const changeTrack = (id: string) => {
    setTrackId(id);
    setSelectedIndex(0);
  };

  const go = (delta: number) => {
    setSelectedIndex((i) => Math.min(track.stages.length - 1, Math.max(0, i + delta)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") go(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.stages.length]);

  return (
    <div className="evo-shell" style={{ ["--evo-accent" as string]: accent }}>
      <header className="evo-topbar">
        <div className="evo-brand">
          <Link className="evo-back" href="/">
            <ArrowLeft size={15} /> 图谱
          </Link>
          <div>
            <div className="evo-kicker">
              <GitBranch size={13} /> 技术演化史
            </div>
            <h1>技术演化长河</h1>
          </div>
        </div>
        <nav className="evo-tracks">
          {evolutionTracks.map((t) => (
            <button
              key={t.id}
              className="evo-track-chip"
              data-active={t.id === trackId}
              style={t.id === trackId ? { ["--evo-accent" as string]: t.accent } : undefined}
              onClick={() => changeTrack(t.id)}
            >
              <span className="evo-track-dot" style={{ background: t.accent }} />
              {t.name}
            </button>
          ))}
        </nav>
      </header>

      <div className="evo-subtitle-bar">
        <p>{track.subtitle}</p>
      </div>

      <main className="evo-main">
        <section className="evo-scene">
          <EvolutionScene
            stages={track.stages}
            selectedIndex={selectedIndex}
            accent={accent}
            onSelect={setSelectedIndex}
          />

          <div className="evo-scene-hint">
            拖动旋转 · 滚轮缩放 · 点击节点或用 ← → 沿长河前进
          </div>

          {/* 时间轴导航 */}
          <div className="evo-rail">
            <button className="evo-rail-nav" onClick={() => go(-1)} disabled={selectedIndex === 0} title="上一步">
              <ChevronLeft size={16} />
            </button>
            <div className="evo-rail-track">
              <div
                className="evo-rail-fill"
                style={{ width: `${(selectedIndex / Math.max(1, track.stages.length - 1)) * 100}%`, background: accent }}
              />
              {track.stages.map((s, i) => (
                <button
                  key={s.id}
                  className="evo-rail-dot"
                  data-active={i === selectedIndex}
                  data-passed={i < selectedIndex}
                  style={{ left: `${(i / Math.max(1, track.stages.length - 1)) * 100}%` }}
                  onClick={() => setSelectedIndex(i)}
                  title={`${s.index} · ${s.title}`}
                >
                  <span className="evo-rail-tip">{s.title}</span>
                </button>
              ))}
            </div>
            <button
              className="evo-rail-nav"
              onClick={() => go(1)}
              disabled={selectedIndex === track.stages.length - 1}
              title="下一步"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

        <aside className="evo-panel" key={`${track.id}-${stage.id}`}>
          <div className="evo-panel-head">
            <div className="evo-panel-index" style={{ color: accent }}>
              {stage.index} / {String(track.stages.length).padStart(2, "0")}
            </div>
            <span className="evo-panel-era">{stage.era}</span>
          </div>

          <h2 className="evo-panel-title">{stage.title}</h2>
          <div className="evo-trigger" style={{ borderColor: `${accent}55` }}>
            <span className="evo-trigger-arrow" style={{ color: accent }}>
              ↓
            </span>
            {stage.trigger}
          </div>

          <section className="evo-block evo-block--bottleneck">
            <div className="evo-block-label">
              <TriangleAlert size={14} /> 遇到的瓶颈
            </div>
            <p>{stage.bottleneck}</p>
          </section>

          <section className="evo-block">
            <div className="evo-block-label">
              <Lightbulb size={14} /> 探索过的思路
            </div>
            <ul className="evo-ideas">
              {stage.ideas.map((idea) => (
                <li key={idea.name} className="evo-idea" data-verdict={idea.verdict}>
                  <div className="evo-idea-head">
                    <span className="evo-idea-name">{idea.name}</span>
                    <span className="evo-idea-badge" style={{ color: verdictMeta[idea.verdict].color, borderColor: `${verdictMeta[idea.verdict].color}55` }}>
                      {verdictMeta[idea.verdict].label}
                    </span>
                  </div>
                  <p>{idea.desc}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="evo-block evo-block--solution" style={{ borderColor: `${accent}44` }}>
            <div className="evo-block-label" style={{ color: accent }}>
              <CheckCircle2 size={14} /> 最终被接受的方案
            </div>
            <p>{stage.solution}</p>
            <p className="evo-essence" style={{ color: accent }}>
              {stage.essence}
            </p>
          </section>

          <section className="evo-block">
            <div className="evo-block-label">
              <MessageCircleQuestion size={14} /> 常见面试题
            </div>
            <div className="evo-questions">
              {stage.questions.map((item, i) => (
                <details key={i} className="evo-question">
                  <summary>
                    <span className="evo-q-mark" style={{ color: accent }}>
                      Q
                    </span>
                    {item.q}
                  </summary>
                  <div className="evo-answer">
                    <p>{item.a}</p>
                    {item.points && item.points.length > 0 && (
                      <div className="evo-points">
                        {item.points.map((p) => (
                          <span key={p} className="evo-point" style={{ borderColor: `${accent}44` }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {stage.tags && (
            <div className="evo-tags">
              {stage.tags.map((t) => (
                <span key={t} className="evo-tag">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="evo-panel-nav">
            <button onClick={() => go(-1)} disabled={selectedIndex === 0}>
              <ChevronLeft size={15} /> 上一阶段
            </button>
            <button onClick={() => go(1)} disabled={selectedIndex === track.stages.length - 1}>
              下一阶段 <ChevronRight size={15} />
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
