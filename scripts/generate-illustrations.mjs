#!/usr/bin/env node
// Generate illuminated-manuscript-style illustrations for each Child-level screen
// using Pollinations (free Flux endpoint). Saves JPGs to public/illustrations/eucharist/child/.
//
// Run: node scripts/generate-illustrations.mjs
// Re-run with FORCE=1 to overwrite existing files.

import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "public", "illustrations", "eucharist", "child");

const STYLE = [
  "illuminated medieval manuscript illustration",
  "stained-glass window aesthetic",
  "warm gold-leaf accents on aged parchment",
  "deep burgundy and midnight blue palette",
  "Byzantine iconography, flat stylized figures",
  "serene reverent expressions, halo glow",
  "intricate gold filigree details",
  "child-friendly, gentle, awe-filled",
  "rich saturated colors, not photorealistic",
  "symmetrical composition",
  "soft candle-light glow",
].join(", ");

const NEGATIVE =
  "text, watermark, signature, letters, cartoon, ugly, distorted, scary, photo, photograph, realistic, modern, sci-fi, 3d render, cluttered, grotesque";

const screens = [
  {
    id: "01-special-meal",
    seed: 101,
    scene:
      "a Catholic priest in gold vestments reverently elevating a round white host and a golden chalice above a stone altar, radiant light from above, kneeling angels to either side, single point of focus on the elevated Eucharist",
  },
  {
    id: "02-something-strange",
    seed: 202,
    scene:
      "Jesus Christ with a golden halo standing and speaking to a crowd of Jewish listeners inside a synagogue in Capernaum, some listening intently, others looking puzzled and whispering, warm morning light through arched windows",
  },
  {
    id: "03-walked-away",
    seed: 303,
    scene:
      "Jesus Christ with a golden halo standing firmly with his twelve apostles gathered around him, while in the background a small crowd of followers walks away down a dusty path, bittersweet mood, Peter kneeling forward",
  },
  {
    id: "04-last-supper",
    seed: 404,
    scene:
      "the Last Supper, Jesus Christ seated at the center of a long wooden table breaking a round loaf of bread in both hands, twelve apostles around him in robes, oil lamps, a golden chalice on the table, every figure with a halo, upper room with wooden beams",
  },
  {
    id: "05-remembered",
    seed: 505,
    scene:
      "an early Christian bishop (Saint Ignatius of Antioch) in first-century Roman robes seated at a wooden desk writing a letter on a parchment scroll by oil-lamp light, a white dove perched near the window, small Eucharistic host and chalice visible on a side table",
  },
  {
    id: "06-what-we-do-today",
    seed: 606,
    scene:
      "a modern Catholic priest in gold vestments holding up the consecrated host at the altar during Mass, with a faint translucent golden image of Jesus Christ echoing the same gesture directly above him, connection across time",
  },
  {
    id: "07-for-you",
    seed: 707,
    scene:
      "a small child kneeling in a wooden pew looking up in quiet wonder toward an altar with a glowing golden monstrance holding the Eucharist, candles on either side, gentle beams of light, the child's face illuminated, peaceful",
  },
];

function buildPrompt(scene) {
  return `${scene}. ${STYLE}. No text, no letters, no watermark. -- ${NEGATIVE}`;
}

function urlFor(prompt, seed) {
  const base = "https://image.pollinations.ai/prompt/";
  const params = new URLSearchParams({
    width: "1024",
    height: "1024",
    seed: String(seed),
    model: "flux",
    nologo: "true",
    enhance: "true",
    safe: "true",
  });
  return `${base}${encodeURIComponent(prompt)}?${params.toString()}`;
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithRetry(url, tries = 4) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const ct = res.headers.get("content-type") || "";
      if (!ct.startsWith("image/")) {
        throw new Error(`Unexpected content-type: ${ct}`);
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 5000) throw new Error(`Image too small (${buf.length}B)`);
      return buf;
    } catch (err) {
      lastErr = err;
      const wait = 2000 * (i + 1);
      console.warn(`  retry in ${wait}ms: ${err.message}`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw lastErr;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const force = process.env.FORCE === "1";
  const limitArg = process.argv.find((a) => a.startsWith("--only="));
  const only = limitArg ? limitArg.slice("--only=".length).split(",") : null;

  console.log(`Output: ${outDir}`);
  console.log(`Screens: ${screens.length} (force=${force}${only ? `, only=${only.join(",")}` : ""})\n`);

  for (const s of screens) {
    if (only && !only.includes(s.id)) continue;
    const outPath = path.join(outDir, `${s.id}.jpg`);
    if (!force && (await fileExists(outPath))) {
      console.log(`✓ skip  ${s.id}.jpg (exists)`);
      continue;
    }
    const prompt = buildPrompt(s.scene);
    const url = urlFor(prompt, s.seed);
    console.log(`→ fetch ${s.id}.jpg  seed=${s.seed}`);
    try {
      const buf = await fetchWithRetry(url);
      await writeFile(outPath, buf);
      console.log(`✓ wrote ${s.id}.jpg  (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error(`✗ FAIL  ${s.id}.jpg — ${err.message}`);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
