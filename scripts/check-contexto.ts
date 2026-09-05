/**
 * ¿Cabe el contexto de arranque? — `npm run check:contexto`, en CI.
 *
 * POR QUÉ EXISTE. D28 escribió el régimen de contexto —solo las reglas activas se
 * `@`-importan; la historia y el detalle van a demanda— y no le puso NI CIFRA NI
 * GUARDIÁN. Así que se cumplió exactamente cuatro días. Medido el 2026-08-19:
 *
 *     09-ago   9.275 palabras   ← el día del corte de BRAND.md (P37.685)
 *     10-ago  12.116
 *     16-ago  13.521
 *     18-ago  18.098
 *     19-ago  19.805            ← +113% en diez días
 *
 * El corte de `BRAND.md` compró 2.400 palabras y el crecimiento se las comió en
 * cuatro días. Es «una regla que hay que recordar es una regla que se incumple»
 * aplicada a la regla que gobierna las reglas.
 *
 * POR QUÉ UN TECHO Y NO UN AVISO. Porque un aviso es lo que ya había: la regla
 * estaba escrita en `CLAUDE.md` y en `DECISIONS.md`, y las dos veces en prosa. Lo
 * que convierte una intención en una restricción es que falle el build.
 *
 * Y POR QUÉ EL TECHO NO ES EL OBJETIVO. Un gate que nace en rojo se acaba
 * subiendo hasta que no significa nada, así que este nació en verde y actúa de
 * trinquete: impide crecer y deja ver cuánto falta para el objetivo. **Se aprieta
 * conforme se compacta, nunca se afloja.**
 *
 * EL OBJETIVO SE ALCANZÓ EL 2026-08-22 (11.976), así que a partir de aquí deja de
 * ser una distancia y pasa a ser una línea que hay que sostener. El techo queda
 * por encima con holgura de trabajo —una sesión normal escribe y borra párrafos—.
 *
 * Y ESA HOLGURA ES LA MAGNITUD QUE HAY QUE SOSTENER, no el techo (2026-08-24,
 * P68.675). Aquí estaba escrito que el próximo apretón era a 12.000, y NO se hizo:
 * con 11.957 medidos habría dejado 43 palabras de margen, que es justo el estado
 * que originó esta tarea. El 2026-08-23 quedaron 17, y el 2026-08-24 una regla
 * nueva de tres líneas no cupo y hubo que retirar antes para pagarla. Un techo que
 * no deja escribir no produce compactación: produce el reflejo de subirlo, que es
 * lo único que este gate no puede permitirse. Se aprieta el techo hasta dejar unas
 * 240 palabras —cinco o seis reglas— y se baja el objetivo, que es quien lleva la
 * ambición.
 */

import { revisaApertura } from "./contexto/apertura";
import { revisaDocumentos } from "./contexto/documentos";
import { revisaSkills } from "./contexto/skills";
import { revisaTechos } from "./contexto/techos";
import { revisaVerificacion } from "./contexto/verificacion";

// LAS MITADES ESTABAN NUMERADAS AQUÍ DENTRO desde que existen, así que la costura
// no había que inventarla (D148/D187). Cada una vive en su módulo y esto es el
// orden en que corren — que importa: `revisaApertura` necesita las cifras que
// miden las dos primeras.
//
// LA QUINTA (2026-09-05, P72.53) NO MIDE PALABRAS SINO LÍNEAS DE CÓDIGO, y aun así
// su sitio es este: lo que vigila `check:contexto` no es el texto, es **el peso de
// lo que este método arrastra**, y `scripts/` es el tercer corpus que la regla de
// retirada de `CLAUDE.md` nombra. Era además el único de los tres que se medía sin
// suspender nunca.
const total = revisaDocumentos();
const sumaSkills = revisaSkills();
revisaTechos();
revisaApertura(total, sumaSkills);
revisaVerificacion();
