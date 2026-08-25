import type { Locale } from "@/lib/i18n/config";

import { DosLienzos, LBL, LBL_STRONG, rlz } from "./shared";

/**
 * Los nueve puntos del checklist, cada uno asignado a la capa que lo pone y a
 * quién lo verifica. Abre la sección 03 de `/accesibilidad` (P70.101), que es la
 * única de las siete que no tenía apoyo visual.
 *
 * ELEGIDO CON `/prototype` ENTRE TRES DIRECCIONES, y la comparación no fue de
 * gusto: «Bandas» contaba la proporción (cuatro, uno, cuatro) de un vistazo pero
 * no podía decir quién comprueba, y «Descenso» dibujaba la dirección con dos
 * flechas que a esta escala decoran más de lo que informan. La tabla es la única
 * que sostiene la segunda dimensión, que es lo que convierte la sección en
 * criterio en vez de en declaración: **ocho de los nueve los comprueba una
 * máquina y uno una persona**.
 *
 * EL REPARTO SE MIDIÓ CONTRA EL CÓDIGO, no contra el recuerdo. La página afirmaba
 * que el armazón pone también la miga de pan y la jerarquía de títulos, y no es
 * cierto: `<Breadcrumb>` se pinta en los ocho componentes de página, uno por uno.
 * De ahí el 4 / 1 / 4 de aquí abajo, y de ahí que la columna «lo comprueba» diga
 * `CI` en esas dos: lo que la página escribe es justo lo que un gate verifica.
 *
 * ES UN DIBUJO, ASÍ QUE SUS COORDENADAS SON PX Y NO TOKENS (`CLAUDE.md`, la
 * excepción de las ilustraciones). Lo que sí sale de la capa es el color y el
 * rótulo: `LBL`/`LBL_STRONG` y las utilidades de `fill`.
 */
