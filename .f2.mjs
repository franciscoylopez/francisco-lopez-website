import { readFileSync, writeFileSync } from "node:fs";
const p = "scripts/check-rutas.ts";
let s = readFileSync(p, "utf8");
const rep = (a, b) => {
  const n = s.split(a).length - 1;
  if (n !== 1) throw new Error("ancla x" + n + ": " + a.slice(0, 45));
  s = s.replace(a, b);
};

// F3 · Next enruta page.ts/.js/.jsx/.mdx, no solo page.tsx.
rep(
  `  const encontradas = entradas.some(
    (e) => e.isFile() && e.name === "page.tsx",
  )`,
  `  const encontradas = entradas.some((e) => e.isFile() && ES_PAGE.test(e.name))`,
);

rep(
  `/** La raíz del App Router por locale. Todo lo que hay debajo es una página. */
const RAIZ = join("app", "[lang]");`,
  `/** La raíz del App Router por locale. Todo lo que hay debajo es una página. */
const RAIZ = join("app", "[lang]");

/**
 * Qué archivo convierte una carpeta en ruta. NO solo \`page.tsx\`: Next enruta
 * igual \`.ts\`, \`.js\`, \`.jsx\` y \`.mdx\`. Mirar solo el que este repo usa hoy sería
 * el fallo que este guardián existe para evitar, con otra forma — una carpeta que
 * es ruta de verdad y que él no cuenta.
 */
const ES_PAGE = /^page\.(tsx|ts|jsx|js|mdx)$/;`,
);

// F4 · una consumidora renombrada moría con ENOENT en vez de con su mensaje.
rep(
  `for (const { archivo, rompe } of CONSUMIDORAS) {
  const fuente = readFileSync(archivo, "utf8");
  nConsumidoras++;
  if (!/from ["'][^"']*lib\/routes["']/.test(fuente)) {
    fallo(
      \`\\`\${archivo}\\` ya no importa de \\`lib/routes\\`. Si vuelve a llevar su propia lista de páginas, \${rompe}.\`,
    );
  }
}`,
  `for (const { archivo, rompe } of CONSUMIDORAS) {
  nConsumidoras++;
  let fuente: string;
  try {
    fuente = readFileSync(archivo, "utf8");
  } catch {
    // Sin esto moría con un ENOENT pelado, que es un fallo del guardián y no un
    // informe: el operador ve una traza en vez de qué consumidora falta.
    fallo(
      \`\\`\${archivo}\\` no existe. O se ha movido y hay que actualizar CONSUMIDORAS, o ha desaparecido: \${rompe}.\`,
    );
    continue;
  }
  if (!/from ["'][^"']*lib\/routes["']/.test(fuente)) {
    fallo(
      \`\\`\${archivo}\\` ya no importa de \\`lib/routes\\`. Si vuelve a llevar su propia lista de páginas, \${rompe}.\`,
    );
  }
}`,
);

// F2 · el banner decía 12 contra 12 cuando solo 7 se contrastan de verdad.
rep(
  `console.log(
  \`check:rutas — \${disco.size} rutas en disco · \${registro.size} en el registro · \${nConsumidoras} consumidoras\`,
);`,
  `// El metro afirma lo que ha comparado DE VERDAD, y las dos mitades no son iguales:
// las estáticas se contrastan contra el disco, y las del deep-dive salen de la
// misma constante en los dos lados de la comparación (\`DEEP_DIVE_SLUGS\` está
// dentro de \`PAGE_SLUGS\`), así que ahí no hay nada que pueda descuadrar. Contarlas
// juntas publicaba «12 contra 12» sobre siete comparaciones reales, que es la
// forma fina del metro que aprueba de más.
const nDerivadas = DEEP_DIVE_SLUGS.length;
console.log(
  \`check:rutas — \${disco.size - nDerivadas} rutas estáticas contrastadas contra el disco · \` +
    \`\${nDerivadas} del deep-dive derivadas de EXPERIENCES (no hay dos listas que puedan diferir) · \` +
    \`\${nConsumidoras} consumidoras\`,
);`,
);

writeFileSync(p, s, "utf8");
console.log("ok");
