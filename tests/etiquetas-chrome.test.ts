/**
 * UN DESTINO SE LLAMA IGUAL EN TODAS LAS SUPERFICIES DE CHROME.
 *
 * El nav y el breadcrumb nombran las mismas páginas y viven en ramas distintas
 * del diccionario, porque cada página carga la suya (D48) y el nav solo tiene
 * `common`. Dos ramas es dos redacciones esperando a divergir, que es la regla 5
 * de `BRAND.md` §Cómo se escribe una regla; lo que impide el drift no es
 * acordarse, es que algo falle cuando pasa.
 *
 * SE COMPRUEBA EN LOS DOS IDIOMAS, que es donde de verdad se separan: en español
 * las dos entradas se escriben igual por casualidad —«Trayectoria»— y en inglés
 * hay tres candidatos vivos en el propio sitio para la misma página («Career» en
 * el eyebrow, «My Experience» en el h1, «Experience» en el rastro de migas), así
 * que es exactamente el caso en el que alguien elegiría otro.
 */
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const LOCALES = ["es", "en"] as const;

const lee = (ruta: string) =>
  JSON.parse(readFileSync(`app/[lang]/dictionaries/${ruta}`, "utf8"));

describe("el nav y el breadcrumb nombran igual a /trayectoria", () => {
  it.each(LOCALES)("en %s", (locale) => {
    const nav = lee(`${locale}/common.json`).nav.trayectoria;
    const miga = lee(`${locale}/trayectoria/comun.json`).crumbIndice;
    expect(nav).toBe(miga);
  });

  // EL CASO MALO, que es lo que separa este test de uno que aprueba sobre nada:
  // si la comparación fuese laxa —recortando, ignorando mayúsculas— dejaría
  // pasar justo las divergencias que se quieren cazar.
  it("y no aprobaría con dos redacciones parecidas", () => {
    expect("Experience").not.toBe("Career");
    expect("Trayectoria").not.toBe("Mi Trayectoria");
  });
});
