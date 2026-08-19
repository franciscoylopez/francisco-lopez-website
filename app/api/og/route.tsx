import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { getExperience, getTrayectoriaIndice } from "@/app/[lang]/dictionaries";
import { eyebrowOf } from "@/content/experience-copy";
import { brandHex, paletteHex } from "@/lib/design-values";

// Generación de imágenes OG (1200×630) con la marca (P16). Route handler bajo
// /api/og: el proxy excluye /api (D3), así que se sirve directo sin rewrite de
// locale ni conflicto con el file-convention de Next. PNG determinista con las
// fuentes reales (Satori) y el logo split. Se referencia desde la metadata de
// cada página como /api/og?card=<home|brand-kit|design-system>&lang=<es|en>.

const FONT_DIR = join(process.cwd(), "assets/fonts");
const bricolage600 = readFileSync(join(FONT_DIR, "bricolage-600.woff"));
const inter600 = readFileSync(join(FONT_DIR, "inter-600.woff"));
const inter400 = readFileSync(join(FONT_DIR, "inter-400.woff"));

// Foto del hero para la tarjeta compuesta de la home (JPEG → data URI).
//
// EL ARCHIVO MIDE 600×630, QUE ES LA CAJA DONDE CAE (abajo, la mitad izquierda
// de la tarjeta con `objectFit: cover`). Hasta el 2026-08-19 se guardaba a
// 1200×630 y el optimizador recortaba a los 600 centrales: la mitad del archivo
// no se servía nunca y el nombre anunciaba un tamaño que no era el que se usaba.
const photoDataUri = `data:image/jpeg;base64,${readFileSync(
  join(process.cwd(), "public/og/og-home-600x630.jpg"),
).toString("base64")}`;

// Colores: tokens del tema oscuro (la OG lleva fondo de marca fijo), derivados de
// la paleta única. Satori no lee CSS vars ni resuelve `oklch`, así que necesita el
// hex — pero lo calcula `paletteHex()`, no una mano (P37.6605). De las ocho
// constantes que había aquí, DOS habían divergido del token sin que nada lo
// notara: el atenuado era `#9CA3AC`, de una generación anterior de la paleta, que
// además daba 6,66:1 sobre el fondo de marca en vez de los 7,12:1 del token; y el
// borde de la tarjeta compuesta, `#2C333B` en vez de `#2E353C`.
const DARK = paletteHex("dark");
const BRAND = brandHex();

const BG = DARK.background;
const INK = DARK.foreground;
const MUTED = DARK["muted-foreground"];
const BORDER = DARK.border;
const CYAN_SPLIT = BRAND["brand-cyan-split"];
const PURPLE_SPLIT = BRAND["brand-purple-split"];
const CYAN_SOFT = BRAND["brand-cyan-soft"];
const PURPLE_SOFT = BRAND["brand-purple-soft"];

// Logo split como SVG (tinta clara sobre fondo oscuro) → data URI para <img>,
// que resvg rasteriza sin las limitaciones SVG de Satori.
function splitLogoDataUri() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="28 15 64 72" fill="none"><circle cx="57" cy="44" r="26" stroke="${CYAN_SPLIT}" stroke-width="6"/><circle cx="63" cy="48" r="26" stroke="${PURPLE_SPLIT}" stroke-width="6"/><circle cx="60" cy="46" r="26" stroke="${INK}" stroke-width="6"/><rect x="42" y="82" width="36" height="5" rx="2.5" fill="${INK}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

type Lang = "es" | "en";
type Card =
  | "home"
  | "brand-kit"
  | "design-system"
  | "cookies"
  | "sobre-mi"
  | "accesibilidad";

