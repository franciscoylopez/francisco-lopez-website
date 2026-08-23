import { ContactCta, type ContactActionsDict } from "./contact-actions";
import { WRAP } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/heading";

export type ContactoDict = ContactActionsDict & {
  eyebrow: string;
  title: string;
  intro: string;
};

// Franja-CTA de cierre (PRD §8.9). Antes era una sección más —lista de cuatro filas
// que trataba email y CV como iguales— y ahora cierra la home como banda: fondo
// `muted` a sangre, copy de posicionamiento al ICP y UNA acción destacada.
//
// El fondo `muted` obliga a recalcular el atenuado —el token está calibrado contra
// `--background` y encima de la banda perdería AAA—, pero eso ya no lo pide esta
// sección: desde P37.6565 `text-muted-foreground` resuelve al atenuado de la
// superficie donde cae, y `bg-muted` es una de ellas. Ver el bloque «Atenuado
// sensible a la superficie» de globals.css.
export function Contacto({
  dict,
  contactoHref,
}: {
  dict: ContactoDict;
  /** Desde P67 el CTA de esta franja lleva a la página de contacto. */
  contactoHref: string;
}) {
  return (
    <section
      id="contacto"
      className="contact-band bg-muted py-[clamp(4.5rem,10vw,8rem)]"
    >
      <div className={WRAP}>
        <div data-reveal className="max-w-[var(--measure)]">
          <SectionHeader eyebrow={dict.eyebrow} title={dict.title}>
            <p className="text-[1.05rem] leading-[1.6] text-pretty">
              {dict.intro}
            </p>
          </SectionHeader>
        </div>

        <div data-reveal className="mt-[clamp(2.25rem,4.5vw,3rem)]">
          <ContactCta label={dict.emailCta} href={contactoHref} />
        </div>
      </div>
    </section>
  );
}
