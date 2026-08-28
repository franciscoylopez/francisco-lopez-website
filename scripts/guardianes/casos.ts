/**
 * El inventario de casos malos — lo ejecuta `scripts/check-guardianes.ts`.
 *
 * POR QUÉ ESTÁ APARTE (2026-08-28, P50.73). Misma partición que
 * `scripts/tablero/reglas.ts`: el archivo de al lado es E/S —muta archivos, corre
 * comandos, restaura el árbol— y esto es DATO. Partirlo compró un lector nuevo:
 * `check:accesibilidad` cuenta desde aquí cuántos guardianes y cuántos casos hay,
 * que son dos cifras que la página `/accesibilidad` publica en prosa, sin tener
 * que arrancar la maquinaria que los dispara.
 *
 * Y esas dos cifras ya estaban caducadas cuando se partió: la página decía
 * «catorce comprobaciones y veintitrés errores fingidos» habiendo QUINCE y
 * VEINTISIETE. Nadie las movió al añadir un caso, porque nada las ataba.
 */
export type Caso = {
  guardian: string;
  /** Qué se rompe, en una línea, para que el informe se lea sin abrir el código. */
  rotura: string;
  /**
   * Qué se rompe. Normalmente un archivo FUENTE; en `check:marco`, el HTML del
   * build, que es su entrada de verdad. Rastreado o no: se restaura desde memoria.
   */
  archivo: string;
  /** Del contenido original al mutado. */
  mutar: (original: string) => string;
};

/** Añade texto al final. Sirve para los que miran un archivo entero. */
const append = (texto: string) => (o: string) => o + texto;

