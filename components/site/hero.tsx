import Image from "next/image";
import { SectionHeader } from "@/components/ui/heading";

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
export function Hero({ dict }: { dict: HeroDict }) {
  return (
    <section
      id="top"
      className="flex items-center py-[clamp(2rem,7vw,4rem)] md:min-h-[calc(100svh-5rem)]"
    >
      <div className="mx-auto w-full max-w-[var(--container)] px-[var(--page-x)]">
        <div className="flex flex-wrap items-center gap-[clamp(2rem,5vw,4rem)]">
          <div className="min-w-[min(100%,20rem)] flex-[1.15_1_26rem]">
            <SectionHeader
              eyebrow={dict.kicker}
              title={dict.headline}
              level={1}
              size="page"
              reveal
              titleClassName="max-w-[14ch]"
            />
            <p
              data-reveal
              className="text-muted-foreground mt-[1.6rem] max-w-[34ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.6]"
            >
              {dict.subheadline}
            </p>
          </div>

          <div
            data-reveal
            className="flex min-w-[min(100%,17rem)] flex-[0.85_1_18rem] justify-center md:justify-end"
          >
            <div className="border-border bg-card relative aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-2xl border md:h-[min(34rem,64svh)] md:w-auto md:max-w-none">
              <Image
                src="/img/francisco-hero-4x5.webp"
                alt={dict.photoAlt}
                fill
                priority
                sizes="(max-width: 767px) 100vw, 460px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
