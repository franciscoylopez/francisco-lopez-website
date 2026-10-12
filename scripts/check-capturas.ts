/**
 * ¿Las capturas del README siguen diciendo la verdad? — `npm run check:capturas`.
 *
 * El porqué, la decisión de no sellar el render y lo que esto deja fuera están en
 * `content/readme/capturas.ts`, junto a la declaración que describe. Aquí solo la
 * E/S y el veredicto, misma partición que `guardianes/casos.ts` y
 * `tablero/reglas.ts`.
 *
 * BUSCA LA AUSENCIA, no el patrón: comprueba que cada archivo declarado EXISTE
 * (una captura borrada dejaría el README con un hueco y este guardián verde) y
 * que cada frase transcrita SIGUE saliendo de su fuente. Y afirma cuántas
 * capturas y cuántas afirmaciones ha mirado, porque una lista vacía parece un
 * aprobado y en este repo eso ha pasado cinco veces (D38/D57/D60/D63).
 */
import { existsSync } from "node:fs";

import { CAPTURAS } from "../content/readme/capturas";

const fallos: string[] = [];
let afirmaciones = 0;

for (const captura of CAPTURAS) {
  if (!existsSync(captura.archivo)) {
    fallos.push(
      `${captura.archivo} — declarada aquí y no está en el disco. O se rehace, o sale de \`content/readme/capturas.ts\` y del README.`,
    );
    continue;
  }

  for (const a of captura.afirmaciones) {
    afirmaciones++;
    const vivo = a.fuente();
    if (vivo === a.dice) continue;
    fallos.push(
      `${captura.archivo} · ${a.donde}\n` +
        `      la imagen enseña : «${a.dice}»\n` +
        `      el sitio dice hoy: «${vivo}»`,
    );
  }
}

console.log(
  `\ncheck:capturas — ${CAPTURAS.length} captura(s) del README · ${afirmaciones} afirmación(es) contrastadas con su fuente viva`,
);

if (fallos.length === 0) {
  console.log(
    "✓ Toda captura existe y toda frase que enseña sigue saliendo del sitio.\n",
  );
  process.exit(0);
}

console.error(
  `\ncheck:capturas — ${fallos.length} afirmación(es) de la portada han dejado de ser ciertas:\n`,
);
for (const f of fallos) console.error(`  · ${f}`);
console.error(
  "\n    El repositorio es público (D68), así que esto es lo primero que ve quien\n" +
    "    llega. Una captura no se regenera por código: se REHACE a mano sobre el\n" +
    "    sitio servido y se actualiza su transcripción en `content/readme/capturas.ts`.\n",
);
process.exit(1);
