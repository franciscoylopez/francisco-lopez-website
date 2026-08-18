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

V1 lanzada. En vivo:
- **Home** (una sola página), en **ES (raíz `/`) y EN (`/en`)**.
- Páginas propias: **Sobre mí**, **Brand Kit**, **Design System**, **Accesibilidad**,
  **Política de cookies**.
- **El deep-dive por experiencia** (2026-08-18): el índice **`/trayectoria`** y las cinco
  páginas de `/trayectoria/[slug]` —Emendu, KUOTIP, INDYA, Freepik y TheTool—. Con eso el
  sitio pasa de **seis páginas a doce** por idioma, que es el recuento que usan `gate:html`
  (24 variantes), el sitemap y el recorrido de `design-review`. *En rama, pendiente de
  merge a producción.*
- **CV en PDF bilingüe** (ES/EN) descargable, con identidad de marca, generado por código.
- **SEO técnico + Open Graph** por página, **medición** (GA4/GTM + consentimiento RGPD),
  **dominio propio**.
- **Páginas de error 404/500 con marca e i18n** (el 404 con el "0" del split animado) y
  **cabeceras de seguridad** (nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy,
  HSTS y CSP «A+ barato»).

### Estructura de la home (orden actual)

1. **Nav sticky** — logo (split→flat al scroll), Descargar CV, Sobre mí, toggle
   claro/oscuro; en móvil CV y Sobre mí colapsan tras menú.
2. **Hero** — foto, headline "Del discovery al dato", subheadline; sin CTA propio.
3. **Hitos** — 5 reconocimientos, cronológico descendente; chip "Exit" en el de TheTool.
4. **Cómo trabajo** — 6 etapas: Discovery → UX → Prototipado → Desarrollo → Lanzamiento → Analítica.
5. **Más allá del PM** — banda de manifiesto (founder + growth), fondo de marca invertido.
6. **Trayectoria** — bloque Producto + bloque Experiencia previa (Marketing & Growth); logos reales monocromo; CTA Descargar CV.
7. **Toolkit** — 4 categorías (Usuarios / Gestión y Documentación / Diseño y prototipado / Desarrollo) en pestañas, logos reales monocromo.
8. **Formación** — Producto + Marketing.
9. **Franja-CTA de cierre** — banda de fondo propio con copy de posicionamiento al ICP;
   el email es la acción destacada (único botón sólido del sitio) y teléfono, LinkedIn y
   CV la acompañan como canales de apoyo.
10. **Footer** — Brand Kit, Design System, Accesibilidad, Cookies, LinkedIn.

Páginas fuera de la home llevan breadcrumb y enlaces entre hermanas. El **Design System**
documenta el sistema en catorce secciones; desde el 2026-08-04 publica **«Botones y acciones»**
y desde el 2026-08-09 **«Etiquetas»**, **«Cabeceras»** y **«Tablas»**, las cuatro con las
piezas reales del sitio como demo — si una variante cambia, la página cambia con ella y no
puede mentir. Eso
dejó de ser una aspiración el 2026-08-09: **las páginas ya no leen sus valores del
diccionario**, sino de `lib/design-values.ts` (D38), que es la fuente única de lo que el
sitio publica sobre sí mismo —tokens de layout, breakpoints y el censo de pares de
contraste medidos—. El diccionario se queda solo con el copy, y el separador decimal y el
nivel WCAG se derivan en el render en vez de escribirse.

**Las tres superficies de contacto comparten un solo patrón** (franja de la home, cierre
de Sobre mí y «reportar una barrera» de Accesibilidad): mismo componente, mismos datos y
misma jerarquía, de modo que Sobre mí resuelve el contacto en la propia página en vez de
devolver al usuario a la home. Detalle en `DECISIONS.md` D29.

**Y desde el 2026-08-10, una página no se escribe: se compone.** El andamiaje —metadata y
marco— dejó de copiarse: `pageMetadata` deriva canonical, los tres `hreflang`, OG y Twitter
de una sola fuente, y `<PageShell>` pone JSON-LD, nav, isla de motion, el `<main>` y footer
(D45/D46). Las **seis páginas se prerenderizan** por locale desde que se retiró el
`not-found` anidado que las volvía dinámicas a todas (D25), y el **diccionario está partido
por página** (D48). Es lo que hace que las seis páginas del deep-dive —cinco experiencias y
su índice— nazcan con el `hreflang` correcto, con enlace de salto y estáticas, sin que nadie
tenga que acordarse.

## 5. Sistema (criterios de aceptación, no aspiraciones)

- **Stack / arquitectura**: Next 16 (App Router), TypeScript `strict`, Tailwind v4, capa de
  componentes propia. **shadcn/ui está configurado y sin usar**: entra solo para widgets con
  estado, foco atrapado o portal, y hacia delante (D6). i18n nativo `app/[lang]`, diccionario
  tipado, cero strings hardcodeados. Detalle en `README.md` y `DECISIONS.md`.
