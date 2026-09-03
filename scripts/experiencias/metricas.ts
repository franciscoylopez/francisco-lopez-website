/**
 * Las cifras con FORMA DE MÉTRICA: porcentajes y magnitudes con sufijo. No todo
 * número — el bullet largo lleva legítimamente números que el corto no («fase 1»,
 * «empresas de 20 a 150 empleados»), y compararlos todos convertiría el guardián
 * en ruido. Lo que no puede diferir es la MEDICIÓN.
 */
export function metricas(texto: string): string[] {
  const limpio = texto
    .replace(/\*\*/g, "")
    .replace(/[−–—]/g, "-")
    .replace(/(\d)\s+%/g, "$1%");
  const found = limpio.match(/[+-]?\d+(?:[.,]\d+)?\s*(?:%|[MK]\b)/g) ?? [];
  return [...new Set(found.map((m) => m.replace(/\s+/g, "")))].sort();
}
