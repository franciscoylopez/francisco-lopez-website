// Los diagramas propios de «Cómo se ha creado esta página» (P60, D54): SVG
// inline con tokens, no `<img>` — así conmutan con el tema. Site-specific (el
// contenido de cada uno es del artículo), por eso viven en `site/` y no en
// `ui/`, que solo aporta el marco (`DiagramPanel`).
//
// SON CINCO, NO LOS ONCE QUE MARCA CADA `VISUAL ·` DEL BORRADOR. El resto de
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
export function DosVelocidadesDiagram() {
  return (
    <svg
      viewBox="0 0 560 200"
      role="img"
      aria-label="Dos columnas iguales representan el mismo scroll de la página. La columna de la izquierda, marcada «selección, 5-10s», solo cubre el primer tramo, el above the fold. La columna de la derecha, marcada «CPO/VP Product, lectura profunda», cubre la columna entera hasta el final."
      className="h-auto w-full max-w-[420px]"
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
        selección · 5-10s
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
        scroll completo
      </text>
      <text x="420" y="200" textAnchor="middle" className={LBL}>
        CPO / VP Product
      </text>
    </svg>
  );
}

/** 05 · La cascada de construcción: cuatro preguntas en fila, con su destino. */
export function CascadaDiagram() {
  const steps = [
    { q: "¿Existe la pieza?", a: "Se usa" },
    { q: "¿Es del sistema?", a: "Se crea la variante" },
    { q: "¿Estado/foco/portal?", a: "Se trae de shadcn" },
    { q: "¿Nada de lo anterior?", a: "Se decide y se documenta" },
  ];
  return (
    <svg
      viewBox="0 0 700 160"
      role="img"
      aria-label="Cuatro cajas en fila, unidas por flechas: ¿Existe la pieza? → se usa. ¿Es del sistema? → se crea la variante. ¿Es estado, foco o portal? → se trae de shadcn. ¿Nada de lo anterior? → se decide y se documenta."
      className="h-auto w-full max-w-[640px]"
    >
      {steps.map((s, i) => {
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
            {i < steps.length - 1 ? (
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
export function SinConsentimientoDiagram() {
  return (
    <svg
      viewBox="0 0 560 150"
      role="img"
      aria-label="Dos filas. Sin consentimiento y antes del clic en el vídeo, la fila de peticiones de red está vacía. Después del consentimiento y del clic, la fila muestra tres peticiones: analítica, mapa de calor y el vídeo."
      className="h-auto w-full max-w-[440px]"
    >
      <text x="10" y="30" className={LBL}>
        Sin consentimiento · sin clic en el vídeo
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
        (ninguna petición)
      </text>

      <text x="10" y="108" className={LBL}>
        Con consentimiento y clic
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
          analítica
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
          mapa de calor
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
          vídeo
        </text>
      </g>
    </svg>
  );
}

/** 08 · Las cinco capas de verificación, cada una cubriendo más que la
 * anterior — el diagrama validado en el prototipo de P59, con tokens reales. */
export function CapasVerificacionDiagram() {
  const capas = [
    { label: "compilador", w: 150 },
    { label: "escáner automático", w: 240 },
    { label: "censo de contraste", w: 330 },
    { label: "lector de pantalla", w: 448 },
  ];
  return (
    <svg
      viewBox="0 0 560 260"
      role="img"
      aria-label="Cinco barras horizontales de longitud creciente: compilador, escáner automático, censo de contraste, lector de pantalla y persona. Solo la barra de la persona, la más larga, entra en la zona final marcada como «lo que ninguna regla prohíbe»."
      className="h-auto w-full max-w-[520px]"
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
      {capas.map((c, i) => (
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
        persona
      </text>
      <rect
        x="130"
        y="178"
        width="420"
        height="24"
        rx="4"
        className="fill-foreground"
      />
      <text x="380" y="238" textAnchor="middle" className={LBL}>
        lo que cubre una regla escrita
      </text>
      <text x="508" y="238" textAnchor="middle" className={LBL}>
        lo que ninguna regla prohíbe
      </text>
    </svg>
  );
}

/** 09 · Los quince pasos de CI en fila, marcando cuáles buscan ausencia. */
export function CIDiagram() {
  const pasos = 15;
  const buscanAusencia = 11;
  return (
    <svg
      viewBox="0 0 620 90"
      role="img"
      aria-label="Quince cuadrados en fila representan los pasos de integración continua. Once, la mayoría, están marcados como «buscan ausencia»; los cuatro restantes, como «buscan patrón»."
      className="h-auto w-full max-w-[560px]"
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
        busca ausencia ({buscanAusencia})
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
        busca patrón ({pasos - buscanAusencia})
      </text>
    </svg>
  );
}