- **Marca**: regla de dos capas (cian = único color de acción; morado decorativo con
  cuentagotas), tipografía Bricolage/Inter, logo con split. Detalle en `BRAND.md`.
- **Capa de componentes — seis capas**: el control **con caja** —botón, chip, toggle,
  pestaña, control de icono— sale de `components/ui/action.tsx`; el **enlace de la
  carpintería de navegación** (nav, menú móvil, breadcrumb, footer, canales de contacto) de
  `components/ui/chrome.tsx`; el **rótulo que no se pulsa** (la pastilla de «Exit», «AAA»,
  «13,79:1») de `components/ui/badge.tsx`; el par **eyebrow + titular** de
  `components/ui/heading.tsx`; la **rejilla de filas y celdas** de `components/ui/table.tsx`
  —marcado de tabla real cuando son datos, para que un lector de pantalla ate cada cifra a su
  columna; divs cuando son especímenes—; y las cajas y ritmos comunes de
  `components/ui/layout.ts`.
  **Y las tres páginas abren igual** (2026-08-10, D43). El Design System publicaba en su
  sección de Cabeceras que «toda página y toda sección abren igual: un rótulo corto encima de un
  titular» y abría sus catorce de otra manera; Accesibilidad, igual. Eran **cuatro** copias
  privadas de la cabecera numerada, dos de ellas con las clases del titular escritas a mano.
  Ahora las 19 salen de `SectionHeader`, con el ordinal dentro del rótulo (`01 — Rejilla`) y el
  titular convertido en la afirmación que ya estaba escrita —en primera posición de la
  entradilla, de donde sube—. Y **las 19 llevan entradilla**: el Brand Kit la tenía en sus seis
  y era parte de por qué se leía como un sistema.

  **Y las dos páginas que publican todo esto se leen** (2026-08-10, D42): Design System y
  Brand Kit eran archivos de 1.512 y 1.280 líneas y pasan a ser **carpetas con un archivo por
  sección**, ninguno por encima de 391. El corte lo decidió una medición —9 de los 13
  subcomponentes auxiliares se usaban en una sola sección, así que la sección ya era la unidad
  natural— y lo verificó un **diff del HTML servido de las cuatro variantes**, que salió vacío:
  el refactor es transparente por construcción, no por revisión.
  Cuál toca se decide con dos preguntas —**¿se pulsa?** y, si sí, **¿tiene caja propia?**—,
  no por parecido: un chip que solo rotula no es un botón pequeño, y un enlace de nav
  tampoco. **Ninguno se escribe con clases sueltas**: si un caso no
  encaja en una variante, se crea la variante; la excepción se documenta con fecha. Es
  lo que hace que un cambio de hover, de radio, del objetivo táctil, del icono que lleva
  una acción o del fondo de reposo de un control solo-icono llegue a todo el sitio a la
  vez. Los iconos son de **lucide**; los que lucide no trae —hoy LinkedIn— se dibujan a
  mano siguiendo la **regla de autoría de iconos propios**, para que un icono del sitio
  no se distinga de uno de la librería. Los **widgets con estado, foco atrapado o portal**
  (diálogo, popover, tabs) se traen de shadcn en vez de escribirse —misma forma que la regla
  de iconos—, pero **hacia delante**: los que hoy están a mano funcionan, tienen 0 violaciones
  de axe y no se reescriben. Detalle en `BRAND.md` y `DECISIONS.md` D6/D35/D36/D40.
  **Y encima de las seis, la capa de página** (2026-08-10): `lib/page-meta.ts` para la
  metadata y `components/site/page-shell.tsx` para el marco, que además pone el `<main>`
  con su `id` — así el enlace de salto tiene destino en toda página, incluidas las que aún
  no existen. El hueco titular→entradilla también subió a la capa (`LEAD_GAP`): eran 32
  márgenes escritos a mano que resultaron ser cuatro decisiones, una por tamaño.
  D45/D46/D47.
- **El atenuado lo resuelve la superficie, no el punto de uso** (2026-08-09, D39). La
  utilidad `text-muted-foreground` dejó de significar «este gris» y pasa a significar «el
  atenuado del fondo donde caiga este texto»: cada superficie redefine `--surface-dim`
  mezclando el texto un 85% hacia su propio fondo. Es la generalización de D30, que existía
  desde el 2026-08-03 y **nunca se había aplicado a `--card`** —la superficie no-`background`
  más común del sitio—, donde el par daba 6,40:1 en oscuro. Los 141 usos de la utilidad
  heredaron el arreglo sin tocar un solo call site, y una tarjeta nueva nace bien sin pedirlo.
  Es la forma concreta del objetivo del bloque: **que la accesibilidad se herede**.
