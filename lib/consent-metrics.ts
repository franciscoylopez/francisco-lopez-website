// El contador de consentimiento (P68.61, opción 2) — las REGLAS, sin E/S.
//
// POR QUÉ EXISTE. `PRD-Live` §7 y D168: la analítica de este sitio solo ve al
// tráfico que consiente, y hasta hoy la fracción que consiente se desconocía. Sin
// ese denominador, lo que se mide en el pico de un lanzamiento es «volumen × tasa
// de aceptación», convolucionado y sin poder separarlo. Esto lo separa.
//
// POR QUÉ PUEDE CONTARSE SIN CONSENTIMIENTO. Porque no mide a nadie: incrementa
// tres enteros. El diálogo se pinta SIEMPRE —esa es la premisa que hace posible la
// medición— y lo único que sale del navegador es cuál de tres cosas ocurrió. Ni
// IP, ni user-agent, ni identificador, ni marca de tiempo por evento. Un contador
// agregado no es un tratamiento de datos personales, y por eso no hereda el límite
// que describe D168 en vez de sumarse a él.
//
// LA PARTICIÓN es la de `lib/contact-form.ts` ↔ `app/[lang]/contacto/actions.ts` y
// la de `tablero/reglas.ts`: aquí las reglas, puras y con tests; la E/S, aparte.
// Un módulo `"use server"` solo puede exportar funciones asíncronas, así que los
// tipos y las constantes no cabrían ahí de todos modos.

import type { ConsentChoice } from "./consent";

/**
 * Los tres sucesos que se cuentan. Es un conjunto CERRADO y esto importa fuera de
 * TypeScript: la Server Action es un POST público, así que lo que valida la
 * entrada es esta lista, no la confianza en quien llama.
 */
export const EVENTOS_CONSENTIMIENTO = [
  "visto",
  "aceptado",
  "rechazado",
] as const;

export type EventoConsentimiento = (typeof EVENTOS_CONSENTIMIENTO)[number];

export function esEventoConsentimiento(
  valor: unknown,
): valor is EventoConsentimiento {
  return (
    typeof valor === "string" &&
    (EVENTOS_CONSENTIMIENTO as readonly string[]).includes(valor)
  );
}

/**
 * Qué cuenta como «aceptado». NO es «pulsó el botón de aceptar todo», y confundir
 * las dos cosas es el mismo error que D153 corrigió en el formulario: allí el
 * «enviado» tenía tres causas y solo una mandaba correo.
 *
 * Aquí el denominador que hace falta es el de la ANALÍTICA, porque es la única
 * categoría que hoy gatea algo (`marketing` está cableado y sin uso). Alguien que
 * abre las preferencias, concede analíticas y deniega marketing **acepta** a
 * efectos de este contador, aunque no haya pulsado «Aceptar todo»: su visita SÍ la
 * ve GA4, que es exactamente lo que la fracción tiene que describir.
 *
 * Es una función y no una comparación dentro del componente por la misma razón que
 * `cuentaComoEnvio`: aquí la decisión tiene tests, y dentro de un manejador de
 * clic no tendría ninguno.
 */
export function cuentaComoAceptado(
  choice: ConsentChoice,
): EventoConsentimiento {
  return choice.analytics ? "aceptado" : "rechazado";
}

/**
 * La marca de «a este navegador ya se le contó el diálogo». Almacenamiento
 * necesario, igual que `flm-consent`: no es cookie y no requiere consentimiento.
 *
 * SIN ESTO EL DENOMINADOR NO SIGNIFICA NADA. El diálogo se pinta en cada visita
 * que aún no ha decidido, así que contar «visto» por pintado cuenta páginas vistas
 * y no personas, y el ratio contra un «aceptado» que sí ocurre una sola vez sale
 * arbitrariamente bajo. Es la trampa que `BRAND.md` §Cómo medir llama un umbral
 * mal aplicado: la cifra sería impecable y no mediría lo que dice medir.
 */
export const CONSENT_SEEN_KEY = "flm-consent-seen";

/** Los tres contadores, tal como se leen. */
export type Contadores = {
  visto: number;
  aceptado: number;
  rechazado: number;
};

/**
 * La tasa de aceptación, o `null` cuando todavía no se puede afirmar.
 *
 * DEVUELVE `null` Y NO CERO CON DENOMINADOR VACÍO, que es la regla que este
 * proyecto se ha encontrado cinco veces: *un metro que devuelve lista vacía parece
 * un aprobado*. Un 0 % impreso junto a «0 vistos» se lee como un hallazgo
 * demoledor y es la ausencia de dato.
 */
export function tasaDeAceptacion(contadores: Contadores): number | null {
  if (contadores.visto <= 0) return null;
  return contadores.aceptado / contadores.visto;
}

/**
 * Lo que las cuentas NO cuadran, y conviene tenerlo escrito antes de leer la
 * primera cifra: `visto` y `aceptado + rechazado` no tienen por qué coincidir.
 *
 *   · Alguien ve el diálogo y se va sin decidir → suma en `visto` y en nada más.
 *     Es correcto y es justo la gente que hace que la tasa no sea 100 %.
 *   · Alguien borra su almacenamiento y vuelve → suma dos veces en las dos.
 *   · Un navegador que bloquea `localStorage` no marca nunca la marca de visto, así
 *     que suma en `visto` en cada visita. Infla el denominador y hunde la tasa.
 *
 * Lo que SÍ está cerrado, porque rompía la cuenta en la otra dirección: cambiar de
 * opinión desde el centro de preferencias NO vuelve a contar. Solo cuenta la
 * primera decisión de cada navegador, así que `aceptado + rechazado` no puede
 * superar a `visto` por esa vía.
 *
 * Y LA QUE MÁS CAMBIA LO QUE LA CIFRA SIGNIFICA, vista en producción el 2026-08-31:
 * **este contador solo ve a los visitantes NUEVOS.** A quien ya decidió no se le vuelve a
 * pintar el diálogo, así que no suma en `visto` — mientras que Vercel Web Analytics
 * (D170) sí lo cuenta. Las dos cifras no son el mismo denominador y no se dividen la una
 * por la otra sin decirlo.
 *
 * No es un defecto: para lo que existe —leer el pico de un lanzamiento, que es tráfico
 * que llega por primera vez— la población correcta es justamente esa. Pero la tasa hay
 * que enunciarla entera: **de cada cien visitantes NUEVOS, cuántos aceptan.**
 *
 * De las tres que quedan, la del almacenamiento bloqueado es la única que sesga en
 * una dirección conocida, así que la tasa medida es un SUELO de la real y no una
 * estimación centrada. Se dice aquí porque el sitio de una salvedad es al lado del
 * número, no en un documento aparte.
 */
export const SALVEDAD_TASA =
  "Es la tasa de los visitantes NUEVOS, no del total: a quien ya decidió no se le vuelve a pintar el diálogo. Y es un suelo, porque quien bloquea el almacenamiento local cuenta como visto en cada visita y nunca como decisión.";
