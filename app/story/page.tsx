import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { stories } from "@/lib/story";

export const metadata: Metadata = {
  title: "系统演进故事",
  description: "后端与前端两条工程演进路线，按工程现场顺序写。"
};

export default function StoryIndexPage() {
  const list = Object.values(stories);

  return (
    <main className="story-index">
      <header className="story-index-header">
        <div className="story-kicker">
          <BookOpen size={14} />
          阅读器
        </div>
        <h1>系统演进故事</h1>
        <p>选一篇往下读。每篇按工程现场里的顺序：先跑起来，再被流量、人手和工具逼着改。</p>
      </header>

      <ul className="story-index-list">
        {list.map((story) => (
          <li key={story.slug}>
            <Link href={`/story/${story.slug}`} className="story-card">
              <div className="story-card-title">
                {story.title}
                <ArrowRight size={16} />
              </div>
              <p className="story-card-subtitle">{story.subtitle}</p>
              <div className="story-card-meta">
                <span>{story.readTime}</span>
                <span>共 {story.chapters.length} 章</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}