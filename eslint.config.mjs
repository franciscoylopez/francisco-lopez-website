import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Tooling Node (generación del logo-kit, scripts sueltos): no es código de la
    // app y usa require()/APIs de Node — fuera del lint de Next.
    "scripts/**",
    "scratch/**",
  ]),
]);

export default eslintConfig;
