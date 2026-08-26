# PRD Live — Web personal de Francisco López

> **Spec viva: qué es el producto hoy y qué tiene que cumplir.** Present-tense,
> estado actual. El **registro completo de decisiones y su porqué** (secciones
> fechadas, debates, cosas revertidas) vive en **[PRD-Historical.md](./PRD-Historical.md)**.
> Convenciones de código → `CLAUDE.md` · decisiones técnicas → `DECISIONS.md` ·
> sistema de marca → `BRAND.md` (su porqué fechado → `BRAND-historical.md`) ·
> overview/stack → `README.md`.

## 1. Propósito

Web personal de **Francisco López**, Senior Product Manager (10+ años en SaaS B2B y
B2C, con un exit: TheTool → AppRadar). **Objetivo: facilitar el cambio de trabajo**
demostrando criterio de Producto, SaaS, UX, mentalidad builder, IA aplicada y Growth.
La propia web es la **prueba de criterio técnico y de diseño** — no un CV en HTML.

## 2. Audiencia — dos velocidades de lectura

| Perfil | Cómo lee | Qué necesita |
|---|---|---|
| HR / Recruiter | Escaneo 5-10s | Rol, seniority, stack |
| CEO / CPO / VP Product | Lectura profunda | Outcomes, criterio de producto |

El **above the fold pasa el filtro de RRHH**; al hacer scroll, el contenido
profundiza para perfiles de Producto.

**ICP de empresa objetivo:** SaaS con product-market fit, con función de producto real
(PM/Product Designer o founder con peso en producto), IA integrada en el día a día,
remoto o híbrido fuerte, en España.

## 3. Posicionamiento y narrativa

En orden: **1) Senior Product Manager · 2) Cofundador con exit · 3) ADN Growth.**
**Reveal gradual**: el exit/founder no aparece en el Hero; se descubre al hacer scroll.
Hitos, justo debajo del Hero, es la red de seguridad para el lector rápido.

## 4. Estado actual — en producción (`franciscolopez.es`)

**Catorce páginas por idioma**, en ES (raíz `/`) y EN (`/en`):

- **Home**, una sola página con las diez secciones de abajo.
- **Sobre mí**, **Brand Kit**, **Design System**, **Accesibilidad**, **Privacidad y
  cookies** (en `/cookies`, con la información del art. 13 del RGPD) y **Cómo se ha creado
  esta página** (D14, el artículo del sprint 2, `TechArticle`).
- **Contacto** (`ContactPage`), con los dos canales y el **formulario**: la primera
  superficie que recibe algo escrito por otra persona. Envío por Server Action del mismo
  origen (la CSP no cambió) y por el SMTP de la propia cuenta, sin encargado nuevo.
- **El deep-dive por experiencia**: el índice `/trayectoria` y las cinco páginas de
  `/trayectoria/[slug]` (Emendu, KUOTIP, INDYA, Freepik y TheTool). Catorce por idioma son
  las **28 variantes** que usan `gate:html`, el sitemap y el recorrido de `design-review`.

Y con ellas: **CV en PDF bilingüe** descargable con identidad de marca y generado por
código · **SEO técnico y Open Graph** por página · **medición** (GA4/GTM con
consentimiento RGPD) · **dominio propio** · **páginas 404/500 de marca e i18n** ·
**cabeceras de seguridad** (nosniff, X-Frame-Options, Referrer-Policy,
Permissions-Policy, HSTS y CSP con allowlist mínima).

**La marca no termina en el dominio.** Firma de email (monograma split, nombre en
Bricolage y canales), banner de LinkedIn y portada del repositorio comparten el mismo
titular que el Hero, «Del discovery al dato», y el mismo monograma. Es la prueba de
coherencia que un sistema de marca solo puede dar fuera de su propio sitio.

La apertura de **Sobre mí es un vídeo**: se reproduce una vez y se queda en su último
fotograma; con `prefers-reduced-motion` se sirve una imagen quieta y el vídeo **no se
descarga** (D65).

### Estructura de la home (orden actual)

1. **Nav sticky** — logo (split→flat al scroll), Descargar CV, Contacto, Sobre mí, toggle
   claro/oscuro; por debajo de 768px los tres enlaces colapsan tras el menú.
