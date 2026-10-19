// Generates the animated SVGs used in README.md.
// Run with:  bun scripts/gen-assets.mjs   (or: node scripts/gen-assets.mjs)
//
// GitHub renders SVGs from <img> tags with SMIL animation enabled but strips
// scripts and external resources, so everything here is self-contained.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(OUT, { recursive: true });

// ── Palettes ────────────────────────────────────────────────────────────────
// Approximations of the tint themes. Tweak to match lib/ exactly.
const THEMES = {
  ocean: {
    bg: "#0b1b2b", bar: "#10263b", border: "#1d3a57",
    fg: "#d6e6f5", muted: "#6f8aa3",
    accent: "#38bdf8", success: "#34d399", info: "#60a5fa", warn: "#fbbf24", error: "#f87171",
  },
  ember: {
    bg: "#1f1410", bar: "#2b1b14", border: "#47291c",
    fg: "#f3e3d7", muted: "#9a7b68",
    accent: "#fb923c", success: "#a3e635", info: "#fcd34d", warn: "#f59e0b", error: "#ef4444",
  },
  forest: {
    bg: "#0f1a14", bar: "#15251c", border: "#21392b",
    fg: "#dcebdc", muted: "#6f8f79",
    accent: "#4ade80", success: "#86efac", info: "#2dd4bf", warn: "#facc15", error: "#fb7185",
  },
  mono: {
    bg: "#141414", bar: "#1e1e1e", border: "#333333",
    fg: "#e5e5e5", muted: "#737373",
    accent: "#ffffff", success: "#d4d4d4", info: "#a3a3a3", warn: "#bdbdbd", error: "#8a8a8a",
  },
};

const FONT = "SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";
const FS = 14;
const CW = 8.43; // monospace char width at 14px
const LH = 24;
const TOTAL = 12; // seconds per loop

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const f = (n) => Number(n.toFixed(4));

// A line that "types" itself by animating the width of a clip rect in steps.
function typedLine({ id, x, yBase, segs, start, dur, hide, cw = CW, lh = LH, anchorTop }) {
  const n = segs.reduce((sum, s) => sum + [...s.t].length, 0);
  const kt = [0, start / TOTAL];
  const vals = [0, 0];
  for (let k = 1; k <= n; k++) {
    kt.push((start + (dur * k) / n) / TOTAL);
    vals.push(f(k * cw + 2));
  }
  kt.push(hide / TOTAL);
  vals.push(0);

  const top = anchorTop ?? yBase - 17;
  const defs =
    `<clipPath id="c${id}"><rect x="${x}" y="${top}" height="${lh}" width="0">` +
    `<animate attributeName="width" calcMode="discrete" dur="${TOTAL}s" repeatCount="indefinite" ` +
    `keyTimes="${kt.map(f).join(";")}" values="${vals.join(";")}"/></rect></clipPath>`;

  const spans = segs
    .map(
      (s) =>
        `<tspan fill="${s.c}"${s.b ? ' font-weight="700"' : ""}>${esc(s.t)}</tspan>`
    )
    .join("");
  const body = `<text x="${x}" y="${yBase}" clip-path="url(#c${id})" xml:space="preserve">${spans}</text>`;
  return { defs, body };
}

