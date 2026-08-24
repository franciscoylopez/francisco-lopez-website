import type { CSSProperties } from "react";

import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

// Los diagramas propios de «Cómo se ha creado esta página» (P60, D54): SVG
// inline con tokens, no `<img>` — así conmutan con el tema. Site-specific (el
// contenido de cada uno es del artículo), por eso viven en `site/` y no en
// `ui/`, que solo aporta el marco (`DiagramPanel`). El pie de cada uno es del
// diccionario, no de aquí (P60 tanda 2): la versión anterior lo tenía escrito
// en español dentro de este módulo, así que EN publicaba una leyenda en
// castellano — bug de i18n que se arregla pasando el `caption` como parte del
// bloque `{ type: "diagram" }`, igual que el texto de una cita.
//
// Y CADA COMPONENTE RECIBE `lang` POR LA MISMA RAZÓN (hallazgo al verificar
// EN de P60 tanda 2, no algo que pidiera el feedback): el texto DENTRO del
// SVG —«selección · 5-10s», «se usa», «busca ausencia»— estaba tan hardcodeado
// en español como el pie que ya se arregló, y verificando la página en inglés
// se veía la mitad del diagrama en castellano. `LABELS` recoge las dos
// versiones de cada diagrama; el componente solo elige el idioma.
//
// SON SEIS, NO LOS ONCE QUE MARCA CADA `VISUAL ·` DEL BORRADOR. El resto de
// secciones se apoyan en la prosa y en las citas/dato-en-vivo; añadir un
// diagrama a cada una de las once habría sido ilustrar por completar una
// lista, no porque la sección lo necesitara. Es tarea de V3 (columna B de la
// DoD) si al verlo en pantalla se echa en falta alguno más.
//
// RUIDO CONOCIDO (D67): axe marca `<text>` dentro de estos SVG como
// `incomplete` en `color-contrast` — no resuelve `fill` sobre `<text>` SVG, no
// es un hallazgo. Medido a mano (viewport-verifier, P60): el par real es
// `--muted-foreground`/`--foreground` sobre `--card`, ya calibrado (D30/D39).

const LBL = "fill-muted-foreground font-mono text-[11px]";
const LBL_STRONG = "fill-foreground font-mono text-[11px] font-medium";

/** «Realce» (D79): cada pieza de un diagrama entra atenuada y un barrido
 * secuencial la lleva a opacidad plena, en el orden NARRATIVO que marca `i`
 * —el origen primero, lo que depende de él después—, no el orden en que cae
 * en el DOM. `.rlz` y `--i` los resuelve la CSS global (`app/globals.css`);
 * aquí solo se combina con las clases propias de cada pieza. */
function rlz(i: number, extra?: string) {
  return { className: cn(extra, "rlz"), style: { "--i": i } as CSSProperties };
}

/** 01 · Dos lectores, dos velocidades: el mismo scroll, leído a dos ritmos. */
export function DosVelocidadesDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Dos columnas iguales representan el mismo scroll de la página. La columna de la izquierda, marcada «selección, 5-10s», solo cubre el primer tramo, el above the fold. La columna de la derecha, marcada «CPO/VP Product, lectura profunda», cubre la columna entera hasta el final.",
      scan: "selección · 5-10s",
      deep: "scroll completo",
      deepReader: "CPO / VP Product",
    },
    en: {
      ariaLabel:
        "Two equal columns represent the same page scroll. The left column, marked “recruiter, 5-10s”, only covers the first stretch, the fold. The right column, marked “CPO/VP Product, deep read”, covers the whole column to the end.",
      scan: "recruiter · 5-10s",
      deep: "full scroll",
      deepReader: "CPO / VP Product",
    },
  }[lang];
  return (
    <svg
      viewBox="0 0 560 200"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[540px]"
    >
      <rect
        x="60"
        y="20"
        width="160"
        height="160"
        rx="6"
        {...rlz(1, "fill-muted")}
      />
      <rect
        x="60"
        y="20"
        width="160"
        height="42"
        rx="6"
        {...rlz(0, "fill-primary/70")}
      />
      <text x="140" y="45" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        above the fold
      </text>
      <text x="140" y="200" textAnchor="middle" {...rlz(4, LBL)}>
        {t.scan}
      </text>

      <rect
        x="340"
        y="20"
        width="160"
        height="160"
        rx="6"
        {...rlz(1, "fill-muted")}
      />
      <rect
        x="340"
        y="20"
        width="160"
        height="42"
        rx="6"
        {...rlz(0, "fill-primary/70")}
      />
      {/* La zona "reached beyond the fold" sigue en la familia del cian, no del
          morado (BRAND.md, «el morado decorativo no vale como elemento
          gráfico»): brand-purple-soft daba 1,74:1 contra el fondo en tema
          claro, por debajo del 3:1 que pide WCAG 1.4.11 para un relleno que
          transmite información (design-review P60). El relleno translúcido
          por sí solo tampoco llega (fill-primary/30 mide 1,66:1) — el borde
          en stroke-primary sí (7,93:1, mismo cian a plena intensidad que ya
          usa el header de arriba), y es el borde el que delimita la forma. */}
      <rect
        x="340"
        y="66"
        width="160"
        height="114"
        rx="4"
        strokeWidth="1.5"
        {...rlz(2, "fill-primary/30 stroke-primary")}
      />
      <text x="420" y="45" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        above the fold
      </text>
      <text x="420" y="125" textAnchor="middle" {...rlz(3, LBL_STRONG)}>
        {t.deep}
      </text>
      <text x="420" y="200" textAnchor="middle" {...rlz(4, LBL)}>
        {t.deepReader}
      </text>
    </svg>
  );
}

