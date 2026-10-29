// Static-export fix-up: Next writes per-segment prefetch payloads as nested folders
// (`__next.$d$locale/work/__PAGE__.txt`) while the client router requests the flattened
// name (`__next.$d$locale.work.__PAGE__.txt`). Add flattened copies so prefetches don't 404.
import { copyFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "out");
let copied = 0;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) await flatten(full, dir, entry.name);
    else if (entry.name !== "_next" && entry.name !== "media") await walk(full);
  }
}

async function flatten(segmentDir, parent, prefix) {
  for (const entry of await readdir(segmentDir, { withFileTypes: true })) {
    const full = path.join(segmentDir, entry.name);
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) await flatten(full, parent, name);
    else {
      const target = path.join(parent, name);
      try {
        await stat(target);
      } catch {
        await copyFile(full, target);
        copied++;
      }
    }
  }
}

await walk(OUT);
console.log(`postbuild: added ${copied} flattened prefetch files`);
