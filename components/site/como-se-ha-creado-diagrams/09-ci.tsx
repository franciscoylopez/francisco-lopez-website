import {
  type CategoriaPaso,
  DIAGRAMA_CI,
  pasosDibujados,
} from "@/content/articulo/ci-steps";
import { cardinal } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { rlz } from "../diagrams/shared";

/** 09 · Los pasos de CI, agrupados por rol (D79, prototipo de Tanda 3
 * · «Agrupado por rol», elegida sobre las otras dos que se compararon):
 * sustituye a los quince cuadraditos anónimos Y al dato en vivo «Quince
 * pasos en cada PR» —eran DOS piezas compitiendo por el mismo hueco (P60
 * tanda 3-bis, punto 11)— por una única figura con los PASOS REALES del
 * workflow, en su orden real (un único job de GitHub Actions: se ejecutan
 * uno detrás de otro, nunca en paralelo). Busca-patrón / busca-ausencia sale
 * del propio texto de la sección, no de una etiqueta inventada: los que
 * buscan un patrón conocido son las herramientas de fábrica (Format,
 * Typecheck, Lint, Build); los que buscan la ausencia de algo bueno son los
 * guardianes propios de este repositorio.
 *
 * POR QUÉ «Tests» CUENTA COMO BUSCA-PATRÓN (2026-08-24, P68.494). Un test
 * falla cuando un caso ESCRITO deja de comportarse como debe; no sabe decir
 * qué lógica no cubre nadie, y esa es justo la propiedad que define a la otra
 * familia. Ponerlo con los guardianes haría falsa la frase de la sección.
 *
 * Y EL RECUENTO NO SE ESCRIBE (P68.495). Fue quince, luego dieciséis y ahora
 * diecisiete, tecleado cada vez en el texto alternativo, en las dos cifras de la
 * leyenda y en el pie del diccionario. Ahora sale de `.github/workflows/ci.yml`
 * y de contar las propias pastillas, y `check:articulo` comprueba que las dos
 * cuentas coincidan.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ESTE NO ES UN SVG, Y ES LA ÚNICA EXCEPCIÓN DE LOS OCHO (P68.56, 2026-08-24).
 *
 * Lo era, y fallaba en dos ejes a la vez. En escritorio, la fila «Guardianes del
 * repo» sumaba 809 unidades dentro de un lienzo de 760 y **se recortaba 49px**
 * —43 en EN—, en silencio: un SVG que desborda su `viewBox` recorta por dentro,
 * así que no produce scroll horizontal y el eje que mira `viewport-verifier` no
 * podía verlo. Y en móvil, como el lienzo se escala entero para caber, el rótulo
 * se pintaba a **3,8px a 360×800** (medido: escala 0,38 sobre `text-[9.5px]`).
 *
 * La respuesta no es un lienzo más ancho —eso arregla escritorio y EMPEORA
 * móvil, porque baja la escala— sino dejar de dibujar: diecisiete pastillas y
 * cuatro rótulos no tienen ni una línea ni una flecha, así que nunca fueron un
 * dibujo. Son una lista con dos familias. Como HTML refluye sola a cualquier
 * ancho, el texto no se escala nunca (12px de 872 a 318) y no hay lienzo del que
 * salirse.
 *
 * Los otros siete SÍ son dibujos —nodos, líneas, marcos a escala— y se quedan
 * como están. Lo que este archivo NO puede hacer es volverse el patrón: si el
 * noveno diagrama es otra lista, es que le pasa lo mismo, no que los SVG estén
 * mal.
 *
 * EL TEXTO ALTERNATIVO NO CAMBIA, a propósito. `aria-label` sigue siendo el
 * mismo de siempre sobre `role="img"`, y la lista visual va `aria-hidden`: lo
 * que se estaba arreglando es lo que ve quien mira, no lo que oye un lector de
 * pantalla, y un cambio de markup no es sitio para reescribir de rebote la
 * alternativa que ya estaba bien.
 *
 * Y LA MARCA DE FAMILIA ES UNA FORMA, no solo el tinte: cuadrado macizo para
 * «busca ausencia», hueco para «busca patrón», el mismo en las pastillas y en la
 * leyenda. El punto 6 del checklist —nada codificado solo por color— no lo
 * cumplía la versión anterior, que separaba las dos familias por relleno y lo
 * explicaba con una leyenda también de colores. */
