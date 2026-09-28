// Converts every .jpg / .jpeg / .png in a folder into web-ready WebP files.
//
// Usage:
//   node scripts/optimize-images.mjs <input-folder> [output-folder]
//
// For each image it writes two files into the output folder
// (default: public/images/products):
//   <name>.webp     – up to 1400px wide, used on the product page and hero
//   <name>-sm.webp  – up to 560px wide, used on product cards
//
// Original photos were 2048px / ~500 KB each; the card version is ~30 KB.

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const [, , input, output = "public/images/products"] = process.argv;

if (!input) {
  console.error("Usage: node scripts/optimize-images.mjs <input-folder> [output-folder]");
  process.exit(1);
}

const SIZES = [
  { suffix: "", width: 1400, quality: 80 },
  { suffix: "-sm", width: 560, quality: 76 },
];

fs.mkdirSync(output, { recursive: true });

const files = fs.readdirSync(input).filter((f) => /\.(jpe?g|png)$/i.test(f));
let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(input, file);
  const name = path.parse(file).name.toLowerCase().replace(/\s+/g, "-");
  before += fs.statSync(src).size;

  for (const { suffix, width, quality } of SIZES) {
    const dest = path.join(output, `${name}${suffix}.webp`);
    await sharp(src)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(dest);
    after += fs.statSync(dest).size;
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(`Optimized ${files.length} images: ${mb(before)} MB -> ${mb(after)} MB (both sizes) in ${output}`);
