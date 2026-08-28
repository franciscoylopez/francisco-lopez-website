/**
 * Genera el kit de logo descargable en public/logo-kit/.
 *
 *   node scripts/logo-kit/build.js
 *
 * Salida: 12 SVG + 36 PNG transparentes + favicons. Todo derivado de
 * geometry.js, que replica components/ui/logo.tsx — ver el porqué allí.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const {
  COLORS,
  VIEWBOX,
  WORDMARK_TRANSFORM,
  symbolShapes,
} = require("./geometry");

const OUT = path.join(__dirname, "..", "..", "public", "logo-kit");
const WORDMARK = fs
  .readFileSync(path.join(__dirname, "wordmark-paths.svg"), "utf8")
  .trim();
const PNG_SIZES = [256, 512, 1024];

const svgDoc = (viewBox, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n  ${body}\n</svg>\n`;

function symbol({ ink, split }) {
  return svgDoc(
    split ? VIEWBOX.symbolSplit : VIEWBOX.symbolFlat,
    symbolShapes({ ink, split }),
  );
}

function lockup({ ink, split }) {
  const body = [
    `<g>${symbolShapes({ ink, split })}</g>`,
    `<g transform="${WORDMARK_TRANSFORM}">\n${WORDMARK.replace(/\{\{FILL\}\}/g, ink)}\n  </g>`,
  ].join("\n  ");
  return svgDoc(split ? VIEWBOX.lockupSplit : VIEWBOX.lockupFlat, body);
}

// nombre de archivo -> { ink, split }
// EL NOMBRE ES LA TINTA, no el fondo, y desde P50.96 también en los SVG: un asset
// transparente se coloca sobre el fondo que sea, así que "tintaOscura" (la que
// sirve para fondos claros) describe el archivo y "claro" describe dónde acaba.
// Hasta entonces el SVG y el PNG de la misma pieza llevaban sufijos OPUESTOS, y
// el cruce vivía tapado en dos funciones de `lib/logo-kit.ts` y en doce líneas
// del LEEME del ZIP. Al unificarlo desaparece el campo `png`: era el que
// traducía.
const VARIANTS = [
  { name: "plano-tintaOscura", ink: COLORS.inkLight, split: false },
  { name: "plano-tintaClara", ink: COLORS.inkDark, split: false },
  { name: "split-tintaOscura", ink: COLORS.inkLight, split: true },
  { name: "split-tintaClara", ink: COLORS.inkDark, split: true },
  { name: "mono-negro", ink: COLORS.black, split: false },
  { name: "mono-blanco", ink: COLORS.white, split: false },
];

async function writePng(svg, file, dim) {
  await sharp(Buffer.from(svg), { density: 384 })
    .resize(dim)
    .png({ compressionLevel: 9 })
    .toFile(file);
}

/**
 * El favicon va en lienzo CUADRADO — lo exige el formato — con el símbolo
 * centrado ocupando el 87,5% del alto. El resto de assets van recortados a la
 * tinta, pero aquí no se puede.
 *
 * A 16px lleva además el trazo engordado: a grosor normal cae a ~1,4px y el
 * antialiasing lo lava a gris. Medido en el kit anterior, el de 16 tenía la
 * misma cobertura de tinta que el de 32 (8,2% vs 8,1%), o sea que era el de 32
 * reescalado sin compensar nada (BRAND.md, regla 2).
 */
function faviconSvg(ink, thicken) {
  const shapes = symbolShapes({
    ink,
    split: false,
    strokeWidth: thicken ? 10 : 6,
  });
  // El símbolo ocupa x 31..89, y 17..87. Lo recolocamos centrado en 80x80.
  return svgDoc("0 0 80 80", `<g transform="translate(-20,-12)">${shapes}</g>`);
}

/** ICO mínimo: cabecera + directorio + los PNG embebidos (el formato los admite). */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

(async () => {
  for (const dir of ["svg", "png", "favicon"]) {
    fs.mkdirSync(path.join(OUT, dir), { recursive: true });
  }

  let svgCount = 0;
  let pngCount = 0;

  // El símbolo se dimensiona por ALTURA, que es la medida con la que BRAND.md
  // expresa todas sus reglas ("símbolo 48px" = 48px de alto). El lockup por
  // ancho, que es su dimensión natural: a 512px de alto mediría 3400 de ancho.
  for (const v of VARIANTS) {
    for (const [shape, make, dimKey] of [
      ["simbolo", symbol, "height"],
      ["lockup", lockup, "width"],
    ]) {
      const svg = make(v);
      fs.writeFileSync(path.join(OUT, "svg", `${shape}-${v.name}.svg`), svg);
      svgCount++;
      for (const size of PNG_SIZES) {
        await writePng(
          svg,
          path.join(OUT, "png", `${shape}-${v.name}-${size}.png`),
          { [dimKey]: size },
        );
        pngCount++;
      }
    }
  }

  const icoParts = [];
  for (const [tone, ink] of [
    ["claro", COLORS.inkLight],
    ["oscuro", COLORS.inkDark],
  ]) {
    for (const size of [16, 32, 48]) {
      const svg = faviconSvg(ink, size <= 16);
      const file = path.join(OUT, "favicon", `favicon-${tone}-${size}.png`);
      await writePng(svg, file, { width: size, height: size });
      if (tone === "claro")
        icoParts.push({ size, data: fs.readFileSync(file) });
    }
  }
  fs.writeFileSync(
    path.join(OUT, "favicon", "favicon.ico"),
    buildIco(icoParts),
  );

  console.log(`SVG:     ${svgCount}`);
  console.log(`PNG:     ${pngCount}`);
  console.log(`Favicon: 6 PNG + favicon.ico`);
})();
