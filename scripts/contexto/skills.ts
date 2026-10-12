import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { palabras, vigente, type Movimiento } from "./presupuesto";

/* ─────────────────────────────────────────────────────────────────────────────
 * SEGUNDA MITAD: LAS SKILLS Y LOS AGENTES (2026-08-24, P68.67).
 *
 * El presupuesto de arriba vigilaba los cuatro `@`-importados y nada más,
 * mientras la mitad no vigilada pesaba 1,61× la vigilada —19.884 palabras
 * contra 11.957— y crecía al revés: entre el 08-08 y el 08-22, lo vigilado
 * +34% y las skills +233%. Las curvas se cruzaron el 2026-08-19, el día del
 * primer `method-review`: ese día lo vigilado bajó 437 palabras y lo no
 * vigilado subió 6.816. Es el mismo modo de fallo que D69 arregló para los
 * documentos —crece porque nada pregunta qué sobra—, en el sitio donde nadie
 * miraba.
 *
 * POR QUÉ UN TECHO POR SKILL. Una skill se carga ENTERA cuando se dispara, así
 * que lo primero que importa es cuánto cuesta LA MÁS CARA.
 *
 * Y POR QUÉ TAMBIÉN A LA SUMA, desde el 2026-08-27 (P68.5907). Este comentario
 * decía «un total aquí no significa nada: las nueve entradas no se cargan nunca
 * a la vez», y la salida lo repetía en cada corrida. Era cierto y no era toda la
 * verdad: **un techo por entrada y ninguno al conjunto hace que mover una regla
 * de un documento a una skill salga GRATIS**, y eso es exactamente lo que pasó.
 * El sexto `method-review` lo midió entre el 19 y el 27 de agosto: docs −30 %,
 * skills +55 %, corpus total **+6 %**. Se celebró una reducción en el lado
 * medido mientras el lado sin medir absorbía el coste y algo más. Es una familia
 * de fallo propia —«la reducción que fue una mudanza»— y el trinquete solo la
 * cierra si es simétrico.
 *
 * El argumento de la concurrencia además se cae solo en la práctica: un cierre
 * de etapa encadena `sprint-review` → `method-review` → `close-session` en la
 * misma sesión, encima de los cuatro documentos. Ahí sí suman.
 *
 * SIN OBJETIVO, Y ES DELIBERADO. Los otros dos presupuestos llevan techo +
 * objetivo porque su objetivo sale de una historia medida. Para la suma de
 * skills esa curva no existe todavía: poner un objetivo hoy sería elegir un
 * número y llamarlo medida, que es justo lo que D128 acaba de corregir. Se sella
 * y se mide; el objetivo se pone cuando haya curva que lo justifique.
 *
 * EL NÚMERO SALE DE MEDIR EL RUIDO PRIMERO, no de elegirlo. Barrido sobre las
 * nueve entradas reales: a 4.500 lo cruza UNA, a 2.500 dos, a 2.000 tres y a
 * 1.500 seis. Un techo que descalifica a media casa está mal puesto él, no las
 * skills; 4.500 —el tamaño del mayor `@`-importado— señala exactamente al
 * outlier y deja pasar al resto.
 *
 * Y NACE EN VERDE, por la misma razón que el techo de arriba: un gate que nace
 * en rojo se sube hasta que no significa nada. `design-review` medía 6.290 y era
 * quien tenía el margen —la única skill que no se había revisado desde que se
 * escribió, y el sprint 2 le añadió una fase entera—, así que el TECHO nació por
 * encima de ella y el OBJETIVO, que solo avisa, la nombró en cada corrida hasta
 * que se compactó. **Y el techo bajó detrás**, que es lo que hace que esto sea un
 * trinquete y no un aviso.
 *
 * LO QUE ESTE METRO NO VE, y conviene saberlo: las skills de usuario
 * (`~/.claude/skills/`) también se cargan enteras y no están en el repositorio,
 * así que CI no puede medirlas. Aquí se vigila lo que el proyecto sí controla.
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * Falla por encima de aquí, POR ENTRADA. **Se aprieta conforme se compacta**, y su
 * historial es dato como el de arriba.
 */
