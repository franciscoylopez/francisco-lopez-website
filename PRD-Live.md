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
  las **28 variantes** que recorren los gates.

Y con ellas: **CV en PDF bilingüe** descargable con identidad de marca y generado por
código · **SEO técnico y Open Graph** por página · **medición** (GA4/GTM con
consentimiento RGPD) · **dominio propio** · **páginas 404/500 de marca e i18n** ·
**cabeceras de seguridad** (nosniff, X-Frame-Options, Referrer-Policy,
Permissions-Policy, HSTS y CSP con allowlist mínima).

**Cada página se sirve también en markdown** para quien la lea con un agente: el `<main>` sin
el HTML de alrededor, por URL explícita (`/md/<locale>/<pagina>.md`, la vía estable) o pidiendo
`Accept: text/markdown`. La home baja de 216 a 6,6 KB (D158). Y esos recursos están además
**catalogados** en `/.well-known/ard.json` —con su gemela `ai-catalog.json` y un `rel="ard"` en
cada página—. Lo que no existe no se cataloga: ni MCP, ni agentes, ni skills, ni API (D166).

**La marca no termina en el dominio.** Firma de email, banner de LinkedIn y portada del
repositorio comparten el titular del Hero, «Del discovery al dato», y el mismo monograma:
la prueba de coherencia que un sistema de marca solo puede dar fuera de su propio sitio.

La apertura de **Sobre mí es un vídeo**: se reproduce una vez y se queda en su último
fotograma; con `prefers-reduced-motion` se sirve una imagen quieta y el vídeo **no se
descarga** (D65).

### Estructura de la home (orden actual)

1. **Nav sticky** — logo (split→flat al scroll), Descargar CV, Contacto, Sobre mí, toggle
   claro/oscuro; por debajo de 768px los tres enlaces colapsan tras el menú.
2. **Hero** — foto, headline "Del discovery al dato", subheadline; sin CTA propio. **El
   punto final del titular es la firma de marca** (D137): cae y se asienta al cargar, en
   morado.
3. **Hitos** — 5 reconocimientos, cronológico descendente; chip "Exit" en el de TheTool.
   Un filete crece bajo cada año conforme la fila cruza: es la **textura** que acompaña a
   la firma (D137).
4. **Cómo trabajo** — 6 etapas: Discovery → UX → Prototipado → Desarrollo → Lanzamiento → Analítica.
5. **Más allá del PM** — banda de manifiesto (founder + growth), fondo de marca invertido.
6. **Trayectoria** — bloque Producto + bloque Experiencia previa (Marketing & Growth); logos reales monocromo; el rol enlaza al deep-dive; CTA Descargar CV.
7. **Toolkit** — 4 categorías (Usuarios / Gestión y Documentación / Diseño y prototipado / Desarrollo) en pestañas, logos reales monocromo.
8. **Formación** — Producto + Marketing.
9. **Franja-CTA de cierre** — banda de fondo propio con copy de posicionamiento al ICP y
   **una sola acción**, el botón sólido que lleva a `/contacto`. Los canales sueltos que
   la acompañaban salieron al existir esa página: allí están mejor.
10. **Footer**, en dos filas — arriba, la firma en lockup, los enlaces y los dos canales de icono; abajo, una línea fina con los derechos y el enlace de privacidad y cookies. Los enlaces van en jerarquía: **El Making of** destacado y las tres páginas del sistema agrupadas detrás de un filete, con el tono del chrome y nunca `primary`.

### Tres cosas que el sitio hace y no se ven mirándolo

- **Las páginas que documentan el sistema no pueden mentir.** El Design System y el
  Brand Kit publican **las piezas reales del sitio como demo**: si una variante cambia,
  la página cambia con ella. Y sus cifras no salen del diccionario —que se queda solo con
  el copy— sino de `lib/design-values.ts` (D38), fuente única de lo que el sitio publica
  sobre sí mismo.
- **Las superficies de contacto son dos, y la diferencia es deliberada** (D29): la franja
  de la home y el cierre de Sobre mí llevan a `/contacto`; el «reportar una barrera» de
  Accesibilidad **no**, y enseña la dirección escrita. Obligar a usar el formulario para
  reportar una barrera sería una trampa el día que la barrera fuera él.
- **Una página no se escribe: se compone.** `pageMetadata` y `<PageShell>` derivan la
  metadata, el JSON-LD y el marco (D45/D46), las catorce se **prerenderizan** por locale
  (D48), y **qué páginas hay lo dice un solo sitio**, contrastado con el disco por un
  guardián (D72). Es lo que hace que una página nueva nazca con el `hreflang` correcto,
  con enlace de salto, estática, y dentro del sitemap, del gate, de `/llms.txt` y de su
  propia tarjeta OG, sin que nadie se acuerde.

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
no encima, la de **artículo largo**, que D76 dejó fuera del núcleo a propósito y que se
vacía por su propio criterio: cuando una segunda página quiere una de sus piezas, esa
pieza sale — **y vuelve si su motivo no valía en las cuatro** (D113, D121, D123).

