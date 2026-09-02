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
  // `document`. Es el archivo peor puntuado por qlty y el que se ha roto en
  // silencio dos veces (D70), o sea justo el que más falta hacía que mirara
  // alguien.
  {
    files: ["scripts/design-review/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "script",
    },
  },

  // Y `color-solo.js` se inyecta DESPUÉS del censo, en la misma página, así que
  // usa sus helpers de color. Se declaran aquí y solo para él —no para todo
  // `design-review/`— para que un `paint` mal escrito dentro del propio censo
  // siga saliendo en rojo, que es donde se ha roto dos veces.
  {
    files: ["scripts/design-review/color-solo.js"],
    languageOptions: {
      globals: { paint: "readonly", label: "readonly" },
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
