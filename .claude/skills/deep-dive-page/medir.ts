// Metro del presupuesto de palabras de un deep-dive (P49.5).
//
// POR QUÉ UN SCRIPT Y NO UN NÚMERO EN LA SKILL. El presupuesto de §42 —«700-900
// palabras, 1.200 con caso»— no se puede cumplir a ojo, y hasta ahora nadie lo
// había medido después de escribir: al hacerlo (2026-08-18) resultó que las tres
// páginas con caso lo pasan si se cuenta «En un minuto» y lo cumplen si no, o sea
// que el número publicado no decía CONTRA QUÉ se medía. Un presupuesto sin metro
// es una intención.
//
// QUÉ CUENTA, y cada exclusión tiene su razón:
// · La NARRATIVA (`historia.bloques[].paras` + `cierre`, `caso.paras` + `cierre`)
//   y los APRENDIZAJES. Es la prosa que se escribe para esta página.
// · NO cuenta «En un minuto»: sus bullets son la versión larga de los del CV
//   (D57), o sea el MISMO hecho comprimido, no prosa nueva. Contarlo sería contar
//   dos veces lo mismo, que es justo lo que D57 dejó de hacer.
// · NO cuenta el artefacto: su `description` es la alternativa en prosa para quien
//   no ve el dibujo (punto 8 del checklist), no narración. Penalizar por hacer
//   accesible un diagrama sería el incentivo exacto al revés.
// · NO cuentan títulos, rótulos ni `resultados`: son etiquetas, no prosa.
//
// Se ejecuta con `npx tsx .claude/skills/deep-dive-page/medir.ts` desde la raíz.
// Imprime las cinco publicadas como CALIBRACIÓN: el número que importa no es un
// techo abstracto, es «¿esta página se lee como las que ya están?».

import { readFileSync } from "node:fs";
import { EXPERIENCES } from "../../../content/experiences";

const DICTS = "app/[lang]/dictionaries/es/trayectoria";

/** Palabras de prosa, sin el markup de énfasis de `Rich`. */
const palabras = (s: string) =>
  s.replace(/\*\*/g, "").split(/\s+/).filter(Boolean).length;

interface Bloque {
  paras: string[];
  cierre?: string[];
}
interface Dict {
  historia: { bloques: Bloque[] };
  caso?: { paras: string[]; cierre: string[]; artefacto?: unknown };
  aprendizajes: { items: { text: string }[] };
}

const filas = EXPERIENCES.filter((e) => e.slug !== null).map(({ slug }) => {
  const d = JSON.parse(readFileSync(`${DICTS}/${slug}.json`, "utf8")) as Dict;

  let narrativa = 0;
  for (const b of d.historia.bloques) {
    for (const p of b.paras) narrativa += palabras(p);
    for (const p of b.cierre ?? []) narrativa += palabras(p);
  }
  if (d.caso) {
    for (const p of d.caso.paras) narrativa += palabras(p);
    for (const p of d.caso.cierre) narrativa += palabras(p);
  }

  let aprendizajes = 0;
  for (const i of d.aprendizajes.items) aprendizajes += palabras(i.text);

  return {
    slug: slug!,
    caso: Boolean(d.caso),
    artefacto: Boolean(d.caso?.artefacto),
    bloques: d.historia.bloques.length,
    aprendizajes: d.aprendizajes.items.length,
    total: narrativa + aprendizajes,
  };
});

// El metro afirma cuánto ha mirado. Una tabla vacía parece un aprobado (es la
// lección que este proyecto ya se ha encontrado tres veces).
if (filas.length === 0) {
  console.error(
    "medir: 0 experiencias con página. O el registro está vacío o la ruta de los diccionarios cambió — en cualquier caso esto NO es un aprobado.",
  );
  process.exit(1);
}

console.log(
  `Presupuesto de prosa — ${filas.length} páginas medidas (narrativa + aprendizajes; sin «En un minuto», sin artefacto, sin títulos)\n`,
);
console.log("  página     caso  bloques  aprend.   palabras");
console.log("  ─────────  ────  ───────  ───────  ─────────");
for (const f of [...filas].sort((a, b) => a.total - b.total)) {
  console.log(
    `  ${f.slug.padEnd(9)}  ${(f.caso ? (f.artefacto ? "+art" : "sí") : "no").padEnd(4)}  ${String(f.bloques).padStart(7)}  ${String(f.aprendizajes).padStart(7)}  ${String(f.total).padStart(9)}`,
  );
}

const conCaso = filas.filter((f) => f.caso).map((f) => f.total);
const sinCaso = filas.filter((f) => !f.caso).map((f) => f.total);
const rango = (xs: number[]) =>
  xs.length ? `${Math.min(...xs)}–${Math.max(...xs)}` : "—";
console.log(
  `\n  Rango publicado hoy:  sin caso ${rango(sinCaso)}  ·  con caso ${rango(conCaso)}`,
);
console.log(
  "\n  No es un techo: es la vara. Una página que se sale del rango de su\n  familia se lee como otra cosa, y eso es lo único que hay que juzgar.",
);
