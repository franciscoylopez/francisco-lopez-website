import Image from "next/image";
import { LEAD_SIZE, LEADING, SectionHeader } from "@/components/ui/heading";
import { WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

export type HeroDict = {
  kicker: string;
  headline: string;
  subheadline: string;
  photoAlt: string;
};

// Hero (PRD §5/§23). Sin CTA propio. En desktop (md+) la sección llena el primer
// pliegue (100svh − alto del nav) y centra verticalmente texto + foto, para que
// ambos entren enteros sin scroll en portátiles de poco alto. La foto se dimensiona
// por ALTURA con tope de viewport, manteniendo el 4:5 real (antes se recortaba a
// casi cuadrada por cap de max-height) y ≤460px de ancho (§23). En móvil apila y se
// dimensiona por ancho de columna.
// EL PUNTO FINAL SE SEPARA AQUÍ, no en el diccionario (P81). La firma de marca
// es que ese punto caiga, y para animarlo necesita ser su propio elemento — pero
// el copy tiene que seguir siendo una frase completa: quitarle el punto al
// diccionario dejaría la fuente de verdad diciendo algo que no es. Así que la
// separación es de PRESENTACIÓN y vive donde se pinta.
//
// Vale para los dos idiomas sin condicionales, porque los dos titulares terminan
// igual («Del discovery al dato.» / «From discovery to data.»), y si algún día
// uno no lleva punto no pasa nada: se pinta entero y no hay gesto.
function Titular({ texto }: { texto: string }) {
  if (!texto.endsWith(".")) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, -1)}
      <span className="punto-firma">.</span>
    </>
  );
}

export function Hero({ dict }: { dict: HeroDict }) {
  return (
    <section
      id="top"
      className="flex items-center py-[clamp(2rem,7vw,4rem)] md:min-h-[calc(100svh-5rem)]"
    >
      <div className={cn(WRAP, "w-full")}>
        <div className="flex flex-wrap items-center gap-[clamp(2rem,5vw,4rem)]">
          <div className="min-w-[min(100%,20rem)] flex-[1.15_1_26rem]">
            <SectionHeader
              eyebrow={dict.kicker}
              title={<Titular texto={dict.headline} />}
              level={1}
              size="page"
              reveal
              titleClassName="max-w-[14ch]"
            />
            <p
              data-reveal
              className={cn(
                LEAD_SIZE,
                LEADING.lead,
                "text-muted-foreground mt-[1.6rem] max-w-[34ch]",
              )}
            >
              {dict.subheadline}
            </p>
          </div>

          <div
            data-reveal
            className="flex min-w-[min(100%,17rem)] flex-[0.85_1_18rem] justify-center md:justify-end"
          >
            <div className="border-border bg-card relative aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-2xl border md:h-[min(34rem,64svh)] md:w-auto md:max-w-none">
              {/* Es el elemento LCP de la home. En Next 16 `priority` está
                  DEPRECADO y ya no hace lo que hacía: solo emite el
                  <link rel="preload">, y deja el <img> SIN `fetchpriority` ni
                  `loading` (comprobado en el HTML servido del Preview). La doc
                  del propio Next dice que se use `loading="eager"` o
                  `fetchPriority="high"` en su lugar. Ver DECISIONS.md D47. */}
              {/* `sizes` MEDIDO, NO ESTIMADO (P72.50). Decía `100vw` por debajo
                  de 768 y la foto nunca ocupa el ancho entero: la columna es el
                  86,9% del viewport hasta que `max-w-[26rem]` la topa en 414px,
                  cosa que pasa a partir de ~479. A 767 eso declaraba 767 donde
                  se pintan 414, o sea un 85% de más. Medido en once anchos sobre
                  el build servido; por encima de 768 manda el alto
                  (`min(34rem,64svh)`) y el ancho real tope es 433, así que 440.

                  HOY NO COSTABA UN BYTE, y por eso llevaba ahí desde el primer
                  día sin que ningún gate lo viera: el original tiene 614px de
                  ancho y el optimizador de Next no amplía, así que pidiera el
                  navegador `w=750` o `w=640` recibía el mismo archivo. Lo que
                  arregla esto es el día que la foto se cambie por un original
                  más grande —ya ha pasado dos veces— y de golpe cada móvil se
                  baje el candidato de 1080 para pintar 358.

                  NO QUITA EL AVISO DE PSI, y eso está comprobado: «Improve image
                  delivery, 12 KiB» compara los 614×768 que se sirven contra los
                  357×446 que se PINTAN, sin mirar el DPR — a 1,75 harían falta
                  625, o sea más de los que hay. Servir lo que pide dejaría la
                  foto blanda en cualquier móvil moderno. El desglose entero, en
                  la ficha de P72.50. */}
              <Image
                src="/img/francisco-hero-estudio-4x5.webp"
                alt={dict.photoAlt}
                fill
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 478px) 87vw, (max-width: 767px) 414px, 440px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
