import { Download } from "lucide-react";

import { actionVariants } from "@/components/ui/action";
import { cn } from "@/lib/utils";

import { BrandLogoBox } from "./brand-logo-box";
import { type Locale, pagePath } from "@/lib/i18n/config";
import { SECTION, WRAP } from "@/components/ui/layout";
import { SectionHeader, dataLabelVariants } from "@/components/ui/heading";
import { experienceOf } from "@/content/experiences";
import { factsOf, shortOf } from "@/content/experience-copy";
import { Marcas } from "@/components/ui/marcas";

// LA FILA NO LLEVA SU DESCRIPCIÓN, igual que no lleva su logo ni su `slug`: sale
// del registro por experiencia, buscada por `company` (P48.5). Esa frase es una
// de las TRES longitudes en que se cuenta lo mismo —la otra es el bullet del CV y
// la tercera su gemelo de «En un minuto»—, y mientras vivió en el diccionario no
// había forma de ver que había dejado de decir lo que dice el deep-dive. La de
// INDYA lo demostraba: hablaba de «pricing y onboarding» cuando el titular de su
// página es literalmente «no sobre features».
// LA FILA SE QUEDA SOLO CON `company`, que además es su etiqueta: el diccionario
// la lleva en forma de display («Ontecnia (Malavida, Lecturalia, BonViveur…)») y
// el registro en forma corta, unidas por prefijo. Rol y periodo también salen del
// registro desde P48.55 — mientras cada superficie escribía el suyo, KUOTIP
// terminaba en NOVIEMBRE aquí y en DICIEMBRE en su deep-dive.
type TrayRow = {
  company: string;
};

export type TrayectoriaDict = {
  eyebrow: string;
  title: string;
  cta: string;
  productoLabel: string;
  productoIntro: string;
  shutappTitle: string;
  shutappPeriod: string;
  shutappSubtitle: string;
  previoLabel: string;
  previoIntro: string;
  producto: TrayRow[];
  nested: TrayRow[];
  previo: TrayRow[];
};

// EL ENLACE AL DEEP-DIVE SALE DEL REGISTRO, no del diccionario: `slug` es el
// campo que `content/experiences.ts` creó para esto (D44) y una fila enlaza si —y
// solo si— su experiencia tiene página. Escribir la lista de cuáles enlazan sería
// el mismo modo de fallo que ese módulo existe para matar.
//
// EL ENLACE ES EL ROL, no una línea aparte («Ver el caso →»), y es una decisión
// tomada VIENDO LAS DOS EN PANTALLA con un prototipo desechable (2026-08-17,
// Francisco). Lo que se estaba juzgando era el caso raro del bloque: bajo
// «Shutapp Projects» hay dos filas hermanas y solo una tiene página, así que
// PICKASO es la única sin subrayar dentro de su grupo. Se eligió A sabiéndolo.
//
// El subrayado va en la base de `.link-content` desde el 2026-08-23; hasta
// entonces lo ponía un modificador aparte que TODOS los call sites escribían, y
// sin él el reposo se queda SIN afordancia —el primer montaje del prototipo salió
// así y los enlaces no se distinguían del texto—. Y es enlace de CONTENIDO y no de chrome porque no es carpintería de
// navegación: es una entrada de la trayectoria que además lleva a su caso.
// Y LA RUTA NO SE ESCRIBE: sale de `pagePath`, que es la fuente única del
// emparejamiento ruta↔locale (D45). Escribir `/trayectoria/${slug}` aquí habría
// dado un enlace roto en inglés —el sitio no traduce el segmento, pero sí lleva
// el prefijo `/en`— y es justo el ternario que D45 borró de cinco sitios.
function CaseLink({
  company,
  lang,
  children,
}: {
  company: string;
  lang: Locale;
  children: React.ReactNode;
}) {
  const { slug } = experienceOf(company);
  if (!slug) return <>{children}</>;
  return (
    <a href={pagePath(lang, `trayectoria/${slug}`)} className="link-content">
      {children}
    </a>
  );
}

// El logo NO es un dato de la fila: se busca por el nombre de la empresa en
// `content/experiences.ts`, que es su fuente única. Antes eran tres arrays
// posicionales aquí mismo, unidos por índice contra los del diccionario —
// reordenar una experiencia desalineaba los logos en silencio.
function LogoCell({ company }: { company: string }) {
  const { logo } = experienceOf(company);
  if (!logo) return null;
  return (
    <span className="hidden justify-self-end md:block">
      <BrandLogoBox name={logo} />
    </span>
  );
}

function Row({ row, lang }: { row: TrayRow; lang: Locale }) {
  const { role, period } = factsOf(lang, row.company);
  return (
    <div className="tray-grid border-border border-b py-[clamp(1.35rem,3vw,1.85rem)]">
      <p className="text-muted-foreground m-0 pt-[0.15rem] text-[0.9rem] whitespace-nowrap [font-variant-numeric:tabular-nums]">
        {period}
      </p>
      <div>
        <div className="font-display text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.2] font-semibold tracking-[-0.01em]">
          <CaseLink company={row.company} lang={lang}>
            {role}
          </CaseLink>
        </div>
        <div className="text-muted-foreground mt-1 text-[0.9rem]">
          <Marcas>{row.company}</Marcas>
        </div>
        <p className="text-muted-foreground m-0 mt-[0.7rem] max-w-[60ch] text-[0.92rem] leading-[1.6]">
          <Marcas>{shortOf(lang, row.company)}</Marcas>
        </p>
      </div>
      <LogoCell company={row.company} />
    </div>
  );
}

