// Reconstruye el diccionario del Design System: 18 secciones → 12 (P70.33/P70.34).
//
// Lee SIEMPRE de `es.original.json` / `en.original.json` —copias del estado en
// HEAD— para poder re-ejecutarse mientras se redactan las secciones una a una.
// Nada de esto toca el archivo servido hasta el último paso.
//
// Orden nuevo: fundamentos → piezas → composición → excepción.

const fs = require("fs");
const path = require("path");

const AQUI = __dirname;
const RAIZ = path.join(AQUI, "..", "..");
const DICC = (lang) =>
  path.join(RAIZ, "app", "[lang]", "dictionaries", lang, "design-system.json");

const original = (lang) =>
  JSON.parse(fs.readFileSync(path.join(AQUI, `${lang}.original.json`), "utf8"));

/**
 * El mapa. Cada entrada: la clave nueva, de qué viejas sale, y el ordinal.
 * `hecha` marca las que ya tienen redacción nueva en su propio archivo; las que
 * no, pasan tal cual con el ordinal corregido, para que la página siga
 * compilando mientras se redactan.
 */
const MAPA = [
  {
    clave: "rejilla",
    de: ["rejilla", "tokens", "breakpoints", "esqueleto"],
    hecha: true,
  },
  { clave: "ritmo", de: ["ritmo"] },
  { clave: "tipografia", de: ["tipografia", "cabeceras"], hecha: true },
  { clave: "claroscuro", de: ["claroscuro"], hecha: true },
  { clave: "movimiento", de: ["movimiento"], hecha: true },
  { clave: "enlaces", de: ["enlaces"], hecha: true },
  { clave: "botones", de: ["botones", "video"], hecha: true },
  { clave: "etiquetas", de: ["etiquetas"], hecha: true },
  { clave: "formulario", de: ["formulario"], hecha: true },
  { clave: "composicion", de: ["tablas", "bloques"], hecha: true },
  { clave: "accesibilidad", de: ["accesibilidad"], hecha: true },
  { clave: "articulo", de: ["articulo"], hecha: true },
];

/** El ordinal se deriva de la posición, nunca se teclea. */
const ordinal = (i) => String(i + 1).padStart(2, "0");

/** «04 — Ritmo y espaciado» → «02 — Ritmo y espaciado». */
const renumerar = (num, i) => num.replace(/^\d+\s*—/, `${ordinal(i)} —`);

function construir(lang) {
  const viejo = original(lang);
  const nuevo = { meta: viejo.meta, crumb: viejo.crumb, hero: viejo.hero };

  MAPA.forEach((s, i) => {
    if (s.hecha) {
      const redactar = require(`./${ordinal(i)}-${s.clave}.${lang}.js`);
      nuevo[s.clave] = redactar(viejo);
      nuevo[s.clave].num = renumerar(nuevo[s.clave].num, i);
      return;
    }
    // Todavía sin redacción nueva: pasa con el ordinal corregido.
    const base = viejo[s.de[0]];
    nuevo[s.clave] = { ...base, num: renumerar(base.num, i) };
  });

  return nuevo;
}

function palabras(o) {
  let n = 0;
  const f = (v) => {
    if (typeof v === "string")
      n += v.trim().split(/\s+/).filter(Boolean).length;
    else if (v && typeof v === "object") Object.values(v).forEach(f);
  };
  f(o);
  return n;
}

const escribir = process.argv.includes("--escribir");

for (const lang of ["es", "en"]) {
  const viejo = original(lang);
  const nuevo = construir(lang);
  const antes = palabras(viejo);
  const ahora = palabras(nuevo);
  console.log(
    `${lang}: ${Object.keys(viejo).length - 3} secciones · ${antes} palabras` +
      `  →  ${Object.keys(nuevo).length - 3} · ${ahora}`,
  );
  for (const [i, s] of MAPA.entries()) {
    const de = s.de.reduce((a, k) => a + palabras(viejo[k]), 0);
    const a = palabras(nuevo[s.clave]);
    const marca = s.hecha ? "✓" : "·";
    console.log(
      `   ${marca} ${ordinal(i)} ${s.clave.padEnd(14)} ${String(de).padStart(5)} → ${String(a).padStart(5)}   ${s.de.join(" + ")}`,
    );
  }
  if (escribir) {
    fs.writeFileSync(DICC(lang), JSON.stringify(nuevo, null, 2) + "\n");
    console.log(`   escrito en ${DICC(lang)}`);
  }
}
