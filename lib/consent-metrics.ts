// El contador de consentimiento (P68.61, opción 2) — las REGLAS, sin E/S.
//
// POR QUÉ EXISTE. `PRD-Live` §7 y D168 lo justificaban diciendo que la analítica
// de este sitio solo ve al tráfico que consiente, y que sin esa fracción el pico de
// un lanzamiento se mide como «volumen × tasa de aceptación», convolucionado.
//
// ESA PREMISA ERA FALSA Y ESTÁ MEDIDA EN D198 (2026-09-04): sin consentimiento GA4
// recibe igual un `page_view` por carga —sin cookies, con identidad nueva cada vez y
// contado como usuario nuevo—, así que el recuento de GA4 NO está deflactado por
// consentimiento y esto no es su deflactor. Lo que el consentimiento sí gatea es la
// IDENTIDAD (sin `_ga` no hay visitante recurrente) y el mapa de calor, que no carga.
//
// Lo que este contador mide sigue siendo un número que no se tenía: qué fracción de
// los visitantes nuevos acepta ser seguida, que es lo que dice cuánto vale lo que GA4
// llama «usuario» y lo que gobierna la única categoría que hoy gatea algo.
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
 * EL TECHO DEL LIMITADOR, Y POR QUÉ VIVE AQUÍ Y NO EN LA SERVER ACTION *(D199)*.
 *
 * Es un parámetro del INSTRUMENTO, no solo de la defensa: mientras estuvo en 10 el
 * contador se deflactaba tras cualquier NAT compartida, y al subirlo a 100 el
 * 2026-09-02 la misma población pasó a dar una cifra distinta. Dos lecturas
 * tomadas a los dos lados de ese cambio no son una serie: son dos metros.
 *
 * Un módulo `"use server"` solo puede exportar funciones asíncronas, así que la
 * constante no podía vivir en `app/consent-actions.ts` y ser leída por el sello a
 * la vez. Aquí la leen los dos, que es lo que impide que el número anotado en el
 * registro y el número que de verdad limita se separen sin que nadie lo note.
 */
export const TECHO_CONSENTIMIENTO_POR_IP_HORA = 100;

/**
 * QUÉ CUENTA COMO SEÑAL DE QUE HAY UNA PERSONA DELANTE *(2026-09-04, D200)*.
 *
 * El «visto» se contaba desde un `useEffect`, o sea a cualquier cliente que
 * ejecute JS con perfil limpio. Uno de esos clientes es NUESTRO: `npm run psi --
 * --registro` son 14 páginas × 2 estrategias × 3 tomas = **84 cargas de
 * producción**, cada una sumando un `visto` y ninguna una decisión. Y no es
 * teórico: la sonda de D198 metió **12 vistos y 0 decisiones** en una tarde,
 * medidos al dígito contra el sello anterior.
 *
 * Con esta lista el denominador pasa a ser **«vistos con oportunidad de decidir»**,
 * que es el honesto para una tasa de aceptación. La lista es CERRADA y lo que la
 * define es una sola regla: **todo suceso que pueda dispararse sin que nadie haga
 * nada queda fuera** — `load`, `DOMContentLoaded`, `visibilitychange` y `resize`
 * los produce el propio navegador al abrir una pestaña, y un cliente automatizado
 * los emite igual que una persona. Hay un test que lo comprueba.
 *
 * NO ES UN ANTIFRAUDE. Un cliente automatizado que mueva el puntero cuenta, y está
 * bien que cuente: esto no detecta bots, es no contarnos a nosotros mismos.
 */
export const SENALES_DE_PERSONA = [
  "pointerdown",
  "pointermove",
  "keydown",
  "touchstart",
  "wheel",
  "scroll",
] as const;

/**
 * Sucesos que el navegador dispara SIN que nadie haga nada. No es documentación:
 * `tests/consent-metrics.test.ts` comprueba que ninguno entra en la lista de
 * arriba, porque añadir uno sería volver al contador de antes sin que se note.
 */