const COPY: Record<Card, Record<Lang, { title: string; kicker: string }>> = {
  home: {
    es: {
      title: "Del discovery al dato.",
      kicker: "Senior Product Manager · UX · SaaS · IA aplicada",
    },
    en: {
      title: "From discovery to data.",
      kicker: "Senior Product Manager · UX · SaaS · Applied AI",
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
    es: { title: "Política de cookies", kicker: "Legal" },
    en: { title: "Cookie policy", kicker: "Legal" },
  },
  "sobre-mi": {
    es: { title: "Sobre mí", kicker: "Quién hay detrás" },
    en: { title: "About me", kicker: "The person behind" },
  },
  accesibilidad: {
    es: { title: "Accesibilidad", kicker: "Compromiso" },
    en: { title: "Accessibility", kicker: "Commitment" },
  },
};

const WORDMARK = "Francisco López";
const LOGO = splitLogoDataUri();

const fonts = [
  { name: "Bricolage", data: bricolage600, weight: 600 as const },
  { name: "Inter", data: inter600, weight: 600 as const },
  { name: "Inter", data: inter400, weight: 400 as const },
];

function LogoWordmark({
  logoH,
  wordSize,
}: {
  logoH: number;
  wordSize: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO}
        width={Math.round((logoH * 64) / 72)}
        height={logoH}
        alt=""
      />
      <span
        style={{
          fontFamily: "Bricolage",
          fontWeight: 600,
          fontSize: wordSize,
          color: INK,
          letterSpacing: -0.5,
        }}
      >
        {WORDMARK}
      </span>
    </div>
  );
}

