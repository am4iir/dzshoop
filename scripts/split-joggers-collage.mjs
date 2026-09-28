/**
 * Splits the joggers collage into individual optimized WebP images.
 * Run: node scripts/split-joggers-collage.mjs
 *
 * Collage layout (approx, based on visual inspection of the uploaded 700×900 image):
 *
 *  Row A (top, ~0..310px):
 *    A1: grey single model  left  0..230  w=230
 *    A2: two models hero    center 230..700 (full width remaining, spans rows A+B)
 *
 *  Row B (mid-top, ~310..570px):
 *    B1: black single model  left 0..230
 *    (A2 continues on right)
 *
 *  Row C (mid, ~570..730px):
 *    C1: waist close-up     left  0..235
 *    C2: shoe/leg close-up  mid   235..465
 *    C3: couple side shot   right 465..700
 *
 *  Row D (bottom, ~730..900px):
 *    D1: fabric grey        0..175
 *    D2: fabric black       175..350
 *    D3: flat-lay grey      350..525
 *    D4: flat-lay black     525..700
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(
  "C:/Users/ziani barae/.gemini/antigravity/brain/7dbef32c-98f1-45fb-870f-98afa4e7d64f/.user_uploaded",
  "media_1790266355885.png"
);
const OUT = path.join(__dirname, "../public/images");

// Get real image metadata first
const meta = await sharp(SRC).metadata();
const W = meta.width;
const H = meta.height;
console.log(`Source: ${W}x${H}`);

// Proportional crop regions (fractions of W and H)
const crops = [
  // name,         left%,  top%,   right%, bottom%,  maxW,  quality
  // A2 hero: two models side by side (center-right, spans full height of rows A+B)
  ["joggers-hero",          0.32,  0.00,   1.00,   0.62,   1600,  82],
  // A1: grey single model (top-left)
  ["joggers-grey-model",    0.00,  0.00,   0.32,   0.35,    800,  80],
  // B1: black single model (mid-left)
  ["joggers-black-model",   0.00,  0.33,   0.32,   0.63,    800,  80],
  // C1: waist/drawstring close-up
  ["joggers-detail-waist",  0.00,  0.62,   0.34,   0.82,    800,  80],
  // C2: shoe/leg close-up
  ["joggers-detail-shoe",   0.34,  0.62,   0.66,   0.82,    800,  80],
  // C3: couple side angle
  ["joggers-duo-side",      0.66,  0.62,   1.00,   0.82,    800,  80],
  // D1: fabric grey texture
  ["joggers-fabric-grey",   0.00,  0.82,   0.25,   1.00,    800,  80],
  // D2: fabric black texture
  ["joggers-fabric-black",  0.25,  0.82,   0.50,   1.00,    800,  80],
  // D3: flat-lay grey
  ["joggers-flat-grey",     0.50,  0.82,   0.75,   1.00,    800,  80],
  // D4: flat-lay black
  ["joggers-flat-black",    0.75,  0.82,   1.00,   1.00,    800,  80],
];

import { mkdir } from "fs/promises";
await mkdir(OUT, { recursive: true });

for (const [name, lf, tf, rf, bf, maxW, q] of crops) {
  const left   = Math.min(Math.round(lf * W), W - 1);
  const top    = Math.min(Math.round(tf * H), H - 1);
  const width  = Math.min(Math.round((rf - lf) * W), W - left);
  const height = Math.min(Math.round((bf - tf) * H), H - top);

  const outFile = path.join(OUT, `${name}.webp`);

  let pipeline = sharp(SRC).extract({ left, top, width, height });

  // Resize if wider than maxW
  if (width > maxW) {
    pipeline = pipeline.resize({ width: maxW, withoutEnlargement: true });
  }

  await pipeline.webp({ quality: q }).toFile(outFile);
  console.log(`✓ ${name}.webp  (crop: ${left},${top} ${width}x${height})`);
}

console.log("\nAll images saved to public/images/");
