const sharp = require("sharp");
const path = require("path");

const LIGHT_FG = { r: 0x21, g: 0x26, b: 0x2b }; // --foreground light theme #21262B
const DARK_FG = { r: 0xf7, g: 0xf3, b: 0xec }; // --foreground dark theme #F7F3EC
const CANVAS = 160;
const D_LO = 20; // below this distance from background: fully transparent
const D_HI = 50; // above this distance: fully opaque (steep ramp preserves faint linework, avoids noisy mid-tone haze)

function dist(a, b) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

async function getRaw(input) {
  return sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

function sampleBackground(data, width, height, channels) {
  const samples = [];
  for (let x = 0; x < width; x += Math.max(1, Math.floor(width / 40))) {
    samples.push([x, 0]);
    samples.push([x, height - 1]);
  }
  for (let y = 0; y < height; y += Math.max(1, Math.floor(height / 40))) {
    samples.push([0, y]);
    samples.push([width - 1, y]);
  }
  const counts = new Map();
  for (const [x, y] of samples) {
    const idx = (y * width + x) * channels;
    const key = `${data[idx]},${data[idx + 1]},${data[idx + 2]}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let best = null,
    bestCount = -1;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      best = key;
    }
  }
  const [r, g, b] = best.split(",").map(Number);
  return { r, g, b };
}

function modeColorAmong(data, width, height, channels, predicate) {
  const counts = new Map();
  for (let p = 0; p < width * height; p++) {
    const idx = p * channels;
    if (!predicate(idx)) continue;
    // bucket to reduce noise from compression artifacts
    const key = `${data[idx] >> 3},${data[idx + 1] >> 3},${data[idx + 2] >> 3}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let best = null,
    bestCount = -1;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      best = key;
    }
  }
  const [r, g, b] = best.split(",").map((n) => Number(n) << 3);
  return { r, g, b };
}

async function buildMask(input, opts = {}) {
  const dLo = opts.dLo ?? D_LO;
  const dHi = opts.dHi ?? D_HI;
  const { data, info } = await getRaw(input);
  const { width, height, channels } = info;
  const hasRealAlpha =
    channels === 4 &&
    (() => {
      for (let i = 3; i < data.length; i += channels) {
        if (data[i] < 250) return true;
      }
      return false;
    })();

  const alpha = new Uint8Array(width * height);

  if (hasRealAlpha) {
    for (let p = 0; p < width * height; p++) {
      alpha[p] = data[p * channels + 3];
    }
    // Some icons (e.g. rounded-square app tiles) have real alpha only around
    // the outer silhouette, but the mark inside is drawn via COLOR contrast
    // against a same-alpha fill, not via alpha — if most of the opaque area
    // is one dominant color, re-carve internal detail by distance from it.
    let opaqueCount = 0;
    for (let p = 0; p < width * height; p++) if (alpha[p] > 200) opaqueCount++;
    const fillRatio = opaqueCount / (width * height);
    if (fillRatio > 0.75) {
      const fill = modeColorAmong(
        data,
        width,
        height,
        channels,
        (idx) => data[idx + 3] > 200,
      );
      for (let p = 0; p < width * height; p++) {
        const idx = p * channels;
        if (alpha[p] <= 200) continue; // keep true transparent areas transparent
        const px = { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
        const d = dist(px, fill);
        let a = ((d - dLo) / (dHi - dLo)) * 255;
        a = Math.max(0, Math.min(255, a));
        alpha[p] = a;
      }
    }
  } else {
    const bg = sampleBackground(data, width, height, channels);
    for (let p = 0; p < width * height; p++) {
      const idx = p * channels;
      const px = { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
      const d = dist(px, bg);
      let a = ((d - dLo) / (dHi - dLo)) * 255;
      a = Math.max(0, Math.min(255, a));
      alpha[p] = a;
    }
  }
  return { alpha, width, height };
}

async function processLogo(input, outDir, baseName, opts = {}) {
  const { alpha, width, height } = await buildMask(input, opts);

  for (const [suffix, color] of [
    ["light", LIGHT_FG],
    ["dark", DARK_FG],
  ]) {
    const rgba = Buffer.alloc(width * height * 4);
    for (let p = 0; p < width * height; p++) {
      rgba[p * 4] = color.r;
      rgba[p * 4 + 1] = color.g;
      rgba[p * 4 + 2] = color.b;
      rgba[p * 4 + 3] = alpha[p];
    }
    const img = sharp(rgba, { raw: { width, height, channels: 4 } });
    const trimmed = await img.png().toBuffer();
    const meta = await sharp(trimmed)
      .trim({ threshold: 10 })
      .toBuffer({ resolveWithObject: true })
      .catch(() => null);
    const finalBuf = meta ? meta.data : trimmed;

    const out = path.join(outDir, `${baseName}-${suffix}.png`);
    await sharp(finalBuf)
      .resize(CANVAS, CANVAS, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(out);
    console.log("wrote", out);
  }
}

module.exports = { processLogo };

if (require.main === module) {
  const [, , input, outDir, baseName] = process.argv;
  processLogo(input, outDir, baseName).catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
