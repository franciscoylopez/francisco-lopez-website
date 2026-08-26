import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, SECTION, WRAP } from "@/components/ui/layout";
import { PageCloser, type CloserItem } from "@/components/ui/page-closer";
import { SectionCloser, SectionIndex } from "@/components/ui/section-index";
import { SectionRail } from "@/components/ui/section-index-islands";
import { DataTable, TD, TR } from "@/components/ui/table";
import { type Locale } from "@/lib/i18n/config";

import { cn } from "@/lib/utils";
import { GroupHead, SpecimenCard, type SeccionMarco } from "./shared";

/* ===================== COMPOSICIÓN DE PÁGINA =====================
    Fusión de las antiguas 12 (tablas) y 17 (bloques de página), P70.34.

    La 17 tenía razón de existir cuando se escribió —lo que faltaba no era una
    pieza más sino un SITIO— y aun así no daba para sección propia, que es lo
    que señaló Francisco. Lo que sí tenía era el nombre a medias: sus dos piezas
    no son «bloques de página» a secas, son, CON LA TABLA, las tres cajas que no
    son ni control ni texto. Juntas tienen nombre; sueltas, no.

    Y el titular sigue hablando de FORMATO, que es lo que las tres comparten: lo
    que sube a la capa no es el aspecto de una caja, es la decisión de que no la
    tome cada página por su cuenta.

    EL CIERRE SE DEMUESTRA ENTERO, con su ritmo vertical propio y su filete de
    arriba, porque es justo eso lo que se publica. Y lleva `labelId` propio: la
    página ya termina con un cierre de verdad, y dos `id` iguales en el mismo
    documento es un defecto de accesibilidad, no un detalle. */
