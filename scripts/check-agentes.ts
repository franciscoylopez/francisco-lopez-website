/**
 * ¿Sigue en pie lo que este sitio le promete a un agente? — `npm run check:agentes`.
 *
 * POR QUÉ EXISTE, Y POR QUÉ NO ES UN ESCÁNER DE TERCEROS. La pregunta que lo
 * abrió fue si había un plugin o una skill para meter en la rutina los dos
 * escáneres de agentes que se pasaron al abrir el sprint. La respuesta honesta es
 * que no debe haberlo, por dos razones que este repo ya tenía medidas:
 *
 *   1. **Su nota mezcla lo que aplica con lo que no.** Un 20/100 donde doce de
 *      los checks son de superficies que el sitio no tiene no es una señal: es
 *      ruido con forma de nota, y perseguirla lleva a publicar un `api-catalog`
 *      sin API.
 *   2. **Un metro que no controlamos cambia sin avisar.** Sus checks son
 *      estándares emergentes en borrador; el día que uno se mueva, el gate se
 *      pone rojo o verde por algo que no hemos decidido.
 *
 * Así que un escáner es DESCUBRIMIENTO —se pasa cuando se quiere mirar— y la
 * rutina es esto: un guardián que vigila **las invariantes que este sprint
 * decidió adoptar, y solo esas**. Es el criterio de D51: si se dispara en un
 * evento y no requiere criterio, es un script en CI.
 *
 * QUÉ MIRA, Y DÓNDE MIRA CADA COSA. La regla 1 de `BRAND.md` §Cómo se escribe una
 * regla —la condición se comprueba donde la cosa ocurre— aquí obliga a cuatro
 * fuentes distintas, y mezclarlas habría sido el fallo:
 *
 *   · `llms.txt`  → el ARTEFACTO del build, no el código que lo genera.
 *   · la negociación de markdown → EJECUTANDO `proxy()`, porque una cabecera no
 *     está en el prerender: el HTML no sabe con qué `Vary` se sirvió.
 *   · `robots.txt` → EJECUTANDO `robots()` con los dos entornos, porque el
 *     artefacto que se construye en CI es el de NO producción (D13) y leerlo
 *     daría por bueno un `Disallow: /` que en producción sería catastrófico.
 *   · las cabeceras y los ALIAS → probando rutas contra la REGEX COMPILADA que el
 *     build deja en `routes-manifest.json`, que es la que el servidor usa de
 *     verdad. Leer el `source` de `next.config.ts` habría sido opinar sobre una
 *     cadena, y comparar la configuración consigo misma aprueba siempre.
 *
 * LO QUE NO MIRA, dicho para que no se dé por cubierto:
 *
 * - **La nota de ningún escáner.** Es lo primero que deja fuera, a propósito.
 * - **El estado HTTP de verdad.** Una ruta inexistente 404 se comprueba por su
 *   ESTRUCTURA —que no haya catch-all que conteste 200 a cualquier cosa— y no
 *   haciendo la petición: eso necesita servidor, y este gate corre en CI sin uno.
 *   Es un proxy honesto del modo de fallo real, no la medición.
 * - **Que el markdown sea FIEL a la página.** Eso es `md:verificar` (D158). Aquí
 *   se mira que el canal exista y que la promesa de `llms.txt` resuelva.
 * - **Que el copy sea bueno.** `llms.txt` puede decir tonterías y pasar esto.
 *
 * Y AFIRMA CUÁNTO HA MIRADO —rutas, variantes, señales y casos de negociación—,
 * porque un metro que devuelve lista vacía parece un aprobado y este repo se lo
 * ha encontrado seis veces (D70).
 */

/*
 * DÓNDE ESTÁ CADA BLOQUE. Este archivo era de 1.015 líneas y ocho bloques
 * independientes, y desde P72.195 cada uno vive en su módulo dentro de
 * `scripts/agentes/`: `llms`, `negociacion`, `robots`, `rutas`, `manifiesto` y
 * `catalogo`, sobre dos piezas compartidas —`informe` (lo que falla y cuánto se
 * ha mirado) y `sitio` (dónde deja el build cada artefacto, y la silueta de las
 * URLs)—. Aquí queda lo único que es de todos: el orden en que corren y el
 * informe que publican.
 */
import { problemas, vistos } from "./agentes/informe";
import { revisarCatalogo } from "./agentes/catalogo";
import { revisarCanalMarkdown, revisarLlmsTxt } from "./agentes/llms";
import { revisarAlias, revisarCabeceras } from "./agentes/manifiesto";
import { revisarNegociacion } from "./agentes/negociacion";
import { revisarRobots } from "./agentes/robots";
import { revisarCatchAll } from "./agentes/rutas";

const llms = revisarLlmsTxt();
revisarCanalMarkdown(llms);
revisarNegociacion();
revisarRobots();
revisarCatchAll();
revisarCabeceras();
revisarAlias();
revisarCatalogo();

console.log(
  `check:agentes — lo que este sitio le promete a un agente\n` +
    `  llms.txt   ${vistos.paginasEnLlms} páginas del registro nombradas · 2 secciones del sprint\n` +
    `  markdown   ${vistos.variantesMd} variantes en disco · las URLs que anuncia resuelven\n` +
    `  negociar   ${vistos.negociaciones} casos por \`proxy()\`: markdown sí, navegador no, \`q=0\` no, \`Vary\` en ambos, 404 con salida\n` +
    `  robots     ${vistos.entornosRobots} entornos (producción abre y sella el sitemap; el resto cierra, D13)\n` +
    `  señales    ${vistos.senalesDeContenido} Content Signals comprobadas por su valor decidido (P67.8)\n` +
    `  404        ${vistos.segmentosDinamicos} segmentos dinámicos, ninguno catch-all\n` +
    `  cabeceras  ${vistos.rutasDeCabecera} rutas contra la regex compilada del manifiesto: \`Vary\` solo donde se negocia, seguridad en todas\n` +
    `  alias      ${vistos.alias} rutas que un agente adivina: 307 a un destino que existe\n` +
    `  catálogo   ${vistos.entradasArd} entradas, servidas idénticas en sus dos rutas (\`ard.json\` y \`ai-catalog.json\`): el modelo de entrada del conformance, y cada \`url\` resuelta contra el disco`,
);

// El suelo del metro. Con cero entradas esto aprobaría siempre, que es el modo de
// fallo que el propio guardián existe para no tener.
const vacios = Object.entries(vistos).filter(([, n]) => n === 0);
if (vacios.length) {
  console.error(
    `\ncheck:agentes — NO HA MIRADO NADA en: ${vacios.map(([k]) => k).join(", ")}.\n` +
      "Con cero entradas ese trozo aprueba siempre, así que falla a propósito.",
  );
  process.exit(1);
}

if (problemas.length) {
  console.error(`\n✗ ${problemas.length} problema(s):\n`);
  for (const p of problemas) console.error(`  · ${p}\n`);
  process.exit(1);
}

console.log(
  "\n✓ El índice, el canal markdown, la negociación y las reglas de rastreo dicen lo que prometen.",
);