export const HISTORIAL_TECHO_SKILL: Movimiento[] = [
  {
    fecha: "2026-08-24",
    valor: 6_400,
    motivo: "nace, con design-review medida en 6.290",
  },
  {
    fecha: "2026-08-24",
    valor: 4_600,
    motivo:
      "retirada sobre design-review (6.290 → 4.499). Ninguna regla se retiró: la Fase 3 reescribía el censo de BRAND.md y el axe de viewport-verifier, y el filtro mecánico estaba dos veces seguidas",
  },
];

const TECHO_SKILL = vigente(HISTORIAL_TECHO_SKILL);

/** A dónde se quiere llegar por entrada: el tamaño del mayor `@`-importado. */
const OBJETIVO_SKILL = 4_500;

/**
 * Falla por encima de aquí, SUMANDO todas las entradas. **Se aprieta conforme se
 * compacta**, igual que el de arriba, y su historial también es dato.
 *
 * OJO AL COMPARAR CON EL INFORME que originó esto, que dice 20.616 donde aquí
 * pone 20.203. No es drift ni una medida vieja: **este contador descuenta los
 * bloques de código y el del informe no** (20.688 con ellos, comprobado). El
 * número que gobierna es el de aquí, que es el mismo con el que se miden los
 * documentos — comparar dos corpus con dos varas distintas era la mitad del
 * problema.
 */
export const HISTORIAL_TECHO_SUMA: Movimiento[] = [
  {
    fecha: "2026-08-27",
    valor: 20_500,
    motivo:
      "nace en verde (P68.5907), sellado contra la suma de DESPUÉS de la propia tarea —20.262, no las 20.203 de antes—, porque actualizar la tabla de umbrales de method-review es parte de ella. Holgura 238, la misma magnitud que defiende el techo de los documentos",
  },
];

const TECHO_SUMA = vigente(HISTORIAL_TECHO_SUMA);

/** Las carpetas de contexto a demanda que vivan en el repo. Del DISCO, nunca de
 *  una lista escrita: una skill nueva entra en el presupuesto sin que nadie se
 *  acuerde, igual que una página entra en el censo por `PAGE_SLUGS`. */
const CARPETAS = [".claude/skills", ".claude/agents", ".claude/commands"];

function mdRecursivo(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return mdRecursivo(p);
    return e.name.endsWith(".md") ? [p] : [];
  });
}

/** Una entrada = una skill, con todos los `.md` que la componen sumados: lo que
 *  cuesta dispararla es su carpeta entera, no su `SKILL.md`. */
function indiceDeEntradas(): Map<
  string,
  { palabras: number; archivos: number }
> {
  const entradas = new Map<string, { palabras: number; archivos: number }>();
  for (const carpeta of CARPETAS) {
    for (const archivo of mdRecursivo(carpeta)) {
      // Separador normalizado antes de partir: en Windows `relative` devuelve
      // `\`, y una clase de caracteres mal escapada partiría solo por `/` y
      // dejaría el nombre en «design-review\SKILL».
      const resto = relative(carpeta, archivo).replaceAll("\\", "/").split("/");
      const primero = resto[0] ?? archivo;
      const nombre = resto.length > 1 ? primero : primero.replace(/\.md$/, "");
      const acc = entradas.get(nombre) ?? { palabras: 0, archivos: 0 };
      acc.palabras += palabras(readFileSync(archivo, "utf8"));
      acc.archivos += 1;
      entradas.set(nombre, acc);
    }
  }
  return entradas;
}

