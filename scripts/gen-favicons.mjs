import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const svg = readFileSync("public/favicon.svg");

const targets = [
  [96, "public/favicon-96x96.png"],
  [180, "public/apple-touch-icon.png"],
  [192, "public/web-app-manifest-192x192.png"],
  [512, "public/web-app-manifest-512x512.png"],
];

for (const [size, out] of targets) {
  await sharp(svg, { density: 512 }).resize(size, size).png().toFile(out);
  console.log("written", out);
}

// favicon.ico — ICO container with embedded 48x48 PNG (supported by all modern browsers)
const png48 = await sharp(svg, { density: 512 }).resize(48, 48).png().toBuffer();
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
const entry = Buffer.alloc(16);
entry.writeUInt8(48, 0); // width
entry.writeUInt8(48, 1); // height
entry.writeUInt16LE(1, 4); // color planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png48.length, 8); // data size
entry.writeUInt32LE(22, 12); // data offset (6 + 16)
writeFileSync("public/favicon.ico", Buffer.concat([header, entry, png48]));
console.log("written public/favicon.ico");
