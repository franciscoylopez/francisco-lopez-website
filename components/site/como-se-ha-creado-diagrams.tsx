import type { Locale } from "@/lib/i18n/config";

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
        className="fill-muted"
      />
      <rect
        x="60"
        y="20"
        width="160"
        height="42"
        rx="6"
        className="fill-primary/70"
      />
      <text x="140" y="45" textAnchor="middle" className={LBL_STRONG}>
        above the fold
      </text>
      <text x="140" y="200" textAnchor="middle" className={LBL}>
        {t.scan}
      </text>

      <rect
        x="340"
        y="20"
        width="160"
        height="160"
        rx="6"
        className="fill-muted"
      />
      <rect
        x="340"
        y="20"
        width="160"
        height="42"
        rx="6"
        className="fill-primary/70"
      />
      <rect
        x="340"
        y="66"
        width="160"
        height="114"
        rx="4"
        className="fill-brand-purple-soft"
      />
      <text x="420" y="45" textAnchor="middle" className={LBL_STRONG}>
        above the fold
      </text>
      <text x="420" y="125" textAnchor="middle" className={LBL_STRONG}>
        {t.deep}
      </text>
      <text x="420" y="200" textAnchor="middle" className={LBL}>
        {t.deepReader}
      </text>
    </svg>
  );
}