2. **Hero** — foto, headline "Del discovery al dato", subheadline; sin CTA propio.
3. **Hitos** — 5 reconocimientos, cronológico descendente; chip "Exit" en el de TheTool.
4. **Cómo trabajo** — 6 etapas: Discovery → UX → Prototipado → Desarrollo → Lanzamiento → Analítica.
5. **Más allá del PM** — banda de manifiesto (founder + growth), fondo de marca invertido.
6. **Trayectoria** — bloque Producto + bloque Experiencia previa (Marketing & Growth); logos reales monocromo; el rol enlaza al deep-dive; CTA Descargar CV.
7. **Toolkit** — 4 categorías (Usuarios / Gestión y Documentación / Diseño y prototipado / Desarrollo) en pestañas, logos reales monocromo.
8. **Formación** — Producto + Marketing.
9. **Franja-CTA de cierre** — banda de fondo propio con copy de posicionamiento al ICP y
   **una sola acción**, el botón sólido que lleva a `/contacto`. Los canales sueltos que
   la acompañaban salieron al existir esa página: allí están mejor.
10. **Footer**, en dos filas — arriba, la firma con el nombre en lockup, los enlaces y los dos canales de icono; abajo, una línea fina con los derechos y el enlace de privacidad y cookies. Los enlaces van en jerarquía: **El Making of** destacado y las tres páginas del sistema (Brand Kit, Design System, Accesibilidad) agrupadas detrás de un filete. La distinción la hace el tono del chrome, nunca `primary`.

### Tres cosas que el sitio hace y no se ven mirándolo

- **Las páginas que documentan el sistema no pueden mentir.** El Design System y el
  Brand Kit publican **las piezas reales del sitio como demo**: si una variante cambia,
  la página cambia con ella. Y no leen sus valores
  del diccionario, sino de `lib/design-values.ts` (D38), fuente única de lo que el sitio
  publica sobre sí mismo — tokens de layout, breakpoints y el censo de pares de contraste
  medidos. El diccionario se queda solo con el copy.
- **Las superficies de contacto son dos, y la diferencia es deliberada** (D29): la franja
  de la home y el cierre de Sobre mí llevan a `/contacto`; el «reportar una barrera» de
  Accesibilidad **no**, y enseña la dirección escrita con su asunto. Obligar a usar el
  formulario para reportar una barrera sería una trampa el día que la barrera fuera él.
- **Una página no se escribe: se compone.** `pageMetadata` deriva canonical, los tres
  `hreflang`, OG y Twitter de una sola fuente, y `<PageShell>` pone JSON-LD, nav, isla de
  motion, el `<main>` y footer (D45/D46). Las catorce se **prerenderizan** por locale y el
  diccionario está **partido por página** (D48). Y **qué páginas hay lo dice un solo
  sitio**: registrarlas mal no es un hallazgo de auditoría sino un error del
  compilador, y un guardián contrasta el registro con el disco (D72). Es lo que hace
  que una página nueva nazca con el `hreflang` correcto, con enlace de salto,
  estática, y dentro del sitemap, del gate, de `/llms.txt` y de su propia tarjeta
  OG, sin que nadie se acuerde.

## 5. Sistema (criterios de aceptación, no aspiraciones)

### Stack y arquitectura

Next 16 (App Router), TypeScript `strict`, Tailwind v4 y capa de componentes propia.
**shadcn/ui está configurado y sin usar**: en un widget se pregunta antes por la
plataforma, y entra donde ella no llega (D6). i18n nativo `app/[lang]`, diccionario tipado,
cero strings hardcodeados. Detalle en `README.md` y `DECISIONS.md`.

### Marca

Regla de dos capas (cian = único color de acción; morado decorativo con cuentagotas),
tipografía Bricolage/Inter, logo con split. Detalle en `BRAND.md`.

### Capa de componentes — un núcleo de ocho

El **núcleo** son ocho: `action` (el control con caja), `chrome` (el enlace de la
carpintería de navegación), `badge` (el rótulo que no se pulsa), `heading` (el par
eyebrow + titular), `field` (el campo de formulario), `table`, `stat-row` y `layout`
(cajas y ritmos). Encima, la **capa
de página**: `lib/page-meta.ts` y `components/site/page-shell.tsx` (D45/D46). Y aparte,
no encima, la de **artículo largo**, que D76 dejó fuera del núcleo a propósito — y que
se vacía por su propio criterio: cuando una segunda página quiere una de sus piezas,
esa pieza sale (`LiveStat` en D113, el índice y el cierre en D121) — **y vuelve si su
motivo no valía en las cuatro**: el riel se probó en tres páginas y volvió (D123).

