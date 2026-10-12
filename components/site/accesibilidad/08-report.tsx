import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { SECTION, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

import { EmailLink } from "../contact-actions";
import { type SeccionMarco } from "./shared";

type T = Dictionary["accesibilidad"];

/* ===================== (08) REPORTAR UNA BARRERA ===================== */
export function Report({ t, marco }: { t: T["report"]; marco: SeccionMarco }) {
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
          <div className="max-w-[var(--measure)]">
            <p className="text-foreground/90 m-0 text-[1.0625rem] leading-[1.7]">
              {t.body}
            </p>
            {/* La única superficie de contacto con asunto (D29): aquí se
                  reporta una barrera concreta, y preencabezarlo baja la fricción
                  de verdad. La home y Sobre mí lo dejan vacío a propósito.

                  Y AQUÍ NO HAY BOTÓN desde P67. Lo había —un sólido «Escríbeme»
                  con la dirección debajo—, y con la dirección escrita al lado no
                  añadía nada: el botón abría exactamente el mismo `mailto:` que
                  el enlace, así que era la misma acción dos veces, ocupando la
                  jerarquía del único sólido de la página. Esta página tampoco
                  enruta al formulario, a propósito: obligar a usarlo para
                  reportar una barrera sería una trampa el día que la barrera
                  fuera el formulario. */}
            <EmailLink subject={t.emailSubject} className="mt-6" />
          </div>
        </SectionHeader>
        {marco.closer}
      </div>
    </section>
  );
}
