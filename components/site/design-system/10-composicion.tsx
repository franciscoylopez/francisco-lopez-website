import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, SECTION, WRAP } from "@/components/ui/layout";
import { PageCloser, type CloserItem } from "@/components/ui/page-closer";
import {
  IndexNote,
  SectionCloser,
  SectionIndex,
} from "@/components/ui/section-index";
import { DataTable, TD, TR } from "@/components/ui/table";
import { Tile } from "@/components/ui/tile";
import { BrandLogoBox } from "../brand-logo-box";
import { BlockOpener } from "@/components/ui/block-opener";
import { fillRatios } from "@/lib/design-values";
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
  bloqueDemo,
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
  /**
   * EL BLOQUE REAL QUE SE ENSEÑA, por el mismo motivo que `paradas`: el
   * espécimen de `BlockOpener` no es una recreación, es literalmente la banda
   * que abre el bloque «Piezas» de esta misma página, con su copy y sus cuatro
   * paradas. Si el bloque cambia, la demo cambia con él y no puede mentir.
   */
  bloqueDemo: {
    title: string;
    lead: string;
    items: { ordinal: string; label: string }[];
  };
  lang: Locale;
}) {
  const base = lang === "es" ? "" : `/${lang}`;

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

        {/* EL ORDEN DE ESTA SECCIÓN ES EL DE UNA PÁGINA, DE ARRIBA ABAJO (P62,
            2026-08-29). Las siete piezas eran correctas y la SECUENCIA no: el
            bloque abría por la tabla, el cierre de página era el tercer
            elemento y el índice caía a mitad de sección. Un bloque que publica
            las piezas de composición de página las presentaba en un orden que
            ninguna página tiene.

            Ahora se recorren como se recorre una página: el índice, la banda que
            abre un bloque, las tres cajas del cuerpo, y los dos cierres. Es un
            orden que el lector reconoce sin que nadie se lo explique, y por eso
            no lleva rótulo que lo anuncie.

            EL PAR DE NAVEGACIÓN SE PARTE, y el motivo es ese mismo orden: el
            índice y el cierre de sección son hermanos de familia pero no de
            posición —uno va debajo del hero y el otro al pie de cada parada—,
            así que publicarlos juntos era lo que metía el índice en mitad de la
            sección. Al partirlos, `SectionCloser` queda pegado a `PageCloser`,
            que es su hermana de peldaño: la nota que lo decía sigue siendo
            cierta, y ahora además se ve. */}

        {/* ---------- el índice ---------- */}
        {/* AQUÍ, Y NO EN §12 «Artículo largo» (P70.395). D121 sacó estas piezas
            de la capa de artículo en cuanto el índice entró también en Design
            System, Brand Kit y Accesibilidad, pero su línea @pieza seguía
            declarando la sección del artículo: la página decía que eran piezas
            de un formato cuando ya sirven a cuatro. §12 conserva sus
            especímenes, que ahora se leen como USO del artículo y no como la
            publicación. */}
        <GroupHead title={t.navIndexTitle} lead={t.navIndexLead} first />
        <SpecimenCard
          kicker={t.navIndexKicker}
          cls="SectionIndex"
          rule={t.navIndexRule}
          note={t.navIndexNote}
          wide
        >
          {/* Tres paradas, no las doce: el índice completo ya está unas cuantas
              secciones más arriba y repetirlo entero aquí sería la misma
              rejilla dos veces en la misma página. */}
          <SectionIndex
            kicker={t.navIndexDemoKicker}
            ariaLabel={t.navIndexDemoAria}
            items={paradas.slice(0, 3)}
            intro={
              // La nota va en el espécimen porque va en las cuatro páginas que
              // usan la pieza: sin ella la demo se parecería menos al índice
              // real que hay unas cuantas secciones más arriba. La cifra es la
              // de ESTA demo —tres paradas—, no la de la página.
              <IndexNote
                note={t.navIndexDemoNote}
                figures={[{ value: "3", suffix: t.navIndexDemoSuffix }]}
              />
            }
          />
        </SpecimenCard>

        {/* ---------- la apertura de bloque ---------- */}
        {/* VA EN ESTA SECCIÓN Y NO EN §01 «Rejilla» (P70.47): no es un ritmo de
            espaciado, es una CAJA a nivel de página, hermana de PageCloser y de
            las del cuerpo. Y el espécimen no es una recreación: es literalmente
            la banda que abre el bloque «Piezas» de ESTA página, con su copy y
            sus paradas. Si el bloque cambia, la demo cambia con él. */}
        <GroupHead title={t.blockTitle} lead={t.blockLead} />
        <SpecimenCard
          kicker={t.blockKicker}
          cls="BlockOpener"
          rule={t.blockRule}
          note={t.blockNote}
          wide
        >
          <BlockOpener
            title={bloqueDemo.title}
            lead={bloqueDemo.lead}
            items={bloqueDemo.items}
          />
        </SpecimenCard>

        {/* ---------- la tabla ---------- */}
        <GroupHead title={t.dataTitle} lead={t.dataLead} />
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
              {/* PASA POR `fillRatios` porque una de estas tres filas ARGUMENTA
                  CON UNA CIFRA VIVA («Atenuado sobre card, claro, 9,14:1»), y
                  la tenía escrita a mano teniendo fuente: `mutedOnCard` en
                  `design-values.ts`. Hoy coincidía. Es exactamente la deriva que
                  D38 existe para impedir, y en este repo una cifra equivocada ya
                  ha viajado dos veces, una de ellas trece días en producción. */}
              <TD className="text-muted-foreground text-[0.88rem]">
                {fillRatios(r.what, lang)}
              </TD>
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

        {/* ---------- la casilla ---------- */}
        {/* CIERRA EL CUERPO porque es la más pequeña de la familia: una caja que
            no es control ni texto. Y se publica con sus DOS usos vivos, no con
            uno, porque el defecto que la creó era justamente que los dos se
            escribían por separado y podían discrepar (P83.5). */}
        <GroupHead title={t.tileTitle} lead={t.tileLead} />
        <div className={PAIR}>
          <SpecimenCard
            kicker={t.tileLogoKicker}
            cls="BrandLogoBox"
            rule={t.tileLogoRule}
            note={t.tileLogoNote}
          >
            <div className="flex items-center gap-3">
              <BrandLogoBox name="companies/indya" />
              <BrandLogoBox name="companies/thetool" />
              <BrandLogoBox name="tools/figma" />
            </div>
          </SpecimenCard>
          <SpecimenCard
            kicker={t.tileNumKicker}
            cls="Tile"
            rule={t.tileNumRule}
            note={t.tileNumNote}
          >
            <div className="flex items-center gap-3">
              {["01", "02", "03"].map((n) => (
                <Tile
                  key={n}
                  className="text-muted-foreground font-mono text-[0.85rem]"
                >
                  {n}
                </Tile>
              ))}
            </div>
          </SpecimenCard>
        </div>

        {/* ---------- el cierre de sección ---------- */}
        <GroupHead title={t.navCloserTitle} lead={t.navCloserLead} />
        <SpecimenCard
          kicker={t.navCloserKicker}
          cls="SectionCloser"
          rule={t.navCloserRule}
          note={t.navCloserNote}
          wide
        >
          {/* «2 de 3», no «N de 12»: las secciones de esta página ya tienen su
              cierre real, y dos <nav> con el mismo nombre accesible rompen
              landmark-unique. El enlace del índice es REAL, como el del
              espécimen de PageCloser de aquí abajo. */}
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