**Qué hay exactamente en `components/ui/` no lo dice este párrafo: lo dice
`components/ui/README.md`, derivado del disco** y comprobado en cada PR, con la frase de
cada pieza y la sección donde se publica (D89).

Cuál toca se decide con dos preguntas — **¿se pulsa?** y, si sí, **¿tiene caja propia?** —
no por parecido: un chip que solo rotula no es un botón pequeño, y un enlace de nav
tampoco. **Ninguno se escribe con clases sueltas**: si un caso no encaja en una variante,
se crea la variante; la excepción se documenta con fecha. Es lo que hace que un cambio de
hover, de radio, del objetivo táctil o del icono de una acción llegue a todo el sitio a la
vez. Los iconos son de **lucide**; los que lucide no trae (LinkedIn y GitHub) se dibujan a
mano con la regla de autoría de iconos propios. Detalle en `BRAND.md` y en
`DECISIONS.md` D6/D35/D36/D40/D43/D64.

**Y toda página y toda sección abren igual**: el ordinal dentro del eyebrow, el titular
como afirmación y entradilla debajo, con el hueco puesto por la capa (D43).

### No funcionales

| Criterio | Umbral | Estado |
|---|---|---|
| PageSpeed / Lighthouse | >90 escritorio y móvil | **Cumplido en las catorce.** La cifra y su fecha las sella `npm run psi -- --registro`, y de ahí las lee el artículo (D102) |
| Accesibilidad | AA de suelo, AAA objetivo | **Cero pares bajo AAA** y **cero contornos bajo el 3:1 de WCAG 1.4.11** en las catorce × 2 temas, en reposo y en hover, con el metro validado en cada corrida (D85/D97/D104); **0 violaciones de axe** |
| SEO + JSON-LD por página | Criterio de cierre, no extra | Cumplido en las catorce |

**Cómo se mide el contraste lo dice `BRAND.md` §Cómo se hace el censo**, entero y con sus
siete trampas; aquí solo el criterio y el estado. Lo que importa para el alcance: la pasada
lee las páginas del **registro**, así que una página nueva entra sin que nadie se acuerde
(D85), y las cifras publicadas salen de `lib/design-values.ts` (D38).


### Cómo se verifica lo que no ve un compilador

- **Gate de accesibilidad**: `agent-browser` conducido por el subagente
  `viewport-verifier`, con su matriz de viewports × temas + `reduced-motion`. **Cuándo se
  dispara —dos veces, y la primera mientras se dibuja— lo dice `CLAUDE.md`** (D50/D52).
- **Pasada con lector de pantalla**: NVDA sobre el sitio entero, no por página. Es la
  única capa que encuentra lo que **no incumple ninguna regla** y por tanto ningún motor
  automático puede señalar: un `Esc` que no cierra, un cambio de tema que no se anuncia, un
  aviso de consentimiento que se lee el último. Lo que encuentra se publica en la propia
  página (D73).
- **`npm run check:marco`**: el criterio de cierre de página nueva, en cada PR (D75). Sobre
  el HTML **prerenderizado** de las 28 variantes: axe estructural, el enlace de salto que axe
  no ve, `h1` y jerarquía, breadcrumb, que la metadata derivada **llegó**, que el `?card=`
  de cada variante **resuelve a su propia tarjeta** y no a la de la home (P70.03), y que los
  `@id` del JSON-LD **resuelven** — las dos últimas, cosas que ningún validador externo
  hace. Contraste y objetivo táctil quedan fuera a propósito: se heredan, y necesitan pintar.
- **`npm run check:figuras`**: el rótulo **pintado** de toda figura con lienzo
  escalado, sobre el prerender de las 28 variantes. `text-[11px]` dentro de un
  `viewBox` son 11 unidades, no 11 píxeles, y esa escala no está en el
  `font-size` computado (P68.59). En CI, no en el censo: no necesita navegador.
  **Confirma en vez de sostener**: el tamaño lo pone la capa, que lo deriva del
  único ancho que un diagrama declara, y un lienzo desconocido no compila (D114).
  Uno de ancho fijo que se desplaza se mide y se nombra, no se juzga.
