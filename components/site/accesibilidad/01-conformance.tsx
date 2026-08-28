import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { Rich } from "@/components/ui/rich";
import { LAST_A11Y_REVIEW, fillDate, fillRatios } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { NOTA, type SeccionMarco } from "./shared";

type T = Dictionary["accesibilidad"];

/* ===================== (01) NIVEL DE CONFORMIDAD ===================== */
export function Conformance({
  t,
  marco,
  lang,
}: {
  t: T["conformance"];
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
          <p className="text-muted-foreground m-0 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            {fillRatios(t.intro, lang)}
          </p>
          {/* LA FECHA VIVE AQUÍ Y NO EN EL HERO, y el motivo no es de lectura
                sino de aritmética del pliegue (P70.29). Las tres páginas
                hermanas centran su grupo con `my-auto` dentro de
                `min-h-[calc(100svh-5rem)]`, y centrar reparte el sobrante ARRIBA
                y abajo: un grupo que mide más que sus hermanas sube su borde
                superior la mitad de la diferencia. Con la fecha colgando de la
                `StatRow`, este grupo medía 505 contra los 461 de Brand Kit y
                Design System, y su `h1` caía a 368 contra 390 en las otras dos.
                Medido a 1920×1080, y son los mismos 22px que Francisco vio
                cambiando de pestaña.

                Sigue siendo lo primero que se lee de la declaración —que es el
                porqué por el que subió el 2026-08-16—, solo que ahora encabeza
                la sección que fecha en vez de rematar el hero. Fuera del pliegue
                no hay altura que repartir, así que ya no puede desalinear nada.

                La invariante que esto restaura («los grupos del pliegue miden lo
                mismo») está escrita en `brand-kit/hero.tsx` y no la vigila nadie
                todavía: es la segunda vez que se rompe y las dos las encontró un
                ojo, no una herramienta. */}
          <p className="text-muted-foreground m-0 mt-3 mb-8 text-[0.85rem]">
            {fillDate(t.updated, LAST_A11Y_REVIEW, lang)}
          </p>
        </SectionHeader>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[var(--gutter)]">
          {t.rows.map((r) => (
            <InfoCard key={r.label} title={r.label} body={r.value} />
          ))}
        </div>
        {/* La precisión que sostiene la fila «Norma europea»: la EAA obliga a
              productos y servicios comerciales, no a una web personal, y decir lo
              contrario sería el error que justo el público de esta página detecta.
              Va con <Rich> porque lleva los enlaces oficiales, EUR-Lex y ETSI
              (D23), y desde P70.105 también el de WCAG: es aquí, «que remite a
              WCAG», donde la norma aparece por primera vez en texto corrido, y
              los salientes se reparten por la página en su primera aparición en
              vez de amontonarse en un bloque final (decisión de Francisco). */}
        <p className={NOTA}>
          <Rich text={t.note} />
        </p>
        {marco.closer}
      </div>
    </section>
  );
}
