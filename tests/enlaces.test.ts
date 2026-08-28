/**
 * El criterio de `check:enlaces`, probado en CI aunque el comando corra fuera.
 *
 * `check:enlaces` sale a la red, así que no puede ser un paso de CI: un servidor
 * ajeno caído cinco minutos pondría un PR en rojo sin que nada de este repo esté
 * mal (D49/D99). La mitad que SÍ se puede vigilar siempre es dónde se equivoca un
 * metro así: qué cuenta como enlace y qué cuenta como muerto. Cada regla, con su
 * caso bueno y su caso malo, como en `tests/tablero.test.ts`.
 */
import { describe, expect, it } from "vitest";

import {
  clasificar,
  redirigido,
  urlsDe,
  veredictoDe,
  type Hallada,
} from "@/scripts/enlaces/reglas";

describe("urlsDe", () => {
  it("saca la URL de un enlace de Markdown sin el paréntesis", () => {
    const [u] = urlsDe(
      "ver [WCAG](https://www.w3.org/TR/WCAG22/) aquí",
      "x.md",
    );
    expect(u?.url).toBe("https://www.w3.org/TR/WCAG22/");
  });

  it("no se lleva el punto final de la frase", () => {
    // El caso de la prosa: «…en https://qlty.sh.» El punto no es de la URL, y
    // pedirlo con él daría un 404 inventado.
    const [u] = urlsDe("la herramienta es https://qlty.sh.", "x.md");
    expect(u?.url).toBe("https://qlty.sh");
  });

  it("no confunde dos URL pegadas por una comilla", () => {
    const us = urlsDe(
      'a="https://uno.example" b="https://dos.example"',
      "x.tsx",
    );
    expect(us.map((u) => u.url)).toEqual([
      "https://uno.example",
      "https://dos.example",
    ]);
  });

  it("devuelve lista vacía sin URL, en vez de inventarse una", () => {
    expect(urlsDe("texto sin enlaces", "x.md")).toEqual([]);
  });
});

describe("clasificar", () => {
  const HALLADAS: Hallada[] = [
    { url: "https://www.w3.org/TR/WCAG22/", archivo: "a.json" },
    { url: "https://www.w3.org/TR/WCAG22/", archivo: "b.json" },
    { url: "http://localhost:3000", archivo: "c.ts" },
    { url: "https://schema.org", archivo: "d.ts" },
    { url: "https://www.googletagmanager.com/gtm.js?id=", archivo: "e.tsx" },
    { url: "https://${host}/algo", archivo: "f.ts" },
  ];

  it("no pierde ninguna: enlaces + descartadas = las únicas de la entrada", () => {
    // La guarda que impide que un descarte silencioso pase por aprobado.
    const { enlaces, descartadas } = clasificar(HALLADAS);
    expect(enlaces.length + descartadas.length).toBe(5); // la repetida se dedupe
  });

  it("deduplica por URL y se queda con el primer archivo", () => {
    const { enlaces } = clasificar(HALLADAS);
    expect(enlaces).toHaveLength(1);
    expect(enlaces[0]?.archivo).toBe("a.json");
  });

  it("descarta lo que no es un enlace, y dice por qué", () => {
    const { descartadas } = clasificar(HALLADAS);
    expect(descartadas.map((d) => d.url)).toEqual([
      "http://localhost:3000",
      "https://schema.org",
      "https://www.googletagmanager.com/gtm.js?id=",
      "https://${host}/algo",
    ]);
    for (const d of descartadas) expect(d.motivo).not.toBe("");
  });
});

describe("veredictoDe", () => {
  it("un 404 y un 410 están muertos", () => {
    expect(veredictoDe(404)).toBe("muerto");
    expect(veredictoDe(410)).toBe("muerto");
  });

  it("un 5xx real está muerto", () => {
    expect(veredictoDe(500)).toBe("muerto");
    expect(veredictoDe(503)).toBe("muerto");
  });

  it("el 999 de LinkedIn NO está muerto: fue el primer falso positivo", () => {
    // `999 >= 500` lo puntuaba como caído. Es el escudo antibot de LinkedIn, y el
    // perfil existe. Un umbral mal aplicado inventa hallazgos.
    expect(veredictoDe(999)).toBe("no concluyente");
  });

  it("un 403 tampoco: lo devuelven a quien no parece un navegador", () => {
    expect(veredictoDe(403)).toBe("no concluyente");
    expect(veredictoDe(405)).toBe("no concluyente");
  });

  it("un 200 y un 202 están vivos", () => {
    expect(veredictoDe(200)).toBe("vivo");
    expect(veredictoDe(202)).toBe("vivo");
  });
});

describe("redirigido", () => {
  it("un idioma añadido en la query no es una redirección que informar", () => {
    // `developer.chrome.com` añade `?hl=` según quién pregunte. Informarlo sería
    // ruido, y un informe ruidoso deja de leerse.
    expect(
      redirigido(
        "https://developer.chrome.com/docs/lighthouse/overview",
        "https://developer.chrome.com/docs/lighthouse/overview?hl=zh-cn",
      ),
    ).toBe(false);
  });

  it("la barra final tampoco cuenta", () => {
    expect(redirigido("https://a.example/x", "https://a.example/x/")).toBe(
      false,
    );
  });

  it("cambiar de host sí", () => {
    expect(
      redirigido(
        "https://privacy.microsoft.com/privacystatement",
        "https://www.microsoft.com/es-es/privacy/privacystatement",
      ),
    ).toBe(true);
  });

  it("cambiar de ruta en el mismo host, también", () => {
    expect(
      redirigido("https://a.example/viejo", "https://a.example/nuevo"),
    ).toBe(true);
  });
});
