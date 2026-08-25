import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, SECTION, WRAP } from "@/components/ui/layout";
import { VideoEmbed } from "@/components/ui/video-embed";
import { cn } from "@/lib/utils";

import { GroupHead, SpecimenCard } from "./shared";

/* ===================== (18) VÍDEO =====================
    Sección propia porque la pieza publica una DECISIÓN, no un aspecto: el clic
    como puerta (D55). Y no encaja en ninguna otra: no es un control con caja
    (09) —su afordancia es una foto entera—, ni movimiento (07), ni parte de la
    checklist (13). Lo que enseña es el patrón click-to-load y la regla de
    `BRAND.md` §Un control sobre una imagen, que hasta hoy no estaba publicada
    en ninguna parte.

    LA DEMO ES EL VÍDEO REAL, con el mismo póster auto-hospedado que sirve el
    deep-dive: si mañana cambia el velo o el disco, esta sección cambia con él.
    Y pulsarla carga YouTube de verdad, que es exactamente lo que la sección
    afirma que pasa al pulsar.

    EL ANCHO SE ACOTA a la misma medida que en el deep-dive: a los 1.280px del
    contenedor, un 16:9 mide 720 de alto y se come la pantalla entera. */
export function Video({ t }: { t: Dictionary["designSystem"]["video"] }) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        <GroupHead title={t.facadeTitle} lead={t.facadeLead} first />
        <SpecimenCard
          kicker={t.facadeKicker}
          cls="VideoEmbed"
          rule={t.facadeRule}
          note={t.facadeNote}
          wide
        >
          <div className="mx-auto max-w-[40rem]">
            <VideoEmbed
              id="rf79VTlAdUM"
              poster="/img/thetool-video-poster.webp"
              title={t.demoVideoTitle}
              playLabel={t.demoPlayLabel}
            />
          </div>
        </SpecimenCard>

        {/* Sin `children`: la demo es la de arriba. Es para lo que existe la
            ficha suelta, y evita pintar el mismo póster dos veces. */}
        <GroupHead title={t.controlTitle} lead={t.controlLead} />
        <SpecimenCard
          kicker={t.controlKicker}
          cls=".video-facade · .video-play"
          rule={t.controlRule}
          note={t.controlNote}
        />

        <div className={cn(PAIR, "mt-8")}>
          <InfoCard
            title={t.clickTitle}
            bullets={t.clickRule}
            foot={t.clickFoot}
          />
          <InfoCard
            title={t.posterTitle}
            bullets={t.posterRule}
            foot={t.posterFoot}
          />
        </div>
      </div>
    </section>
  );
}
