import type { Dictionary } from "@/app/[lang]/dictionaries";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";

type SobreMiDict = Dictionary["sobreMi"];

const WRAP = "mx-auto max-w-[var(--container)] px-[var(--page-x)]";
// Prosa a la medida de lectura del sistema (Design System §20), alineada a la
// izquierda. La usan el opening (intro) y el closing (Dónde estoy ahora): poco
// texto, media columna. "Cómo llegué a Producto" NO la usa —ocupa el ancho
// completo del contenedor, como los bloques con foto pero sin la mitad de imagen.
const PROSE = "max-w-[var(--measure)]";

// Página "Sobre mí" (PRD §9, V2). La persona detrás del PM. Tratamiento editorial:
// apertura full-width con la cita-firma SOBRE la foto (scrim para contraste) →
// titular → prosa centrada → dos aficiones en zigzag con foto 4:5 enmarcada por un
// recurso de marca (panel pastel desplazado) → cierre con CTA a Contacto.
//
// IMÁGENES (diseño→dev): hoy van como placeholders con el ratio correcto. La
// selección y el recorte de las fotos reales (varias versiones por escena) se
// resuelven en la fase de assets; cada hueco marca dónde entra el <Image> y su
// `photoAlt` ya vive en el diccionario. No va en RelatedPages: "Sobre mí" no es
// página del sistema de diseño; se enlaza desde el nav (P36).
export function SobreMi({
  dict,
  breadcrumb,
  homeHref,
}: {
  dict: SobreMiDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
}) {
  const t = dict;
  return (
    <main id="top">
      <div className="py-[clamp(1.5rem,3vw,1.75rem)]">
        <div className={WRAP}>
          <div data-reveal className="mb-[clamp(2rem,4vw,3rem)]">
            <Breadcrumb
              routeLabel={breadcrumb.routeLabel}
              items={[
                { label: breadcrumb.home, href: homeHref },
                { label: t.crumb },
              ]}
            />
          </div>

          {/* Apertura: cita-firma sobre la foto. El scrim garantiza contraste del
              texto sobre cualquier foto; en móvil se oculta la 2ª frase. El <Image>
              real (Francisco-Lopez-Sobre-Mi, versión TBD) sustituye al placeholder. */}
          <figure
            data-reveal
            className="relative m-0 overflow-hidden rounded-[var(--radius-lg)]"
          >
            <ImagePlaceholder
              alt={t.photoAlt}
              className="h-[clamp(15rem,42vw,32rem)] w-full"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-[clamp(1.5rem,4vw,3rem)]">
              <p className="font-display m-0 max-w-[24ch] text-[clamp(1.5rem,3.4vw,2.4rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-balance text-white">
                {t.quote}
              </p>
              <p className="m-0 mt-2 hidden max-w-[40ch] text-[clamp(1rem,1.7vw,1.2rem)] leading-[1.5] text-white/85 sm:block">
                {t.quoteSub}
              </p>
            </figcaption>
          </figure>

          {/* Titular. */}
          <header
            data-reveal
            className={`${PROSE} mt-[clamp(2.5rem,5vw,3.5rem)]`}
          >
            <p className="text-muted-foreground m-0 mb-4 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase">
              {t.kicker}
            </p>
            <h1 className="font-display m-0 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.025em]">
              {t.title}
            </h1>
          </header>

          {/* Intro. */}
          <div
            data-reveal
            className={`${PROSE} mt-[clamp(1.75rem,3.5vw,2.5rem)] flex flex-col gap-5`}
          >
            {t.intro.map((p, i) => (
              <p
                key={i}
                className="m-0 text-[clamp(1.0625rem,1.6vw,1.2rem)] leading-[1.7]"
              >
                <Rich text={p} />
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Cómo llegué a Producto — sin imagen, texto a ancho completo del
          contenedor (mismo footprint que los bloques con foto, sin la mitad
          vacía). Alineado a la izquierda. */}
      <section className="py-[clamp(3rem,6vw,5rem)]">
        <div className={WRAP}>
          <div data-reveal>
            <Heading>{t.product.heading}</Heading>
            <Body paragraphs={t.product.body} />
          </div>
        </div>
      </section>

      {/* Repostería — texto + foto 4:5 a la derecha, panel de marca cian. */}
      <HobbyBlock
        imageSide="right"
        accent="cyan"
        heading={t.baking.heading}
        photoAlt={t.baking.photoAlt}
      >
        <Body paragraphs={t.baking.body} />
        <p className="border-border text-foreground/85 my-6 border-l-2 pl-5 text-[1.0625rem] leading-[1.7] italic">
          {t.baking.aside}
        </p>
        <Body paragraphs={t.baking.bodyAfter} />
      </HobbyBlock>

      {/* Montaña — foto 4:5 a la izquierda (zigzag), panel de marca morado. */}
      <HobbyBlock
        imageSide="left"
        accent="purple"
        heading={t.mountain.heading}
        photoAlt={t.mountain.photoAlt}
      >
        <Body paragraphs={t.mountain.body} />
      </HobbyBlock>

      {/* Cierre + CTA a Contacto (enlace de contenido → primary). */}
      <section className="py-[clamp(3rem,6vw,5rem)] pb-[var(--section-y)]">
        <div className={WRAP}>
          <div data-reveal className={PROSE}>
            <Heading>{t.now.heading}</Heading>
            <Body paragraphs={t.now.body} />
            <p className="mt-6 text-[clamp(1.125rem,1.8vw,1.35rem)] leading-[1.5]">
              {t.now.ctaPre}
              <a
                href={`${homeHref}#contacto`}
                className="text-primary font-semibold underline underline-offset-4 hover:no-underline"
              >
                {t.now.ctaLink}
              </a>
              {t.now.ctaPost}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display m-0 mb-4 text-[clamp(1.5rem,2.6vw,1.9rem)] leading-[1.15] font-semibold tracking-[-0.02em]">
      {children}
    </h2>
  );
}

function Body({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="text-foreground/90 flex flex-col gap-5">
      {paragraphs.map((p, i) => (
        <p key={i} className="m-0 text-[1.0625rem] leading-[1.75]">
          <Rich text={p} />
        </p>
      ))}
    </div>
  );
}

// Mini-render de markup inline para el copy del diccionario: **negrita**, *cursiva*
// y [texto](url). Plano (sin anidamiento), suficiente para el énfasis editorial de
// esta página, y mantiene el copy como strings en el diccionario (fuente de verdad).
const RICH_TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;

function Rich({ text }: { text: string }) {
  const parts = text.split(RICH_TOKEN).filter((p) => p !== "");
  return (
    <>
      {parts.map((part, i) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          const label = link[1] ?? "";
          const href = link[2] ?? "";
          const external = /^https?:\/\//.test(href);
          return (
            <a
              key={i}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-primary underline underline-offset-4 hover:no-underline"
            >
              {label}
            </a>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-foreground font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// Bloque de afición: prosa + foto 4:5, alternando lado en desktop (zigzag). En
// móvil la imagen va arriba y el texto debajo. La foto se enmarca con un panel de
// marca desplazado detrás (decorativo: pastel cian/morado según BRAND, sin tocar
// el color de acción); en móvil el panel se retira para no robar aire.
function HobbyBlock({
  imageSide,
  accent,
  heading,
  photoAlt,
  children,
}: {
  imageSide: "left" | "right";
  accent: "cyan" | "purple";
  heading: string;
  photoAlt: string;
  children: React.ReactNode;
}) {
  const textOrder = imageSide === "right" ? "md:order-1" : "md:order-2";
  const imageOrder = imageSide === "right" ? "md:order-2" : "md:order-1";
  const accentColor =
    accent === "cyan" ? "bg-brand-cyan-soft" : "bg-brand-purple-soft";
  // El panel asoma hacia el exterior del zigzag (repostería→derecha, montaña→izq).
  const accentOffset =
    imageSide === "right"
      ? "md:translate-x-3 md:translate-y-3"
      : "md:-translate-x-3 md:translate-y-3";
  return (
    <section className="py-[clamp(3rem,6vw,5rem)]">
      <div className={WRAP}>
        <div className="grid items-center gap-[clamp(2rem,5vw,4rem)] md:grid-cols-2">
          <div data-reveal className={`order-2 ${textOrder}`}>
            <Heading>{heading}</Heading>
            {children}
          </div>
          <div data-reveal className={`order-1 ${imageOrder}`}>
            <div className="relative mx-auto w-full max-w-[24rem]">
              <div
                aria-hidden
                className={`absolute inset-0 rounded-[var(--radius-lg)] ${accentColor} ${accentOffset}`}
              />
              <ImagePlaceholder
                alt={photoAlt}
                className="border-border relative aspect-[4/5] w-full rounded-[var(--radius-lg)] border"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Hueco de imagen mientras no hay foto elegida. Caja neutra al ratio correcto con
// un glifo decorativo; cuando llegue el asset se sustituye por <Image fill> y este
// componente desaparece. `alt` viaja para no perder la alternativa textual.
function ImagePlaceholder({
  alt,
  className = "",
  ...rest
}: {
  alt: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`bg-muted text-muted-foreground/40 flex items-center justify-center overflow-hidden ${className}`}
      {...rest}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.5-3.5a2 2 0 0 0-2.8 0L5 21" />
      </svg>
    </div>
  );
}
