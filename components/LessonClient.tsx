"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { LevelKey, Topic } from "@/lib/types";
import { LEVEL_META } from "@/lib/types";
import ContentRenderer, { renderTitleWithEmphasis } from "./ContentRenderer";
import ProgressDots from "./ProgressDots";

interface Props {
  topic: Topic;
  levelKey: LevelKey;
}

export default function LessonClient({ topic, levelKey }: Props) {
  const router = useRouter();
  const level = topic.levels[levelKey];
  const meta = LEVEL_META[levelKey];
  const total = level.screens.length;

  const [index, setIndex] = useState(0);
  const screen = level.screens[index];

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total) return;
      setIndex(next);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [total],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        router.push("/");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, go, router]);

  const progressLabel = useMemo(
    () => `${index + 1} / ${total}`,
    [index, total],
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-20 bg-parchment/95 backdrop-blur-sm border-b border-parchment-shadow/60"
        style={{ borderBottomColor: `${meta.accent}30` }}
      >
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-4">
          <Link
            href={`/${topic.slug}`}
            className="font-caps text-[0.75rem] tracking-[0.3em] text-ink-muted hover:text-ink transition-colors"
            aria-label="Back to topic"
          >
            ← {topic.title.toUpperCase()}
          </Link>
          <div
            className="hidden md:block font-caps text-[0.72rem] tracking-[0.3em]"
            style={{ color: meta.accentDeep }}
          >
            {meta.label}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-caps text-[0.72rem] tracking-[0.25em] text-ink-muted">
              {progressLabel}
            </span>
            <ProgressDots
              total={total}
              current={index}
              accent={meta.accent}
              accentDeep={meta.accentDeep}
              onJump={go}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <article className="max-w-prose mx-auto px-5 md:px-8 py-10 md:py-16 pb-40">
          {screen.illustration && (
            <figure
              className="mb-10 -mx-2 md:-mx-6 relative"
              style={{
                filter: `drop-shadow(0 18px 32px ${meta.accentDeep}22)`,
              }}
            >
              <div
                className="relative overflow-hidden rounded-sm"
                style={{
                  border: `1px solid ${meta.accent}55`,
                  boxShadow: `inset 0 0 0 4px #FBF6E8, inset 0 0 0 5px ${meta.accent}60`,
                  padding: "6px",
                  background: "#FBF6E8",
                }}
              >
                <Image
                  src={screen.illustration}
                  alt={screen.illustrationAlt ?? screen.title}
                  width={1024}
                  height={1024}
                  sizes="(min-width: 780px) 780px, 100vw"
                  className="w-full h-auto block rounded-sm"
                  priority={index === 0}
                />
              </div>
              <figcaption
                className="sr-only"
                aria-hidden={false}
              >
                {screen.illustrationAlt ?? screen.title}
              </figcaption>
            </figure>
          )}

          <div className="mb-10">
            {screen.eyebrow && (
              <div
                className="font-caps text-[0.78rem] tracking-[0.32em] mb-4"
                style={{ color: meta.accentDeep }}
              >
                {screen.eyebrow}
              </div>
            )}
            <div className="flex items-baseline gap-4 mb-3">
              <span
                className="font-display text-[2.5rem] leading-none"
                style={{ color: meta.accentDeep, opacity: 0.5 }}
              >
                {screen.num}
              </span>
              <span
                className="h-px flex-1 mb-2"
                style={{ backgroundColor: `${meta.accent}50` }}
              />
            </div>
            <h1 className="font-display text-[2.6rem] md:text-[3rem] leading-[1.1] text-ink">
              {renderTitleWithEmphasis(
                screen.title,
                screen.titleEmphasis,
                meta.accentDeep,
              )}
            </h1>
          </div>

          <ContentRenderer
            markdown={screen.contentMarkdown}
            accent={meta.accent}
            accentDeep={meta.accentDeep}
          />
        </article>
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-20 bg-parchment/95 backdrop-blur-sm border-t border-parchment-shadow/60"
        style={{ borderTopColor: `${meta.accent}30` }}
      >
        <div className="max-w-5xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="font-caps text-[0.78rem] tracking-[0.3em] px-5 py-3 border border-parchment-shadow/70 bg-cream text-ink-soft rounded-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:border-ink-muted"
          >
            ← PREV
          </button>
          <div className="hidden sm:block font-caps text-[0.7rem] tracking-[0.28em] text-ink-muted">
            {index === total - 1 ? "FINAL SCREEN" : `${total - index - 1} REMAINING`}
          </div>
          {index === total - 1 ? (
            <Link
              href={`/${topic.slug}`}
              className="font-caps text-[0.78rem] tracking-[0.3em] px-6 py-3 rounded-sm text-cream transition-all hover:opacity-90"
              style={{ backgroundColor: meta.accentDeep }}
            >
              FINISH →
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="font-caps text-[0.78rem] tracking-[0.3em] px-6 py-3 rounded-sm text-cream transition-all hover:opacity-90"
              style={{ backgroundColor: meta.accentDeep }}
            >
              NEXT →
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
