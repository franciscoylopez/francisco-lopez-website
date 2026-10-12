// Constantes del sitio, fuente única para metadata / OG / canonical / robots /
// sitemap. Precedencia de la URL base:
//   1) NEXT_PUBLIC_SITE_URL — override manual explícito (p. ej. el dominio propio).
//   2) En producción, VERCEL_PROJECT_PRODUCTION_URL — la URL ESTABLE de producción,
//      no la efímera del deployment (VERCEL_URL cambia en cada deploy, lo que dejaba
//      canonical/OG/sitemap apuntando a un host distinto cada vez). Vercel pone esta
//      variable al dominio propio en cuanto se conecta, así que el canónico lo sigue
//      sin tocar código.
//   3) VERCEL_URL — la URL única del deployment: correcta para los previews de rama.
//   4) localhost en desarrollo.
const vercelHost =
  process.env.VERCEL_ENV === "production"
    ? (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)
    : process.env.VERCEL_URL;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

export const SITE_NAME = "Francisco López";

// El dominio canónico, PARA MOSTRARLO. No sale de `SITE_URL` a propósito: esa
// resuelve el host del ENTORNO donde corre, y hay un consumidor que se genera
// fuera del sitio —el CV en PDF, `npm run cv`— donde el entorno es la máquina de
// Francisco. Derivarlo de `SITE_URL` imprimiría «localhost:3000» en el papel.
export const SITE_DOMAIN = "franciscolopez.es";

// ID del contenedor de Google Tag Manager (P21), solo cuando la analítica debe
// correr: en producción (D13 — nunca en dev/preview, para no ensuciar los datos) y
// con NEXT_PUBLIC_GTM_ID definido en el entorno de Vercel. Devuelve `undefined` en
// cualquier otro caso, y el layout omite el contenedor por completo.
//
// OJO: este gate manda sobre la ANALÍTICA, no sobre la UI de consentimiento. El
// banner y el diálogo de preferencias se montan en todos los entornos (P37.5975).
// Colgaban de aquí, y el efecto era que una superficie entera de interfaz —modal,
// cuatro botones y un switch— solo existía en producción: no se podía revisar ni en
// dev ni en preview, o sea, solo DESPUÉS de publicarla. Se vio al arreglar la bolita
// del switch en P37.593, que fallaba el 3:1 y hubo que verificarla inyectando el
// markup a mano en otra página porque el componente real no era observable.
// Montarla fuera de producción no envía nada a ningún sitio: sin GTM cargado,
// `applyConsent` empuja al `dataLayer` que nadie lee y `saveConsent` escribe en
// `localStorage`. D13 se mantiene intacta — lo que se separa es qué se dibuja de
// qué se mide.
export const GTM_ID =
  process.env.VERCEL_ENV === "production"
    ? process.env.NEXT_PUBLIC_GTM_ID
    : undefined;

/**
 * Vercel Web Analytics, y **solo en producción** (P68.61 opción 1, D170).
 *
 * MISMO GATE QUE GTM, Y CONVIENE SABER POR QUÉ **NO** ES POR LO QUE PARECE.
 * Aquí ponía que fuera de producción el endpoint no existe. **Medido el
 * 2026-08-31: es al revés.** El Preview de la rama sirve
 * `/_vercel/insights/script.js` con 200 y producción daba 404, porque lo inyecta
 * el despliegue y el de producción era anterior a activar la herramienta.
 *
 * Los motivos que sí se sostienen son otros dos, y el segundo manda:
 *
 *   1. En Preview el tráfico somos nosotros revisando un PR. Vercel separa los
 *      datos por entorno —su panel tiene el filtro—, así que no es
 *      envenenamiento como el que el contador tuvo que resolver; es ruido que
 *      alguien tendría que acordarse de filtrar.
 *   2. **La cuota.** El plan es *hobby*: 2.500 eventos al mes. Navegar los
 *      previews de un sprint se come una parte apreciable de lo único con lo que
 *      hay que medir el lanzamiento. Esa es la razón de verdad.
 *
 * LA CONTRAPARTIDA, dicha porque contradice lo que se decidió para el contador:
 * allí se eligió SEPARAR en vez de apagar, precisamente para poder verificar
 * antes de mergear. Aquí se apaga, así que la verificación de esto ocurre
 * DESPUÉS del merge, contra producción. Se acepta por la cuota.
 *
 * LO QUE **NO** COMPARTE CON GTM ES EL OTRO GATE, y es toda la decisión de D170:
 * esto carga **sin consentimiento**. Es la excepción a la postura del sitio, está
 * argumentada en su D-entry y declarada en `/cookies`. Si algún día se revierte,
 * lo que cambia es dónde se monta en el layout, no esta constante.
 */
export const WEB_ANALYTICS = process.env.VERCEL_ENV === "production";
