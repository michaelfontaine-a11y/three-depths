# Three Depths

Catholic apologetics for the whole family. Every topic is presented at three
depths — **Child**, **Teen**, and **Adult** — so the same truth can meet each
member of the family at their own level.

First topic: **The Eucharist**.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Adding a new topic

1. Create a new file at `content/topics/<slug>.ts` — for example
   `content/topics/mary.ts`. Import the `Topic` type from `@/lib/types` and
   export a `Topic` object with `slug`, `title`, `subtitle`, an optional Latin
   tag and emphasis, and the three levels (`child`, `teen`, `adult`). Each
   level has a `label`, an accent `color`, and an ordered array of `screens`.
   Each screen has `num` (Roman numeral), `title`, optional `titleEmphasis`
   and `eyebrow`, and `contentMarkdown`.
2. In `content/topics/_index.ts`, import your new topic and add it to the
   `topics` array. Remove the matching placeholder from `upcomingTopics` if
   it's there.
3. That's it. Static params regenerate automatically, and the landing page,
   topic page, and lesson viewer will pick it up on the next build.

## Custom content markup

Inside `contentMarkdown`, these inline tags render as rich blocks:

- `[DROPCAP]...[/DROPCAP]` — illuminated first-letter paragraph.
- `[QUOTE cite="JOHN 6:53-55"]...[/QUOTE]` — scripture blockquote.
- `[CALLOUT label="THE DECISIVE MOMENT"]...[/CALLOUT]` — accent box.
- `[FAMILY]...[/FAMILY]` — "Family Time" prompt (child level).
- `[PILLARS][PILLAR label="..." title="..."]...[/PILLAR]...[/PILLARS]` —
  three-column feature grid.
- `[FATHER name="..." date="..." ref="..."]...[/FATHER]` — Church Father
  quote card.
- `[QUESTIONS] 1. First... 2. Second... [/QUESTIONS]` — numbered question list.
- `[DIVIDER]` — decorative leaf divider (❦).
- `[FINAL]line one\nline two[/FINAL]` — centered conclusion lines.
- `**bold**` and `*italic*` work inline.
- A paragraph starting with `LEAD:` is rendered as an emphasized lead.

## Design

- Palette: warm parchment, ink, gold, burgundy, navy.
- Type: Cormorant Garamond (display), EB Garamond (body), Cormorant SC (small
  caps) — all via `next/font/google`.
- Levels: **Child** → gold, **Teen** → burgundy, **Adult** → navy.

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · static export
via `generateStaticParams`.
