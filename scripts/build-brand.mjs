// Generates favicons, the apple-touch icon, the web manifest and localized Open Graph images.
//   npm run brand
// Requires public/media (run `npm run media` first). Text uses system fonts (Segoe UI → Arial).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const INK = "#1b1c20";
const PAPER = "#f6f4ef";
const CITRUS = "#d9ee45";
const COBALT = "#2440d6";
const NAME = "Petr Smital";

/** Same geometry as components/layout/Logo.tsx. */
const mark = (size = 48) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}">
  <rect width="48" height="48" rx="14" fill="${INK}"/>
  <g fill="none" stroke="${PAPER}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 18v-8h8"/><path d="M30 10h8v8"/><path d="M38 30v8h-8"/><path d="M18 38h-8v-8"/>
  </g>
  <path d="M20 16.5v15a1.2 1.2 0 0 0 1.8 1l12-7.5a1.2 1.2 0 0 0 0-2l-12-7.5a1.2 1.2 0 0 0-1.8 1Z" fill="${CITRUS}"/>
</svg>`;

/** Reads a string value from a dictionary file without executing TypeScript. */
async function dictValue(locale, key) {
  const src = await readFile(path.join(ROOT, "src", "i18n", "dictionaries", `${locale}.ts`), "utf8");
  const m = src.match(new RegExp(`\\n\\s+${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  if (!m) throw new Error(`${key} not found in ${locale}.ts`);
  return JSON.parse(`"${m[1]}"`);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text, maxChars) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines;
}

async function rounded(file, w, h, radius, position = "centre", border = 0) {
  const img = await sharp(file).resize(w, h, { fit: "cover", position }).toBuffer();
  const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${radius}" fill="#fff"/></svg>`);
  const clipped = await sharp(img).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  if (!border) return clipped;
  const W = w + border * 2, H = h + border * 2;
  const frame = Buffer.from(`<svg width="${W}" height="${H}"><rect width="${W}" height="${H}" rx="${radius + border}" fill="${PAPER}"/></svg>`);
  return sharp(frame).composite([{ input: clipped, left: border, top: border }]).png().toBuffer();
}

async function shadow(w, h, radius, blur = 24, opacity = 0.28) {
  const pad = blur * 3;
  const svg = `<svg width="${w + pad * 2}" height="${h + pad * 2}"><rect x="${pad}" y="${pad + blur / 2}" width="${w}" height="${h}" rx="${radius}" fill="rgba(27,28,32,${opacity})"/></svg>`;
  return { input: await sharp(Buffer.from(svg)).blur(blur).png().toBuffer(), pad };
}

async function ogImage(locale) {
  const headline = await dictValue(locale, "headline");
  const role = await dictValue(locale, "role");
  const W = 1200, H = 630;

  let size = 74, maxChars = 13;
  let lines = wrap(headline, maxChars);
  if (lines.length > 3) {
    size = 62;
    lines = wrap(headline, 16);
  }
  const lh = size * 1.0;
  const startY = 250;
  const text = lines
    .map((l, i) => `<text x="64" y="${startY + i * lh}" font-family="Segoe UI, Arial, sans-serif" font-weight="900" font-size="${size}" letter-spacing="-2" fill="${INK}">${esc(l)}</text>`)
    .join("");
  const lastY = startY + (lines.length - 1) * lh;
  const lastWidth = lines[lines.length - 1].length * size * 0.5;

  const base = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${PAPER}"/>
    <rect x="58" y="${lastY - size * 0.26}" width="${lastWidth}" height="${size * 0.3}" rx="4" fill="${CITRUS}"/>
    ${text}
    <text x="146" y="104" font-family="Segoe UI, Arial, sans-serif" font-weight="900" font-size="34" letter-spacing="-0.5" fill="${INK}">${esc(NAME)}<tspan fill="${COBALT}">.</tspan></text>
    ${role.split(" · ").map((part, i, all) => `<text x="64" y="${H - 58 - (all.length - 1 - i) * 32}" font-family="Segoe UI, Arial, sans-serif" font-weight="600" font-size="24" fill="#3f4148">${esc(part)}</text>`).join("")}
      </svg>`;

  const main = await rounded(path.join(PUBLIC, "media", "35", "image-1080.webp"), 560, 470, 28, "centre");
  const side = await rounded(path.join(PUBLIC, "media", "34", "image-768.webp"), 270, 190, 20, "centre", 8);
  const tall = await rounded(path.join(PUBLIC, "media", "petr", "hero-480.webp"), 196, 245, 20, "north", 8);
  const s1 = await shadow(560, 470, 28);
  const s2 = await shadow(286, 206, 26, 18, 0.25);

  const markPng = await sharp(Buffer.from(mark(64))).png().toBuffer();

  await sharp(Buffer.from(base))
    .composite([
      { input: s1.input, left: 600 - s1.pad, top: 70 - s1.pad },
      { input: main, left: 600, top: 70 },
      { input: s2.input, left: 560 - s2.pad, top: 400 - s2.pad },
      { input: side, left: 560, top: 400 },
      { input: tall, left: 976, top: 22 },
      { input: markPng, left: 64, top: 56 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, "og", `og-${locale}.png`));
}

/** Minimal ICO container embedding PNG images (supported by all modern browsers). */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function main() {
  await mkdir(path.join(PUBLIC, "og"), { recursive: true });
  await writeFile(path.join(PUBLIC, "favicon.svg"), mark(48));

  const png = (size) => sharp(Buffer.from(mark(size)), { density: 72 * (size / 48) * 2 }).resize(size, size).png().toBuffer();
  const sizes = { "favicon-16.png": 16, "favicon-32.png": 32, "icon-192.png": 192, "icon-512.png": 512 };
  for (const [name, size] of Object.entries(sizes)) await writeFile(path.join(PUBLIC, name), await png(size));

  // Apple touch icon: full-bleed (iOS applies its own corner mask).
  const apple = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="180" height="180"><rect width="48" height="48" fill="${INK}"/>${mark(48).split("\n").slice(2, -1).join("")}</svg>`;
  await sharp(Buffer.from(apple), { density: 600 }).resize(180, 180).png().toFile(path.join(PUBLIC, "apple-touch-icon.png"));

  await writeFile(path.join(PUBLIC, "favicon.ico"), ico([{ size: 16, data: await png(16) }, { size: 32, data: await png(32) }, { size: 48, data: await png(48) }]));

  await writeFile(
    path.join(PUBLIC, "site.webmanifest"),
    JSON.stringify(
      {
        name: NAME,
        short_name: NAME,
        start_url: "/",
        display: "standalone",
        background_color: PAPER,
        theme_color: PAPER,
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      null,
      2,
    ) + "\n",
  );

  for (const locale of ["en", "pt", "es"]) await ogImage(locale);
  console.log("Brand assets written to public/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