export function HerenciaDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Tabla de nueve filas, una por punto del checklist de accesibilidad. Tres columnas marcan qué capa pone cada punto: la pieza pone cuatro (contraste, foco visible, área de pulsación y movimiento reducido), el marco de página uno (la vía de escape del teclado) y la página cuatro (estructura y orden, ubicación, nunca solo el color y alternativas textuales). Una cuarta columna dice quién lo verifica: ocho por máquina y uno, nunca solo el color, a mano.",
      col: { punto: "punto", quien: "lo comprueba" },
      capas: [
        {
          nombre: "La pieza",
          quien: "se hereda",
          puntos: [
            "Contraste medido",
            "Foco visible",
            "Área de pulsación 44×44",
            "Movimiento reducido",
          ],
        },
        {
          nombre: "El marco",
          quien: "CI",
          puntos: ["Vía de escape del teclado"],
        },
        {
          nombre: "La página",
          quien: "CI",
          puntos: [
            "Estructura y orden",
            "Ubicación (miga de pan)",
            "Nunca solo el color",
            "Alternativas textuales",
          ],
        },
      ],
      /** El único de los nueve que comprueba una persona. */
      aMano: "Nunca solo el color",
      quienMano: "a mano",
      cuenta: ["cuatro", "uno", "cuatro"],
    },
    en: {
      ariaLabel:
        "A nine row table, one per accessibility checklist point. Three columns mark which layer puts each point: the component puts four (contrast, focus ring, tap area and reduced motion), the page shell one (a keyboard way out) and the page four (structure and order, breadcrumb, never colour alone and text alternatives). A fourth column says who verifies it: eight by machine and one, never colour alone, by hand.",
      col: { punto: "point", quien: "checked by" },
      capas: [
        {
          nombre: "The component",
          quien: "inherited",
          puntos: [
            "Contrast measured",
            "Focus ring",
            "Tap area 44×44",
            "Reduced motion",
          ],
        },
        {
          nombre: "The shell",
          quien: "CI",
          puntos: ["A keyboard way out"],
        },
        {
          nombre: "The page",
          quien: "CI",
          puntos: [
            "Structure and order",
            "Breadcrumb",
            "Never colour alone",
            "Text alternatives",
          ],
        },
      ],
      aMano: "Never colour alone",
      quienMano: "by hand",
      cuenta: ["four", "one", "four"],
    },
  }[lang];

  /** Los nueve puntos aplanados, con su capa y quién los comprueba. */
  const filas = t.capas.flatMap((capa, ci) =>
    capa.puntos.map((punto) => ({
      punto,
      ci,
      quien: punto === t.aMano ? t.quienMano : capa.quien,
    })),
  );

  /* ── LIENZO ANCHO (620) ──────────────────────────────────────────────────
     Una fila por punto, tres columnas de capa con un punto grueso en la que lo
     pone, y la columna de quién lo verifica. El canalón de la izquierda son 196
     unidades: la etiqueta más larga («Área de pulsación 44×44») pide 152. */
  const COL = [232, 306, 380];
  const Y0 = 52;
  const PASO = 25;
  const ancho = (
    <svg
      viewBox="0 0 620 262"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[620px]"
    >
      <text x="196" y="30" textAnchor="end" {...rlz(0, LBL)}>
        {t.col.punto}
      </text>
      {t.capas.map((capa, i) => (
        <text
          key={capa.nombre}
          x={COL[i]}
          y="30"
          textAnchor="middle"
          {...rlz(i, LBL)}
        >
          {capa.nombre}
        </text>
      ))}
      <text x="424" y="30" {...rlz(3, LBL)}>
        {t.col.quien}
      </text>
      <line x1="10" y1="38" x2="610" y2="38" {...rlz(0, "stroke-border")} />

      {filas.map((fila, i) => {
        const y = Y0 + i * PASO;
        return (
          <g key={fila.punto}>
            <g {...rlz(i + 1)}>
              <text x="196" y={y} textAnchor="end" className={LBL_STRONG}>
                {fila.punto}
              </text>
              {COL.map((cx, ci) =>
                ci === fila.ci ? (
                  <circle
                    key={ci}
                    cx={cx}
                    cy={y - 4}
                    r="5.5"
                    className="fill-primary"
                  />
                ) : (
                  <circle
                    key={ci}
                    cx={cx}
                    cy={y - 4}
                    r="2"
                    className="fill-border"
                  />
                ),
              )}
              <text x="424" y={y} className={LBL}>
                {fila.quien}
              </text>
              {/* El único a mano lleva ADEMÁS un corchete: la distinción no
                  puede depender solo de que el texto diga otra cosa (punto 6
                  del propio checklist que este diagrama enumera). */}
              {fila.quien === t.quienMano ? (
                <path
                  d={`M416 ${y - 11} l-5 0 0 15 5 0`}
                  strokeWidth="1.5"
                  className="stroke-primary fill-none"
                />
              ) : null}
            </g>
            {/* Filete entre grupos de capa: separa 4 / 1 / 4 sin escribirlo. */}
            {i === 3 || i === 4 ? (
              <line
                x1="10"
                y1={y + 7}
                x2="610"
                y2={y + 7}
                strokeDasharray="3 3"
                {...rlz(i + 1, "stroke-border")}
              />
            ) : null}
          </g>
        );
      })}
    </svg>
  );

  /* ── LIENZO ESTRECHO (280) ───────────────────────────────────────────────
     El canalón de tres columnas no cabe, así que los mismos nueve puntos van
     AGRUPADOS por capa, con su cuenta en el encabezado y el verificador en la
     MISMA línea, alineado a la derecha: a 11px monoespaciados la etiqueta más
     larga pide 152 unidades y «se hereda» 60, así que los 280 dan de sobra. En
     el prototipo el verificador caía en una segunda línea y solo aflojaba el
     bloque. Las barras del diagrama no afirman proporción aquí; lo que se
     conserva es el reparto, que es lo único que este dibujo dice. */
  /* Se pliega en vez de acumular en variables sueltas: el compilador de React
     rechaza reasignar en el cuerpo del componente, y aquí no hacía falta —cada
     grupo solo necesita saber dónde acabó el anterior—. La cuenta del barrido
     (`i`) va en el mismo pliegue porque es el mismo orden narrativo. */
  const grupos = t.capas.reduce<
    {
      capa: (typeof t.capas)[number];
      ci: number;
      cabecera: number;
      i: number;
      rows: { punto: string; quien: string; y: number; i: number }[];
    }[]
  >((acc, capa, ci) => {
    const prev = acc[acc.length - 1];
    const cabecera = prev
      ? prev.cabecera + 24 + (prev.capa.puntos.length - 1) * 22 + 26
      : 18;
    const i = prev ? prev.i + 1 + prev.capa.puntos.length : 0;
    return [
      ...acc,
      {
        capa,
        ci,
        cabecera,
        i,
        rows: capa.puntos.map((punto, j) => ({
          punto,
          quien: punto === t.aMano ? t.quienMano : capa.quien,
          y: cabecera + 24 + j * 22,
          i: i + 1 + j,
        })),
      },
    ];
  }, []);
  /** La última línea escrita más el margen inferior. Se saca del máximo y no
      del último grupo: indexar el final obliga a una guarda que no dice nada. */
  const altoEstrecho =
    grupos.reduce(
      (max, g) =>
        Math.max(max, g.cabecera + 24 + (g.capa.puntos.length - 1) * 22),
      0,
    ) + 12;

  const estrecho = (
    <svg
      viewBox={`0 0 280 ${altoEstrecho}`}
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[300px]"
    >
      {grupos.map(({ capa, ci, cabecera, rows, i }) => (
        <g key={capa.nombre}>
          <text x="10" y={cabecera} {...rlz(i, LBL_STRONG)}>
            {`${capa.nombre} · ${t.cuenta[ci]}`}
          </text>
          <line
            x1="10"
            y1={cabecera + 6}
            x2="270"
            y2={cabecera + 6}
            {...rlz(i, "stroke-border")}
          />
          {rows.map((r) => (
            <g key={r.punto} {...rlz(r.i)}>
              <circle cx="16" cy={r.y - 4} r="4" className="fill-primary" />
              <text x="28" y={r.y} className={LBL_STRONG}>
                {r.punto}
              </text>
              <text x="270" y={r.y} textAnchor="end" className={LBL}>
                {r.quien}
              </text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );

  /* El umbral es el `viewBox` del lienzo ancho más 10 (P68.59): por debajo de
     630px de contenido, un dibujo de 620 unidades ya no pinta su rótulo a 11px. */
  return <DosLienzos umbral={630} ancho={ancho} estrecho={estrecho} />;
}
