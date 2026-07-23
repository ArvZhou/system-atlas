import type { Metadata } from "next";
import { EvolutionApp } from "@/components/evolution-app";

export const metadata: Metadata = {
  title: "技术演化长河",
  description: "以演化史理解技术：每一步遇到什么瓶颈、探索过哪些思路、最终接受了什么方案，以及常见面试题。"
};

export default function EvolutionPage() {
  return <EvolutionApp />;
}
