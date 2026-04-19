import Link from "next/link";
import { renderTitleWithEmphasis } from "./ContentRenderer";

interface ActiveProps {
  slug: string;
  title: string;
  titleEmphasis?: string;
  subtitle: string;
  latinTag?: string;
  accent: string;
  accentDeep: string;
  disabled?: false;
}

interface DisabledProps {
  slug: string;
  title: string;
  titleEmphasis?: string;
  subtitle: string;
  accent?: string;
  accentDeep?: string;
  disabled: true;
}

type Props = ActiveProps | DisabledProps;

export default function TopicCard(props: Props) {
  const { slug, title, titleEmphasis, subtitle } = props;
  const accent = props.accent ?? "#B8943D";
  const accentDeep = props.accentDeep ?? "#8C6F2C";

  const cardInner = (
    <div
      className={`relative h-full bg-cream border border-parchment-shadow/70 p-8 pt-10 rounded-sm transition-all duration-300 ${
        props.disabled
          ? "opacity-60"
          : "hover:-translate-y-1 hover:shadow-[0_14px_40px_-12px_rgba(31,26,16,0.25)]"
      }`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[4px]"
        style={{ backgroundColor: accent }}
      />
      {props.disabled ? (
        <div className="font-caps text-[0.72rem] tracking-[0.3em] text-ink-muted mb-5">
          COMING SOON
        </div>
      ) : "latinTag" in props && props.latinTag ? (
        <div
          className="font-caps text-[0.72rem] tracking-[0.3em] mb-5"
          style={{ color: accentDeep }}
        >
          {props.latinTag}
        </div>
      ) : (
        <div className="h-[1.2rem] mb-5" />
      )}
      <h3 className="font-display text-[2.1rem] leading-[1.15] text-ink mb-4">
        {renderTitleWithEmphasis(title, titleEmphasis, accentDeep)}
      </h3>
      <p className="font-body text-[1rem] leading-[1.65] text-ink-soft">{subtitle}</p>
      {!props.disabled && (
        <div
          className="mt-6 font-caps text-[0.78rem] tracking-[0.28em] flex items-center gap-2"
          style={{ color: accentDeep }}
        >
          ENTER <span aria-hidden>→</span>
        </div>
      )}
    </div>
  );

  if (props.disabled) {
    return (
      <div aria-disabled className="block cursor-not-allowed">
        {cardInner}
      </div>
    );
  }

  return (
    <Link href={`/${slug}`} className="block group">
      {cardInner}
    </Link>
  );
}
