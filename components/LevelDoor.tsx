import Link from "next/link";
import type { LevelKey } from "@/lib/types";
import { LEVEL_META } from "@/lib/types";

interface Props {
  topicSlug: string;
  levelKey: LevelKey;
  firstScreenTitle: string;
  screenCount: number;
}

export default function LevelDoor({
  topicSlug,
  levelKey,
  firstScreenTitle,
  screenCount,
}: Props) {
  const meta = LEVEL_META[levelKey];

  return (
    <Link
      href={`/${topicSlug}/${levelKey}`}
      className="block group"
      aria-label={`${meta.label} — ${firstScreenTitle}`}
    >
      <div
        className="relative h-full bg-cream border border-parchment-shadow/60 p-8 pt-10 pb-10 rounded-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_48px_-14px_rgba(31,26,16,0.3)]"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[5px]"
          style={{ backgroundColor: meta.accent }}
        />
        <div
          className="font-display text-[3.5rem] leading-none mb-2"
          style={{ color: meta.accentDeep, opacity: 0.85 }}
        >
          {meta.order}
        </div>
        <div
          className="font-caps text-[0.78rem] tracking-[0.3em] mb-6"
          style={{ color: meta.accentDeep }}
        >
          {meta.label}
        </div>
        <div className="font-body text-[0.95rem] leading-[1.6] text-ink-muted mb-2 italic">
          It begins with —
        </div>
        <h3 className="font-display text-[1.7rem] leading-[1.2] text-ink mb-6">
          {firstScreenTitle}
        </h3>
        <div
          className="font-caps text-[0.72rem] tracking-[0.28em] flex items-center justify-between"
          style={{ color: meta.accentDeep }}
        >
          <span>{screenCount} SCREENS</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
            ENTER →
          </span>
        </div>
      </div>
    </Link>
  );
}
