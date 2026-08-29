/**
 * El texto de las ocho tarjetas OG, y de dónde tiene que salir igual.
 *
 * POR QUÉ EXISTE, y por qué esto es DATO y no vive en la ruta. Las dieciséis
 * cadenas de aquí (8 tarjetas × 2 idiomas) repiten copy que ya está en los
 * diccionarios, y **nada las comparaba**. Los dos guardianes que tocan esa ruta
 * miran otra cosa: `check:marco` (D75) comprueba que el `?card=` de cada variante
 * resuelve a SU tarjeta, y `check:rutas` (D72) que la unión `OgCard` cuadra con el
 * registro de páginas. Ninguno mira el texto de dentro.
 *
 * NO ES HIPOTÉTICO. Al afilar el kicker del Hero (P83), cambiar una cadena
 * resultaron ser **tres sitios**: `es/home.json`, `en/home.json` y este literal. El
 * tercero no lo señaló ningún check — apareció por un `grep` hecho a mano antes de
 * tocar nada. Sin ese `grep`, la página diría una cosa y su tarjeta de LinkedIn
 * otra, que es el sitio donde más se ve y el único que no se miraba nunca.
 *
 * Y ES LA FAMILIA QUE ESTE REPO YA CERRÓ DOS VECES: D60 (una fuente única no
 * mantiene al día una copia impresa) y D72 (qué páginas hay estaba escrito a mano
 * en cuatro sitios). Esta era la última instancia abierta.
 *
 * POR QUÉ SE DECLARA Y NO SE DERIVA, con el motivo CORREGIDO. La tarea decía que
 * tres tarjetas —`cookies`, `contacto` y `sobre-mi`— no tenían de dónde leer. Es
 * falso: tienen `title` y `kicker`, sueltos en la raíz en vez de bajo `hero`, y
 * **las dieciséis parejas son comparables**. El motivo bueno es otro: derivarlo
 * obligaría a la ruta OG a importar los ocho diccionarios de página × dos idiomas
 * para sacar dos cadenas de cada uno, y esa ruta se sirve en frío.
 *
 * Así que se declara aquí, lo compara `npm run check:og` en cada PR, y **la
 * divergencia deliberada se escribe con su motivo** — lo que hizo
 * `check:excepciones` con los controles fuera de la capa (D109). Sin eso, nada
 * distingue «distinto a propósito» de «se quedó viejo».
 *
 * POR QUÉ AQUÍ Y NO EN `app/api/og/route.tsx`: para que el guardián pueda leerlo
 * sin importar `next/og`. Misma partición que `scripts/tablero/reglas.ts` y
 * `scripts/guardianes/casos.ts` — el dato aparte de quien lo ejecuta.
 */
import type { OgCard } from "@/lib/routes";

type Lang = "es" | "en";

export type TextoTarjeta = { title: string; kicker: string };

/**
 * QUÉ CLAVE del diccionario tiene que decir lo mismo que cada campo de la tarjeta.
 *
 * Se declara la ruta EXACTA, y no se adivina. Hay tres formas vivas —`hero.title`,
 * `hero.headline` y la clave suelta en la raíz— y buscar en las tres con un `??`
 * encadenado **daría verde sobre una clave que ya no existe**, que es justo el modo
 * de fallo que este guardián viene a cerrar. Si el copy se reestructura, esto sale
 * rojo diciendo qué ruta ya no resuelve, en vez de callarse.
 */
export const CLAVE_EN_DICCIONARIO: Record<
  OgCard,
  Record<keyof TextoTarjeta, readonly string[]>
> = {
  home: { title: ["hero", "headline"], kicker: ["hero", "kicker"] },
  "brand-kit": { title: ["hero", "title"], kicker: ["hero", "kicker"] },
  "design-system": { title: ["hero", "title"], kicker: ["hero", "kicker"] },
  accesibilidad: { title: ["hero", "title"], kicker: ["hero", "kicker"] },
  "como-se-ha-creado": { title: ["hero", "title"], kicker: ["hero", "kicker"] },
  cookies: { title: ["title"], kicker: ["kicker"] },
  contacto: { title: ["title"], kicker: ["kicker"] },
  "sobre-mi": { title: ["title"], kicker: ["kicker"] },
};

/**
 * Las divergencias DELIBERADAS, con su motivo. Una entrada aquí exime a ese campo
 * de cuadrar con el diccionario — y **le exige lo contrario**: si vuelve a
 * coincidir, `check:og` también sale rojo, porque una excepción que ya no muerde
 * es una nota caducada haciéndose pasar por regla (la lección de los casos malos
 * de `check:guardianes`).
 */
export const DIVERGENCIAS: {
  card: OgCard;
  lang: Lang;
  campo: keyof TextoTarjeta;
  motivo: string;
}[] = [
  {
    card: "como-se-ha-creado",
    lang: "es",
    campo: "kicker",
    motivo:
      "el kicker de la página («El «Making of» de franciscolopez.es») no cabe en el ancho de 1200px de la tarjeta",
  },
  {
    card: "como-se-ha-creado",
    lang: "en",
    campo: "kicker",
    motivo: "mismo motivo que el ES: no cabe en la tarjeta",
  },
];

export const COPY: Record<OgCard, Record<Lang, TextoTarjeta>> = {
  home: {
    es: {
      title: "Del discovery al dato.",
      kicker: "Senior Product Manager · UX · SaaS · IA · Builder",
    },
    en: {
      title: "From discovery to data.",
      kicker: "Senior Product Manager · UX · SaaS · AI · Builder",
    },
  },
  "brand-kit": {
    es: { title: "Brand Kit", kicker: "Identidad de marca" },
    en: { title: "Brand Kit", kicker: "Brand identity" },
  },
  "design-system": {
    es: { title: "Design System", kicker: "Fundamentos de diseño" },
    en: { title: "Design System", kicker: "Design foundations" },
  },
  cookies: {
    es: { title: "Privacidad y cookies", kicker: "Legal" },
    en: { title: "Privacy and cookies", kicker: "Legal" },
  },
  contacto: {
    es: { title: "Hablemos", kicker: "Aquí estoy" },
    en: { title: "Let's talk", kicker: "I'm here" },
  },
  "sobre-mi": {
    es: { title: "Sobre mí", kicker: "Quién hay detrás" },
    en: { title: "About me", kicker: "The person behind" },
  },
  accesibilidad: {
    es: { title: "Accesibilidad", kicker: "Compromiso" },
    en: { title: "Accessibility", kicker: "Commitment" },
  },
  "como-se-ha-creado": {
    es: { title: "Cómo se ha creado esta página", kicker: "Making-of" },
    en: { title: "How this page was built", kicker: "Making-of" },
  },
};