/** 03 · Las cuatro píldoras del color de marca: el mismo gesto rotado que
 * abre la portada del Brand Kit en `/api/og`, extendido de su par decorativo
 * (cian suave + morado suave) a las cuatro — sumando el cian y el morado
 * estándar — para que el diagrama enseñe el token completo, no solo la
 * mitad que usaba la OG (P60, tercera tanda). Agrupadas por tono: el par
 * cian primero, el par morado después. */
export function CapasColorDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Cuatro píldoras rotadas, agrupadas por tono: cian estándar y cian suave, morado estándar y morado suave. Los cuatro colores del sistema de marca.",
      cyan: "cian",
      cyanSoft: "cian suave",
      purple: "morado",
      purpleSoft: "morado suave",
    },
    en: {
      ariaLabel:
        "Four rotated pills, grouped by hue: standard cyan and soft cyan, standard purple and soft purple. The four colors of the brand system.",
      cyan: "cyan",
      cyanSoft: "soft cyan",
      purple: "purple",
      purpleSoft: "soft purple",
    },
  }[lang];
  return (
    <svg
      viewBox="0 0 480 280"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[470px]"
    >
      <rect
        x="25"
        y="15"
        width="90"
        height="220"
        rx="20"
        transform="rotate(-8 70 125)"
        {...rlz(0, "fill-brand-cyan")}
      />
      <rect
        x="129"
        y="15"
        width="90"
        height="220"
        rx="20"
        transform="rotate(8 174 125)"
        {...rlz(1, "fill-brand-cyan-soft")}
      />
      <rect
        x="253"
        y="15"
        width="90"
        height="220"
        rx="20"
        transform="rotate(-8 298 125)"
        {...rlz(2, "fill-brand-purple")}
      />
      <rect
        x="357"
        y="15"
        width="90"
        height="220"
        rx="20"
        transform="rotate(8 402 125)"
        {...rlz(3, "fill-brand-purple-soft")}
      />
      <text x="70" y="258" textAnchor="middle" {...rlz(4, LBL)}>
        {t.cyan}
      </text>
      <text x="174" y="258" textAnchor="middle" {...rlz(4, LBL)}>
        {t.cyanSoft}
      </text>
      <text x="298" y="258" textAnchor="middle" {...rlz(4, LBL)}>
        {t.purple}
      </text>
      <text x="402" y="258" textAnchor="middle" {...rlz(4, LBL)}>
        {t.purpleSoft}
      </text>
    </svg>
  );
}

/** 05 · La cascada de construcción, en escalera descendente (D79, prototipo
 * de Tanda 3 · «Escalera descendente», elegida sobre las otras dos que se
 * compararon): el indentado decreciente enseña lo que el texto ya dice —la
 * mayoría de casos se resuelven en la primera pregunta—, cosa que la fila
 * horizontal anterior no comunicaba en ningún sitio. */
