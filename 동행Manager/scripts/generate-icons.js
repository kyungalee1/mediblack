const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

const sizes = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-touch-icon.png" },
];

function svgFor(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0F172A"/>
  <path d="M160 230c0-36 28-64 64-64 20 0 38 9 50 24 12-15 30-24 50-24 36 0 64 28 64 64 0 72-114 128-114 128S160 302 160 230z" fill="#0F766E"/>
  <circle cx="256" cy="360" r="18" fill="#D4A017"/>
  <rect x="176" y="400" width="160" height="24" rx="8" fill="#D4A017"/>
</svg>`;
}

(async () => {
  for (const { size, name } of sizes) {
    await sharp(Buffer.from(svgFor(size)))
      .png()
      .toFile(path.join(outDir, name));
    console.log("wrote", name);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
