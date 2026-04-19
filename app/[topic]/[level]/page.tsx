import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LessonClient from "@/components/LessonClient";
import { getTopicBySlug, topics } from "@/content/topics/_index";
import { LEVEL_ORDER, type LevelKey } from "@/lib/types";

interface Params {
  params: { topic: string; level: string };
}

export function generateStaticParams() {
  return topics.flatMap((t) =>
    LEVEL_ORDER.map((level) => ({ topic: t.slug, level })),
  );
}

function isLevelKey(v: string): v is LevelKey {
  return v === "child" || v === "teen" || v === "adult";
}

export function generateMetadata({ params }: Params): Metadata {
  const topic = getTopicBySlug(params.topic);
  if (!topic || !isLevelKey(params.level)) return { title: "Not Found" };
  const lvl = topic.levels[params.level];
  return {
    title: `${topic.title} · ${lvl.label} — Three Depths`,
    description: topic.subtitle,
  };
}

export default function LessonPage({ params }: Params) {
  const topic = getTopicBySlug(params.topic);
  if (!topic) notFound();
  if (!isLevelKey(params.level)) notFound();

  return <LessonClient topic={topic} levelKey={params.level} />;
}
