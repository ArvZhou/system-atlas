import { StoryReader } from "@/components/story-reader";
import { stories, type StorySlug } from "@/lib/story";

export function generateStaticParams() {
  return Object.keys(stories).map((slug) => ({ slug }));
}

export default async function StoryChapterPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = stories[slug as StorySlug];
  if (!story) return null;
  
  return <StoryReader story={story} />;
}
