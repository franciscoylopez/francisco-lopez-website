import { ContactActions, type ContactActionsDict } from "./contact-actions";
import { WRAP } from "@/components/ui/layout";

export type ContactoDict = ContactActionsDict & {
  eyebrow: string;
  title: string;
  intro: string;
};

// Franja-CTA de cierre (PRD §8.9). Antes era una sección más —lista de cuatro filas
// que trataba email y CV como iguales— y ahora cierra la home como banda: fondo
// `muted` a sangre, copy de posicionamiento al ICP y UNA acción destacada.
//
// El fondo `muted` obliga a no usar `muted-foreground` encima (perdería AAA); el
// atenuado sale de `--contact-dim`, que dentro de `.contact-band` se mezcla con la
// banda al 85% — AAA en ambos temas. Ver el bloque "Contacto" de globals.css.
export function Contacto({
  dict,
  cvHref,
}: {
  dict: ContactoDict;
  cvHref: string;
}) {
  return (
    <section
      id="contacto"
      className="contact-band bg-muted py-[clamp(4.5rem,10vw,8rem)]"
    >
      <div className={WRAP}>
        <div data-reveal className="max-w-[var(--measure)]">
          <p className="contact-dim m-0 mb-3 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase">
            {dict.eyebrow}
          </p>
          <h2 className="font-display m-0 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.022em]">
            {dict.title}
          </h2>
          <p className="mt-[1.4rem] text-[1.05rem] leading-[1.6] text-pretty">
            {dict.intro}
          </p>
        </div>

        <div data-reveal className="mt-[clamp(2.25rem,4.5vw,3rem)]">
          <ContactActions dict={dict} cvHref={cvHref} />
        </div>
      </div>
    </section>
  );
}
