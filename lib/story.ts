import backendStory from "@/data/articles/backend-evolution.json";
import frontendStory from "@/data/articles/frontend-evolution.json";

export type StoryIncident = {
  title: string;
  detail: string;
};

export type StoryChapter = {
  id: string;
  year: string;
  title: string;
  summary: string;
  paragraphs: string[];
  bullets: string[];
  incident: StoryIncident;
  lesson: string;
};

export type StoryDocument = {
  title: string;
  subtitle: string;
  readTime: string;
  tags: string[];
  chapters: StoryChapter[];
};

export const backendEvolutionStory = backendStory as StoryDocument;
export const frontendEvolutionStory = frontendStory as StoryDocument;

export type StorySlug = "backend" | "frontend";

export const stories: Record<StorySlug, StoryDocument & { slug: StorySlug }> = {
  backend: { ...(backendEvolutionStory as StoryDocument & { slug: StorySlug }), slug: "backend" },
  frontend: { ...(frontendEvolutionStory as StoryDocument & { slug: StorySlug }), slug: "frontend" }
};
