import type { Metadata } from "next";
import { StoryReader } from "@/components/story-reader";
import { backendEvolutionStory } from "@/lib/story";

export const metadata: Metadata = {
  title: "后端架构故事",
  description: "一个从单体到平台化的后端系统演进故事。"
};

export default function StoryPage() {
  return <StoryReader story={backendEvolutionStory} />;
}
