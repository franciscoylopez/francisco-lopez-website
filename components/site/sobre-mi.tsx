import Image from "next/image";
import { preload } from "react-dom";

import type { Dictionary } from "@/app/[lang]/dictionaries";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { ContactCta, type ContactActionsDict } from "./contact-actions";
import { PROSE, WRAP } from "@/components/ui/layout";
import { Rich } from "@/components/ui/rich";
import { SectionHeader, titleVariants } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

/**
 * Id del vídeo de apertura. Lo comparten el elemento y el script inline que lo
 * arranca, así que vive en una constante: dos cadenas iguales escritas a mano
 * son dos cadenas que pueden dejar de serlo, y aquí el síntoma sería una
 * apertura que se queda congelada en el póster sin error de compilación.
 */
const APERTURA_ID = "sobre-mi-apertura";

type SobreMiDict = Dictionary["sobreMi"];

// `PROSE` (medida de lectura) la usan el opening (intro) y el closing (Dónde estoy
// ahora): poco texto, media columna, alineada a la izquierda. "Cómo llegué a
// Producto" NO la usa — ocupa el ancho completo del contenedor, como los bloques
// con foto pero sin la mitad de imagen.

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
  contactoHref,
}: {
  dict: SobreMiDict;
  contacto: ContactActionsDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  /** Desde P67 el CTA del cierre lleva a la página de contacto. */
  contactoHref: string;
}) {
  const t = dict;
  // EL ELEMENTO LCP DE ESTA PÁGINA ES EL PÓSTER DEL VÍDEO DE APERTURA, y un
  // atributo `poster` no acepta `fetchpriority`: no hay forma de marcarlo
  // prioritario desde el propio elemento, así que la comprobación
  // «fetchpriority aplicado» de «Descubrimiento de solicitudes de LCP» no se
  // podía pasar tocando el vídeo. Se marca desde la cabeza, con el preload.
  //
  // EL `media` DICE LO QUE SE MIDIÓ, no más: con motion reducido el vídeo está
  // en `display:none` y el póster no se pinta nunca —se sirve el fotograma
  // quieto—, así que ahí no hay LCP que priorizar y el preload no aplica. Lo
  // que NO hace es ahorrar la descarga: Chrome pide el `poster` del `<video>`
  // igual, esté oculto o no, y eso viene del elemento, no de aquí. D65 sigue
  // en pie por su propio mecanismo, y se comprobó: con motion reducido el
  // .webm no se pide.
  //
  // Va aquí y no en la capa de página (`pageMetadata`/`PageShell`, D45/D46):
  // lo que hay que precargar lo decide quién pinta el vídeo, no el marco. React
  // lo iza al `<head>` él solo.
  preload("/img/francisco-sobre-mi-poster.webp", {
    as: "image",
    fetchPriority: "high",
    media: "(prefers-reduced-motion: no-preference)",
  });
  return (
    <>
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
              texto sobre la foto; en móvil se oculta la 2ª frase.

              La foto es de cuerpo entero y el sujeto ocupa las filas 66→844 de
              los 857px de alto de la fuente, lo que impone una restricción dura:
              para que salga ENTERO, la banda tiene que medir 0,505 × su ancho.
              De ahí salen los dos números del `clamp`: el tope —41rem, 656px—
              cubre los 646 que pide el ancho máximo de contenido (1280px), y el
              48vw mantiene la proporción por debajo de ese tope. Con 46vw la
              banda se quedaba hasta 21px corta entre 900 y 1426px de viewport y
              recortaba los zapatos; el `min()` con `100svh` sigue mandando en
              cuanto la pantalla es baja, así que subirlo no alarga nada ahí.

              Pero esa altura no siempre cabe sobre el pliegue, y ahí es donde se
              cortaba. La cabecera y el breadcrumb ocupan 12,5rem fijos, y un 1920
              con el escalado de Windows al 125% deja 1536×~740 de viewport CSS;
              al 150%, 1280×~618. Con la banda a 656 la foto se salía por abajo y
              la cita quedaba partida por el borde de la ventana. De ahí el
              `min(48vw, 100svh - 14rem)` dentro del `clamp`: manda el más pequeño
              de los dos, así que en pantalla grande sale la figura completa y en
              un portátil la banda se acorta —12,5rem de andamiaje + 1,5 de aire—
              en vez de salirse. El suelo de 15rem del `clamp` protege el móvil.

              Y para que al acortarse recorte por los pies y NUNCA por la
              cabeza, la fuente viene recortada 84px por arriba —exactamente el
              aire que dejaba la banda a ancho máximo, así que en pantalla
              grande no cambia nada— y `object-[68%_0%]` ancla arriba. Un solo
              porcentaje no puede hacer las dos cosas: anclado abajo, la altura
              de portátil decapitaba. Por debajo de ~520px de viewport el
              recorte pasa a ser horizontal, sale la figura entera igual, y el
              68% conserva al sujeto, que está a la derecha.

              DESDE EL 2026-08-19 LA APERTURA ES UN VÍDEO, y el párrafo de
              arriba explica por qué NO se le puede aplicar su misma receta. El
              plano dura 10s: sala vacía, entra por la derecha, cruza y se apoya
              en la pared. Tres cosas medidas antes de montarlo:

              · NO TERMINA EN LA FOTO ANTERIOR. Al final la figura está en
                x=50% ocupando el 19% del ancho; en la foto estaba en x=69%
                ocupando el 24%. Misma pose, encuadre distinto: el vídeo no
                puede «entregarle el relevo» a la foto vieja, así que el
                respaldo quieto sale de su ÚLTIMO FOTOGRAMA, no del asset de
                antes.
              · NO PUEDE LLEVAR `loop`. Saltaría de él apoyado a la sala vacía
                y volvería a entrar en bucle, que se lee como un fallo. Se
                reproduce UNA vez y se queda en el último fotograma.
              · EL RECORTE NO PUEDE ANCLARSE ARRIBA. El vídeo es 16:9 (1,778) y
                la banda 1,951, y su figura es más pequeña y más baja: ocupa el
                71% del alto del cuadro contra el 87% de la foto. En un 1280×618
                —el 1920 de Windows al 150%— la banda mide 394px y solo caben el
                55% del alto del vídeo, así que A ESA ALTURA NO CABE ENTERO CON
                NINGÚN ANCLAJE. Es aritmética, no criterio. Se ancla al 18% para
                que lo que se pierda sea suelo y piernas y nunca la cabeza:
                D50 al revés, porque aquí el sujeto no llega a los bordes.

              El scrim es más profundo que el de la foto anterior (85/55 frente a
              75/25) porque esta pared es blanca donde la otra era gris oscuro:
              con el gradiente antiguo el par texto-blanco/fondo caía a 3,81 en
              la cita y 6,93 en el subtítulo. Y sus paradas se topan en px
              (`min(60%, 13rem)` · `min(100%, 22rem)`) en vez de ir solo en
              porcentaje: así el velo cubre la cita y poco más, mida lo que mida
              la banda, en vez de estirarse con ella. Medido sobre el píxel
              compuesto —el par no existe en ningún token—, el peor caso de todo
              el rango de alturas (656 → 394) da 5,44 en la cita y 7,28 en el
              subtítulo, y 8,96 en la cita del móvil: AAA con sus umbrales (4,5 el
              texto grande de la cita, 7 el normal del subtítulo). */}
          <figure
            data-reveal
            className="relative m-0 h-[clamp(15rem,min(48vw,100svh_-_14rem),41rem)] overflow-hidden rounded-lg"
          >
            {/* CON MOTION REDUCIDO no se sirve el vídeo pausado, se sirve una
                imagen quieta: su ÚLTIMO fotograma, porque el primero es la sala
                vacía y una habitación sin nadie no es el retrato de esta página.
                Lleva el `fetchPriority` alto que antes tenía la foto (D47).

                Y NO SE DESCARGA EL VÍDEO, que es la parte que hay que hacer a
                mano. `autoPlay` + `preload="none"` NO basta: está MEDIDO que el
                navegador ignora el `preload` cuando hay autoplay y se baja los
                370 KB igual, aunque el elemento esté en `display:none`. O sea
                que quien pide menos movimiento pagaba el vídeo entero para ver
                una imagen de 17 KB. Se quita el `autoPlay` y lo arranca el
                script de abajo solo si la preferencia no está puesta — es la
                misma forma que el sitio ya usa para el tema y el consentimiento:
                un inline sin JS de cliente de React. */}
            <Image
              src="/img/francisco-sobre-mi-quieto.webp"
              alt={t.photoAlt}
              fill
              // SIN `fetchPriority="high"` DESDE 2026-08-30, y no es un descuido:
              // esta imagen está en `display:none` para quien NO pide menos
              // movimiento, o sea para casi todo el mundo, y aun así el atributo
              // le pedía prioridad alta al navegador. Medido: se bajaba con
              // prioridad **High**, compitiendo con el póster, que sí es el LCP
              // de ese caso (D65, addendum).
              //
              // `loading="eager"` SE QUEDA, que es la mitad que sí hace falta:
              // sin él `next/image` la marca `lazy` y quien pide menos
              // movimiento —para quien esta imagen SÍ es el LCP— se la
              // encontraría diferida. Con `eager` y sin `fetchPriority`, Chrome
              // hace lo correcto en los dos casos por su cuenta: la deja en baja
              // mientras está oculta y la sube al descubrir que está en el
              // viewport. Es el navegador quien sabe cuál de las dos ramas se
              // está pintando; el JSX no.
              loading="eager"
              sizes="100vw"
              className="hidden object-cover object-[50%_18%] motion-reduce:block"
            />
            <video
              // Sin `controls`: no es un vídeo que se vea, es cómo abre la
              // página. Sin `loop` a propósito (ver arriba). `muted` y
              // `playsInline` no son opcionales: sin ellos iOS no reproduce y
              // Chrome bloquea la reproducción automática.
              id={APERTURA_ID}
              muted
              playsInline
              preload="none"
              poster="/img/francisco-sobre-mi-poster.webp"
              aria-hidden
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover object-[50%_18%] motion-reduce:hidden"
            >
              <source
                src="/video/francisco-sobre-mi-apertura.webm"
                type="video/webm"
              />
            </video>
            <script
              // El `catch` no es decoración: un navegador puede rechazar la
              // reproducción y una promesa sin capturar dejaría un error en
              // consola de una página que funciona (se queda el póster).
              dangerouslySetInnerHTML={{
                __html: `{const v=document.getElementById(${JSON.stringify(APERTURA_ID)});if(v&&!matchMedia("(prefers-reduced-motion: reduce)").matches)v.play().catch(()=>{})}`,
              }}
            />
            <noscript>
              {/* Sin JS no hay vídeo, así que la apertura es el póster: la sala
                  vacía. Se sustituye por el fotograma final, que sí es un
                  retrato. */}
              <Image
                src="/img/francisco-sobre-mi-quieto.webp"
                alt={t.photoAlt}
                fill
                sizes="100vw"
                className="object-cover object-[50%_18%]"
              />
            </noscript>
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.85)_0,rgba(0,0,0,0.55)_min(60%,13rem),transparent_min(100%,22rem))]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 p-[clamp(1.5rem,4vw,3rem)]">
              {/* `text-balance` SE QUEDA (P50.90): la capa da `pretty` a un `<p>`
                  y esta apertura se lee como titular sin ser un encabezado. No
                  repite a la capa, la contradice a propósito. */}
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
            <SectionHeader
              eyebrow={t.kicker}
              title={t.title}
              level={1}
              size="page-sm"
            />
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
            <ContactCta label={contacto.emailCta} href={contactoHref} />
          </div>
        </div>
      </section>
    </>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={cn(titleVariants({ size: "sub" }), "mb-4")}>{children}</h2>
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
                className={`absolute inset-0 rounded-lg ${accentColor} ${accentOffset}`}
              />
              <div className="border-border relative aspect-[4/5] w-full overflow-hidden rounded-lg border">
                <Image
                  src={photoSrc}
                  alt={photoAlt}
                  fill
                  // EL `100vw` DE ANTES DECLARABA MÁS DE LO QUE SE PINTA, y esa
                  // es la mitad móvil que P70.28 no cerró. La caja vive dentro de
                  // `WRAP`, así que nunca ocupa el ancho entero: a 412px de
                  // viewport se pinta a 369, no a 412 (el gutter es
                  // `--page-x`, `clamp(1.25rem,5vw,2.5rem)`, a los dos lados).
                  // Medido con Lighthouse a 412×823 · DPR 1,75: pedía 721px y
                  // se bajaba el candidato de 750 para una caja que necesita
                  // 645 → 25,7% de píxeles de más, 13,6 KiB. `90vw` es el
                  // gutter ya descontado, y el `384px` de escritorio sigue
                  // siendo el tope real de la caja (`max-w-[24rem]`).
                  sizes="(max-width: 767px) 90vw, 384px"
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