export function CIDiagram({ lang }: { lang: Locale }) {
  // LOS PASOS VIENEN DE `content/articulo/ci-steps.ts` Y EL RECUENTO DEL
  // WORKFLOW (P68.495). Aquí no se escribe ninguna cifra: ni la del texto
  // alternativo, ni las dos de la leyenda. Las tres estaban tecleadas, y las
  // tres decían quince cuando ya eran dieciséis. `check:articulo` compara
  // además cuántas pastillas dibuja esto contra cuántos pasos tiene `ci.yml`.
  const t = DIAGRAMA_CI[lang];
  const cuenta = (cat: CategoriaPaso) =>
    t.groups.reduce(
      (n, g) => n + g.items.filter((it) => it.cat === cat).length,
      0,
    );
  const ariaLabel = t.ariaLabel.replace(
    "{pasos}",
    cardinal(pasosDibujados(lang), lang),
  );
  const leyenda: { cat: CategoriaPaso; texto: string }[] = [
    { cat: "ausencia", texto: t.absence },
    { cat: "patron", texto: t.pattern },
  ];

  return (
    <div role="img" aria-label={ariaLabel} className="w-full">
      <div aria-hidden="true" className="flex w-full flex-col gap-[0.9rem]">
        {t.groups.map((g, gi) => (
          <div key={g.label} className="flex flex-col gap-[0.45rem]">
            <p
              {...rlz(
                gi,
                "text-muted-foreground font-mono text-[10px] font-semibold tracking-[0.06em] uppercase",
              )}
            >
              {g.label}
            </p>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((it) => (
                <li key={it.n} {...rlz(gi, chipClases(it.cat))}>
                  <Marca cat={it.cat} />
                  {it.n}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <ul
          {...rlz(
            t.groups.length - 1,
            "text-muted-foreground flex flex-wrap gap-x-[1.1rem] gap-y-[0.35rem] font-mono text-[11px]",
          )}
        >
          {leyenda.map(({ cat, texto }) => (
            <li key={cat} className="flex items-center gap-[0.4rem]">
              <span className={cn(swatchClases(cat), "size-[14px]")}>
                <Marca cat={cat} />
              </span>
              {texto.replace("{n}", String(cuenta(cat)))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** La pastilla de un paso. El tinte dice de qué familia es y la marca lo repite
 * con una forma, que es lo que hace que la distinción no dependa del color. */
function chipClases(cat: CategoriaPaso) {
  return cn(
    "text-foreground flex items-center gap-[0.4rem] rounded-sm px-[0.55rem] py-[0.3rem] font-mono text-[12px] leading-[1.2]",
    cat === "ausencia" ? "bg-primary/25" : "bg-muted",
  );
}

/** La misma caja de la pastilla, reducida a muestra de leyenda. */
function swatchClases(cat: CategoriaPaso) {
  return cn(
    "flex shrink-0 items-center justify-center rounded-[3px]",
    cat === "ausencia" ? "bg-primary/25" : "bg-muted",
  );
}

/** Macizo si busca la ausencia de algo bueno, hueco si busca un patrón
 * conocido. Es una forma, no un color: el punto 6 del checklist. */
function Marca({ cat }: { cat: CategoriaPaso }) {
  return (
    <span
      className={cn(
        "size-[7px] shrink-0 rounded-[2px]",
        cat === "ausencia" ? "bg-foreground" : "border-foreground border",
      )}
    />
  );
}
