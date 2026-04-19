"use client";

interface Props {
  total: number;
  current: number;
  accent: string;
  accentDeep: string;
  onJump: (index: number) => void;
}

export default function ProgressDots({
  total,
  current,
  accent,
  accentDeep,
  onJump,
}: Props) {
  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Lesson progress">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === current;
        const isPast = i < current;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isCurrent}
            aria-label={`Go to screen ${i + 1}`}
            onClick={() => onJump(i)}
            className="transition-all duration-200"
            style={{
              width: isCurrent ? "22px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: isCurrent ? accentDeep : isPast ? accent : "transparent",
              border: `1px solid ${isCurrent ? accentDeep : accent}`,
              opacity: isCurrent ? 1 : isPast ? 0.85 : 0.55,
            }}
          />
        );
      })}
    </div>
  );
}
