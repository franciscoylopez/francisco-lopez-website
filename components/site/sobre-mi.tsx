import Image from "next/image";

import type { Dictionary } from "@/app/[lang]/dictionaries";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { ContactActions, type ContactActionsDict } from "./contact-actions";
import { Rich } from "./rich";

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
// IMÁGENES: fotos reales en public/img (WebP), servidas con next/image (fill +
// object-cover), mismo patrón que el Hero. Apertura landscape (retrato editorial,
// sujeto a la derecha → object-position lo mantiene); repostería y montaña
// recortadas a 4:5. El `photoAlt` de cada una vive en el diccionario. No va en
// RelatedPages: "Sobre mí" no es página del sistema de diseño; se enlaza desde el nav.
export function SobreMi({
  dict,
  contacto,
  breadcrumb,
  homeHref,
  cvHref,
}: {
  dict: SobreMiDict;
  contacto: ContactActionsDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  cvHref: string;
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
              texto sobre la foto; en móvil se oculta la 2ª frase. object-position
              mantiene la cara (arriba) y al sujeto (a la derecha) al recortar. */}
          <figure
            data-reveal
            className="relative m-0 h-[clamp(15rem,42vw,32rem)] overflow-hidden rounded-[var(--radius-lg)]"
          >
            <Image
              src="/img/francisco-sobre-mi-apertura.webp"
              alt={t.photoAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[62%_28%]"
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
        photoSrc="/img/francisco-reposteria-4x5.webp"
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
        photoSrc="/img/francisco-montana-4x5.webp"
      >
        <Body paragraphs={t.mountain.body} />
      </HobbyBlock>

      {/* Cierre + superficie de contacto. Antes la frase enlazaba a `/#contacto`:
          mandaba de vuelta a la home a buscar la sección. Ahora la acción está
          AQUÍ, con el mismo patrón compartido que la franja de la home y que
          Accesibilidad; la frase se queda como remate, ya sin enlace. */}
      <section className="py-[clamp(3rem,6vw,5rem)] pb-[var(--section-y)]">
        <div className={WRAP}>
          <div data-reveal className={PROSE}>
            <Heading>{t.now.heading}</Heading>
            <Body paragraphs={t.now.body} />
            <p className="mt-6 text-[clamp(1.125rem,1.8vw,1.35rem)] leading-[1.5]">
              {t.now.ctaPre}
              <span className="font-semibold">{t.now.ctaLink}</span>
              {t.now.ctaPost}
            </p>
          </div>
          <div data-reveal className="mt-[clamp(2rem,4vw,2.75rem)]">
            <ContactActions dict={contacto} cvHref={cvHref} />
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

// Bloque de afición: prosa + foto 4:5, alternando lado en desktop (zigzag). En
// móvil la imagen va arriba y el texto debajo. La foto se enmarca con un panel de
// marca desplazado detrás (decorativo: pastel cian/morado según BRAND, sin tocar
// el color de acción); en móvil el panel se retira para no robar aire.
function HobbyBlock({
  imageSide,
  accent,
  heading,
  photoAlt,
  photoSrc,
  children,
}: {
  imageSide: "left" | "right";
  accent: "cyan" | "purple";
  heading: string;
  photoAlt: string;
  photoSrc: string;
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
              <div className="border-border relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border">
                <Image
                  src={photoSrc}
                  alt={photoAlt}
                  fill
                  sizes="(max-width: 767px) 100vw, 384px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
