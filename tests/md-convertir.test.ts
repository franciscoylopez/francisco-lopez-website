/**
 * El conversor de `<main>` a markdown, con casos buenos y con el caso malo.
 *
 * POR QUÉ TIENE TESTS Y LOS OTROS SCRIPTS NO. Porque `convertir.ts` es lógica
 * pura sin E/S ni navegador, y las dos reglas que decide no se ven mirando el
 * markdown de salida: la FRONTERA («dos elementos pegados estaban separados por
 * CSS») y el FALLO EN VOZ ALTA ante un elemento fuera del contrato. Un conversor
 * que se rompiera en silencio produciría un markdown plausible y equivocado, que
 * es exactamente lo que no se detecta leyendo el resultado. Misma partición que
 * `tablero/reglas.ts`: las reglas aparte, con prueba, y la E/S en el script.
 *
 * LOS DOS CASOS DE FRONTERA SON REALES, no inventados: salieron del prerender del
 * 2026-08-30 y estaban mal en la primera versión (D158).
 */
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

import { convertir, ElementoDesconocido } from "../scripts/md/convertir";

const BASE = "https://franciscolopez.es";

/** El `<main>` de un HTML de pega, que es lo único que el conversor recibe. */
function main(html: string): Element {
  const dom = new JSDOM(`<main>${html}</main>`);
  return dom.window.document.querySelector("main")!;
}

const md = (html: string) => convertir(main(html), BASE).markdown;

describe("bloques", () => {
  it("convierte titulares, párrafos y listas", () => {
    expect(
      md("<h2>Hitos</h2><p>Cinco.</p><ul><li>Uno</li><li>Dos</li></ul>"),
    ).toBe("## Hitos\n\nCinco.\n\n- Uno\n- Dos");
  });

  it("numera las listas ordenadas", () => {
    expect(md("<ol><li>Inicio</li><li>Contacto</li></ol>")).toBe(
      "1. Inicio\n2. Contacto",
    );
  });

  it("dibuja una tabla con su cabecera", () => {
    expect(
      md(
        "<table><thead><tr><th>Token</th><th>Valor</th></tr></thead>" +
          "<tbody><tr><td>radius</td><td>14px</td></tr></tbody></table>",
      ),
    ).toBe("| Token | Valor |\n| --- | --- |\n| radius | 14px |");
  });
});

describe("en línea", () => {
  it("absolutiza lo interno y deja lo externo como está", () => {
    expect(md('<p><a href="/contacto">Aquí</a></p>')).toBe(
      `[Aquí](${BASE}/contacto)`,
    );
    expect(md('<p><a href="https://otro.es">Fuera</a></p>')).toBe(
      "[Fuera](https://otro.es)",
    );
    expect(md('<p><a href="mailto:a@b.es">Correo</a></p>')).toBe(
      "[Correo](mailto:a@b.es)",
    );
  });

  it("NO se come el espacio entre palabras al marcar énfasis", () => {
    expect(md("<p>Churn mensual <strong>16%</strong> este mes.</p>")).toBe(
      "Churn mensual **16%** este mes.",
    );
  });

  it("saca el `datetime` de un `time` cuando dice algo distinto", () => {
    expect(md('<p><time datetime="2026-08-30">30 de agosto</time></p>')).toBe(
      "30 de agosto (2026-08-30)",
    );
  });
});

describe("la frontera de CSS", () => {
  it("separa dos rótulos que solo el CSS ponía en líneas distintas", () => {
    // El enlace de correo de `/contacto`, tal cual sale del prerender.
    expect(
      md(
        '<p><a href="mailto:a@b.es"><span>Correo</span><span>a@b.es</span></a></p>',
      ),
    ).toBe("[Correo · a@b.es](mailto:a@b.es)");
  });

  it("separa los rótulos de una cabecera hecha de `span` hermanos", () => {
    // La cabecera de Hitos en la home.
    expect(
      md("<div><span>Nombre</span><span>Impacto</span><span>Año</span></div>"),
    ).toBe("Nombre · Impacto · Año");
  });

  it("un `span` que solo lleva un icono no separa nada", () => {
    expect(md("<p><span><svg></svg></span><span>Correo</span></p>")).toBe(
      "Correo",
    );
  });

  it("NO se dispara en prosa, porque ahí siempre hay un nodo de texto en medio", () => {
    expect(md("<p><em>Discovery</em> y <em>dato</em></p>")).toBe(
      "_Discovery_ y _dato_",
    );
  });
});

describe("lo que se declara fuera", () => {
  it("cuenta el `svg` en vez de tirarlo en silencio", () => {
    const { omitidos } = convertir(main("<p><svg></svg>Texto</p>"), BASE);
    expect(omitidos).toEqual([{ familia: "svg", etiqueta: "svg" }]);
  });

  it("se queda con la ETIQUETA de un control y lo cuenta como control", () => {
    const { markdown, omitidos } = convertir(
      main("<p><button>Enviar mensaje</button></p>"),
      BASE,
    );
    expect(markdown).toBe("Enviar mensaje");
    expect(omitidos).toEqual([{ familia: "control", etiqueta: "button" }]);
  });

  it("no pinta lo marcado `aria-hidden`", () => {
    const { markdown, omitidos } = convertir(
      main('<p>Visible</p><p aria-hidden="true">Decorativo</p>'),
      BASE,
    );
    expect(markdown).toBe("Visible");
    expect(omitidos).toEqual([{ familia: "oculto", etiqueta: "p" }]);
  });
});

describe("el caso malo", () => {
  it("FALLA EN VOZ ALTA ante un elemento fuera del contrato, y dice cuál", () => {
    expect(() => md("<marquee>Hola</marquee>")).toThrow(ElementoDesconocido);
    expect(() => md("<marquee>Hola</marquee>")).toThrow(/<marquee>/);
  });

  it("y nombra el contexto, para poder encontrarlo en la página", () => {
    try {
      md("<p>antes</p><marquee>Texto que lo sitúa</marquee>");
      expect.unreachable("tenía que haber fallado");
    } catch (e) {
      expect(e).toBeInstanceOf(ElementoDesconocido);
      expect((e as ElementoDesconocido).contexto).toBe("Texto que lo sitúa");
    }
  });
});

describe("la guarda de cero", () => {
  it("cuenta los elementos visitados, porque una conversión vacía no es un aprobado", () => {
    expect(convertir(main("<p>Uno</p><p>Dos</p>"), BASE).visitados).toBe(2);
  });
});
