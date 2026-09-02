import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * DOS CONFIGS, PORQUE HAY DOS PROGRAMAS EN ESTE REPO.
 *
 * `app/`, `components/` y `lib/` son la web y los mira la config de Next. `scripts/`
 * es el ANDAMIAJE —gates, guardianes, generadores— y hasta el 2026-08-28 no lo
 * miraba nadie: 8.446 líneas, el 30% del código del repo, más que `lib/` y `app/`
 * juntos (2.063 + 3.178). El ignore original tenía su motivo —«usa require() y APIs
 * de Node, no es código de Next»— y la respuesta correcta no era levantarlo, era
 * darle a esa mitad su propia config (P50.80).
 *
 * Los `.ts` de `scripts/` sí los typechea `tsc`, pero un `tsc` limpio no ve una
 * variable sin usar ni una promesa sin capturar: en el sprint anterior aparecieron
 * dos avisos de esa clase y no los sacó ningún gate.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ── El andamiaje ────────────────────────────────────────────────────────────
  // TypeScript de Node: los gates, los guardianes y los generadores.
  {
    files: ["scripts/**/*.ts", "scripts/**/*.mts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
      parserOptions: { sourceType: "module" },
    },
    rules: {
      // Un `_` delante es la forma de decir «este parámetro existe por posición».
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Los hooks del harness: ESM de Node, sin TypeScript.
  {
    files: ["scripts/**/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  // CommonJS de Node: el generador del logo-kit y el procesado de logos.
  {
    files: ["scripts/logo-kit/**/*.js", "scripts/logos/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: { ...globals.node, ...globals.commonjs },
      ecmaVersion: "latest",
      sourceType: "commonjs",
    },
    rules: {
      // La regla la trae `nextTs`, que casa `**/*.js` y no sabe que aquí abajo hay
      // otro programa. `require()` es la forma correcta en un CommonJS de Node.
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // El generador del CV es TSX y NO pinta HTML: react-pdf dibuja un documento, así
  // que las reglas de accesibilidad del DOM no aplican — su `<Image>` no es un
  // `<img>` y no tiene `alt` que poner.
  {
    files: ["scripts/**/*.tsx"],
    rules: { "jsx-a11y/alt-text": "off" },
  },

  // EL CENSO DE CONTRASTE NO ES CÓDIGO DE NODE: es un guion que se INYECTA en la
  // página y se evalúa dentro del navegador, así que sus globales son `window` y
  // `document`. Es el que se ha roto en silencio dos veces (D70), o sea justo el
  // que más falta hacía que mirara alguien.
  {
    files: ["scripts/design-review/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "script",
    },
  },

  // Y EL CENSO SON OCHO PIEZAS QUE SE INYECTAN CONCATENADAS (P72.195), así que
  // comparten UN solo ámbito: lo que una declara, las siguientes lo usan. ESLint
  // mira archivo por archivo, y sin decírselo pasarían dos cosas, las dos malas:
  // `no-undef` marcaría en rojo cada referencia legítima entre piezas, y
  // `no-unused-vars` marcaría cada declaración que se usa en otra.
  //
  // La lista de abajo ES la superficie compartida del guion, y mantenerla al día
  // no es burocracia: es lo que conserva vivo `no-undef` dentro del censo, que es
  // la protección que este bloque defendía desde el principio. Un `paint` mal
  // escrito sigue saliendo en rojo; un nombre nuevo que se comparta y no se
  // declare aquí, también.
  //
  // `vars: "local"` es la otra mitad: dentro de una función, una variable sin usar
  // sigue siendo un error. Lo que deja de comprobarse es el nivel superior, que en
  // este guion no es «el archivo» sino «el paquete entero».
  {
    files: ["scripts/design-review/censo/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        CLAVE_SOBRE_IMAGEN: "readonly",
        CONTROL_SEL: "readonly",
        HOVER_RULES: "readonly",
        backdrop: "readonly",
        cajaDelHijo: "readonly",
        cajaDelTexto: "readonly",
        censarContornos: "readonly",
        compuestosPorOpacidad: "writable",
        conOpacidad: "readonly",
        conOpacidadInspeccionados: "writable",
        dibujaCaja: "readonly",
        esVisible: "readonly",
        hoverDeclarations: "readonly",
        label: "readonly",
        ladosConBorde: "readonly",
        over: "readonly",
        overImage: "readonly",
        paint: "readonly",
        paintsText: "readonly",
        ratio: "readonly",
        round: "readonly",
        solapan: "readonly",
        tapaFijo: "readonly",
        umbralDe: "readonly",
      },
    },
    rules: {
      // El «archivo» de este guion es el paquete entero, así que una declaración
      // de nivel superior sin usar aquí es casi siempre una que usa la pieza
      // siguiente. Lo que NO se apaga es `no-undef`, que es la protección que
      // este bloque defiende y la que sigue cazando un `paint` mal escrito.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // Y el detector del punto 6 se inyecta DESPUÉS del censo, en la misma página,
  // así que usa sus helpers de color. Se declaran aquí y solo para él —no para
  // todo `design-review/`— para que un `paint` mal escrito dentro del propio censo
  // siga saliendo en rojo, que es donde se ha roto dos veces. Sus cuatro piezas
  // van concatenadas por la misma razón que las del censo, con la misma lista.
  {
    files: ["scripts/design-review/color-solo/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        paint: "readonly",
        label: "readonly",
        COLOR_PROPS: "readonly",
        FORMA_PROPS: "readonly",
        EPSILON_GRIS: "readonly",
        dibujaBorde: "readonly",
        forma: "readonly",
        grisDe: "readonly",
        gruposComparables: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // `scripts/.poda/` son recortes generados del Design System para medir, no
    // código que se mantenga: se regeneran enteros y no los lee nadie.
    "scripts/.poda/**",
    "scratch/**",
  ]),
]);

export default eslintConfig;
