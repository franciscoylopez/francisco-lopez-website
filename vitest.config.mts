import { defineConfig } from "vitest/config";

// El arnés de tests del sitio (P68.494). Runner: Vitest, que es el que recomienda
// la guía de Next 16 (`node_modules/next/dist/docs/01-app/02-guides/testing/`).
//
// NO HAY jsdom NI TESTING-LIBRARY, y no es un olvido. Lo que se prueba aquí es la
// primera lógica de negocio real del sitio —la validación del formulario, el
// saneado de cabeceras del correo y las decisiones de la Server Action—, no
// componentes. Meter un DOM falso para código que nunca toca el DOM sería pagar
// un árbol de dependencias por nada; el día que haya que renderizar una isla se
// añade entonces, con su motivo.
export default defineConfig({
  // El alias `@/` sale del tsconfig, que Vite ya resuelve de forma nativa: el
  // plugin `vite-tsconfig-paths` que sigue recomendando la guía de Next sobra
  // desde Vite 7, y el propio Vite lo avisa por consola al arrancar.
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
