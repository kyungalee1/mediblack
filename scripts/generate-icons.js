const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(outDir, { recursive: true });

const sizes = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-touch-icon.png" },
];

function svgFor(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0F172A"/>
  <circle cx="256" cy="200" r="78" fill="none" stroke="#D4A017" stroke-width="32"/>
  <path d="M150 355c36-56 78-84 106-84s70 28 106 84" fill="none" stroke="#D4A017" stroke-width="32" stroke-linecap="round"/>
  <rect x="206" y="400" width="100" height="28" rx="8" fill="#1D4ED8"/>
</svg>`;
}

(async () => {
  for (const { size, name } of sizes) {
    await sharp(Buffer.from(svgFor(size))).png().toFile(path.join(outDir, name));
    console.log("wrote", name);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
