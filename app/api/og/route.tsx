import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

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
const photoDataUri = `data:image/jpeg;base64,${readFileSync(
  join(process.cwd(), "public/og/og-home-1200x630.jpg"),
).toString("base64")}`;

// Colores (tokens del tema oscuro, la OG lleva fondo de marca fijo).
const BG = "#191D21";
const INK = "#F7F3EC";
const MUTED = "#9CA3AC";
const CYAN_SPLIT = "#16BDBD";
const PURPLE_SPLIT = "#9B87F5";
const CYAN_SOFT = "#A7E1DE";
const PURPLE_SOFT = "#C6B9F0";

// Logo split como SVG (tinta clara sobre fondo oscuro) → data URI para <img>,
// que resvg rasteriza sin las limitaciones SVG de Satori.
function splitLogoDataUri() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="28 15 64 72" fill="none"><circle cx="57" cy="44" r="26" stroke="${CYAN_SPLIT}" stroke-width="6"/><circle cx="63" cy="48" r="26" stroke="${PURPLE_SPLIT}" stroke-width="6"/><circle cx="60" cy="46" r="26" stroke="${INK}" stroke-width="6"/><rect x="42" y="82" width="36" height="5" rx="2.5" fill="${INK}"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

type Lang = "es" | "en";
type Card = "home" | "brand-kit" | "design-system" | "cookies" | "sobre-mi";

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
          borderLeft: "1px solid #2C333B",
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

function BrandCard({ lang, card }: { lang: Lang; card: Card }) {
  const { title, kicker } = COPY[card][lang];
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

      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
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
            fontSize: 104,
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

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cardParam = searchParams.get("card");
  const card: Card =
    cardParam === "brand-kit" ||
    cardParam === "design-system" ||
    cardParam === "cookies" ||
    cardParam === "sobre-mi"
      ? cardParam
      : "home";
  const lang: Lang = searchParams.get("lang") === "en" ? "en" : "es";

  return new ImageResponse(
    card === "home" ? (
      <HomeCard lang={lang} />
    ) : (
      <BrandCard lang={lang} card={card} />
    ),
    { width: 1200, height: 630, fonts },
  );
}
