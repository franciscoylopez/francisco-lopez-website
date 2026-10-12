/**
 * El recuento de lo que NO entra en el markdown, y su línea de informe.
 *
 * MEDIDO Y NO CONVERTIDO, CON SU CIFRA: un alcance recortado en silencio se lee
 * como cobertura, que es la misma doctrina de `check:marcas`. El conversor decide
 * qué omite y por qué (`contrato.ts`); esto solo cuenta lo que decidió, para que
 * la corrida lo pueda declarar en voz alta.
 */
import { type Omitido } from "./contrato";

const cuenta = new Map<string, number>();

/** Apunta lo que una variante ha dejado fuera. */
export function anota(lista: Omitido[]): void {
  for (const o of lista) {
    const clave = `${o.familia}:${o.etiqueta}`;
    cuenta.set(clave, (cuenta.get(clave) ?? 0) + 1);
  }
}

/** La línea del informe, o `null` si no se ha omitido nada en toda la pasada. */
export function porFamilia(): string | null {
  if (cuenta.size === 0) return null;
  const familias = new Map<string, number>();
  for (const [clave, n] of cuenta) {
    const familia = clave.split(":")[0]!;
    familias.set(familia, (familias.get(familia) ?? 0) + n);
  }
  return (
    "  · fuera del markdown: " +
    [...familias]
      .sort()
      .map(([f, n]) => `${n} ${f}`)
      .join(" · ") +
    " (ilustraciones, controles y lo marcado `aria-hidden`; su etiqueta de texto sí entra)"
  );
}
