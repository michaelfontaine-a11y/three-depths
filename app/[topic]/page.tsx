import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import LevelDoor from "@/components/LevelDoor";
import { renderTitleWithEmphasis } from "@/components/ContentRenderer";
import { getTopicBySlug, topics } from "@/content/topics/_index";
import { LEVEL_ORDER } from "@/lib/types";

interface Params {
  params: { topic: string };
}

export function generateStaticParams() {
  return topics.map((t) => ({ topic: t.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const topic = getTopicBySlug(params.topic);
  if (!topic) return { title: "Not Found" };
  return {
    title: `${topic.title} — Three Depths`,
    description: topic.subtitle,
  };
}

export default function TopicPage({ params }: Params) {
  const topic = getTopicBySlug(params.topic);
  if (!topic) notFound();

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-5 md:px-8 pt-8">
        <Link
          href="/"
          className="font-caps text-[0.72rem] tracking-[0.3em] text-ink-muted hover:text-ink transition-colors"
        >
          ← THREE DEPTHS
        </Link>
      </div>

      <header className="max-w-5xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-10 text-center">
        {topic.latinTag && (
          <div
            className="font-caps text-[0.8rem] tracking-[0.4em] mb-6"
            style={{ color: "#8C6F2C" }}
          >
            {topic.latinTag}
          </div>
        )}
        <h1 className="font-display text-[3rem] md:text-[4.5rem] leading-[1.05] text-ink mb-6">
          {renderTitleWithEmphasis(topic.title, topic.titleEmphasis, "#6B2020")}
        </h1>
        <div
          className="mx-auto w-20 h-px my-6"
          style={{ background: "linear-gradient(to right, transparent, #8C6F2C, transparent)" }}
        />
        <p className="font-body text-[1.15rem] md:text-[1.3rem] leading-[1.65] text-ink-soft max-w-2xl mx-auto italic">
          {topic.subtitle}
        </p>
      </header>

      <section className="max-w-5xl mx-auto px-5 md:px-8 pb-16">
        <div className="text-center mb-10">
          <div className="font-caps text-[0.78rem] tracking-[0.32em] text-ink-muted mb-3">
            · CHOOSE YOUR DEPTH ·
          </div>
          <h2 className="font-display text-[1.6rem] md:text-[2rem] text-ink italic">
            Three doors. The same truth.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {LEVEL_ORDER.map((key) => {
            const level = topic.levels[key];
            return (
              <LevelDoor
                key={key}
                topicSlug={topic.slug}
                levelKey={key}
                firstScreenTitle={level.screens[0].title}
                screenCount={level.screens.length}
              />
            );
          })}
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-5 md:px-8 pb-16 text-center">
        <div
          className="mx-auto w-12 h-px mb-4"
          style={{ background: "linear-gradient(to right, transparent, #8C6F2C, transparent)" }}
        />
        <p className="font-caps text-[0.7rem] tracking-[0.3em] text-ink-muted">
          ❦
        </p>
      </footer>
    </div>
  );
}