function HomeCard({ lang }: { lang: Lang }) {
  const { title, kicker } = COPY.home[lang];
  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      {/* Panel foto (izquierda): cover encuadra la figura centrada del original. */}
      <div
        style={{ display: "flex", width: 600, height: 630, overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoDataUri}
          width={600}
          height={630}
          alt=""
          style={{ objectFit: "cover" }}
        />
      </div>
      {/* Panel de texto (derecha): fondo sólido, alto contraste. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 600,
          height: 630,
          background: BG,
          borderLeft: `1px solid ${BORDER}`,
          padding: "0 72px",
          gap: 26,
        }}
      >
        <LogoWordmark logoH={44} wordSize={30} />
        <span
          style={{
            fontFamily: "Bricolage",
            fontWeight: 600,
            fontSize: 64,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: INK,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 21,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {kicker}
        </span>
      </div>
    </div>
  );
}

// Recibe el copy YA RESUELTO en vez de buscarlo en `COPY` (P50). El cambio lo
// pide el deep-dive: sus cinco tarjetas no salen de una tabla fija de este
// archivo, sino del diccionario de cada experiencia — el mismo `eyebrow` y el
// mismo `title` que pinta la página. Escribirlos aquí habría sido la copia
// número seis de un dato que este sitio acaba de reducir a una (D57/D58).
function BrandCard({
  title,
  kicker,
  titleSize = 104,
}: {
  title: string;
  kicker: string;
  /**
   * Los titulares del sistema son de una o dos palabras («Brand Kit»,
   * «Accesibilidad») y a 104px llenan la tarjeta. Los del deep-dive son frases
   * —«De vender a mano a un SaaS con canal propio»— y a ese tamaño se salen del
   * lienzo por abajo, porque encima llevan el logo de 150px. Es un valor por
   * FAMILIA de tarjeta, no por longitud del texto: escalarlo carácter a carácter
   * daría un tamaño distinto en cada una de las cinco y se leerían como cinco
   * plantillas.
   */
  titleSize?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: BG,
        padding: "0 90px",
        position: "relative",
      }}
    >
      {/* Flancos pastel (eco de la anatomía del logo), decorativos, a la derecha. */}
      <div
        style={{
          position: "absolute",
          right: -70,
          top: 165,
          display: "flex",
          gap: 26,
        }}
      >
        <div
          style={{
            width: 150,
            height: 300,
            borderRadius: 26,
            background: CYAN_SOFT,
            transform: "rotate(-8deg)",
          }}
        />
        <div
          style={{
            width: 150,
            height: 300,
            borderRadius: 26,
            background: PURPLE_SOFT,
            transform: "rotate(8deg)",
          }}
        />
      </div>

      {/* LA COLUMNA NO LLEGA AL BORDE, y esto NO lo trajo el deep-dive: la «s» de
          «Política de cookies» ya montaba sobre el flanco cian en la tarjeta que
          está en producción (visto al renderizar, 2026-08-18). Con rótulos de una
          palabra el problema no existía, y con frases es constante — así que el
          tope va en la COLUMNA y vale para las once tarjetas, no es un parche del
          caso nuevo.

          800 y no «lo que sobre»: los dos flancos miden 150+26+150 y van pegados
          a la derecha desbordando 70px, o sea que su borde izquierdo cae en 944,
          y la rotación de 8° saca las esquinas otros ~21px hasta ~923. La columna
          arranca en los 90px del padding, así que 800 la deja acabar en 890 —
          33px de aire contra el pastel. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
          maxWidth: 800,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO}
          width={Math.round((150 * 64) / 72)}
          height={150}
          alt=""
        />
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          {kicker}
        </span>
        <span
          style={{
            fontFamily: "Bricolage",
            fontWeight: 600,
            fontSize: titleSize,
            lineHeight: 1.0,
            letterSpacing: -3,
            color: INK,
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: "Bricolage",
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: -0.5,
            color: MUTED,
          }}
        >
          {WORDMARK}
        </span>
      </div>
    </div>
  );
}

/** Las tarjetas del deep-dive: el índice y `trayectoria/<slug>`. */
const DEEP_DIVE = "trayectoria";

/**
 * El copy de la tarjeta de una página del deep-dive, leído de SU diccionario
 * (P50). Devuelve `null` si el slug no tiene página, y entonces la petición cae
 * en la tarjeta de la home como cualquier card desconocida.
 *
 * POR QUÉ AQUÍ Y NO EN LA TABLA `COPY`: son seis tarjetas cuyo texto ya existe
 * —el `eyebrow` y el `title` que la página pinta— y escribirlo otra vez habría
 * creado una copia que puede divergir sin que nada lo note, que es el modo de
 * fallo que D57/D58 acaban de retirar tres veces de este repo. Aquí duele más
 * que en otros sitios: una tarjeta OG solo la ve quien comparte el enlace, así
 * que un titular desincronizado puede vivir meses sin que nadie lo vea.
 */
async function deepDiveCopy(
  lang: Lang,
  cardParam: string,
): Promise<{ title: string; kicker: string } | null> {
  if (cardParam === DEEP_DIVE) {
    const t = await getTrayectoriaIndice(lang);
    return { title: t.title, kicker: t.eyebrow };
  }
  const prefijo = `${DEEP_DIVE}/`;
  if (!cardParam.startsWith(prefijo)) return null;

  const slug = cardParam.slice(prefijo.length);
  // El `?card=` es un parámetro de URL, o sea que puede traer cualquier cosa: se
  // comprueba contra el registro de diccionarios ANTES de componer nada, porque
  // `eyebrowOf` LANZA con un slug desconocido. Aquí un slug inventado no es un
  // error de programación —es alguien tecleando— y su respuesta es la tarjeta de
  // la home, como cualquier card que no existe.
  const dict = getExperience(lang, slug);
  if (!dict) return null;
  const t = await dict;
  // El rótulo se COMPONE desde el registro, igual que en la página: si saliera del
  // diccionario, la tarjeta y la página podrían decir algo distinto del índice —
  // que es exactamente lo que pasaba con KUOTIP (P50.36b).
  return { title: t.title, kicker: eyebrowOf(lang, slug) };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cardParam = searchParams.get("card") ?? "";
  const lang: Lang = searchParams.get("lang") === "en" ? "en" : "es";

  const deepDive = await deepDiveCopy(lang, cardParam);
  if (deepDive) {
    // 68px y no los 104 del resto: estos titulares son frases de hasta ocho
    // palabras, no rótulos de una o dos. Ver `titleSize`.
    return new ImageResponse(<BrandCard {...deepDive} titleSize={68} />, {
      width: 1200,
      height: 630,
      fonts,
    });
  }

  const card: Card =
    cardParam === "brand-kit" ||
    cardParam === "design-system" ||
    cardParam === "cookies" ||
    cardParam === "sobre-mi" ||
    cardParam === "accesibilidad"
      ? cardParam
      : "home";

  return new ImageResponse(
    card === "home" ? (
      <HomeCard lang={lang} />
    ) : (
      <BrandCard {...COPY[card][lang]} />
    ),
    { width: 1200, height: 630, fonts },
  );
}