- **No funcionales**: PageSpeed/Lighthouse **>90 desktop y móvil**; accesibilidad **AA
  de suelo, AAA objetivo**; **SEO + JSON-LD por página** como criterio de cierre.

  **Medido el 2026-08-10 con `npm run psi`** (D49), que consulta PageSpeed desde la
  terminal y publica el **desglose del LCP**, no solo la nota: **100/100 en escritorio**
  (LCP 0,7 s) y **94-96 en móvil** (LCP 2,6-3,0 s). El objetivo se cumple en las dos. Del
  LCP móvil, el **81% sigue siendo retraso de renderizado** —bajó de 2.090 a ~1.090 ms al
  dejar de ocultar el primer pliegue para animarlo (D47)—, así que ahí queda margen, no
  incumplimiento.

  **Y se cerró el único incumplimiento de nivel A que tenía el sitio** (2026-08-10): faltaba
  el **enlace de salto** de WCAG 2.4.1. No lo vio ninguna de las tres auditorías anteriores
  porque **axe no lo detecta** —su regla `bypass` se da por satisfecha con landmarks o
  encabezados, y el sitio los tiene—; lo encontró un validador genérico. Lo pone ahora la
  capa de página, así que una página nueva nace con él (D46). **El checklist que el sitio
  PUBLICA sigue teniendo ocho puntos y ninguno es el bypass**: corregirlo es copy en ES y EN
  y está tareado.

  **Y un tercer hueco de la misma familia, cerrado el 2026-08-15: el escalado de Windows.**
  La foto de apertura de Sobre mí se dimensionaba solo por el ancho, así que en un 1920 con el
  escalado al 125% (1536×~740 de viewport CSS) o al 150% (1280×~618) se salía del pliegue y la
  cita quedaba partida por el borde de la ventana. No lo vio ninguna de las puertas que tenía
  entonces el sitio —ni Lighthouse, ni axe, ni el diff de HTML, ni PSI—, porque **ninguna
  miraba una combinación de ancho y alto que el desarrollador no tiene delante**: el ancho es
  el de siempre y lo que cambia es el alto. Lo reportó un lector con esa pantalla. El arreglo
  y su aritmética, en `DECISIONS.md` D50; el patrón vuelve en los hero del deep-dive.

  **Y desde el 2026-08-16 ya hay una puerta que lo ve** (D51). `agent-browser` fija el
  viewport, conmuta el tema y emula `prefers-reduced-motion` desde la terminal, así que la
  combinación de ancho y alto que nadie tiene delante pasa a ser comprobable: se reprodujo
  D50 a 1536×740 y la aritmética cuadró —la fórmula predice 516px y la banda mide 514—. Trae
  además axe-core nativo y las Web Vitals con la pestaña en primer plano, que es justo lo que
  una pestaña oculta no puede medir.

  **Y el método publicado ya es ese** (2026-08-16, D52). El gate de accesibilidad de
  `CLAUDE.md` deja de decir «Lighthouse + axe con `claude-in-chrome`» y pasa a `agent-browser`
  conducido por un subagente, `viewport-verifier`, que lleva la matriz de cuatro viewports ×
  dos temas y devuelve hallazgos en vez del volcado. El cambio no es de herramienta sino **de
  forma**: el gate pasa a tener **dos disparos** —uno *mientras se dibuja* una banda o un hero
  dimensionado por `vw`, otro *al cerrar*—, porque el eje que le faltaba no era el tema, era el
  **alto**, y al cerrar ya es un rediseño. De paso se separa lo que «Lighthouse» juntaba: la
  **nota** de PageSpeed sigue saliendo de `npm run psi` contra producción (D49), no de
  `vitals`, que da métricas. Y el **enlace de salto** sigue comprobándose a mano, porque axe no
  lo ve. Va **por delante del diseño** del deep-dive y no detrás: el patrón de D50 vuelve en
  los hero de sus seis páginas.

  Estado verificado el 2026-08-04: **todos los pares de color del sistema están en AAA en
  ambos temas, en reposo y en hover, sin excepciones** —la última que quedaba, el hover del
  toggle apagado, se resolvió subiéndolo de 6,35/6,98 a 7,21/7,80 sin apagar la señal visual
  del hover— y **0 violaciones de axe** en las seis páginas, en claro y oscuro, incluido el
  diálogo de consentimiento. Las cifras publicadas se miden sobre el color que el
  navegador pinta; el método está en `BRAND.md` §Accesibilidad. **Re-verificadas el
  2026-08-08** con un medidor independiente que reproduce al céntimo los ocho pares
  publicados en los dos temas — las cifras que el sitio publica son fiables; lo que
  quedaba desactualizado eran dos párrafos del propio `BRAND.md`, ya corregidos.
  **Ampliado el 2026-08-09 (P37.655 y P37.656): el censo de pares tenía tres huecos** —las
  dos pastillas (6,44/5,56 la neutra y 6,07/5,46 la teñida) y el hover del chrome secundario
  del footer y el breadcrumb (6,44/5,56)—, que ninguna de las dos auditorías anteriores vio
  por la misma razón: **un par que solo existe al componer un velo, o una pastilla de hover,
  sobre la superficie de debajo no aparece en ningún inventario de tokens**. Se encuentra
  recorriendo el DOM, no leyendo `globals.css` — y el tercero, además, solo existe mientras
  el cursor está encima. Corregidos a **8,17/9,17**, **10,63/10,02** y **12,47/12,04**; los
  dos primeros publicados en la tabla del Design System, que lista **once** pares desde que
  se le añadieron los dos que le faltaban —la bolita del switch y el hover del chrome
  secundario—. El censo completo —los trece medidos, incluidos los que ninguna página
  publica— vive desde el 2026-08-09 en `lib/design-values.ts` (D38), que es de donde leen las
  páginas: **la cifra publicada y la del reglamento dejan de ser dos copias**. Sigue habiendo
  **0 violaciones de axe** en home, Design System y Accesibilidad, ES y EN, claro y oscuro.

  **RESUELTO el 2026-08-09 (P37.6565): el atenuado sobre `--card`.** Era el incumplimiento
  que importaba —6,40 en oscuro, en todo texto atenuado dentro de una tarjeta y en las seis
  páginas— y se cierra generalizando D30 a un token de superficie (D39, arriba). El censo
  del DOM, con el metro validado contra sus anclajes, no deja **ningún par bajo AAA** en
  home, Sobre mí, Design System, Accesibilidad y Cookies, en claro y oscuro. La familia
  completa del atenuado —7,10/7,12 sobre `background`, **9,14/10,32 sobre `card`**,
  8,17/9,17 sobre `muted` y 10,32/9,89 sobre fondo invertido— se publica en la tabla del
  Design System, que pasa a listar **trece** pares. De paso cayó un par que nadie había
  medido: el rótulo del panel de tokens invertido daba **4,33 en oscuro, por debajo de AA**.

  **CERRADO el 2026-08-10 (P37.657): «sin excepciones» ya es literal.** Era el último
  incumplimiento abierto —los rótulos de la escalera split→flat del Brand Kit— y al medirlo
  resultó ser dos problemas distintos que el censo había apilado en uno. **De los «cuatro
  pares» que el PRD daba por incumplimiento, solo uno lo era**: los otros tres son los «Aa»
  de las muestras de color, de 24px y peso 600 —texto grande, donde AAA es 4,5 y no 7—, así
  que 5,21 y 6,57 **cumplían**; los marcaba el censo por aplicar el umbral de texto normal a
  todo. Lección de método, la cuarta de la misma familia: *un umbral mal aplicado inventa
  hallazgos igual que un metro mal calibrado*. **Y esa se arregló el mismo día (P37.6595):**
  el censo lee ya el tamaño y el peso de cada texto, puntúa contra el umbral que le toca y
  ordena por **holgura** en vez de por cifra, así que su lista dejó de ser de candidatos para
  volver a ser de incumplimientos. El congelado de transiciones —que el censo hacía por
  dentro— se saca a una función reutilizable para poder usarlo también **antes de axe**: sin
  él, conmutar el tema y medir da **siete violaciones fantasma** con la página perfecta.

  El que sí fallaba —`brand-purple-accent` a 10,88px sobre `--card`, 3,70/3,96— no se
  arreglaba eligiendo otro morado: el estándar da **2,81** en claro, peor todavía. Ningún
  morado de esta marca puede ser texto pequeño sobre una tarjeta clara, así que el rótulo
  pasa a `text-muted-foreground` (**9,14/10,32**, heredado de D39 sin par nuevo): el peldaño
  que no sirve se **atenúa**, no se tiñe.

  Y tirando de ese hilo cayó la excepción de fondo, que llevaba abierta desde que el token
  existe. `brand-purple-accent` **no podía ser AAA siendo fijo, y no por ser morado**: la
  banda invertida se pinta sobre `--foreground`, que salta de carbón (luminancia 0,019) a
  hueso (0,899) al cambiar de tema, y **un solo color contra las dos superficies topa en
  √13,79 = 3,71:1** — la media geométrica de sus contrastes. El valor de entonces (3,96/3,49)
  estaba justo en ese óptimo: no se eligió mal, se eligió lo mejor de un problema sin
  solución. Se resuelve **haciendo que el token conmute**, el patrón que
  `--primary-on-inverted` ya usaba —y cuyo comentario en `globals.css` llevaba meses llamando
  a `brand-purple-accent` «su hermano, que existe por esta misma razón»—: el cian conmutó y
  funcionó; el morado se quedó fijo y topó con el techo. Ahora **7,04 claro / 7,21 oscuro**,
  AAA de texto normal, sin la coletilla «solo texto grande». Detalle en `DECISIONS.md` D41.

  Verificado el 2026-08-10: censo del DOM con el metro validado (13,79 / 15,32) **sin ningún
  par bajo AAA** en home y Brand Kit, y **0 violaciones de axe** en home, Brand Kit y Design
  System, ES y EN, claro y oscuro.