export function CascadaDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Cuatro preguntas en cascada descendente, cada una más corta que la anterior: ¿Existe la pieza? → se usa. Si no, ¿es del sistema? → se crea la variante. Si no, ¿es estado, foco o portal? → se trae de shadcn. Si no, ¿nada de lo anterior? → se decide y se documenta. La mayoría de casos se resuelven en la primera pregunta.",
      steps: [
        { q: "¿Existe la pieza?", a: "Se usa" },
        { q: "¿Es del sistema?", a: "Se crea la variante" },
        { q: "¿Estado, foco o portal?", a: "Se trae de shadcn" },
        { q: "¿Nada de lo anterior?", a: "Se decide y se documenta" },
      ],
      sino: "si no",
    },
    en: {
      ariaLabel:
        "Four questions in a descending cascade, each shorter than the last: Does the piece exist? → use it. If not, is it the system's? → create the variant. If not, is it state, focus or a portal? → pull it from shadcn. If not, none of the above? → decide and document it. Most cases resolve at the first question.",
      steps: [
        { q: "Does it exist?", a: "Use it" },
        { q: "Is it the system's?", a: "Create the variant" },
        { q: "State, focus or portal?", a: "Pull it from shadcn" },
        { q: "None of the above?", a: "Decide and document" },
      ],
      sino: "if not",
    },
  }[lang];
  const W = 600;
  const ROW_H = 72;
  const PAD = 14;
  return (
    <svg
      viewBox={`0 0 ${W} ${PAD * 2 + t.steps.length * ROW_H}`}
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[600px]"
    >
      {t.steps.map((s, i) => {
        const y = PAD + i * ROW_H;
        const indent = i * 24;
        const boxW = W - 40 - indent * 2;
        const isFirst = i === 0;
        return (
          <g key={s.q}>
            <rect
              x={20 + indent}
              y={y}
              width={boxW}
              height={ROW_H - 14}
              rx="8"
              strokeWidth={isFirst ? 1.5 : 1}
              {...rlz(
                i,
                isFirst ? "fill-primary/12 stroke-primary" : "fill-muted",
              )}
            />
            <text x={40 + indent} y={y + 25} {...rlz(i, LBL_STRONG)}>
              {i + 1}. {s.q}
            </text>
            <text
              x={40 + indent}
              y={y + 44}
              {...rlz(i, "fill-primary font-mono text-[11px] font-semibold")}
            >
              → {s.a}
            </text>
            {i < t.steps.length - 1 ? (
              <>
                <line
                  x1={20 + indent + 16}
                  y1={y + ROW_H - 14}
                  x2={20 + indent + 16}
                  y2={y + ROW_H - 2}
                  strokeWidth="2"
                  {...rlz(i, "stroke-border")}
                />
                <text
                  x={20 + indent + 26}
                  y={y + ROW_H - 3}
                  {...rlz(i, "fill-muted-foreground font-mono text-[9px]")}
                >
                  {t.sino}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

/** 07 · Qué sale de la página antes de un clic: nada, hasta que alguien pulsa. */
export function SinConsentimientoDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Dos filas. Sin consentimiento y antes del clic en el vídeo, la fila de peticiones de red está vacía. Después del consentimiento y del clic, la fila muestra tres peticiones: analítica, mapa de calor y el vídeo.",
      before: "Sin consentimiento · sin clic en el vídeo",
      empty: "(ninguna petición)",
      after: "Con consentimiento y clic",
      analytics: "analítica",
      heatmap: "mapa de calor",
      video: "vídeo",
    },
    en: {
      ariaLabel:
        "Two rows. Without consent and before a click on the video, the row of network requests is empty. After consent and a click, the row shows three requests: analytics, heatmap and the video.",
      before: "No consent · no click on the video",
      empty: "(no requests)",
      after: "With consent and a click",
      analytics: "analytics",
      heatmap: "heatmap",
      video: "video",
    },
  }[lang];
  return (
    <svg
      viewBox="0 0 560 150"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[620px]"
    >
      <text x="10" y="30" {...rlz(0, LBL)}>
        {t.before}
      </text>
      <rect
        x="10"
        y="42"
        width="540"
        height="34"
        rx="6"
        strokeDasharray="4 4"
        {...rlz(0, "fill-muted")}
      />
      <text x="280" y="64" textAnchor="middle" {...rlz(0, LBL)}>
        {t.empty}
      </text>

      <text x="10" y="108" {...rlz(1, LBL)}>
        {t.after}
      </text>
      <g>
        <rect
          x="10"
          y="118"
          width="170"
          height="28"
          rx="5"
          {...rlz(2, "fill-primary/25")}
        />
        <text x="95" y="136" textAnchor="middle" {...rlz(2, LBL_STRONG)}>
          {t.analytics}
        </text>
        <rect
          x="195"
          y="118"
          width="170"
          height="28"
          rx="5"
          {...rlz(3, "fill-primary/25")}
        />
        <text x="280" y="136" textAnchor="middle" {...rlz(3, LBL_STRONG)}>
          {t.heatmap}
        </text>
        <rect
          x="380"
          y="118"
          width="170"
          height="28"
          rx="5"
          {...rlz(4, "fill-primary/25")}
        />
        <text x="465" y="136" textAnchor="middle" {...rlz(4, LBL_STRONG)}>
          {t.video}
        </text>
      </g>
    </svg>
  );
}

/** 08 · Las cinco capas de verificación, cada una cubriendo más que la
 * anterior — el diagrama validado en el prototipo de P59, con tokens reales. */
export function CapasVerificacionDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Cinco barras horizontales de longitud creciente: compilador, escáner automático, censo de contraste, lector de pantalla y persona. Solo la barra de la persona, la más larga, entra en la zona final marcada como «lo que ninguna regla prohíbe».",
      capas: [
        { label: "compilador", w: 150 },
        { label: "escáner automático", w: 240 },
        { label: "censo de contraste", w: 330 },
        { label: "lector de pantalla", w: 448 },
      ],
      persona: "persona",
      coveredLine1: "lo que cubre",
      coveredLine2: "una regla escrita",
      uncoveredLine1: "lo que ninguna",
      uncoveredLine2: "regla prohíbe",
    },
    en: {
      ariaLabel:
        "Five horizontal bars of increasing length: compiler, automated scanner, contrast census, screen reader and person. Only the person's bar, the longest, reaches into the final zone marked “what no rule forbids”.",
      capas: [
        { label: "compiler", w: 150 },
        { label: "automated scanner", w: 240 },
        { label: "contrast census", w: 330 },
        { label: "screen reader", w: 448 },
      ],
      persona: "person",
      coveredLine1: "what a written",
      coveredLine2: "rule covers",
      uncoveredLine1: "what no rule",
      uncoveredLine2: "forbids",
    },
  }[lang];
  return (
    <svg
      viewBox="0 0 620 300"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[600px]"
    >
      <line
        x1="130"
        y1="10"
        x2="130"
        y2="220"
        strokeDasharray="3 3"
        {...rlz(5, "stroke-border")}
      />
      <line
        x1="466"
        y1="10"
        x2="466"
        y2="220"
        strokeDasharray="3 3"
        {...rlz(5, "stroke-border")}
      />
      {/* Mismo ajuste que la zona "scroll completo" de arriba: fill-brand-purple-soft/50
          + stroke-brand-purple daban 1,30:1 y 2,81:1 en tema claro (design-review
          P60) — el cian lleva la información también aquí. */}
      <rect
        x="466"
        y="10"
        width="84"
        height="210"
        rx="4"
        strokeDasharray="4 3"
        {...rlz(5, "fill-primary/15 stroke-primary")}
      />
      {t.capas.map((c, i) => (
        <g key={c.label}>
          <text x="118" y={10 + i * 42 + 26} textAnchor="end" {...rlz(i, LBL)}>
            {c.label}
          </text>
          <rect
            x="130"
            y={10 + i * 42 + 8}
            width={c.w}
            height="24"
            rx="4"
            {...rlz(i, "fill-muted")}
          />
        </g>
      ))}
      <text x="118" y="196" textAnchor="end" {...rlz(4, LBL)}>
        {t.persona}
      </text>
      <rect
        x="130"
        y="178"
        width="420"
        height="24"
        rx="4"
        {...rlz(4, "fill-foreground")}
      />
      {/* Las dos etiquetas de cierre, en DOS líneas y separadas por el ancho
          de las zonas que describen (0-466 y 466-550): a una sola línea
          colisionaban a mitad de camino (11 caracteres de margen, con texto
          de 27-28). */}
      <text x="230" y="250" textAnchor="middle" {...rlz(5, LBL)}>
        <tspan x="230" dy="0">
          {t.coveredLine1}
        </tspan>
        <tspan x="230" dy="16">
          {t.coveredLine2}
        </tspan>
      </text>
      <text x="560" y="250" textAnchor="middle" {...rlz(5, LBL)}>
        <tspan x="560" dy="0">
          {t.uncoveredLine1}
        </tspan>
        <tspan x="560" dy="16">
          {t.uncoveredLine2}
        </tspan>
      </text>
    </svg>
  );
}

/** 09 · Los dieciséis pasos de CI, agrupados por rol (D79, prototipo de Tanda 3
 * · «Agrupado por rol», elegida sobre las otras dos que se compararon):
 * sustituye a los quince cuadraditos anónimos Y al dato en vivo «Quince
 * pasos en cada PR» —eran DOS piezas compitiendo por el mismo hueco (P60
 * tanda 3-bis, punto 11)— por un único diagrama con los QUINCE PASOS REALES
 * del workflow, en su orden real (un único job de GitHub Actions: se
 * ejecutan uno detrás de otro, nunca en paralelo). Busca-patrón /
 * busca-ausencia sale del propio texto de la sección, no de una etiqueta
 * inventada: los que buscan un patrón conocido son las herramientas de
 * fábrica (Format, Typecheck, Lint, Build); los que buscan la ausencia de
 * algo bueno son los guardianes propios de este repositorio.
 *
 * POR QUÉ «Tests» CUENTA COMO BUSCA-PATRÓN (2026-08-24, P68.494). Un test
 * falla cuando un caso ESCRITO deja de comportarse como debe; no sabe decir
 * qué lógica no cubre nadie, y esa es justo la propiedad que define a la otra
 * familia. Ponerlo con los guardianes haría falsa la frase de la sección.
 *
 * Y el recuento —quince, luego dieciséis, ahora diecisiete— sigue escrito a
 * mano aquí, en el pie del diccionario, en el PRD y en el README. Derivarlo
 * del propio `ci.yml` es P68.495, no esto. */
export function CIDiagram({ lang }: { lang: Locale }) {
  type Cat = "ausencia" | "patron";
  const t = {
    es: {
      ariaLabel:
        "Los diecisiete pasos del workflow de integración continua, en su orden real, agrupados en cuatro bloques: Código, Copy y contenido, Guardianes del repo, y Build y marco. Los pasos coloreados buscan la ausencia de algo bueno; los neutros buscan un patrón conocido.",
      groups: [
        {
          label: "Código",
          items: [
            { n: "Format", cat: "patron" as Cat },
            { n: "Typecheck", cat: "patron" as Cat },
            { n: "Lint", cat: "patron" as Cat },
            { n: "Tests", cat: "patron" as Cat },
          ],
        },
        {
          label: "Copy y contenido",
          items: [
            { n: "Paleta", cat: "ausencia" as Cat },
            { n: "Experiencias", cat: "ausencia" as Cat },
            { n: "CV al día", cat: "ausencia" as Cat },
            { n: "Raya en el copy", cat: "ausencia" as Cat },
          ],
        },
        {
          label: "Guardianes del repo",
          items: [
            { n: "Artefacto al día", cat: "ausencia" as Cat },
            { n: "Contexto de arranque", cat: "ausencia" as Cat },
            { n: "Skills al día", cat: "ausencia" as Cat },
            { n: "Índices derivados", cat: "ausencia" as Cat },
            { n: "Rutas registradas", cat: "ausencia" as Cat },
            { n: "Artículo al día", cat: "ausencia" as Cat },
          ],
        },
        {
          label: "Build y marco",
          items: [
            { n: "Build", cat: "patron" as Cat },
            { n: "Marco de página", cat: "ausencia" as Cat },
            { n: "Guardianes con dientes", cat: "ausencia" as Cat },
          ],
        },
      ],
      absence: "busca ausencia (12)",
      pattern: "busca patrón (5)",
    },
    en: {
      ariaLabel:
        "The seventeen steps of the continuous-integration workflow, in their real order, grouped into four blocks: Code, Copy and content, Repo guardians, and Build and frame. Tinted steps look for the absence of something good; neutral ones look for a known pattern.",
      groups: [
        {
          label: "Code",
          items: [
            { n: "Format", cat: "patron" as Cat },
            { n: "Typecheck", cat: "patron" as Cat },
            { n: "Lint", cat: "patron" as Cat },
            { n: "Tests", cat: "patron" as Cat },
          ],
        },
        {
          label: "Copy and content",
          items: [
            { n: "Palette", cat: "ausencia" as Cat },
            { n: "Experiences", cat: "ausencia" as Cat },
            { n: "CV freshness", cat: "ausencia" as Cat },
            { n: "Copy dash check", cat: "ausencia" as Cat },
          ],
        },
        {
          label: "Repo guardians",
          items: [
            { n: "Artifact freshness", cat: "ausencia" as Cat },
            { n: "Context budget", cat: "ausencia" as Cat },
            { n: "Skills freshness", cat: "ausencia" as Cat },
            { n: "Derived indices", cat: "ausencia" as Cat },
            { n: "Registered routes", cat: "ausencia" as Cat },
            { n: "Article freshness", cat: "ausencia" as Cat },
          ],
        },
        {
          label: "Build and frame",
          items: [
            { n: "Build", cat: "patron" as Cat },
            { n: "Page frame", cat: "ausencia" as Cat },
            { n: "Guardians with teeth", cat: "ausencia" as Cat },
          ],
        },
      ],
      absence: "looks for absence (12)",
      pattern: "looks for a pattern (5)",
    },
  }[lang];

  const chipW = (label: string) =>
    Math.max(58, Math.round(label.length * 6.4) + 22);
  const GAP = 8;
  const ROW_H = 26;
  const GROUP_H = 56;
  const W = 760;
  const lastStep = t.groups.length - 1;
  const legendY = t.groups.length * GROUP_H;

  return (
    <svg
      viewBox={`0 0 ${W} ${legendY + 30}`}
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[760px]"
    >
      {t.groups.map((g, gi) => {
        const y = gi * GROUP_H;
        let x = 10;
        return (
          <g key={g.label}>
            <text
              x="10"
              y={y + 12}
              {...rlz(
                gi,
                "fill-muted-foreground font-mono text-[10px] font-semibold uppercase tracking-[0.06em]",
              )}
            >
              {g.label}
            </text>
            {g.items.map((it) => {
              const w = chipW(it.n);
              const cx = x;
              x += w + GAP;
              return (
                <g key={it.n}>
                  <rect
                    x={cx}
                    y={y + 18}
                    width={w}
                    height={ROW_H}
                    rx="6"
                    {...rlz(
                      gi,
                      it.cat === "ausencia" ? "fill-primary/25" : "fill-muted",
                    )}
                  />
                  <text
                    x={cx + w / 2}
                    y={y + 18 + ROW_H / 2 + 3.5}
                    textAnchor="middle"
                    {...rlz(gi, "fill-foreground font-mono text-[9.5px]")}
                  >
                    {it.n}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <rect
        x="10"
        y={legendY + 8}
        width="14"
        height="14"
        rx="3"
        {...rlz(lastStep, "fill-primary/25")}
      />
      <text x="30" y={legendY + 19} {...rlz(lastStep, LBL)}>
        {t.absence}
      </text>
      <rect
        x="220"
        y={legendY + 8}
        width="14"
        height="14"
        rx="3"
        {...rlz(lastStep, "fill-muted")}
      />
      <text x="240" y={legendY + 19} {...rlz(lastStep, LBL)}>
        {t.pattern}
      </text>
    </svg>
  );
}

/** 04 · El stack como grafo, no como flujo (P60 tanda 2, punto 16): un núcleo
 * que se despliega, con dos piezas que también viajan en el bundle y dos
 * herramientas que solo ayudaron a construirlo y no van en él. La línea
 * distingue lo real —qué se envía— de lo decorativo: sólida para lo que se
 * despliega, discontinua para lo que no. */
export function StackDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Un grafo con un núcleo central, Next 16, TypeScript estricto y Tailwind v4, unido por líneas a cuatro piezas. Con línea sólida, lo que también se envía al navegador: lucide-react para los iconos y shadcn/ui, instalado y casi sin usar. Con línea discontinua, lo que solo ayudó a construir el sitio y no viaja en el bundle: Claude Design en el diseño inicial y Claude Code en el desarrollo.",
      core: { l1: "Next 16 · TypeScript", l2: "estricto · Tailwind v4" },
      nodes: [
        {
          name: "lucide-react",
          role: "iconos",
          shipped: true,
          x: 210,
          y: 15,
        },
        {
          name: "shadcn/ui",
          role: "instalado, sin uso",
          shipped: true,
          x: 210,
          y: 390,
        },
        {
          name: "Claude Design",
          role: "diseño inicial",
          shipped: false,
          x: 10,
          y: 15,
        },
        {
          name: "Claude Code",
          role: "desarrollo",
          shipped: false,
          x: 10,
          y: 390,
        },
      ],
      shippedLabel: "se despliega",
      buildLabel: "solo construcción",
    },
    en: {
      ariaLabel:
        "A graph with a central core, Next 16, strict TypeScript and Tailwind v4, joined by lines to four pieces. With a solid line, what also ships to the browser: lucide-react for icons, and shadcn/ui, installed and barely used. With a dashed line, what only helped build the site and doesn't travel in the bundle: Claude Design for the initial design, Claude Code for development.",
      core: { l1: "Next 16 · TypeScript", l2: "strict · Tailwind v4" },
      nodes: [
        { name: "lucide-react", role: "icons", shipped: true, x: 210, y: 15 },
        {
          name: "shadcn/ui",
          role: "installed, unused",
          shipped: true,
          x: 210,
          y: 390,
        },
        {
          name: "Claude Design",
          role: "initial design",
          shipped: false,
          x: 10,
          y: 15,
        },
        {
          name: "Claude Code",
          role: "development",
          shipped: false,
          x: 10,
          y: 390,
        },
      ],
      shippedLabel: "ships",
      buildLabel: "build only",
    },
  }[lang];
  const CORE = { x: 190, y: 260 };
  const nodes = t.nodes.map((n) => ({ ...n, w: 160, h: 64 }));
  return (
    <svg
      viewBox="0 0 380 520"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[380px]"
    >
      {nodes.map((n) => {
        const cx = n.x + n.w / 2;
        const cy = n.y + n.h / 2;
        return (
          <line
            key={`edge-${n.name}`}
            x1={CORE.x}
            y1={CORE.y}
            x2={cx}
            y2={cy}
            strokeWidth="2"
            strokeDasharray={n.shipped ? undefined : "5 4"}
            {...rlz(1, "stroke-border")}
          />
        );
      })}

      <rect
        x="95"
        y="225"
        width="190"
        height="70"
        rx="8"
        strokeWidth="1.5"
        {...rlz(0, "fill-primary/15 stroke-primary")}
      />
      <foreignObject x="105" y="235" width="170" height="50" {...rlz(0)}>
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="text-foreground m-0 text-[12px] leading-[1.3] font-semibold">
            {t.core.l1}
          </p>
          <p className="text-muted-foreground m-0 text-[11px] leading-[1.3]">
            {t.core.l2}
          </p>
        </div>
      </foreignObject>

      {nodes.map((n) => (
        <g key={n.name}>
          <rect
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx="7"
            strokeWidth={n.shipped ? undefined : 1.5}
            strokeDasharray={n.shipped ? undefined : "4 3"}
            {...rlz(2, n.shipped ? "fill-muted" : "fill-card stroke-border")}
          />
          <foreignObject
            x={n.x + 8}
            y={n.y + 8}
            width={n.w - 16}
            height={n.h - 16}
            {...rlz(3)}
          >
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-foreground m-0 text-[11px] leading-[1.3] font-semibold">
                {n.name}
              </p>
              <p className="text-muted-foreground m-0 text-[10.5px] leading-[1.3]">
                {n.role}
              </p>
            </div>
          </foreignObject>
        </g>
      ))}

      <line
        x1="20"
        y1="470"
        x2="44"
        y2="470"
        strokeWidth="2"
        {...rlz(4, "stroke-border")}
      />
      <text x="52" y="474" {...rlz(4, LBL)}>
        {t.shippedLabel}
      </text>
      <line
        x1="150"
        y1="470"
        x2="174"
        y2="470"
        strokeWidth="2"
        strokeDasharray="5 4"
        {...rlz(4, "stroke-border")}
      />
      <text x="182" y="474" {...rlz(4, LBL)}>
        {t.buildLabel}
      </text>
    </svg>
  );
}

/**
 * 06 · Un hecho, tres longitudes, tres destinos. Elegido con `/prototype`
 * (2026-08-24) entre tres direcciones —abanico radial, regleta comparativa y
 * esta, el flujo con bifurcación tardía—: es la única que enseña QUÉ es cada
 * destino en vez de rotularlo, y el párrafo que tiene al lado ya explica lo
 * que las otras dos ilustraban.
 *
 * LOS RELLENOS DE CIAN NO DELIMITAN NADA, lo hace el borde. Misma regla que el
 * diagrama de los dos lectores: un `fill-primary` translúcido no llega al 3:1
 * que WCAG 1.4.11 pide a un relleno que transmite información, así que la caja
 * del origen se lee por su `stroke-primary` y el velo es solo énfasis.
 *
 * Y LAS BARRITAS DE DENTRO DE CADA ARTEFACTO SON DIBUJO, no información: son
 * texto simulado a escala, del mismo modo que el navegador de mentira del
 * Brand Kit. Por eso van en `fill-muted` sin borde y no se miden.
 */
export function TresLongitudesDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Un flujo vertical. Arriba, una caja con el hecho escrito una sola vez, en español e inglés. De ella baja una línea que se bifurca en tres carriles. Cada carril termina en un artefacto dibujado a escala: una ventana de navegador rotulada «Trayectoria», que recibe la frase; una hoja rotulada «CV en PDF», que recibe el bullet; y una página larga rotulada «Deep-dive», que recibe el caso entero. Al pie, una línea indica que un guardián comprueba que ninguna cifra falte en una de las tres.",
      hecho: "TheTool · cofundador",
      once: "una sola vez · ES + EN",
      web: "Trayectoria",
      webLen: "la frase",
      pdf: "CV en PDF",
      pdfLen: "el bullet",
      deep: "Deep-dive",
      deepLen: "el caso entero",
      guard: "un guardián comprueba que ninguna cifra falte en una de las tres",
    },
    en: {
      ariaLabel:
        "A vertical flow. At the top, a box with the fact written once, in Spanish and English. A line drops from it and splits into three lanes. Each lane ends in an artifact drawn to scale: a browser window labelled “Track record”, which gets the short line; a sheet labelled “CV in PDF”, which gets the bullet; and a long page labelled “Deep-dive”, which gets the whole case. At the foot, a line notes that a guardian checks no figure is missing from any of the three.",
      hecho: "TheTool · co-founder",
      once: "written once · ES + EN",
      web: "Track record",
      webLen: "the short line",
      pdf: "CV in PDF",
      pdfLen: "the bullet",
      deep: "Deep-dive",
      deepLen: "the whole case",
      guard: "a guardian checks no figure is missing from any of the three",
    },
  }[lang];

  /** Las tres barritas de texto simulado de cada artefacto, a su escala. */
  const lineas = (x: number, y: number, anchos: number[], i: number) =>
    anchos.map((w, k) => (
      <rect
        key={k}
        x={x}
        y={y + k * 10}
        width={w}
        height={k === 0 ? 5 : 4}
        rx={k === 0 ? 2.5 : 2}
        {...rlz(i, k === 0 ? "fill-primary" : "fill-muted")}
      />
    ));

  return (
    <svg
      viewBox="0 0 600 300"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[600px]"
    >
      <rect
        x="196"
        y="12"
        width="208"
        height="50"
        rx="8"
        strokeWidth="1.5"
        {...rlz(0, "fill-primary/12 stroke-primary")}
      />
      <text x="300" y="34" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        {t.hecho}
      </text>
      <text
        x="300"
        y="50"
        textAnchor="middle"
        {...rlz(0, "fill-muted-foreground font-mono text-[9px]")}
      >
        {t.once}
      </text>

      <path
        d="M300 62 L300 94 M116 94 L484 94 M116 94 L116 126 M300 94 L300 126 M484 94 L484 126"
        fill="none"
        strokeWidth="1.25"
        {...rlz(1, "stroke-primary")}
      />

      {/* Navegador: la frase corta. */}
      <rect
        x="48"
        y="126"
        width="136"
        height="86"
        rx="7"
        strokeWidth="1"
        {...rlz(2, "fill-card stroke-border")}
      />
      <path
        d="M48 146 L184 146"
        fill="none"
        strokeWidth="1"
        {...rlz(2, "stroke-border")}
      />
      <circle cx="60" cy="136" r="2.5" {...rlz(2, "fill-muted-foreground")} />
      <circle cx="70" cy="136" r="2.5" {...rlz(2, "fill-muted-foreground")} />
      {lineas(60, 160, [86, 112, 96], 2)}
      <text x="116" y="234" textAnchor="middle" {...rlz(2, LBL_STRONG)}>
        {t.web}
      </text>
      <text
        x="116"
        y="250"
        textAnchor="middle"
        {...rlz(2, "fill-muted-foreground font-mono text-[9px]")}
      >
        {t.webLen}
      </text>

      {/* Hoja: el bullet. */}
      <rect
        x="248"
        y="126"
        width="104"
        height="86"
        rx="4"
        strokeWidth="1"
        {...rlz(3, "fill-card stroke-border")}
      />
      {lineas(262, 142, [58, 76, 76], 3)}
      {lineas(262, 180, [64, 70], 3)}
      <text x="300" y="234" textAnchor="middle" {...rlz(3, LBL_STRONG)}>
        {t.pdf}
      </text>
      <text
        x="300"
        y="250"
        textAnchor="middle"
        {...rlz(3, "fill-muted-foreground font-mono text-[9px]")}
      >
        {t.pdfLen}
      </text>

      {/* Página larga: el caso entero. */}
      <rect
        x="416"
        y="126"
        width="136"
        height="86"
        rx="7"
        strokeWidth="1"
        {...rlz(4, "fill-card stroke-border")}
      />
      {lineas(430, 140, [72, 108, 108], 4)}
      {lineas(430, 174, [96, 108, 82], 4)}
      <text x="484" y="234" textAnchor="middle" {...rlz(4, LBL_STRONG)}>
        {t.deep}
      </text>
      <text
        x="484"
        y="250"
        textAnchor="middle"
        {...rlz(4, "fill-muted-foreground font-mono text-[9px]")}
      >
        {t.deepLen}
      </text>

      <path
        d="M48 272 L552 272"
        fill="none"
        strokeWidth="1"
        strokeDasharray="3 3"
        {...rlz(5, "stroke-border")}
      />
      <text
        x="300"
        y="290"
        textAnchor="middle"
        {...rlz(5, "fill-muted-foreground font-mono text-[9px]")}
      >
        {t.guard}
      </text>
    </svg>
  );
}
