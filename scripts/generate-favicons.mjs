import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const BRAND_ORANGE = '#ef5d2d';
const BRAND_WHITE = '#ffffff';

// Clean, scalable HeatShield AI SVG matching .brand-mark
function getHeatShieldSvg(size = 32) {
  const rx = Math.round(size * (10 / 32)); // ~10px radius on 32px
  const iconScale = (size * (24 / 32)) / 24; // scales the 24x24 sun icon
  const offset = (size - 24 * iconScale) / 2;
  const strokeWidth = (2 * iconScale).toFixed(2);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" fill="none">
  <rect width="${size}" height="${size}" rx="${rx}" fill="${BRAND_ORANGE}"/>
  <g transform="translate(${offset}, ${offset}) scale(${iconScale})" stroke="${BRAND_WHITE}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </g>
</svg>`;
}

function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = 6 + 16 * images.length;
  const dirEntries = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images.map(img => img.buffer)]);
}

async function main() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const appDir = path.join(rootDir, 'app');

  // 1. Vector SVG (32x32 standard viewBox)
  const svgContent = getHeatShieldSvg(32);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
  console.log('✓ Wrote app/icon.svg and public/icon.svg');

  // 2. High-res SVG source for rasterizing crisp PNGs
  const hiResSvgBuffer = Buffer.from(getHeatShieldSvg(512));

  const png16 = await sharp(hiResSvgBuffer).resize(16, 16).png().toBuffer();
  const png32 = await sharp(hiResSvgBuffer).resize(32, 32).png().toBuffer();
  const png48 = await sharp(hiResSvgBuffer).resize(48, 48).png().toBuffer();
  const png180 = await sharp(hiResSvgBuffer).resize(180, 180).png().toBuffer();

  // Write PNG files
  fs.writeFileSync(path.join(publicDir, 'icon-light-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'icon-dark-32x32.png'), png32);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), png180);
  fs.writeFileSync(path.join(appDir, 'apple-icon.png'), png180);
  console.log('✓ Wrote 32x32 and 180x180 PNGs');

  // 3. Multi-resolution ICO (16x16, 32x32, 48x48)
  const icoBuffer = buildIco([
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 },
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Wrote app/favicon.ico and public/favicon.ico');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