- **Medición**: GA4/GTM + Microsoft Clarity (cualitativo: heatmaps y grabaciones de
  sesión), ambos gateados a producción y a consentimiento (Consent Mode v2). Métricas
  de éxito → §7.
- **Calidad / seguridad**: CI (GitHub Actions) que corre formato + typecheck + lint + **paleta** +
  **experiencias** + **CV al día** + build en cada PR (nada que no compile entra en `main`;
  y desde el 2026-08-10 el check de paleta no solo
  comprueba que las copias conocidas cuadren, sino que **no queda ninguna copia de un valor de
  token fuera de su fuente** — busca valores, no patrones, para no marcar los colores que el
  Brand Kit desvía a propósito; D38).

  **Y desde el 2026-08-18, el PDF del CV tiene su propio gate.** La fuente única de
  D57/D58 garantiza que la web y el CV no puedan decir cosas distintas *mientras el PDF se
  regenere* — pero el PDF es un **artefacto commiteado**, y ese día un cambio de sector en
  `content/experience-copy/` dejó los dos PDFs viejos sin que lo viera nada: ni el typecheck,
  ni el linter, ni `gate:html`, ni `check:experiencias`. *Una fuente única evita dos verdades;
  no mantiene al día una copia impresa.* `npm run check:cv` sella la **huella de lo que entra**
  en el CV y falla si no coincide con la última generación — de entradas y no de bytes, porque
  el PDF **no es determinista** (regenerarlo sin cambiar nada da otro hash; medido antes de
  elegir el método). Validado rompiéndolo: cambiar una palabra del registro sin regenerar hace
  salir el gate con código 1.

  Además: **escaneo de dependencias automatizado
  (Dependabot)**; cabeceras de seguridad servidas (nosniff, X-Frame-Options, Referrer-Policy,
  Permissions-Policy, HSTS **y CSP «A+ barato»**: directivas base + allowlist GTM/GA4,
  manteniendo `'unsafe-inline'`; la CSP estricta con nonces va con la IA conversacional,
  hoy V4 — o antes, si la página de Contacto ampliada incorpora un formulario y con él un
  endpoint externo). Detalle en `DECISIONS.md`.

  **La CSP se amplió por segunda vez el 2026-08-17** (la primera fue Clarity, D32): `frame-src`
  suma `youtube-nocookie.com` por los vídeos del deep-dive, con el mismo criterio de allowlist
  mínima —el origen exacto, nunca el comodín— y con el dominio que **no escribe cookies
  publicitarias**. La política de cookies gana su sección de «vídeo incrustado», **fuera de la
  tabla**: un marco que no existe hasta que alguien pulsa no tiene nombre, ni proveedor activo,
  ni duración (D55).

  **Y un gate que no es de CI pero es el que más ha cazado**: `npm run gate:html` compara el
  **HTML servido de las seis páginas × dos idiomas** antes y después de un refactor. Diff
  vacío = transparente por construcción. Nació cubriendo los dos showcase (D42) y se amplió a
  todas cuando el refactor pasó a ser el andamiaje común (D45), que es donde vive lo que nadie
  revisa: un `hreflang` mal copiado no lo ve el typecheck, ni el linter, ni axe. **Se valida
  rompiéndolo**: borrando una línea de `pageMetadata`, el diff señala las doce a la vez.
