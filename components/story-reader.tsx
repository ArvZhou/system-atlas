"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Home, Minus, Plus, BriefcaseBusiness, ChevronLeft } from "lucide-react";
import type { StoryDocument } from "@/lib/story";

type StoryReaderProps = {
  story: StoryDocument;
};

const SCALE_STEPS = [1, 1.06, 1.12];

export function StoryReader({ story }: StoryReaderProps) {
  const [scaleIndex, setScaleIndex] = useState(0);
  const scale = SCALE_STEPS[scaleIndex];

  const toc = useMemo(
    () =>
      story.chapters.map((chapter) => ({
        id: chapter.id,
        label: `${chapter.year} · ${chapter.title}`
      })),
    [story.chapters]
  );

  return (
    <div className="story-shell">
      <header className="story-topbar">
        <div className="story-brand">
          <div className="story-kicker">
            <BookOpen size={14} />
            阅读器
          </div>
          <h1>{story.title}</h1>
          <p>{story.subtitle}</p>
        </div>

        <div className="toolbar">
          <Link className="chip" href="/story">
            <ChevronLeft size={15} /> 故事目录
          </Link>
          <Link className="chip" href="/">
            <Home size={15} /> 首页
          </Link>
          <Link className="chip" href="/interview">
            <BriefcaseBusiness size={15} /> 面试页
          </Link>
          <button
            className="icon-button"
            type="button"
            onClick={() => setScaleIndex((current) => Math.max(0, current - 1))}
            disabled={scaleIndex === 0}
            aria-label="缩小字号"
          >
            <Minus size={15} />
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setScaleIndex((current) => Math.min(SCALE_STEPS.length - 1, current + 1))}
            disabled={scaleIndex === SCALE_STEPS.length - 1}
            aria-label="放大字号"
          >
            <Plus size={15} />
          </button>
        </div>
      </header>

      <main className="story-layout">
        <aside className="story-sidebar">
          <div className="story-meta-row">
            <span className="story-badge">{story.readTime}</span>
            {story.tags.map((tag) => (
              <span className="story-badge" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <nav className="story-toc" aria-label="章节目录">
            <p className="story-toc-title">目录</p>
            {toc.map((item) => (
              <a className="story-toc-item" key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="story-article" style={{ fontSize: `${scale}rem` }}>
          <section className="story-hero">
            <p className="story-hero-label">虚构故事，基于真实工程经验整理</p>
            <h2>一条业务线，二十年，七八次真正的拐弯</h2>
            <p className="story-hero-copy">
              这个故事不是为了炫技，而是想把后端系统在不同阶段真实会遇到的问题，按时间顺序讲清楚。
              从单体、缓存、异步、微服务，到容器化、可观测性和多地域，真正改变系统的，从来不是某个名词，而是问题的大小变了。
            </p>
          </section>

          <div className="story-body">
            {story.chapters.map((chapter) => (
              <section className="story-chapter" id={chapter.id} key={chapter.id}>
                <div className="story-chapter-head">
                  <div>
                    <p className="story-chapter-year">{chapter.year}</p>
                    <h3>{chapter.title}</h3>
                  </div>
                  <p className="story-chapter-summary">{chapter.summary}</p>
                </div>

                {chapter.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                <div className="story-block">
                  <p className="story-block-label">当时的技术动作</p>
                  <ul className="story-list">
                    {chapter.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="story-callout">
                  <p className="story-callout-label">{chapter.incident.title}</p>
                  <p>{chapter.incident.detail}</p>
                </div>

                <p className="story-lesson">{chapter.lesson}</p>
              </section>
            ))}
          </div>
        </article>
      </main>
    </div>
  );
}
