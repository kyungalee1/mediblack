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

const managerSizes = [
  { size: 192, name: "manager-icon-192.png" },
  { size: 512, name: "manager-icon-512.png" },
  { size: 180, name: "manager-apple-touch-icon.png" },
];

/** MediBlack — gold escort mark */
function svgBooking(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0F172A"/>
  <circle cx="256" cy="200" r="78" fill="none" stroke="#D4A017" stroke-width="32"/>
  <path d="M150 355c36-56 78-84 106-84s70 28 106 84" fill="none" stroke="#D4A017" stroke-width="32" stroke-linecap="round"/>
  <rect x="206" y="400" width="100" height="28" rx="8" fill="#1D4ED8"/>
</svg>`;
}

/** 동행 Manager — teal heart mark (distinct home-screen icon) */
function svgManager(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0F172A"/>
  <path d="M160 230c0-36 28-64 64-64 20 0 38 9 50 24 12-15 30-24 50-24 36 0 64 28 64 64 0 72-114 128-114 128S160 302 160 230z" fill="#0F766E"/>
  <circle cx="256" cy="360" r="18" fill="#D4A017"/>
  <rect x="176" y="400" width="160" height="24" rx="8" fill="#D4A017"/>
</svg>`;
}

(async () => {
  for (const { size, name } of sizes) {
    await sharp(Buffer.from(svgBooking(size)))
      .png()
      .toFile(path.join(outDir, name));
    console.log("wrote", name);
  }
  for (const { size, name } of managerSizes) {
    await sharp(Buffer.from(svgManager(size)))
      .png()
      .toFile(path.join(outDir, name));
    console.log("wrote", name);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
