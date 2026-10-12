import { BrandLogoBox } from "./brand-logo-box";
import { SECTION, WRAP } from "@/components/ui/layout";
import {
  SectionHeader,
  dataLabelVariants,
  titleVariants,
} from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import { Marcas } from "@/components/ui/marcas";

type EduItem = { title: string; institution: string };
export type FormacionDict = {
  eyebrow: string;
  title: string;
  intro: string;
  productoLabel: string;
  marketingLabel: string;
  producto: EduItem[];
  marketing: EduItem[];
};

/**
 * EL SEPARADOR DE CAMPOS del rótulo de una fila («TheHeroCamp · 2021»), que no lo
 * elige este archivo: lo fija `CLAUDE.md` §copy y lo vigila `check:raya`.
 */
const SEPARADOR = " · ";

/**
 * LAS CUATRO INSTITUCIONES, para el `alumniOf` del nodo `Person` (P82).
 *
 * `alumniOf` quiere la ORGANIZACIÓN, no el programa: «TheHeroCamp», no «Product
 * Management». El diccionario los publica juntos en la misma cadena porque es lo
 * que la fila pinta, así que aquí se parte por el separador de campos en vez de
 * escribir los cuatro nombres una segunda vez.
 *
 * LANZA SI LA CADENA NO SE PARTE EN DOS, misma cautela que `periodPartsOf`: un
 * rótulo con otro formato emitiría «TheHeroCamp, 2021» como nombre de institución
 * sin que nada lo notara, y eso es un dato mal publicado en las 28 variantes.
 */
export function alumniOf(dict: FormacionDict): string[] {
  return [...dict.producto, ...dict.marketing].map((item) => {
    const partes = item.institution.split(SEPARADOR);
    if (partes.length !== 2) {
      throw new Error(
        `Formación: «${item.institution}» no se parte en «institución${SEPARADOR}año». ` +
          "El nombre alimenta el `alumniOf` del JSON-LD; si el rótulo cambia de " +
          "formato, el sitio de arreglarlo es el diccionario de la home.",
      );
    }
    return partes[0]!;
  });
}

const PRODUCTO_LOGOS = ["education/the-hero-camp", "education/the-uncoding"];
const MARKETING_LOGOS = ["education/olea-europea", "education/esic"];

function Group({
  label,
  items,
  logos,
  className,
}: {
  label: string;
  items: EduItem[];
  logos: string[];
  className?: string;
}) {
  return (
    <>
      <p className={cn(dataLabelVariants(), "mb-[0.4rem]", className)}>
        {label}
      </p>
      <div className="border-border border-t">
        {items.map((item, i) => (
          <div
            key={item.title}
            className="border-border flex items-start gap-[1.1rem] border-b py-[clamp(1.3rem,2.6vw,1.7rem)]"
          >
            <BrandLogoBox name={logos[i] ?? ""} />
            <div>
              <h3
                className={cn(titleVariants({ size: "card" }), "mb-[0.3rem]")}
              >
                {item.title}
              </h3>
              <p className="text-muted-foreground m-0 text-[0.9rem]">
                <Marcas>{item.institution}</Marcas>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Formación (PRD §8.6). Aside sticky + dos grupos (Producto / Marketing) con logo
// real de la institución por fila. Mismo patrón responsive que Cómo trabajo (D7).
export function Formacion({ dict }: { dict: FormacionDict }) {
  return (
    <section id="formacion" className={SECTION}>
      <div className={WRAP}>
        <div className="flex flex-col gap-[clamp(2rem,5vw,4rem)] md:flex-row">
          <div
            data-reveal
            className="min-w-[min(100%,17rem)] self-start md:sticky md:top-[5.5rem] md:flex-[1_1_18rem]"
          >
            <SectionHeader eyebrow={dict.eyebrow} title={dict.title}>
              <p className="text-muted-foreground max-w-[32ch] text-base leading-[1.6]">
                {dict.intro}
              </p>
            </SectionHeader>
          </div>

          <div
            data-reveal
            className="min-w-[min(100%,20rem)] md:flex-[1.8_1_28rem]"
          >
            <Group
              label={dict.productoLabel}
              items={dict.producto}
              logos={PRODUCTO_LOGOS}
            />
            <Group
              label={dict.marketingLabel}
              items={dict.marketing}
              logos={MARKETING_LOGOS}
              className="mt-[clamp(2rem,4vw,3rem)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
