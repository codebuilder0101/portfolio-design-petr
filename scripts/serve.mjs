// Minimal static server for the exported site in ./out (no extra dependencies).
//   npm run preview   -> http://localhost:4173
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(process.cwd(), "out");
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const target = path.normalize(path.join(ROOT, clean));
  if (!target.startsWith(ROOT)) return null;
  for (const candidate of [target, path.join(target, "index.html"), `${target}.html`]) {
    try {
      const s = await stat(candidate);
      if (s.isFile()) return { file: candidate, size: s.size };
    } catch {
      /* try next */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const url = req.url || "/";
  // Mirror `trailingSlash: true`: /en/work -> /en/work/
  if (!path.extname(url.split("?")[0]) && !url.split("?")[0].endsWith("/")) {
    const [p, q] = url.split("?");
    res.writeHead(308, { Location: `${p}/${q ? `?${q}` : ""}` }).end();
    return;
  }
  let found = await resolveFile(url);
  let status = 200;
  if (!found) {
    found = await resolveFile("/404.html");
    status = 404;
    if (!found) return res.writeHead(404).end("Not found");
  }
  const type = TYPES[path.extname(found.file).toLowerCase()] || "application/octet-stream";
  const range = req.headers.range;
  if (range && status === 200) {
    const [startStr, endStr] = range.replace("bytes=", "").split("-");
    const start = Number(startStr);
    const end = endStr ? Number(endStr) : found.size - 1;
    if (Number.isNaN(start) || start >= found.size) {
      res.writeHead(416, { "Content-Range": `bytes */${found.size}` }).end();
      return;
    }
    res.writeHead(206, {
      "Content-Type": type,
      "Content-Range": `bytes ${start}-${end}/${found.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
    });
    createReadStream(found.file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(status, { "Content-Type": type, "Content-Length": found.size, "Accept-Ranges": "bytes" });
  if (req.method === "HEAD") return res.end();
  createReadStream(found.file).pipe(res);
}).listen(PORT, () => console.log(`Serving ./out at http://localhost:${PORT}`));