- **`npm run check:marcas`**: que los nombres propios lleguen al HTML con
  `translate="no"`, o el traductor de Chrome hará «La Herramienta» de «TheTool».
  Lo pone una capa y el copy no lo escribe, así que recorre los nodos de TEXTO de
  las 28 variantes exigiendo un ancestro marcado, en vez de contar cuántos hay
  (D116). Fuera del contrato, dicho en cada corrida: el `<head>`, los atributos y
  el interior de un `<svg>`.
- **`npm test`**: la lógica que no necesita navegador, y por eso en CI al revés que `psi` y el
  censo. Son dos: la del formulario —validación, saneado de cabeceras y decisiones de la Server
  Action, medidas sobre el mensaje que nodemailer **emite** (D101)— y las reglas del tablero,
  que es lo que deja a su guardián vivir fuera de CI (D107).
- **`npm run gate:html`**: compara el HTML servido de las 28 variantes antes y después de
  un refactor. Diff vacío = transparente por construcción. Es el gate que más ha cazado
  y no está en CI (D42/D45).
- **`npm run check:articulo`**: cada sección de «Cómo se ha creado esta página» declara de
  qué depende y lleva su sello. Cuando una fuente se mueve, CI sale rojo **nombrando la
  sección**, en el PR que la mueve — no dice que el texto sea falso, dice que hay que
  mirarlo (D84). Y qué líneas cambiaron lo dice `articulo:novedades` (D103). Sella
  aparte **el copy del artículo**, y ahí la pregunta es otra: si ese sello se mueve y
  `ARTICLE_UPDATED` no, sale rojo, porque esa constante es el `dateModified` que ve
  Google y no se pinta en ninguna página (D110).
- **`npm run censo`**: el contraste de las páginas del registro × dos temas, fuera de CI
  porque necesita navegador (D85). **Son dos pases**: los pares de TEXTO (1.4.3/1.4.6) y el
  **contorno de cada control** (1.4.11, 3:1), que axe no implementa y por tanto no mira
  nadie más (D97). **Y deja sello**: al pasar en verde firma los tokens
  de color, las superficies y las animaciones que había, y `check:palette` compara ese
  sello en cada PR, así que la condición de re-medir de la DoD la lee una máquina (D90).
- **`npm run psi -- --registro`**: la nota de PageSpeed de las páginas del registro contra
  producción, a demanda y nunca como gate de CI, porque su variabilidad daría rojos falsos
  (D49/D99).
- **`npm run check:kit`**: que el registro del kit (`lib/logo-kit.ts`) y `public/logo-kit/`
  cuadren **en los dos sentidos**. El ZIP no se vigila: se genera en el build (D119).
- **`npm run check:tablero`**: que `Prioridad` siga siendo un orden —números únicos, estados de
  ejecución dentro del sprint, `Área` en todas—, sobre un volcado del tablero, que era la
  última fuente de verdad sin red. Fuera de CI (leer Notion necesita su MCP); el criterio,
  vigilado en `npm test` (D107).

### Calidad y seguridad

CI en cada PR, y **cuáles son los pasos lo dice `ci.yml`**: enumerarlos aquí ya ha caducado
dos veces. Todos comparten una regla de método: **buscan la AUSENCIA, no el patrón**, y
**afirman cuánto han mirado** — un metro que devuelve lista vacía parece un aprobado, y este
proyecto se lo ha encontrado cinco veces (D38/D57/D60/D63).

`main` **la protege el servidor y no la disciplina**: sin push directo, sin merge con CI
en rojo, sin bypass de admin, y solo `squash` o `rebase` (D68). Escaneo de dependencias
con Dependabot. Cabeceras de seguridad servidas, con la CSP en allowlist mínima: base +
GTM/GA4, Clarity (D32) y `youtube-nocookie` (D55). Se mantiene `'unsafe-inline'`, desde el
2026-08-24 **por coste medido**: quitarlo exige nonces, y el nonce cuesta el prerenderizado
de las catorce páginas (D26). Va con la IA conversacional (V4), que hereda ese coste.