// ── Themed terminal window ──────────────────────────────────────────────────
function themeWindow(name, t) {
  const W = 640;
  const BAR = 38;
  const PAD = 24;
  const top = BAR + 18;

  const rows = [
    { r: 0, start: 0.5, dur: 1.6, segs: [{ t: "$ ", c: t.accent, b: true }, { t: `bun run example ${name}`, c: t.fg }] },
    { r: 2, start: 2.5, dur: 0.5, segs: [{ t: "┃ ", c: t.accent }, { t: "Status", c: t.accent, b: true }] },
    { r: 3, start: 3.1, dur: 0.9, segs: [{ t: "✔ ", c: t.success }, { t: "Everything is wired up.", c: t.fg }] },
    { r: 4, start: 3.8, dur: 0.9, segs: [{ t: "ℹ ", c: t.info }, { t: `Theme loaded: ${name}`, c: t.fg }] },
    { r: 5, start: 4.5, dur: 0.9, segs: [{ t: "⚠ ", c: t.warn }, { t: "2 warnings in the queue", c: t.fg }] },
    { r: 6, start: 5.2, dur: 0.9, segs: [{ t: "✖ ", c: t.error }, { t: "Connection refused (demo)", c: t.fg }] },
    {
      r: 7, start: 6.1, dur: 0.6,
      segs: [t.accent, t.success, t.info, t.warn, t.error].map((c) => ({ t: "███ ", c })),
    },
    { r: 8, start: 7.2, dur: 0.1, segs: [{ t: "$ ", c: t.accent, b: true }] },
  ];

  const H = top + 9 * LH + 10;
  const hide = TOTAL - 1.2;
  let defs = "";
  let body = "";
  rows.forEach((row, i) => {
    const yBase = top + row.r * LH + 14;
    const l = typedLine({ id: `${name}${i}`, x: PAD, yBase, segs: row.segs, start: row.start, dur: row.dur, hide });
    defs += l.defs;
    body += l.body;
  });

  // Blinking cursor on the final prompt, visible only while the lines are shown.
  const cy = top + 8 * LH + 14 - 13;
  const cx = PAD + 2 * CW;
  const cursor =
    `<g opacity="0"><animate attributeName="opacity" calcMode="discrete" dur="${TOTAL}s" repeatCount="indefinite" ` +
    `keyTimes="0;${f(7.3 / TOTAL)};${f(hide / TOTAL)}" values="0;1;0"/>` +
    `<rect x="${cx}" y="${cy}" width="8" height="16" fill="${t.accent}">` +
    `<animate attributeName="opacity" calcMode="discrete" dur="1s" repeatCount="indefinite" keyTimes="0;0.5" values="1;0"/>` +
    `</rect></g>`;

  const dots = [["#ff5f56", 22], ["#ffbd2e", 42], ["#27c93f", 62]]
    .map(([c, x]) => `<circle cx="${x}" cy="${BAR / 2}" r="6" fill="${c}"/>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" font-size="${FS}" role="img" aria-label="tint ${name} theme preview">
<title>tint — ${name} theme</title>
<defs>${defs}</defs>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="10" fill="${t.bg}" stroke="${t.border}"/>
<path d="M0.5 10.5a10 10 0 0 1 10-10H${W - 10.5}a10 10 0 0 1 10 10V${BAR}H0.5Z" fill="${t.bar}"/>
<line x1="0.5" y1="${BAR}" x2="${W - 0.5}" y2="${BAR}" stroke="${t.border}"/>
${dots}
<text x="${W / 2}" y="${BAR / 2 + 4}" text-anchor="middle" fill="${t.muted}" font-size="12">tint — ${name}</text>
${body}
${cursor}
</svg>
`;
}

// ── Hero banner ─────────────────────────────────────────────────────────────
function hero() {
  const W = 800;
  const H = 220;
  const tagline = "Beautiful terminal output for JavaScript CLIs.";
  const cw = 18 * 0.602;
  const n = [...tagline].length;
  const x0 = W / 2 - (n * cw) / 2;

  const l = typedLine({
    id: "hero",
    x: x0 - 6,
    yBase: 178,
    anchorTop: 158,
    lh: 28,
    cw,
    segs: [{ t: tagline, c: "#8b949e" }],
    start: 0.8,
    dur: 2.4,
    hide: TOTAL - 1.2,
  });

  const stops = ["#38bdf8", "#34d399", "#fbbf24", "#fb923c", "#f87171"];
  const stopTags = stops
    .map((c, i) => `<stop offset="${f(i / (stops.length - 1))}" stop-color="${c}"/>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${FONT}" role="img" aria-label="tint — beautiful terminal output for JavaScript CLIs">
<title>tint</title>
<defs>
<linearGradient id="rainbow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="0" spreadMethod="reflect">
${stopTags}
<animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="800 0" dur="6s" repeatCount="indefinite"/>
</linearGradient>
${l.defs}
</defs>
<text x="${W / 2}" y="118" text-anchor="middle" font-size="120" font-weight="800" letter-spacing="8" fill="url(#rainbow)">tint</text>
<rect x="${W / 2 - 140}" y="136" width="280" height="4" rx="2" fill="url(#rainbow)"/>
<g font-size="18">${l.body}</g>
</svg>
`;
}

// ── Write everything ────────────────────────────────────────────────────────
writeFileSync(join(OUT, "hero.svg"), hero());
for (const [name, t] of Object.entries(THEMES)) {
  writeFileSync(join(OUT, `theme-${name}.svg`), themeWindow(name, t));
}
console.log("wrote assets to", OUT);
