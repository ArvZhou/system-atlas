import story from "@/data/articles/backend-evolution.json";

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

export const backendEvolutionStory = story as StoryDocument;