**Qué hay exactamente en `components/ui/` no lo dice este párrafo: lo dice
`components/ui/README.md`, derivado del disco** y comprobado en cada PR, con la frase de
cada pieza y la sección donde se publica (D89).

**Cuál toca, y que ninguno se escriba con clases sueltas, lo decide la cascada de
`CLAUDE.md` §Regla de construcción**, no este párrafo. Lo que compra es que un cambio de
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

> **El contrato de cada gate —qué garantiza, qué deja fuera y dónde corre— vive en
> [`GATES.md`](./GATES.md)**, una fila por gate. Se consulta a demanda y **nunca se
> `@`-importa**: no hace falta para aplicar ninguna regla, solo cuando un check sale rojo
> diciendo su nombre o cuando hay que decidir si un gate nuevo hace falta (D163).

Lo que sí es criterio de producto, y por eso se queda aquí: **que una parte corra a mano no es
deuda, es alcance** — se es manual por necesitar pintar, por coste o por depender de un momento
concreto, y el motivo va en la fila de cada gate. Lo que no vale es serlo porque nadie lo
automatizó.

### Calidad y seguridad

CI en cada PR, y **cuáles son los pasos lo dice `ci.yml`**: enumerarlos aquí ya ha caducado
dos veces. Todos comparten una regla de método: **buscan la AUSENCIA, no el patrón**, y
**afirman cuánto han mirado** — un metro que devuelve lista vacía parece un aprobado, y este
proyecto se lo ha encontrado cinco veces (D38/D57/D60/D63).

`main` **la protege el servidor y no la disciplina**: sin push directo, sin merge con CI
en rojo, sin bypass de admin, y solo `squash` o `rebase` (D68). Escaneo de dependencias
con Dependabot. Cabeceras de seguridad servidas, con la CSP en allowlist mínima: base +
GTM/GA4, Clarity (D32) y `youtube-nocookie` (D55). Se mantiene `'unsafe-inline'` **por coste
medido**: el nonce cuesta el prerenderizado de las catorce (D26), así que va con V4.

El **repositorio es público** desde el 2026-08-19, con `LICENSE` explícito («público para
consulta, no código abierto») y enlace en el footer. Y esa frase la dice también `robots.txt`
en formato máquina —**`Content-Signal: ai-train=no, search=yes, ai-input=yes`**—, como
preferencia y no como control de acceso (D160).

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
  El transporte está entero y en GA4 es **evento clave** desde el 2026-08-24; la marca no es
  retroactiva, así que **antes de esa fecha no hay serie**. Cómo se audita la mitad que vive
  fuera del repo, en D71.
  **«Confirma» es el envío que manda correo, no los dos filtros que callan a un bot**: lo decide
  `cuentaComoEnvio` en `lib/contact-form.ts`, donde la regla tiene tests y caso malo (D153).
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

### V2 — entregada

Entera y en producción. El recorrido, en `PRD-Historical.md`.

**Traducción a EN**: la arquitectura i18n ya está; se traduce a medida que se añade
contenido, con la regla de `CLAUDE.md` (D20).

**Qué NO lleva deep-dive, y no es por alcance:** las dos entradas de Marketing & Growth y
**PICKASO**, primer capítulo de TheTool y no una experiencia separable.

### V3 — deuda y mejoras por bloque

Deuda agrupada por dónde vive —*General*, *Brand Kit*, *Design System* y
*Accesibilidad*—, más la **DISTRIBUCIÓN**, que no es una superficie y está en alcance por
decisión escrita, no por omisión.

**«Agentes» es el sprint en curso** desde el 2026-08-30: que un agente pueda encontrar, leer y
citar este sitio, que es el canal de distribución que aquí faltaba. Arrastra cuatro de *General*
y deja la **Distribución** humana aplazada por sexta vez, esta vez con motivo y no por inercia.

*(El recorrido de cada sprint cerrado, en `PRD-Historical.md`.)*

### V4 — IA conversacional

**«Pregúntale a mi carrera»** — sin definir: modelo, arquitectura, datos, coste y UX.
Arrastra la CSP estricta con nonces (§5) y la tarjeta A2A de `/.well-known/agent-card.json`,
hoy descartada porque no hay agente: el día que lo haya, es la puerta por la que se le
encuentra, y una entrada más del catálogo (D166).

**Su corpus tiene un límite fijado antes de que exista el agente: lo que no va por escrito
en el sitio, tampoco va aquí.** Un agente público publica igual que una página, y además
responde sin Francisco delante y en frases que no puede revisar, así que no sirve como
papelera de lo que se cuenta en una entrevista y no en abierto (motivos de salida,
problemas internos, límites de un equipo). **V4 absorbe profundidad sobre lo que ya es
público, no discreción.**