function NestedRow({ row, lang }: { row: TrayRow; lang: Locale }) {
  const { role, period } = factsOf(lang, row.company);
  return (
    <div className="tray-grid-nested relative">
      {/* conector horizontal hacia el borde vertical del contenedor */}
      <span
        aria-hidden="true"
        className="bg-border absolute top-[0.55rem] h-0.5"
        style={{
          left: "calc(-1 * clamp(1rem, 2.5vw, 1.75rem) - 2px)",
          width: "clamp(0.75rem, 2vw, 1.15rem)",
        }}
      />
      <p className="text-muted-foreground m-0 pt-[0.15rem] text-[0.85rem] whitespace-nowrap [font-variant-numeric:tabular-nums]">
        {period}
      </p>
      <div>
        <div className="font-display text-[clamp(0.98rem,1.4vw,1.15rem)] leading-[1.2] font-semibold tracking-[-0.01em]">
          <CaseLink company={row.company} lang={lang}>
            {role}
          </CaseLink>
        </div>
        <div className="text-muted-foreground mt-[0.2rem] text-[0.88rem]">
          <Marcas>{row.company}</Marcas>
        </div>
        <p className="text-muted-foreground m-0 mt-[0.6rem] max-w-[58ch] text-[0.9rem] leading-[1.6]">
          <Marcas>{shortOf(lang, row.company)}</Marcas>
        </p>
      </div>
      <LogoCell company={row.company} />
    </div>
  );
}

// Trayectoria (PRD §8.5). Dos bloques (Producto / Marketing & Growth). Shutapp
// Projects es fila padre con TheTool y PICKASO anidados, conectados por un borde
// vertical. Logo por fila (oculto en móvil, D7). CTA secundario de descarga de CV.
export function Trayectoria({
  dict,
  cvHref,
  lang,
}: {
  dict: TrayectoriaDict;
  cvHref: string;
  lang: Locale;
}) {
  return (
    <section id="trayectoria" className={SECTION}>
      <div className={WRAP}>
        <div
          data-reveal
          className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
        >
          <SectionHeader eyebrow={dict.eyebrow} title={dict.title} />
        </div>

        {/* Bloque Producto: intro + CTA */}
        <div
          data-reveal
          className="mb-[clamp(1.5rem,3vw,2.25rem)] flex flex-wrap items-start justify-between gap-x-10 gap-y-5"
        >
          <div className="min-w-[min(100%,20rem)] flex-[1_1_30rem]">
            <p className={cn(dataLabelVariants(), "mb-2")}>
              {dict.productoLabel}
            </p>
            <p className="m-0 max-w-[64ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.6]">
              {dict.productoIntro}
            </p>
          </div>
          <a
            href={cvHref}
            download
            className={cn(
              actionVariants({ variant: "outline-primary" }),
              "flex-none",
            )}
          >
            <Download aria-hidden="true" />
            {dict.cta}
          </a>
        </div>

        <div data-reveal className="border-border border-t">
          {dict.producto.map((row) => (
            <Row key={row.company} row={row} lang={lang} />
          ))}

          {/* Shutapp Projects — fila padre con roles anidados */}
          <div className="border-border border-b py-[clamp(1.35rem,3vw,1.85rem)]">
            <div className="tray-grid">
              <p className="text-muted-foreground m-0 pt-[0.15rem] text-[0.9rem] whitespace-nowrap [font-variant-numeric:tabular-nums]">
                {dict.shutappPeriod}
              </p>
              <div>
                <div className="font-display text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.2] font-semibold tracking-[-0.01em]">
                  {dict.shutappTitle}
                </div>
                <div className="text-muted-foreground mt-1 text-[0.9rem]">
                  {dict.shutappSubtitle}
                </div>
              </div>
            </div>
            <div
              className="border-border mt-[1.15rem] flex flex-col gap-[1.35rem] border-l-2"
              style={{
                marginLeft: "clamp(0.5rem, 3vw, 1.5rem)",
                paddingLeft: "clamp(1rem, 2.5vw, 1.75rem)",
              }}
            >
              {dict.nested.map((row) => (
                <NestedRow key={row.company} row={row} lang={lang} />
              ))}
            </div>
          </div>
        </div>

        {/* Bloque Experiencia previa */}
        <div aria-hidden="true" className="h-[clamp(3.5rem,7vw,6rem)]" />
        <div
          aria-hidden="true"
          className="border-foreground mb-[clamp(2rem,4vw,3rem)] border-t-2 opacity-[0.28]"
        />
        <p data-reveal className={cn(dataLabelVariants(), "mb-2")}>
          {dict.previoLabel}
        </p>
        <p
          data-reveal
          className="m-0 mb-[clamp(1.5rem,3vw,2.25rem)] max-w-[64ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.6]"
        >
          {dict.previoIntro}
        </p>
        <div data-reveal className="border-border border-t">
          {dict.previo.map((row) => (
            <Row key={row.company} row={row} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}