export const SENALES_QUE_NO_VALEN = [
  "load",
  "DOMContentLoaded",
  "visibilitychange",
  "resize",
  "pageshow",
  "readystatechange",
] as const;

/**
 * Cómo se nombra ese instrumento en el sello de `npm run medicion`. Cadena y no
 * número porque lo que el sello compara es **identidad**: si no coincide con la
 * del sello anterior, avisa en vez de restar (D199).
 *
 * **Lleva las DOS cosas que definen el metro**, el techo y la puerta de entrada,
 * porque las dos cambian qué población acaba en el denominador. El 2026-09-04 la
 * segunda cambió, así que la serie se parte aquí y el sello siguiente lo dirá en
 * voz alta en vez de restar.
 */
export const INSTRUMENTO_CONSENTIMIENTO = `techo ${TECHO_CONSENTIMIENTO_POR_IP_HORA}/h por IP · visto tras interacción`;

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
 *   · **El límite de frecuencia se aplica por IP, no por navegador** *(2026-09-02)*.
 *     Detrás de un CGNAT móvil o de la red de una oficina, decenas de personas
 *     comparten la IP saliente; pasado el techo horario de `app/consent-actions.ts`
 *     los sucesos se descartan y `visto` deja de contar a gente que sí vio el
 *     diálogo. El techo subió de 10 a 100 por hora ese mismo día, así que hoy
 *     muerde mucho más arriba, **pero el modo de fallo no desaparece**: sigue ahí,
 *     por encima del número nuevo, y sesga en la misma dirección que la anterior.
 *     Su caso raro es el peor de leer: si el «visto» se descarta y la decisión
 *     llega ya con el cupo repuesto, `aceptado + rechazado` puede superar a
 *     `visto` y los «sin decidir» salen **negativos**.
 *   · **Y la cuarta, que hasta el 2026-09-04 no estaba escrita porque no
 *     existía la palabra para ella: el contador no separaba una CARGA
 *     AUTOMATIZADA de una persona.** Sumaba a cualquier cliente que ejecutase JS
 *     con perfil limpio, y uno de ellos es nuestro (`npm run psi -- --registro`,
 *     84 cargas de producción por corrida). Desde hoy el «visto» espera a una de
 *     las `SENALES_DE_PERSONA`, así que el denominador es «vistos con
 *     **oportunidad de decidir**». Lo que eso deja fuera, y sesga en la
 *     dirección CONTRARIA a las dos de arriba: quien lee sin mover nada —sin
 *     puntero, sin teclado y sin scroll— ve el diálogo y no cuenta.
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
 * Y LA TASA YA NO ES UN SUELO LIMPIO *(2026-09-04)*. Hasta hoy las dos salvedades
 * con dirección conocida —almacenamiento bloqueado y límite por IP— sesgaban a la
 * misma, así que lo medido era un suelo de lo real. La puerta de interacción sesga
 * en la dirección contraria: deja fuera del denominador a quien lee sin mover nada.
 * Así que lo honesto ya no es «suelo» sino **«no es una estimación centrada, y las
 * dos direcciones están nombradas»** — que es peor titular y mejor descripción. Se
 * dice aquí porque el sitio de una salvedad es al lado del número, no en un
 * documento aparte.
 */
export const SALVEDAD_TASA =
  "Es la tasa de los visitantes NUEVOS que llegaron a interactuar con la página, no la del total: a quien ya decidió no se le vuelve a pintar el diálogo, y desde el 2026-09-04 un «visto» solo cuenta tras una señal de persona (puntero, teclado o scroll), para no contar nuestras propias cargas automatizadas. No es una estimación centrada y se desvía por tres vías conocidas: quien bloquea el almacenamiento local cuenta como visto en cada visita y nunca como decisión; el límite de frecuencia va por IP, así que tras una misma NAT los sucesos que pasen del techo horario no se cuentan; y quien lee sin mover nada no entra en el denominador.";