- **Revisiones recurrentes**: dos skills con mirada externa, para que la mejora no dependa
  de acordarse — `sprint-review` (técnica, al cerrar etapa) y **`design-review`** (diseño:
  cumplimiento del sistema + expresión de marca, verificando **en pantalla** y no solo en el
  código; de disparo manual hasta validarla). La segunda nace de que cuatro incumplimientos
  reales sobrevivieron a una auditoría por fallos de método, no de criterio, y su primer
  disparo (2026-08-08) encontró seis cosas que ni axe ni el typecheck pueden ver.

## 6. CV en PDF

Bilingüe (ES/EN), 2 páginas, ATS (texto seleccionable), con identidad de marca.
**Generado por código desde fuente única**: los hechos (roles, fechas, formación,
toolkit) se leen del diccionario i18n; el CV solo autora el texto rico. Se regenera con
`npm run cv`. Detalle técnico en `DECISIONS.md` D22; flujo de actualización en el skill
`update-cv`.

## 7. Métricas de éxito

- **Primaria**: clics en contacto (`mailto:` / `tel:`) — proxy de intención (no hay
  formulario en V1).
- **Secundarias**: clics en Descargar CV (3 puntos: nav, CTA de Trayectoria, Contacto) y
  profundidad de scroll.
- **Herramienta**: GA4 (captura scroll y descarga de fábrica).