export function Composicion({
  t,
  marco,
  paradas,
  lang,
}: {
  t: Dictionary["designSystem"]["composicion"];
  marco: SeccionMarco;
  /**
   * LAS PARADAS REALES DE ESTA PÁGINA, para que la demo no sea una maqueta
   * (P70.395). Las tres primeras celdas del espécimen ENLAZAN de verdad a las
   * secciones 01, 02 y 03: si mañana se reordena la página, la demo se reordena
   * con ella. Es «las piezas reales del sitio como demo» llevado al dato.
   */
  paradas: { id: string; ordinal: string; label: string }[];
  lang: Locale;
}) {
  const base = lang === "es" ? "" : `/${lang}`;

  // Anclas PROPIAS para el riel de demo: con los id reales, el observer
  // apuntaría a las secciones 01-03 y la pastilla no se encendería nunca
  // estando el lector aquí, en la 10. Los rótulos sí son los de verdad.
  const railDemo = paradas
    .slice(0, 3)
    .map((parada, i) => ({ ...parada, id: `ds-comp-rail-${i + 1}` }));

  // Los dos estados de un destino, que son los dos que el sitio pinta: el que
  // enlaza y el que todavía no existe. El enlace es REAL, como todo en esta
  // página: una demo con `href="#"` no comprobaría ni el foco ni el hover.
  const demoItems: CloserItem[] = [
    {
      key: "back",
      kicker: t.demoBackKicker,
      name: t.demoBackName,
      desc: t.demoBackDesc,
      href: `${base}/trayectoria/kuotip`,
      direction: "back",
    },
    {
      key: "soon",
      kicker: t.demoSoonKicker,
      name: t.demoSoonName,
      desc: t.demoSoonDesc,
      badge: t.demoSoonBadge,
    },
  ];

  return (
    <section
      data-reveal
      id={marco.id}
      className={cn(SECTION, "scroll-mt-[5rem]")}
    >
      <div className={WRAP}>
        <SectionHeader eyebrow={marco.kicker} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        {/* ---------- la tabla ---------- */}
        <GroupHead title={t.dataTitle} lead={t.dataLead} first />
        {/* La demo es una tabla de verdad y con la pieza de verdad: si la capa
            cambia, este espécimen cambia con ella y no puede mentir. */}
        <DataTable
          caption={t.dataTitle}
          cols={[
            { label: t.demoCols.part, width: "34%" },
            { label: t.demoCols.markup, width: "26%" },
            { label: t.demoCols.what },
          ]}
        >
          {t.demoRows.map((r) => (
            <TR key={r.markup}>
              <TD head className="text-foreground font-medium">
                {r.part}
              </TD>
              <TD>
                <code className="font-mono text-[0.85rem]">{r.markup}</code>
              </TD>
              <TD className="text-muted-foreground text-[0.88rem]">{r.what}</TD>
            </TR>
          ))}
        </DataTable>

        {/* ---------- la nota al margen ---------- */}
        <GroupHead title={t.noteTitle} lead={t.noteLead} />
        <div className={PAIR}>
          <SpecimenCard
            kicker={t.noteKicker}
            cls="InfoCard"
            rule={t.noteRule}
            note={t.noteNote}
            wide
          >
            <InfoCard title={t.demoNoteTitle} body={t.demoNoteBody} />
          </SpecimenCard>
          <SpecimenCard
            kicker={t.monoKicker}
            cls="InfoCard · mono"
            rule={t.monoRule}
            wide
          >
            <InfoCard
              mono
              title={t.demoMonoTitle}
              bullets={t.demoMonoBullets}
              foot={t.demoMonoFoot}
            />
          </SpecimenCard>
        </div>

        {/* ---------- el cierre de página ---------- */}
        <GroupHead title={t.closerTitle} lead={t.closerLead} />
        <SpecimenCard
          kicker={t.closerKicker}
          cls="PageCloser"
          rule={t.closerRule}
          note={t.closerNote}
          wide
        >
          <PageCloser
            eyebrow={t.demoCloserEyebrow}
            items={demoItems}
            labelId="ds-closer-demo-label"
          />
        </SpecimenCard>

        {/* ---------- la navegación por paradas ---------- */}
        {/* AQUÍ, Y NO EN §12 «Artículo largo» (P70.395). D121 sacó estas tres de
            la capa de artículo en cuanto el índice entró también en Design
            System, Brand Kit y Accesibilidad, pero su línea @pieza seguía
            declarando la sección del artículo: la página decía que eran piezas
            de un formato cuando ya sirven a cuatro. Su hermana de peldaño es
            PageCloser, que se publica justo arriba, y por eso van detrás de él.
            §12 conserva sus especímenes, que ahora se leen como USO del
            artículo y no como la publicación. */}
        <GroupHead title={t.navTitle} lead={t.navLead} />
        <SpecimenCard
          kicker={t.navIndexKicker}
          cls="SectionIndex"
          rule={t.navIndexRule}
          note={t.navIndexNote}
          wide
        >
          {/* Tres paradas, no las doce: el índice completo ya está tres
              secciones más arriba y repetirlo entero aquí sería la misma
              rejilla dos veces en la misma página. */}
          <SectionIndex
            kicker={t.navIndexDemoKicker}
            ariaLabel={t.navIndexDemoAria}
            items={paradas.slice(0, 3)}
          />
        </SpecimenCard>
        <SpecimenCard
          kicker={t.navCloserKicker}
          cls="SectionCloser"
          rule={t.navCloserRule}
          note={t.navCloserNote}
          wide
        >
          {/* «2 de 3», no «N de 12»: las doce secciones de esta página ya tienen
              su cierre real, y dos <nav> con el mismo nombre accesible rompen
              landmark-unique. El enlace del índice es REAL, como el del
              espécimen de PageCloser de aquí arriba. */}
          <SectionCloser
            position={2}
            total={3}
            indexLabel={t.navCloserIndexLabel}
            indexHref="#indice"
            nextLabel={t.navCloserNextLabel}
            nextHref={`#${paradas[0]?.id ?? "indice"}`}
            ariaLabel={t.navCloserAria}
            positionLabel={t.navCloserPositionLabel}
          />
        </SpecimenCard>
        <SpecimenCard
          kicker={t.navRailKicker}
          cls="SectionRail"
          rule={t.navRailRule}
          note={t.navRailNote}
          wide
        >
          {/* El riel nace fixed A LA VENTANA. La caja de abajo le crea su propio
              containing block con [transform:translateZ(0)] —misma técnica que
              §12— para que no se salga por encima del resto de la página. Los
              objetivos del IntersectionObserver viven dentro, así que se activa
              al llegar aquí haciendo scroll: mismo componente, mismo
              comportamiento. */}
          <div className="border-border bg-background relative isolate h-[220px] [transform:translateZ(0)] overflow-hidden rounded-xl border">
            <SectionRail items={railDemo} ariaLabel={t.navRailDemoAria} />
            <div className="flex h-full flex-col justify-between p-4">
              {railDemo.map((it) => (
                <span key={it.id} id={it.id} aria-hidden="true" />
              ))}
            </div>
          </div>
        </SpecimenCard>

        {/* La sección publica UNA regla, no dos: la poda de P70.33 dejó fuera el
            inventario de lo que la capa se llevó por delante, que contaba cómo se
            llegó aquí en vez de qué hay que hacer. */}
        <div className="mt-8 max-w-[var(--measure)]">
          <InfoCard title={t.ruleTitle} bullets={t.rule} foot={t.ruleFoot} />
        </div>
        {marco.closer}
      </div>
    </section>
  );
}
