/**
 * La traducción de slugs público↔interno (P72.56), con el caso malo.
 *
 * POR QUÉ TIENE TESTS. Porque de estas dos funciones cuelgan tres cosas que
 * fallan en SILENCIO: el rewrite del proxy (una ruta pública que no encuentra su
 * carpeta da 404), el estado «estás aquí» del nav (se apaga sin avisar) y el
 * conmutador de idioma (te manda a otra página). Ninguna rompe el build, y las
 * tres se ven solo entrando a la página en inglés — que es justo la mitad del
 * sitio que nadie mira a diario.
 *
 * `check:rutas` ya comprueba la ida y vuelta sobre las páginas REALES. Esto
 * comprueba las REGLAS, que es lo que aquel no puede: la de las rutas de hoy
 * seguiría verde con una implementación que solo funcionara para ellas.
 */
import { describe, expect, it } from "vitest";

import { internalSlug, PAGE_SLUGS, publicSlug } from "../lib/routes";

describe("publicSlug", () => {
  it("no toca el español, que es la fuente de verdad", () => {
    expect(publicSlug("es", "sobre-mi")).toBe("sobre-mi");
    expect(publicSlug("es", "trayectoria/emendu")).toBe("trayectoria/emendu");
  });

  it("traduce el slug inglés", () => {
    expect(publicSlug("en", "sobre-mi")).toBe("about");
    expect(publicSlug("en", "trayectoria")).toBe("career");
    expect(publicSlug("en", "como-se-ha-creado")).toBe("how-it-was-built");
  });

  it("deja igual lo que ya se llama igual en los dos idiomas", () => {
    expect(publicSlug("en", "brand-kit")).toBe("brand-kit");
    expect(publicSlug("en", "cookies")).toBe("cookies");
  });

  it("la home es la cadena vacía en los dos idiomas", () => {
    expect(publicSlug("en", "")).toBe("");
    expect(publicSlug("es", "")).toBe("");
  });

  // LA REGLA ENTERA DEL DEEP-DIVE, y la que más fácil se rompe al tocar esto: se
  // muda el padre y el nombre de la empresa no se toca NUNCA (§1297).
  it("traduce solo el primer segmento del deep-dive", () => {
    expect(publicSlug("en", "trayectoria/emendu")).toBe("career/emendu");
    expect(publicSlug("en", "trayectoria/thetool")).toBe("career/thetool");
  });
});

describe("internalSlug", () => {
  it("devuelve la carpeta que sirve la ruta pública", () => {
    expect(internalSlug("en", "about")).toBe("sobre-mi");
    expect(internalSlug("en", "career/emendu")).toBe("trayectoria/emendu");
  });

  // EL CASO QUE PARECE LAXITUD Y NO LO ES. `usePathname()` da la ruta interna en
  // el prerender y la pública en runtime, así que el nav pregunta con las dos
  // formas por la misma página. Si esta prueba cae, el estado «estás aquí» se
  // apaga en las páginas inglesas traducidas y nada más se entera.
  it("acepta también un slug que ya venía interno", () => {
    expect(internalSlug("en", "sobre-mi")).toBe("sobre-mi");
    expect(internalSlug("en", "trayectoria/emendu")).toBe("trayectoria/emendu");
  });

  it("no toca el español", () => {
    expect(internalSlug("es", "sobre-mi")).toBe("sobre-mi");
  });
});

describe("el viaje de ida y vuelta", () => {
  it("devuelve el slug de partida en todas las páginas del registro", () => {
    for (const slug of PAGE_SLUGS) {
      expect(internalSlug("en", publicSlug("en", slug))).toBe(slug);
      expect(internalSlug("es", publicSlug("es", slug))).toBe(slug);
    }
  });

  // EL CASO MALO. Un slug que no es de este sitio no se inventa una traducción:
  // sale tal cual, que es lo que permite al proxy pasárselo al 404 en vez de
  // reescribirlo a una carpeta que no existe.
  it("deja pasar sin tocar lo que no está en el mapa", () => {
    expect(publicSlug("en", "no-existe")).toBe("no-existe");
    expect(internalSlug("en", "no-existe")).toBe("no-existe");
    expect(publicSlug("en", "no-existe/hijo")).toBe("no-existe/hijo");
  });
});