## 8. Datos del candidato

- **Francisco Javier López Martínez** — Senior Product Manager, SaaS B2B / B2C
- Email: `franciscojavier.lopezmartinez@gmail.com` · Teléfono: 629 832 720
- LinkedIn: `linkedin.com/in/franciscolopez1975` · Valencia

## 9. Alcance por versión

*(Replanificado el 2026-08-10. El detalle ejecutable —orden, dependencias y tamaños— vive en
el tablero de tareas; aquí solo qué entra en cada release y qué queda fuera.)*

### V2 — en curso: tres sprints de valor para el visitante

Se ejecutan **en este orden, que lo fijan las dependencias, no la preferencia**:

1. **Deep-dive por experiencia** — **cinco** páginas (Emendu, KUOTIP, INDYA, Freepik y
   TheTool) en `/trayectoria/[slug]`, más un índice `/trayectoria`. Las dos entradas de
   Marketing & Growth se quedan como están en Trayectoria: un deep-dive ahí diluiría el orden
   del posicionamiento de §3. **Y PICKASO tampoco tiene página, por una razón que no es de
   alcance sino de contenido** (2026-08-16): es el primer capítulo de la historia de TheTool
   —la agencia que necesitaba una herramienta que no existía y que financió su construcción—,
   no una experiencia con historia separable. Se descubrió escribiéndola: al redactar TheTool,
   PICKASO ya estaba dentro. **Comparte fuente de contenido con el CV** —los bullets con
   métricas ya existen— y sale en **dos despliegues**: primero el andamiaje (helper de página,
   `slug` estable, skip link, LCP del hero), luego las páginas.
   **Cada página son cinco secciones** (Datos · En un minuto · La historia · El caso, opcional ·
   Aprendizajes) con un presupuesto de 700-900 palabras, 1.200 con caso. La homogeneidad entre
   las cinco la dan el marco y la longitud, no los títulos: dentro de «La historia» los
   subapartados son libres, porque si no, una experiencia de tres meses de hace cuatro años sale
   con secciones medio vacías al lado de una de cinco años. Detalle en `PRD-Historical.md` §42.

   **EL SPRINT QUEDA CERRADO EL 2026-08-18**, con el índice construido y el SEO resuelto. El
   índice `/trayectoria` no era un extra: el breadcrumb de tres niveles de las cinco
   experiencias apuntaba a esa ruta desde que se montaron, así que **eran diez páginas con el
   enlace roto en su propia carpintería** y no lo veía ningún gate, porque ninguno mira la ruta
   *padre* de las que se añaden. Lista **las cinco con caso** y no la trayectoria entera —esa ya
   está en la portada y en el CV—, y **ninguna de sus tarjetas tiene copy propio**: la afirmación
   es el `h1` literal de la página a la que lleva.

   El **SEO** (D59) destapó que «qué páginas tiene este sitio» estaba escrito a mano en **tres**
   sitios —sitemap, `llms.txt` y la tabla de tarjetas OG—; los tres derivan ya del registro. Y el
   **peso no era el problema** (D59): Emendu mide 223 KB y saca 94/100 en móvil, pero el Design
   System pesa 341 y saca lo mismo — la nota la fija el retraso de renderizado, no los KB, así
   que el artefacto no se toca.

   **Las cinco páginas estaban montadas, revisadas por Francisco y con el gate de accesibilidad
   pasado** (2026-08-17). La segunda pasada cerró el diseño: la **apertura ocupa el pliegue**
   —hasta entonces, en cuanto la ventana pasaba de ~700px de alto asomaba la sección siguiente y
   la primera vista dejaba de ser una portada (D56)—, «En un minuto» y «Aprendizajes» bajan a
   media columna por ser la entrada y el cierre, y **Trayectoria enlaza por fin a los cinco deep-
   dives**: el rol es el enlace, decidido viendo las dos alternativas servidas, y asumiendo que
   PICKASO queda como la única fila sin enlace de su grupo. El **gate (D52), disparado dos
   veces**, da 0 violaciones de axe en home y las cinco páginas × dos temas, la segunda sección
   por debajo del pliegue en los cuatro viewports sin recortar nada, y el par nuevo del enlace en
   AAA (7,93/8,36 en hover) por reutilizar pares ya verificados.

   **Y desde el 2026-08-17, una experiencia se cuenta una sola vez** (D57). De cada una se
   contaba lo mismo en tres longitudes —la frase de Trayectoria, el bullet del CV y su gemelo de
   «En un minuto»— repartidas en tres archivos que nada ataba, y habían divergido **ocho veces**:
   siete cifras existían solo en el deep-dive, una solo en el CV, KUOTIP tenía 3 bullets en el CV
   y 4 en su página, y el CV afirmaba «construí el MVP» donde la página dice «definí el MVP junto
   al product designer». Ahora el bullet corto y el largo son **el mismo elemento del array**
   (`content/experience-copy/`), así que el emparejamiento 1:1 que el formato pedía deja de ser
   convención; un guardián en CI comprueba cobertura y cifras **afirmando cuánto ha mirado**; y el
   CV vuelve a caber en dos páginas por **margen entre bloques**, no por interlineado — quitar
   «Habilidades» y recortar prosa se probaron y **no servían**, porque cada empleo va con
   `wrap={false}` y salta entero.

   **Y con ello se fijó cuál es la fuente cuando dos superficies discrepan: el deep-dive** (D58).
   Sus `Datos` se auditaron **contra las páginas de Notion**, no contra el repo, y las cinco
   coinciden — así que las cuatro divergencias restantes estaban en las otras dos superficies. Una
   era una **fecha**: KUOTIP terminaba en noviembre en la home y en diciembre en su página, y **el
   valor equivocado se estaba sirviendo en seis sitios** —la fila de Trayectoria y las tarjetas de
   «siguiente experiencia» de Emendu e INDYA, en los dos idiomas— mientras la propia página de
   KUOTIP publicaba el bueno. *Un dato duplicado no falla donde se escribe: falla donde se lee.*
   Rol, periodo, sector y reporting suben también al registro; el diccionario del deep-dive se
   queda con `tamano`, las filas de Trayectoria con `company` y el CV con la sola decisión de a
   qué experiencias da papel.

   **Y el contenido del deep-dive queda cerrado** (2026-08-18). El `+30% de MRR` de TheTool —la
   última cifra sin ventana— queda **acotado a 2 meses**; se decide que **solo Emendu lleva
   artefacto** y que el resto queda cubierto con vídeo o captura (decidir que no llevan también
   cierra el hueco); y la **pasada de erratas** encuentra que la prosa estaba limpia y que lo que
   quedaba eran, sobre todo, **contradicciones con el propio sitio** —`V0` donde el toolkit
   escribe `v0`, `TheUncoding` y `The Hero Camp` donde Formación escribe `theUncoding` y
   `TheHeroCamp`, y `PickASO` doce veces donde el resto del sitio escribe `PICKASO`—. Es el tipo
   de errata que una lectura no caza, porque cada página por separado se lee bien.

   La **revisión EN contra el ES** (D20) se hace y encuentra poco, que es la buena noticia: el
   inglés no era traducción literal y su ortografía era consistente. Lo que sí había: **siete
   comillas españolas `«»` dentro de textos ingleses**, dos de ellas fuera del deep-dive. La
   **forma** se comparó campo a campo — las cinco páginas tienen la misma estructura y todas las
   cifras coinciden.

   **Y las páginas de Notion vuelven a decir lo que dice la web.** Se habían separado —las
   correcciones se aplicaban al repositorio y no a la fuente—, que es justo lo que invalida a
   Notion como fuente en el sentido de D58. Al resincronizar aparecieron tres divergencias que no
   eran erratas: un titular que decía «Tres cosas» con cuatro aprendizajes, un bloque con los
   párrafos en otro orden y una página con los niveles de título cambiados.

   **Y dos afirmaciones publicadas quedaron señaladas como sin respaldo**, que fue el saldo honesto
   de aquella sesión: la regla del **control sobre imagen** prometía «siempre pasa uno de los dos
   bordes» y con un metro más estricto —el peor de 144 ángulos del perímetro— no se sostenía; y
   **el censo de contraste había dejado de ver los hover** —encontraba 0 reglas donde hay 21,
   porque desde CSS Nesting toda regla expone `cssRules`—, así que la mitad «y en hover» de §5
   estaba sin medición.

   **Las dos se cerraron el 2026-08-18, y ninguna terminó donde apuntaba.** El **censo** se
   arregló y, con los hover dentro, destapó un incumplimiento real que llevaba escondido detrás
   del fallo del metro: la dirección de email de Accesibilidad daba **6,42 claro / 5,59 oscuro**
   en hover —AA, no AAA— porque pisaba el color a mano en vez de usar el `tone: "muted"` de la
   variante; era el **quinto** uso del mismo fallo y sobrevivió a tres auditorías porque el par
   solo existe mientras el cursor está encima. Corregido, el censo da **cero pares bajo AAA en
   8 páginas × 2 temas**, con el metro validado en las 16 corridas, así que «en reposo y en hover,
   sin excepciones» vuelve a tener respaldo. Y el **control sobre imagen** se resolvió corrigiendo
   la afirmación y NO el componente, porque al barrer los 144 ángulos apareció que la palanca
   obvia era contraproducente: el velo acerca el póster al anillo mientras lo aleja del disco, así
   que no hay opacidad que separe a los dos a la vez. Detalle en `DECISIONS.md` D55.

   **Lo anterior, del primer montaje (2026-08-17).** Además del texto,
   dos experiencias enseñan algo que no es prosa: **KUOTIP su dashboard** —al lado del párrafo que
   afirma que las reseñas «parecían de hace veinte años», porque una captura de producto se
   reconoce y no se lee— y **INDYA y TheTool un vídeo incrustado**. El vídeo entra por la regla de
   §43 —es prueba y no resumen— y con su letra pequeña: **facade** (hasta que alguien pulsa no hay
   iframe, ni JS de terceros, ni una petición a Google), póster auto-hospedado, `frame-src` a
   `youtube-nocookie` y sección propia en la política de cookies. El **clic es el gate de
   consentimiento**, que es más estricto que colgarlo de una categoría: quien acepta todas las
   cookies tampoco carga YouTube sin pulsar. Detalle en `DECISIONS.md` D55.

   **Las cinco narrativas en español están escritas** (2026-08-16): Emendu ~1.160 y TheTool
   ~1.200 con caso, INDYA ~1.150 con caso, KUOTIP ~760 y Freepik ~710 sin él. El formato
   aguanta el rango entero —de tres meses a cinco años y medio con exit— y ninguna se lee como
   versión incompleta de otra, que era justamente la prueba. Queda abierto lo que solo se
   cierra viendo las páginas montadas: los **artefactos** (hoy solo Emendu tiene dos
   identificados), tres cifras sin acotar, la pasada de erratas y el EN contra el ES (D20).
   **PICKASO ya está ejecutado** (`slug: null`) y su cabo de contenido, cerrado: de los tres
   bullets de su CV solo uno estaba huérfano de verdad, y TheTool ganó 18 palabras para
   recogerlo — la página queda en ~1.220, dentro del techo y sin margen. Lo único que la
   decisión deja pendiente es de diseño: en Trayectoria, las dos filas anidadas de «Shutapp
   Projects» pasan a comportarse distinto —una enlaza a su deep-dive y la otra no— y eso
   **solo se puede juzgar en pantalla**, así que va con el diseño de la plantilla y no antes.
   Detalle en `PRD-Historical.md` §44.
