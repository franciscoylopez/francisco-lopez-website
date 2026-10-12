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
// (el cálculo, en globals.css).
//
// EL ATENUADO LO HEREDA, NO LO ELIGE (2026-09-04, design-review). Los dos textos
// apagados mezclaban a mano un `color-mix(--background 80%, transparent)`, con su
// 80% razonado y medido; y aun así era la respuesta a la pregunta equivocada. La
// banda declara `data-surface="inverted"` y los dos escriben
// `text-muted-foreground`, que es la regla de D39: no se elige el atenuado de un
// texto, lo resuelve la superficie.
//
// Y NO ERA SOLO CONSISTENCIA: el sitio ya PUBLICABA esta cifra. `design-values.ts`
// declara `mutedOnInverted: { light: 10,32, dark: 9,89 }` —la fórmula de la capa,
// 85% hacia el fondo—, mientras esta banda pintaba 9,24 y 8,31 con su mezcla
// propia. Las dos pasaban AAA, así que ningún gate lo veía; lo que fallaba es que
// la página de Accesibilidad publicaba un número que esta banda no pintaba.
// Medido tras el cambio sobre el píxel compuesto, con el metro validado contra el
// ancla opaca (13,79 / 15,32) y contra una de alfa (negro al 50% sobre blanco =
// 4,00): 10,32 en claro y 9,89 en oscuro. Exactamente lo publicado.
//
// Un solo nivel de atenuado para los dos textos: la jerarquía la hace el tamaño,
// no el color (misma regla que la franja de contacto, D30).
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
      // DECLARA SU SUPERFICIE (2026-09-04, design-review). `.bg-foreground` no
      // enciende la familia invertida: el único selector que lo hace es
      // `[data-surface="inverted"]`. Sin esto la banda era correcta por
      // CALIBRACIÓN —sus dos apagados mezclaban un 80% a mano— y no por herencia,
      // así que el primer `text-muted-foreground` que cayera dentro se habría
      // llevado el atenuado de `--background` sobre un fondo `--foreground`, que
      // es el fallo de D30. Su banda hermana de `/como-se-ha-creado` ya lo
      // declaraba; eran dos bandas iguales resueltas de dos maneras.
      data-surface="inverted"
      className="bg-foreground text-background py-[clamp(5rem,11vw,9.5rem)]"
    >
      <div className={WRAP}>
        <p
          data-reveal
          className="text-muted-foreground m-0 mb-[clamp(1.75rem,4vw,3rem)] text-[0.8125rem] font-semibold tracking-[0.11em] uppercase"
        >
          {dict.eyebrow}
        </p>
        <p
          data-reveal
          className="font-display m-0 max-w-[20ch] text-[clamp(1.9rem,4.6vw,3.75rem)] leading-[1.12] font-semibold tracking-[-0.022em]"
        >
          {dict.line1a}
          <span className="whitespace-nowrap">
            <span className="text-brand-purple-accent">{dict.exitWord}</span>
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
          className="text-muted-foreground font-display m-0 text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.45] font-normal tracking-[0.01em] text-balance"
        >
          {dict.line2}
        </p>
      </div>
    </section>
  );
}