/** 05 · La cascada de construcción: cuatro preguntas en fila, con su destino. */
export function CascadaDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Cuatro cajas en fila, unidas por flechas: ¿Existe la pieza? → se usa. ¿Es del sistema? → se crea la variante. ¿Es estado, foco o portal? → se trae de shadcn. ¿Nada de lo anterior? → se decide y se documenta.",
      steps: [
        { q: "¿Existe la pieza?", a: "Se usa" },
        { q: "¿Es del sistema?", a: "Se crea la variante" },
        { q: "¿Estado/foco/portal?", a: "Se trae de shadcn" },
        { q: "¿Nada de lo anterior?", a: "Se decide y se documenta" },
      ],
    },
    en: {
      ariaLabel:
        "Four boxes in a row, joined by arrows: Does the piece exist? → use it. Does it belong to the system? → create the variant. Is it state, focus or a portal? → pull it from shadcn. None of the above? → decide and document it.",
      steps: [
        { q: "Does it exist?", a: "Use it" },
        { q: "Is it the system's?", a: "Create the variant" },
        { q: "State/focus/portal?", a: "Pull it from shadcn" },
        { q: "None of the above?", a: "Decide and document" },
      ],
    },
  }[lang];
  return (
    <svg
      viewBox="0 0 700 160"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[640px]"
    >
      {t.steps.map((s, i) => {
        const x = 10 + i * 172;
        return (
          <g key={s.q}>
            <rect
              x={x}
              y="16"
              width="152"
              height="128"
              rx="6"
              className="fill-muted"
            />
            <text x={x + 76} y="46" textAnchor="middle" className={LBL}>
              {i + 1}
            </text>
            <foreignObject x={x + 10} y="54" width="132" height="80">
              <div className="flex h-full flex-col justify-between text-center">
                <p className="text-foreground m-0 text-[11px] leading-[1.3] font-medium">
                  {s.q}
                </p>
                <p className="text-primary m-0 text-[11px] leading-[1.3] font-semibold">
                  {s.a}
                </p>
              </div>
            </foreignObject>
            {i < t.steps.length - 1 ? (
              <path
                d={`M${x + 156} 80 L${x + 168} 80`}
                className="stroke-border"
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
            ) : null}
          </g>
        );
      })}
      <defs>
        <marker
          id="arrow"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto"
        >
          <path d="M0 0 L8 4 L0 8 Z" className="fill-border" />
        </marker>
      </defs>
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
      <text x="10" y="30" className={LBL}>
        {t.before}
      </text>
      <rect
        x="10"
        y="42"
        width="540"
        height="34"
        rx="6"
        className="fill-muted"
        strokeDasharray="4 4"
      />
      <text x="280" y="64" textAnchor="middle" className={LBL}>
        {t.empty}
      </text>

      <text x="10" y="108" className={LBL}>
        {t.after}
      </text>
      <g>
        <rect
          x="10"
          y="118"
          width="170"
          height="28"
          rx="5"
          className="fill-primary/25"
        />
        <text x="95" y="136" textAnchor="middle" className={LBL_STRONG}>
          {t.analytics}
        </text>
        <rect
          x="195"
          y="118"
          width="170"
          height="28"
          rx="5"
          className="fill-primary/25"
        />
        <text x="280" y="136" textAnchor="middle" className={LBL_STRONG}>
          {t.heatmap}
        </text>
        <rect
          x="380"
          y="118"
          width="170"
          height="28"
          rx="5"
          className="fill-primary/25"
        />
        <text x="465" y="136" textAnchor="middle" className={LBL_STRONG}>
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
        className="stroke-border"
        strokeDasharray="3 3"
      />
      <line
        x1="466"
        y1="10"
        x2="466"
        y2="220"
        className="stroke-border"
        strokeDasharray="3 3"
      />
      <rect
        x="466"
        y="10"
        width="84"
        height="210"
        rx="4"
        className="fill-brand-purple-soft/50 stroke-brand-purple"
        strokeDasharray="4 3"
      />
      {t.capas.map((c, i) => (
        <g key={c.label}>
          <text x="118" y={10 + i * 42 + 26} textAnchor="end" className={LBL}>
            {c.label}
          </text>
          <rect
            x="130"
            y={10 + i * 42 + 8}
            width={c.w}
            height="24"
            rx="4"
            className="fill-muted"
          />
        </g>
      ))}
      <text x="118" y="196" textAnchor="end" className={LBL}>
        {t.persona}
      </text>
      <rect
        x="130"
        y="178"
        width="420"
        height="24"
        rx="4"
        className="fill-foreground"
      />
      {/* Las dos etiquetas de cierre, en DOS líneas y separadas por el ancho
          de las zonas que describen (0-466 y 466-550): a una sola línea
          colisionaban a mitad de camino (11 caracteres de margen, con texto
          de 27-28). */}
      <text x="230" y="250" textAnchor="middle" className={LBL}>
        <tspan x="230" dy="0">
          {t.coveredLine1}
        </tspan>
        <tspan x="230" dy="16">
          {t.coveredLine2}
        </tspan>
      </text>
      <text x="560" y="250" textAnchor="middle" className={LBL}>
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

/** 09 · Los quince pasos de CI en fila, marcando cuáles buscan ausencia. */
export function CIDiagram({ lang }: { lang: Locale }) {
  const pasos = 15;
  const buscanAusencia = 11;
  const t = {
    es: {
      ariaLabel:
        "Quince cuadrados en fila representan los pasos de integración continua. Once, la mayoría, están marcados como «buscan ausencia»; los cuatro restantes, como «buscan patrón».",
      absence: `busca ausencia (${buscanAusencia})`,
      pattern: `busca patrón (${pasos - buscanAusencia})`,
    },
    en: {
      ariaLabel:
        "Fifteen squares in a row represent the steps of continuous integration. Eleven, most of them, are marked as “looks for absence”; the remaining four, as “looks for a pattern”.",
      absence: `looks for absence (${buscanAusencia})`,
      pattern: `looks for a pattern (${pasos - buscanAusencia})`,
    },
  }[lang];
  return (
    <svg
      viewBox="0 0 620 90"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[620px]"
    >
      {Array.from({ length: pasos }, (_, i) => (
        <rect
          key={i}
          x={10 + i * 40}
          y="10"
          width="32"
          height="32"
          rx="5"
          className={i < buscanAusencia ? "fill-primary/30" : "fill-muted"}
        />
      ))}
      <rect
        x="10"
        y="60"
        width="14"
        height="14"
        rx="3"
        className="fill-primary/30"
      />
      <text x="30" y="71" className={LBL}>
        {t.absence}
      </text>
      <rect
        x="220"
        y="60"
        width="14"
        height="14"
        rx="3"
        className="fill-muted"
      />
      <text x="240" y="71" className={LBL}>
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
            className="stroke-border"
            strokeWidth="2"
            strokeDasharray={n.shipped ? undefined : "5 4"}
          />
        );
      })}

      <rect
        x="95"
        y="225"
        width="190"
        height="70"
        rx="8"
        className="fill-primary/15 stroke-primary"
        strokeWidth="1.5"
      />
      <foreignObject x="105" y="235" width="170" height="50">
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
            className={n.shipped ? "fill-muted" : "fill-card stroke-border"}
            strokeWidth={n.shipped ? undefined : 1.5}
            strokeDasharray={n.shipped ? undefined : "4 3"}
          />
          <foreignObject
            x={n.x + 8}
            y={n.y + 8}
            width={n.w - 16}
            height={n.h - 16}
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
        className="stroke-border"
        strokeWidth="2"
      />
      <text x="52" y="474" className={LBL}>
        {t.shippedLabel}
      </text>
      <line
        x1="150"
        y1="470"
        x2="174"
        y2="470"
        className="stroke-border"
        strokeWidth="2"
        strokeDasharray="5 4"
      />
      <text x="182" y="474" className={LBL}>
        {t.buildLabel}
      </text>
    </svg>
  );
}