2. **«Cómo se ha creado esta página»** — una página con estructura y metadata de artículo
   (`TechArticle`) contando el proceso: marca, stack, sistema de componentes, accesibilidad,
   metodología, revisiones y medición. **No es un blog** y no habrá índice de artículos ni feed.
   Es la pieza que enseña el *proceso* donde el resto del sitio enseña el *resultado*, y por eso
   habla a los tres perfiles a la vez (producto, técnico, UX/UI).
3. **Footer estructurado y Contacto ampliada** — el footer va el último **porque necesita que
   existan las secciones que crean los dos sprints anteriores**; hoy sólo tiene cuatro enlaces.
   De Contacto ampliada, lo primero es definir qué añade sobre la franja compartida de D29:
   si la respuesta es «nada», la conclusión legítima es reforzar la franja y no construir la
   página.

**Traducción de contenido nuevo a EN**: la arquitectura i18n ya está; la traducción se hace a
medida que se añade contenido, revisando el EN contra el ES y no al revés (D20).

### V3 — deuda técnica y mejoras por bloque

Sin fecha ni compromiso de release conjunto: entran en el sprint que las toque o cuando dejen de
poder esperar. Agrupadas por dónde viven — *General* (higiene de validadores, Dependabot, `qlty`,
tests cuando aparezca la primera lógica de negocio real), *Home* (gesto-firma de marca, presencia
del morado, kicker del Hero, `WebSite` en JSON-LD), *Brand Kit*, *Design System* (copy-to-clipboard
de tokens, simulador de foco) y *Accesibilidad*.

### V4 — IA conversacional

**«Pregúntale a mi carrera»** — sin definir: modelo, arquitectura, datos, coste y UX. Arrastra la
CSP estricta con nonces (§5).

**Su corpus ya tiene un límite, fijado el 2026-08-15 antes de que exista el agente: lo que no
va por escrito en el sitio, tampoco va aquí.** Un agente público publica igual que una página,
y además responde sin Francisco delante y en frases que no puede revisar — así que no sirve
como papelera de lo que se cuenta en una entrevista y no en abierto (motivos de salida,
problemas internos, límites de un equipo). **V4 absorbe profundidad sobre lo que ya es público,
no discreción.** Es la regla 9 del formato de deep-dive; el porqué, en `PRD-Historical.md` §42.

### Fuera de alcance, sin versión asignada

- **Marca externa**: firma de email, header de LinkedIn, rediseño de assets.

El porqué de cada decisión de producto, en **[PRD-Historical.md](./PRD-Historical.md)**.
