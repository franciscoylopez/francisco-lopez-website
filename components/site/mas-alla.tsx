import { WRAP } from "@/components/ui/layout";

export type MasAllaDict = {
  eyebrow: string;
  line1a: string;
  exitWord: string;
  line1b: string;
  line2: string;
};

// Más allá del PM (PRD §8.3). Banda de manifiesto con fondo invertido (bg =
// foreground, texto = background), simétrica en ambos temas. "Exit" y el divisor
// usan --brand-purple-accent, que desde P37.657 CONMUTA con el tema y da 7,04
// claro / 7,21 oscuro — AAA de texto normal. Antes era un color fijo y se quedaba
// en 3,96/3,49: el fondo de esta banda es --foreground, o sea que salta de carbón
// a hueso, y ningún color fijo puede pasar de 3,71:1 contra las dos superficies
// (el cálculo, en globals.css). Los textos apagados se mezclan en sRGB para no
// perder el tono (ver Nav).
//
// EL 80% NO ES ARBITRARIO. El eyebrow estaba al 58% y en tema OSCURO daba 4,07:1
// (axe lo cazaba: AA pide 4,5 a 13px) — el fondo efectivo de la banda es
// `--foreground`, que cambia de luminosidad con el tema mientras la mezcla se
// quedaba fija. El umbral AAA está en el 75%, pero ahí quedaba en 7,05:1: el
// mismo margen de nada que ya tumbó al cian viejo (BRAND.md, 2026-07-22). Al 80%
// da 9,32:1 en claro y 8,34:1 en oscuro. Un solo nivel de atenuado para los dos
// textos: la jerarquía la hace el tamaño, no el color (misma regla que la franja
// de contacto, D30).
export function MasAlla({ dict }: { dict: MasAllaDict }) {
  // Mantener el acento y su cláusula corta ("Exit once." / "Exit una vez.")
  // como una unidad que no rompe: si no, el color queda colgando al final de
  // una línea y la palabra siguiente cae sola en la de abajo. Se corta en el
  // primer punto de line1b; el resto de la frase fluye con normalidad.
  const dot = dict.line1b.indexOf(".");
  const clause = dot === -1 ? dict.line1b : dict.line1b.slice(0, dot + 1);
  const rest = dot === -1 ? "" : dict.line1b.slice(dot + 1);
  return (
    <section
      id="mas-alla"
      className="bg-foreground text-background py-[clamp(5rem,11vw,9.5rem)]"
    >
      <div className={WRAP}>
        <p
          data-reveal
          className="m-0 mb-[clamp(1.75rem,4vw,3rem)] text-[0.8125rem] font-semibold tracking-[0.11em] uppercase"
          style={{
            color: "color-mix(in srgb, var(--background) 80%, transparent)",
          }}
        >
          {dict.eyebrow}
        </p>
        <p
          data-reveal
          className="font-display m-0 max-w-[20ch] text-[clamp(1.9rem,4.6vw,3.75rem)] leading-[1.12] font-semibold tracking-[-0.022em]"
        >
          {dict.line1a}
          <span className="whitespace-nowrap">
            <span style={{ color: "var(--brand-purple-accent)" }}>
              {dict.exitWord}
            </span>
            {clause}
          </span>
          {rest}
        </p>
        {/* El filete sale de `.band-rule` desde P68.7117: la banda que abre un
            bloque de secciones lleva el mismo, y eran los mismos tres valores
            escritos dos veces. El MARGEN se queda aquí, que es lo que separa el
            ritmo de este manifiesto del de aquella banda. */}
        <div
          data-reveal
          aria-hidden="true"
          className="band-rule my-[clamp(1.75rem,3.5vw,2.75rem)]"
        />
        {/* `text-balance` SE QUEDA, y es una de las tres del sitio que no son
            redundantes (P50.90): la capa da `pretty` a un `<p>`, y esto es un
            párrafo que SE LEE COMO TITULAR. Es información que la etiqueta no
            puede llevar, así que aquí la utilidad no repite a la capa: la
            contradice a propósito. */}
        <p
          data-reveal
          className="font-display m-0 text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.45] font-normal tracking-[0.01em] text-balance"
          style={{
            color: "color-mix(in srgb, var(--background) 80%, transparent)",
          }}
        >
          {dict.line2}
        </p>
      </div>
    </section>
  );
}
