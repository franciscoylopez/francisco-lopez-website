import type { Locale } from "@/lib/i18n/config";

import { DosLienzos, LBL, LBL_STRONG, rlz } from "../diagrams/shared";

/** 07 · Qué sale de la página antes de un clic: nada, hasta que alguien pulsa. */
export function SinConsentimientoDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Dos filas. Sin consentimiento y antes del clic en el vídeo, la fila de peticiones de red está vacía. Después del consentimiento y del clic, la fila muestra tres peticiones: analítica, mapa de calor y el vídeo.",
      before: "Sin consentimiento · sin clic en el vídeo",
      beforeWrap: ["Sin consentimiento ·", "sin clic en el vídeo"],
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
      beforeWrap: ["No consent ·", "no click on the video"],
      empty: "(no requests)",
      after: "With consent and a click",
      analytics: "analytics",
      heatmap: "heatmap",
      video: "video",
    },
  }[lang];

  const ancho = (
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

  /** Las mismas dos filas, con las tres peticiones apiladas en vez de en
   * hilera: lo que el diagrama compara es «fila vacía» contra «fila con
   * cosas», y eso se lee igual de bien en columna. El rótulo de la primera
   * fila se parte en dos porque a 11 unidades ocupa 271 de las 280. */
  const estrecho = (
    <svg
      viewBox="0 0 280 240"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[300px]"
    >
      <text x="10" y="22" {...rlz(0, LBL)}>
        {t.beforeWrap.map((linea, k) => (
          <tspan key={linea} x="10" dy={k === 0 ? 0 : 16}>
            {linea}
          </tspan>
        ))}
      </text>
      <rect
        x="10"
        y="48"
        width="260"
        height="34"
        rx="6"
        strokeDasharray="4 4"
        {...rlz(0, "fill-muted")}
      />
      <text x="140" y="70" textAnchor="middle" {...rlz(0, LBL)}>
        {t.empty}
      </text>

      <text x="10" y="114" {...rlz(1, LBL)}>
        {t.after}
      </text>
      <g>
        <rect
          x="10"
          y="126"
          width="260"
          height="30"
          rx="5"
          {...rlz(2, "fill-primary/25")}
        />
        <text x="140" y="146" textAnchor="middle" {...rlz(2, LBL_STRONG)}>
          {t.analytics}
        </text>
        <rect
          x="10"
          y="162"
          width="260"
          height="30"
          rx="5"
          {...rlz(3, "fill-primary/25")}
        />
        <text x="140" y="182" textAnchor="middle" {...rlz(3, LBL_STRONG)}>
          {t.heatmap}
        </text>
        <rect
          x="10"
          y="198"
          width="260"
          height="30"
          rx="5"
          {...rlz(4, "fill-primary/25")}
        />
        <text x="140" y="218" textAnchor="middle" {...rlz(4, LBL_STRONG)}>
          {t.video}
        </text>
      </g>
    </svg>
  );

  return <DosLienzos umbral={570} ancho={ancho} estrecho={estrecho} />;
}
