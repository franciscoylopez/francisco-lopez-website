/**
 * El filtro que decide qué commit NO se despliega, probado con su caso malo.
 *
 * El script vive fuera del build (`scripts/vercel/ignorar-build.mjs`) y corre en
 * Vercel antes de instalar nada, así que no hay forma de ejecutarlo en CI tal
 * cual. Lo que sí se puede probar —y es lo único que importa— es la REGLA: la
 * función pura que, dada la lista de rutas tocadas, dice si hay que construir.
 *
 * Y el caso malo aquí no es «no se salta un build que podría saltarse»: eso solo
 * cuesta un despliegue. Es **dejar de desplegar un cambio real en silencio**, así
 * que la mitad larga de estos tests son rutas que PARECEN método y las lee el
 * sitio al construir.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import {
  EXCEPCIONES,
  hayQueConstruir,
  IGNORABLES,
  laSirveElSitio,
} from "@/scripts/vercel/ignorar-build.mjs";

describe("lo que no sirve nadie se salta", () => {
  it.each([
    ["CLAUDE.md"],
    ["BRAND.md"],
    ["PRD-Historical.md"],
    ["GATES.md"],
    [".claude/skills/close-session/SKILL.md"],
    [".githooks/pre-push"],
    [".github/dependabot.yml"],
    [".qlty/qlty.toml"],
    ["scripts/psi.ts"],
    ["scripts/vercel/ignorar-build.mjs"],
    ["tests/tablero.test.ts"],
    ["content/accesibilidad/accesibilidad.huella"],
    ["content/articulo/articulo.huella"],
    [".prettierrc.json"],
    ["LICENSE"],
  ])("%s no la sirve el sitio", (ruta) => {
    expect(laSirveElSitio(ruta)).toBe(false);
  });

  it("un commit entero de método se salta", () => {
    expect(
      hayQueConstruir([
        "CLAUDE.md",
        "PRD-Live.md",
        ".claude/skills/method-review/SKILL.md",
        "scripts/check-tablero.ts",
      ]),
    ).toBe(false);
  });
});

describe("el caso malo: lo que parece método y el build LEE", () => {
  it.each([
    // `lib/decisions.ts` lo lee para la página del artículo.
    ["DECISIONS.md"],
    // `lib/figures.ts` cuenta los pasos de CI leyendo el YAML.
    [".github/workflows/ci.yml"],
    // Los sellos que publican cifras.
    ["content/psi/registro.json"],
    ["content/agentes/registro.json"],
    ["content/md/registro.json"],
    ["content/artefactos/emendu-mdm.svg"],
    // El sello del CV está bajo `public/`, que se copia tal cual al CDN.
    ["public/cv/cv.huella"],
    // El markdown servido y los assets.
    ["public/md/es/index.md"],
    ["public/logo-kit/README.md"],
    ["assets/fonts/inter-400.woff"],
    // Y lo evidente, por si una regla nueva se lleva algo por delante.
    ["app/[lang]/page.tsx"],
    ["components/ui/action.tsx"],
    ["lib/design-values.ts"],
    ["package.json"],
    ["package-lock.json"],
    ["next.config.ts"],
    ["proxy.ts"],
    ["tsconfig.json"],
    [".nvmrc"],
    ["brand-assets/logo.svg"],
  ])("%s SÍ la sirve el sitio", (ruta) => {
    expect(laSirveElSitio(ruta)).toBe(true);
  });

  it("un commit mixto construye, aunque solo una ruta cuente", () => {
    expect(
      hayQueConstruir(["CLAUDE.md", "scripts/psi.ts", "DECISIONS.md"]),
    ).toBe(true);
  });

  it("una carpeta que la lista no conoce construye", () => {
    expect(hayQueConstruir(["carpeta-que-no-existia/algo.ts"])).toBe(true);
  });

  it("una lista vacía construye: lo que ha fallado es la medición", () => {
    expect(hayQueConstruir([])).toBe(true);
  });
});

describe("las excepciones no son adorno", () => {
  it("cada excepción cae de verdad dentro de un patrón ignorable", () => {
    for (const ruta of EXCEPCIONES) {
      expect(
        IGNORABLES.some((patron) => patron.test(ruta)),
        `«${ruta}» ya construye sin necesidad de estar en EXCEPCIONES`,
      ).toBe(true);
    }
  });
});

/**
 * El guardián que impide que la lista se quede corta sin avisar.
 *
 * La lista es correcta HOY porque hoy el build lee seis archivos de fuera de
 * `app/`. El día que una página lea un séptimo, nada avisa: el filtro seguiría
 * saltándose su commit. Así que en vez de recordarlo, se busca — sobre `lib/` y
 * `app/`, que es donde ocurren las lecturas de disco.
 *
 * Recoge cualquier literal entrecomillado con pinta de ruta del repo, y eso
 * incluye falsos positivos (una clase de Tailwind con `/`, una URL). Da igual, y
 * es a propósito: lo que se afirma es que NINGUNO de ellos es ignorable, y un
 * falso positivo nunca lo es. `content/` queda fuera porque ahí sí hay rutas de
 * `scripts/` escritas como DATO —la página de dependencias las publica—, y son
 * nombres, no lecturas.
 */
const RAICES_ESCANEADAS = ["lib", "app"];
const LITERAL = /"([^"\s]*\/[^"\s]*|[A-Za-z0-9_-]+\.(?:md|ya?ml))"/g;

function archivosDe(raiz: string): string[] {
  return readdirSync(raiz).flatMap((nombre) => {
    const ruta = join(raiz, nombre);
    if (statSync(ruta).isDirectory()) return archivosDe(ruta);
    return /\.tsx?$/.test(nombre) ? [ruta] : [];
  });
}

describe("la lista de ignorables sigue al día", () => {
  it("ningún literal de ruta de `lib/` ni de `app/` es ignorable", () => {
    const encontrados = new Set<string>();
    let archivos = 0;
    for (const raiz of RAICES_ESCANEADAS) {
      for (const archivo of archivosDe(raiz)) {
        archivos++;
        const codigo = readFileSync(archivo, "utf8");
        for (const [, literal] of codigo.matchAll(LITERAL)) {
          if (!literal) continue;
          if (/^(\.{1,2}\/|@\/|\/|[a-z]+:)/.test(literal)) continue;
          encontrados.add(literal);
        }
      }
    }
    // El metro dice cuánto ha mirado: una lista vacía parecería un aprobado.
    expect(archivos).toBeGreaterThan(50);
    expect(encontrados.size).toBeGreaterThan(20);

    const ciegos = [...encontrados].filter((ruta) => !laSirveElSitio(ruta));
    expect(
      ciegos,
      `estas rutas las nombra el código servido y el filtro las da por método: ${ciegos.join(", ")}`,
    ).toEqual([]);
  });

  it("y sabe fallar: una ruta de `scripts/` en esa lista la caza", () => {
    expect(laSirveElSitio("scripts/guardianes/casos.ts")).toBe(false);
  });
});