/** La suma medida, que la cuarta mitad necesita. */
export function revisaSkills(): number {
  const entradas = indiceDeEntradas();

  if (entradas.size === 0) {
    console.error(
      "\ncheck:contexto — NO HA MIRADO NINGUNA SKILL. Con cero entradas esta mitad\n" +
        "aprobaría siempre, así que falla a propósito. ¿Se han movido de sitio?\n" +
        `Esperaba .md bajo: ${CARPETAS.join(", ")}\n`,
    );
    process.exit(1);
  }

  const porTamano = [...entradas].sort((a, b) => b[1].palabras - a[1].palabras);
  const sumaSkills = porTamano.reduce((n, [, v]) => n + v.palabras, 0);

  // El metro afirma cuánto ha mirado (y no al revés).
  console.log(
    `\ncheck:contexto — ${entradas.size} entradas a demanda (skills y agentes del repo),` +
      ` techo ${TECHO_SKILL} por entrada:`,
  );
  for (const [nombre, v] of porTamano) {
    const marca =
      v.palabras > TECHO_SKILL ? " ✗" : v.palabras > OBJETIVO_SKILL ? " ⚠" : "";
    console.log(`  ${String(v.palabras).padStart(6)}  ${nombre}${marca}`);
  }
  console.log(
    `  ${String(sumaSkills).padStart(6)}  suma · techo ${TECHO_SUMA}` +
      ` (holgura ${TECHO_SUMA - sumaSkills})`,
  );

  const pasadas = porTamano.filter(([, v]) => v.palabras > TECHO_SKILL);
  if (pasadas.length > 0) {
    console.error(
      `\ncheck:contexto — ${pasadas.length} entrada(s) por encima del techo de ` +
        `${TECHO_SKILL} palabras:\n` +
        pasadas.map(([n, v]) => `  ${v.palabras}  ${n}`).join("\n") +
        "\n\nUna skill se carga ENTERA al dispararse. Lo que toca no es subir el techo,\n" +
        "es retirar: ¿hay una fase que ya no se usa, un ejemplo que repite al de\n" +
        "arriba, o un porqué fechado que debería estar en el documento histórico?\n",
    );
    process.exit(1);
  }

  if (sumaSkills > TECHO_SUMA) {
    console.error(
      `\ncheck:contexto — LA SUMA DE SKILLS NO CABE: ${sumaSkills} palabras, ` +
        `${sumaSkills - TECHO_SUMA} por encima del techo de ${TECHO_SUMA}.\n\n` +
        "El techo por entrada ya está en verde, así que esto no lo arregla compactar\n" +
        "la mayor: es que el conjunto ha crecido. Y lo que NO vale es subir el techo,\n" +
        "porque este existe para que mover una regla de un documento a una skill deje\n" +
        "de salir gratis — sin él, una retirada de docs puede ser una mudanza y el\n" +
        "corpus total crece mientras el informe celebra la bajada.\n" +
        "Lo que toca: retirar de alguna entrada, o no añadir.\n",
    );
    process.exit(1);
  }

  const sobreObjetivo = porTamano.filter(
    ([, v]) => v.palabras > OBJETIVO_SKILL,
  );
  if (sobreObjetivo.length > 0) {
    console.log(
      `  ⚠ ${sobreObjetivo.length} por encima del objetivo de ${OBJETIVO_SKILL}: ` +
        sobreObjetivo.map(([n, v]) => `${n} (${v.palabras})`).join(", ") +
        ". No falla, pero es de donde sale el próximo apretón.",
    );
  } else {
    // Con todo bajo el objetivo, el consejo útil no es «baja el techo» a secas: eso
    // se quedaría escrito para siempre, incluido el día en que el techo ya está
    // pegado a la entrada mayor. Se publica la holgura real y solo se pide apretar
    // cuando la hay.
    const mayor = porTamano[0]?.[1].palabras ?? 0;
    const holgura = TECHO_SKILL - mayor;
    console.log(
      `✓ Ninguna entrada pasa del objetivo de ${OBJETIVO_SKILL} palabras. ` +
        (holgura > 500
          ? `Al techo (${TECHO_SKILL}) le sobran ${holgura} sobre la mayor (${mayor}): bájalo.`
          : `La mayor mide ${mayor}, a ${holgura} del techo: el trinquete está apretado.`),
    );
  }

  return sumaSkills;
}
