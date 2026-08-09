import { BrandLogoBox } from "./brand-logo-box";
import { SECTION, WRAP } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/heading";

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
      <p
        className={
          "text-muted-foreground m-0 mb-[0.4rem] text-[0.72rem] font-semibold tracking-[0.08em] uppercase " +
          (className ?? "")
        }
      >
        {label}
      </p>
      <div className="border-border border-t">
        {items.map((item, i) => (
          <div
            key={item.title}
            className="border-border flex items-start gap-[1.1rem] border-b py-[clamp(1.3rem,2.6vw,1.7rem)]"
          >
            <BrandLogoBox
              name={logos[i] ?? ""}
              className="h-10 w-10 flex-none"
            />
            <div>
              <h3 className="font-display m-0 mb-[0.3rem] text-[clamp(1.15rem,1.9vw,1.5rem)] leading-[1.2] font-semibold tracking-[-0.015em]">
                {item.title}
              </h3>
              <p className="text-muted-foreground m-0 text-[0.9rem]">
                {item.institution}
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
            <SectionHeader eyebrow={dict.eyebrow} title={dict.title} />
            <p className="text-muted-foreground mt-[1.4rem] max-w-[32ch] text-base leading-[1.6]">
              {dict.intro}
            </p>
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
