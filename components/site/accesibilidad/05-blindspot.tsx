import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { Rich } from "@/components/ui/rich";
import { fillPages } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { CapasVerificacionDiagram } from "../diagrams/capas-verificacion";
import { DiagramaFigura, INTRO, NOTA, type SeccionMarco } from "./shared";

type T = Dictionary["accesibilidad"];

/* ===================== (05) EL PUNTO CIEGO ===================== */
// La otra mitad del hueco de P70.02, y la que da credibilidad: qué encuentra una
// pasada a mano que ningún motor puede encontrar. El material estaba, pero
// repartido en dos notas al pie —el enlace de salto en la entradilla de (04) y
// los hallazgos de NVDA colgando de los límites—, o sea contado como pie de
// página de otra cosa. Con titular propio es un argumento; enterrado, era una
// anécdota.
export function Blindspot({
  t,
  marco,
  lang,
}: {
  t: T["blindspot"];
  marco: SeccionMarco;
  lang: Locale;
}) {
  return (
    <section
      data-reveal
      id={marco.id}
      className={cn(SECTION, "scroll-mt-[5rem]")}
    >
      <div className={WRAP}>
        <SectionHeader
          eyebrow={marco.kicker}
          title={t.heading}
          size="section-sm"
        >
          <p className={INTRO}>{t.intro}</p>
        </SectionHeader>
        {/* EL DIAGRAMA QUE YA EXISTÍA Y NO SE PODÍA REUSAR (P70.104). Dibuja
              cinco capas de verificación de longitud creciente y una zona final
              marcada «lo que ninguna regla prohíbe» que solo alcanza la última,
              una persona. Es LITERALMENTE el titular de esta sección, y estaba
              escrito para el capítulo 09 del artículo.

              NO SE DIBUJÓ OTRO, y ese era el bloqueo: dos diagramas del mismo
              sitio contando lo mismo con cifras distintas es el drift que P70.02
              acababa de evitar. Reusarlo obligaba antes a dos cosas, y las dos
              se hicieron: corregir su geometría, que contradecía su propio texto
              alternativo (P68.594), y sacarlo de `como-se-ha-creado-diagrams/`,
              o sea de UNA página, a `diagrams/` (P68.7205).

              MISMA CAJA QUE EL DIAGRAMA DE (03), y el `max-w-[690px]` es la
              misma aritmética, no una coincidencia de diseño: 690 menos 2 de
              borde menos 48 de padding son 640 de contenido, y el umbral de
              este lienzo también es 630. Por debajo, el diagrama saltaría a su
              dibujo estrecho en escritorio. */}
        <DiagramaFigura caption={t.figura.caption}>
          <CapasVerificacionDiagram lang={lang} />
        </DiagramaFigura>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[var(--gutter)]">
          {t.items.map((b) => (
            <InfoCard
              key={b.title}
              title={b.title}
              body={fillPages(b.body, lang)}
            />
          ))}
        </div>
        <p className={NOTA}>
          <Rich text={t.note} />
        </p>
        {marco.closer}
      </div>
    </section>
  );
}