export const CASOS: Caso[] = [
  {
    guardian: "check:raya",
    rotura: "una raya en una cadena de copy del diccionario",
    archivo: "app/[lang]/dictionaries/es/common.json",
    mutar: (o) => o.replace(/"([^"]{12,})"(\s*[,}])/, '"$1 — con raya"$2'),
  },
  {
    guardian: "check:palette",
    rotura: "un hex de token copiado a mano en un componente",
    archivo: "lib/utils.ts",
    mutar: append(
      '\n// #005859 copiado a mano donde no toca\nexport const MAL = "#005859";\n',
    ),
  },
  {
    guardian: "check:palette",
    rotura: "aparece una animación propia y el censo no la ha visto (D90)",
    // Un `@keyframes` es la tercera rama de la condición de re-medir de la DoD, y
    // la más limpia de mutar: cambia la huella del censo sin tocar ningún token,
    // así que lo que se comprueba es exactamente este control y no otro.
    archivo: "app/globals.css",
    mutar: append(
      "\n@keyframes guardian-de-mentira {\n  to { opacity: 1; }\n}\n",
    ),
  },
  {
    guardian: "check:experiencias",
    rotura: "un bullet que existe en ES y no en EN",
    archivo: "content/experience-copy/en.ts",
    // Se quita un bullet entero, que rompe la PARIDAD ES↔EN. No es un caso malo
    // cualquiera: .qlty/qlty.toml excluye estos dos archivos del análisis de
    // duplicación con el argumento de que su duplicación estructural es
    // «exactamente la propiedad que check:experiencias existe para GARANTIZAR».
    // O sea que un informe de calidad se apoya en este guardián, y hasta hoy
    // nadie había comprobado que supiera fallar.
    mutar: (o) => o.replace(/\n      \{\n        cv: [\s\S]*?\n      \},/, ""),
  },
  {
    guardian: "check:cv",
    rotura: "el contenido del CV cambia y los PDFs no se regeneran",
    archivo: "content/cv/content.es.ts",
    mutar: (o) => o.replace(/"([A-Za-zÁÉÍÓÚáéíóúñ]{6,})"/, '"$1X"'),
  },
  {
    guardian: "check:artefacto",
    rotura: "se edita el .mmd y no se vuelve a generar el SVG",
    archivo: "content/artefactos/emendu-mdm.mmd",
    mutar: append("\n%% comentario que no está en el SVG publicado\n"),
  },
  {
    guardian: "check:contexto",
    rotura: "un @-importado engorda por encima del techo",
    archivo: "PRD-Live.md",
    mutar: append("\n" + "relleno ".repeat(4000) + "\n"),
  },
  {
    // La OTRA mitad del presupuesto (P68.67). Sin este caso, la mitad que
    // vigila las skills podría no mirar ninguna y seguir pareciendo un
    // aprobado, que es el modo de fallo que este archivo entero existe para
    // cazar.
    guardian: "check:contexto",
    rotura: "una skill engorda por encima de su techo por entrada",
    archivo: ".claude/skills/gates-de-servidor/SKILL.md",
    mutar: append("\n" + "relleno ".repeat(7000) + "\n"),
  },
  {
    // La TERCERA mitad del presupuesto (P68.5907): el techo a la SUMA de skills,
    // que es lo que impide que retirar de un documento sea una mudanza.
    //
    // El caso tiene que engordar el conjunto SIN cruzar el techo por entrada, o
    // el guardián saldría rojo por el control de al lado y este quedaría sin
    // probar — que es exactamente el modo de fallo que este archivo combate. Por
    // eso el relleno se calcula desde el tamaño real del archivo y lo deja en
    // ~3.900 palabras, por debajo del techo (4.600) y del objetivo (4.500) por
    // entrada. Si algún día la skill ya midiera más que eso, el relleno sale cero
    // y el caso falla RUIDOSAMENTE (el guardián no dice que no), que es la
    // dirección correcta de fallo.
    guardian: "check:contexto",
    rotura: "la suma de skills engorda por encima del techo del conjunto",
    archivo: ".claude/skills/sprint-review/SKILL.md",
    mutar: (o) => {
      const falta = 3_900 - o.split(/\s+/).filter(Boolean).length;
      return o + "\n" + "relleno ".repeat(Math.max(0, falta)) + "\n";
    },
  },
  {
    // La CUARTA mitad del presupuesto (P50.72): no el dato contra el umbral, sino
    // el UMBRAL. Los tres techos se movieron siete veces en nueve días y nadie
    // estaba apuntado a eso; la métrica que lo abrió es que retirar 651 palabras
    // de verdad compró 7 de margen, porque el techo bajó 400 en el mismo commit.
    //
    // Se muerde la apertura del ciclo, no el historial: retrasarla mete los siete
    // movimientos reales dentro de la ventana y el contador tiene que salir rojo.
    // Mutar el historial en su lugar sería inventar un movimiento que no ocurrió,
    // y este caso vale más contando los que sí.
    guardian: "check:contexto",
    rotura:
      "un techo se mueve dos veces en el mismo ciclo y el contador no lo ve",
    archivo: "scripts/check-contexto.ts",
    mutar: (o) =>
      o.replace(
        'const CICLO_ABIERTO = "2026-08-28";',
        'const CICLO_ABIERTO = "2026-08-01";',
      ),
  },
  {
    guardian: "check:indices",
    rotura: "una pieza de components/ui/ se queda sin declarar su línea",
    // El caso de verdad es una pieza NUEVA sin declarar, pero el mutador trabaja
    // sobre archivos que ya existen: quitarle la línea a una es la misma
    // ausencia, y la que el check tiene que ver.
    archivo: "components/ui/rich.tsx",
    mutar: (o) => o.replace(/^\/\/ @pieza .*$\n/m, ""),
  },
  {
    guardian: "check:indices",
    rotura: "una decisión se queda sin línea en el índice",
    // El índice vive en la cabecera del propio archivo desde D88. La entrada del
    // índice empieza por `- D33 ·`; la cabecera de la decisión, por `## D33 ·`,
    // así que la mutación quita la línea del índice y no la sección.
    archivo: "DECISIONS.md",
    mutar: (o) => o.replace(/^- D33 · .*$/m, ""),
  },
  {
    guardian: "check:rutas",
    rotura: "una página que existe en disco y no está en el registro",
    archivo: "lib/routes.ts",
    // Se borra un slug de STATIC_PAGE_SLUGS. En el repo de verdad eso además no
    // compilaría —los dos Record del sitemap y de llms.txt dejarían de ser
    // exhaustivos—, pero el guardián corre con tsx, que transpila sin comprobar
    // tipos: aquí se mide lo que ve él, que es el disco contra el registro.
    mutar: (o) => o.replace(/\n  "cookies",/, ""),
  },
  {
    guardian: "check:skills",
    rotura: "una skill nombra un archivo que ya no existe",
    archivo: ".claude/skills/close-session/SKILL.md",
    mutar: append("\nVer `lib/esto-no-existe.ts` para el detalle.\n"),
  },
  {
    guardian: "check:marco",
    rotura: "una página se queda sin enlace de salto (WCAG 2.4.1, nivel A)",
    // ÚNICO CASO QUE MUERDE UN ARTEFACTO DEL BUILD y no un archivo fuente, y es a
    // propósito: la ENTRADA de este guardián es el HTML que el sitio emite, no el
    // código que lo genera. Romper el componente no se vería sin volver a
    // construir —dos minutos por caso—, y sobre todo probaría otra cosa: que el
    // build propaga el cambio, no que el detector sabe verlo.
    //
    // El archivo está en `.gitignore`, así que el `git status` de arriba y el de
    // abajo no lo ven; la restauración es la misma de siempre, desde memoria.
    archivo: ".next/server/app/es.html",
    mutar: (o) => o.replace(/<a href="#main"[\s\S]*?<\/a>/, ""),
  },
  {
    guardian: "check:marco",
    rotura: "una página publica la tarjeta OG de la home en vez de la suya",
    // El caso malo NO es inventado: es lo que `/contacto` hacía en producción
    // desde el sprint 3 hasta P70.03. D72 derivó el TIPO de tarjeta del registro
    // y dejó el DESPACHO escrito a mano, así que la página del embudo compilaba,
    // pasaba `check:rutas` y publicaba «Del discovery al dato» a quien pegara su
    // enlace en LinkedIn. Tercer caso que muerde el build, por lo de siempre: la
    // entrada de este guardián es el HTML emitido.
    archivo: ".next/server/app/es/contacto.html",
    mutar: (o) => o.replaceAll("card=contacto", "card=home"),
  },
  {
    guardian: "check:articulo",
    rotura: "cambia el copy del artículo y la fecha que ve Google no se mueve",
    // El caso malo es el estado real hasta P70.04: `ARTICLE_UPDATED` pasó DOCE
    // commits congelada en el 21 de agosto, uno de ellos con un capítulo nuevo,
    // mientras el JSON-LD y el sitemap le decían a Google que el artículo no se
    // tocaba. No lo vio nadie porque el `ByLine` no pinta fecha.
    archivo: "app/[lang]/dictionaries/es/como-se-ha-creado.json",
    mutar: (o) =>
      o.replace('"text": "', '"text": "Un párrafo nuevo del artículo. '),
  },
  {
    guardian: "check:accesibilidad",
    rotura:
      "cambia una fuente que /accesibilidad describe y su bloque no se revisa",
    // `lib/figures.ts` es dependencia de los «Límites», que es donde la página
    // dice que dos diagramas se miden y no se juzgan. El día que se rediseñen
    // (P68.593) esa tarjeta pasa a mentir, y este es el escenario real.
    archivo: "lib/figures.ts",
    mutar: append("\n// cambio en las figuras que la página describe\n"),
  },
  {
    guardian: "check:accesibilidad",
    rotura:
      "la página publica un recuento de guardianes que ya no es el que hay",
    // EL CASO QUE ABRIÓ LA TAREA, y no es hipotético: decía «catorce
    // comprobaciones y veintitrés errores fingidos» habiendo quince y
    // veintisiete. Se muerde la cifra publicada, que es la que un visitante lee.
    //
    // DISPARA DOS DE LAS TRES REGLAS A LA VEZ —el recuento y el sello de
    // `conformance`, que también depende de este archivo— y está bien: lo que se
    // prueba es que el guardián tiene dientes, no cuál de ellos muerde. La regla
    // del recuento tiene además su propia red en el informe, que imprime las dos
    // cifras enfrentadas.
    archivo: "lib/design-values.ts",
    mutar: (o) =>
      o.replace(
        "export const GUARDIAN_CASE_COUNT = ",
        "export const GUARDIAN_CASE_COUNT = 99; //",
      ),
  },
  {
    guardian: "check:marcas",
    rotura: 'un nombre propio se pinta suelto, sin `translate="no"`',
    // Tercer caso que muerde el build, por lo de siempre: la entrada de este
    // guardián es el HTML emitido. Y la rotura es EXACTAMENTE el estado del
    // sitio hasta P70.12 — `translate` no aparecía ni una vez en todo el repo—,
    // así que quitarle el atributo a una aparición reproduce el fallo real y no
    // uno inventado. Se muerde una sola: el guardián tiene que cazar la que
    // falta, no notar que faltan todas.
    archivo: ".next/server/app/es/trayectoria.html",
    mutar: (o) => o.replace('<span translate="no">', "<span>"),
  },
  {
    guardian: "check:figuras",
    rotura:
      "un diagrama se queda con el tope más estrecho que su propio lienzo",
    // Segundo caso que muerde el build, por la misma razón que el de arriba: la
    // entrada de este guardián es el HTML emitido. Y la rotura elegida NO es
    // inventada — es exactamente el fallo que tenían s01, s03 y s09 antes de
    // P68.59: un `max-w` por debajo del `viewBox` es una escala <1 permanente,
    // así que el rótulo no llega a 11px pintados ni con toda la pantalla.
    // Con 300 sobre un lienzo de 540, el rótulo de 11 unidades cae a 6,1px.
    archivo: ".next/server/app/es/como-se-ha-creado.html",
    mutar: (o) => o.replace("max-w-[540px]", "max-w-[300px]"),
  },
  {
    guardian: "check:articulo",
    rotura:
      "cambia una fuente que el artículo describe y su sección no se revisa",
    // `next.config.ts` es dependencia de la §07 («seguridad, alojamiento y la
    // deuda que no se acumuló»), que es exactamente la sección que va a
    // invalidar la CSP estricta con nonces (P64.5). El caso malo es el escenario
    // real, no uno inventado.
    archivo: "next.config.ts",
    mutar: append("\n// cambio en las cabeceras que el artículo describe\n"),
  },
  {
    guardian: "check:articulo",
    rotura: "una cita vuelve a guardar su línea a mano en el diccionario",
    // La regresión de la capa 1. Una línea escrita a mano no rompe nada visible
    // —el enlace sigue abriendo el archivo, solo que en el párrafo equivocado—,
    // que es cómo 27 de 38 citas llevaban días apuntando diez líneas arriba.
    archivo: "app/[lang]/dictionaries/es/como-se-ha-creado.json",
    mutar: (o) =>
      o.replace(
        /\{ "label": "D29", "path": "DECISIONS\.md" \}/,
        '{ "label": "D29", "path": "DECISIONS.md", "line": 844 }',
      ),
  },
  {
    guardian: "check:articulo",
    rotura: "un «dato en vivo» vuelve a tener su cifra tecleada",
    // La regresión de P68.495. La pieza se llama `livestat` y su etiqueta dice
    // «dato en vivo»; dos de los tres lo prometían con un número a mano, y los
    // dos ya mentían cuando alguien los leyó. Nada se rompe al teclearlo: se
    // publica una cifra que envejece sola.
    archivo: "app/[lang]/dictionaries/es/como-se-ha-creado.json",
    mutar: (o) =>
      o.replace(
        '"value": "{piezasNucleo} piezas + capa de página"',
        '"value": "Ocho piezas + capa de página"',
      ),
  },
  {
    guardian: "check:articulo",
    rotura: "el diagrama de CI se queda un paso corto respecto al workflow",
    // El pie deriva su cifra de `ci.yml` y las pastillas son un dibujo: sin la
    // comparación, un paso nuevo movería el pie y dejaría el diagrama corto sin
    // que se rompiera nada. Muerde la lista ES; el guardián mira los dos idiomas.
    archivo: "content/articulo/ci-steps.ts",
    mutar: (o) => o.replace('          { n: "Tests", cat: "patron" },\n', ""),
  },
  {
    guardian: "test",
    rotura:
      "el Reply-To vuelve a componerse concatenando y cuela una segunda dirección",
    // El arnés de tests entra aquí en cuanto entra en CI (P68.494): a partir de
    // ese momento es un gate, y un gate cuyo modo de fallo es una luz verde
    // necesita su caso malo como cualquier otro. El caso es la regresión de
    // P68.47 literal, que es el bug que motivó escribir los tests.
    archivo: "lib/mailer.ts",
    mutar: (o) =>
      o.replace(
        "replyTo: { name: nombre, address: replyTo },",
        "replyTo: `${nombre} <${replyTo}>`,",
      ),
  },
  {
    guardian: "test",
    rotura: "la unicidad de prioridades del tablero deja pasar un par repetido",
    // `check:tablero` corre fuera de CI porque leer Notion necesita su MCP, así
    // que aquí no se le puede mutar la entrada: no hay volcado que romper. Lo que
    // sí está en el repo es su CRITERIO, y es lo que se muerde — con la rotura
    // exacta que lo dejaría ciego al caso que lo motivó, dos tareas con 69,93.
    archivo: "scripts/tablero/reglas.ts",
    mutar: (o) =>
      o.replace("if (grupo.length > 1) {", "if (grupo.length > 2) {"),
  },
  {
    guardian: "test",
    rotura:
      "el umbral del embalse transversal sube y `General` puede crecer sin avisar",
    // La otra mitad del criterio del tablero, y la que más fácil se queda muda: el
    // cupo de `General` llevaba un sprint escrito SIN instrumento, así que aquí lo
    // que se muerde es el número que decide si el neto es ruido o alarma. Con el
    // umbral por las nubes el guardián sigue imprimiendo su línea —que es lo que
    // lo haría parecer vivo— y ya no rechaza nada.
    archivo: "scripts/tablero/reglas.ts",
    mutar: (o) =>
      o.replace(
        "export const VARIACION_ROJA = 4;",
        "export const VARIACION_ROJA = 400;",
      ),
  },
  {
    guardian: "check:excepciones",
    rotura: "un control a mano se queda sin su marca `@fuera-de-capa`",
    // Se le quita la marca al switch del consentimiento, que es un control a mano
    // real y declarado en BRAND.md.
    //
    // HA CADUCADO DOS VECES, Y LAS DOS POR EL MISMO MOTIVO: el archivo elegido dejó
    // de tener marca porque su pieza SALIÓ de la lista de excepciones. Apuntaba a
    // `page-closer.tsx` y P70.15 lo sacó a la variante `card` (2026-08-25);
    // apuntaba después a `article.tsx` y P70.38 se llevó la celda del índice a
    // `indexCellVariants` (2026-08-26). Las dos veces la mutación dejó de mutar y
    // las dos las cazó este script — que es exactamente para lo que existe: un caso
    // malo que ya no muerde puntúa como verde.
    //
    // LA LECCIÓN, que ya no es «prefiere el que no está tareado» sino algo más
    // fuerte: **la lista de excepciones es la peor fuente posible de un caso malo,
    // porque su razón de ser es vaciarse**. Cada excepción que se cierra —que es
    // trabajo bueno— rompe este caso. De los dos que quedan, el switch es el más
    // estable: su motivo declarado no es «falta una variante» (que alguien puede
    // crear) sino que la cascada **aplica hacia delante y no hacia atrás**, así que
    // no sale por hacer bien el trabajo, solo si se rehace el banner entero.
    archivo: "components/site/consent-banner.tsx",
    mutar: (o) => o.replace("@fuera-de-capa:", "control a mano:"),
  },
];
