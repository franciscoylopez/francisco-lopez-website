/**
 * ¿Las anclas de decisión del markdown apuntan todavía a su decisión? —
 * `npm run md:anclas`.
 *
 * POR QUÉ EXISTE, Y POR QUÉ NO ES UN TROZO DE `md:verificar`. Lo cubre entero
 * `md --verificar`, que compara el markdown commiteado contra la página servida y
 * por tanto ve esto y todo lo demás. Pero cuesta **46 s y un build**: lee
 * `.next/server/app`, así que sobre un build viejo da un verde falso y hay que
 * sumarle el build entero antes. Eso lo deja fuera del único sitio donde el aviso
 * llega a tiempo — el cierre de turno (`scripts/hooks/regeneradores-stop.mjs`).
 *
 * Esto es la rebanada barata: **el caso dominante, medido**. De los catorce runs
 * de CI en rojo en tres días, **siete** eran «Markdown al día», y su causa es
 * única y tiene nombre (P72.05): cada entrada nueva de `DECISIONS.md` alarga el
 * índice de su cabecera, eso desplaza TODAS las líneas de abajo, y las anclas que
 * el artículo cita por número de línea se quedan viejas —22 por idioma— sin que
 * cambie una palabra del copy. Por eso pasa en casi todo PR y no solo en los que
 * tocan el artículo.
 *
 * La misma comprobación sin build y en milisegundos: la etiqueta (`D29`) viaja
 * DENTRO del enlace, así que el ancla correcta se deriva de `lib/decisions.ts` —
 * la misma función que la escribió— y se compara. Sin heurística y sin falsos
 * positivos.
 *
 * DETECTA, NO REESCRIBE. Arreglar el `.md` desde aquí sería un **segundo
 * generador** del mismo artefacto, que es lo que la cabecera de
 * `scripts/md/extraer.ts` rechaza por escrito: dos renderizadores de lo mismo
 * divergen en silencio. El arreglo sigue siendo `npm run build && npm run md`.
 *
 * LO QUE NO CUBRE, dicho para que no se dé por cubierto: todo lo demás del
 * markdown. Un verde de aquí NO es un verde de `md:verificar`; dice solo que las
 * anclas de decisión resuelven. Quien certifica el artefacto entero sigue siendo
 * el de al lado, en CI.
 *
 * Y AFIRMA CUÁNTO HA MIRADO, con su guarda de cero: un archivo sin anclas es
 * normal, pero CERO anclas en los 28 significa que la forma del enlace cambió y
 * este guardián se quedó mirando a un patrón que ya no existe — el modo de fallo
 * de esta casa, seis veces.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { lineasDeDecision } from "../../lib/decisions";

const RAIZ_MD = join("public", "md");

/** `[D29](…/DECISIONS.md?plain=1#L1179)` — la etiqueta y la línea, juntas. */
const ANCLA = /\[(D\d+)\]\([^)]*?DECISIONS\.md\?plain=1#L(\d+)\)/g;

/** Todo `.md` bajo `public/md/`, sin suponer cuáles citan decisiones. */
function mdEnDisco(raiz: string): string[] {
  const out: string[] = [];
  for (const entrada of readdirSync(raiz, { withFileTypes: true })) {
    const ruta = join(raiz, entrada.name);
    if (entrada.isDirectory()) out.push(...mdEnDisco(ruta));
    else if (entrada.name.endsWith(".md")) out.push(ruta);
  }
  return out;
}

const lineas = lineasDeDecision();
const archivos = mdEnDisco(RAIZ_MD);

type Desfase = {
  archivo: string;
  etiqueta: string;
  escrita: number;
  real: number | null;
};

const desfases: Desfase[] = [];
let ancladas = 0;

for (const archivo of archivos) {
  const texto = readFileSync(archivo, "utf8");
  for (const coincidencia of texto.matchAll(ANCLA)) {
    const etiqueta = coincidencia[1] ?? "";
    const escrita = Number(coincidencia[2]);
    ancladas += 1;
    const real = lineas.get(etiqueta) ?? null;
    if (real !== escrita) desfases.push({ archivo, etiqueta, escrita, real });
  }
}

// CUÁNTO HA MIRADO, siempre y antes del veredicto.
console.log(
  `\nmd:anclas — ${archivos.length} archivo(s) de markdown · ` +
    `${ancladas} ancla(s) de decisión · ${lineas.size} decisiones en DECISIONS.md`,
);

if (ancladas === 0) {
  console.error(
    "\nmd:anclas — cero anclas en los 28 archivos, y el artículo cita decisiones\n" +
      "por línea en sus dos idiomas. O el markdown no se ha generado, o la forma\n" +
      "del enlace cambió y este guardián se quedó mirando un patrón que ya no\n" +
      "existe. Las dos son rojo: un metro que no encuentra nada parece un aprobado.\n",
  );
  process.exit(1);
}

if (desfases.length > 0) {
  console.error(
    `\nmd:anclas — ${desfases.length} ancla(s) apuntan a la línea equivocada:\n`,
  );
  for (const { archivo, etiqueta, escrita, real } of desfases) {
    const destino =
      real === null
        ? "esa decisión ya no existe en DECISIONS.md"
        : `hoy está en la ${real}`;
    console.error(`  ${archivo} · ${etiqueta} → L${escrita} (${destino})`);
  }
  console.error(
    "\nEl markdown commiteado se ha quedado viejo. Se regenera con\n" +
      "  npm run build && npm run md\n" +
      "y NO se arregla a mano: el markdown lo escribe un solo generador.\n",
  );
  process.exit(1);
}

console.log("✓ Toda ancla de decisión del markdown apunta a su decisión.\n");
