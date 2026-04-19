import React from "react";

type PillarData = { label: string; title: string; text: string };

type Block =
  | { kind: "paragraph"; text: string; lead?: boolean }
  | { kind: "dropcap"; text: string }
  | { kind: "quote"; cite?: string; text: string }
  | { kind: "callout"; label?: string; text: string }
  | { kind: "family"; lines: string[] }
  | { kind: "pillars"; items: PillarData[] }
  | { kind: "father"; name: string; date?: string; ref?: string; text: string }
  | { kind: "questions"; items: string[] }
  | { kind: "divider" }
  | { kind: "final"; lines: string[] };

function parseAttrs(s: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /(\w+)="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function pushParagraphs(blocks: Block[], text: string) {
  for (const p of splitParagraphs(text)) {
    if (p.startsWith("LEAD:")) {
      blocks.push({ kind: "paragraph", text: p.replace(/^LEAD:\s*/, ""), lead: true });
    } else {
      blocks.push({ kind: "paragraph", text: p });
    }
  }
}

function parseContent(src: string): Block[] {
  const blocks: Block[] = [];
  let rest = src;

  while (rest.length > 0) {
    const openMatch = rest.match(/\[(\w+)((?:\s+[^\]]*)?)\]/);
    if (!openMatch || openMatch.index === undefined) {
      pushParagraphs(blocks, rest);
      break;
    }

    const before = rest.slice(0, openMatch.index);
    if (before.trim()) pushParagraphs(blocks, before);

    const tag = openMatch[1];
    const attrs = parseAttrs(openMatch[2] ?? "");
    const afterOpen = rest.slice(openMatch.index + openMatch[0].length);

    if (tag === "DIVIDER") {
      blocks.push({ kind: "divider" });
      rest = afterOpen;
      continue;
    }

    const closeTag = `[/${tag}]`;
    const closeIdx = afterOpen.indexOf(closeTag);
    if (closeIdx === -1) {
      pushParagraphs(blocks, rest);
      break;
    }

    const inner = afterOpen.slice(0, closeIdx);
    rest = afterOpen.slice(closeIdx + closeTag.length);

    switch (tag) {
      case "DROPCAP":
        blocks.push({ kind: "dropcap", text: inner.trim() });
        break;
      case "QUOTE":
        blocks.push({ kind: "quote", cite: attrs.cite, text: inner.trim() });
        break;
      case "CALLOUT":
        blocks.push({ kind: "callout", label: attrs.label, text: inner.trim() });
        break;
      case "FAMILY": {
        const lines = inner
          .split(/\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        blocks.push({ kind: "family", lines });
        break;
      }
      case "PILLARS": {
        const items: PillarData[] = [];
        const pillarRe = /\[PILLAR((?:\s+[^\]]*)?)\]([\s\S]*?)\[\/PILLAR\]/g;
        let pm: RegExpExecArray | null;
        while ((pm = pillarRe.exec(inner)) !== null) {
          const pa = parseAttrs(pm[1] ?? "");
          items.push({
            label: pa.label ?? "",
            title: pa.title ?? "",
            text: pm[2].trim(),
          });
        }
        blocks.push({ kind: "pillars", items });
        break;
      }
      case "FATHER":
        blocks.push({
          kind: "father",
          name: attrs.name ?? "",
          date: attrs.date,
          ref: attrs.ref,
          text: inner.trim(),
        });
        break;
      case "QUESTIONS": {
        const items = inner
          .split(/\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .map((l) => l.replace(/^\d+\.\s*/, ""));
        blocks.push({ kind: "questions", items });
        break;
      }
      case "FINAL": {
        const lines = inner
          .split(/\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        blocks.push({ kind: "final", lines });
        break;
      }
      default:
        pushParagraphs(blocks, inner);
    }
  }

  return blocks;
}

type Segment = { type: "text" | "bold" | "italic"; value: string };

function tokenizeInline(text: string): Segment[] {
  const segs: Segment[] = [];
  let i = 0;
  let buffer = "";
  const flush = () => {
    if (buffer.length > 0) {
      segs.push({ type: "text", value: buffer });
      buffer = "";
    }
  };
  while (i < text.length) {
    if (text[i] === "*" && text[i + 1] === "*") {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        flush();
        segs.push({ type: "bold", value: text.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (text[i] === "*" && text[i + 1] !== "*") {
      const end = text.indexOf("*", i + 1);
      if (end !== -1 && text[end + 1] !== "*") {
        flush();
        segs.push({ type: "italic", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    buffer += text[i];
    i++;
  }
  flush();
  return segs;
}

function renderInline(text: string): React.ReactNode {
  return tokenizeInline(text).map((s, idx) => {
    if (s.type === "bold")
      return (
        <strong key={idx} className="font-semibold text-ink">
          {s.value}
        </strong>
      );
    if (s.type === "italic")
      return (
        <em key={idx} className="italic">
          {s.value}
        </em>
      );
    return <React.Fragment key={idx}>{s.value}</React.Fragment>;
  });
}

interface Props {
  markdown: string;
  accent: string;
  accentDeep: string;
}

export default function ContentRenderer({ markdown, accent, accentDeep }: Props) {
  const blocks = parseContent(markdown);

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        switch (block.kind) {
          case "paragraph":
            return (
              <p
                key={idx}
                className={
                  block.lead
                    ? "font-display text-[1.35rem] leading-relaxed text-ink-soft first-letter:font-semibold"
                    : "font-body text-[1.15rem] leading-[1.8] text-ink-soft"
                }
              >
                {renderInline(block.text)}
              </p>
            );

          case "dropcap":
            return (
              <p
                key={idx}
                className="font-body text-[1.15rem] leading-[1.8] text-ink-soft"
              >
                <span
                  className="float-left font-display font-semibold mr-3 mt-1 leading-none"
                  style={{ fontSize: "4.5rem", color: accentDeep, lineHeight: 0.9 }}
                >
                  {block.text.slice(0, 1)}
                </span>
                {renderInline(block.text.slice(1))}
              </p>
            );

          case "quote":
            return (
              <blockquote
                key={idx}
                className="pl-6 py-2 my-8 font-display italic text-[1.5rem] leading-[1.55] text-ink"
                style={{ borderLeft: `3px solid ${accent}` }}
              >
                <span>{renderInline(block.text)}</span>
                {block.cite && (
                  <footer
                    className="mt-4 font-caps text-[0.8rem] tracking-[0.22em] not-italic"
                    style={{ color: accentDeep }}
                  >
                    — {block.cite}
                  </footer>
                )}
              </blockquote>
            );

          case "callout":
            return (
              <aside
                key={idx}
                className="bg-cream/80 p-7 my-6 rounded-sm"
                style={{ borderLeft: `4px solid ${accent}` }}
              >
                {block.label && (
                  <div
                    className="font-caps text-[0.78rem] tracking-[0.24em] mb-3"
                    style={{ color: accentDeep }}
                  >
                    {block.label}
                  </div>
                )}
                <div className="space-y-4 font-body text-[1.1rem] leading-[1.75] text-ink-soft">
                  {splitParagraphs(block.text).map((p, i2) => (
                    <p key={i2}>{renderInline(p)}</p>
                  ))}
                </div>
              </aside>
            );

          case "family":
            return (
              <aside
                key={idx}
                className="my-8 p-7 rounded-sm relative"
                style={{
                  border: `2px dashed ${accent}`,
                  backgroundColor: "rgba(251, 246, 232, 0.6)",
                }}
              >
                <div
                  className="font-caps text-[0.8rem] tracking-[0.28em] mb-3 flex items-center gap-2"
                  style={{ color: accentDeep }}
                >
                  <span style={{ fontSize: "1.1em" }}>❦</span>
                  <span>FAMILY TIME</span>
                </div>
                <div className="space-y-2 font-display italic text-[1.2rem] leading-[1.6] text-ink-soft">
                  {block.lines.map((l, i2) => (
                    <p key={i2}>{renderInline(l)}</p>
                  ))}
                </div>
              </aside>
            );

          case "pillars":
            return (
              <div key={idx} className="grid md:grid-cols-3 gap-5 my-8">
                {block.items.map((p, i2) => (
                  <div
                    key={i2}
                    className="bg-parchment-deep/60 p-6 border-t-2 rounded-sm"
                    style={{ borderTopColor: accent }}
                  >
                    <div
                      className="font-caps text-[0.72rem] tracking-[0.24em] mb-2"
                      style={{ color: accentDeep }}
                    >
                      {p.label}
                    </div>
                    <div className="font-display text-[1.3rem] leading-tight text-ink mb-3">
                      {renderInline(p.title)}
                    </div>
                    <div className="font-body text-[1rem] leading-[1.65] text-ink-soft italic">
                      {renderInline(p.text)}
                    </div>
                  </div>
                ))}
              </div>
            );

          case "father":
            return (
              <figure
                key={idx}
                className="my-6 bg-parchment-deep/40 p-6 border-l-2 rounded-sm"
                style={{ borderLeftColor: accent }}
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-3">
                  <div
                    className="font-display text-[1.2rem] font-semibold"
                    style={{ color: accentDeep }}
                  >
                    {block.name}
                  </div>
                  {block.date && (
                    <div className="font-caps text-[0.75rem] tracking-[0.2em] text-ink-muted">
                      {block.date}
                    </div>
                  )}
                </div>
                <blockquote className="font-display italic text-[1.2rem] leading-[1.6] text-ink-soft">
                  {renderInline(block.text)}
                </blockquote>
                {block.ref && (
                  <div className="mt-3 font-caps text-[0.72rem] tracking-[0.2em] text-ink-muted">
                    {block.ref}
                  </div>
                )}
              </figure>
            );

          case "questions":
            return (
              <ol
                key={idx}
                className="my-8 space-y-4 font-body text-[1.1rem] leading-[1.7] text-ink-soft list-decimal list-outside pl-6"
                style={{ ["--marker-color" as string]: accentDeep }}
              >
                {block.items.map((q, i2) => (
                  <li key={i2} className="marker:font-caps marker:text-[0.95em]">
                    <span style={{ color: "inherit" }}>{renderInline(q)}</span>
                  </li>
                ))}
              </ol>
            );

          case "divider":
            return (
              <div
                key={idx}
                className="my-10 text-center font-display"
                style={{ color: accentDeep }}
                aria-hidden
              >
                <span className="inline-block text-[1.8rem] leading-none">❦</span>
              </div>
            );

          case "final":
            return (
              <div
                key={idx}
                className="my-10 text-center space-y-2 font-display text-[1.5rem] leading-[1.5] text-ink"
                style={{ letterSpacing: "0.01em" }}
              >
                {block.lines.map((l, i2) => (
                  <p
                    key={i2}
                    className={i2 === block.lines.length - 1 ? "italic" : ""}
                    style={i2 === block.lines.length - 1 ? { color: accentDeep } : {}}
                  >
                    {renderInline(l)}
                  </p>
                ))}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export function renderTitleWithEmphasis(
  title: string,
  emphasis: string | undefined,
  accentColor: string,
): React.ReactNode {
  if (!emphasis) return title;
  const idx = title.indexOf(emphasis);
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span className="italic" style={{ color: accentColor }}>
        {emphasis}
      </span>
      {title.slice(idx + emphasis.length)}
    </>
  );
}
