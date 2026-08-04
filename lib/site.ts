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
