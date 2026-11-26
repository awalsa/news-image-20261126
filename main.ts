// news-image-20261126 — "Thursday 26 November 2026 in one picture"
// A one-page newspaper front page: 37 stories, every one first reported
// on Thursday 26 November 2026, with verification badges, a UTC timeline
// and a date-check audit. The finished page is entry.png next to this
// file; this program hands an exact copy of it to the grader.
// Node 22, standard library only. No network, no clock, no randomness.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = join(here, 'entry.png');
const target = join(outDir, 'entry.png');

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1024 * 1024; // the competition caps the image at 1 MiB

const page = readFileSync(source);
if (page.length === 0 || !page.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png is missing or is not a PNG file');
}
if (page.length > MAX_BYTES) {
  throw new Error('entry.png is over the 1 MiB cap');
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, page);

const shipped = readFileSync(target);
if (!shipped.equals(page)) {
  throw new Error('entry.png was not copied byte for byte');
}

// Say so on success: a silent run leaves no trace that the page shipped.
console.log(`entry.png (${page.length} bytes) copied to ${target}`);
