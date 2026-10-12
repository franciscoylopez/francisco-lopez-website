/**
 * Lo que las capturas del README AFIRMAN, y de dónde sale cada afirmación.
 *
 * EL PROBLEMA (M5 de `method-review`, 2026-08-19). El CV y el SVG del artefacto
 * tienen su `.huella` y su guardián; las tres capturas de `.github/assets/` no
 * tenían nada, y desde el 2026-08-19 el repositorio es PÚBLICO (D68): esa portada
 * es lo primero que ve quien llega. Familia «el artefacto commiteado que se queda
 * viejo», instancia 3.
 *
 * POR QUÉ NO SE SELLA EL RENDER, que era la vía que la ficha proponía. Una
 * captura no es determinista —dos capturas del mismo sitio no dan el mismo hash,
 * igual que el PDF del CV (D60)—, así que había que sellar las ENTRADAS. Pero la
 * entrada obvia, «el HTML servido de esa ruta», está MEDIDA y no sirve: la home
 * cambia de HTML en casi cada tanda, y la captura solo se queda vieja cuando
 * cambia lo que se VE en ella. Un sello sobre el HTML saldría rojo cada semana
 * pidiendo rehacer una imagen que sigue siendo correcta, y *un gate ruidoso es
 * peor que ninguno* (D59).
 *
 * LO QUE SE SELLA EN SU LUGAR: cada frase que la imagen enseña, transcrita aquí
 * al lado de la fuente VIVA de la que sale. Es la misma idea que el bloque
 * declarado de `/accesibilidad` (D84) llevada a un artefacto binario: no se
 * vigila el píxel, se vigila la afirmación. Consecuencia útil: cuando sale rojo,
 * no dice «algo cambió», dice qué frase de qué captura ha dejado de ser cierta.
 *
 * LO QUE ESTO DEJA FUERA, y va escrito porque un gate que no declara su alcance
 * miente por omisión: un cambio **puramente visual** —una tipografía, un color,
 * el orden de dos bloques— no mueve ninguna frase y esta comprobación no lo ve.
 * Ahí no hay entrada barata que sellar (`app/globals.css` se movió 11 veces en
 * quince días), así que se queda como límite conocido y no como promesa. Su red
 * es `design-review`, que mira en pantalla.
 */
import esHome from "../../app/[lang]/dictionaries/es/home.json";
import esCommon from "../../app/[lang]/dictionaries/es/common.json";
import pkg from "../../package.json";

/** El major de un rango de `package.json` (`^4`, `16.3.4`, `~6.0.3` → `4`, `16`, `6`). */
export const major = (rango: string): string => /(\d+)/.exec(rango)?.[1] ?? "?";

/**
 * Una frase que la imagen enseña. `dice` es la transcripción —lo que se lee en
 * el PNG— y `fuente` la deriva del sitio vivo. Cuando dejan de coincidir, la
 * captura está mintiendo y hay que rehacerla.
 */
export type Afirmacion = {
  /** Qué parte de la imagen es, para que el rojo sepa dónde mirar. */
  donde: string;
  /** Transcrito del PNG. */
  dice: string;
  /** Lo mismo, derivado de la fuente viva. */
  fuente: () => string;
};

export type Captura = {
  archivo: string;
  /** Qué enseña, en una línea, para que el informe se lea sin abrir la imagen. */
  que: string;
  afirmaciones: readonly Afirmacion[];
};

/** El titular del Hero, sin el punto final: en el banner no lo lleva y en la home
 *  sí, y ese punto es la firma de marca de D137, no parte de la frase. */
const titularSinPunto = () => esHome.hero.headline.replace(/\.$/, "");

export const CAPTURAS: readonly Captura[] = [
  {
    archivo: ".github/assets/banner.png",
    que: "el lockup de marca sobre fondo oscuro, con el titular y el stack",
    afirmaciones: [
      {
        donde: "titular",
        dice: "Del discovery al dato",
        fuente: titularSinPunto,
      },
      {
        donde: "dominio",
        dice: "franciscolopez.es",
        // No se importa `SITE_URL` para no arrastrar el módulo entero a un
        // script: lo que la imagen enseña es el host, y ahí está escrito.
        fuente: () => "franciscolopez.es",
      },
      {
        donde: "stack · Next.js",
        dice: "Next.js 16",
        fuente: () => `Next.js ${major(pkg.dependencies.next)}`,
      },
      {
        donde: "stack · Tailwind",
        dice: "Tailwind v4",
        fuente: () => `Tailwind v${major(pkg.devDependencies.tailwindcss)}`,
      },
    ],
  },
  ...(["home-light.png", "home-dark.png"] as const).map((nombre) => ({
    archivo: `.github/assets/${nombre}`,
    que: `el pliegue de la home en tema ${nombre.includes("light") ? "claro" : "oscuro"}`,
    // LAS DOS COMPARTEN AFIRMACIONES porque enseñan el mismo pliegue en los dos
    // temas: escribirlas dos veces sería el drift esperando a ocurrir.
    //
    // Y TODA TRANSCRIPCIÓN VA LITERAL, nunca leída de la misma fuente que se
    // compara: `dice: esHome.hero.kicker` habría compilado, habría pasado
    // siempre y no habría comprobado nada. Es el metro que devuelve lista vacía
    // y parece un aprobado, escrito en una sola línea.
    //
    // El kicker se transcribe con la caja del DICCIONARIO y no con la que se ve
    // en el PNG: las versalitas las pone el CSS, así que la mayúscula no es la
    // frase.
    afirmaciones: [
      {
        donde: "kicker",
        dice: "Senior Product Manager · UX · SaaS · IA · Builder",
        fuente: () => esHome.hero.kicker,
      },
      {
        donde: "titular",
        dice: "Del discovery al dato.",
        fuente: () => esHome.hero.headline,
      },
      {
        donde: "subtitular",
        dice: "Investigo, prototipo, construyo y mido.",
        fuente: () => esHome.hero.subheadline,
      },
      {
        donde: "nav · CV",
        dice: "Descargar CV",
        fuente: () => esCommon.nav.downloadCv,
      },
      {
        donde: "nav · contacto",
        dice: "Contacto",
        fuente: () => esCommon.nav.contacto,
      },
      {
        donde: "nav · sobre mí",
        dice: "Sobre mí",
        fuente: () => esCommon.nav.sobreMi,
      },
      {
        donde: "nav · idioma",
        dice: "EN",
        fuente: () => esCommon.nav.switchLanguageShort,
      },
    ],
  })),
];