El **repositorio es público** desde el 2026-08-19, con `LICENSE` explícito («público para
consulta, no código abierto») y enlace en el footer.

### Revisiones recurrentes

| Skill | Qué mira | Cuándo |
|---|---|---|
| `sprint-review` | Técnica: código, deuda, drift docs↔código, y el **check de medición** | Al cerrar etapa, automático |
| `design-review` | Diseño: cumplimiento del sistema + expresión de marca, **en pantalla** | Manual, antes de un release visual |
| `close-session` | Documentación, altas **y retiradas** | Al cerrar sesión |

## 6. CV en PDF

Bilingüe (ES/EN), 2 páginas, ATS (texto seleccionable), con identidad de marca.
**Generado por código desde fuente única**: los hechos (roles, fechas, formación,
toolkit) se leen del diccionario i18n; el CV solo autora el texto rico. Se regenera con
`npm run cv`. Detalle técnico en `DECISIONS.md` D22; flujo de actualización en el skill
`update-cv`.

## 7. Métricas de éxito

- **Primaria**: **envíos del formulario de `/contacto`** (`contact_submit`), contados
  cuando el servidor confirma y no al pulsar. El porqué del cambio, en `PRD-Historical.md`.
  **La cadena está entera desde el 2026-08-24**: el `dataLayer` lo recoge un trigger de
  Custom Event con su tag de GA4 —comprobado en el `gtm.js` publicado, que es como se
  audita la mitad que vive fuera del repo (D71)— y en GA4 está marcado como **evento
  clave**. La marca no es retroactiva: cuenta desde ahí.
- **Secundarias**: los `tel:` y `mailto:` que quedan, Descargar CV (3 puntos: nav, CTA de
  Trayectoria, Contacto) y profundidad de scroll.
- **Herramienta**: GA4 (captura scroll y descarga de fábrica).

## 8. Datos del candidato

- **Francisco Javier López Martínez** — Senior Product Manager, SaaS B2B / B2C
- Email: `franciscojavier.lopezmartinez@gmail.com` · Teléfono: 629 832 720
- LinkedIn: `linkedin.com/in/franciscolopez1975` · Valencia

## 9. Alcance por versión

> El detalle ejecutable —orden, dependencias y tamaños— vive en el tablero de tareas;
> aquí solo qué entra en cada release y qué queda fuera. El porqué de cada decisión, en
> **[PRD-Historical.md](./PRD-Historical.md)**.

### V2 — entregada (2026-08-23)

Sus tres sprints de valor para el visitante están **en producción**: el deep-dive por
experiencia, «Cómo se ha creado esta página», y Contacto ampliada con su footer. Entre
ellos se intercalaron tres bloques de método. El recorrido sprint a sprint, con el porqué
de cada uno, en `PRD-Historical.md`.

**Traducción a EN**: la arquitectura i18n ya está; se traduce a medida que se añade
contenido, revisando el EN contra el ES y no al revés (D20).

**Qué NO lleva deep-dive, y no es por alcance:** las dos entradas de Marketing & Growth
(diluirían el orden del posicionamiento de §3) y **PICKASO**, que es el primer capítulo de
la historia de TheTool y no una experiencia con historia separable.

### V3 — deuda y mejoras por bloque

Sin fecha ni compromiso de release conjunto: entran en el sprint que las toque o cuando
dejen de poder esperar. Agrupadas por dónde viven — *General* (higiene de validadores,
dependencias, `qlty`), *Home*
(gesto-firma de marca, presencia del morado, kicker del Hero, `WebSite` en JSON-LD),
*Brand Kit*, *Design System* y *Accesibilidad*.

### V4 — IA conversacional

**«Pregúntale a mi carrera»** — sin definir: modelo, arquitectura, datos, coste y UX.
Arrastra la CSP estricta con nonces (§5).

**Su corpus tiene un límite fijado antes de que exista el agente: lo que no va por escrito
en el sitio, tampoco va aquí.** Un agente público publica igual que una página, y además
responde sin Francisco delante y en frases que no puede revisar, así que no sirve como
papelera de lo que se cuenta en una entrevista y no en abierto (motivos de salida,
problemas internos, límites de un equipo). **V4 absorbe profundidad sobre lo que ya es
público, no discreción.**

