# PRD Historical — Web personal de Francisco López

> **Registro histórico de decisiones de producto/diseño/alcance** — secciones fechadas,
> debates y cosas revertidas, en orden cronológico. Es el "por qué" completo. Para el
> **estado actual del producto** (qué es y qué cumple hoy), ver **[PRD-Live.md](./PRD-Live.md)**,
> que es la spec viva y el documento que se `@`-importa en cada sesión. Este archivo
> vive **solo en el repo** (no tiene espejo en Notion).

> Documento de referencia para diseñar (Claude Design) y desarrollar esta web.
> Consolida el Brief y el CV de partida. Versión V1 (Portfolio/CV en Vercel).

**Fuentes originales:** ver sección [Fuentes](#fuentes) al final.

**Seguimiento de tareas:** [Tareas — Web personal](https://app.notion.com/p/f3ee9a949c58482888423d5917087962) (Notion, al mismo nivel que este PRD dentro de "New Website") — base de datos derivada de este PRD, por Área (Código/Diseño/Analítica/Legal/Contenido/Infra), Versión (V1/V2/V3) y Sprint semanal.

---

<!-- ÍNDICE · lo genera `npm run indices`; no se edita a mano -->
- [1. Resumen ejecutivo](#1-resumen-ejecutivo)
- [2. Objetivo y alcance](#2-objetivo-y-alcance)
- [3. Audiencia](#3-audiencia)
- [4. Posicionamiento y narrativa](#4-posicionamiento-y-narrativa)
- [5. Hero](#5-hero)
- [6. Dirección visual](#6-dirección-visual)
- [7. Arquitectura de la página](#7-arquitectura-de-la-página)
- [8. Contenido por bloque](#8-contenido-por-bloque)
- [9. Sistema técnico](#9-sistema-técnico)
- [10. Datos del candidato](#10-datos-del-candidato)
- [11. Riesgos](#11-riesgos)
- [12. Decisiones pendientes](#12-decisiones-pendientes)
- [13. Roadmap](#13-roadmap)
- [14. Feedback crítico (2026-07-16)](#14-feedback-crítico-2026-07-16)
- [15. Análisis de mejora V1 — Diseño, Marca y Arquitectura (2026-07-19)](#15-análisis-de-mejora-v1--diseño-marca-y-arquitectura-2026-07-19)
- [16. Ajustes de contenido y prioridad (2026-07-20)](#16-ajustes-de-contenido-y-prioridad-2026-07-20)
- [17. Sistema de uso del logo (2026-07-21)](#17-sistema-de-uso-del-logo-2026-07-21)
- [18. Reorganización de sprints y alcance de V1 (2026-07-21)](#18-reorganización-de-sprints-y-alcance-de-v1-2026-07-21)
- [19. Página Brand Kit y consolidación del diseño (2026-07-21/22)](#19-página-brand-kit-y-consolidación-del-diseño-2026-07-21/22)
- [20. Página Design System y sistema en AAA (2026-07-22)](#20-página-design-system-y-sistema-en-aaa-2026-07-22)
- [21. Pasada de responsive y ronda de contenido (2026-07-22)](#21-pasada-de-responsive-y-ronda-de-contenido-2026-07-22)
- [22. Reenfoque a lanzar V1 ASAP y priorización MoSCoW (2026-07-23)](#22-reenfoque-a-lanzar-v1-asap-y-priorización-moscow-2026-07-23)
- [23. Cierre de Sprint 1 y foto del Hero (2026-07-23)](#23-cierre-de-sprint-1-y-foto-del-hero-2026-07-23)
- [24. Revisión de copy ES↔EN (P29) (2026-07-29)](#24-revisión-de-copy-es↔en-p29-2026-07-29)
- [25. Planificación del CV en PDF y deep-dive por experiencia (2026-07-29)](#25-planificación-del-cv-en-pdf-y-deep-dive-por-experiencia-2026-07-29)
- [26. Fase V2+: análisis crítico y cambios de metodología (2026-08-01)](#26-fase-v2+-análisis-crítico-y-cambios-de-metodología-2026-08-01)
- [27. Sobre mí: contenido y diseño en código (2026-08-01)](#27-sobre-mí-contenido-y-diseño-en-código-2026-08-01)
- [28. Publicación de Sobre mí + Accesibilidad (2026-08-02)](#28-publicación-de-sobre-mí-+-accesibilidad-2026-08-02)
- [29. Contacto: copy al ICP y una sola superficie (2026-08-03)](#29-contacto-copy-al-icp-y-una-sola-superficie-2026-08-03)
- [30. Microsoft Clarity: alta, fugas de CSP y gating de consentimiento (2026-08-03)](#30-microsoft-clarity-alta-fugas-de-csp-y-gating-de-consentimiento-2026-08-03)
- [31. Links con diseño y animación (P37.55) (2026-08-04)](#31-links-con-diseño-y-animación-p3755-2026-08-04)
- [32. Consecuencias de P37.55: chrome completo y el sistema documentado (2026-08-04)](#32-consecuencias-de-p3755-chrome-completo-y-el-sistema-documentado-2026-08-04)
- [33. Capa de acción y de layout: el sistema deja de escribirse a mano (2026-08-04)](#33-capa-de-acción-y-de-layout-el-sistema-deja-de-escribirse-a-mano-2026-08-04)
- [34. AAA sin excepciones y la regla del icono propio (2026-08-08)](#34-aaa-sin-excepciones-y-la-regla-del-icono-propio-2026-08-08)
- [35. La revisión de diseño se vuelve un método, y su primer disparo (2026-08-08)](#35-la-revisión-de-diseño-se-vuelve-un-método-y-su-primer-disparo-2026-08-08)
- [36. Los huecos de variante se cierran, y la regla de shadcn se acota (2026-08-08)](#36-los-huecos-de-variante-se-cierran-y-la-regla-de-shadcn-se-acota-2026-08-08)
- [37. Las capas que faltaban, y la fuente única de lo que el sitio dice de sí mismo (2026-08-09)](#37-las-capas-que-faltaban-y-la-fuente-única-de-lo-que-el-sitio-dice-de-sí-mismo-2026-08-09)
- [38. La ola 3, primera mitad: el atenuado se hereda y las tablas dejan de escribirse a mano (2026-08-09)](#38-la-ola-3-primera-mitad-el-atenuado-se-hereda-y-las-tablas-dejan-de-escribirse-a-mano-2026-08-09)
- [39. La ola 3, segunda mitad: el bloque cierra, y un diff limpio no es un diseño verificado (2026-08-10)](#39-la-ola-3-segunda-mitad-el-bloque-cierra-y-un-diff-limpio-no-es-un-diseño-verificado-2026-08-10)
- [40. Tres sprints de valor: la replanificación tras cerrar el bloque de diseño (2026-08-10)](#40-tres-sprints-de-valor-la-replanificación-tras-cerrar-el-bloque-de-diseño-2026-08-10)
- [41. El andamiaje del deep-dive: lo que se construye antes de tener nada que enseñar (2026-08-10)](#41-el-andamiaje-del-deep-dive-lo-que-se-construye-antes-de-tener-nada-que-enseñar-2026-08-10)
- [42. El deep-dive baja de ocho secciones a cinco, y aparece una línea de discreción (2026-08-15)](#42-el-deep-dive-baja-de-ocho-secciones-a-cinco-y-aparece-una-línea-de-discreción-2026-08-15)
- [43. El vídeo no va dentro de la página, y por qué eso es una decisión de producto (2026-08-16)](#43-el-vídeo-no-va-dentro-de-la-página-y-por-qué-eso-es-una-decisión-de-producto-2026-08-16)
- [44. Las cinco narrativas escritas, y tres cosas que solo se ven escribiéndolas (2026-08-16)](#44-las-cinco-narrativas-escritas-y-tres-cosas-que-solo-se-ven-escribiéndolas-2026-08-16)
- [45. La plantilla del deep-dive, y un artefacto que no se recrea (2026-08-17)](#45-la-plantilla-del-deep-dive-y-un-artefacto-que-no-se-recrea-2026-08-17)
- [46. La primera pasada de Francisco sobre las cinco páginas montadas (2026-08-17)](#46-la-primera-pasada-de-francisco-sobre-las-cinco-páginas-montadas-2026-08-17)
- [47. El cierre del deep-dive: cuatro ajustes en pantalla y tres metros descalibrados (2026-08-17)](#47-el-cierre-del-deep-dive-cuatro-ajustes-en-pantalla-y-tres-metros-descalibrados-2026-08-17)
- [48. El cierre del sprint Deep-dive: lo que se decidió, y tres premisas que no sobrevivieron a medirlas (2026-08-18)](#48-el-cierre-del-sprint-deep-dive-lo-que-se-decidió-y-tres-premisas-que-no-sobrevivieron-a-medirlas-2026-08-18)
- [49. El deep-dive sale a producción, y las dos revisiones se ganan el sueldo (2026-08-18)](#49-el-deep-dive-sale-a-producción-y-las-dos-revisiones-se-ganan-el-sueldo-2026-08-18)
- [50. El Sprint Lite: nueve iniciativas sueltas, y la homogeneidad como criterio (2026-08-18/19)](#50-el-sprint-lite-nueve-iniciativas-sueltas-y-la-homogeneidad-como-criterio-2026-08-18/19)
- [51. El repositorio se hace público, y el Sprint Lite se cierra (2026-08-19)](#51-el-repositorio-se-hace-público-y-el-sprint-lite-se-cierra-2026-08-19)
- [52. El bloque Método: se audita cómo se trabaja, antes de un sprint de contenido (2026-08-19)](#52-el-bloque-método-se-audita-cómo-se-trabaja-antes-de-un-sprint-de-contenido-2026-08-19)
- [53. «Cómo se ha creado esta página»: el contenido primero, y un artículo que no publica cifras (2026-08-20)](#53-cómo-se-ha-creado-esta-página-el-contenido-primero-y-un-artículo-que-no-publica-cifras-2026-08-20)
- [54. Método II: el sprint de la operación que faltaba, y tres reglas que existían sin disparador (2026-08-22)](#54-método-ii-el-sprint-de-la-operación-que-faltaba-y-tres-reglas-que-existían-sin-disparador-2026-08-22)
- [55. El footer no es de columnas, y la cifra que lo decidió son ocho enlaces (2026-08-23)](#55-el-footer-no-es-de-columnas-y-la-cifra-que-lo-decidió-son-ocho-enlaces-2026-08-23)
- [56. Contacto ampliada añade una sola cosa, y con ella el sitio deja de ser de solo lectura (2026-08-23)](#56-contacto-ampliada-añade-una-sola-cosa-y-con-ella-el-sitio-deja-de-ser-de-solo-lectura-2026-08-23)
- [57. La dirección de Contacto se elige viéndola, y el prototipo destapa dos defectos del sistema (2026-08-23)](#57-la-dirección-de-contacto-se-elige-viéndola-y-el-prototipo-destapa-dos-defectos-del-sistema-2026-08-23)
- [58. Contacto se construye, y las tres cosas que arrastra no son las que decía el sprint (2026-08-23)](#58-contacto-se-construye-y-las-tres-cosas-que-arrastra-no-son-las-que-decía-el-sprint-2026-08-23)
- [59. El sprint 4 se define contra un calendario, no contra la deuda (2026-08-23)](#59-el-sprint-4-se-define-contra-un-calendario-no-contra-la-deuda-2026-08-23)
- [60. La lectura del artículo destapa tres cosas que nadie buscaba (2026-08-24)](#60-la-lectura-del-artículo-destapa-tres-cosas-que-nadie-buscaba-2026-08-24)
- [61. La tanda de método cierra siete tareas, y cuatro tenían la premisa equivocada (2026-08-25)](#61-la-tanda-de-método-cierra-siete-tareas-y-cuatro-tenían-la-premisa-equivocada-2026-08-25)
- [62. Los dos sprints hacia septiembre: coherencia de las hermanas, con el activo que se lanza arrastrado dentro (2026-08-25)](#62-los-dos-sprints-hacia-septiembre-coherencia-de-las-hermanas-con-el-activo-que-se-lanza-arrastrado-dentro-2026-08-25)
- [63. La página que documenta el sistema dejaba fuera justo la parte que no tiene nadie (2026-08-25)](#63-la-página-que-documenta-el-sistema-dejaba-fuera-justo-la-parte-que-no-tiene-nadie-2026-08-25)
- [64. La revisión de las hermanas destapa que el Design System había cambiado de género (2026-08-26)](#64-la-revisión-de-las-hermanas-destapa-que-el-design-system-había-cambiado-de-género-2026-08-26)
- [65. «Páginas hermanas» cierra, y el method-review mide que la reducción de contexto fue una mudanza (2026-08-27)](#65-páginas-hermanas-cierra-y-el-method-review-mide-que-la-reducción-de-contexto-fue-una-mudanza-2026-08-27)
- [66. La distribución entra en el alcance del proyecto, y el orden se decide aparte (2026-08-27)](#66-la-distribución-entra-en-el-alcance-del-proyecto-y-el-orden-se-decide-aparte-2026-08-27)
- [El sprint «Home» cierra, y el siguiente se parte en dos carriles — 2026-08-28](#el-sprint-home-cierra-y-el-siguiente-se-parte-en-dos-carriles--2026-08-28)
- [«Drenaje» cierra con su medición hecha por fin, y el lanzamiento reencuadra qué entra en «Voz» — 2026-08-29](#drenaje-cierra-con-su-medición-hecha-por-fin-y-el-lanzamiento-reencuadra-qué-entra-en-voz--2026-08-29)
- [La tanda 1 de «Voz», y el cruce que puso la métrica primaria en su sitio — 2026-08-29](#la-tanda-1-de-voz-y-el-cruce-que-puso-la-métrica-primaria-en-su-sitio--2026-08-29)
- [La tanda 2 de «Voz», y el diagrama que se arregló mirándolo — 2026-08-29](#la-tanda-2-de-voz-y-el-diagrama-que-se-arregló-mirándolo--2026-08-29)
- [La tanda 3 de «Voz», y las dos veces que la medición mandó sobre la intuición — 2026-08-29](#la-tanda-3-de-voz-y-las-dos-veces-que-la-medición-mandó-sobre-la-intuición--2026-08-29)
- [La tanda 4 de «Voz»: dos premisas de ficha que no aguantaron la medición — 2026-08-29](#la-tanda-4-de-voz-dos-premisas-de-ficha-que-no-aguantaron-la-medición--2026-08-29)
- [La tanda 5 de «Voz», que era toda de andamiaje — 2026-08-30](#la-tanda-5-de-voz-que-era-toda-de-andamiaje--2026-08-30)
- [El cierre de «Voz» — 2026-08-30](#el-cierre-de-voz--2026-08-30)
- [El sprint «Agentes» — abierto el 2026-08-30](#el-sprint-agentes--abierto-el-2026-08-30)
- [La tanda 3 y la 4 de «Agentes», y lo que el techo de contexto obligó a retirar — 2026-08-30](#la-tanda-3-y-la-4-de-agentes-y-lo-que-el-techo-de-contexto-obligó-a-retirar--2026-08-30)
- [La tanda 5 de «Agentes»: cuatro metros que no decían lo que estaban haciendo — 2026-08-30](#la-tanda-5-de-agentes-cuatro-metros-que-no-decían-lo-que-estaban-haciendo--2026-08-30)
- [Fuentes](#fuentes)
- [El cierre de «Agentes» — 2026-08-31](#el-cierre-de-agentes--2026-08-31)
- [El cierre de «Distribución» y el `method-review` XI — 2026-09-01](#el-cierre-de-distribución-y-el-method-review-xi--2026-09-01)
<!-- FIN ÍNDICE -->

## 1. Resumen ejecutivo

Web personal de **Francisco López**, Senior Product Manager con más de 10 años de experiencia en SaaS B2B y B2C, y un exit (TheTool → AppRadar).

**Objetivo principal:** preparar una web orientada a facilitar el cambio de trabajo. No debe ser un CV en HTML: debe demostrar Producto, SaaS, UX, mentalidad Builder, IA aplicada y Growth. La propia web actúa como prueba de criterio técnico y de diseño.

**Posicionamiento (en este orden):**
1. Senior Product Manager
2. Cofundador con exit
3. ADN Growth

---

## 2. Objetivo y alcance

**Objetivo:** dar soporte a la búsqueda de empleo para posiciones Senior Product Manager.

**Alcance V1:** portfolio + CV, desplegada en Vercel, sin dominio propio todavía.

**Fuera de V1:** IA conversacional ("Pregúntale a mi carrera"), dominio propio.

---

## 3. Audiencia

La web debe funcionar para dos perfiles completamente distintos:

| Perfil | Cómo lee | Qué necesita |
|---|---|---|
| HR / Recruiter | Escaneo en 5–10 segundos | Rol, seniority, stack, experiencia |
| CEO / CPO / VP Product | Lectura profunda | Outcomes, pensamiento de producto, criterio |

**Principio de diseño:** el Above The Fold debe superar el filtro de RRHH. Al hacer scroll, el contenido profundiza para perfiles de Producto. Dos velocidades de lectura.

---

## 4. Posicionamiento y narrativa

**Mensaje principal:** Senior Product Manager.

**Cartas diferenciales (no aparecen en el Hero, se descubren al hacer scroll):**
- **Cofundador con exit** — TheTool → adquirida por AppRadar.
- **ADN Growth** — experiencia previa en SEO, SEM, CRO, Marketing Digital.

**Narrativa:** el usuario debe descubrir gradualmente que (1) es un Senior PM sólido, (2) además fundó una empresa, (3) además tiene background en Growth.

**ICP de empresa objetivo (resuelto 2026-07-16):** la web habla, específicamente, a startups que cumplen todo esto:
- **SaaS con recorrido, no early stage** — con product-market fit ya validado (indiferente si es B2B o B2C).
- **Da peso real a producto**: tiene equipo de producto (PM, Product Designer) o al menos un fundador con peso genuino en producto, y busca ayuda ahí — no empresas donde producto es un añadido.
- **IA integrada en el día a día del negocio/producto**, no uso superficial de un chat de un LLM — aplicada de forma estructural.
- **Remoto o híbrido fuerte.**
- **Ubicada en España.**

Esto sustituye al vacío de "ICP de empresa objetivo" detectado en el análisis crítico (sección 14): ahora se sabe a quién le habla el mensaje, lo que debería afinar el copy en fase de diseño — hablarle directamente a SaaS scale-ups product-led, no a startups genéricas.

**Decisión (2026-07-16):** el reveal gradual se mantiene tal cual — no se añade señal de exit/founder en el Hero. El riesgo de que el escaneo de 5-10s de RRHH (sección 3) no llegue a ver el exit se acepta conscientemente porque **Selected Work va justo debajo del Hero** (primer bloque de scroll, sin recorrido largo de por medio) y actúa como red de seguridad: el lector rápido llega al exit de TheTool en el segundo scroll, no al final de la página.

---

## 5. Hero

- **Kicker:** Senior Product Manager · UX · SaaS · IA aplicada
- **Headline:** Del discovery al dato.
- **Subheadline:** Investigo, prototipo, construyo y mido.
- **CTA:** ninguno propio del bloque (ver decisión abajo).

Recorrido conceptual: Discovery → Prototipo → Construcción → Medición.

"B2B / B2C" no va en el Hero — aparece en los casos de estudio (Hitos/Trayectoria).

**Decisión (2026-07-19, ver sección 15):** el Hero deja de llevar CTA propio — se queda solo con kicker, headline, subheadline y foto, para invitar a explorar el resto de la página en vez de quedarse arriba. Descargar CV y el toggle Claro/Oscuro pasan a un **nav sticky** presente en toda la página (ver sección 7); LinkedIn se queda únicamente en el footer. Al ser sticky, el CV sigue disponible en todo momento — no hay pérdida real de conversión temprana, solo cambia de sitio visual.

**Actualizado 2026-07-20 (ver sección 16):** "Sobre mí" sale del nav sticky en V1 — la página completa se pospone a V2 (ver sección 16), así que no tiene sentido un enlace a una página que no existe. El nav de V1 queda con Descargar CV + toggle de tema únicamente; "Sobre mí" vuelve al nav cuando la página exista en V2.

---

## 6. Dirección visual

**Estilo:** muchísimo espacio en blanco, tipografía protagonista, diseño minimalista, ritmo visual.

**Sistema de marca:** ya implementado en este repo — ver `BRAND.md` (tokens de color OKLCH, tipografía Inter/Bricolage Grotesque, modo oscuro, componente `Logo`). El PRD no redefine marca, la da por resuelta.

**Sistema de diseño de la página (layout, grid, composición de cada sección):** pendiente — se define en la fase de diseño con Claude Design, usando como input este PRD + el moodboard de referencias.

**Moodboard de referencia:** [Referencias en Notion](https://app.notion.com/p/39f2caec08be8090bf5bf6cb39ee63e2) — opciones de tratamiento visual para Hero, Timeline (3 variantes), "Cómo trabajo", "Hitos", "Tools" y "Contacto". Revisar en la fase de diseño.

**Fotografía:** nueva, fondo neutro, buena iluminación, actual, coherente con la identidad. *(Pendiente: sesión de foto profesional — ver Decisiones pendientes.)*

**Evitar:**
- ❌ Marquee de skills
- ❌ Logos de empresas a color
- ❌ Portfolio tipo freelancer

**Reequilibrio de color (resuelto 2026-07-19, ver sección 15):** una auditoría del sistema de diseño y del Brand Kit ya construidos mostró que `brand-purple` apenas aparecía — el cian dominaba toda la paleta visible, incumpliendo por omisión la capa decorativa de `BRAND.md`. Se reintroduce el morado como **acento decorativo no accionable** (hito destacado, dato clave, separador de sección) — el cian sigue siendo el único color de acción (botones, enlaces, foco, estados activos); esa regla no se toca. Aplica ya en V1 a la web; en Brand Kit y Sistema de diseño (páginas del footer) se pospone a V2 (sección 13).

**Motion con propósito (resuelto 2026-07-19, ver sección 15):** el movimiento se usa como jerarquía en el tiempo, no como decoración. Criterio: aparece **una vez, al entrar en el viewport** (reveal fade-up), nunca en bucle. Aplicaciones previstas: reveal sutil en Hitos, contadores animados en métricas de resultado (ej. churn 16%→10%), micro-interacción en el CTA de contacto. El morado puede ser el color del acento de motion. **No negociable:** respeta `prefers-reduced-motion` siempre, coherente con el objetivo AA/AAA de la sección 9 — el andamiaje ya existe en el Sistema de diseño construido, solo falta aplicarlo.

**Presencia del logo (resuelto 2026-07-19, ver sección 15):** el logo apenas se apreciaba a tamaño de header — no tenía ningún momento donde respirara a buen tamaño. *Gap de proceso:* esta decisión ya estaba en el análisis original (sección 2.2, "Marca y color") pero no se incorporó en la reescritura del PRD del 2026-07-19 — corregido ahora.

**Comportamiento final (validado 2026-07-19, tras tres rondas de revisión en vivo sobre el primer resultado de Claude Design; ~~corregido 2026-07-21~~ — ver "Sistema de uso del logo" justo debajo):**
- El **nav sticky es el único responsable** de la presencia del logo en toda la página — no hay un logo adicional en el Hero (ver sección 5). Un primer intento puso también un logo grande en el Hero, pero al estar visible a la vez que el logo del nav en la carga inicial, generaba ruido/redundancia (dos marcas iguales, mismo trabajo, una encima de otra) — se retiró del Hero. *(Sigue vigente.)*
- ~~Al **cargar la página** (sin scroll), el nav muestra la variante `flat` compacta, en su círculo, junto al nombre "Francisco López".~~ *(Corregido 2026-07-21: los dos estados estaban invertidos — ver abajo.)*
- ~~Al **hacer scroll**, el nav cambia a la variante `split` a color, sin el círculo que la recorta y sin el texto del nombre.~~ *(Corregido 2026-07-21.)*
- **Mobile:** "Descargar CV" y "Sobre mí" colapsan los dos detrás de un icono de menú (☰) — en la barra de mobile solo quedan siempre visibles el logo, el icono de menú y el toggle de tema, sin texto partido en dos líneas. *(Sigue vigente.)*

**Sistema de uso del logo (cerrado 2026-07-21 — la tabla completa vive en `BRAND.md`, aquí solo la decisión y el porqué):**

Al revisar los tres usos ya construidos (nav sin scroll, nav con scroll, footer) se midió que ninguno era coherente con los otros, y la causa de raíz era que **`BRAND.md` había dejado explícitamente sin cerrar** dónde y a qué tamaño usar cada variante ("se decidirá al diseñar la web, no ahora"). Los tres usos eran decisiones sueltas de tres sesiones distintas, no la aplicación de un sistema. Cerrado ahora, tras dos rondas de tableros de calibración en Claude Design.

Lo que se midió:
- **El `viewBox` mentía.** Era `"0 0 120 120"` pero el símbolo solo ocupaba el 58% de la altura, así que todo consumidor lo infradimensionaba un ~42% sin saberlo. Recortado a `"30 16 60 72"`.
- **El logo pesaba menos que los iconos ajenos.** En el footer medía 12×15px junto a un icono de LinkedIn de 18×18px, al mismo tamaño visual que el símbolo `©` de al lado.
- **El `split` se usaba a 24px**, muy por debajo de donde funciona. Una escalera de 24→128px en ambos temas situó el umbral en **64px**: por debajo de ~3px de creciente de color, el efecto se lee como error de registro de imprenta, no como firma.

La decisión y su matiz importante: **el PRD ya quería un momento de marca en el nav, pero tenía los dos estados del revés** — puso el `split` en el estado comprimido (donde no cabe) y el `flat` en el estado con sitio. No se revierte esa intención, se corrige:

- **Al cargar:** barra de 80px, logo `split` a 48px + wordmark "Francisco López" a ~22px. Este es el único momento donde la marca respira, y cae above the fold, que es donde el PRD dice que se juega el partido (sección 3).
- **Al hacer scroll:** barra de 64px, logo `flat` a 28px, sin wordmark. La transición es **continua** (no un corte), y las capas de color se extinguen antes de que el símbolo baje del umbral del split, para que nunca se renderice el estado ambiguo. Es el umbral aplicado en movimiento: el `split` existe exactamente mientras hay sitio para él. El wordmark se desvanece en opacidad manteniendo su ancho: una primera implementación animaba el `max-width` y recortaba el nombre a mitad de letra ("Francisco Lo"), que se leía como un bug de truncado.
- **Móvil:** verificado a 375px — el símbolo no desequilibra la barra estrecha, no hace falta regla aparte.

**Ajuste de tamaño (2026-07-21, tras verlo en la página real):** el primer valor fue `split` a 64px en barra de 96px. Al navegarlo en vivo, Francisco lo percibió grande y desproporcionado respecto al wordmark. Al medirlo, las dos percepciones eran la misma: el símbolo había crecido de 24 a 64px pero el wordmark seguía en ~18px, dejando el lockup al **29%**, por debajo del rango normal del 40-45%. De ahí salieron dos cambios: una regla nueva de proporción del lockup (ahora en `BRAND.md`) y una comparativa de cuatro tamaños en el nav real. Resultado: **48px**, con el umbral del split corregido de 64 a 48 — ver el porqué del cambio de umbral en `BRAND.md`, regla 1. Beneficio colateral: la barra baja de 96 a 80px, 16px más de above the fold.
- **Motion:** esto no abre frente nuevo respecto a la regla de la sección 6 ("una vez al entrar en viewport, nunca en bucle"). El nav ya cambiaba con el scroll en el diseño validado; el cambio es que ahora es continuo en vez de un corte seco, que es menos agresivo, no más. Con `prefers-reduced-motion`, salto entre estados sin interpolar.

**Descartado en el proceso:** duplicar el `split` en el footer (deja el logo flotando con ~246px de vacío, desconecta el copyright y rompe la fila única de baja densidad) y ensanchar el desplazamiento del split para que entrase en el nav compacto (cambiaría el monograma para que quepa donde no cabe, dejando de ser el "ligero desplazamiento" que define `BRAND.md`).

**Cerrado 2026-07-19:** diseño de Hero + Hitos + nav sticky validado y aprobado tras tres rondas de correcciones (comportamiento del logo, colapso mobile, alineación de la fila destacada de Hitos) — ver tarea de Notion.

---

## 7. Arquitectura de la página

**Arquitectura vigente (2026-07-19 — ver decisión "Análisis de mejora V1" más abajo y sección 15):**

1. **Nav (sticky, presente en todo el scroll)** — logo `flat` compacto desde la carga; al hacer scroll cambia a `split` a color sin círculo, con altura igualada a la de los demás controles del nav (ver sección 6); Descargar CV; toggle Claro/Oscuro (solo icono, ver sección 11). *(Actualizado 2026-07-20, ver sección 16: "Sobre mí" sale del nav en V1 — la página se pospone entera a V2 — vuelve al nav cuando exista.)* En mobile, CV colapsa detrás de un icono de menú. LinkedIn no vive aquí.
2. **Hero** — foto, headline, subheadline. Sin CTA propio (ver sección 5).
3. **Hitos** *(sustituye a "Selected Work")* — filas escaneables (nombre + una línea de impacto/resultado + año, sin icono — ver sección 16). El exit de TheTool es el hito destacado. Sigue siendo la red de seguridad para el lector que escanea rápido (ver decisión en sección 4): va justo después del Hero.
4. **Cómo trabajo** — el proceso: Discovery → UX → Prototipado → Desarrollo → Lanzamiento → Analítica (paso "Lanzamiento" añadido 2026-07-20, ver sección 16).
5. **Más allá del PM** — reformulado como pieza narrativa (cofundador, growth, marketing) que no repite los proyectos ya vistos en Hitos; diseño cerrado (ver 8.3).
6. **Trayectoria** *(promovida en jerarquía por encima de Toolkit el 2026-07-19)* — cronología con 1-2 frases de qué trabajo se hizo y con qué autoridad (seniority) por experiencia; incluye un CTA secundario de Descargar CV (cubre el nav oculto tras el menú hamburguesa en mobile).
7. **Toolkit** — herramientas agrupadas por categoría, con logos reales monocromo (ver 8.4 y sección 16).
8. **Formación** — sección independiente, escaneable.
9. **Contacto** — email, teléfono, LinkedIn, descargar CV.
10. **Footer** — Brand Kit + Design System + LinkedIn *(Accesibilidad se retira de V1, ver sección 16; la página se renombró de "Sistema de diseño" a **Design System** el 2026-07-22, ver sección 20)*.

*(Corregido 2026-07-22: la lista tenía Toolkit en el 6 y Trayectoria en el 7, contradiciendo su propia anotación de "promovida por encima de Toolkit" y lo que dice 8.5. El orden real, implementado y validado el 2026-07-20, es Trayectoria antes que Toolkit; la lista numerada se quedó sin actualizar el 19 de julio. Se detectó al auditar la página de Sistema de diseño, cuyo "Esqueleto navegable" arrastraba el mismo orden viejo.)*

**Sobre mí** no es una sección de este flujo — ver decisión abajo: es una **página propia con URL**, enlazada desde el nav, con contenido de tono personal. No compite por posición en la lista de arriba, igual que Brand Kit y Sistema de diseño ya son páginas propias enlazadas desde el footer.

**Decisión (2026-07-17):** se confirman las 4 secciones adicionales que estaban pendientes (ver sección 12). **Brand Kit** y **Accesibilidad** viven en el **footer** (bloque 8 de arriba). **Sobre mí** (sección nueva, no listada arriba) y **Contacto ampliado** (expande el bloque 7) tienen ubicación propia dentro del flujo de página — el layout exacto se define en la fase de diseño (Claude Design), no aquí.

**Decisión (2026-07-17, ampliación):** se añade un tercer enlace de footer, **Sistema de diseño** — la página generada en la tarea "Diseño Claude Design — Sistema global" (grid, breakpoints, tipografía, accesibilidad medida, motion), publicada como prueba de proceso, no solo de estética. Va como enlace propio, separado de Brand Kit: Brand Kit demuestra identidad visual (logo, color, tipografía como activo de marca); Sistema de diseño demuestra rigor de producto/ingeniería (grid, accesibilidad, motion) — son señales distintas y fusionarlas diluye ambas. Encaja con el objetivo de la sección 1 ("la propia web actúa como prueba de criterio técnico y de diseño") y diferencia frente al "portfolio tipo freelancer" que la sección 6 pide evitar. Antes de publicar, requiere una pasada de limpieza: la versión actual lleva chrome de editor (panel "Tweaks" de density/readingMeasure) que no debe llegar a producción — ver tarea de seguimiento en Notion.

**Diseño Claude Design — Trayectoria + Formación (resuelto 2026-07-18):** construidas como dos secciones independientes (no una sola de dos columnas como sugería la redacción original del bloque 6), cada una a partir de una referencia de moodboard distinta, adaptada a los tokens y patrones ya establecidos en el resto de la página:
- **Trayectoria**: basada en `timeline-empleos-opcion3` — filas fecha / rol+empresa / icono, separadas por línea divisoria. Adaptación obligatoria sobre la referencia: sin logos de empresa a color (choca con "Evitar", sección 6, y con `BRAND.md`), sustituidos por icono monocromo genérico. Shutapp Projects se renderiza como fila padre con TheTool y PICKASO anidados debajo, conectados con un borde vertical — mantiene visible la agrupación ya decidida en 8.5. En la primera construcción aparecieron 3 errores de datos (fechas de KUOTIP y TheTool, y una empresa inventada — "Canvas Media" — en la fila de Marketing & Growth); corregidos y verificados contra la tabla de 8.5.
- **Formación**: basada en `timeline-empleos-opcion2` — mismo patrón de aside fijo + lista con icono/título/institución que ya usa "Cómo trabajo", agrupada en Producto y Marketing. Verificada contra 8.6 sin errores en la primera construcción.

**Diseño Claude Design — Contacto (resuelto 2026-07-18):** se descarta la referencia de moodboard `contacto.webp` — trae un formulario (Nombre/Email/Empresa/Mensaje) y una foto grande decorativa, y ambas cosas chocan con decisiones ya tomadas: no hay formulario en V1 (sección 9, "no hay forma de medir conversión real, solo el clic") y no hay fotografía secundaria en la página (solo la del Hero). En su lugar se reutiliza el mismo patrón fila+divisor de Trayectoria: 4 filas (Email, Teléfono, LinkedIn, CV), cada una un enlace completo clicable (`mailto:`, `tel:+34629832720`, LinkedIn en pestaña nueva, CV con `href="#"` como placeholder hasta que exista el PDF).

**Diseño Claude Design — Footer (resuelto 2026-07-18):** tarea añadida fuera del backlog original (gap de planificación detectado esta sesión — el footer nunca tuvo tarea propia pese a estar en la arquitectura de página). Se revisaron 5 referencias de moodboard (`footer-1` a `footer-5`); se descartan las de tipo SaaS multi-página con 4-5 columnas de navegación (`footer-1`, `footer-2`, `footer-4`) por sobredimensionar una web de una sola página — justo el riesgo de "portfolio tipo freelancer" que la sección 6 pide evitar. Se toman ideas puntuales de `footer-3` (fila de utilidades, selector de idioma) y `footer-5` (baja densidad). Layout final: **una sola fila**, no el bloque de dos pisos de las referencias — logo en variante `flat` + copyright a la izquierda, los 3 enlaces (Brand Kit, Sistema de diseño, Accesibilidad) en el centro, LinkedIn a la derecha. Sin GitHub (no hay perfil en los datos del candidato, sección 10). Sin texto de cierre/tagline, coherente con la regla de espacio en blanco (sección 6). Se deja hueco conceptual junto a los 3 enlaces para el selector de idioma de V2 (i18n), sin construir un control no funcional en V1.

**Actualizado 2026-07-20 (ver sección 16):** el enlace **Accesibilidad se retira del footer en V1** — vuelve en V2 con el contenido completo de la página (declaración WCAG, contacto para reportar problemas), en vez de publicarlo antes vacío o a medias. El footer de V1 queda con 2 enlaces centrales (Brand Kit, Sistema de diseño) en vez de 3 — ajuste pendiente sobre el diseño ya cerrado.

**Dos correcciones más al footer (detectadas 2026-07-21 al calibrar el logo, ver sección 6):**
- **Centrado óptico del grupo de enlaces.** El diseño construido usa `justify-between` con tres grupos de anchos muy dispares (bloque izquierdo 197px, LinkedIn 18px), así que el grupo del medio se desplaza hacia el lado estrecho: medido, caía **90px a la derecha** del centro real de la fila (8,9%). Con 3 enlaces el grupo era más ancho y lo disimulaba; con 2 se nota. Debe centrarse ópticamente sobre el ancho total de la fila, no repartirse con `justify-between`. Corrección ya verificada en el tablero de calibración: desviación resultante de 0,5px.
- **Tamaño del logo: `flat` a 32px** (ver tabla de uso en `BRAND.md`). El construido lo dejaba a 15px, por debajo del icono de LinkedIn de 18px que lo acompaña y al mismo peso visual que el símbolo `©` de al lado. Se evaluó y descartó usar aquí el `split` a 64px (ver sección 6).

**Gap detectado (2026-07-18):** "Sobre mí" — mencionado en la decisión del 2026-07-17 de arriba como sección con "ubicación propia dentro del flujo de página" — nunca llegó a tener tarea en Notion ni se ha construido en el mockup. Trayectoria, Formación, Contacto y Footer ya cierran la página sin que exista un hueco para ella. **Resuelto 2026-07-19** — ver decisión "Análisis de mejora V1" justo abajo: no es sección del flujo, es página propia.

**Análisis de mejora V1 — Diseño, Marca y Arquitectura (resuelto 2026-07-19, ver sección 15 para el detalle completo del debate):** tras ver la V1 ya montada en Claude Design, un análisis exhaustivo ([documento en Notion](https://app.notion.com/p/3a12caec08be8133b636eefaccd9bbb2)) detectó que la estructura se sentía repetitiva (Selected Work / Más allá del PM / Trayectoria solapaban contenido) y que Trayectoria quedaba mal jerarquizada (por debajo de Toolkit). Decisiones tomadas:

- **Selected Work → Hitos, sustitución completa** (no conviven ambas secciones). Se acepta perder la profundidad de proceso de los 3 casos a cambio de un quick-scan más contundente. Esa profundidad se traslada a Trayectoria (ver 8.5) y, más adelante, al deep-dive por experiencia de V2/V3 — cada hito/experiencia debe prever un enlace o CTA hacia ese deep-dive futuro, aunque no se construya en V1.
- **Reparto del contenido que antes vivía en la línea "Seniority" de cada caso de Selected Work:** Hitos se queda con el resultado/impacto puro (ej. TheTool → "Nominado a Mejor Software ASO de Europa · Exit con AppRadar"); Trayectoria se queda con la autoridad real (reporta a CEO, socio con voto, liderazgo por influencia) dentro de sus 1-2 frases por experiencia — así ninguna sección se sobrecarga y la mitigación del riesgo "el sitio no transmite la autoridad real del rol" (sección 11) sigue viva, solo que cambia de sitio.
- **Contenido base de Hitos:** la lista "Logros" de la sección 10 es prácticamente reutilizable tal cual.
- **Hero pierde su CTA propio**; Descargar CV, Sobre mí y el toggle de tema pasan a un nav sticky presente en toda la página (ver sección 5) — sin coste real de conversión porque el CV sigue disponible en todo momento. LinkedIn se queda solo en el footer. Trayectoria añade un CTA secundario de Descargar CV para cubrir el hueco del nav oculto en mobile (menú hamburguesa).
- **Toggle Claro/Oscuro se reduce a icono sin texto** (sol/luna, `lucide-react`) para quitarle protagonismo frente a CV/Sobre mí, sin romper accesibilidad — ver requisitos en sección 11.
- **Sobre mí**: página propia con URL (no sección ni modal), con contenido de tono personal — mismo patrón que ya usan Brand Kit y Sistema de diseño. Contenido exacto pendiente de redacción (sección 12).
- **Más allá del PM**: se reformula para no repetir Hitos/Trayectoria, como pieza narrativa que rompa la monotonía visual de la mitad inferior de la página — forma concreta pendiente de fase de diseño.
- **Criterio de "cuándo el minimalismo se pasa"** (resuelve el riesgo abierto en sección 11): el espacio en blanco se ha pasado de la raya cuando deja de dirigir la atención y empieza a diluir la información. Bien: aire generoso alrededor de lo importante. Mal: aire uniforme sobre todo por igual. Regla práctica: espacio jerarquizado, no uniforme.
- **Brand Kit y Sistema de diseño** (páginas del footer): se mantienen para V1 tal como están (solo limpieza de chrome de editor, ya en backlog); el reequilibrio de color y la actualización con la nueva arquitectura de la web se aplican ahí en V2 (sección 13).

---

## 8. Contenido por bloque

### 8.1 Hitos

*(hasta 2026-07-19 se llamaba "Selected Work" — ver decisión de sustitución en sección 7 y el debate completo en sección 15.)*

Formato: fila escaneable = nombre + **una línea de impacto/resultado** + año, **sin icono** (ver sección 16 — se retiró el icono monocromo original: no tenía relación directa con cada hito y metía ruido en una sección pensada para quick-scan puro). Base de contenido: la lista "Logros" de la sección 10.

**Redacción final (validada 2026-07-19):** un hito = un reconocimiento/resultado externo, no un resumen por empresa — orden **cronológico descendente** (más reciente primero), igual que la referencia de moodboard `hitos.webp` (formato "Awards"):

- **2026 — Emendu**: Partnership estratégico con Sesame HR.
- **2023 — INDYA**: Churn mensual 16% → 10%, activación primer mes +28%.
- **2022 — INDYA**: Seleccionada por Apple App Store Foundations.
- **2021 — TheTool**: Adquirida por AppRadar + chip **EXIT** en color. *(hito destacado — ver el tratamiento final en la sección 21)*
- **2019 — TheTool**: Nominado a Mejor Software ASO de Europa (App Promotion Summit).

Al nombrar "Sesame HR" explícitamente aquí, se confirma que el anonimizado "un player grande de HR" del detalle de proceso de abajo (histórico, sección 8.3) fue solo por no repetir el nombre en el copy narrativo — no hay problema de confidencialidad en nombrarlo.

KUOTIP se queda fuera de Hitos, igual que se quedó fuera de Selected Work (ver 8.3 y decisión 2026-07-16): su pieza de IA aplicada ya tiene sitio explícito en "Más allá del PM".

**Detalle de proceso (histórico — insumo para el "Resumen" de Trayectoria en 8.5 y para el deep-dive de V2/V3, ya no se muestra como sección propia):**

#### TheTool — SaaS B2B (ASO)
*Cofundador & Product Manager · Mayo 2016 – Octubre 2021*

- Cofundador responsable de visión, diseño del MVP, validación y lanzamiento de la versión de pago.
- Diseñé y evolucioné funcionalidades clave: correlación instalaciones/ASO, dashboards avanzados de tracking, ASO score, análisis internacional, timeline y monitorización masiva.
- Transformé en 3 días una funcionalidad oculta de Google Play en un feature completo, generando +30% en clientes/MRR.
- Lideré roadmap, discovery, definición funcional y coordinación con desarrollo, marketing y CS.
- Incorporé el primer Product Designer, liderando un rediseño completo de UI y marca.

**Seniority:** socio fundador (1 de 4), con voz y voto en todas las decisiones clave de la empresa. El CTO se centraba en arquitectura, código y escalabilidad y no quería gestión de equipo — así que lideré de facto todo lo que no fuera código puro: equipo de 2 backend, 1 frontend y 1 diseñador (este último a mi cargo directo).

#### INDYA — SaaS B2C (Health tech · App)
*Product Lead · Enero 2022 – Diciembre 2023*

- Co-definí la estrategia de crecimiento enfocada en activación, engagement y retención.
- Introduje prácticas sistemáticas de user research (entrevistas, encuestas post-churn, análisis continuo).
- Rediseñé el pricing mediante A/B testing, unificando planes y eliminando barreras de entrada sin afectar retención.
- Mejoré la activación del primer mes optimizando onboarding, personalización y comprensión de valor.

**Decisión (2026-07-17):** se retira "ARPU↑" de los resultados — no se dispone de la cifra exacta, y una métrica sin cuantificar junto a otras que sí llevan número (16%→10%, +28%) resta credibilidad al conjunto en vez de sumar. Mejor 3 resultados sólidos que 4 con uno débil.

**Seniority:** reportaba al CPO y cofundador; miembro del equipo de liderazgo junto a Marketing y Nutrición. En el día a día ejercía liderazgo por influencia, sin autoridad formal: dailies y retros con el equipo de desarrollo los gestionaba yo.

#### Emendu — SaaS B2B (IT Management)
*Product Manager · Febrero 2025 – Actualidad*

- Lideré el paso de una organización centrada en Sales & Operaciones, con operativa manual, a un sistema digital y apificado.
- Redefiní el ICP mediante discovery y reorienté la experiencia de usuario (onboarding y flujos clave).
- Evolucioné LISA (agente IA): de sistema inconsistente a agente funcional con acceso dinámico a datos, documentación viva y capacidades multilenguaje.
- Impulsé el paso de un SaaS desarrollado por agencia externa (Bubble) a un modelo con equipo técnico interno, incluida la incorporación de un CTO.
- Lideré, junto al Tech Lead, un partnership estratégico con un player grande de HR.

**Resultados adicionales (no usados en Hitos, disponibles para el deep-dive):** nuevo ICP · digitalización completa del proceso de renting · implantación de Amplitude · instalación MDM.

**Seniority:** reporto directamente al CEO; miembro del equipo de liderazgo junto a Operaciones, Finanzas y Tech.

### 8.2 Cómo trabajo

Proceso: **Discovery → UX → Prototipado → Desarrollo → Lanzamiento → Analítica.**

**Paso "Lanzamiento" añadido (resuelto 2026-07-20, ver sección 16):** nuevo paso entre Desarrollo y Analítica — cubre experimentación (A/B testing), despliegues progresivos y feature flags. Encaja con el ICP de la sección 4 (SaaS con producto real, no early-stage) al demostrar rigor de release management, no solo de construcción.

**Copy validado (2026-07-20):**
> Lanzamiento — Despliegue selectivo: Standard o feature flags, rollout progresivo y A/B testing para evaluar la consecución del objetivo.

**Párrafo de entrada de la sección (actualizado 2026-07-22):**
> Un método end-to-end: del problema al dato que confirma que el objetivo se ha cumplido. Seis etapas que se retroalimentan.

*El anterior decía "Cinco etapas" y llevaba desactualizado desde que se añadió Lanzamiento el 2026-07-20. No era solo una mejora de redacción: el dato estaba mal.*

### 8.3 Más allá del PM

**Reformulación (resuelto 2026-07-19, ver sección 15):** esta sección deja de ser una lista más (que repetía proyectos ya vistos en Hitos/Trayectoria) y se reformula como **pieza narrativa** — un "separador" visual que rompa la monotonía de la mitad inferior de la página. El contenido de fondo (founder, growth) se mantiene; la forma concreta (qué es visualmente, qué tan largo, qué agarra al morado como acento) queda **pendiente de la fase de diseño** (ver sección 12).

**Forma y copy final (resuelto 2026-07-20):** de tres direcciones planteadas (banda de manifiesto sin cifras / cifra+frase animada / franja asimétrica con split del logo), se elige la **banda de manifiesto**: sección full-width, sin tarjetas ni cifras (esas ya viven en Hitos y Trayectoria), solo titular en Bricolage sobre fondo `brand-purple-soft`, con reveal fade-up una vez al entrar en viewport. Se descarta la cifra animada (3,2M→9,4M de Malavida) por redundar con el mecanismo de motion ya usado en Hitos, y la franja con split del logo por tensionar la regla de `BRAND.md` que reserva el split al logo/monograma.

Foco de contenido explícitamente priorizado por Francisco: **primer nivel Founder** (varios proyectos cofundados, no todos con exit — TheTool sí, con AppRadar; de los que no salieron, aprendizaje de timing y lectura de situaciones de startup), **segundo nivel Growth** (años de captación de usuarios como origen del enfoque de producto). Sin nombrar KUOTIP explícitamente — solo la señal de "varios intentos, no todos con exit".

**Copy validado:**
> Cofundador varias veces. Exit una vez. De lo que no salió, aprendí lo que ningún framework enseña.
> Antes de eso, años captando usuarios, antes de medir producto, entendí cómo atraerlos.

**Estructura de color y kicker (resuelto 2026-07-20):** `brand-purple-soft` y `brand-purple` no cambian entre temas (ver `globals.css`/BRAND.md, "los pasteles se mantienen entre temas") — con fondo pastel fijo, la sección ya rompe monotonía en modo oscuro de forma natural (queda como "isla clara" sobre página oscura) pero en modo claro es solo un cambio de tono sutil, no una inversión real. Se deja a Claude Design **explorar ambas estructuras** en el mismo prompt: (a) fondo pastel fijo, morado como fondo protagonista; (b) inversión explícita — fondo/texto intercambian los tokens `foreground`/`background` (oscura en claro, clara en oscuro, simétrica en ambos temas), con el morado degradado a acento puntual — verificando en este caso el contraste AA del acento morado contra ambos fondos invertidos. La sección lleva además un **kicker visible "Más allá del PM"**, discreto, igual que el kicker del Hero — consistencia estructural y heading accesible sin competir con el titular grande.

**Cierre de diseño (validado 2026-07-20):** de las dos estructuras, se elige la **B (inversión explícita)** — confirmada simétrica en ambos temas (banda oscura en claro, banda clara en oscuro). El acento morado sobre "Exit" usa el nuevo token `brand-purple-accent` (ver BRAND.md), con contraste AA verificado en ambas direcciones. Se detectó que la frase de growth dejaba un vacío a la derecha de la banda (columna angosta compartida con el titular); se corrigió pasándola a una sola línea que ocupa buena parte del ancho (sin igualar el peso/tamaño del titular de founder, manteniendo la jerarquía founder > growth) — queda un margen de aire a la derecha que se valida como intencional, no como vacío. Diseño cerrado, listo para desarrollo.

**Founder**
- TheTool → Exit (ver Selected Work).
- PICKASO (Shutapp Projects) — profesionalicé estructura, procesos y cartera de servicios de la agencia; ese trabajo financió el arranque de TheTool y me dio el conocimiento de mercado (apps, herramientas, sector) con el que lo fundé. Bootstrapping real, no narrativa a posteriori.
- KUOTIP — Cofundador & Product (SaaS B2B · IA/Reviews), Feb 2024 – Nov 2024: validación de problema (fraude/manipulación en reviews), diseño de flujos con verificación por voz y resúmenes automáticos con IA, MVP con UI visual moderna, apoyo a la CEO en fundraising pre-seed.

**Decisión (2026-07-16):** KUOTIP se queda fuera de Selected Work (se mantienen los 3 casos SaaS B2B/B2C ya definidos) pero, al ser la prueba más directa del pilar "IA aplicada" del brief (sección 1), su componente de IA generativa debe quedar explícito aquí — no diluirlo a una línea de founder más.

**Growth** (experiencia 2009–2015, base analítica y de experimentación que define su enfoque actual como PM)
- SEO / SEM / CRO / Marketing Digital.
- Ontecnia (proyecto Malavida.com): crecimiento orgánico de 3,2M → 9,4M visitas mensuales; transición de modelo de negocio (de instaladores intrusivos a contenido de valor + monetización por vídeo).
- Havas Media, Increnta, Miss Conversion: adquisición y performance en agencias líderes. *(Searchmedia se renombró a Increnta — actualizado 2026-07-20, ver sección 16.)*

### 8.4 Toolkit

> "Las herramientas son medios, no fines. Aquí tienes las que me ayudan a trabajar mejor y cumplir objetivos."

**Redacción final (validada 2026-07-19):** se afiló en vez de quitar — la primera frase se mantiene (justifica el porqué del tratamiento sin logos/certificaciones, ver más abajo) y la segunda la convierte en lead-in personal hacia las tarjetas, en vez de una sentencia suelta genérica. Ver decisión "Pendiente (2026-07-19)" más abajo.

**Recategorización (resuelto 2026-07-20, ver sección 16):** reemplaza la lista anterior por categorías y herramientas más específicas de cómo trabaja Francisco realmente:

- **Usuarios:** Amplitude, Google Analytics, Microsoft Clarity, Typeform.
- **Gestión y Documentación:** Jira, Notion, Miro, Mermaid.js.
- **Diseño y prototipado:** Claude Design, Figma, v0.
- **Desarrollo:** Claude Code, VS Code, Vercel, GitHub.

**Decisión (2026-07-20):** las categorías "Pagos" (Stripe) e "IA" (propia, con Anthropic API/Claude Code/MCP) del listado anterior desaparecen como tales para V1 — Claude Code y Claude Design quedan repartidos en Desarrollo/Diseño sin sección propia. La categoría "IA" vuelve a existir como propia cuando se aborde la IA conversacional en V3 (sección 2/13), momento en que sí aporta tener una categoría dedicada. Esto relaja parcialmente la mitigación de "sobrevalorar certificaciones IA" (sección 11) — se acepta conscientemente porque el objetivo aquí no es formación sino uso práctico, y ese uso sigue visible dentro de Desarrollo/Diseño aunque sin categoría destacada.

**Decisión (2026-07-16, histórica):** el uso de IA se movió aquí desde "Formación" (sección 8.6) — listarlo junto a un máster o un bootcamp sobredimensionaba una práctica de herramienta como si fuera una credencial formal, exactamente el riesgo que el propio brief señala ("sobrevalorar certificaciones IA", sección 11). Esta decisión histórica ya no aplica igual tras el cambio de 2026-07-20 de arriba, pero se mantiene como registro de por qué IA vivió en Toolkit y no en Formación.

**Logos reales monocromo (resuelto 2026-07-20, ver sección 16):** los iconos genéricos `lucide-react` se sustituyen por el logo real de cada herramienta, procesado a **un único color plano por tema** (versión para tema claro y versión para tema oscuro) — no el color de marca original de cada producto. Esto no rompe la regla de `BRAND.md` ("no logos de empresa a color"): sigue siendo monocromo, solo cambia de icono genérico a silueta real de marca. Los archivos de origen son `.webp` (no SVG como se pensaba en un primer momento), lo que implica procesarlos como raster (extraer silueta, recolorear, exportar PNG a tamaño unificado) en vez de editar un `fill` de vector — viable con `sharp` (ya en el proyecto), pero varios archivos no tienen canal alfa (fondo sólido en vez de transparente), así que necesitan una pasada de QA visual uno por uno, no un proceso por lotes ciego. **Pendiente:** falta el logo de Amplitude en la carpeta de origen.

**Nueva frase de Toolkit (validada 2026-07-20, ver sección 16):** sustituye a «Las herramientas son medios, no fines. Aquí tienes las que me ayudan a trabajar mejor y cumplir objetivos.»

**Copy validado:**
> Las herramientas son medios, no fines. Estas son algunas que me han ayudado a hacer mejor mi trabajo y conseguir mis objetivos.

**Cambio de layout (2026-07-20):** la frase pasa a ir **debajo** del H2 "Toolkit" (no al lado, como el patrón que comparte con Trayectoria/Toolkit hasta ahora) — decisión explícita de Francisco, solo para esta sección.

**Cierre de diseño (validado 2026-07-20):** recategorización + logos reales + nueva frase implementados y confirmados por Francisco en claro y oscuro. El logo de Amplitude necesitó una corrección aparte (ruido de compresión del `.webp` original leído como entramado de puntos alrededor del círculo). Además, las descripciones de cada tarjeta se acotaron a la longitud de la de Jira (la más corta) para que todas las tarjetas de una fila tengan la misma altura.

**Riesgo de diseño a vigilar:** el brief pide evitar "portfolio tipo freelancer", pero un Toolkit resuelto como grid de logos cae justo en ese patrón. La cita de arriba ayuda en el copy, pero la solución real es de diseño (fase Claude Design): evitar el grid de logos, priorizar cómo se usa cada herramienta sobre qué herramienta es.

**Tratamiento visual (resuelto 2026-07-17):** tarjetas agrupadas por categoría (las 5 de arriba), cada una con icono monocromo `lucide-react` (hereda `foreground`, sin color de marca) + nombre + una frase en primera persona de cómo se usa esa herramienta (no descripción genérica del producto). Se descartó explícitamente el logo a color: entra en conflicto con "Evitar" (sección 6, "logos de empresas a color") y con la disciplina de color de `BRAND.md` (los tokens semánticos neutros no admiten colores de marca ajenos). Referencia de moodboard: [Referencias — Tools](https://app.notion.com/p/39f2caec08be8090bf5bf6cb39ee63e2) (las 3 opciones usan logo a color + tarjeta; se adapta la estructura — agrupación por categoría, ritmo de tarjeta — sin el logo a color).

**Actualizado 2026-07-20 (ver sección 16):** el icono `lucide-react` de cada tarjeta se sustituye por el logo real de la herramienta en monocromo (ver decisión arriba) — sigue sin ser "logo a color", así que la regla de "Evitar" (sección 6) y de `BRAND.md` se mantiene intacta; solo cambia genérico por silueta real.

**Navegación (resuelto 2026-07-17):** la primera versión mostraba las 5 categorías apiladas y visibles a la vez — demasiada información de golpe. Se corrige a **pestañas por categoría**: se ve una categoría (sus tarjetas) cada vez, cambiando entre Analítica/Gestión/Diseño y desarrollo/Pagos/IA mediante pestañas — más cercano a la referencia del moodboard, reduce la densidad visual y mantiene la coherencia con "muchísimo espacio en blanco" (sección 6). El contenido y los iconos monocromo no cambian, solo cómo se revela. Verificado en claro y oscuro; la pestaña activa usa `primary` (se corrigió una implementación inicial que usaba un color neutro, incumpliendo la regla de BRAND.md de que los estados activos usan `primary`).

**QA de esta fase (2026-07-17):** verificado en claro y oscuro. Se detectó y corrigió un bug de renderizado exclusivo de modo oscuro en "Más allá del PM" (el texto de PICKASO y de Ontecnia se duplicaba con un fragmento roto entre repeticiones) — no afectaba a modo claro.

### 8.5 Trayectoria

**Trayectoria promovida y ampliada (resuelto 2026-07-19, ver sección 15):** sube de posición en la jerarquía (por encima de Toolkit) y cada fila gana un **Resumen de 1-2 frases**: qué trabajo se hizo + con qué autoridad (seniority) — el contenido de autoridad que antes vivía en la línea "Seniority" de Selected Work/Hitos (8.1) se traslada aquí.

**Estructura en dos bloques (resuelto 2026-07-19):** igual que Formación (8.6) ya separa Producto/Marketing, Trayectoria se divide en **Producto** (el timeline principal) y **Experiencia previa — Marketing & Growth** (2009–2015), cada uno con una frase de apertura que resume el bloque. **No cambia el tratamiento visual**: sigue siendo el mismo patrón de fila+divisor ya diseñado, con Shutapp Projects como fila padre y TheTool/PICKASO anidados debajo tal como se decidió el 2026-07-17 — solo se añade la frase de apertura por bloque, nada más.

**Redacción final (validada 2026-07-19):**

**Producto**
> Diez años liderando producto en SaaS B2B y B2C — de cofundador con exit a Product Manager en startups y scale-ups — con foco constante en discovery, UX y resultados medibles.

*(Actualizado 2026-07-22: se añade "startups y" — la frase solo decía scale-ups y dejaba fuera media trayectoria.)*

| Empresa | Rol | Periodo | Resumen |
|---|---|---|---|
| Emendu | Product Manager | Feb 2025 – Actualidad | Lideré la digitalización de Sales & Operaciones y evolucioné el agente IA LISA; miembro del equipo de liderazgo junto a Dirección, Operaciones, Finanzas y Tech. |
| KUOTIP | Cofounder & Product | Feb 2024 – Nov 2024 | Validé el problema de fraude en reviews y diseñé el MVP con verificación por voz e IA; como cofundador, apoyé a la CEO en el fundraising pre-seed. |
| INDYA | Product Lead | Ene 2022 – Dic 2023 | Rediseñé pricing y onboarding para mejorar activación y reducir churn; liderazgo del equipo y optimización de la entrega de valor mediante procesos y agilidad. |
| Freepik | Product Manager | Oct 2021 – Dic 2021 | Investigué y definí funcionalidades para el área de contributors a partir de análisis cualitativo y cuantitativo. Gestión de los OKR del squad. |
| **Shutapp Projects** — TheTool | Cofounder & Product | May 2016 – Oct 2021 | Cofundador con voz y voto en las decisiones clave; lideré producto, roadmap y el equipo de desarrollo (backend, frontend, diseño). |
| **Shutapp Projects** — PICKASO | COO | Sep 2015 – Dic 2016 | Profesionalicé estructura y cartera de servicios de la agencia; realicé la investigación de mercado de los futuros competidores de TheTool. |

**Experiencia previa — Marketing & Growth (2009–2015)**
> Esta etapa previa en marketing y growth construye la base analítica, de experimentación y user-first que define mi enfoque como Product Manager.

| Proyecto | Rol | Periodo | Resumen |
|---|---|---|---|
| Ontecnia (Malavida, Lecturalia, BonViveur…) | Digital Marketing Manager | Sep 2013 – Sep 2015 | Crecimiento orgánico de 3,2M → 9,4M visitas mensuales; llevé el modelo de negocio de instaladores intrusivos a contenido de valor y monetización por vídeo — el inicio de mi giro hacia product-first. |
| Havas Media, Increnta, Miss Conversion | Digital Marketing / Performance | 2009 – 2013 | Adquisición y performance en agencias líderes — la base de analítica, CRO, UX y liderazgo que facilitó el salto a producto. |

**Resuelto (2026-07-16):** PICKASO y TheTool no son un solapamiento accidental — ambos son proyectos de **Shutapp Projects**. Entré en PICKASO (agencia de marketing de apps) por dos motivos: profesionalizar la empresa y mejorar su cartera de servicios, y conocer desde dentro el mercado de apps y sus herramientas — el background que hizo posible fundar TheTool con criterio. Además, la mejora de facturación que impulsé en PICKASO sustentó financieramente el arranque de TheTool. Es decir: la agencia fue a la vez la escuela de mercado y el motor financiero del SaaS.

**Tratamiento visual (resuelto 2026-07-17):** se agrupan ambas entradas bajo el paraguas **"Shutapp Projects"** en el timeline (ver tabla arriba), en vez de dejarlas como dos filas independientes con una nota inline. Motivo: la duda sobre el solapamiento de fechas ya ha surgido en entrevistas reales — merece la pena resolverla visualmente desde el principio para evitar que un reclutador la interprete como un error o una inconsistencia del CV.

**Composición de página (resuelta 2026-07-18):** construida en Claude Design — ver decisión "Diseño Claude Design — Trayectoria + Formación" en sección 7. El patrón visual de fila+divisor **no cambia** con la ampliación de 2026-07-19: al quedarse en 1-2 frases por fila, el timeline ligero ya diseñado sigue sirviendo, solo se rediseña la posición de la sección en el flujo. La división en bloques Producto / Marketing & Growth (ver arriba) tampoco exige un componente nuevo — cada bloque es el mismo timeline con su frase de apertura encima; Shutapp Projects mantiene su tratamiento de fila padre + TheTool/PICKASO anidados sin cambios. Añade además un **CTA secundario "Descargar CV"** (cubre el hueco del nav sticky oculto tras el menú hamburguesa en mobile — ver sección 7).

**Rediseño cerrado (validado 2026-07-20):** implementado en Claude Design — Trayectoria sube por encima de Toolkit en el orden de la página; los Resúmenes de las 8 filas (Producto + Marketing & Growth) y las dos frases de apertura de bloque reproducen el contenido validado sin desviaciones; Shutapp Projects gana un subtítulo descriptivo ("Proyecto empresarial · dos roles") para igualar la estructura visual con el resto de filas. Dos ajustes de una ronda de revisión: (1) el CTA "Descargar CV" se reubicó del final de la sección a la cabecera, alineado a la derecha junto a la frase de apertura de "Producto" — mismo patrón que el H2+cita de Toolkit — para que no quede desconectado y aparezca antes en el scroll mobile; (2) se añadió un salto de espacio mayor (no solo el divisor fino entre filas) antes de "Experiencia previa — Marketing & Growth", para que la transición de bloque se lea como tal. Diseño cerrado, listo para desarrollo.

**Logos reales monocromo (resuelto 2026-07-20, ver sección 16):** el icono monocromo genérico de cada fila se sustituye por el logo real de la empresa, con el mismo tratamiento y las mismas dos versiones de tema que en Toolkit (ver 8.4). Cobertura: Emendu, KUOTIP, INDYA, Freepik, TheTool, PICKASO y Ontecnia (representa la fila "Ontecnia — Malavida.com" — Malavida no lleva marca propia en la web) tienen logo real. La fila **"Havas Media, Increnta, Miss Conversion" es la excepción**: al agrupar 3 empresas y no tener logo de Miss Conversion, iba a mantener el icono monocromo genérico original — **validado 2026-07-20: se quita el icono por completo en esa fila** (el genérico generaba ruido visual); es la única fila de Trayectoria sin icono/logo, decisión consciente de Francisco.

### 8.6 Formación

**Producto**
- Product Management — TheHeroCamp (2021).
- Scrum & Agile Leadership — theUncoding (2021).

**Marketing**
- **Resuelto (2026-07-17):** se confirma la versión CV (dos formaciones distintas, no una sola como decía el Brief):
  - *Máster en Comunicación Digital — Olea Europea (2001).*
  - *Gestión Comercial y Marketing — ESIC (2000).*

**Composición de página (resuelta 2026-07-18):** construida en Claude Design — ver decisión "Diseño Claude Design — Trayectoria + Formación" en sección 7.

**Logos reales monocromo (resuelto 2026-07-20, ver sección 16):** mismo tratamiento que Toolkit y Trayectoria (8.4/8.5) — el icono genérico de cada fila se sustituye por el logo real de la institución (TheHeroCamp, theUncoding, Olea Europea, ESIC), en monocromo, con versión clara y oscura. Cobertura completa, sin huecos de datos.

**Cierre de diseño (validado 2026-07-20):** los 4 logos subidos y confirmados por Francisco. Contacto no se tocó en esta pasada.

---

## 9. Sistema técnico

**Stack (ya implementado en este repo):** Next.js, TypeScript, Tailwind, shadcn/ui, lucide-react.

**Internacionalización:** preparada desde el primer día. Idioma inicial 🇪🇸 español; 🇬🇧 inglés se añade en V2.

**SEO:** meta tags, Open Graph, LinkedIn Cards.

**Objetivos no funcionales:** Lighthouse alto · Accesibilidad WCAG mínimo AA, objetivo AAA.

**Métricas de éxito (V1) — resuelto 2026-07-16:**

- **Métrica primaria — contacto iniciado:** clics en el enlace de email (`mailto:`) y en el de teléfono (`tel:`) de la sección Contacto. Es proxy de intención, no confirmación de que el email se envió o la llamada se hizo — no hay formulario en V1, así que no hay forma de medir conversión real, solo el clic.
- **Métricas secundarias — interés y alcance:**
  - % de scroll / profundidad de página vista, como proxy de si el contenido "profundo" (Hitos, Trayectoria) se está leyendo y no solo el Hero. **Actualizado 2026-07-19:** al ser Sobre mí ahora una página propia (sección 7), su visita se mide como página independiente, no como profundidad de scroll del home.
  - Clics en "Descargar CV" — proxy de interés fuerte que no siempre llega a contacto directo (ej. un CPO se descarga el CV para compartirlo internamente antes de escribir). **Actualizado 2026-07-19:** con el nav sticky (sección 7), el CV tiene ahora 3 puntos de clic a trackear — nav, CTA secundario de Trayectoria y Contacto — no solo Hero y Contacto como antes.
- **Herramienta:** Microsoft Clarity — **se adelanta de V2 a V1** (ver Roadmap, sección 13): sin medición desde el día 1 no hay forma de evaluar si V1 funcionó antes de invertir en V2. Clarity da profundidad de scroll de forma nativa; los clics en `mailto:`/`tel:`/descarga de CV se leen vía heatmaps/grabaciones de sesión, no como contador limpio de conversiones — eso llega con GA4 en V2.
- **Aviso de cookies (resuelto 2026-07-17):** Clarity usa cookies de sesión → en España requiere consentimiento. Se implementa un **banner simple de consentimiento** (aceptar/rechazar) antes de cargar Clarity — se prioriza cumplimiento robusto y estándar sobre el minimalismo visual. Pendiente de implementación técnica (ver Roadmap V1, sección 13).

---

## 10. Datos del candidato

- **Nombre:** Francisco Javier López Martínez
- **Objetivo:** Senior Product Manager, SaaS B2B / B2C
- **Email:** franciscojavier.lopezmartinez@gmail.com
- **LinkedIn:** [linkedin.com/in/franciscolopez1975](http://linkedin.com/in/franciscolopez1975)
- **Ubicación:** Valencia
- **Teléfono:** 629 832 720 — **se publica en Contacto** (resuelto 2026-07-16: es canal de la métrica primaria de éxito, ver sección 9, así que tiene que estar visible para poder medirse)

**Logros:**
- Cofundador de TheTool, exit → AppRadar.
- Nominación App Promotion Summit (Mejor Software ASO Europa).
- INDYA seleccionada por Apple App Store Foundations.
- Referente de producto en partnership con Sesame HR (vía Emendu).

*(Esta lista es la base de contenido de la sección **Hitos**, 8.1 — ver decisión 2026-07-19 en sección 7/15.)*

**Especialidades:** estrategia de producto, UX, discovery, roadmapping, métricas SaaS, pricing, IA aplicada, activación, churn, MRR.

---

## 11. Riesgos

| Riesgo | Mitigación |
|---|---|
| El sitio no transmite la autoridad real del rol | **Mitigado, actualizado 2026-07-19:** la evidencia de autoridad real (socio con voto en TheTool, reporting a CEO en Emendu, liderazgo por influencia en INDYA) ya no vive en Selected Work — con la sustitución por Hitos (8.1, quick-scan de resultados puros), esa autoridad se trasladó al "Resumen" de cada fila de Trayectoria (8.5). Sigue siendo evidencia concreta, solo cambió de sección. |
| Exceso de minimalismo | **Resuelto (2026-07-19, ver sección 15):** el espacio en blanco se ha pasado de la raya cuando deja de dirigir la atención y empieza a diluir la información. Bien: aire generoso alrededor de lo importante. Mal: aire uniforme sobre todo por igual. Regla práctica: espacio jerarquizado, no uniforme. |
| Sobrevalorar certificaciones IA | Mitigado: el bloque de uso de IA se movió de "Formación" (8.6) a "Toolkit" (8.4) para no listarlo al nivel de un máster — ver decisión en 8.4. |
| Denominaciones incorrectas de formación | **Resuelto (2026-07-17):** confirmada la versión CV — ver 8.6. |
| Estructura repetitiva (Selected Work / Más allá del PM / Trayectoria solapaban contenido) | **Nuevo, resuelto (2026-07-19, ver sección 15):** Selected Work sustituido por Hitos (quick-scan), Trayectoria promovida y ampliada, Más allá del PM reformulado como pieza narrativa — cada sección tiene ahora un rol distinto sin solapar. |

---

## 12. Decisiones pendientes

- ~~Secciones adicionales: "Sobre mí", "Brand Kit", "Contacto", "Sección accesibilidad"~~ — **resuelto** (ver sección 7): las 4 se trabajan en V1, no en V2. Brand Kit y Accesibilidad van en el footer; Sobre mí y Contacto ampliado tienen ubicación propia, pendiente de definir en diseño. Esto cambia el roadmap (sección 13): las "página de contacto" y "página de accesibilidad" que estaban en V2 quedan resueltas antes, como footer/sección en V1.
- ~~Verificar denominación correcta de la formación en Comunicación Digital~~ — **resuelto** (ver 8.6): versión CV, dos formaciones (Olea Europea 2001 + ESIC 2000).
- ~~Confirmar si el teléfono se publica en la web~~ — **resuelto** (ver sección 10): sí, en Contacto, porque es canal de la métrica primaria de éxito.
- ~~Casos de estudio: contenido base ya definido en este PRD (TheTool, INDYA, Emendu); pendiente validar la redacción final antes de publicar.~~ — **reemplazado y resuelto (2026-07-19):** Selected Work ya no existe como sección; el contenido se redistribuyó en Hitos (8.1) y Trayectoria (8.5) — **ambos con redacción validada 2026-07-19.** Trayectoria además se dividió en dos bloques (Producto / Experiencia previa — Marketing & Growth), igual que ya hace Formación (8.6).
- ~~Trayectoria — la fila de **Freepik** (Oct 2021 – Dic 2021) no tiene ningún resumen de contenido en el PRD~~ — **resuelto (2026-07-19):** Francisco aportó el contenido del CV (SaaS B2C/UGC, investigación de contributors, mejora de onboarding); redactado en 8.5.
- ~~Pospuesto (2026-07-19): contenido de la página **Sobre mí**~~ — **actualizado 2026-07-20 (ver sección 16):** ya no es solo el contenido lo que se pospone — la página completa (contenido + diseño + desarrollo) se mueve a V2 (ver Roadmap, sección 13). Sigue sin definir qué entra exactamente (¿hobbies, valores, una foto distinta, una anécdota?); hay referencia de moodboard (`Sobre-mi.png`, layout tipo "About Us") que necesitará la misma adaptación que ya se hizo con `contacto.webp` (se descarta el tono "we/team" y el collage de fotos ajenas al Hero) cuando se retome en V2.
- ~~Forma concreta de "Más allá del PM" como pieza narrativa~~ — **resuelto (2026-07-20, ver 8.3):** banda de manifiesto full-width, fondo `brand-purple-soft`, sin cifras, copy validado con foco en Founder (varios proyectos, un exit) y Growth como origen. Pendiente: prompt a Claude Design para explorar tratamientos visuales (tipografía/espaciado) del concepto ya cerrado.
- ~~Afilar o quitar la cita del Toolkit ("Las herramientas son medios, no fines") — señalada en el análisis de mejora V1 como el eslabón más débil del copy actual~~ — **resuelto (2026-07-19, ver 8.4):** se afiló añadiendo un lead-in personal en vez de quitarla.
- ~~Foto profesional (pendiente sesión)~~ — **resuelto 2026-07-23 (ver §23):** imagen generada con IA a partir de una foto suya, recorte 4:5; assets en `public/img/` y `public/og/`.
- Diseño final del CV en PDF con identidad visual propia.
- Dominio propio (V2).
- ~~Sistema de diseño de la página (layout/composición)~~ — **resuelto por bloques** (ver sección 7): Hero, Hitos, Cómo trabajo, Más allá del PM, Toolkit, Trayectoria, Formación, Contacto y Footer ya tienen composición decidida (aunque Hero, Hitos, Trayectoria y Más allá del PM quedan pendientes de **rediseño** en Claude Design tras el análisis de mejora V1 de 2026-07-19 — ver sección 15 y tareas de Notion). El contenido de Hitos y Trayectoria ya está validado (ver arriba); solo falta el desarrollo en código y el rediseño visual.
- ~~"Sobre mí" — sección mencionada como resuelta... pero nunca definida ni construida~~ — **resuelto (2026-07-19, ver sección 7 y 15):** no es sección del flujo, es página propia con URL, enlazada desde el nav. Contenido exacto pendiente (ver arriba).
- ~~No hay métrica de éxito definida para la propia web~~ — **resuelto** (ver sección 9): métrica primaria = clics en contacto (email/teléfono); secundaria = % de scroll, medido con Microsoft Clarity desde V1.
- ~~Aviso de cookies/consentimiento pendiente de resolver~~ — **resuelto** (ver sección 9): banner simple de consentimiento antes de cargar Clarity. Queda pendiente su implementación técnica, no la decisión.
- ~~No hay ICP de la empresa objetivo~~ — **resuelto** (ver sección 4): SaaS con PMF ya validado, con equipo/función de producto real, IA integrada en el día a día, remoto o híbrido fuerte, en España.
- ~~Señales de seniority explícitas~~ — **resuelto** (ver 8.1 y 11): añadida una línea "Seniority" por caso en Selected Work (autoridad de socio en TheTool, reporting a CEO en Emendu, liderazgo por influencia en INDYA). Nota: no se incluyeron cifras de presupuesto/P&L — el usuario no las aportó; se puede añadir más adelante si aporta valor, no es bloqueante.
- ~~Solapamiento de fechas Pickaso/TheTool en la Trayectoria~~ — **resuelto** (ver 8.3 y 8.5): ambos son proyectos de Shutapp Projects, PICKASO financió y dio contexto de mercado para TheTool. Tratamiento visual también resuelto (2026-07-17): se agrupan bajo "Shutapp Projects" en el timeline.

---

> **Actualizado 2026-07-23 (ver §22):** reenfoque a lanzar V1 ASAP. Sobre mí y Accesibilidad **vuelven a V2** (revierte §18); GA4/GTM y el dominio propio entran en el lanzamiento como V1; Clarity pasa a V2 (cualitativo); se añaden Sprint 5 y 6.

## 13. Roadmap

**V1**
- Portfolio con seniority, en español, en Vercel, editorial, preparado para i18n.
- Brand Kit y Sistema de diseño como páginas propias enlazadas desde el footer (ver sección 7 y 16); Contacto ampliado con ubicación propia (resuelto 2026-07-17, ver sección 7).
- Arquitectura reestructurada 2026-07-19 (ver sección 15): Hitos sustituye a Selected Work, Trayectoria promovida, Más allá del PM reformulado, nav sticky con CV/tema, reequilibrio de color (morado decorativo) y motion con propósito.
- Segunda ronda de ajustes 2026-07-20 (ver sección 16): Hitos sin icono, paso "Lanzamiento" en Cómo trabajo, Toolkit recategorizado con logos reales monocromo, Trayectoria/Formación con logos reales monocromo.
- Medición con Microsoft Clarity (adelantado desde V2, ver sección 9) — sin esto no se puede evaluar si V1 funcionó.
- Banner de consentimiento de cookies (resuelto 2026-07-17, ver sección 9/12), previo a la carga de Clarity.

- **Páginas propias:** Brand Kit, Sistema de diseño, ~~y en V2~~ **Sobre mí y Accesibilidad** — estas dos devueltas a V1 el 2026-07-21 (ver sección 18).

**V2**
- Inglés · dominio propio · CV en PDF con identidad visual propia · medición ampliada (Google Tag Manager, Google Analytics, Search Console) · página de Contacto ampliada.
- ~~**Página "Sobre mí" completa** — pospuesta entera desde V1 el 2026-07-20 (ver sección 16).~~ **Revertido 2026-07-21: vuelve a V1** (ver sección 18).
- ~~**Página de Accesibilidad** — retirada de V1 el 2026-07-20 (ver sección 16).~~ **Revertido 2026-07-21: vuelve a V1** (ver sección 18).

**V3**
- IA conversacional.

---

## 14. Feedback crítico (2026-07-16)

Tras leer Brief y CV en detalle, se identificaron tensiones y vacíos que no estaban nombrados en el documento original. Decisiones tomadas con el usuario:

- **Tensión Hero vs. filtro de RRHH:** el brief pedía dos cosas contradictorias — que el Above The Fold supere el escaneo de 5-10s de RRHH, y que el exit/founder no aparezca en el Hero sino en el scroll. **Decisión: se mantiene el reveal gradual** (sin señal de exit en el Hero); se acepta el riesgo porque Selected Work va inmediatamente después del Hero y actúa de red de seguridad para el lector rápido (ver sección 4 y 7).
- **Caso KUOTIP:** era la prueba más directa del pilar "IA aplicada" del brief y no estaba en Selected Work. **Decisión: se queda fuera** de los 3 casos SaaS consolidados; se refuerza su componente de IA donde ya aparece, en "Más allá del PM" (ver 8.3).
- **Riesgo de sobrevalorar certificaciones IA:** se materializaba en la propia estructura del brief (IA listada en "Formación" junto a un máster). **Aplicado:** movido a Toolkit (ver 8.4).

- **Solapamiento Pickaso/TheTool:** no era inconsistencia de fechas — ambos son proyectos de Shutapp Projects. PICKASO fue a la vez la escuela de mercado (apps, herramientas, sector) y el motor financiero que sustentó el arranque de TheTool. **Resuelto** con contexto real del usuario; incorporado a 8.3 y 8.5.
- **ICP de empresa objetivo:** no estaba definido a quién le habla la web más allá del lector individual (HR/CPO). **Resuelto**: SaaS con PMF ya validado, con equipo/función de producto real (PM, Product Designer, o founder con peso en producto), IA integrada en el día a día del negocio (no uso superficial), remoto o híbrido fuerte, en España. Incorporado a sección 4.
- **Métricas de éxito de la web:** no había forma de evaluar si V1 funcionaba antes de invertir en V2. **Resuelto**: métrica primaria = clics en contacto (email/teléfono); secundarias = % de scroll de página + clics en "Descargar CV", medido con Microsoft Clarity desde V1 (adelantado desde V2). Como consecuencia, se resolvió también que el teléfono se publica en Contacto (era decisión pendiente aparte) y surgió un pendiente nuevo: aviso de cookies para Clarity en audiencia española. Incorporado a secciones 7, 9, 10 y 13.
- **Señales de seniority:** no había evidencia sistematizada de autoridad real, solo narración de proceso — la mitigación directa al riesgo "el sitio no transmite la autoridad real del rol" (sección 11). **Resuelto** con contexto real del usuario: TheTool (socio 1 de 4, voz y voto, liderazgo de facto del equipo no-código), Emendu (reporta al CEO, equipo de liderazgo junto a Ops/Finanzas/Tech), INDYA (reporta a CPO/cofundador, liderazgo por influencia sin autoridad formal). Añadido como línea "Seniority" en cada caso de 8.1. No se aportaron cifras de presupuesto/P&L — queda abierto si se quiere añadir más adelante, no bloqueante.

Con esto, todos los vacíos detectados en el análisis crítico inicial quedan resueltos, incluido el aviso de cookies/consentimiento para Clarity (banner simple, resuelto 2026-07-17, ver sección 12).

---

## 15. Análisis de mejora V1 — Diseño, Marca y Arquitectura (2026-07-19)

Tras ver la V1 diseñada en Claude Design ya montada (no solo sobre el papel), Francisco hizo un análisis exhaustivo ([documento completo en Notion](https://app.notion.com/p/3a12caec08be8133b636eefaccd9bbb2)) y lo debatimos punto por punto antes de tocar nada. Diagnóstico de partida: la ejecución de marca y sistema estaba muy bien, pero cuatro ajustes elevaban la web de "portfolio de PM excelente" a "portfolio que comunica el diferencial" — marca poco visible (morado ausente), web plana (sin motion), estructura repetitiva (Selected Work/Más allá del PM/Trayectoria solapaban, Trayectoria mal jerarquizada) y mitad inferior aplanada.

**Aceptado sin reservas, sin debate adicional:**
- Reintroducir `brand-purple` como acento decorativo no accionable (sección 6).
- Motion con propósito, una vez al entrar en viewport, respetando `prefers-reduced-motion` (sección 6).
- Subir Trayectoria por encima de Toolkit (sección 7).

**Debatido y resuelto con ajustes sobre la propuesta original:**
- **Hitos vs. profundidad para el CPO:** la preocupación era que "Hitos" (formato quick-scan, una línea por caso) perdiera la profundidad de proceso que antes convencía al lector de Producto. Resuelto repartiendo el contenido: Hitos = resultado/impacto puro; Trayectoria = qué se hizo + autoridad real (seniority), en 1-2 frases por experiencia. El deep-dive completo (por qué salió de un proyecto, cómo trabajaba los sprints) queda para V2/V3, con un enlace/CTA previsto desde ahora.
- **CV fuera del Hero:** la preocupación era perder el comportamiento de "CPO que se descarga el CV antes de escribir" (métrica secundaria de éxito, sección 9) si el CTA desaparecía del Hero. Resuelto con un **nav sticky** (Descargar CV, Sobre mí, toggle de tema) presente en todo el scroll — sin coste real, porque el CV sigue siempre disponible — más un CTA secundario en Trayectoria para cubrir el hueco del menú oculto en mobile.
- **Toggle Claro/Oscuro a solo icono:** aceptado, con requisitos explícitos de accesibilidad (`aria-label` dinámico, área táctil 44×44px, contraste 3:1, foco visible) para que quitarle protagonismo visual no comprometa AA.
- **"Sobre mí":** se resuelve el gap abierto desde el 2026-07-18 (ver sección 12 histórica) — no es sección del flujo ni modal, es **página propia con URL** y tono personal, enlazada desde el nav.

**Dejado explícitamente pendiente de la fase de diseño (no resuelto en esta sesión):**
- Forma concreta de "Más allá del PM" como pieza narrativa/separador visual (sección 8.3).
- Contenido exacto de la página "Sobre mí" (sección 12).
- Redacción final de Hitos y del Resumen de Trayectoria — ambos en borrador, basados en hechos ya aprobados del PRD, no en contenido nuevo (secciones 8.1 y 8.5).

**Fuera de alcance de esta iteración:** la IA conversacional de V3 ("Pregúntale a mi carrera") se trata por separado, tal como marca el roadmap (sección 13).

**Gap de proceso detectado y corregido (2026-07-19, al preparar el prompt de Hero+Hitos):** esta reescritura del PRD capturó el reequilibrio de color y el motion, pero dejó fuera la decisión de "presencia del logo" de la sección 2.2 del análisis (tamaño, momento de respiro, opción de avatar al hacer scroll). Corregido en sección 6: el logo usa comportamiento tipo avatar (grande en el Hero, compacto en el nav sticky al hacer scroll). Motivo de fondo: al condensar el análisis en decisiones del PRD es fácil perder matices si se parafrasea en vez de partir del texto original — para las tareas de diseño que quedan (Más allá del PM, Trayectoria, Sobre mí) se prioriza pasar a Claude Design el texto original de las secciones relevantes del análisis, no solo el resumen.

**Proceso:** con el PRD y las tareas de Notion actualizados, el siguiente paso es ajustar el diseño en Claude Design (Hitos, nueva jerarquía, morado, motion, página Sobre mí) antes de arrancar el desarrollo (tarea "Setup + Hero + Hitos" del backlog).

---

## 16. Ajustes de contenido y prioridad (2026-07-20)

Con "Más allá del PM" y Trayectoria ya cerrados en Claude Design, Francisco revisó el conjunto de lo construido y lo que queda por delante, y planteó una segunda ronda de ajustes — debatidos punto por punto antes de tocar el PRD.

**Aceptado sin debate adicional:**
- **Hitos sin icono:** el icono monocromo original no tenía relación directa con cada hito y metía ruido en una sección pensada para quick-scan puro — se retira (8.1).
- **Nuevo paso "Lanzamiento" en Cómo trabajo**, entre Desarrollo y Analítica — cubre A/B testing, despliegues progresivos y feature flags; conecta con el ICP de la sección 4 (SaaS con producto real valora rigor de release management). Nombre y copy exactos del paso pendientes de redacción (8.2).
- **Formación con logos reales monocromo** — cobertura completa (TheHeroCamp, theUncoding, Olea Europea, ESIC), sin huecos de datos (8.6).

**Debatido y resuelto con matices:**
- **Toolkit — recategorización:** nuevas categorías (Usuarios / Gestión y Documentación / Diseño y prototipado / Desarrollo) más específicas que las anteriores. Se preguntó explícitamente si la categoría "IA" debía mantenerse propia (es una de las tres cartas de posicionamiento del brief, sección 1) — **decisión: no en V1**, Claude Code/Claude Design quedan repartidos en Desarrollo/Diseño sin categoría propia; **"IA" vuelve a existir como categoría dedicada en V3**, cuando se aborde la IA conversacional. Igualmente se cae la categoría "Pagos" (Stripe).
- **Toolkit y Trayectoria — logos reales monocromo:** se confirmó explícitamente que "que todos los logos tengan el mismo color" significa monocromo unificado (un color plano por tema, versión clara y versión oscura), no el color de marca original — esto **no** rompe la regla de `BRAND.md` de "no logos de empresa a color", solo cambia icono genérico por silueta real. Corrección de dato importante: los archivos de origen son `.webp` (raster), no SVG como se asumía — el proyecto ya tiene `sharp` instalado para procesarlos, pero varios no tienen canal alfa y necesitarán QA visual uno por uno.
- **Toolkit — falta el logo de Amplitude** en la carpeta de origen (`Logos Web/Tools`) — pendiente de añadir.
- **Toolkit — nueva frase de cabecera:** Francisco creía recordar una frase ya definida para reemplazar «Las herramientas son medios, no fines...» — revisado el PRD y Notion, no existe tal frase en ningún sitio. Se redactará cuando se aborde el ajuste de Toolkit en Claude Design.
- **Trayectoria — datos de la carpeta de logos (`Logos Web/Empresas`):** al comparar contra las 8 filas del PRD (8.5) faltaban 3 logos (Ontecnia, Searchmedia, Miss Conversion) y sobraba uno sin explicar (`increnta.webp`). Resuelto: Ontecnia se añadió a la carpeta; `increnta.webp` es Searchmedia renombrada (cambio de nombre real de la empresa, no un error) — el PRD pasa a decir "Increnta" en la fila de Marketing & Growth (8.3 y 8.5); Miss Conversion y el logo separado de Malavida no se añaden a la web.
- **Trayectoria — fila multi-empresa ("Havas Media, Increnta, Miss Conversion"):** con logo real para 2 de las 3 empresas pero no las 3, se evaluaron tres opciones (mostrar los 2 logos disponibles y dejar la tercera en texto / mantener el icono genérico solo en esta fila / partir la fila en varias). **Se elige mantener el icono genérico** solo en esta fila multi-empresa — el resto de filas de Trayectoria usa logo real (8.5).
- **Repriorización — "Sobre mí" a V2 entero:** no solo el contenido (ya pospuesto desde 2026-07-19) sino la página completa — diseño y desarrollo también se mueven a V2. Efecto colateral detectado: el nav sticky ya validado incluía "Sobre mí" como uno de sus 3 elementos — se retira del nav en V1 (queda con CV + toggle de tema) y vuelve cuando la página exista en V2 (secciones 5 y 7).
- **Repriorización — Accesibilidad fuera del footer en V1:** revierte la decisión resuelta el 2026-07-17 (Accesibilidad vivía en el footer en V1) — se pospone a V2 con el contenido completo (declaración WCAG, contacto para reportar problemas) en vez de publicarla antes vacía. El footer de V1 pasa de 3 a 2 enlaces centrales (Brand Kit, Sistema de diseño) — ajuste pendiente sobre el diseño del footer ya cerrado (sección 7).
- **Páginas Brand Kit y Sistema de diseño:** confirmado adaptar los dos archivos ya documentados (`BRAND.md` y el export de "Sistema de diseño" de Claude Design) en páginas propias enlazadas desde el footer. Sistema de diseño ya tenía tarea en Notion (Sprint 2); **Brand Kit como página construida no tenía tarea propia** — solo existía como archivo, nunca se planificó como página web — se crea ahora.

**Cerrado a lo largo de la sesión (2026-07-20):** las 4 tareas de diseño reabiertas por esta ronda de ajustes se cerraron una a una: Rediseño Hero + Hitos (icono fuera, nav sin "Sobre mí", hamburguesa mobile se mantiene para futuros CV/Sobre mí/idioma), Cómo trabajo + Toolkit (paso Lanzamiento con copy validado, recategorización + logos reales + nueva frase, logo de Amplitude corregido tras detectarse ruido de compresión), Rediseño de Trayectoria (7 logos reales, fila Havas/Increnta/Miss Conversion sin icono) y Trayectoria+Formación+Contacto (4 logos de Formación). Solo queda pendiente **Footer** (quitar el enlace de Accesibilidad, de 3 a 2 enlaces centrales) para completar esta ronda.

**Pendiente, sin resolver en esta sesión:**
- Responsive — Francisco reportó varios fallos vistos navegando la V1 construida; pendiente de capturas concretas antes de abordarlo como tarea.
- ~~Ajuste de Footer (quitar enlace de Accesibilidad).~~ **Cerrado 2026-07-21**, junto con dos correcciones más que salieron al calibrar el logo (centrado óptico de los enlaces y tamaño del logo) — ver sección 7 y 17.

**Efecto sobre el desbloqueo del desarrollo:** ~~solo el ajuste de Footer sigue pendiente~~ — **actualizado 2026-07-21: ninguna sección de la home tiene ya diseño pendiente.** Footer y el nav sticky (rediseñado por el sistema de uso del logo, sección 17) se cerraron el mismo día, así que "Desarrollo Claude Code — Setup + Nav sticky + Hero + Hitos" queda totalmente desbloqueada, y con ella los otros dos bloques de build.

Siguen abiertas dos tareas de diseño de V1 que **no bloquean el build de la home**: la **sesión de fotografía profesional** (el Hero se puede construir con placeholder y sustituir la foto después) y la **página Brand Kit**, que es una página aparte enlazada desde el footer, no una sección de la home.

---

## 17. Sistema de uso del logo (2026-07-21)

Al ir a abordar el ajuste del footer — la última tarea de diseño pendiente — Francisco paró y planteó una duda previa: si el logo se estaba usando de forma coherente con lo que van a documentar las páginas Brand Kit y Sistema de diseño. La duda era correcta y destapó un problema de raíz.

**Diagnóstico.** Se midieron los tres usos ya construidos y ninguno era coherente con los otros: nav sin scroll `flat` a 12×15px metido en un contenedor circular, nav con scroll `split` a 24×29px, footer `flat` a 12×15px. Tres variantes, tres tamaños, tres tratamientos. La causa no era de ejecución: **`BRAND.md` había dejado explícitamente abierto** dónde usar cada variante y a qué tamaño cortar el split ("se decidirá al diseñar la web, no ahora"), y ese pendiente nunca se cerró. Los tres usos eran decisiones sueltas de tres sesiones distintas.

Esto importaba justo ahora porque Brand Kit y Sistema de diseño son las páginas que **documentan** esa regla, y son parte del argumento de "criterio de diseño" del sitio (sección 1). Habrían congelado tres usos incoherentes como si fueran el sistema.

**Hallazgos medidos:**
- El `viewBox` del componente era `"0 0 120 120"` pero el símbolo solo ocupaba el 58% de la altura → todo consumidor lo infradimensionaba un ~42% sin saberlo. Es el origen mecánico de que los tres usos salieran pequeños.
- En el footer el logo medía 12×15px junto a un icono de LinkedIn de 18×18px: la marca propia pesaba menos que el icono de una red social ajena, y lo mismo que el símbolo `©` contiguo.
- El color era correcto (`rgb(33,38,43)` = `--foreground`) en todos los usos. Lo que fallaba era el grosor: a 15px el trazo cae a 1,3px y el antialiasing lo lava a gris.
- El `split` se usaba a 24px, donde no se lee. En modo oscuro va incluso peor a tamaño pequeño, porque las capas de color quedan más cerca en luminancia del fondo que del trazo blanco.
- El grupo de enlaces del footer caía 90px a la derecha del centro real de la fila (ver sección 7).
- Faltaba una regla de **proporción del lockup**: nadie había fijado cuánto debe medir el wordmark respecto al símbolo, así que al crecer el símbolo el texto se quedó atrás.

**Resuelto:** tabla de uso completa y siete reglas, escritas en `BRAND.md`. El nav corrige la inversión de sus dos estados (`split` 48px al cargar, `flat` 28px con scroll) — ver el detalle y el razonamiento en la sección 6. `viewBox` del componente recortado a `"31 17 58 70"` con `overflow-visible`.

**Método, y un error que corregir.** Tres rondas de tableros de calibración en Claude Design (escalera de tamaños → maquetas de las aplicaciones → comparativa de tamaños del nav), para decidir los umbrales viendo el efecto en vez de por argumento. Merece la pena repetirlo cuando una decisión dependa de un límite perceptivo y no de una preferencia.

Pero la primera escalera falló en un punto: situó el umbral del split en 64px, y al aplicarlo resultó ser 48px. La causa es de método — **una escalera de calibración es un juicio comparativo (todos los tamaños en el mismo golpe de vista) y el uso real es aislado**, así que la rejilla es sistemáticamente más severa que la realidad. Corolario para las próximas decisiones perceptivas: la rejilla sirve para acotar el rango, pero el número final se confirma en el contexto donde va a vivir.

**Descartado:** duplicar el `split` en el footer, y ensanchar el desplazamiento del split para que entrase en el nav compacto (ver sección 6).

**Reconstrucción del kit descargable (2026-07-21, al preparar la página Brand Kit):** el kit de logo (`francisco-lopez-logo-kit/`) se había dibujado a mano, aparte del componente, y los dos habían derivado — los 12 SVG arrastraban el mismo `viewBox` acolchado que el componente corrigió esa mañana, y el favicon de 16px era el de 32 reescalado sin compensar el trazo (8,2% de cobertura de tinta frente a 8,1%: idénticos). En vez de parchearlos, el kit pasa a **generarse** desde `scripts/logo-kit/`, a partir de una definición de geometría que replica `logo.tsx` — parchearlos los dejaba arreglados hoy y divergiendo otra vez mañana. Salida en `public/logo-kit/`: 12 SVG, 36 PNG y 7 favicons, que son los que la página Brand Kit ofrecerá en descarga.

**Regla 5 matizada el mismo día que se escribió:** al reconstruir el kit se vio que su lockup lleva el wordmark al 60% de la altura del símbolo, mientras la regla pedía 40-45% para todo. Enfrentados visualmente, el 44% dejaba el nombre en pie de foto: **la regla estaba sobregeneralizada, no el asset.** Se había escrito a partir de un solo caso, el del nav — que no es un lockup, sino dos elementos sueltos en una fila que además se descomponen al hacer scroll. Queda partida en dos: 40-45% para símbolo y texto compuestos en UI, ~60% para el lockup cerrado, que se usa a 200px o más y donde leer el nombre es el objetivo. Mismo patrón de error que el umbral del split: generalizar de una sola observación.

**Cerrado 2026-07-21:** nav y footer aplicados a la web y validados en vivo por Francisco. Con esto **ninguna sección de la home tiene ya diseño pendiente** y los tres bloques de desarrollo quedan desbloqueados (ver sección 16). Siguen abiertas la sesión de fotografía y la página Brand Kit, que no bloquean el build.

**Breadcrumb en páginas internas (resuelto 2026-07-21, al cerrar Brand Kit):** toda página fuera del home lleva breadcrumb visible sobre el H1 — Brand Kit, Sistema de diseño, y en su momento Sobre mí y Accesibilidad. Requisitos: `<nav aria-label="Ruta">` con lista ordenada, el nivel actual sin enlace y con `aria-current="page"`, separadores decorativos ocultos al lector, área táctil de 44×44px y foco visible. Se resuelve como componente reutilizable, no pieza por página. **Colocación:** pertenece a la cabecera, no al contenido — la primera versión quedó a 102px del nav y a 34px del kicker, leyéndose como parte del bloque del titular; corregido a 45px y 96px, invirtiendo la proporción.

**Tercera regla sobregeneralizada del día (2026-07-21):** el breadcrumb salió con "Inicio" en cian porque `BRAND.md` decía "botones, enlaces, foco y estados activos usan `primary`" sin distinguir enlace de contenido de navegación de chrome — y el nav de al lado ya usaba `foreground` para "Descargar CV". Matizado en `BRAND.md`. Junto con el umbral del split (64→48px) y la proporción del lockup (40-45% → dos casos), son tres reglas escritas en absoluto el mismo día que en realidad dependían del contexto. **Patrón a vigilar:** al enunciar una regla a partir de un solo caso observado, comprobar antes si el sistema ya tiene otro caso que la contradiga.

---

## 18. Reorganización de sprints y alcance de V1 (2026-07-21)

> **Superado en parte por §22 (2026-07-23):** los sprints se reorganizan a seis y Sobre mí/Accesibilidad vuelven a V2. Lo de abajo queda como registro histórico.

Con el diseño de la home cerrado, Francisco replanteó el reparto por sprints. Decisiones:

**Sprint 1 (hasta 24 jul) — cerrar diseño.** Responsive, Brand Kit, Sistema de diseño y la sesión de fotografía.
- **Responsive pasa de Código a Diseño y sube a Sprint 1.** Criterio de Francisco, y es correcto: el responsive es primero una decisión de diseño (qué colapsa, qué se reordena, qué desaparece por breakpoint) y solo después una implementación. Se aborda en Claude Design. La pasada de QA responsive del tercer bloque de desarrollo no lo duplica: pasa a ser *verificar que el código cumple lo definido aquí*.
- **Brand Kit y Sistema de diseño se montan como páginas ya**, no más adelante: hoy en la web solo existen los enlaces del footer, sin página detrás. La tarea de Sistema de diseño se reclasifica de Código/S a Diseño/M — no es solo limpiar el chrome de editor y enlazar, es integrar y adaptar el contenido a una página. Buen momento para Brand Kit: `BRAND.md` se amplió el mismo día con la tabla de uso del logo y las 7 reglas (sección 17), así que la página nace con el contenido completo.

**Sprint 2 (27-31 jul) — desarrollo.** Los tres bloques de build de la home, más **Sobre mí y Accesibilidad, que vuelven a V1**.

**Sprint 3 (3-7 ago) — lanzamiento.** Clarity, banner de cookies, tracking de clics, deploy de V1, y la analítica ampliada (dominio, GTM, GA4, Search Console).

**Sprint 4 (10-14 ago) — cola de V2/V3.** i18n, CV en PDF, Contacto ampliada e investigación de la IA conversacional.

**Sobre mí y Accesibilidad vuelven a V1 — revierte la decisión del 2026-07-20 (sección 16).** Se construyen en Sprint 2, por delante del deploy (Sprint 3), así que salen publicadas con V1: su `Versión` pasa de V2 a V1, porque etiquetar como V2 algo que se despliega en el lanzamiento sería falsear el roadmap.

*Contrapunto planteado y descartado por Francisco:* Sprint 2 lleva ya tres bloques de build de talla L —la semana entera— y añadir dos páginas nuevas lo desborda; además, el 2026-07-20 se sacaron de V1 justo para publicar antes. Se propuso llevarlas a Sprint 4, después del deploy, lo que además las habría dejado como V2 sin tocar etiquetas. **Francisco decide mantenerlas en Sprint 2 y meter más horas si hace falta.** Queda registrado el riesgo asumido: V1 sale más completa pero más tarde.

**Riesgo real, distinto del de capacidad:** ninguna de las dos páginas tiene contenido escrito — la tarea de contenido de Sobre mí llevaba en Blocked desde el 2026-07-19 por decisión del propio Francisco, y la de Accesibilidad estaba sin definir. Eso no se resuelve con horas de build: es texto que solo puede escribir él, y bloquea diseño y desarrollo. Ambas quedan marcadas como ruta crítica de Sprint 2.

**Dependencia de orden en Accesibilidad:** el nivel WCAG que declare esa página tiene que corresponderse con lo que la web cumpla de verdad, así que se redacta después (o a la vez que) la pasada de QA de accesibilidad. Declarar AA sin haberlo verificado sería lo contrario de lo que la página pretende demostrar.

**Gaps detectados al reorganizar** (tres tareas creadas): no existía tarea de **diseño** de la página de Accesibilidad (sí de contenido) — el mismo hueco que tuvo Brand Kit; ningún bloque de desarrollo cubría las **cuatro páginas propias con URL**, solo las secciones de la home; y el **reajuste de nav y footer** para recuperar los enlaces de Sobre mí y Accesibilidad no estaba en ninguna parte. Ese último toca dos zonas cerradas el mismo día: el nav pasa de 2 a 3 elementos (verificar en sus dos estados y en móvil) y el footer vuelve de 2 a 3 enlaces (reverificar el centrado óptico, sección 7).

---

## 19. Página Brand Kit y consolidación del diseño (2026-07-21/22)

Primera de las cuatro páginas propias que se construye. Parte del Brand Kit que ya existía en Claude Design (6 secciones: Concepto, Logotipo, Color, Tipografía, Aplicaciones, Uso correcto e incorrecto), que se mantiene como esqueleto porque la estructura era buena, y se corrige todo lo demás.

**Lo que estaba mal en la base.** Cuatro colores desviados de los tokens — hueso, oscuro y los dos pasteles; el logo reconstruido con `div`s y `mix-blend-mode`, de modo que el split de la página de marca no se veía como el split de la marca; y ninguna de las reglas de la sección 17, por ser la página anterior a ellas. Se corrigió en dos rondas, más una tercera de nombres de token: la página documentaba `--bk-pastel-cyan`, que no existe.

**Sección 06, reescrita con los errores reales del sistema.** En vez de una rejilla de ✓/✗ genéricos, los siete fallos que tuvo esta marca, con su antes/después, la cifra que los detectó y su corrección: el `viewBox` que mentía, el split a 24px, el favicon sin compensar, el logo pesando menos que un icono de LinkedIn, el lockup al 29%, el círculo dentro del círculo y los cuatro colores de la propia página. Convierte la página en prueba de criterio, que es lo que la sección 1 pide que demuestre la web.

**Hero — la marca en uso, no la marca repetida.** El primer hero repetía el lockup a 200px del que ya lleva el nav: el mismo error que la sección 6 había resuelto para el Hero de la home, reproducido en otra página. Se sustituye por una composición que enseña la marca aplicada — una ventana de navegador dibujada a trazo, con el favicon en la pestaña y el nav dentro a sus proporciones reales, flanqueada por dos superficies de color.

La idea que la ordena es de Francisco: **que la composición reproduzca la anatomía del logo.** Centro relleno de `foreground` entre dos flancos en `brand-cyan-soft` y `brand-purple-soft`. Como el centro conmuta con el tema y los flancos son fijos, el juego se produce solo en claro y en oscuro — es el mismo mecanismo de las dos capas que gobierna el logo, aplicado a escala de composición. Se usan los pasteles y no los colores del split: un panel es un fondo, y pintar dos superficies grandes con la firma sería aplicarla a la UI general.

**Consolidación — una sola fuente para el diseño del sitio.** El trabajo estaba repartido en varias páginas de Claude Design, con la del Brand Kit fuera del documento del sitio. Se consolida todo en "Web personal", con el nav, el footer y el breadcrumb como **componentes compartidos, no copias**. El motivo no es de orden: es el mismo problema que causó tres bugs en dos días (el kit dibujado aparte del componente, los cuatro colores desviados, los nombres de token inventados) — una fuente duplicada acaba divergiendo. Y tiene efecto inmediato: en Sprint 2, cuando exista Accesibilidad, el footer pasa de 2 a 3 enlaces; con componentes compartidos ese cambio se hace una vez.

**Criterio de proceso que queda fijado:** una sola fuente para el diseño del sitio, igual que `scripts/logo-kit/geometry.js` es la única para la geometría del logo. Las páginas de calibración se conservan como registro de decisiones, pero fuera del sitio. Y los prompts de integración se lanzan **desde el destino, no desde el origen**: desde la página de origen, los componentes que el agente tiene delante son precisamente las copias que hay que eliminar.

**Verificación.** Las tres primeras rondas se midieron sobre capturas: proporciones del mockup, ratios de contraste —incluidos los de `--brand-purple-accent`, 3,96:1 y 3,48:1, exactos al segundo decimal—, colapso de la tabla en móvil y centrado óptico. La ronda final de consolidación la da por buena Francisco tras revisarla en los tres entornos; no está medida.

---

## 20. Página Design System y sistema en AAA (2026-07-22)

Segunda de las cuatro páginas propias. Parte del documento "Sistema de diseño global" que ya existía en Claude Design — nueve secciones cuyo contenido de fondo (rejilla, breakpoints, escala de espaciado y tipográfica) era sólido y se conserva.

**Siete desfases corregidos.** La página llevaba tres días sin tocarse y había quedado por detrás de sus propias decisiones: decía "Selected Work" —renombrado a Hitos el 19 de julio— tanto en el esqueleto navegable como en la muestra de H1; el esqueleto listaba "Sobre mí" como sección de la home, juntaba Trayectoria y Formación en una, y ponía Toolkit antes que Trayectoria; le faltaba `--brand-purple-accent` y seis de los siete tokens de marca en el bloque `.dark`; y su regla de color afirmaba que los tonos de marca "nunca texto ni UI", falso desde que existe `brand-purple-accent`. Más el chrome de editor (`density`, `readingMeasure`) que arrastraba desde el 17 de julio.

**Un dato que se contradecía con Brand Kit:** esta página daba el contraste del texto principal como 12,8:1 y Brand Kit como 13,8:1. El valor real es 13,79:1, así que la equivocada era la que documenta la accesibilidad medida.

**La sección de Accesibilidad pasa de descriptiva a checklist verificable.** Es el cambio de fondo: deja de describir y pasa a ser **la lista con la que se cierra cada página del sitio** — contraste medido con cifra, foco visible, 44×44px, jerarquía de encabezados, breadcrumb en páginas internas, nada codificado solo por color, `prefers-reduced-motion` y alternativas textuales. Resuelve el "no debemos olvidarnos nunca de esto" de una forma que no depende de acordarse.

**Frontera con la futura página de Accesibilidad**, dibujada para no repetir el solape de Brand Kit: aquí el criterio interno y las mediciones, para quien construye o audita; allí la declaración pública —nivel que cumple el sitio y cómo reportar un problema—, para un visitante. La página de Accesibilidad no puede escribirse antes que la checklist: declara un nivel de conformidad que solo se sabe después de auditar.

**Renombrada a "Design System"** (2026-07-22) para equipararla a Brand Kit: nombre de página en inglés, kicker en español con la categoría. Cambiado en los tres sitios —H1, breadcrumb y enlace del footer— porque tener un nombre en la navegación y otro en la página significa clicar una cosa y aterrizar en otra. Al ser el footer un componente compartido, el cambio se propagó solo a todas las páginas: la prueba de que la consolidación de la sección 19 funciona.

**Dos datos de la cabecera que no eran ciertos:**
- *"42rem · Medida de lectura (~68 car.)"* — medido sobre la tipografía real, Inter da **7,38px por carácter**, así que 42rem son **~91 caracteres**, no 68. La prueba estaba en la propia página: una línea de 85 caracteres cabe en un renglón ocupando 627 de los 672px. El error viene de confundir caracteres con la unidad CSS `ch`. Corregido, y añadido el contexto de que 91 está por encima del rango clásico de 45-75 — es una decisión consciente y la página gana diciéndolo.
- *"4→5 · Breakpoints"* — un dato que parecía un rango junto a una lista de cinco nombres. Separado en lo que son: **4 breakpoints** (640, 768, 1024, 1280) que producen **5 tramos** (base, sm, md, lg, xl).

**El sistema entero pasa a AAA.** Al preparar la checklist se midió el estado real y aparecieron tres pares que no llegaban:

| | Antes | Ahora |
|---|---|---|
| `primary` claro, como texto | 4,53:1 — AA por 0,03 | **7,01:1 AAA** |
| `primary` claro, sobre botón | 4,81:1 | **7,44:1 AAA** |
| `muted-foreground` oscuro | 6,95:1 | **7,08:1 AAA** |
| `muted-foreground` claro | 5,87:1 | **7,12:1 AAA** |

Los dos primeros salen del mismo cambio: `--primary` de `#0B7C7C` a `#005E5F`. Pasaba AA por tres centésimas —cualquier retoque futuro del cian o del fondo lo tumbaba sin que nadie se enterase— y llegar a AAA costaba un oscurecimiento visualmente indistinguible. `--brand-cyan` y `--ring` se movieron con él para no dejar dos cianes casi iguales con nombres distintos. **El `brand-cyan-split` del logo no se tocó:** es otro token, no tiene requisito de contraste, y la firma no se negocia.

El de `muted-foreground` en claro fue el único que **no era gratis** —el gris se nota algo más oscuro y ese token existe para leerse como secundario— y se aplicó igualmente porque la distancia con el texto principal (13,79:1) sigue siendo enorme. Resultado: **ningún par del sistema se queda en AA**.

> **Corregido el 2026-08-04 (P37.598): las dos primeras filas de esa tabla eran falsas.** El
> cian de julio se pintaba como `#005E5F` —el hex documentado **era correcto**— pero eso da
> **6,86:1 como texto**: AA, no AAA. El 7,01 nunca fue alcanzable con ese color; se calculó
> mal y viajó de aquí a `BRAND.md`, al Design System, al Brand Kit y a la página de
> Accesibilidad. La segunda fila (7,44 sobre botón) también estaba mal: lo pintado eran
> **7,28**, que es justo lo que decía `DECISIONS.md` D30. Corregido bajando el token a
> `oklch(0.41 0.0886 194.82)`, que se pinta `#005859` y da **7,43:1 y 7,88:1** *(re-medido en
> P37.5985: **7,47 y 7,93** — centésimas, ningún veredicto cambia)*. El método
> para medirlo sin equivocarse —los cianes de esta marca caen fuera del gamut sRGB y hay que
> recortar antes de calcular— está en `BRAND.md` §Accesibilidad.

**Pendiente de traslado al repo:** los cinco tokens de layout que define esta página (`--container`, `--page-x`, `--gutter`, `--measure`, `--section-y`) no existen en `globals.css`. Anotado como requisito explícito en la tarea de Setup del build (ver sección 18).

---

## 21. Pasada de responsive y ronda de contenido (2026-07-22)

### Responsive: una sola regla que no se aplicaba en seis sitios

Los fallos reportados no eran seis problemas distintos sino **el mismo, repetido**: rejillas de dos columnas de escritorio que no se apilaban en móvil. Hitos conservaba las columnas de tabla con sus cabeceras; Cómo trabajo y Formación mantenían el `aside` en `sticky`, de modo que el título quedaba clavado y se superponía encima del contenido —ilegibles los dos textos—; Trayectoria dejaba la columna de fecha ocupando media pantalla y partía los resúmenes en quince renglones de dos palabras; Toolkit mantenía dos tarjetas por fila a 375px; y Contacto partía el correo a mitad de palabra en cuatro trozos.

**La regla ya estaba escrita y bien**, en la página Design System cerrada esa misma mañana: *"el contenido vive en una rejilla `aside + contenido` que se apila en móvil"*, *"`sticky` en escritorio"*, y el tramo `base` de la tabla de breakpoints diciendo *"una columna, todo apilado"*. No hubo que decidir nada nuevo: hubo que aplicar lo que el sistema ya decía.

**Contacto era el más grave** aunque no lo pareciera: el clic en el correo es la métrica primaria de éxito de la web (sección 9), y era el elemento peor presentado en móvil. Se detectó porque, siendo la causa sistémica, se predijo que Contacto usaba el mismo patrón fila+divisor que Trayectoria (decisión del 2026-07-18) y debía estar afectado. Lo estaba.

El Hero se revisó y estaba correcto. Nav y footer se habían rehecho el día anterior.

### Ronda de contenido

Ocho ajustes, con tres cosas que aparecieron al revisarlos:

- **Los datos de contacto de la web estaban mal** y el PRD los tenía bien: el sitio se había desviado de la fuente. Corregidos el email y el LinkedIn, tanto en el texto visible como en los `href`.
- **El párrafo de Cómo trabajo estaba desactualizado**, no solo mejorable: decía "Cinco etapas" cuando son seis desde el 2026-07-20 (ver 8.2).
- **El cargo de TheTool aparecía con tres redacciones distintas** — "Cofundador & Product Manager" en la web, "Cofundador & Product Manager" en 8.1 y "Cofounder & Product Manager" en la tabla de 8.5. Unificado a **"Cofounder & Product"**, que además alinea con el formato que ya usaba KUOTIP.

**Los enlaces de Contacto no tenían estado interactivo** más allá del cursor. No era un detalle estético: el punto 2 de la checklist de accesibilidad que publica el propio sitio exige foco visible en todo elemento interactivo, así que la home incumplía su propia norma.

Y al medir el hover ya implementado apareció algo que solo se ve midiendo los estados interactivos, no los de reposo: **el hover bajaba el contraste de 7,10:1 a 6,42:1**, sacando el enlace del AAA que se había conseguido esa misma mañana. La causa era que oscurecía el fondo sin oscurecer el texto. Corregido haciendo que el valor pase a `foreground` al interactuar: sube a **11,36:1**, y de paso el hover se nota más — en esta paleta todos los neutros están a 1,1-1,2:1 entre sí, así que la señal visible solo puede darla el texto, no el fondo.

### Dos decisiones de diseño

**Hitos — la deduplicación se probó y se revirtió.** Se quitó el nombre de empresa de la segunda aparición de INDYA y TheTool, pero las filas resultantes quedaban con la columna NOMBRE vacía y nada indicaba que pertenecían a la empresa de arriba: se leía como dato que falta, no como continuación. La repetición era mejor que la ambigüedad.

**Hitos — el destacado del exit pasa de fondo a movimiento.** La banda en morado claro a lo ancho de la fila se retira: `BRAND.md` dice que el morado es apoyo "con cuentagotas" y una banda no lo es. La frase y el chip EXIT se quedan, pero **el chip entra con retardo** (250-300ms tras el reveal de su fila, una sola vez, sin bucle, y visible desde el inicio con `prefers-reduced-motion`). La jerarquía la marca el tiempo, no el color — aplicación directa de la regla de motion de la sección 6.

*Efecto colateral a vigilar:* es el segundo recorte al morado, y viene de una decisión que se tomó en su día precisamente porque el morado no aparecía lo suficiente (sección 15). Sigue existiendo en el chip de Split del Brand Kit, en el acento sobre "Exit" de Más allá del PM y en el flanco de la composición del Brand Kit, pero conviene no seguir restándole sitios sin darse cuenta.

### Un cambio de copy con una consecuencia

El párrafo de Contacto pasa a:

> Senior Product Manager con experiencia en SaaS, siempre busco impacto real para los usuarios y conseguir los objetivos de la empresa. Si encaja, escríbeme o llámame directamente.

El anterior —*"Busco un rol de Senior Product Manager en un SaaS con producto real y equipo detrás"*— era **el único sitio de la web donde aparecía el ICP** definido en la sección 4. El nuevo describe qué es en vez de qué busca, y pierde ese filtro. Cambio consciente, con el matiz registrado por si más adelante interesa recuperar el filtro sin volver al tono anterior.

---

## 22. Reenfoque a lanzar V1 ASAP y priorización MoSCoW (2026-07-23)

Con el diseño de la home y las páginas de sistema cerrado, Francisco reenfocó la ejecución: **desarrollar y publicar V1 lo antes posible con todo lo ya diseñado, compartirla, y a partir de ahí optimizar** (marca: CV en PDF, firma de email, header de LinkedIn) y **seguir** (nuevas páginas, más métricas). El diseño de secciones nuevas deja de bloquear el lanzamiento.

**Corte de lanzamiento.** El primer deploy de V1 lleva: home completa + Brand Kit + Design System + SEO/OG + medición. **Sobre mí y Accesibilidad salen del lanzamiento y vuelven a V2** — revierte lo decidido en §18 (2026-07-21), que las había traído a V1. Es el cuarto movimiento de estas dos páginas (fuera de V1 el 20-jul, dentro el 21-jul, y ahora otra vez fuera); la razón es que son las únicas piezas de V1 bloqueadas por contenido sin escribir, y sacarlas limpia el camino a producción. Con esto se descarta el esquema "V1.0/V1.1": lanzamiento = V1, todo lo diferido = V2.

**Priorización con MoSCoW, en un tablero aparte.** A petición de Francisco, la priorización vive en un **tablero enlazado** (linked view) de la base *Tareas — Web personal*, agrupado por una propiedad nueva `MoSCoW`, en la página "[Priorización MoSCoW — corte de lanzamiento](https://app.notion.com/p/3a62caec08be81989325c9fce678de5b)" dentro de *New Website*. Son las mismas tareas, no copias; mover una tarjeta no toca Sprint ni Prioridad del tablero de ejecución. Regla adoptada: **todo lo que queda en Could es V2.**

**Tareas nuevas** (gaps detectados al reenfocar): SEO técnico base (metadata, Open Graph, cards por página — dejar preparado sin planificar contenidos ni enlaces), plantilla + imágenes OG por página, política de cookies / aviso de privacidad (Legal), integrar el CV PDF actual (wiring del botón), firma de email con la marca, y header de LinkedIn con la marca. Las dos últimas son piezas externas a la web, en paralelo.

**Medición (revierte el criterio de Clarity de §9).** Como el dominio propio entra en el lanzamiento, **GA4 + GTM se adelantan a V1** como capa de medición: miden las métricas de éxito (clics mailto/tel/CV, scroll) como conversiones limpias, mejor que Clarity. **Clarity baja a Could/V2** y queda para lo cualitativo (heatmaps, grabaciones, mapas de atención) en la fase de optimización. El **consentimiento de cookies (banner + política) viaja con GA4, no con Clarity** — GA4 también usa cookies y requiere consentimiento en España. GA4 corre también sobre `.vercel.app`, así que **medir no depende del dominio**.

**Dominio.** Se mantiene en el lanzamiento (Must, V1) por imagen/marca, ya desacoplado de la medición.

**CV.** Se usa el **PDF actual** en el lanzamiento — integrado en el repo en `public/cv/francisco-lopez-cv-es.pdf` (sufijo `-es` para dejar sitio a `-en`). El rediseño con identidad propia sigue como tarea paralela (V2).

**i18n desde la primera línea.** La **arquitectura** i18n (routing con locale, ES + EN, cero strings hardcodeados) es **Must desde la primera línea de código** — escrito como requisito "NO OMITIR" en la tarea de Setup, aplica a todo el build. La **traducción** del contenido a inglés es aparte y es V2. Arquitectura ahora, traducción después.

**Regla de coherencia de tareas.** Por página, **contenido ≤ diseño ≤ desarrollo** en prioridad (mismo nivel MoSCoW; el desarrollo no puede ir por delante de su diseño o su contenido), y **nunca una tarea de desarrollo que agrupe varias páginas** (no se puede priorizar limpio). Se detectó porque el bundle "Páginas secundarias" mezclaba Must (Brand Kit + Design System) con Could (Sobre mí + Accesibilidad); se **partió** en dos tareas.

**Reorganización de sprints (supersede §18).** Seis sprints, monótonos con MoSCoW:

| Sprint | Foco | MoSCoW |
|---|---|---|
| 2 (27-31 jul) | Build home + Brand Kit/Design System + SEO/OG + CV wiring | Must |
| 3 (3-7 ago) | Lanzamiento: Deploy + Dominio + DNS, y medición (GTM → GA4 → consentimiento → tracking → Search Console) | Must → Should |
| 4 (10-14 ago) | Marca (firma email, LinkedIn, CV rebrand) + i18n research + contenido/diseño de Sobre mí y Accesibilidad | Should → Could |
| 5 (17-21 ago, nuevo) | Dev de Sobre mí + Accesibilidad → reajuste nav/footer + Clarity + Contacto ampliada | Could → Wont |
| 6 (24-28 ago, nuevo) | IA conversacional | Wont |

**Prioridad renumerada 10→39**, monótona: **Must 10-20 · Should 21-30 · Could 31-37 · Wont 38-39**. Tres incongruencias corregidas en el reparto: el tracking de clics quedaba antes que el GA4/GTM del que depende (ahora después); el dev de Sobre mí/Accesibilidad quedaba en el mismo sprint que su diseño (ahora en el siguiente); y las tareas nuevas estaban sin sprint ni prioridad.

---

## 23. Cierre de Sprint 1 y foto del Hero (2026-07-23)

**Sprint 1 cerrado.** Todo el diseño estaba ya resuelto (home, responsive, Brand Kit, Design System, sistema de uso del logo); la única tarea abierta era la foto. El siguiente es el **Sprint 2 (build de la home)**, que se abre al arrancar desarrollo (sus tareas pasan de "Sin empezar" a "To-Do" en ese momento).

**Foto del Hero — resuelta de otra forma.** En vez de la sesión de estudio que pedían §6 y `BRAND.md` (y la tarea original), Francisco produjo la imagen a partir de una foto suya trabajada con IA (ChatGPT/Gemini/Magnific). Se eligió la versión limpia ("estudio3", sin marca de agua), plano de estudio con fondo negro y camisa blanca. Recorte **4:5** para el Hero. Assets ya preparados en el repo: `public/img/francisco-hero-4x5.webp` (614×768) y `public/og/og-home-1200x630.jpg` (OG 1200×630).

**Notas de uso para el desarrollo (Sprint 2), validadas viendo el Hero montado en Claude Design en claro y oscuro:**
- **Tamaño:** mostrar la foto a **≤460 px de ancho en desktop** (nítida de verdad a ≤300 px en 2x). El origen es 1376×768 recortado a 614×768, así que por encima de ~500 px se ablanda en retina. En mobile, a ancho de columna (~340 px) va sobrada.
- **Ratio:** fijar **4:5 en los dos breakpoints** (desktop y mobile) y que el **punto focal —la cara— mande en ambos**; evitar que `object-fit: cover` con contenedores de ratio distinto cambie el encuadre entre versiones.
- **Temas:** fondo negro sólido → en claro es tarjeta oscura rotunda, en oscuro es una tarjeta que hace saltar la figura; **mantener el borde redondeado sutil** que la define en oscuro (los dos negros —foto y fondo— no son idénticos).
- **Mejora futura:** reexportar si llega un máster de mayor resolución (≥3000-4000 px), sin tocar el diseño.

---

## 24. Revisión de copy ES↔EN (P29) (2026-07-29)

Pasada de revisión de todo el copy ya escrito (no traducción de contenido nuevo, que sigue siendo V2 — ver `DECISIONS.md` D20). Francisco marcó los cambios en la página de Notion «[Textos ES — revisión de copy](https://app.notion.com/p/3ab2caec08be8115a067c64b210123b0)»; se aplicaron a `es.json` (fuente de verdad) y el EN se revisó contra el ES, no literal. Este PRD se reconcilia con el copy resultante en §8.2, §8.3 y la tabla de §8.5.

**Cambios de copy con contenido (no solo forma):**
- **Cómo trabajo (§8.2):** Prototipado pasa de "validar con usuarios reales" a "facilitar la comprensión"; Lanzamiento se reescribe a "Despliegue selectivo: Standard o feature flags… para evaluar la consecución del objetivo".
- **Más allá del PM (§8.3):** cierre de la línea de growth a "…entendí cómo atraerlos" (y en EN, `Founder several times. Exit once.` — fiel a "varias veces" y sin la repetición "once" que arrastraba la versión anterior).
- **Trayectoria (§8.5):** Emendu e INDYA **dejan de citar la línea de reporting** ("reporto al CEO" / "reportaba al CPO"); la autoridad se expresa ahora como pertenencia al equipo de liderazgo (Emendu) y liderazgo de equipo (INDYA). Freepik cambia el foco a análisis + gestión de OKR del squad. TheTool: "equipo no-código" → "equipo de desarrollo". PICKASO: "financió el arranque de TheTool" → "investigación de mercado de los futuros competidores de TheTool". Ontecnia: la fila pasa a "Ontecnia (Malavida, Lecturalia, BonViveur…)", Sep 2013 – Sep 2015; la fila de Havas/Increnta/Miss Conversion se acota a 2009 – 2013.

**Efecto a vigilar sobre §11 (riesgo "el sitio no transmite la autoridad real del rol"):** al quitar las líneas de reporting de Emendu e INDYA, la evidencia de autoridad en Trayectoria se sostiene ahora en "miembro del equipo de liderazgo" (Emendu), "liderazgo del equipo" (INDYA) y "voz y voto" (TheTool). Sigue habiendo señal de seniority, solo que reformulada — no se rompe la mitigación, pero queda menos explícita. Las líneas de reporting siguen en los datos de fondo de §8.1 (insumo/deep-dive), que no se tocan porque el hecho no cambió, solo salió del copy visible.

**Coherencia de datos:** la descripción de Ontecnia mantiene la métrica "3,2M → 9,4M visitas mensuales" (específica de Malavida), ahora atribuida a la ventana Sep 2013 – Sep 2015.

---

## 25. Planificación del CV en PDF y deep-dive por experiencia (2026-07-29)

Se arranca la tarea del **CV con identidad propia** (V2, "En progreso"). Planificado antes de generar nada; el detalle técnico vive en `DECISIONS.md` D22, aquí solo lo de producto/contenido.

**Enfoque:** el CV se **genera desde el diccionario** (bloque `cv` nuevo), no se diseña a mano — misma disciplina de fuente única del resto del sistema. Formato: **2 páginas**, cabecera de marca + **foto** (`Fran_Avatar.png`, rectángulo de esquinas redondeadas) + **cuerpo a una columna maximizado para ATS** (sin sidebar), **bilingüe ES/EN**, online-only (colores de marca libres, no se imprime).

**El CV lleva contenido más rico que la web.** La web es deliberadamente escueta ("una línea de impacto"); un lector de HR necesita más. El contenido rico (summary + bullets con métricas y keywords ATS) se toma del **CV de Google Docs** (ver Fuentes) reconciliado con los hechos del sitio, y vive en el bloque `cv`. Los hechos (fechas, empresas, roles, formación, contacto) se reusan del diccionario, no se duplican.

**Deep-dive por experiencia — gap cerrado.** Estaba previsto en §4/§7/§15 como V2/V3 pero **nunca llegó a ser tarea**; ahora tiene tareas de **diseño** y **desarrollo** (V2/Could). Decisión clave: **el bloque `cv` es su fuente de contenido** — el CV y el deep-dive son dos presentaciones del mismo detalle por experiencia, autorado una vez. Por eso el CV se construye ya sin esperar al deep-dive: no es contenido temporal, es su origen.

**Pendiente (siguiente sesión):** primera acción, leer el `francisco-lopez-cv-es.pdf` actual (poppler ya instalado, ver D22) para contrastar con el borrador; después, que Francisco enriquezca el borrador de contenido y resuelva 6 confirmaciones abiertas (ARPU, título de TheTool, hub de tools de Emendu, nombrar Sesame HR, huecos de métrica, profundidad de bullets). Contexto completo en la tarea de Notion "Diseñar CV en PDF con identidad visual propia".

**Cerrado 2026-07-30.** CV bilingüe generado por código, 2 páginas, ATS, con identidad de marca propia — detalle técnico y de contenido en `DECISIONS.md` D22 (bloque "Realizado 2026-07-30"). El contenido se enriqueció y validó en la página de Notion «CV — enriquecimiento de contenido (bloque `cv`)» (bajo *New Website*) con las 6 confirmaciones resueltas (ARPU fuera, TheTool "Cofounder & Product", hub de Emendu incluido con −38%, Sesame HR nombrado, profundidad 5-6 bullets) más una ronda de finetuning (logo split en color en lockup, fondo hueso, reporting por rol, Habilidades/Toolkit separados). Ambos PDFs (`-es`/`-en`) cableados por locale en la web vía `cvPath(lang)`. **Único hueco pendiente:** reporting de PICKASO (no aportado; el rol queda sin esa línea). El deep-dive por experiencia sigue como tarea aparte (V2/Could) y compartirá esta fuente de contenido cuando se construya.

---

## 26. Fase V2+: análisis crítico y cambios de metodología (2026-08-01)

Con la V1 en producción, antes de diseñar/desarrollar las secciones nuevas (Sobre mí, Accesibilidad, Contacto avanzado), se hizo una tanda de **análisis críticos con mirada externa** (developer / diseñador / copywriter / seguridad) y se ajustó la forma de trabajar. Detalle técnico en `DECISIONS.md`; metodología en `CLAUDE.md`; hallazgos convertidos en tareas del tablero.

**Análisis → tareas:**
- **Desarrollo**: base sólida y disciplinada; huecos de *andamiaje* (sin CI, sin páginas de error propias, drift de docs, `shadcn` mal ubicado). → etapa *Cimientos técnicos*.
- **Diseño**: ejecución sobresaliente pero dentro de un lenguaje muy de género; color infrautilizado, ritmo de secciones repetitivo, sin un gesto-firma memorable. → tareas (links animados, franja-CTA de cierre, footer estructurado, gesto-firma).
- **Copy**: correcto pero seguro; el copy más flojo es el de más valor (Contacto/CTA, que perdió el ICP en §24) y habla de él, no al lector. → posicionamiento (ICP + exit) + copy en la franja-CTA.
- **Seguridad**: superficie pequeña y bien higienizada (secretos limpios, ruta OG asegurada); faltan cabeceras de seguridad y hay un CVE de `sharp`. → tareas.

**Cambios de metodología:**
- **Diseño en código** para las secciones nuevas (D1 *superseded*): el sistema vive en el repo, no en Claude Design.
- **Etapas temáticas sin fechas** (Sprint → Etapa): dirigen `MoSCoW` + `Prioridad` + `Tamaño`. Cerrar una etapa dispara el skill `sprint-review`.
- **Dos carriles**: el *build* avanza por etapas (activa: Cimientos técnicos); el *contenido* que solo escribe Francisco (Sobre mí, Accesibilidad) corre en paralelo por delante.
- **Adiciones**: contenido primero, bucle medir→aprender por etapa, Definition of Done por sección, revisión con IA en los PR grandes, disciplina shippear-vs-pulir.

**Reestructura de docs**: PRD dividido en `PRD-Live.md` (spec viva, único espejo en Notion) + `PRD-Historical.md` (este, solo repo); espejo de DECISIONS retirado de Notion. Tres skills operativos: `update-cv`, `close-session`, `sprint-review`.

**Estado al cerrar**: arranca la etapa *Cimientos técnicos* (build, CI primero) en paralelo al contenido de Sobre mí (borrador creado en Notion, pendiente del texto personal de Francisco).

---

## 27. Sobre mí: contenido y diseño en código (2026-08-01)

Primera pieza del carril de contenido que sale adelante: se desbloqueó y construyó la página **Sobre mí** (V2).

**Contenido (P31).** Ángulo: *la persona detrás del PM*, no un segundo CV. Se partió del **texto en bruto de Francisco** —más personal que el andamiaje de 5 bloques que se había propuesto— y se pulió a una estructura de **4 movimientos**: apertura + cita-firma («Un tipo al que le gusta entender su mundo / No me gustan las cosas que no tienen menú de opciones») → *Cómo llegué a Producto* (marketing/growth → PM, con el arranque del *Libro rojo de la publicidad*) → *repostería* (enlazada a la mente de producto: cada receta = un lanzamiento) → *montaña* (el yo no tecnológico) → cierre con CTA a Contacto. ES fuente de verdad + EN no literal (D20). Validado en la página «Sobre mí — borrador de contenido» (Notion).

**Diseño en código (P33).** Tratamiento **editorial sobrio**, iterado con Francisco en localhost (no capturas). Decisiones: la cita-firma va **sobre la foto** de apertura full-width (scrim para contraste; en móvil se oculta la 2ª frase); **intro y cierre** a media columna a la izquierda (opening/closing); *Cómo llegué a Producto* a **ancho completo** (sin foto, no una columna centrada — corrección tras un primer intento centrado que Francisco descartó); repostería/montaña en **zigzag** con foto 4:5 y un **panel de marca pastel** desplazado detrás (cian/morado, decorativo, sin tocar el color de acción, respondiendo al "poco uso de marca" del análisis V2+); **negrita/cursiva y un enlace** desde el diccionario vía un render de markup ligero (ver DECISIONS D23).

**Pendiente para publicar (P35).** Fotos reales (hoy placeholders al ratio) + enlace en el nav (P36) + gate de a11y/SEO. La otra mitad de P35 (Accesibilidad) sigue bloqueada por su contenido (P32) y su diseño (P34).

**Estado al cerrar**: Sobre mí lista salvo fotos (en el tejado de Francisco). Mañana arranca *Cimientos técnicos* (P30.1, CI de PRs) mientras Francisco redacta el contenido de Accesibilidad (P32) en paralelo.

---

## 28. Publicación de Sobre mí + Accesibilidad (2026-08-02)

Se cierra el carril de contenido V2: **Sobre mí (con fotos reales) y la página de Accesibilidad salen a producción** (`franciscolopez.es`, tag v1.2.0, PR #34).

**Metodología *audit-first* para Accesibilidad.** Antes de escribir, se corrió una **auditoría verificada** de la web en producción: **axe-core en claro y oscuro** (0 violaciones en home y páginas internas) reconciliada con el WAVE de Francisco. Dos hallazgos: (1) el **WCAG Checker** que había usado era inválido —capturó la página de error de Next (`__next_error__`), no el sitio—, descartado; (2) WAVE marcaba 2 «empty form label» reales: los **toggles del banner de consentimiento**, cuyo `<label>` no tenía texto (nombre accesible sí, vía `aria-labelledby`; por eso axe lo aprobaba). Se corrigió antes de declarar conformidad. La referencia de Francisco (la página de accesibilidad del design system de Banc Sabadell, *Galatea*) resultó ser **guidelines de sistema, no una declaración legal**: se adaptó su espíritu (compromiso + principios WCAG + medidas por criterio) al caso propio.

**Página de Accesibilidad.** Es la **declaración pública de conformidad** —contrapunto del criterio interno de la sección 08 del Design System (D21)—: nivel **WCAG 2.2 AA cumplido**, sistema de color en **AAA** (medido), las 8 medidas del checklist con su criterio WCAG, cómo se verifica (axe/Lighthouse) y **cómo reportar una barrera** (email). La cifra/fecha de conformidad se fija **tras el QA**, no de memoria. Primer intento en formato prosa a media columna (tipo Cookies); **rediseñado** a petición de Francisco para alinearlo con sus hermanas (hero con composición a la derecha + fila de datos, secciones numeradas 01–05, encabezado a la izquierda y contenido a ancho completo). La composición del hero es **autorreferencial** (tarjeta de contraste AAA, checklist, muestra del anillo de foco 2px), decorativa.

**Sobre mí — fotos.** Las tres escenas dejan de ser placeholders: Francisco eligió las fotos, procesadas a **WebP con sharp** (de ~2 MB PNG a 65–131 KB) y servidas con `next/image` (apertura landscape con `object-position`, repostería/montaña en recorte 4:5).

**Arquitectura de navegación.** Decisión de IA: **Sobre mí al nav** (contenido a descubrir, tras «Descargar CV», con `aria-current`) y **Accesibilidad al footer** (página de confianza/utilidad, junto a Brand Kit/Design System/Cookies). Las tres páginas de sistema ya se enlazan entre sí (RelatedPages; retirado el tile «Próximamente»).

**QA (build de producción).** Ambas páginas: Lighthouse desktop 100/100/100, móvil Perf 93–96 / A11y 100 / BP 100; axe 0 violaciones en claro y oscuro. El SEO local bajo es el artefacto `is-crawlable` (robots bloquea indexación fuera de producción, D13); en prod, 100.

**Estado al cerrar**: carril de contenido V2 cerrado (Sobre mí + Accesibilidad en vivo). El carril de build sigue en *Cimientos técnicos* (P30.x). El `sprint-review` se difiere a cuando cierre Cimientos, para hacer **una** revisión de codebase que lo cubra todo (no dos solapadas).

---

## 29. Contacto: copy al ICP y una sola superficie (2026-08-03)

Arranca la etapa **Contacto avanzado** con la secuencia que dejó el `sprint-review`: **contenido → cimiento → diseño → instrumentación**, deliberadamente en ese orden.

**Copy de cierre (P27).** El bloque de Contacto tenía un texto genérico que no hablaba a nadie en concreto («Senior Product Manager con experiencia en SaaS, siempre busco impacto real…»). Se reescribe para **hablarle a la empresa**, no al reverso de una criba: *«Si en tu empresa el producto está en el centro y construís experiencias increíbles para vuestros usuarios —a través del discovery, la IA aplicada y el dato—, creo que encajamos»*. La tríada **discovery · IA aplicada · dato** hace de *bookend* con el headline del Hero («Del discovery al dato») y mete la IA, que es filtro real del ICP. El eyebrow pasa de «Contacto» a **«El siguiente paso»** para enmarcar el bloque como cierre sin repetir el título.

**El exit se queda implícito.** Se evaluó nombrar TheTool → AppRadar en la franja —es el último bloque, donde el *reveal gradual* podría cobrarse— y Francisco decidió que no: sigue viviendo solo en Hitos y en «Más allá del PM». La franja habla de encaje, no de credenciales.

**Una sola superficie de contacto (P28 + P29).** Los tres puntos de contacto del sitio habían divergido: la home era una lista de cuatro filas que trataba email y CV como iguales; Sobre mí cerraba con un enlace a `/#contacto` que **devolvía al usuario a la home** a buscar la sección; y Accesibilidad usaba un outline con la dirección de email entera metida dentro del botón. Se unifican en un componente compartido, con el dato centralizado en `lib/contact.ts` (el email estaba hardcodeado en cuatro sitios, y `lib/site.ts` ya exportaba un `LINKEDIN_URL` que footer y contacto ignoraban redefiniéndolo). El bloque de la home se convierte en **franja-CTA de cierre**, y el email pasa a ser el **único botón sólido del sitio**: los clics de contacto son la métrica primaria (§7) y hasta entonces nada señalaba cuál era *la* acción. Efecto lateral buscado: el tracking se cablea en un punto y no en tres — por eso la instrumentación se dejó para el final.

**Redundancia detectada por Francisco.** La primera versión ponía la dirección de email bajo el botón «Escríbeme». Su lectura —que es repetir el mismo mensaje— se acepta para la home y Sobre mí (donde teléfono y LinkedIn ya hacen de plan B si el `mailto:` no abre) y se conserva **solo en Accesibilidad**, donde el bloque *es* el canal de reporte y no hay otro camino al lado.

**Accesibilidad: dos trampas del mismo tipo.** Construir la franja destapó que **`--muted-foreground` está calibrado contra `--background`**: sobre una banda de color cae a AA suelto (6,44:1 / 5,56:1) y habría roto el «todo AAA» que declara `BRAND.md` y que la página de Accesibilidad **publica**. Se resuelve mezclando el atenuado con la propia banda (D30). Verificando, axe destapó el **mismo patrón ya en producción**: el eyebrow de «Más allá del PM» daba **4,07:1 en tema oscuro** —por debajo de AA—, porque su mezcla estaba fija mientras el fondo efectivo de la banda cambia con el tema. Francisco optó por arreglarlo en el momento en vez de documentar la excepción, para que las dos afirmaciones públicas volvieran a ser ciertas: corregido al 80% (9,24:1 / 8,31:1).

**Método que deja poso.** Medir el contraste **en el DOM y con carga limpia por tema** — conmutar el tema en caliente daba cinco falsos positivos, con texto de un tema sobre fondo del otro por las transiciones de color a medias. Y componer el alfa sobre el fondo real: un `color-mix` con `transparent` leído sin componer da una cifra falsa y optimista.

**Estado al cerrar**: P27, P28 y P29 en producción; la etapa **sigue abierta** con el tracking de clics (P30) pendiente y el fix de contraste (P30.5) cerrado en la misma sesión.

---

## 30. Microsoft Clarity: alta, fugas de CSP y gating de consentimiento (2026-08-03)

Francisco da de alta **Microsoft Clarity** (P37, adelantado desde *Optimización* porque ya estaba de alta y vinculado a GTM/GA4) y aparece con un aviso en PageSpeed que dispara toda la sesión.

**Dos fugas de CSP, no una.** La CSP «A+ barato» (D26) solo tenía allowlist para GTM/GA4; Clarity se cargaba desde `clarity.ms` y se bloqueaba entero. El primer fix (`script-src`/`connect-src`, PR #68) hizo que el script cargara, pero PageSpeed **seguía marcando el mismo aviso** — resultó ser un segundo bloqueo, distinto: el beacon de imagen `c.clarity.ms/c.gif`, gobernado por `img-src`, que el primer fix no tocó (PR #69). La lección operativa: un aviso de "errores de consola" en PageSpeed puede agrupar violaciones de CSP *distintas* bajo el mismo título — hay que expandir el detalle y mirar la URL/directiva exactas en cada iteración, no asumir que es la misma causa.

**El bug de verdad: Clarity no respetaba el Consent Mode.** Se probó en vivo borrando el consentimiento guardado (`localStorage`) y recargando: con `analytics_storage: denied` (el estado por defecto antes de aceptar el banner), **Clarity se disparaba igual** — estaba grabando sesiones sin consentimiento, pese a que la arquitectura de Consent Mode v2 (D17) está bien implementada en el código. La causa no estaba en el repo: la etiqueta "Microsoft Clarity - Official" en GTM tenía su **Configuración de consentimiento (BETA)** en "Sin establecer". Francisco lo corrigió en GTM (exigir `analytics_storage` granted) y se volvió a verificar en vivo el mismo par de pruebas: denegado → cero peticiones a Clarity; concedido → carga con `200`.

**Efecto colateral no buscado: un píxel de Microsoft Ads.** Durante la investigación apareció un tercer bloqueo de CSP, `c.bing.com/c.gif` (Microsoft Ads/UET), sin relación con `clarity.ms`. El listado de etiquetas de GTM confirmó que no hay ninguna etiqueta de Bing — el píxel salía del propio proyecto de Clarity, vía su integración nativa con Microsoft Advertising. Francisco decidió que no lo quería y lo desactivó en `clarity.microsoft.com` (Configuración del proyecto), confirmado después. La CSP se deja **sin** `c.bing.com` en el allowlist a propósito (D32): si esa integración se reactivase algún día por error, el bloqueo actúa como red de seguridad y lo delataría de inmediato en PageSpeed.

**Documentación de cookies puesta al día.** La página de cookies llevaba desde julio con un comentario de mantenimiento avisando de que Clarity llegaría "en V2" — llegó, y la tabla + el texto de «Terceros» (que solo mencionaba a Google) se actualizaron para reflejar la realidad: filas `_clck`/`_clsk` (Analítica), y Microsoft añadido junto a Google como tercero, con enlace a su declaración de privacidad. ES/EN en paridad (D20).

**Estado al cerrar**: Clarity en producción, gateado a consentimiento, sin avisos de CSP (PageSpeed Prácticas recomendadas: 100). P37 movido de *Optimización* a Listo. Sin tareas pendientes — Francisco confirmó el toggle de Microsoft Advertising desactivado en el propio dashboard de Clarity.

## 31. Links con diseño y animación (P37.55) (2026-08-04)

Los enlaces del sitio eran "100% estándar" (sin animación de hover) — la propia tarea
los señalaba también como vehículo para la crítica de diseño #1: "el sitio es más gris
que su marca".

**Prototipado en Claude Artifact, no directo en código.** En vez de iterar sobre los
componentes reales, se construyó un Artifact con los tokens reales de `globals.css`
(claro/oscuro, toggle de `prefers-reduced-motion` incluido) y variantes lado a lado.
Funcionó lo bastante bien como para que Francisco pidiera reutilizar el flujo en
futuras decisiones de diseño — queda anotado en memoria como práctica a repetir. Las
capturas de referencia que trajo Francisco (pares off/on de un garabato circular y de
un relleno ascendente) se tomaron como spec visual directamente, sin necesidad de
descripción textual previa.

**Decisión de contenido: H1.** Enlaces dentro del cuerpo de texto pasan de "texto en
`primary` siempre" a reposo neutro (`foreground` + subrayado fino en `primary`) con un
relleno sólido que crece desde abajo y invierte el texto a `primary-foreground` en
hover/focus — reutiliza el par de contraste ya verificado AAA de "texto sobre botón" en
vez de inventar uno nuevo. Es un cambio de regla de marca real, documentado en
`BRAND.md`. Una segunda variante (un garabato circular animado, "G") quedó descartada
como estándar pero reservada para un uso puntual de énfasis.

**Decisión de chrome: F.** Nav/breadcrumb/footer se quedan en `foreground`/
`muted-foreground` de siempre, con una pastilla de fondo `--muted` en hover — se probó
una variante con wash de cian y no aportó diferencia sustancial sobre la neutra.

**Excepción de `ContactSecondary`.** Teléfono/LinkedIn/CV en la franja de contacto son
acciones, no navegación, así que por regla les tocaría H1 — pero el relleno sólido
generaba ruido visual justo al lado del CTA de email (competían por atención en vez de
leerse como su acompañamiento). Se resolvió dándoles tratamiento de chrome como
excepción documentada, no como un tercer criterio nuevo — a revisar de nuevo si algún
día existe una sección de contacto dedicada (hoy es la franja compartida de D29).

**Bug real encontrado en la implementación**, no solo de diseño: las clases nuevas se
escribieron primero dentro de `@layer components`, pensando que así las utilidades de
Tailwind ganarían en caso de conflicto — pero en este proyecto eso hizo que Tailwind
ignorase la capa entera de forma silenciosa (sin error de build). Se corrigió
devolviéndolas a reglas sin capa, como ya hacía `.contact-cta`. Registrado como D34.

**Seguimiento.** La revisión de esta tarea destapó cuatro pulidos más, registrados como
tareas nuevas en el tablero (P37.56–P37.59): grosor de texto inconsistente en el nav,
controles solo-icono sin hover (toggle de tema, LinkedIn del footer), el CTA "Gestionar
preferencias de cookies" con un uso a revisar, y refrescar Brand Kit/Design System para
que reflejen el nuevo tratamiento de enlaces.

**Dos hotfixes tras revisar el Preview de Vercel**, no visibles en local con datos de
prueba cortos: (1) el pill de `ContactSecondary` en la home vivía dentro de
`.contact-band` (fondo ya `--muted`) y el hover, que pintaba ese mismo `--muted`, se
volvía invisible — en Sobre mí no se notaba porque esa franja no lleva `bg-muted`. (2)
El primer arreglo saltó a `--card` como fondo del pill ahí dentro, un token demasiado
claro/frío que rompía con el tono cálido del resto del sistema y leía como un recuadro
blanco suelto. Resuelto con un `--chrome-hover-bg` sensible al fondo (mismo patrón que
`--contact-dim`): `--muted` por defecto, y dentro de `.contact-band` un mix de
`--foreground` al 10% sobre la propia banda — oscurece en claro, aclara en oscuro,
igual dirección que ya tiene el pill por defecto en cada tema.

**Estado al cerrar**: implementado y verificado (build/lint/typecheck limpios,
comprobación visual en Chrome claro/oscuro, y en el Preview real de Vercel) en
`rich.tsx`, `cookies-policy.tsx`, `contact-actions.tsx`, `nav.tsx`, `breadcrumb.tsx`,
`footer.tsx`, `consent-banner.tsx` y `consent-preferences-button.tsx`. Rama
`feat/p37-55-links-hover`, PR #73, con el visto bueno de Francisco sobre el preview.
Pendiente: verificación real de contraste con axe/Lighthouse sobre los componentes en
producción.

---

## 32. Consecuencias de P37.55: chrome completo y el sistema documentado (2026-08-04)

Sesión de seguimiento a P37.55, con las cuatro tareas que el propio cambio de enlaces
había dejado abiertas (P37.56–P37.59). Todas se acumularon en la misma rama
`feat/p37-55-links-hover` para subir a producción de una vez, junto con P37.55.

**Coherencia del chrome.** Los enlaces del nav no compartían peso tipográfico
(«Descargar CV» iba en `font-semibold` frente al `font-medium` del resto) y los
controles **solo icono** —toggle de tema, hamburguesa, LinkedIn del footer— no tenían
**ningún** estado hover: eran lo único del chrome que no respondía al cursor. Se unificó
el peso y se creó `.icon-chrome`, que reusa la misma pastilla que el chrome con
etiqueta. Regla nueva en `BRAND.md`.

**El CTA de cookies.** «Gestionar preferencias de cookies» reutilizaba el outline
neutro del propio diálogo de consentimiento, un tratamiento pensado para convivir con
el botón sólido «Guardar» ahí dentro. En la página de Cookies vive solo en el cuerpo del
texto —el mismo caso que «Descargar CV» en Trayectoria—, así que pasó a
outline-primary. De ahí salió la **jerarquía de hover** ahora escrita en `BRAND.md`:
sólido / outline-primary / outline neutro, con los toggles como caso aparte.

**El hueco de documentación.** La tarea asumía que Brand Kit y Design System enseñaban
el patrón de enlaces antiguo y que había que actualizarlo. Al revisarlas resultó que
**ninguna de las dos documentaba los enlaces en absoluto**: el patrón solo vivía en
`BRAND.md`. Se añadió al Design System la sección **(08) Enlaces**, con los tres
tratamientos en demo viva (hover real, no capturas), el porqué de reservar el cian al
momento de interacción y la excepción de la franja de contacto. Accesibilidad pasó a
(09) y Esqueleto a (10).

**Auditoría de CTA de ambas páginas**, a petición de Francisco, que sospechaba que no
seguían la norma — acertó. Cuatro controles sin hover: el toggle de rejilla, las tres
pestañas de dispositivo, el botón «Repetir» del reveal y los chips de descarga del
Brand Kit. Estos últimos, además, estaban a **40px de alto**, por debajo del mínimo de
44px que publica la checklist de accesibilidad **de ese mismo Design System**. Al
arreglar los toggles se vio que darles el relleno pleno los volvía indistinguibles del
estado activo (`aria-pressed`), de ahí el tinte como tratamiento propio de toggles.

**Una corrección de diagnóstico.** El fallo de `.icon-chrome` se atribuyó primero a que
la utilidad `bg-card` le ganaba en la cascada, y así se escribió en el comentario del
CSS y en el mensaje de commit. Al ir a documentarlo en el cierre de sesión, la
afirmación contradecía a D34 y se verificó en el navegador: **era falsa**. La causa real
era la transición, no la cascada (D35). Queda como recordatorio de que un diagnóstico
que contradice una decisión ya registrada hay que comprobarlo antes de escribirlo, no
después.

**Estado al cerrar**: build, lint y typecheck limpios; verificación visual en Chrome de
los tres patrones y de los CTA corregidos, en claro y oscuro, ES y EN. Sube a producción
junto con P37.55.

---

## 33. Capa de acción y de layout: el sistema deja de escribirse a mano (2026-08-04)

Antes de construir secciones nuevas, Francisco pidió una **auditoría de diseño** —cumplimiento del sistema y expresión de marca, sin copy— y de paso entender por qué los CTA se sentían descoordinados. La sospecha se quedó corta: **entre los tokens y las páginas no había capa de componentes**. `components/ui/button.tsx` llevaba en el repo desde el principio con **cero usos**, y cada botón era una cadena de Tailwind escrita donde vivía. Medido: 6 definiciones de «botón base» en 6 archivos, 2 radios para la misma caja, 4 hovers para la variante sólida —incluido *ninguno*—, el objetivo táctil de 44px copiado 14 veces (con el footer fuera, a 40px, en todas las páginas) y `WRAP` duplicado idéntico en 18 sitios.

**Lo construido.** `components/ui/action.tsx` (7 variantes, 4 tamaños, con el suelo de 44px y el radio dentro) y `components/site/layout.ts` (WRAP · SECTION · PROSE · CARD · PANEL). Se publicó la sección **«Botones y acciones»** en el Design System, ES y EN, con demos que usan las variantes reales: si una cambia, la página cambia con ella y no puede mentir. Detalle técnico en `DECISIONS.md` **D36**; las reglas visuales, en `BRAND.md`.

**Cuatro cosas que enseñó el proceso, y que valen más que el refactor:**

1. **Los enlaces eran coherentes y los botones no, y la diferencia era esta página.** Los enlaces habían hecho el recorrido completo —regla → clase → sección publicada → uso— y por eso son difíciles de incumplir sin querer. Los botones se quedaron en el primer paso. *Una regla que hay que recordar es una regla que se incumple.*
2. **«Mismo nombre con valores distintos» no es lo mismo que «cadena repetida».** El `CARD` con dos radios no era drift: eran **dos cajas y una no sabía que lo era**. El radio mayor del panel es jerarquía de anidamiento. Unificar los valores habría roto el sistema; lo que faltaba era un nombre.
3. **Agrupar por atributo ARIA agrupa por accidente.** El toggle de rejilla y los tabs de dispositivo compartían regla por usar ambos `aria-pressed`, siendo un interruptor y un segmentado. La primera redacción del criterio nuevo («¿quién es el protagonista?») falló al segundo caso que le tocó; la definitiva mira la **forma** del control, que se comprueba de un vistazo. Lo detectó Francisco al ver los tabs del Esqueleto navegable.
4. **Gatear lo que se mide, nunca lo que se dibuja.** El banner de consentimiento colgaba del gate de GTM, así que un modal con cuatro botones y un switch **solo existía en producción**: imposible de revisar antes de publicarlo. Separados los gates, se pudo auditar por primera vez.

**El gate de accesibilidad encontró tres fallos, ninguno causado por esta tanda** —y uno llevaba trece días en producción: **el cian claro publicaba un AAA que no cumplía** (se pintaba `#005E5F` y daba 6,86:1, no los 7,01 documentados). Corregido a un cian que se pinta `#005859` y da 7,43:1. También: el bloque de código del Design System a 2,09:1 en oscuro —color fijo sobre un panel que invierte con el tema, resuelto con el token nuevo `--primary-on-inverted`— y los objetivos táctiles del footer y del selector de idioma.

**Y un error propio, corregido en caliente.** La primera medición afirmó que el hex documentado estaba mal. No lo estaba: los cianes de esta marca caen **fuera del gamut sRGB**, el navegador los recorta al pintar, y el medidor leía las componentes negativas sin recortar —calculando sobre un color que no existe en pantalla—. Se detectó al verificar en producción, se rehízo con dos métodos independientes y se corrigieron las cifras (`v1.3.1`). El procedimiento para no repetirlo —validar la herramienta contra pares ya publicados antes de creerse un hallazgo— quedó escrito en `BRAND.md`. Nota curiosa: el 7,28:1 de D30 resultó ser **la única cifra del cian de todo el proyecto que cuadraba con lo que se pintaba**.

**Estado al cerrar.** Dos releases en producción (`v1.3.0` y `v1.3.1`). axe: 0 violaciones en las seis páginas, en claro y oscuro, con el diálogo de consentimiento incluido. Lighthouse: 98/100 desktop y 92/100 móvil, CLS 0. Quedan abiertas la skill `design-review` —que esta sesión llenó de material—, la presencia del morado en la home y subir a AAA la última excepción que queda.

---

## 34. AAA sin excepciones y la regla del icono propio (2026-08-08)

Tanda de cierre de los ajustes de diseño que dejó abiertos la auditoría (§33): cinco tareas, un solo deploy (`v1.4.0`).

**Lo que entró.** La **última excepción AAA del sistema** —el hover del toggle apagado, que daba 6,35/6,98— sube a **7,21/7,80**, y el modo de conseguirlo importa más que la cifra: bajar el alfa del velo no servía porque tiene **techo asintótico** (pintar cian sobre cian no puede subir el contraste del cian; el máximo sin velo es 7,47), y el velo neutro que parecía la vía prometedora resultó ser **la peor de todas** al medirla. Lo que funcionó fue mover el **texto** en vez del velo, reusando una constante que ya existía (88/12, la del hover del sólido). Además: los tres botones del diálogo de consentimiento dejan de partirse en dos filas, la dirección de email de Accesibilidad pasa a ser un `mailto:`, y la **regla del icono entra en la variante** —se acaban las tres formas distintas de «Descargar CV» y los cuatro tamaños de glifo repartidos por cinco archivos—.

**El icono propio, que era el trabajo de fondo.** lucide dejó de exportar iconos de marca por marca registrada, así que el LinkedIn se dibuja a mano — y se leía como una mancha sólida al lado del sol y la luna, a los mismos 18px y en la misma pastilla. No era el tamaño: metía **cinco carriles de 4 unidades en las 20 del área útil**, o sea contraformas de 2 unidades, 1,5px en pantalla. La «in» no cabe contorneada a ese grosor, así que ahora se dibuja **con** el trazo. De ahí sale lo que de verdad se entrega: la **regla de autoría de iconos propios** en `BRAND.md`, para el siguiente que haga falta.

**Y un metro que se cayó al validarlo.** El candidato a norma era la densidad de tinta, y acompañaba: el icono roto era el más pesado de todos, 36,3% frente a la banda 14–32% de los lucide del sitio. Contrastado con un caso ya dado por bueno, se desmontó — **sobre su propia caja, `mail` pinta 45,8% y el icono roto 45,2%**, y `mail` se lee perfecto. La norma escrita acabó siendo el **hueco más estrecho**, que sí separa los dos casos. Es el mismo hábito que §33 estableció para el color (validar la herramienta contra pares publicados antes de creerse un hallazgo), aplicado por primera vez a una métrica de forma — y esta vez descartó la métrica, no el hallazgo.

**Lo que encontró Francisco al revisar.** Que el LinkedIn del footer no tenía caja y el toggle del nav sí, **siendo la misma variante sobre la misma superficie**. La causa no era el footer sino el defecto: el fallback era `transparent`, los seis call sites normales escribían `--card` a mano y el séptimo se olvidó. Corregido en la variante, no en el footer. Queda como corolario de `DECISIONS.md` **D35**: *el valor por defecto de una variable con fallback tiene que ser el caso mayoritario, no el neutro* — el neutro parece prudente y lo que hace es convertir el caso normal en algo que hay que recordar.

**Estado al cerrar.** `v1.4.0` en producción, verificada sobre el elemento real y sobre el CSS servido, en claro y oscuro. Quedan abiertas la skill `design-review` (siguiente en prioridad), y dos tareas nuevas que salieron del cierre: la alerta de Dependabot #15 —ReDoS en `hono`, transitiva de `shadcn` y **solo de desarrollo**, sin exposición en producción— y `format:check`, que está rojo en permanencia no por estilo sino por **finales de línea** (CRLF en el working tree contra el `endOfLine: lf` de Prettier); lanzar `prettier --write` habría producido un commit de 61 archivos sin un solo cambio real y que se revierte solo en el siguiente checkout.

---

## 35. La revisión de diseño se vuelve un método, y su primer disparo (2026-08-08)

Última tarea abierta que dejó la auditoría de §33: convertirla en el skill **`design-review`** (P37.599), hermano de `sprint-review` pero para el diseño. El material de origen no fue la auditoría —que se justificó sola— sino **los cuatro hallazgos que Francisco cazó navegando al día siguiente del gate**, que no fueron cuatro despistes sino cuatro fallos de método: la lista de propiedades era implícita (el icono nunca estuvo en ella), se auditó el código y no el píxel, se auditó el componente y no sus composiciones ni sus estados, y **una decisión documentada se aceptó como decisión correcta** sin comprobar que el comentario respondía a la pregunta que se estaba haciendo. Los cuatro son ahora los cuatro principios del documento, y de ellos salen sus cinco fases: cruzar las cuatro fuentes antes de mirar un componente · barrido de cumplimiento con **allowlist calibrada** · matriz de propiedades que se recorre entera · verificación en pantalla con **estados provocados a mano** · expresión de marca. Fuera de alcance: el copy.

**Francisco cambió el plan de entrega, y el cambio fue el que dio valor a la sesión.** En vez de mergear la skill y validarla más adelante, la disparó **antes de mergearla**: «según lo veo yo, primero dispararía la skill; en función de lo encontrado vemos si hay que mejorarla». Es la única prueba real de que un método sirve, y funcionó en las dos direcciones — encontró seis cosas *y* mostró seis puntos donde el propio método hacía fricción.

**Lo que encontró.** El mejor hallazgo es el que ninguna de nuestras verificaciones automáticas puede ver: la **previsualización de tema del Design System pinta el cian superado**. Ese panel copia nueve valores de token a mano —copia legítima: tiene que pintar la paleta *contraria* a la vigente, que las CSS vars no dan—, y **ocho estaban bien**. El noveno era el cian claro, `oklch(0.43 …)` → `#005E5F`: exactamente el color que se corrigió el 2026-08-04 por publicar un AAA que no cumplía. axe pasa, el contraste pasa (7,28:1 sobre botón sigue siendo AAA) y el typecheck pasa; solo aparece comparando valor contra valor. De las nueve copias, la única equivocada era **justo la que había cambiado**. Además: seis glifos dibujados a mano que lucide sí trae —uno de ellos duplicado byte a byte en dos páginas, con trazo 3, que pinta 1,88px frente a los 1,42–1,50 de toda la familia—, la ausencia de capa de etiqueta (siete definiciones, cinco variantes medidas en pantalla, tres conviviendo en la misma página), el enlace de chrome sin capa de métricas (13 de 17 call sites) y tres notaciones para el mismo radio. Cinco tareas: **P37.5992–37.5996**.

**Y un drift que iba al revés del de julio.** `BRAND.md` **se contradecía consigo mismo**: dos párrafos publicaban 7,88 → 8,59 / 8,93 mientras su propia §Accesibilidad, más abajo, decía que lo medido era 7,93 → 8,64 / 8,92. Esta vez **las cuatro páginas del sitio llevaban las cifras correctas** —verificado midiendo el color pintado en los dos temas— y el desactualizado era el reglamento. La causa no fue de criterio sino de forma: la corrección se escribió como nota fechada al pie en vez de sustituir el texto de arriba. Corregido, y escrito como punto 6 del método de medición: *una cifra corregida se sustituye en todos los párrafos que la citan*.

**El mismo defecto de forma, en la regla del icono.** «Si algún día hay más de dos iconos propios, publicarlos en el Brand Kit» llevaba cuatro días sin dispararse teniendo **siete**, porque su condición se comprobaba leyendo `icons.tsx` —donde había uno— en vez de contando los que hay. El inventario pasa a ser el `grep` de `<svg>`, descontando logo e ilustraciones. No fallaba el criterio: fallaba que **la condición no era medible en el sitio donde de verdad ocurre**.

**Lo que el disparo cambió del método.** Filtro **UI real vs ilustración** como primer paso del barrido (sin él, `rounded-`/`hover:` devuelve ~120 hits que son trazos de maquetas, y un informe con ruido deja de ser señal — el mismo motivo por el que `format:check` en rojo permanente no avisa de nada); fila nueva de **valores de token copiados a mano**, que es la que encontró el cian; inventario de glifos por `grep` y no por archivo; el **trazo pintado en px** como metro de icono (`stroke × renderizado/viewBox`), que es a la forma lo que el recorte de gamut es al color; y un aviso operativo que apareció al chocar con él: **el navegador es el de Francisco**, así que provocar los estados escribe en su perfil real —`theme` es su preferencia y `flm-consent` su decisión de privacidad guardada—, y eso se hace en incógnito o restaurando lo que se toque.

**Lo que queda sin estrenar.** La Fase 4, la de expresión de marca, apenas se ejercitó: solo confirmó lo ya tareado (morado en 2 de 8 secciones, 6 de 8 fondos planos). No se sabrá si tiene el mismo filo que la mitad de cumplimiento hasta que toque una sección nueva. Y una nota de coste: las fases de código son baratas y muy rentables, la pasada en navegador es donde se va el tiempo — si algún día se engancha al cierre de etapa, lo razonable es que las fases de código vayan siempre y la de pantalla se limite a lo que ellas señalen.

---

## 36. Los huecos de variante se cierran, y la regla de shadcn se acota (2026-08-08)

Primera mitad del bloque de diseño que abrió §35 (P37.5993–P37.63, `v1.4.1`). Cinco tareas con **la misma forma**, que es lo que las agrupa: la pieza del sistema existía, no cubría el caso, y el caso se escribió a mano. La respuesta en los cinco fue cerrar el hueco, no afinar la excepción.

**Lo que entró.** Los **seis glifos que lucide sí exporta** dejan de dibujarse —incluido el `check` duplicado byte a byte en dos páginas—, y la ilustración de peso pasa a usar el LinkedIn real del sitio, así que la demo ya no puede divergir de lo que documenta. **Una sola notación de radio** donde había tres. La **tarjeta mono del Brand Kit** era la única de su fila que no usaba `VariantCard`, y por eso no heredó el ensanchado de chips de P37.592 y su panel se partía: ahora son dos tarjetas y la fila son tres pares. Y **`InfoCard` había nacido dos veces**, en `design-system.tsx` y en `accesibilidad.tsx`, casi iguales pero no del todo —solo una tenía `mono`, solo una tenía su interlineado—, de modo que el mismo bloque se leía distinto según la página; unificada, con `bullets` y `foot`, cinco llamadas migradas.

**D6 describía una intención y el documento la leía como estado.** La decisión de julio afirmaba que «shadcn está integrado y no hay que reimportarlo», y planificaba su `Tabs` para el Toolkit y su `Button` para los CTAs. El 2026-08-08 ninguna de las tres cosas era cierta: **shadcn no se usaba en absoluto** —`components/ui/` tiene `action.tsx` y `logo.tsx`, el `button.tsx` que llegó a existir se borró con cero usos, y las pestañas y el diálogo acabaron a mano—, y `@base-ui/react` llevaba meses en `dependencies` **sin un solo import**. Es el mismo defecto de forma que las cifras de contraste de §35: la regla no fallaba, fallaba que afirmaba algo que nadie volvió a comprobar.

**La regla que la sustituye tiene dos acotaciones, y las dos importan más que la regla.** La primera es de **perímetro**: solo aplica a widgets con estado, foco atrapado o portal, que es donde el teclado y el ARIA son caros de escribir bien y baratos de romper sin enterarse; fuera de ahí manda la capa propia y shadcn no entra. La segunda es de **dirección**: aplica **hacia delante, no hacia atrás**. Los tres widgets que hoy están a mano —el `<dialog>` nativo, su switch con checkbox real, las pestañas con roving `tabIndex`— están bien hechos y con 0 violaciones de axe, así que reescribirlos sería cambiar código que funciona por satisfacer un documento. Sin esa segunda acotación, la regla habría generado tres refactors sin beneficio para el usuario.

**Y la propagación, que es donde esta tanda ya se había quemado dos veces, esta vez sí se hizo.** La excepción fechada del switch en `BRAND.md` tenía como condición de salida **literal** «que P37.63 fije de dónde vienen los widgets con estado» — o sea que esta tarea la caducaba, y no por su contenido sino por existir. Revisada: no caduca por ahí (la regla hacia delante no la toca), sale el día que aparezca un segundo switch. De paso apareció que **tres documentos más** vendían shadcn/ui como parte del stack *en uso* —`README.md`, `BRAND.md` §Stack y `PRD-Live.md` §5—, todos heredados de la misma frase de julio.

**La tanda se partió en dos, y la decisión fue de Francisco.** El plan era un solo deploy por tanda (evitar desplegar por tarea), pero al llegar aquí preguntó si convenía subir antes. El corte cae en una frontera real: lo hecho es *tapar huecos de variante*, y lo que queda —frontera `site/`↔`ui/`, `SectionHeader`, capa de etiqueta, métricas de `.link-chrome`, fuente única de valores— es *crear y mover capas*, con **31 call sites reescritos solo entre dos de esas tareas** y un movimiento de archivos que toca los imports de unos treinta. Mezclarlas dejaba un PR irrevisable y un rollback de todo o nada. Partir una tanda que ha crecido no incumple la regla del deploy por tanda: la respeta.

**Estado al cerrar.** `v1.4.1` en producción, verificada en las tres páginas afectadas. Segunda ola preparada en `refactor/capas-del-sistema` (P37.6305 → P37.685, nueve tareas), con `design-review` reservada para su cierre —que además es donde toca, porque P37.68 *es* añadirle el punto de «contenedores de controles»—. Dependabot ha abierto por su cuenta los PRs de `hono` y `js-yaml` que P37.6305 iba a resolver a mano, más siete suyos acumulados sin revisar.

---

## 37. Las capas que faltaban, y la fuente única de lo que el sitio dice de sí mismo (2026-08-09)

Segunda mitad del bloque que abrió §35 (P37.6305 → P37.685, **`v1.5.0`**). Si la primera ola *tapaba huecos de variante*, esta **crea capas y mueve la verdad de sitio**. Nueve tareas, 21 commits.

**Las tres capas que faltaban.** `chrome.tsx` para el enlace de la carpintería de navegación, `badge.tsx` para el rótulo que no se pulsa, `heading.tsx` para el par eyebrow + titular. Con `action.tsx` y `layout.ts` son las cinco de **D36**, y el criterio para elegir dejó de ser el parecido: **¿se pulsa?** y, si sí, **¿tiene caja propia?** Un chip que solo rotula no es un botón pequeño, y un enlace de nav tampoco. Las tres las destapó una versión anterior del skill `design-review` listándolas como «capas que todavía no existen» **con su conteo** — que es el formato que ya ha funcionado tres veces y por eso se quedó escrito en la skill.

**Las páginas dejan de leer sus valores del diccionario (D38).** Design System y Brand Kit se venden como reflejo del código y leían de `es.json`. Cada cifra de contraste vivía en cuatro sitios y ninguno se puede verificar sin volver a medir. Ahora hay tres fuentes con papeles distintos: la **ejecutable** (`globals.css` + las cinco capas), la **publicada** (`lib/design-values.ts`) y la **del porqué** (`BRAND.md`, nunca el valor). La línea de corte quedó literal, para que no haga falta criterio: **si una entrada de `es.json` y su gemela de `en.json` son carácter por carácter la misma, no es copy — es un valor con dos copias.**

**Y por primera vez algo lo vigila.** `npm run check:palette` corre en CI antes del build: coteja 24 tokens con `globals.css` carácter a carácter y verifica que la conversión `oklch`→hex reproduce lo que pinta Chrome. Se validó **inyectando el bug original** y lo cazó. Es la diferencia entre registrar una decisión y hacerla incumplible: todo lo anterior de este bloque dependía de que alguien se acordara.

**Lo que apareció al medir, que es más que lo que se fue a arreglar.** Cinco pares de contraste por debajo de AAA que ninguna auditoría anterior había visto —las dos pastillas, el hover del chrome secundario y dos `color-mix` del Design System, uno de ellos a **4,33:1 en oscuro, por debajo de AA**—; el Brand Kit publicando **13,8:1** para el mismo par que el Design System publicaba como **13,79:1**; y **cinco copias divergidas de un token**, incluido el cian anterior a P37.598 en el mock de tema.

**Los tres fallos de método que explican todo lo anterior, y que ya están escritos donde se disparan:**

1. **Un par que solo existe al COMPONER** —un velo sobre la superficie de debajo, una pastilla de hover— no aparece en ningún inventario de tokens. El censo se hace recorriendo el DOM de la página servida y **con los estados incluidos**; el script vive en `scripts/design-review/contrast-census.js` después de haberse escrito a mano tres veces.
2. **axe no sabe resolver `color-mix()`**: mete esos elementos en `incomplete`, no en `violations`, y se abstiene de juzgarlos. En el Design System son ocho. Todas las auditorías anteriores —y las dos primeras de esta sesión— leyeron solo `violations`. Lo que la máquina no puede ver no sale como problema: **sale como silencio.**
3. **Dos de los valores divergidos eran texto**, no color: el pie que cita `bg … · card … · border …` bajo el mock de tema. Los destapó una captura tomada para otra cosa. Nadie los contaba como copias de un token porque no pintan nada, y ninguna herramienta compara un párrafo con el píxel que tiene al lado.

**`BRAND.md` se parte.** Era el documento más pesado de los que se `@`-importan en cada arranque —5.954 palabras, más que `CLAUDE.md` y `PRD-Live.md` juntos— y la mitad era arqueología. Queda en **3.530** y el total precargado baja de ~11.400 a ~9.000. Al partirlo salieron dos defectos que llevaban meses: el **ítem 2 de la regla de dos capas estaba cien líneas por debajo del ítem 1**, detrás de cuatro secciones de nivel 2 —o sea que «la regla de las dos capas» no se leía como una lista—, y el método de medición iba numerado 1-4-5-2-3-6. Y una sección nueva, **«Cómo se escribe una regla aquí»**, con las cinco lecciones de método que se habrían perdido al archivar los párrafos que las contenían.

**El cierre con `design-review`, y lo que valida.** Se disparó sobre la rama antes del merge, estrenando sus dos puntos nuevos. El de «contenedores de controles» cazó a la primera que **el banner de consentimiento no cabía a 320px** —tres botones en tres líneas de 133/148/136px— que es exactamente la forma que P37.5986 rechazó para el **diálogo** y arregló con `DIALOG_ACTIONS`: se arregló el diálogo y nadie volvió a mirar el banner, ochenta líneas más arriba del mismo archivo. El censo, al validarse, encontró un bug en sí mismo (Tailwind envuelve `hover:` en `@media (hover: hover)` y un bucle plano lo salta) que habría reportado como hallazgo un par que está en 12,47. Francisco encontró navegando otras tres.

**Una afirmación inexacta que se deja publicada a propósito, y conviene que conste.** El censo destapó que `--muted-foreground` sobre `--card` da **6,40 en oscuro** —contra los 7,12 sobre `--background` que publica la tabla— en las seis páginas, porque **D30 nunca se aplicó a `--card`**, que es la superficie no-background más común del sitio. Lo interesante es la asimetría: en claro `--card` es más claro que `--background` y el contraste sube a 7,53; en oscuro también es más claro, pero como el texto es claro, baja. La misma jerarquía de superficies ayuda en un tema y estorba en el otro.

Eso hace falsa, por tercera vez, la frase «todos los pares del sistema están en AAA, sin excepciones» que aparece en `BRAND.md`, en `PRD-Live.md`, en la tabla del Design System y en la página de Accesibilidad. **Se decidió no matizarla** (Francisco, 2026-08-09): el arreglo entra en la ola 3 y sube en un día, así que matizar el texto en cuatro sitios para desmatizarlo mañana es trabajo de ida y vuelta y deja dos redacciones fechadas donde debería haber una. **La decisión tiene fecha de caducidad**: si la ola 3 se alarga, hay que matizar — es literalmente la situación de P37.598, que pasó trece días publicando un 7,01:1 que ningún color podía dar.

**Estado al cerrar.** `v1.5.0` en producción, verificada sirviendo las secciones nuevas y las cifras corregidas. La etapa *Optimización* sigue abierta. **Ola 3 definida**: P37.69 (extraer subcomponentes de los showcase, con su gate de diff de HTML) más los tres hallazgos del `design-review` —el atenuado sobre `--card` (Must), la capa de tabla y los dos hex fuera del guardián—, con estimación de un día.

## 38. La ola 3, primera mitad: el atenuado se hereda y las tablas dejan de escribirse a mano (2026-08-09)

Tercera y última ola del bloque de diseño, en `refactor/ola-3`. De sus cuatro tareas se cierran las dos primeras; quedan P37.659 y P37.69, y entra una quinta (ver el cierre).

**P37.6565 — el atenuado lo resuelve la superficie.** El incumplimiento que importaba de la ola anterior: `--muted-foreground` sobre `--card` daba **6,40 en oscuro** en las seis páginas. La regla que lo arregla ya existía —D30, del 2026-08-03— y ya estaba resuelta **dos veces por separado**: `--contact-dim` para la franja de contacto y un `color-mix` a mano dentro de la etiqueta neutra. Ninguna de las dos cubría `--card`.

Lo que cambia no es la regla sino **quién la aplica**: `text-muted-foreground` pasa a resolver al atenuado del fondo donde cae, porque cada superficie redefine `--surface-dim` (D39). **Cero call sites tocados** — los 141 usos heredan el arreglo, y una tarjeta nueva nace bien sin pedirlo. Es la forma concreta del objetivo declarado del bloque: que la accesibilidad se herede en vez de volver a medirse.

Medido en el DOM con el metro validado contra sus anclajes (13,79 / 15,32 exactos), seis páginas × dos temas: `background` 7,10/7,12 (sin cambio, es su fondo de calibración), **`card` 9,14/10,32** (era 7,53/**6,40**), `muted` 8,17/9,17 (el mismo píxel que ya publicaba la etiqueta neutra) y fondo invertido 10,32/9,89 (era 5,92/**4,33**, por debajo de AA — un par que ninguna auditoría había mirado).

**Lo que costó encontrar, y es lo reutilizable:** una regla enganchada a la **clase** no ve las superficies que un elemento se pinta a sí mismo. Cuatro velos translúcidos escritos a mano —el chip numerado de «Cómo trabajo», la fila cebra de tipografía, la sección del esqueleto y el panel de tokens invertido— eran esa misma superficie sin llevar su utilidad. De ahí `data-surface`. Es el tercer caso del mismo error de disparador, después del inventario de iconos y del censo de pares.

Tres cosas se retiran por consumir la fuente única: `--contact-dim`/`.contact-dim`, el `color-mix` propio de la etiqueta neutra y **el eje `tone` de `eyebrowVariants`** —`muted` y `band` pasaron a pintar igual—. La sección del Design System que documentaba ese eje enseña ahora el mecanismo que lo sustituye: el mismo rótulo, sin prop, sobre dos fondos distintos.

**P37.658 — capa de tabla.** Sexta capa del sistema (D40) y la última con la forma que tuvieron el botón, el chrome, la etiqueta y la cabecera. La tarea exigía responder antes la pregunta de D36 —¿cebra y filete significan cosas distintas?—, y la respuesta tardó **tres intentos**, que es lo interesante del episodio:

1. La hipótesis de partida («la cebra ayuda cuando hay muchas columnas») **no sobrevivió al inventario**: la «Tabla de uso» tiene cinco columnas y no la lleva.
2. Se buscó un eje mejor y se encontró uno bueno —**la forma de la fila**: un renglón de celdas frente a un bloque que se envuelve—, bajo el cual la cebra se quedaba y se le daba también a la tabla de Cabeceras.
3. **Francisco la miró en pantalla y no le cuadró.** Al medirla, el velo daba un salto de **ΔL\* 1,02 en claro** contra los 3,89 de la pastilla de hover, que es el escalón que el propio sitio usa como referencia de «esto se ve». No agrupaba filas: ponía un tinte bajo el umbral. Se borró de las dos.

> **La lección: un argumento de diseño bien construido sigue siendo una hipótesis hasta que se mide.** El de la forma de la fila era impecable en su razonamiento y falso en su premisa — daba por hecho que la banda se veía.

Y quitarla destapó dos cosas más, ninguna detectada por herramienta. La tabla de tipografía era **la única de las seis apoyada en el fondo de la página**: su contenedor era `PANEL` copiado a mano sin el `bg-card`, y el velo de las filas pares **fingía la superficie que faltaba**. Y apareció una **sexta tabla** que el inventario no contó —la de la política de cookies, con una cuarta definición de cabecera—: el inventario se hizo mirando el Design System y el Brand Kit, que son las páginas que documentan el sistema, y la que faltaba estaba en la que nadie asocia con diseño. Al migrarla se vio además que la capa recién escrita **la dejaba peor que como estaba** (su padding lateral de `--page-x` se comía un cuarto del ancho dentro de una columna de lectura), y eso solo se detectó comparándola con producción.

Las tres tablas de datos pasan a marcado real —`caption`, `th scope="col"`, `th scope="row"`, `colgroup`—, que no es cosmética: sin celdas atadas a su columna, la tabla de contraste se oye como una ristra de cifras sin saber cuál es el tema claro. **axe no lo marca**, porque un div no es una tabla rota: simplemente no es una tabla. Publicado como sección **(12) «Tablas»** del Design System; Accesibilidad pasa a (13) y Esqueleto a (14).

**El medidor falló dos veces antes que la página, y las dos se arreglaron.** Primero daba **1,09:1** al titular sobre la foto de Sobre mí —su peor hallazgo, y falso: comparaba el texto con el fondo de la página en vez de con la foto—; esos pares van ahora a `sinMedir`, separados pero no escondidos, con una comprobación **geométrica** (el primer intento miraba `background-image` en la cascada y fallaba en las dos direcciones). Y después resultó que **medía mientras la transición de tema aún corría**: llamarlo dos veces conmutando el tema —el uso que el propio archivo documenta— inventaba cuatro pares de 1,06 · 1,11 · 1,42 · 2,05 con la página perfecta, porque `.link-content` tarda 380ms y cualquier espera «prudente» de 400ms cae dentro. Ahora congela transiciones y animaciones antes de medir: no se espera más, se quita lo que había que esperar. Validado disparándolo contra el caso original.

**Estado al cerrar la sesión.** Cuatro commits en `refactor/ola-3`, sin mergear. Censo del DOM sin ningún par bajo AAA en home, Sobre mí, Design System, Accesibilidad y Cookies, en claro y oscuro.

**La ola 3 crece a tres tareas pendientes.** Al re-medir el Brand Kit se vio que **P37.657 se quedaba corta**: la abrió un solo par (`brand-purple-accent` a 3,69) y en la escalera del logo hay **cuatro** bajo AAA, incluidos **dos rótulos cian a 5,21 y 6,57** que la salvedad publicada no cubre. Francisco decidió (2026-08-09) **meterla en esta ola y arreglar el fondo en vez de matizar el texto** en los cuatro sitios donde el sitio afirma «AAA sin excepciones». Es la misma decisión que se tomó con el atenuado sobre `--card` — y aquella se cumplió: subió al día siguiente. **Caduca igual**: si la ola se alarga, hay que matizar. Orden restante: P37.657 → P37.659 → P37.69.

---

## 39. La ola 3, segunda mitad: el bloque cierra, y un diff limpio no es un diseño verificado (2026-08-10)

Cierre del bloque de diseño que abrió §35. Cinco tareas —P37.657, P37.659, P37.6595, P37.69 y una sexta que nació el mismo día, P37.695—, 11 commits y **`v1.6.0`** en producción.

**P37.657 — un color fijo no puede servir a dos superficies opuestas.** La tarea entró como «un rótulo del Brand Kit falla AA» y al medirla resultaron ser **dos problemas apilados en uno**. De los «cuatro pares incumpliendo» que el PRD daba por hecho, **solo uno lo era**: los otros tres eran los «Aa» de las muestras de color, de 24px y peso 600 —texto grande, donde AAA es 4,5 y no 7—, y dos cumplían de sobra. Los marcaba el censo por aplicar el umbral de texto normal a todo.

El que sí fallaba no se arreglaba eligiendo otro morado: el estándar daba **2,81** en claro, peor todavía. Ningún morado de esta marca puede ser texto pequeño sobre una tarjeta clara, así que el rótulo se **atenúa** en vez de teñirse. Y tirando de ese hilo cayó la excepción de fondo, que llevaba abierta desde que el token existe: la banda invertida se pinta sobre `--foreground`, que salta de carbón a hueso, y **un solo color contra las dos superficies topa en √13,79 = 3,71:1** — la media geométrica de sus contrastes. El valor de entonces (3,96/3,49) estaba **justo en ese óptimo**: no se eligió mal, se eligió lo mejor de un problema sin solución. Se resuelve haciendo que el token **conmute**, el patrón que `--primary-on-inverted` ya usaba y cuyo comentario en `globals.css` llevaba meses llamando a `brand-purple-accent` «su hermano, que existe por esta misma razón». Ahora **7,04 / 7,21** (D41). Con él cae la última excepción, y «todos los pares en AAA, sin excepciones» pasa a ser literal — la afirmación que §37 decidió **no matizar** apostando a que subiría en un día. Se cumplió.

**P37.659 — el guardián deja de comprobar las copias conocidas y pasa a comprobar que no hay copias.** Dos hex de token escritos a mano fuera de su alcance (el `themeColor` del layout, que Next exige literal, y una placa del Brand Kit). El arreglo que vale no era corregirlos sino cambiar la pregunta del check: **buscar VALORES, no patrones**. Un grep de `#rrggbb` con allowlist habría marcado los colores que el Brand Kit desvía a propósito; preguntar por el valor de cada token, no (D38 ampliado).

**P37.6595 — un umbral mal aplicado inventa hallazgos igual que un metro mal calibrado.** Es la lección que dejó P37.657, arreglada el mismo día. El censo puntuaba todo contra 7:1 sin mirar el tamaño del texto, así que su `bajoAAA` era una **lista de candidatos vendida como lista de incumplimientos**. Ahora cada fila lleva su `px`, su peso, su umbral y su holgura, y hay tres consecuencias que no son cosméticas: el umbral entra en la **clave de deduplicación** —si no, un texto grande enmascara a uno pequeño de los mismos colores, que es justo el que puede fallar—; el censo **se ordena por holgura** y no por ratio, porque con umbrales mixtos la cifra más baja ya no señala al peor par (7,10 a 13,6px aprieta más que 5,21 a 24px); y los pares sobre imagen dejan de llevar veredicto, porque su ratio nunca fue una medición.

De paso salió `window.freezeMotion()`: el congelado de transiciones que el censo hacía por dentro se extrae para poder usarlo **antes de `axe.run()`**. Medido: conmutar el tema y lanzar axe sin congelar da **7 violaciones fantasma** con la página perfecta; con él, 0. El mismo fallo que el censo documenta, en la otra herramienta.

**P37.69 — los showcase dejan de ser dos monolitos.** `design-system.tsx` (1.512 líneas) y `brand-kit.tsx` (1.280) pasan a ser carpetas con un archivo por sección: 29 archivos, ninguno por encima de 391. **La estructura se decidió antes de tocar código, y con una medición**: de los 13 subcomponentes auxiliares, **9 se usaban en una sola sección** — la sección ya era la unidad natural de agrupación, solo que no estaba escrita así. Se descartó «secciones como datos + renderer», que era la alternativa real y no una de paja: los cuerpos van de 21 a 299 líneas sin patrón común, así que cada `Body` acabaría siendo un componente por sección igualmente —no ahorra archivos, añade una capa— y el envoltorio que factoriza son cuatro líneas (D42).

**Y el gate, que es la mitad del trabajo.** Mover 2.800 líneas de markup no se verifica leyendo el diff ni con aserciones elegidas a mano: `scripts/showcase-html-diff.ts` captura el **HTML servido** de las cuatro variantes, lo normaliza y lo compara. Resultado: **sin cambios**. Y se validó **antes de fiarse de él**, contra una mutación de un solo carácter en una clase (`gap-4` → `gap-5`): sale con código 1 y señala la línea exacta. Es además la semilla del arnés de tests (P37.75), y la razón de no haberlo metido en esta ola: para este trabajo, un snapshot total es más fuerte que unas aserciones elegidas.

**P37.695 — las tres páginas abren igual.** La abrió Francisco navegando: Design System y Accesibilidad numeraban «(06) Claro y oscuro» mientras el Brand Kit ponía «02 — Logotipo / El logo y sus reglas». Al medirlo eran **cuatro** copias privadas de la cabecera numerada, no tres —la cuarta dentro de la isla de cliente, porque la sección 01 dibuja la suya ahí para que el toggle de rejilla quepa en la misma fila—, y **dos de las cuatro escribían a mano las clases de `section-sm`** en vez de usar la variante.

Y la diferencia no era de formato: era de **qué dice cada slot**. La forma del Brand Kit **es** el `SectionHeader` del sitio —el mismo par con el que abren la home y los cuatro heros—; las otras dos se habían inventado un slot de número monoespaciado que no existe en ningún otro sitio. El remate: el Design System **publica en su sección (11)** que «toda página y toda sección abren igual» y abría sus catorce de otra manera. La página que publica la regla era la que la incumplía, misma forma que D41.

Eso lo convierte en tarea de **contenido**: al subir el tema al rótulo, el titular queda vacío y hay que escribirlo. Son 19 titulares × 2 idiomas, pero **casi ninguno es nuevo** — la afirmación ya estaba escrita en la entradilla, en primera posición, y lo que se hace es promoverla; la entradilla se queda la elaboración. En doce de las diecinueve el cambio es exactamente ese corte.

**Lo que lo cerró de verdad fue una pregunta de Francisco: si queremos homogeneidad, ¿no deberían llevar entradilla todas?** El reparto medido le dio la razón —Brand Kit 6/6, Design System 12/14, y la propuesta inicial le quitaba una a Accesibilidad—, y de paso destapó que yo había contado mal: la entradilla de Conformidad existía, solo que bajo una clave llamada `note` mientras sus cuatro hermanas se llamaban `intro`. **Era la única que no se llamaba igual haciendo lo mismo, y por eso se contó mal.** Ahora las 19 la llevan, y las tres que faltaban salieron de material que ya existía: la de Breakpoints estaba escrita **al pie** de la sección —una nota a lo que ya habías leído, en vez de la frase que te prepara para leerlo— y sube a su sitio; Movimiento, la única sección del sitio sin prosa de ningún tipo, estrena una que presenta su tabla de duraciones; y la de Límites era **una sola frase** que era justo el mejor titular de la página.

**La lección de método de la ola, y es nueva: un diff limpio no es un diseño verificado.** Al morir `SectionHead` se fue con él el `mb-4` de su envoltorio, y los 19 titulares quedaron **pegados a su entradilla — 0px donde había 16**. El cambio **estaba en el diff de HTML** y aun así pasó por bueno, porque un envoltorio que se borra es exactamente lo que ese refactor debía hacer. Lo cazó medirlo en pantalla. Y el último defecto de la ola lo encontró Francisco igual, en el Preview: el glifo del favicon de 16px se salía del marco porque `Glyph` envolvía un `Logo` `inline-flex` en un `display:block`, o sea una caja **en línea** que no rellena su hueco sino que se apoya en la línea de texto — cuya altura la manda el `line-height` heredado, 24px. Por encima de 24px no se nota; a 10px, la línea gana.

**Estado al cerrar.** **`v1.6.0`** en producción (PR #91, rebase de 11 commits), verificada sirviendo el copy nuevo. Censo con el metro validado contra sus anclajes y axe con las transiciones congeladas: **0 pares bajo AA, 0 bajo AAA y 0 violaciones** en home, Design System, Brand Kit y Accesibilidad, ES y EN, claro y oscuro. **El bloque de diseño queda cerrado**: tres olas, `v1.4.1` → `v1.5.0` → `v1.6.0`, con su objetivo cumplido —hoy una tarjeta nueva nace con su atenuado correcto, una tabla con marcado real y una sección con la cabecera del sistema, sin que nadie lo pida—. La etapa *Optimización* sigue abierta. Lo siguiente es el **deep-dive por experiencia** (P37.71 / P37.72), que era el motivo de haber saldado esta deuda antes: publica su variante nueva contra un archivo legible en vez de contra un monolito de 1.500 líneas.

Queda anotada una deuda a propósito (**P37.697**): los 16px de hueco titular→entradilla los escriben hoy 19 call sites y deberían salir de un `LEAD_GAP` en la capa de cabecera, usando el slot `children` de `SectionHeader` que hoy no usa nadie.

---

## 40. Tres sprints de valor: la replanificación tras cerrar el bloque de diseño (2026-08-10)

Cerrado el bloque de diseño, Francisco planteó volver a construir valor para el visitante con tres desarrollos —**deep-dive por experiencia, footer estructurado y contacto ampliada**—, cada uno con su subida a producción y arrastrando deuda técnica «ya que pasamos». Aportó además un lote de hallazgos de auditores externos (Semrush, PageSpeed, validadores del W3C, Code Quality Check, GetWCAG) y una lista de ideas por página.

**De los ~11 hallazgos externos, cinco eran reales y seis ruido**, y separarlos fue la mitad del valor de la sesión. Reales: **falta el skip link** (WCAG 2.4.1, **nivel A** — el único de ese nivel que tenía el sitio, y en la web que publica una página de conformidad AA), `<div>` y `<p>` dentro de `<label>` en el banner de consentimiento, `poweredByHeader` sin desactivar, dos `catch(e){}` con el binding sin usar, y el mailto sin asunto junto a una fecha de verificación hardcodeada desde el primer día. Ruido: los 79 «errores» del validador CSS del W3C son `@property` y `--tw-gradient-*` —spec de CSS que el validador no implementa, output normal de Tailwind v4—; el trailing slash lo emite React y es nivel *Info*; «imágenes sin alt» y «enlaces sin texto» son falsos, verificados uno a uno; el asset sin comprimir es de Vercel; y la relación texto-HTML no es una métrica que Google use.

**El caso más instructivo fue el de `fetchPriority`, porque Francisco desconfió del aviso antes que yo.** PageSpeed insistía en él y su reacción fue «me extraña que falle en esto». Tenía razón: `priority` **sí** estaba aplicado. Los 2090 ms del LCP eran *element render delay*, no descarga — el hero lleva `data-reveal`, `reveal-root` añade `reveal-on` **en `useEffect`**, y la foto **ya pintada se oculta al hidratar** para volver con una transición de 600 ms. Se estaba pagando la métrica principal de rendimiento por una animación decorativa. **La lección, que es la cuarta de su familia: un hallazgo puede ser real y su diagnóstico falso.** Se anotó una tarea para documentar el ruido conocido, porque sin eso la próxima auditoría lo reabre entero.

**El hallazgo que cambió el plan: el deep-dive no estaba bloqueado por contenido.** Su tarea decía desde julio que se alimenta «del bloque `cv` del diccionario» — y **ese bloque no existe**. Pero el contenido sí: `scripts/cv/content.{es,en}.ts` tiene las experiencias con `context`, `reporting` y **27 bullets con métricas**, en ES y EN, y la cabecera del propio archivo llevaba meses anunciándolo («es también el origen del futuro deep-dive por experiencia»). Lo que faltaba no era escribir: era **sacar el contenido de `scripts/`**, porque `app/` no puede importar de ahí. Una tarea que estaba archivada como «Could» suelto pasó a ser el primer paso del sprint.

**El orden propuesto no sobrevivió a las dependencias, y las dependencias ya estaban escritas en el propio tablero.** El *footer estructurado* llevaba su condición en el nombre —«cuando existan más secciones»— y hoy no se cumple: cuatro enlaces y nada más que enlazar; son el deep-dive y el artículo los que crean las secciones, así que **el footer va el último, no el segundo**. *Contacto ampliada* era una tarea de investigación, y una investigación no produce despliegue: se amplió a definir + construir, con su definición arrancando ya en el carril de contenido. Y **P37.70 (el helper de página) decía literalmente por qué iba antes**: «el deep-dive añade páginas, y un hreflang mal copiado no lo detecta el typecheck, ni el linter, ni axe — solo Google, tarde». Aparecieron dos prerequisitos más: `TrayRow` no tiene `slug` ni logo propio —los logos son arrays posicionales mapeados por índice, así que reordenar una experiencia los desalinea **en silencio**— y la tarea de partir el diccionario traía escrito su umbral de disparo, «cuando entre el deep-dive».

**Entró un cuarto trabajo que no estaba en los tres: el artículo «Cómo se ha creado esta página».** Para el objetivo declarado del proyecto es la pieza de más valor de toda la lista — el PRD §1 dice que la web es «la prueba de criterio técnico y de diseño», y hoy esa prueba enseña el *resultado* (Design System, Brand Kit, Accesibilidad) mientras el artículo enseñaría el *proceso*, que es lo que un CPO evalúa. Francisco lo acotó bien: **de momento solo el índice y la estructura, y no es un blog**. Se colocó como sprint 2, por delante de footer y contacto.

**Decisiones de alcance fijadas.** Deep-dive = **seis experiencias, solo las de producto**; las dos de Marketing & Growth se quedan en Trayectoria porque un deep-dive ahí diluye el orden del posicionamiento (§3). URLs `/trayectoria/[slug]` + índice, con el EN en `/en/trayectoria/[slug]` — **el sitio no traduce segmentos de ruta**, y los slugs son nombres de empresa, neutros al idioma, así que los pares hreflang salen gratis. Sprint 1 se parte en **dos despliegues** porque el andamiaje vale por sí solo y no debe esperar al contenido. Y sobre la idea de declarar alineación con la **Ley Europea de Accesibilidad**: la Directiva (UE) 2019/882 aplica a productos y servicios **comerciales**, no a una web personal, así que «conforme a la EAA» sería un error de categoría ante justo el público que sabría detectarlo; lo honesto —y lo que demuestra criterio— es «alineada con los criterios de **EN 301 549**». Igual con los lectores de pantalla: **se prueba con NVDA y luego se publica**, nunca al revés.

**El tablero se reestructuró entero.** El eje `Etapa` había degenerado —16 de 20 tareas abiertas en «Optimización»— y pasa a contestar una sola pregunta: ¿comprometido o esperando? Sprints (*Deep-dive · Cómo se ha creado · Footer y contacto*) y bloques (*General · Home · Brand Kit · Design System · Accesibilidad*), con la regla de que **una tarea de deuda nace en su bloque y cambia de etapa al sprint cuando se compromete**. Renumeración completa del bloque abierto (40s/55s/65s/70s), permitida porque era una reestructuración completa. Quedan **37 tareas abiertas**: 20 reasignadas —varias con correcciones de fondo, no solo de campo— y 17 nuevas.

**Y el corte de versiones cambió a última hora, a petición de Francisco:** V2 termina en el footer estructurado; todo lo demás hasta la IA conversacional es **V3**; y la IA conversacional pasa a **V4**. Eso redefine qué significaba V3 —hasta hoy, «la IA conversacional»— y arrastra con ella la CSP estricta con nonces, que en `PRD-Live.md` §5 iba atada a esa versión. Se anotó su condición de adelanto: si la página de Contacto incorpora un formulario, entra un endpoint externo y la CSP hay que revisarla entonces.

**Estado al cerrar.** Sin cambios de código: la sesión fue de análisis y planificación. `main` sigue en `v1.6.0`.

---

## 41. El andamiaje del deep-dive: lo que se construye antes de tener nada que enseñar (2026-08-10)

**Primer despliegue del sprint 1**, el que el plan de §40 separó a propósito del contenido:
nueve tareas (P40→P46.5) y una décima que apareció midiendo, todas en producción en un solo
merge. Ninguna añade una sección visible, y ese es el punto: **son las siete páginas del
deep-dive las que se benefician, y todavía no existen.** El detalle técnico está en
`DECISIONS.md` D44–D49; aquí queda lo que es de producto.

**Los dos cambios que un visitante nota.** El primero: **el primer pliegue ya no entra con
animación**. El fade-up de la home ocultaba la foto del hero DESPUÉS de haberla pintado, para
devolverla con una transición de 600 ms, y el LCP se registra en el primer frame con opacidad
mayor que cero — o sea que la métrica principal de rendimiento la pagaba una animación
decorativa: **2.090 ms de «retraso de renderizado»** sobre un LCP en el que la red aportaba 50.
No hay forma de conservar las dos cosas: un elemento que empieza en `opacity: 0` retrasa el LCP
por definición. Y al mirarlo de cerca, la regla del propio proyecto ya lo decía —*«una vez al
**entrar** en viewport»*—: lo que ya estaba ahí al cargar no ha entrado. El segundo: **la 404
minimalista desaparece**. Había dos —una mínima sin nav y otra rica con el «0» del split, Nav y
Footer— y resultó que la mínima costaba que **las seis páginas del sitio se renderizaran en cada
petición** en vez de servirse estáticas, por un `headers()` que leía el idioma. Se borró: ahora
siempre sale la buena, y de regalo el build estático emite los preloads de las fuentes que el
dinámico no emitía.

**Lo que cambia para el trabajo que viene, que es el motivo de todo.** Una página del sitio ya
no se escribe: se compone. El canonical, los tres `hreflang`, el Open Graph y el marco entero
salen de una sola fuente, y el `<main>` con su enlace de salto lo pone la capa — así que las
siete páginas del deep-dive **nacen con el SEO correcto, accesibles y estáticas sin que nadie
tenga que acordarse**. Es la diferencia entre una regla escrita y una regla que se cumple sola,
que es la distinción que este proyecto lleva persiguiendo desde la ola de diseño.

**Se cerró el único incumplimiento de nivel A que tenía el sitio** —faltaba el enlace de salto
(WCAG 2.4.1)— y merece nota porque **ninguna de las tres auditorías anteriores lo vio**: axe no
lo detecta, su regla `bypass` se da por satisfecha con landmarks o encabezados, y el sitio los
tiene. Lo encontró un validador genérico. En una web que publica una página de conformidad con
cifras medidas, el hueco no era la falta en sí, sino que **el checklist que el propio sitio
publica tiene ocho puntos y ninguno es ese** — corregirlo es copy en ES y EN y queda tareado.

**Y ahora se mide sin pedir favores.** `npm run psi` trae PageSpeed a la terminal con el
desglose del LCP, no solo la nota: el resultado en producción es **100/100 en escritorio** y
móvil por debajo, con el objetivo del PRD (>90 en las dos) cumplido. Se decidió **no** meterlo
como puerta de CI: dos ejecuciones seguidas dieron 96 y 94, y un gate en el que no se confía se
acaba ignorando.

**Del contenido, lo que sí avanzó.** Se entregó el **borrador editable del deep-dive** —la
plantilla de seis piezas, un borrador en prosa por experiencia y tres diagramas propuestos—, con
los huecos marcados en dos colores: lo que solo puede escribir Francisco y lo que se dedujo del
CV y hay que confirmar. La recomendación de alcance: **tres a fondo** (Emendu, INDYA, TheTool) y
tres sostenidas por la base del CV, porque seis narrativas largas son el cuello de botella real
del sprint.

**Estado al cerrar.** Catorce commits en `main`, uno por tarea, desplegados. **Cinco tareas
nuevas** salieron del trabajo y quedaron abiertas con su verificación hecha: el checklist
publicado sin el bypass, el segundo de retraso de renderizado que el arreglo no se llevó, el
gate de formato que no mira `scripts/`, la sección 14 del Design System fuera de la capa, y —ya
cerrada— la de medición. El sprint sigue abierto: **el contenido es lo único que queda entre el
andamiaje y las seis páginas.**

---

## 42. El deep-dive baja de ocho secciones a cinco, y aparece una línea de discreción (2026-08-15)

El formato de ocho secciones se había cerrado el 11-ago escribiendo Emendu, que era la
prueba. Escribir INDYA con él —y releer KUOTIP, que ya estaba redactada— destapó que el
problema no era de redacción sino **de forma**, y por tres motivos distintos:

1. **Las páginas no se parecen entre sí, y no por estilo: por recorrido y por memoria.**
   Emendu son cinco años de detalle fresco; Freepik, tres meses de hace cuatro años. Con ocho
   secciones fijas, esa diferencia se convierte en secciones medio vacías — que es peor que
   no tenerlas. KUOTIP tenía dos.
2. **Se estaban haciendo muy largas.** Emendu pasaba de 1.900 palabras. Eso ya no es una
   página de portfolio, es un documento, y el lector al que va dirigida no lo termina.
3. **Una sección fija obliga a contestar.** «Cómo terminó» pregunta por qué saliste de cada
   sitio, y hay salidas que se cuentan en una entrevista y no por escrito. Con la sección
   fija, la única salida era mentir o dejarla coja.

**La estructura pasa a cinco:** Datos · En un minuto · La historia · El caso (opcional) ·
Aprendizajes. «El objetivo», «Cómo trabajé» y «Cómo terminó» dejan de ser secciones y bajan a
**subapartado de La historia cuando en esa experiencia sean lo interesante**, sin aparecer
cuando no lo sean.

**Lo que cambia de fondo es de dónde viene la homogeneidad.** Antes la daban las secciones
—las seis páginas con los mismos ocho títulos—; ahora la dan **el marco y la longitud**
(mismas cinco secciones, mismo presupuesto de palabras, mismo número de cifras) y dentro de
La historia cada experiencia cuenta lo que tiene. Es lo que permite que un deep-dive de tres
meses y uno de cinco años se lean como la misma serie sin que el corto parezca incompleto.

**Dos reglas cambian y cuatro nacen.** La de las cifras pasa de «una por bullet» a **dos o
tres en toda la sección, cuando corresponda** —suelo y techo iguales, para que una
experiencia antigua no parezca floja cuando solo es antigua—, y la que separaba método de
cronología se retira con las secciones. Nacen: **el final no es una sección, aparece solo si
enseña algo** (el de KUOTIP —«nos dimos un año, no llegó la tracción, fuimos fieles a lo
acordado»— es el mejor párrafo de su página); **una cifra de volumen no es una cifra de
comportamiento**; y un **presupuesto de 700-900 palabras, 1.200 con caso**, porque la
estructura sola no acorta nada.

**Y la cuarta es la que tiene alcance más allá del deep-dive: la línea de discreción.** Lo
que se cuenta en una entrevista —motivos de salida, problemas internos, límites del equipo o
del servicio— no se escribe en una página pública: una conversación tiene contexto, matiz y
un interlocutor que pregunta, y la página no tiene ninguna de las tres. **Y no vale aparcarlo
en «ya lo contará el bot»**: el agente conversacional de V4 también publica, y además
responde sin Francisco delante y en frases que no puede revisar. Lo que V4 absorbe es
**profundidad sobre lo que ya es público**, no discreción — lo que acota su corpus antes de
que exista.

Esa regla se aplicó el mismo día a una de las páginas, y su efecto es la regla del anclaje
funcionando al revés: al retirar de La historia un pasaje que la discreción no dejaba
publicar, **cayó también el aprendizaje que dependía de él**, porque ya no podía señalar a
nada escrito arriba. La página se queda con tres, que es lo que la regla pide.

*(Ni el pasaje ni el aprendizaje se transcriben aquí, y hasta el 2026-08-19 sí lo estaban. Se
corrigió auditando el repo antes de hacerlo público, y la razón es la propia regla llevada un
paso más allá: **un documento que registra qué se retiró por discreción lo vuelve a
publicar**. La lección de método —al caer un anclaje, cae lo que colgaba de él— se entiende
igual sin el contenido retirado.)*

Se reescribieron **las tres primeras experiencias** con el formato nuevo (Emendu 1.190
palabras, KUOTIP 760, INDYA 1.150), elegidas para marcar el rango: dos con caso y una sin él,
una de cinco años y una de diez meses. Las otras tres no se escriben hasta que el formato
esté validado sobre esas.

---

## 43. El vídeo no va dentro de la página, y por qué eso es una decisión de producto (2026-08-16)

> **Afinado el mismo día en §44: la regla es sobre el vídeo-RESUMEN, no sobre todo vídeo.**
> Un clip de terceros que funciona como **prueba dentro de la narración** —el anuncio de la
> entrada de Pau Gasol, en INDYA— sí va incrustado. Lo que sigue explica por qué un
> vídeo-resumen no, y el criterio que separa los dos casos es **qué trabajo hace el vídeo en
> la página**: si sustituye la lectura, fuera; si la respalda, dentro.

Al evaluar herramientas externas (el criterio y la lista completa, en `DECISIONS.md` D51)
apareció una idea de Francisco que no era de herramienta sino de producto: **cuando los
deep-dive estén escritos, montar un vídeo con ese contenido y la marca del sitio —colores,
tipografías—, como forma rápida de entenderlos y de fomentar su lectura.**

**El matiz que decide dónde vive.** Dentro de la página, un vídeo **no fomenta la lectura:
la sustituye**. Nadie ve noventa segundos y después lee novecientas palabras. Y competiría
con una pieza que ya está diseñada para ese trabajo exacto: **«En un minuto»**, la segunda de
las cinco secciones de cada deep-dive (§42). Como texto gana en todo lo que aquí importa —se
escanea, y el lector de 5-10 segundos de §2 **no puede escanear un vídeo**; lo indexa Google;
existe en ES y EN; es accesible; y cuesta cero LCP—.

**Fuera del sitio, en cambio, hace exactamente lo que se le pide:** aparece en un feed, se
reproduce solo, tiene alcance y **manda tráfico al deep-dive**. Eso sí es fomentar la
lectura. Así que la idea es buena y su casa es **LinkedIn**, no `/trayectoria/[slug]`.

Es la casilla que el PRD deja como «marca externa, fuera de alcance y sin versión» — y
resulta ser, de todo lo evaluado ese día, lo que más rendimiento daría por hora invertida,
porque **sirve al objetivo declarado en §1 (facilitar el cambio de trabajo) sin tocar la
arquitectura del sitio**: no paga LCP, ni tema, ni reduced-motion, ni accesibilidad de
página.

**Y por lo mismo, el vídeo queda descartado para animar las ilustraciones conceptuales.** Un
MP4 no conmuta con el tema —el sitio entero lo hace—, no responde a `prefers-reduced-motion`
—punto 7 del checklist, no negociable— y no es scrubable. Sería un retroceso en las tres
propiedades que el sitio protege. Para eso la respuesta es CSS.

**La herramienta, si llega, es Remotion**, y por una razón que es del proyecto y no del
mercado: importaría el mismo `EXPERIENCES` de `content/experiences.ts` del que ya beben la
web y el CV, de modo que el vídeo sería el **tercer artefacto generado desde la misma
fuente** — el patrón de D22, D38 y D44. Su render parametrizado (una composición × seis
juegos de props) hace además que seis vídeos cuesten casi lo mismo que uno. Se descartó
HyperFrames: reusa el CSS del sitio pero no sus **datos**.

**La decisión con fecha de caducidad, tomada el mismo día.** Si «En un minuto» se escribiera
con restricción de guion —unas 60-80 palabras, una métrica dura, un cierre que funcione dicho
en voz alta—, el vídeo saldría casi gratis después. **Francisco decidió escribirlo libre**,
sin condicionar el copy de la página por una pieza que quizá no se haga. Coste asumido y
explícito: si el vídeo llega, habrá que derivar seis guiones de los seis textos.

---

## 44. Las cinco narrativas escritas, y tres cosas que solo se ven escribiéndolas (2026-08-16)

Francisco escribió en bruto Freepik y TheTool —las dos que faltaban— y retocó las tres ya
reescritas. De la pasada de orden, jerarquía y redacción salieron las cinco narrativas en
español: **Emendu ~1.160 y TheTool ~1.200 con caso, INDYA ~1.150 con caso, KUOTIP ~760 y
Freepik ~710 sin él.** El formato de §42 aguanta el rango entero y ninguna se lee como
versión incompleta de otra, que era la prueba que se le pedía.

Lo que sigue son las tres cosas que **no se podían decidir en el documento de formato**,
porque solo aparecen al aplicarlo.

**PICKASO se queda sin página, y la razón es de contenido, no de alcance.** Francisco
simplemente no la escribió, «porque forma parte de la historia de TheTool», y al redactar
TheTool quedó demostrado: la agencia es su primer capítulo —la que necesitaba una
herramienta que no existía y la que financió construirla—, y el rol de profesionalizarla
está dentro de esa narrativa desde el segundo párrafo. Una página propia habría tenido que
empezar explicando por qué existe. El deep-dive pasa de **seis páginas a cinco**, con dos
consecuencias que se asumen: dos de los tres bullets del CV de PICKASO se quedan sin sitio
donde ampliarse, y en Trayectoria el bloque **Shutapp Projects** —que agrupa los dos roles—
tendrá una fila que enlaza y otra que no, un caso que el diseño del índice aún no ha visto.

*Ejecutado ese mismo día (P47.7), y el coste asumido resultó ser **la mitad** del que se había
escrito.* Al mirar los bullets uno a uno, **solo uno estaba huérfano de verdad**: el primero
—profesionalizar la agencia— ya estaba dentro de la narrativa desde el segundo párrafo, y el
tercero —la base de conocimiento de mercado— estaba cubierto en esencia por el discovery de
cuatro entradas, aunque sin las palabras «investigación de sus futuros competidores». El que
no estaba en ningún sitio era el segundo, reposicionar marca y propuesta de valor. Se resolvió
con **18 palabras** dentro de la frase que ya existía, y la página quedó en ~1.220: dentro del
techo redondeado y **sin margen** para lo siguiente. *Un coste estimado sin desglosar se
sobrestima igual que se subestima* — es la misma familia que el metro descalibrado del
presupuesto de palabras, tres párrafos más abajo, y las dos aparecieron el mismo día. La otra
consecuencia sigue abierta **a propósito y con destino**: no se puede mirar en pantalla porque
el campo `slug` aún no tiene ningún consumidor, así que se hereda al diseño (P48), anotada en
su tarea y en el propio comentario del campo para que no dependa de acordarse.

**§43 se afina: un vídeo sí puede ir dentro de una página, si es prueba y no resumen.** El
día anterior se había decidido que el vídeo vive fuera del sitio. Al llegar a la entrada de
Pau Gasol en el accionariado de INDYA, Francisco pidió incrustarlo, y tiene razón sin que la
regla de §43 se caiga: **lo que §43 descarta es un vídeo-resumen del deep-dive**, que
*sustituye* la lectura y compite con «En un minuto», la pieza diseñada para ese trabajo
exacto. Un clip de terceros dentro de la narración hace lo contrario — es **evidencia**,
dura segundos de atención y no sustituye a nada. La distinción no es el formato, es **qué
trabajo hace el vídeo en la página**. El coste sí es real y convierte a INDYA en la única de
las cinco con trabajo técnico propio: `frame-src` a `youtube-nocookie.com` (primera
ampliación de la CSP desde Clarity, D32, con su mismo criterio de allowlist mínima), facade
de póster + play para no pagar cientos de KB antes de que nadie pulse, gate de
consentimiento y línea en la política de cookies (D18), y `title` en el iframe.

**El presupuesto de palabras se estaba midiendo con dos metros distintos.** La regla 11 de
§42 fija 700-900 palabras, 1.200 con caso. Al escribir TheTool, el conteo daba 1.466 y la
página parecía incumplir por un 22% — así que había que amputarla. Antes de recortar se
validó el metro contra **INDYA, una página ya dada por buena**: etiquetada «~1.150», mide
**1.401** con `wc -w`. Las etiquetas cuentan prosa; `wc` cuenta también viñetas, títulos y
marcas de markdown, y la diferencia es sistemática (~18%). En la escala de las etiquetas,
TheTool estaba **justo en el techo**, no por encima. *Un techo comparado contra una escala
que no es la suya inventa un incumplimiento igual que un metro descalibrado* — es la misma
lección que `BRAND.md` §Accesibilidad lleva escrita para el contraste, los iconos y el censo
de pares, apareciendo por primera vez **fuera del color**. Y su coste concreto habría sido
tirar prosa buena para cumplir un número que ya se cumplía.

**Una asimetría que se deja escrita a propósito.** El 38% del hub de herramientas de Emendu
se queda **solo en el CV**: subirlo a «En un minuto» dejaba la sección en cuatro cifras
(regla 2 pide dos o tres) y bajarlo a un párrafo lo dejaba apareciendo una vez y de pasada
(regla 5). No es drift con el −24% del caso —son dos medidas de dos cosas: tiempo manual en
la operativa frente a lo que ahorra el hub en reports, informes y propuestas—, y por eso se
anota aquí en vez de «corregirse».

**Cerrado también un dato que llevaba mal en producción:** KUOTIP termina en **diciembre** de
2024, no en noviembre. El inglés además escribía «Nov», que es la misma abreviatura en los dos
idiomas — por eso la discrepancia era invisible al revisar la traducción. Una fecha que se
escribe igual en ES y EN es una fecha que nadie revisa.

---

---

## 45. La plantilla del deep-dive, y un artefacto que no se recrea (2026-08-17)

Primera sesión de **diseño en código** del deep-dive (P48). Las cinco páginas están montadas y
servidas en local —diez variantes contando idiomas, todas prerenderizadas—, con las cinco
narrativas traídas de Notion al diccionario y escritas también en inglés. Lo técnico está en
`DECISIONS.md` D53 y D54; aquí queda lo que es de producto.

**La apertura no lleva imagen, y el h1 no es el nombre de la empresa.** Se eligió apertura
tipográfica —rótulo con empresa y sector, titular con **la afirmación de la experiencia**, y los
cinco Datos debajo— por tres razones que se sostienen juntas: el nombre ya está en el rótulo, en
el breadcrumb y en el título del navegador, así que gastarle el h1 sería repetirlo tres veces;
sin foto la apertura no paga LCP; y **escala a cinco páginas sin que ninguna pese más que otra**,
que con el logo de cada empresa no pasaba —Freepik y KUOTIP no pesan igual— y es justo lo que §42
evita.

**El cuerpo va a ancho de contenedor, no a la medida de lectura.** Lo corrigió Francisco viendo
la primera versión servida: `PROSE` ocupa el 52% del ancho y a lo largo de una página entera no
se lee como columna de lectura, se lee como media página vacía, y además alarga el scroll. La
media columna queda como tratamiento de **entradas y cierres**. Coste medido y aceptado a
sabiendas: **150-160 caracteres por línea** a 1536px, frente a los ~91 para los que está
calibrado `--measure`. Queda tareado decidir si se acota.

**«En un minuto» sobre superficie propia: probado y descartado.** El argumento a favor era bueno
sobre el papel —es la sección escrita para el lector de 5-10 segundos de §2, así que una caja
propia diría en el diseño lo que ya dice el contenido— y en pantalla no funcionó: a ancho de
contenedor la caja sale mucho más ancha que alta y deja de leerse como tarjeta. Queda anotado en
el componente para que no se reproponga como idea nueva.

**Cada página cierra con el paso a la anterior y la siguiente**, con el mismo formato que el
cierre de Brand Kit, Design System y Accesibilidad — y con la misma pieza, no con una copia que
se le parezca. Detalle en D53.

**Y la decisión de la sesión: un artefacto se enseña, no se recrea.** El primer intento fue
dibujar el diagrama de estados a mano con los tokens del sitio: quedaba integrado, conmutaba con
el tema y **estaba mal**. Francisco lo cerró en una frase — *«si un CPO ve esto, no ve mi
trabajo»*. Un redibujo cumple la letra de la política de artefactos (SVG en línea, pocos nodos) y
**incumple su espíritu**, que la propia política dice en su primera línea: *reales, no
ilustraciones del método*. Se publica el render real de Mermaid del diagrama que Francisco
escribió para el equipo de desarrollo, saneado para que no pida nada a terceros y conmute con el
tema.

De ahí salen tres reglas de contenido que valen para las otras cuatro páginas:

1. **El techo de ocho nodos se rompe a propósito.** Se fijó antes de que nadie hubiera visto un
   artefacto real, y protegía la legibilidad; a un mapa de módulo lo que lo hace legible es
   **estar agrupado**, no tener pocos nodos.
2. **El artefacto no se traduce.** En la página inglesa sale el diagrama en español, como se
   entregó. Traducirlo lo convertiría en una recreación. Sí van en los dos idiomas su título, su
   pie y la alternativa en prosa.
3. **La línea de discreción se aplica también a los artefactos, y ahí sube el listón.** El
   diagrama vive dentro de un documento interno cuyo resto **no es publicable**: hay material de
   negocio y hay personas con nombre. Nada de eso sale en la página, que se queda con la
   estructura de un módulo. Pero deja claro que el «permiso de publicación» que P48.7 tenía
   abierto para las métricas ya no es solo de métricas. *(La enumeración de qué contenía ese
   documento se retiró el 2026-08-19, al auditar el repo antes de hacerlo público: describir el
   material reservado es una manera de publicarlo.)*

**Lo que queda abierto al cerrar la sesión**, y es lo que le da forma a la siguiente: los
artefactos de las otras cuatro experiencias —solo Emendu tiene el suyo—; los **titulares de
sección y los h1**, que son copy derivado de las narrativas y necesitan el visto bueno de
Francisco; la **captura del lowfi navegable**, que es el artefacto más elocuente para un CPO y
el que más permiso necesita porque es trabajo interno de Emendu; y el
**peso**, que sube a 229 KB de HTML en la página de Emendu —unos 62 son el SVG— y hay que medir
con PSI antes de dar la sección por cerrada.

**Dos cosas que el método cazó y que valen como registro.** El gate de accesibilidad, en su
primer disparo *mientras se dibuja*, tumbó una afirmación escrita en el propio código: que sin
banda dimensionada por `vw` el modo de fallo de D50 desaparecía. No desaparece — **el eje nunca
fue `vw`, era el alto**, y una apertura tipográfica tiene su propia forma de crecer: a 1280×618
los Datos de Emendu se salían 21,55px por debajo del borde. Y el gate de HTML marcó un cambio
que «daba igual» y no daba igual. *Las dos puertas encontraron algo que ninguna revisión de
código habría visto.*

---

## 46. La primera pasada de Francisco sobre las cinco páginas montadas (2026-08-17)

Sesión de revisión con las páginas servidas delante. Cinco tandas de ajustes, y **tres de ellas
destaparon algo que no era lo que se pedía**.

**Los tres titulares.** KUOTIP, INDYA y Freepik cambian de h1 —«La oportunidad perdida de cambiar
una industria», «Cambiando la nutrición deportiva desde producto», «Gran empresa, mal momento»—.
Los tres anteriores cumplían la regla (el h1 es la afirmación de la experiencia, no el nombre de
la empresa) y aun así decían menos. De paso quedó a la vista una asimetría que **no se toca**: en
«En un minuto», Emendu/KUOTIP/INDYA titulan con la *misión* y Freepik/TheTool con la
*descripción*; y cuatro de los cinco Aprendizajes usan la construcción «N cosas que me llevo de
X». Se señaló y Francisco decidió dejarlo — es cadencia de una sección que se repite, no drift.

**El artefacto no conmutaba, y la decisión que lo publicaba lo daba por resuelto.** D54 afirmaba
que el traductor remapea la paleta fija a tokens. Era cierto para los hex largos de Mermaid y
falso para el residuo: quedaban 17 declaraciones literales y **cinco rectángulos blancos** que en
tema oscuro dejaban el diagrama con pinta de captura pegada sobre la página. *Una decisión escrita
no es una verificación*: lo encontró mirar la página en oscuro, no releer el ADR. El arreglo no
fue ampliar la lista de colores conocidos —eso arregla este archivo y no el siguiente— sino un
guardián que comprueba la **ausencia** de literales (D54, ampliación).

**Y el vídeo, que era una petición de contenido y salió con letra pequeña.** §43 ya había decidido
que un vídeo entra si es prueba y no resumen, y con qué condiciones. Entran dos —Pau Gasol en el
accionariado de INDYA, y el vídeo de producto de TheTool— con facade, póster auto-hospedado, CSP
propia y sección nueva en la política de cookies. El gate de consentimiento se resolvió con
**click-to-load** en vez de colgarlo de una categoría: antes del clic no hay nada que consentir, y
así **ni siquiera quien acepta todas las cookies carga YouTube sin pulsar**. Detalle en D55.

**Lo que encontró comprobarlo en pantalla, que es lo que justifica el método.** El disco de play
**desaparecía** sobre el póster de TheTool —su teal de marca es casi el cian del sitio—: 2,81 en
oscuro y 2,59 en claro, por debajo del 3:1 de WCAG 1.4.11. No lo ve axe, que no evalúa contraste
de gráficos; no lo ve el typecheck; no lo ve `gate:html`, que compara marcado. **Es el cuarto
hueco de la misma familia que el sitio se ha encontrado** —tras el atenuado sobre `--card`, el
escalado de Windows y el alto del pliegue—: *un problema que ninguna puerta automática mira,
porque todas miran otra cosa.*

Y dos correcciones de método dentro de esa misma medición, las dos por el metro y no por el
criterio: un modelo aritmético que daba 3,56 donde la pantalla daba 2,81, y un muestreo del anillo
que caía sobre el triángulo y devolvía un `1,01` imposible. Las cifras publicadas son las de los
píxeles pintados. *El porqué fechado, en `BRAND-historical.md`.*

**Estado al cerrar.** P48 sigue **en progreso**. Lo hecho: los tres titulares, KUOTIP con su
captura, INDYA y TheTool con su vídeo, los tres `reporting` que envolvían, el enlace de Gasol que
sacaba asteriscos (límite conocido de `Rich`, D23) y el traductor con guardián. Lo que falta es
de Francisco o va detrás de su visto bueno: los **artefactos de las otras cuatro**, el **gate de
accesibilidad** sobre las seis URLs × dos temas, `npm run psi` por el peso de Emendu, las dos
filas de «Shutapp Projects» en Trayectoria y la pasada de erratas y del EN contra el ES.

## 47. El cierre del deep-dive: cuatro ajustes en pantalla y tres metros descalibrados (2026-08-17)

Segunda sesión con las cinco páginas servidas delante. **P48 se cierra**, y lo que la cerró no fue
escribir más código sino mirar.

**Los cuatro ajustes, y ninguno se vio leyendo el diff.** La apertura no ocupaba el pliegue, así
que en cualquier pantalla por encima de ~700px de alto asomaba la sección siguiente; «En un
minuto» y «Aprendizajes» eran listas a 1.280px, donde la viñeta y el final de línea quedan
demasiado lejos para leerse como lista; el pie de los vídeos era una nota de auditoría escrita
para el autor y no para el lector; y **Trayectoria no enlazaba a ninguna de las cinco páginas**,
que llevaba abierto desde que existen. Detalle técnico en `DECISIONS.md` D56.

**La decisión de las filas de «Shutapp Projects», por fin tomada, y cómo.** El caso llevaba
heredándose desde P47.7 sin poder juzgarse, porque para verlo hacía falta un enlace que aún no
existía. Se montó un **prototipo desechable** con los dos tratamientos y se capturaron los dos:
con el rol enlazado, PICKASO queda como el único sin subrayar de su grupo anidado; con un enlace
explícito debajo, su ausencia no se nota porque nadie echa de menos una afordancia opcional. El
análisis recomendaba la segunda; **Francisco eligió la primera, sabiendo el coste**, y ese es el
tratamiento que hereda P49.

**Los textos volvieron de Notion con una cifra cerrada.** Emendu, INDYA y Freepik cambian; KUOTIP
y TheTool no. Lo importante no es el volumen sino que **INDYA acota su ×2,2**: era una de las tres
cifras abiertas y un incumplimiento de la regla 10 del formato —volumen no es comportamiento—, y
ahora distingue más usuarios de más uso (del 34% al 52% que los registran). De paso cayeron dos
afirmaciones falsas que nadie había ido a comprobar: el pie del artefacto decía «Redibujado con
los tokens del sitio» cuando D54 había decidido **exactamente lo contrario**, y la política de
cookies decía que solo INDYA incrusta vídeo cuando ya son dos.

**Y el saldo de método, que es lo que esta sesión deja de verdad: tres metros descalibrados, uno
tras otro.**

1. **El límite de `agent-browser` no era la navegación inicial, era el sandbox entero.** D51
   publicaba un remedio caro —abrir la URL desde la terminal— para un diagnóstico correcto en el
   síntoma y equivocado en el alcance. Las tres observaciones que lo fundaron eran ciertas y
   encajaban con la conclusión errónea porque **el paso que las separa nunca se dio**: al abrir
   desde fuera, la sesión seguía conduciendo desde fuera. El coste no fue teórico — la copia de
   esa regla en el subagente mandaba parar y pedir la URL, y por eso el gate se detuvo sin llegar
   a medir nada.
2. **La regla del control sobre imagen depende del metro con el que se mida.** D55 muestrea
   puntos concretos del perímetro y concluye que siempre pasa uno de los dos bordes; midiendo el
   **peor de 144 ángulos**, ninguno llega a 3:1 en ninguna de las dos páginas. No se desmienten:
   miden cosas distintas, y la pregunta abierta es cuál manda. Lo que sí es seguro es que **la
   frase publicada promete más de lo que el componente garantiza**, y que hay un estado sin medir
   —en hover el velo se apaga entero—.
3. **El censo de contraste dejó de ver los hover.** Decide si una regla es de grupo con
   `if (rule.cssRules)`, y desde que Chrome soporta CSS Nesting **toda** regla expone
   `cssRules`: encuentra 0 reglas de hover donde hay 21. Así que «todos los pares en AAA en
   reposo **y en hover**» lleva tiempo sin respaldo en su segunda mitad. Y es **la segunda vez que
   esta misma función falla por la misma causa**: ya se arregló para las utilidades que Tailwind
   envuelve en `@media`, con un test de «esto es una regla de grupo» que el navegador invalidó
   después.

La lección que generaliza las tres, y que va a `BRAND.md`: **un metro que devuelve una lista
vacía parece un aprobado**. Los tres fallaron en silencio y ninguno dio error; los tres se
encontraron porque un resultado no reproducía algo ya conocido.

**Estado al cerrar.** P48 en **Listo**, cuatro commits en `feat/deep-dive-plantilla` (PR #111,
sin mergear — el despliegue va con toda la tanda). Abiertas: **P48.7** (artefactos de las otras
cuatro, erratas, EN), **P50.3** (PSI del peso de Emendu, necesita URL pública), **P50.35** (el
botón de play), **P50.36** (el censo de hover) y **P59.5** (llevar la apertura al resto de
páginas, ya en el sprint siguiente).

---

## 48. El cierre del sprint Deep-dive: lo que se decidió, y tres premisas que no sobrevivieron a medirlas (2026-08-18)

Sesión de cierre del sprint. Ocho tareas, casi todas pequeñas, y el patrón que las cruza es el
mismo: **la tarea describía un problema y al medirlo el problema era otro**. Se recoge aquí
porque las decisiones de producto están repartidas entre ellas.

### El índice: cinco y no ocho, y las tarjetas sin copy propio

`/trayectoria` no era un extra del sprint: el breadcrumb de tres niveles de las cinco
experiencias apuntaba a esa ruta desde que se montaron, así que **eran diez páginas con el
enlace roto en su propia carpintería**, y no lo veía ningún gate porque ninguno mira la ruta
*padre* de las que se añaden.

**Lista las cinco que tienen caso, no la trayectoria entera.** La alternativa —añadir PICKASO,
Ontecnia y Havas Media apagadas— habría hecho del índice una copia de la sección de la portada
con tres filas que no llevan a ningún sitio. La ausencia se explica en copy, bajo el CTA del CV,
para que se lea como decisión y no como hueco.

**Y ninguna tarjeta tiene copy propio**, que es lo único que de verdad había que acertar:
empresa, sector, rol y periodo salen del registro, y la afirmación de la tarjeta **es el `h1`
literal de la página a la que lleva**. Un resumen escrito aparte habría sido la cuarta longitud
del mismo hecho, tres días después de retirar las tres primeras.

### `WebPage` y no `Article`, y una tarjeta OG por experiencia

Dos decisiones de cara al exterior, tomadas con Francisco.

**El tipo de Schema.org**: `Article` daba elegibilidad para rich results, pero marcar cinco
páginas de carrera como artículos le dice a un rastreador que esto es un blog —y §9 es explícito
en que no lo es— y pide un `datePublished` que en una página que cuenta cinco años no significa
nada. Gana `WebPage`, atado a la empresa y al `Person` de la home.

**La tarjeta OG**: una por experiencia y no una genérica para las seis. El argumento decisivo es
de canal — se comparte en LinkedIn, que es donde está el ICP, y una tarjeta genérica enseña el
sitio cuando lo que se está compartiendo es el caso. No cuesta copy nuevo: la compone del mismo
rótulo y el mismo titular que pinta la página.

### El ancho de línea se queda como está, y Sobre mí no era la excepción

Quedaba abierto desde el montaje: el cuerpo del deep-dive va a **157 caracteres por línea**, muy
por encima de la medida clásica. Francisco lo confirmó mirando las dos secciones servidas —los
bullets a media página, la prosa a página entera— y **se queda**.

Lo que sí cambió es entender que **Sobre mí no era un precedente divergente sino el tercer caso
de la misma regla**: sus dos bloques a 608px lo están *porque van al lado de una foto*, no por
seguir otra norma. La regla, que ya vale para las dos páginas y quedó escrita en la primitiva de
anchos y no en un comentario del deep-dive:

> **bullets → media columna · prosa sola → ancho de contenedor · prosa con imagen al lado → lo
> que le deje la imagen.**

### Tres premisas que no sobrevivieron a medirlas

Es el saldo más interesante de la sesión, y las tres van en la misma dirección: **la tarea
proponía una solución y medir demostró que era la equivocada.**

1. **«223 KB es el salto de peso más grande del sitio».** Falso: el Design System pesa 341 KB y
   el Brand Kit 302, ambos en producción desde hace semanas. Y el peso del HTML **no predice la
   nota** — el índice pesa un tercio que Emendu y saca prácticamente lo mismo. No se toca el
   artefacto.
2. **«Subir la opacidad del velo arreglaría el contraste del botón de play».** Es
   contraproducente *por construcción*: el velo acerca el póster al fondo, lo que separa al disco
   y **acerca** al anillo. Tiran en direcciones opuestas, así que no hay opacidad que gane. Y el
   estado que se sospechaba roto —el hover, donde el velo se apaga— resultó ser **el mejor**. Se
   corrigió la regla publicada, no el componente.
3. **«Atar la narrativa del deep-dive a los bullets cerraría el último hueco».** Medido antes de
   construirlo: INDYA daría **cinco falsos positivos de cinco**, porque el formato permite que
   los bullets lleven cifras que la narrativa no. Un gate ruidoso es peor que ninguno.

*El patrón, dicho una vez: una tarea bien escrita describe el síntoma con precisión y propone la
causa por intuición. Lo primero se puede confiar; lo segundo hay que medirlo.*

### Y una pregunta de Francisco que destapó una categoría entera de deuda

«¿La skill de `update-cv` está al día?». No lo estaba: en **un solo día**, mover los bullets al
registro había dejado **nueve** afirmaciones falsas dentro de ella, una de ellas del tipo que
hace daño —«retocar un bullet del CV no afecta a la web», que desde D57 es exactamente al revés—.
Y `design-review` seguía recorriendo «las seis páginas» cuando ya eran doce.

**Una skill es documentación ejecutable**, y por eso su caducidad es peor que la de un `.md`: un
párrafo desactualizado se lee con escepticismo; una skill se *sigue*. `close-session` gana el
paso de comprobarlo, con un comando mecánico en vez de una intención.

De ahí salió también el gate del CV (D60), que cierra el último eslabón: la fuente única evita
dos verdades, pero **no mantiene al día una copia impresa**.

## 49. El deep-dive sale a producción, y las dos revisiones se ganan el sueldo (2026-08-18)

La sesión que cierra la etapa. El orden lo pidió Francisco y resultó ser el correcto: **primero
`design-review` sobre la rama, después el merge a producción, después el cierre**.

### Por qué la revisión iba antes del deploy, y no después

El ciclo por tanda de este proyecto dice «OK y `design-review` al final, un solo deploy», y su
disparador documentado es *antes de un release visual grande*. Este lo era —de seis páginas a
doce por idioma, el mayor desde V1— y la skill **no se había disparado sobre el deep-dive**: lo
último que se hizo con ella fue arreglarla, porque seguía recorriendo «las seis páginas».

Encontró cinco cosas. **Dos se arreglaron antes de mergear** y las tres restantes se tarearon.

### El hallazgo que justifica la revisión entera, y cómo apareció

No lo encontró el censo corriendo como siempre. Lo encontró **preguntarse por qué `BRAND.md`
publicaba «8 páginas × 2 temas»** cuando el sitio tiene doce. Al pasar el censo por las cuatro
que faltaban apareció un par que llevaba meses ahí: el rótulo de la tarjeta de cierre —que está
en **las doce páginas**— daba 9,14 en reposo y **7,79 claro / 9,01 oscuro en hover**, donde le
tocaba 8,17 / 9,17.

La causa es un eje que D39 no miraba: **una superficie también cambia por estado**. `hover:bg-muted`
compila a `.hover\:bg-muted:hover` dentro de `@media (hover: hover)`, otro selector, así que la
tarjeta cambiaba de fondo sin recalcular su atenuado. No era incumplimiento —AAA aguantaba por
0,79—, y por eso importa decirlo bien: **lo que fallaba no era el color, era el mecanismo**, y
fallaba en el eje que solo existe mientras el cursor está encima, que es el punto ciego histórico
del proyecto. Detalle y cifras en **D61**.

*La lección, que es la reutilizable: un metro bien calibrado que no se pasa por todo el sitio
sigue siendo un metro que no ha mirado.* Es prima hermana de la de dos días antes —un metro que
devuelve una lista vacía parece un aprobado— y las dos se descubren igual: mirando **cuánto ha
mirado** el metro, no solo qué ha encontrado.

### El segundo arreglo: la capa de cabecera publicaba cuatro quintos de sí misma

`titleVariants` tiene cinco tamaños desde que `sub` nació con «La historia» del deep-dive (D53), y
la sección 11 del Design System listaba cuatro. Es el recorrido incompleto de siempre —regla ✓,
variante ✓, **sección publicada ✗**, uso ✓—, el mismo peldaño que se saltaron los botones. Al
añadirlo apareció una decisión pequeña que merece quedar escrita: **el rótulo del espécimen se
pinta solo si lo hay**, porque `sub` es el único tamaño que en el sitio va sin rótulo encima y
dibujarle uno enseñaría una composición que la página real no tiene.

### `graphify`: el primer descarte medido

Se instaló entera y se disparó. **Se descarta**, y la razón que decide no es el coste —que fue
alto: se llevó el límite de gasto por delante dos veces— sino un aviso de la propia herramienta:
«30 source files produced zero nodes», y eran **los diccionarios JSON**. O sea ciega justo donde
ocurrieron D57, D58 y D60. Eso no lo dice ninguna comparativa; se sabe disparándola. D51 ampliado.

De paso quedó una decisión de método que aguantó bajo presión: **no se construyó el grafo con la
mitad de los datos**. Faltaban `DECISIONS.md` entero, las skills y los PDFs, y un grafo así habría
contestado «no encuentro drift» **por ausencia de datos** — invalidando el veredicto en las dos
direcciones.

### El `sprint-review`, y un patrón que ya son cinco

El andamiaje salió sano: cero `any`, cero `@ts-ignore`, `strict` con `noUncheckedIndexedAccess`,
nueve dependencias de runtime, `npm audit` limpio y los cuatro `dangerouslySetInnerHTML` pasando
todos por una función con nombre.

Lo que encontró fueron **contadores caducados**, y ya van cuatro en tres días: `design-review` con
«seis páginas», `update-cv` con nueve afirmaciones falsas, y ahora **`PRD-Live` y `README`
contradiciéndose consigo mismos** —PRD-Live decía «seis páginas» y tres líneas después «señala las
doce»; README decía «6 páginas» y «12 páginas» con 53 líneas de diferencia—. Y al cerrar la sesión
cayó un tercero de la misma familia: README describía CI **dos veces y las dos incompletas**, con
tres y cinco pasos de los siete que corre.

La causa no es descuido: **cuántas páginas tiene el sitio está escrito en prosa en cinco sitios y
derivado en uno solo** —`scripts/page-html-diff.ts`, que el gate mantiene al día por obligación—.
D59 hizo exactamente este giro con el sitemap, `llms.txt` y las tarjetas OG. La prosa no se puede
derivar, pero sí comprobar, y eso queda tareado **con la cautela de D60: medir el ruido primero**,
porque de las siete apariciones de «seis páginas» en `PRD-Live` **cuatro eran correctas** —tres
hablan del deep-dive, que sí son seis páginas— y un grep ingenuo acertaría 3 de 7.

Y el quinto metro descalibrado, esta vez en el propio tooling: `prettier --check "scripts/**"`
responde «All matched files use Prettier code style!» sobre **cero** archivos, porque aplica
`.prettierignore` también a las rutas explícitas.

### Estado al cerrar

Las doce páginas por idioma en producción y verificadas. Etapa Deep-dive cerrada: **29 tareas
archivadas, 1 descartada, cero abiertas**. Queda por decidir la apertura de la etapa siguiente,
*Cómo se ha creado*, cuyas siete tareas siguen en «Sin empezar».

## 50. El Sprint Lite: nueve iniciativas sueltas, y la homogeneidad como criterio (2026-08-18/19)

Entre el sprint del deep-dive y el de «Cómo se ha creado» se intercala una tanda corta. El motivo
lo dio Francisco: el siguiente sprint es de contenido y por tanto largo, y estas cosas no
dependían de él. Trajo **nueve iniciativas sin tarear** en una página de Notion.

### Lo primero fue verificarlas, y de nueve salieron cinco

Antes de abrir tareas se comprobó cada punto contra el código, y el saldo fue este:

- **Dos eran falsos positivos** de un SEO tool: «la mayoría de imágenes no tienen `alt`» y «la
  mayoría de enlaces no tienen `title`». Las siete imágenes del sitio llevan `alt` (las dos vacías
  son decorativas a propósito), los controles solo-icono llevan `aria-label`, y el `title` en
  enlaces no lo pide WCAG y está desaconsejado. **Y ya estaban documentados**: son literalmente el
  punto 5 de las notas de P71, verificado el 2026-08-10 y nunca escrito en `DECISIONS.md`. La
  tarea que existe para que ese ruido no se reabra se reabrió sola en ocho días, lo que es el
  mejor argumento posible para cerrarla.
- **Dos pertenecían a P59.5** (la fila de datos del Brand Kit y el ancho de Cookies tocan las
  mismas aperturas), así que se agruparon con ella en vez de duplicarse.
- **Las cinco restantes** se tarearon como Sprint Lite, con prioridades 51 a 54.7 para que fueran
  por delante del sprint 2.

*El patrón, otra vez: verificar antes de tarear ahorró cuatro tareas de nueve.*

### Un bug en producción que ningún gate podía ver

Diez rutas —los cinco deep-dive × dos idiomas— servían el 404 pelado de Next. La causa es de
contrato, no de implementación: `global-not-found` cubre las URLs que no casan con **ninguna**
ruta, y `/trayectoria/loquesea` sí casa con `[slug]`. Ningún gate lo veía porque ninguno pide
una URL que no existe. Detalle en **D62**.

### La raya: cuando quitar un signo es una decisión de contenido

Francisco: la raya doble es una señal visual de texto escrito por IA. Eran **357** apariciones, y
lo que hizo el trabajo no fue el barrido sino **clasificarlas**: los parentéticos se reescriben,
los separadores cambian de signo, los rangos de fecha piden un signo distinto del que se había
elegido, y dos familias se quedan. Se cerró con una regla en `CLAUDE.md` y un guardián en CI,
porque un barrido de copy sin regla se deshace solo — y el sprint siguiente es el que más copy
nuevo escribe del proyecto. Detalle en **D63**.

### La homogeneidad, que costó tres pasadas y es el criterio que se queda

El trabajo de las aperturas empezó como «que la apertura ocupe el pliegue» y acabó siendo otra
cosa. El pliegue se resolvió a la primera; lo que costó tres rondas fue que **las tres páginas
hermanas se vieran iguales**. Y las tres rondas las abrió Francisco haciendo algo que ninguna
medición hace sola: **abrir las páginas seguidas y compararlas**.

Sus tres reportes fueron ciertos y ninguno era lo que se había supuesto: el eyebrow desalineado no
lo causaba el centrado recién añadido sino el `items-center` de la fila con una ilustración más
alta que el texto —y venía de antes—; la fila de datos a distinta altura la decidía la
ilustración mientras fuera la más alta; y al final el grupo se centra, como `/trayectoria`, que es
lo que él pidió al compararlas. Detalle y cifras en **D64**.

De ahí salen dos frases que conviene guardar como criterio y no como anécdota:

> **«No se trataría de hacer las imágenes más pequeñas sino de compactar los diferentes
> elementos.»** (Francisco, sobre una ilustración demasiado alta.)

> **Si un anclaje «arregla» una inconsistencia, probablemente esté tapando la causa.**

Y su valoración al cerrarlo, que fija el criterio hacia delante: *«este es el trabajo de
homogeneidad que me gusta y que deberíamos seguir»*.

### Lo que se decidió NO hacer, y con qué medida

- **Cookies no lleva el tratamiento de pliegue.** Su encabezado son 252px de contenido —sin
  ilustración ni fila de datos—, así que llenar los 1.000 del pliegue dejaría 539px de aire, más
  del doble de lo que hay dentro. Y es un documento que se **consulta**: retrasar la tabla una
  pantalla es cambiar su trabajo por simetría. Decidido viendo las dos versiones servidas, y
  escrito en el propio componente para que no se lea como un olvido.
- **No se abre tarea para auditar el patrón `[&_p]:m-0`** que mataba dos márgenes por
  especificidad: se comprobó que solo existía en esa página. Buscar algo que ya se sabe que no
  está es la clase de tarea que este proyecto ha aprendido a no abrir.

### Estado al cerrar

Ocho de diez tareas cerradas, en la rama `feat/sprint-lite` (PR draft #115) sin mergear: el
despliegue va con toda la tanda. Quedan dos, y las dos son de naturaleza distinta a las demás:
**hacer el repo público y proteger `main`** —que en plan Free es la única vía, y publicar es
irreversible en la práctica— y **documentar el ruido de validadores**, que es la que cierra el
bucle abierto por los dos falsos positivos con los que empezó esta tanda.

Cinco decisiones técnicas nuevas: **D62** a **D66**.

## 51. El repositorio se hace público, y el Sprint Lite se cierra (2026-08-19)

La tarea que quedaba era «proteger `main`», y al ir a hacerla los dos caminos devolvieron **403
con el mismo mensaje**: en plan Free un repo **privado** no admite protección de rama ni rulesets.
Así que no era una tarea de configuración: **era una decisión de producto** —publicar el trabajo—
y además irreversible en la práctica.

**Lo que la auditoría del historial encontró no fue lo que la tarea anticipaba.** Los 293 commits
salieron **limpios de secretos** (ni claves, ni `.env`, ni siquiera los IDs de GTM y Clarity, que
viven en Vercel), y el CI no usa ni un `secret`. **El riesgo real era editorial**: publicar el
repo publica `PRD-Historical.md`, y este documento **registraba lo que se había decidido no
contar en el sitio** — o sea, lo republicaba. Es la línea de discreción de §42 aplicada al
repositorio, y la regla que deja es incómoda de tan simple: *un documento que registra qué se
retiró por discreción lo vuelve a publicar.* Tres pasajes se reescribieron antes de cambiar la
visibilidad, y **un cuarto candidato no lo era**: la financiación de TheTool por PICKASO parecía
retirada, pero al comprobarla **contra el copy servido** resultó estar publicada hoy y con más
detalle. De cuatro hallazgos, tres reales.

**Y con el repo público, tres piezas que antes no tenían sentido.** El **README** deja de ser
documentación interna y pasa a ser portada: era buena para quien ya estaba dentro y mala para
quien llega, con 172 líneas sin una imagen y el mapa del repo en un muro de 60. Se reordena sin
tirar contenido —lo denso baja a `<details>`— y se abre con banner de marca y capturas del sitio
en los dos temas, generadas con el Chrome local. Su sección central, «Qué tiene de interesante»,
es lo que de verdad distingue este repo de un portfolio: ocho decisiones en tabla. El **`LICENSE`**
hace explícito lo que por defecto ya era —**público para consulta, no código abierto**—
enumerando lo que más se copia, porque un aviso genérico no protege lo que nadie identifica como
protegible. Y el **enlace al repo en el footer**, que antes habría dado un 404 al que lo pulsara.

**La petición que no se podía cumplir donde se pedía.** Francisco vio la tarjeta de su perfil de
GitHub vacía y pidió hacerla más visual. Se comprobó: **esa tarjeta no admite imágenes** — GitHub
pinta ahí nombre, visibilidad, descripción, lenguaje y estrellas, y nada más. Lo único accionable
era la descripción, que faltaba y se puso. Lo visual va en un **README de perfil**, que es un repo
aparte y queda tareado para después de la V3. *La petición era legítima y el sitio donde se hacía
no era el sitio donde se puede cumplir.*

### El cierre, y la lección que apareció tres veces en dos días

**La última tarea del sprint la encontró verificar producción, no el estado del despliegue.** Al
comprobar que el 404 de marca cubría ya los deep-dive, el título servido fue `404 — Francisco
López`: **con raya, el mismo día que se desplegaba el guardián que la prohíbe**. La causa era la
**allowlist** de `check:raya`, que no cubría `lib/i18n/system-messages.ts` — precisamente **el
único copy que vive fuera del diccionario a propósito** (D22/D25). El guardián no cubría la
excepción que el propio sistema tenía documentada.

Al cerrar el sprint, la `sprint-review` lo generalizó: `check:raya` era **el único guardián
construido sobre una lista de ficheros**, y el único que ha fallado; los otros tres derivan su
alcance. Se cambió por un recorrido de las fuentes, y **pagó a la primera**: de 32 archivos y
2.649 cadenas a **135 y 5.557**, con dos violaciones nuevas en el contenido del **CV**, donde la
web ya decía `·` y el PDF seguía diciendo raya. El mismo rótulo con dos valores.

Es la tercera cara del mismo fallo en dos días, y por eso queda escrita: **un guardián que afirma
cuánto ha mirado sigue sin decir qué dejó FUERA de su lista.** Primero fue `.prettierignore` (un
fichero excluido), luego una allowlist (un fichero nunca incluido), y el arreglo que sirve no es
ampliar la lista sino **derivar el alcance en vez de enumerarlo**.

La revisión dejó además dos cosas que no son de código: **`PRD-Live.md` seguía diciendo que el
sprint estaba «a ocho de diez»** —y es el documento que se `@`-importa en cada sesión, así que
toda sesión futura habría arrancado con un estado falso— y **el cambio operativo más grande no
tenía ADR**: `DECISIONS.md` tenía cero menciones a «ruleset» mientras D12 seguía describiendo el
flujo como disciplina. Con el sprint cerrado, **12 de 12 y en producción**, quedan tareadas tres
cosas que no se resuelven hoy: el README de perfil, si D11 («sin tests») sigue vigente en V2, y
la subida a ESLint 10 —cuyo bump automático revienta por dependencias transitivas, no por nuestra
configuración—.

---

## 52. El bloque Método: se audita cómo se trabaja, antes de un sprint de contenido (2026-08-19)

**Por qué se hizo aquí.** Antes de abrir «Cómo se ha creado» —un sprint largo, de mucho texto y
con una entidad nueva que traerá componentes propios—, Francisco pidió un análisis de
metodología con mirada externa: *un técnico que ve el método por primera vez y busca margen*. Se
hizo sobre lo que el repositorio demuestra, no sobre lo que los documentos afirman, y se cruzó
con nueve notas que él traía sin tarear. El listón tenía que estar puesto **antes** de que
existieran los componentes nuevos, no después.

**El diagnóstico, en una frase:** *este método tiene una operación de añadir excepcional y no
tiene operación de retirar.* Cada fallo se convierte en regla, cada regla en guardián, cada
guardián en párrafo — sesenta y ocho veces, que es más de lo que hace casi nadie. Pero nada se
colapsa nunca, y las tres cosas que estaban drifteando lo hacían todas por ese lado.

### Lo que el cruce encontró, y lo que cambió al ejecutarlo

De los nueve hallazgos y las nueve notas, **tres convergieron desde direcciones distintas** —y
esas fueron las de más confianza: la Definition of Done ↔ los nueve gates manuales, el consumo
de tokens ↔ el régimen de contexto, y la deuda de Qlty ↔ la capa de verificación sin verificar.

**Dos notas quedaron diagnosticadas con causa y no con hipótesis.** El dashboard de Looker **sí**
se actualizaba: el único tile con datos era el único que no necesitaba configuración manual
(`file_download` es nativo de GA4), y los dos vacíos eran justo los que dependían de un paso
fuera del repositorio que el propio código documenta como pendiente. Y la skill de brainstorming
nunca se había disparado **por configuración, no por olvido**: `prototype` lleva
`disable-model-invocation: true`, así que solo puede invocarla Francisco.

**Y una nota se corrigió en su premisa:** el repositorio no está en un canal inestable. `next`,
`react` y `tailwind` están exactamente en `latest`, los dos primeros anclados sin caret, y `npm
audit` da cero. El riesgo no era la versión sino **el tiempo** —saltar a la nueva la semana en
que sale, con CI como única puerta—, así que lo que entró fue un periodo de reposo.

**Tres conclusiones del propio análisis se cayeron al ejecutarlas, y conviene que consten.**
`check:raya` sí tenía su guarda de cero (se dio por ausente mirando solo el final del archivo,
que es una ejecución del fallo que el hallazgo denunciaba). De las 20 tareas del bloque
«General», **17 eran genuinamente transversales**, así que no hacía falta redistribuir sino
escribir el criterio. Y el artefacto resultó **determinista**, al revés que el PDF, lo que
permitió un gate más fuerte que el que se había planeado copiar.

### Lo que quedó montado

El detalle técnico vive en **D69** (el régimen de contexto gana cifra y guardián; los índices se
derivan; `close-session` gana la operación inversa) y **D70** (la capa que verifica se verifica).
Lo que no es técnico:

- **La Definition of Done existe**, en `CLAUDE.md`, con **dos columnas**: la A bloquea el envío,
  la B no y nace como tarea de V3. Esa segunda columna es la disciplina «shippear vs pulir» que
  faltaba, y su frase operativa es *un hallazgo de la columna B nunca reabre una sección ya
  enviada, se tarea*. Absorbe los nueve gates manuales, que estaban repartidos entre un
  documento, cuatro skills y la memoria — y las tres skills que solo puede disparar Francisco.
- **`sprint-review` gana su punto 12**, el check de medición, que el ritual de cierre de etapa
  declaraba desde siempre y no tenía portador: cinco etapas cerradas, cero checks hechos. Su
  cuarta pregunta es la que costó caro — *si un scorecard está a cero, la primera hipótesis es el
  instrumento, no la audiencia*.
- **La skill de Web Interface Guidelines** entra como **fase −1** de `design-review`: checklist
  mecánico primero, criterio después. Cubre cinco familias que el sistema no codifica. La pasada
  completa dio **cero antipatrones de catorce posibles** y seis huecos, de los que uno era falso
  positivo.
- **Se retira el último espejo de Notion.** El de `PRD-Live` era el único que quedaba, y el
  motivo que lo justificaba —mirar el PRD sin abrir el código— lo cubre desde D68 que el
  repositorio sea público.

### La pregunta que cerró el bloque, y su respuesta

Francisco preguntó si, ya que los archivos volverán a crecer, **merecía la pena borrar lo
desfasado**. La respuesta fue **no**, y con número: lo declarado obsoleto son **237 palabras de
41.694, el 0,6%**. No hay volumen que ganar, y el valor del histórico *es* el experimento
fallido — ese mismo día D51 evitó reconsiderar `graphify` por la razón equivocada y D60 obligó a
medir la determinancia del artefacto en vez de copiar el método del CV.

El riesgo real no es que exista contenido desfasado: es que **algo desfasado se lea como
vigente**, y eso no se arregla borrando sino **marcando**. Lo que sí se borró fue duplicación,
no historia: las 12 líneas del changelog V1.x de la cabecera de este archivo, que decían «ver
sección N» y apuntaban a secciones que el índice derivado ya lista.

**Resultado del bloque:** contexto de arranque de **19.805 a ~12.900 palabras (-35%)**, CI de 8
a 12 pasos, cinco guardianes nuevos o corregidos —todos validados rompiéndolos— y 15 de 16
tareas cerradas. La que queda abierta es la de más valor y no es de código: crear en GTM el tag
de GA4 que traduce `contact_click`.

### Lo retirado de `CLAUDE.md`, y por qué era historia

La DoD entró en `CLAUDE.md` y `check:contexto` saltó al instante: 16.003 palabras contra
un techo de 16.000. Funcionó como estaba pensado, así que **se pagó retirando, no subiendo
el techo** — que es la primera vez que este método ejecuta esa operación por obligación y
no por criterio. Lo retirado, íntegro:

> *(Aclarado 2026-07-24: antes esta regla mandaba renumerar siempre en vez de meter
> decimales; se relaja porque renumerar decenas de tareas por un solo insert es
> desproporcionado.)*

> *(Añadido 2026-07-27: se construyó la home entera saltándose la P11.5 —conectar Vercel,
> de prioridad anterior— y sin ir moviendo Estados; el tablero quedó desincronizado de la
> realidad y hubo que reconstruir el mapeo a posteriori. La disciplina no es burocracia: es
> lo que mantiene el tablero como fuente fiable de en qué punto está el proyecto.)*

> **Modelo actualizado (2026-08-01): sin fechas.** Se dejaron los sprints datados —eran
> ficción, vamos más rápido que cualquier calendario y no hay equipo que coordinar—. El
> campo pasó a `Etapa`.

> **Qué significa `Etapa` (revisado el 2026-08-10).** Dejó de ser una lista de fases
> temáticas —había degenerado: 16 de 20 tareas abiertas estaban en «Optimización», así que
> el eje ya no discriminaba nada— y pasa a contestar una sola pregunta.

En los cuatro casos la REGLA se queda en `CLAUDE.md` y lo que baja aquí es el RELATO de
cómo se llegó a ella. Es el criterio del paso 1 bis de `close-session`: si una frase lleva
fecha, o cuenta lo que se probó y se descartó, no es de un documento en presente.

### Lo retirado de `PRD-Live.md` §4 y §5, íntegro

#### 4. Estado actual — en producción (`franciscolopez.es`)

V1 lanzada. En vivo:
- **Home** (una sola página), en **ES (raíz `/`) y EN (`/en`)**.
- Páginas propias: **Sobre mí**, **Brand Kit**, **Design System**, **Accesibilidad**,
  **Política de cookies**.
- **El deep-dive por experiencia** (2026-08-18): el índice **`/trayectoria`** y las cinco
  páginas de `/trayectoria/[slug]` —Emendu, KUOTIP, INDYA, Freepik y TheTool—. Con eso el
  sitio pasa de **seis páginas a doce** por idioma, que es el recuento que usan `gate:html`
  (24 variantes), el sitemap y el recorrido de `design-review`. **En producción desde el
  2026-08-18.**
- **CV en PDF bilingüe** (ES/EN) descargable, con identidad de marca, generado por código.
- **La apertura de Sobre mí es un vídeo** desde el 2026-08-19: se reproduce una vez y se queda en
  su último fotograma; con `prefers-reduced-motion` se sirve una imagen quieta y el vídeo **no se
  descarga** (D65). El retrato de la home también es nuevo, y con él la tarjeta OG (D66).
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
(D45/D46). Las **doce páginas se prerenderizan** por locale desde que se retiró el
`not-found` anidado que volvía dinámicas a las seis de entonces (D25), y el **diccionario
está partido por página** (D48). Es lo que hace que las seis páginas del deep-dive —cinco experiencias y
su índice— nazcan con el `hreflang` correcto, con enlace de salto y estáticas, sin que nadie
tenga que acordarse.

#### 5. Sistema (criterios de aceptación, no aspiraciones)

- **Stack / arquitectura**: Next 16 (App Router), TypeScript `strict`, Tailwind v4, capa de
  componentes propia. **shadcn/ui está configurado y sin usar**: entra solo para widgets con
  estado, foco atrapado o portal, y hacia delante (D6). i18n nativo `app/[lang]`, diccionario
  tipado, cero strings hardcodeados. Detalle en `README.md` y `DECISIONS.md`.
- **Marca**: regla de dos capas (cian = único color de acción; morado decorativo con
  cuentagotas), tipografía Bricolage/Inter, logo con split. Detalle en `BRAND.md`.
- **Capa de componentes — siete capas**: el control **con caja** —botón, chip, toggle,
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
  vez. Los iconos son de **lucide**; los que lucide no trae —hoy LinkedIn y GitHub, que dejó
  de exportar en la v1.24 por marca registrada— se dibujan a
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
  **experiencias** + **CV al día** + **raya** + build en cada PR (nada que no compile entra en `main`;
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
  **HTML servido de las doce páginas × dos idiomas** antes y después de un refactor. Diff
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

### Lo retirado de `PRD-Live.md` §9, íntegro

#### 9. Alcance por versión

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

   **EL SPRINT QUEDA CERRADO EL 2026-08-18 Y DESPLEGADO A PRODUCCIÓN** (PR #112, rebase de 20
   commits), con `design-review` disparada **sobre la rama antes del merge** —que es su
   disparador documentado para un release visual grande, y aquí se ganó el sueldo: encontró el
   agujero de `--surface-dim` en hover (**D61**) y que el Design System publicaba cuatro de los
   cinco tamaños de su capa de cabecera—. La etapa se cierra con **29 tareas archivadas, 1
   descartada** —`graphify`, por coste y por ser ciega a los diccionarios (D51 ampliado)— **y
   cero abiertas**. Todo eso, con el índice construido y el SEO resuelto. El
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
   solo existe mientras el cursor está encima. Corregido, el censo daba **cero pares bajo AAA en
   8 páginas × 2 temas** —y esa cifra, «8 de doce», es la que horas después destapó **D61**: al
   pasarlo por las cuatro que faltaban apareció que el atenuado **no se recalcula al cambiar de
   superficie por hover**, porque `hover:bg-muted` compila a otro selector. Corregido eso, el
   censo cubre ya **las doce páginas × 2 temas con el metro validado en las 24 corridas, cero
   pares bajo AA y cero bajo AAA**, así que «en reposo y en hover, sin excepciones» vuelve a tener
   respaldo — y de paso queda la lección: *un metro bien calibrado que no se pasa por todo el
   sitio sigue siendo un metro que no ha mirado.* Y el **control sobre imagen** se resolvió corrigiendo
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

**Y entre el sprint 1 y el 2 se intercala un SPRINT LITE** (2026-08-18/19), porque el siguiente
es de contenido y por tanto largo. Sale de nueve iniciativas que Francisco traía sin tarear, y lo
primero fue verificarlas contra el código: **de las nueve salieron cinco tareas nuevas, no
nueve** — dos eran falsos positivos de un SEO tool ya descartados y documentados dentro de P71
(imágenes sin `alt`, enlaces sin `title`) y dos pertenecían a P59.5. Entregado, con ocho de diez
tareas cerradas:

- **El 404 de marca ya cubre los deep-dive** (D62). Diez rutas servían en producción el 404 pelado
  de Next, porque `global-not-found` solo cubre las URLs que no casan con ninguna ruta y
  `/trayectoria/loquesea` sí casa.
- **La raya (`—`) sale del copy servido** (D63): 357 apariciones en ES y EN, tratadas como tres
  familias distintas y no como un reemplazo, con dos excepciones que se quedan. **Y con guardián:
  `npm run check:raya` es el octavo paso de CI** y afirma cuánto ha mirado.
- **Retrato nuevo en la home** (D66), que arrastró dos cosas invisibles: la tarjeta OG y el `image`
  del JSON-LD leen la misma foto, y del archivo OG solo se servía la mitad.
- **La apertura de Sobre mí es un vídeo** (D65): se reproduce una vez, con motion reducido se
  sirve una imagen quieta y **no se descargan los 362 KB** del vídeo.
- **Las aperturas de Brand Kit, Design System y Accesibilidad son homogéneas y ocupan el pliegue**
  (D64), verificado con las tres abiertas seguidas: mismo eyebrow y misma fila de datos al píxel
  en 1536×740, 1920×1080 y 2560×1440, y centradas como `/trayectoria`. Cookies queda **fuera del
  pliegue por medición** (252px de contenido contra 539 de aire) pero **su cuerpo sale de la media
  columna**, que era la última página con todo dentro de `PROSE`.
- La capa de componentes gana su **séptima pieza**, `stat-row.tsx`.
- **El repositorio es PÚBLICO y `main` la protege el servidor** (D68), no la disciplina: ni push
  directo, ni merge con CI en rojo, ni bypass de admin. Antes era imposible —en plan Free un repo
  privado no admite protección de rama—, así que la tarea no era configurar sino **decidir**. El
  paso previo fue **auditar los 293 commits**: cero secretos, y el riesgo real resultó ser
  editorial. Con él llegan el **README de portada**, un **`LICENSE`** explícito («público para
  consulta, no código abierto») y el **enlace al repo en el footer**, que trae el segundo icono
  propio y mete el repo en el `sameAs` del JSON-LD.
- **El ruido conocido de los validadores queda documentado** (D67): de ~11 hallazgos externos,
  seis eran falsos positivos. **Se documenta el mecanismo y el comando para recontar, nunca la
  cifra** — porque al verificarlos, *todas* las cifras apuntadas estaban viejas.

**EL SPRINT SE CIERRA EL 2026-08-19 CON 12 DE 12 Y EN PRODUCCIÓN** (PR #112 y #115 por rebase,
#116 por squash). Su última tarea la encontró **verificar producción** y no el estado del
despliegue: el `<title>` del 404 servía `404 — Francisco López`, con raya, el mismo día que se
desplegaba el guardián que la prohíbe. La causa era la **allowlist** de `check:raya`, que no
cubría `lib/i18n/system-messages.ts` —el único copy que vive fuera del diccionario a propósito,
por D22/D25—. Al cerrar el sprint, el guardián deja de enumerar archivos y **recorre las fuentes**
como `check-palette.ts`: pasa de 32 archivos y 2.649 cadenas a **135 y 5.557**, y a la primera
encontró **dos violaciones más en el contenido del CV**, donde la web ya decía `·` y el PDF
seguía diciendo raya. *Un guardián que afirma cuánto ha mirado sigue sin decir qué dejó FUERA de
su lista.*

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

- ~~**Marca externa**: firma de email, header de LinkedIn, rediseño de assets.~~ **Retirado el 2026-08-20: era falso.** Las tres estaban hechas. Ver §53.

El porqué de cada decisión de producto, en **[PRD-Historical.md](./PRD-Historical.md)**.

## 53. «Cómo se ha creado esta página»: el contenido primero, y un artículo que no publica cifras (2026-08-20)

**Qué se hizo.** P58 pedía «solo el índice y la estructura, no se escribe el artículo
todavía». Francisco amplió el alcance a mitad de sesión: un borrador completo que él
reescribe con su voz, como se hizo con el CV y con Sobre mí. Salieron cinco versiones en
una sesión y quedó cerrado como borrador: **diez secciones, apertura y cierre, ~6.000
palabras**, en una página de Notion enlazada desde la tarea.

**Lo primero fue revisar la tarea, y eso fue lo que más valió.** Se definió el 2026-08-10
y en diez días se le habían caducado cinco premisas: sus «43 decisiones técnicas» eran ya
73; el repositorio se hizo público (D68), lo que convierte cada afirmación del artículo en
enlazable en vez de contable; los cinco deep-dive habían resuelto la forma de página larga,
así que dejó de ser la primera del sitio; cuatro de las diez secciones propuestas pisaban
páginas que ya publican esos mismos datos; y el material nuevo (D50-D73) resultó ser el
mejor del artículo, no relleno. *Una tarea definida hace diez días en un proyecto que se
mueve a esta velocidad no se ejecuta: se revisa primero.*

### Las decisiones de contenido

- **Diez secciones sin techo de palabras.** Decisión de Francisco contra la recomendación
  de un corte selectivo de cinco o seis. Es la página más larga del sitio y un perfil de
  RRHH no la termina, pero no es para él. Obliga a **índice navegable**, que pasa de
  adorno a requisito de P59, y a etiquetas cortas por sección, que son copy y salieron con
  el borrador.
- **Cada sección enlaza a su ADR, su archivo o su guardián.** Solo es posible desde D68, y
  es lo que separa «un post sobre mi web» de una prueba verificable.
- **El artículo no publica cifras propias.** Ni contraste, ni rendimiento, ni número de
  páginas: o enlaza a la página que ya lo publica, o lo lee de `lib/design-values.ts`.
  Escribirlas en el diccionario sería la copia impresa de D60. La forma exacta de rematar
  eso sin cifras la fijó **D74**.
- **Diagramas propios como norma; capturas solo cuando lo que se enseña no es un número**
  (el tablero, una tarea real, un prototipo frente a la sección publicada).

### Tres reordenaciones, y las tres salieron de leerlo como si fuera la primera vez

**El método pasó del penúltimo bloque al segundo.** Un artículo que cuenta cómo se ha hecho
una página no puede dejar «cómo se decide qué se hace» para el final: el lector recibía
ocho secciones de resultados antes de saber con qué criterio se produjeron.

**La medición dejó de ser sección propia y acabó en el cierre.** Primero se fusionó con el
método (era la sección más floja y rompía el crescendo hacia el bloque de errores) y
después Francisco la movió al final, que es mejor que las dos anteriores: ahí no es una
capa técnica, es el «y ahora qué».

**El sistema de componentes se adelantó a la historia de la maqueta**, que contaba el
efecto antes que la causa: la maqueta caducó *porque* el sistema en código creció, y ese
crecimiento se narraba después.

### Lo que el artículo dice de más y de menos, a propósito

Se escribieron las **decisiones de no hacer** —sin formulario de contacto, sin página
propia para dos experiencias, sin blog, y el límite del corpus del asistente conversacional
fijado antes de que el asistente exista— porque el criterio de producto se enseña mejor en
lo que no está que en lo que está. Y se dice en voz alta que **no hubo investigación con
usuarios**, junto con lo que sí hubo: perfiles de referentes, artículos de gente de
selección y una hipótesis escrita de quién lee y en cuánto tiempo, de la que salen las
decisiones de la sección. *Convertir la ausencia en criterio es más fuerte que disimularla,
sobre todo en un sitio que se llama «Del discovery al dato».*

**Descartado: cuánto tiempo llevó el proyecto.** Era el dato más persuasivo que le falta al
artículo. Francisco lo descarta porque el proyecto sigue avanzando y sería un dato a
cambiar cada poco: el mismo criterio que retiró las cifras de los badges del README.

### Y una afirmación falsa que salió por el camino

Al escribir el párrafo sobre coherencia de marca, el PRD publicaba «**Marca externa**:
firma de email, header de LinkedIn, rediseño de assets» bajo «Fuera de alcance, sin versión
asignada». Las tres estaban hechas: la firma lleva el monograma con su split y la
tipografía de titulares, y el banner de LinkedIn y la portada del repositorio abren los dos
con «Del discovery al dato», que es el titular del Hero. Se **retiró la sección entera** de
`PRD-Live.md` en vez de anotarla al pie, y el hecho subió a §4.

**Estado al cerrar.** P58 en Listo. Se arrastra a P60 una sola cosa de contenido: el remate
de resultados, que no es la analítica de usuarios (esa empieza ahora y el artículo ya lo
cuenta así) sino que el lector recorre ~6.000 palabras de proceso sin ver un solo resultado
del trabajo. Se resuelve con D74 al escribir el copy final.

## 54. Método II: el sprint de la operación que faltaba, y tres reglas que existían sin disparador (2026-08-22)

**Qué lo abrió.** Un número. El contexto que se `@`-importa en cada arranque había pasado de
4.120 palabras el 30 de julio a **13.470 el 22 de agosto**, con el techo en 13.500: **treinta
palabras de margen**, +227 % en 23 días. El sprint anterior había cerrado en producción y el
siguiente añade una página, que es justo lo que hace crecer `PRD-Live.md`.

**El diagnóstico, que no era «se escribe de más».** El method-review del mismo día lo dejó en
una frase: *este método tiene una operación de añadir excepcional y no tiene operación de
retirar*. Y el matiz importa, porque el mecanismo para retirar **ya existía** desde el 19 de
agosto —el paso 1 bis de `close-session` y el techo de `check:contexto`—. Lo que no había
ocurrido nunca era pasarlo por los documentos. **La deuda era anterior al portador.**

**Las tres decisiones, y ninguna es «escribir menos».**

- **D88** · el índice de decisiones baja a la cabecera de `DECISIONS.md`. Era el único de los
  tres índices que vivía dentro de un archivo `@`-importado, y el único que crecía **por
  construcción**: 1.296 palabras, el 9,6 % del presupuesto, a unas 42 palabras diarias. Contra
  algo que crece solo, un techo no defiende: solo obliga a recortar en otro sitio.
- **D89** · el inventario de `components/ui/` se deriva del disco. La lista que contesta el paso
  1 de la «Regla de construcción» —¿existe ya la pieza?— estaba escrita a mano en **cinco
  sitios y ninguno acertaba**, y dos piezas no salían en ninguno.
- **D90** · el censo de contraste sella lo que midió. La condición de re-medir de la DoD era
  correcta y **leerla era trabajo humano**; ahora CI la lee y sale rojo nombrando lo que
  apareció, sin necesitar navegador.

**El resultado, medido:** 13.494 → **11.997** palabras. Por primera vez el arranque cabe en el
objetivo de 12.000 que se fijó el 19 de agosto, con el techo apretado dos veces en el mismo día
(13.500 → 12.500 → 12.400).

**El patrón que comparten cinco de las siete tareas, y es lo que hay que llevarse:** *una regla
que existe, es correcta, y no tiene quién la dispare*. La de publicar una pieza en el Design
System llevaba meses escrita y se incumplió dos veces seguidas; la condición de re-medir se
cumplió por triplicado sin que nadie la leyera; el inventario mandaba mirar donde las piezas no
estaban. En los tres casos lo que faltaba no era documentación: era **el momento y el con qué
compararse**. De ahí salen dos skills nuevas —`publicar-en-design-system` y
`gates-de-servidor`— y un guardián que nombra lo que falta en cada PR.

**Y lo que el sprint destapó al pasar:** `stat-row` llevaba desde el 19 de agosto siendo una de
las siete piezas del núcleo **sin publicar**, y `deep-dive-page` no se había disparado nunca
desde que se extrajo. Las dos cosas las encontró el andamiaje nuevo el mismo día de estrenarlo,
que es la única prueba que vale de que un gate sirve.

## 55. El footer no es de columnas, y la cifra que lo decidió son ocho enlaces (2026-08-23)

**El footer estructurado llevaba desde el 2026-07-18 con su condición escrita en el propio
nombre de la tarea —«cuando existan más secciones»— y con un aviso al lado que resultó ser el
criterio de verdad.** El PRD §7 ya había evaluado la referencia `footer-3` y **descartado su
estructura de columnas** por sobredimensionar: riesgo «portfolio freelancer». Con trece páginas
la condición por fin se cumplía, así que la tarea se abrió para hacer columnas.

**Y contar los enlaces la cerró en dirección contraria.** `footer-3` reparte **~20 enlaces en
cuatro columnas**; aquí hay **8**. Ese hueco es exactamente lo que el aviso de julio nombraba,
y no se vio razonando sino **dibujándolo**: la primera ronda de `/prototype` puso la rejilla en
pantalla y las tres columnas quedaron a 295 / 626 / 956 px sobre 1360 de contenedor, con el
aire que la referencia llena con veinte enlaces y aquí no llena nada.

**Cinco rondas hicieron falta, y el recorrido es el hallazgo.** Rejilla · Banda · Bloque →
riff sobre Rejilla → las cuatro celdas de alineación × separador → **vuelta al footer de
producción** con tres cambios. La dirección final no es ninguna de las tres primeras: es el
footer que ya había, con el nombre en la firma, una segunda línea fina y los enlaces en
jerarquía. **Ocho enlaces no piden una arquitectura nueva: piden orden dentro de la que hay.**

**Lo que la prueba costó y lo que ahorró.** Cinco rondas de prototipo es caro. La alternativa
era construir las columnas, verlas vacías y rehacerlas — y el aviso de julio decía exactamente
eso sin que nadie pudiera confirmarlo hasta verlo. **Una decisión aplazada por una condición se
resolvió en una sesión porque se dibujó en vez de discutirse.**

**Dos cosas se destaparon al pasar, las dos por comparar contra algo ya publicado.** El
wordmark del componente llevaba un tamaño congelado y era el único de los siete del sitio a
peso 400 (D94) — lo vio Francisco enfrentando el footer al lockup del Brand Kit. Y el footer
escribía cinco rutas a mano sin ser consumidora del registro, que es la causa de que «Cómo se
ha creado» hubiera que insertarla a mano al cerrar el sprint anterior (P67.5).

## 56. Contacto ampliada añade una sola cosa, y con ella el sitio deja de ser de solo lectura (2026-08-23)

La tarea de definición llevaba abierta desde julio con una pregunta honesta escrita en ella:
**¿qué añade una página de contacto sobre la franja que ya existe?** D29 había unificado las
tres superficies de contacto —la franja de la home, el cierre de Sobre mí y el «reportar una
barrera» de Accesibilidad— en un solo componente, unos datos y una jerarquía, y funcionaban.
La tarea admitía por escrito que **si la respuesta era «nada», la conclusión legítima era
descartar la página**, no construirla por inercia.

**La respuesta es «una cosa, el formulario», y conviene decirlo así de crudo.** Email,
teléfono, LinkedIn y CV ya los da la franja igual de bien; el formulario es lo único que la
franja no puede dar, porque quita el paso de «abre tu cliente de correo» — que es donde se
pierde al visitante en un portátil ajeno o en un móvil sin cuenta configurada. Eso justifica
la página **y le pone el listón**: si el formulario no queda impecable, la página resta.

**El inventario de partida corrigió dos supuestos de la propia tarea.** Verificado en código
y contra el HTML renderizado: **el email solo se LEE en dos sitios**, Cookies y Accesibilidad
—en home y Sobre mí vive únicamente dentro del `href` del botón sólido, nunca en pantalla—,
así que «unificar el formato del email» era unificar dos casos y no cinco. Y **el teléfono
solo existe en `ContactSecondary`**, o sea home y Sobre mí. Los dos casos visibles usaban
capas distintas —Cookies en contenido (`.link-content--underline`), Accesibilidad en chrome
(`chromeLinkVariants`)—, y la divergencia estaba razonada pero **escrita como excepción a un
caso, no como regla**: si Accesibilidad perdiera su botón, nada decía qué variante tocaba.

**Cuatro decisiones, y tres de ellas tienen coste asumido a sabiendas.**

1. **La franja de home y Sobre mí pasa a ENLAZAR a `/contacto`**; el `mailto:` directo
   desaparece de ahí. Se centraliza todo el contacto, a cambio del atajo del lector rápido
   del §3 —el perfil de RRHH que escanea en 5-10 segundos ahora carga una página más— y de
   que **la métrica primaria deje de ser los clics de contacto y pase a ser los envíos**.
   Se avisó de las dos cosas antes de elegir.
2. **Formulario mínimo: nombre, email y mensaje.** Descartado el filtro de ICP del §2 como
   campos: cada campo añadido baja la tasa de envío, y quien escribe ya dice de qué empresa
   es dentro del mensaje.
3. **Todo se unifica a la variante de contenido**, así que Accesibilidad cambia de chrome a
   contenido. **Esto retira la «excepción viva» de `ContactSecondary`** que `BRAND.md`
   documentaba desde el 2026-08-04 — la que decía que ahí el subrayado permanente compite
   con el CTA sólido que tiene a 15px. El propio `BRAND.md` había predicho que la excepción
   «probablemente se resuelva de otra forma el día que exista una sección de contacto
   dedicada»; ese día es este, y se resuelve retirándola.
4. **Correo de envío y recepción: el Gmail que el sitio ya publica. Cero trabajo de DNS.**

**La cuarta decisión esquivó un fallo que no se ve en el código.** Medido el mismo día sobre
`franciscolopez.es`: **no hay SPF, no hay DKIM y no hay MX**, pero **sí hay DMARC en
`p=quarantine`**, puesto por el registrador. Es la peor combinación posible: un formulario
que enviara desde una dirección del dominio propio fallaría las dos alineaciones y su propio
DMARC lo mandaría a cuarentena — el criterio de cierre del desarrollo («un envío de prueba
que llegue de verdad al buzón») fallando el primer día por una causa invisible.

Lo que hace innecesario todo eso es una observación de encuadre, no técnica: **el correo del
formulario es una notificación para Francisco, no un mensaje al mundo.** Su remitente solo lo
ve una persona, así que puede ser el del proveedor con `Reply-To` del visitante, sin coste de
marca y sin un solo registro DNS. Y descarta activamente la alternativa que sonaba natural
—enviar *como* el Gmail desde un proveedor externo—: `gmail.com` publica
`v=spf1 redirect=_spf.google.com` y `p=none`, así que un tercero firmando como esa dirección
falla SPF y DKIM a la vez, que es el patrón exacto del spoofing.

**Lo que la definición arrastra, y que no estaba en el sprint.** El sitio pasa de trece a
catorce páginas por idioma —`PAGE_COUNT` es derivado y se actualiza solo, pero la cifra
escrita a mano no—; dar de alta `/contacto` es **una línea** en el registro de rutas (D72) y
detrás van solos el sitemap, el gate, `/llms.txt`, el censo y `check:marco`; y **la CSP
estricta con nonces se acciona**, porque su disparador escrito en D26 y en §5 era literalmente
«o antes si Contacto ampliada incorpora un endpoint externo». Esa tarea se había definido esa
misma mañana y se había dejado bloqueada esperando justo a esta respuesta.

## 57. La dirección de Contacto se elige viéndola, y el prototipo destapa dos defectos del sistema (2026-08-23)

El mismo día que se definió **qué** añade Contacto ampliada (§56), se decidió **cómo** se ve.
No razonándolo: construyendo cuatro direcciones que funcionan y mirándolas servidas, que es lo
que pide la Definition of Done cuando una tarea tiene más de una dirección posible.

**Tres rondas, y cada una preguntó algo distinto.** La primera exploró **qué es el formulario
respecto a la página**: un objeto sobre ella (tarjeta), una continuación del texto (campos como
líneas de escritura), el contrapeso de una declaración de marca (banda invertida), o la página
entera (bloque denso sobre el pliegue). Ganó *objeto*. La segunda fijó esa estructura y divergió
**solo en el bloque de canales** —lista, tarjetas, pastillas de chrome, ficha técnica—, con la
cabecera copiando la apertura del Design System. La tercera convergió sobre **tarjetas** y ajustó:
fuera el rótulo, fuera LinkedIn, formulario centrado.

**El último ajuste enseña algo sobre el propio método.** «Centrar las tarjetas en altura respecto
a la entradilla» suena a una clase y no lo era: para centrarse contra la entradilla hay que
**compartir fila** con ella, y con dos columnas flex eso no se puede expresar —el centrado sería
siempre contra el bloque entero—. La cabecera pasó a rejilla de dos filas. Medido después: **0px
de desfase** entre los dos centros. Y el hueco titular→entradilla se **importó de `LEAD_GAP`** en
vez de escribirse, para que no se desincronice el día que ese valor cambie.

**Lo que el prototipo destapó, y que no era del prototipo.** Es la parte que justifica haberlo
construido en vez de decidirlo sobre el papel:

- **`--destructive` no llega ni a AA en claro (4,31:1).** Es el token de error del sistema, sin un
  solo uso desde que existe el repositorio, y el formulario iba a estrenarlo. Cifras y método en
  `BRAND-historical.md`; lo que importa aquí es que **`npm run censo` no podía haberlo cazado**,
  porque recorre el DOM y un token que no se pinta no está ahí. El censo mide todo lo que se usa,
  y nada de lo que no.
- **`.link-content` no tiene contraparte invertida.** Sobre una banda, `--foreground` es el fondo
  y el enlace desaparece. La capa de chrome lo tenía resuelto desde P60; la de contenido no,
  porque el caso no había ocurrido nunca.
- **El formulario obliga a un documento de privacidad**, y la política de cookies no lo cubre:
  contesta al art. 22.2 de la LSSI, que es otra cosa que el art. 13 del RGPD. Se resuelve **sin
  crear una página nueva**: la URL `/cookies` se queda —no rompe el footer, ni el diálogo de
  consentimiento— y la página se retitula «Privacidad y cookies» con una sección de datos del
  formulario. Un enlace de footer, cero redirecciones, catorce páginas y no quince.

**Cuatro decisiones de contenido que salen de aquí y que P67 hereda cerradas.** Accesibilidad
**no** se enruta al formulario: su canal de «reportar una barrera» sigue siendo correo directo,
porque si el formulario resultara ser la barrera, obligar a usarlo para reportarla es una trampa
—y esa página publica una declaración de conformidad—. **LinkedIn desaparece de la página** y
sobrevive solo en el footer. **El CV no es un canal**, es una descarga, y juntarlos era herencia
de la franja de la home. Y **Contacto entra en el nav**, detrás de Descargar CV, que hoy tiene
exactamente dos enlaces: es un cambio en las trece páginas y ensancha justo el grupo que P65.6
midió en 349px, así que vuelve a poner el ancho mínimo bajo vigilancia.

**El entregable no se mergea.** La superficie de prototipo vive en una rama con PR en borrador
(#162) y la borra P67 al construir la página real, junto con la única línea de producción que
necesitó: una exclusión en el matcher de `proxy.ts`, sin la cual el enrutado de locale reescribe
`/prototipos` a `/es/prototipos` y devuelve 404.

## 58. Contacto se construye, y las tres cosas que arrastra no son las que decía el sprint (2026-08-23)

**El Sprint 3 se cerró el mismo día que se abrió el desarrollo**, y este es el párrafo que
vivía en `PRD-Live.md` §9 mientras estuvo en curso, con lo que se cumplió y lo que no:

> El footer va el último **porque necesita que existan las secciones que crean los dos
> sprints anteriores**. Contacto ampliada añade UNA cosa sobre la franja de D29, el
> formulario, que es a la vez su justificación y su listón. Con él el sitio deja de ser de
> solo lectura, y eso arrastra tres cosas que no estaban en el sprint: la franja de home y
> Sobre mí pasa a enlazar a `/contacto`, la métrica primaria deja de ser los clics y pasa a
> ser los envíos, y **la CSP estricta con nonces se acciona** (era su disparador escrito).

**Las dos primeras se cumplieron. La tercera no, y ese es el hallazgo.** El disparador
escrito era «si Contacto incorpora un endpoint externo», y el envío acabó siendo una Server
Action del mismo origen: la CSP no se tocó. La tarea volvió a V4 en vez de quedarse
apuntando a un evento que ya había ocurrido sin dispararla (`DECISIONS.md` D96).

**Y arrastró una cuarta que nadie había previsto: la franja adelgazó.** El enunciado decía
que el formulario era lo ÚNICO que se añadía porque «email, teléfono, LinkedIn y CV ya los
daba la franja igual de bien». Al verlo montado, la conclusión fue la contraria: con una
página de contacto publicada, esos cuatro canales bajo el CTA de la home decían por segunda
vez lo que la página dice mejor. Se retiraron, y con ellos **la excepción `ContactSecondary`
de `BRAND.md`** —que llevaba desde el 2026-08-04 prediciendo por escrito que caería el día
que existiera una sección de contacto dedicada— y la regla que se había escrito para
sustituirla, que se quedó sin un solo caso el mismo día que nació.

**La medición cambió de naturaleza, no de herramienta.** El PRD decía que el clic en
`mailto:` era «un proxy de intención **porque no hay formulario en V1**». Con formulario, el
envío es el hecho. Se cuenta cuando el servidor confirma y no al pulsar: un clic que muere
en un campo mal rellenado no es un contacto, y contarlo infla justo la cifra que uno quiere
creerse. **Regalo no planeado:** la medición mejorada de GA4 manda `form_start` por su
cuenta, así que emparejado con `contact_submit` da la tasa de abandono del formulario sin
configurar nada.

**Lo que queda abierto y no es técnico:** el diagnóstico de GTM avisa de una tasa de
consentimiento cercana a cero. No es un fallo de configuración —este sitio exige
consentimiento a todo el mundo, no solo al EEE— pero significa que la analítica ve una
fracción de las visitas, y la métrica primaria nueva hereda ese límite. Es una pregunta de
producto, no un arreglo.

## 59. El sprint 4 se define contra un calendario, no contra la deuda (2026-08-23)

Con «Footer estructurado y Contacto ampliada» cerrado, **los tres sprints de V2 quedaban
entregados y el tablero no tenía sprint siguiente**: todo lo que quedaba eran bloques. La
pregunta «¿qué es lo próximo?» dejó de contestarla el orden de prioridad y pasó a ser una
decisión de producto.

**La propuesta de partida de Francisco eran tres bloques de trabajo interno** —resolver la
actualización del artículo, un foco en PageSpeed y un filtrado de `General`—. La objeción de la
revisión fue que sería **el primer sprint que no entrega nada que un visitante vea**, y que le
faltaba distribución: el check de medición acababa de dar **37 usuarios en 28 días y n=2 en la
métrica primaria**. Se acababa de construir el fondo del embudo y la boca no existía.

**La respuesta cambió el sprint entero, y no por la vía que la objeción esperaba.** Agosto está
parado en contratación en España —estacionalidad de verano—, así que el plan es **lanzar «Cómo se
ha creado esta página» en septiembre y medir desde ahí**. Eso no aplaza la distribución: la
reordena. El artículo *es* el vehículo, y el sprint que parecía de deuda interna resulta ser la
preparación del activo que se lanza.

Con esa vara, tres consecuencias que la propuesta original no tenía:

- **El carril del artículo sube de mantenimiento a activo.** Y con él, `contact_submit` en GA4
  pasa de higiene a **prerrequisito**: no se puede «medir como dice el artículo» si la métrica
  primaria no la cuenta nadie (D71, cierre del sprint 3).
- **P69.9 (distribución) se queda en `General` con la razón escrita**, en el D-entry y en la
  propia tarea. Un «no» silencioso vuelve como descuido en el cierre siguiente; uno escrito es
  una decisión.
- **TypeScript 7 se queda fuera** aunque el `method-review` lo encontrara: dos *majors* de salto,
  riesgo real de build rojo y **cero efecto sobre el lanzamiento**. La regla que lo decidió la dio
  Francisco: *método sano es la mejor forma de entregar rápido* — que es exactamente por qué el
  método entra cuando quita fricción del objetivo, y no cuando la añade.

El sprint queda en **17 tareas** bajo la etapa «Artículo y velocidad», y **abre por su tarea de
contenido**, que el `method-review` tuvo que crear: el trabajo existía —Francisco leyendo el
artículo con calma— pero vivía en el chat y no en el tablero, que es exactamente como el carril de
contenido se perdió una vez (§54).

## 60. La lectura del artículo destapa tres cosas que nadie buscaba (2026-08-24)

El artículo «Cómo se ha creado esta página» se lanza en septiembre, así que dejó de ser
mantenimiento y pasó a ser el activo del sprint 4. Francisco lo leyó entero y devolvió **18
puntos**, que se trocearon en seis tandas (A1 a A6) para no aplicarlos de golpe.

**Lo que pedía el encargo** fue casi todo copy: seis ajustes quirúrgicos, la redistribución
del capítulo 1 alrededor de la ESTRUCTURA en vez de dos bullets sueltos, dos mudanzas de
contenido (el contacto a la sección técnica, el vídeo a la de accesibilidad), los dos huecos
que faltaban —cómo se diseña hoy y qué le pasa al texto que escribe un desconocido— y un
capítulo entero nuevo, «06 — Automatizaciones», que llevó el artículo de once a doce.

**Y tres cosas que no estaban en el encargo**, las tres por comprobar el terreno antes de
escribir. Es el patrón que hace que esta entrada merezca existir:

1. **Dos «datos en vivo» mentían.** La pieza se llama así y solo uno de los tres lo era:
   los otros dos llevaban el número tecleado y habían caducado. Se corrigieron a mano antes
   de publicar el párrafo que los cuenta en pasado, y la solución de raíz quedó tareada.
2. **La A de Observatory no se descarta por coste** (P68.496): se descarta porque el HTML de
   Next no es reproducible entre builds. Lo que cambió no fue la decisión, fue el motivo,
   que pasó de «su disparador no ocurrió» a una medición (D26).
3. **El espacio entre párrafos no se pintaba desde P60** (D100), y lo destapó comparar la
   línea base de un prototipo con producción.

**Lo que se lleva de método:** las tres salieron de verificar contra la cosa real —el disco,
dos builds, la página servida— y ninguna la habría encontrado leyendo el código. La segunda
y la tercera invalidaban, además, la premisa con la que se iba a trabajar.

## 61. La tanda de método cierra siete tareas, y cuatro tenían la premisa equivocada (2026-08-25)

La T4 del sprint 4 era la tanda de higiene: peso de las skills, D6, la lista de excepciones de
`BRAND.md`, el guardián del tablero, el triaje de motion, la limpieza de ramas y la medición que
desbloqueaba P68.62. Se cerraron las siete y se retiró una octava.

**El patrón que las une no estaba en el plan: en CUATRO de las siete, medir contradijo el
enunciado de la propia tarea.**

1. **P68.655** daba por probable que la Fase 3 de `design-review` no se ejecutara nunca, porque
   «necesita navegador con sesión». Eso dejó de ser cierto en D52, tres semanas antes. No había
   fase muerta que retirar; lo que sí había eran 1.963 palabras reescribiendo el censo de
   `BRAND.md` y el axe de `viewport-verifier` — este último, además, **más al día que la copia**.
2. **P68.68** decía «dice una excepción y hay dos, porque D55 añadió el control sobre imagen».
   Falsas las dos mitades: ya decía dos, y el control del vídeo **no es una excepción** (sale de
   `.video-facade` en `globals.css`, que es una capa como lo es una variante). Y la que de verdad
   faltaba no estaba en la tarea: la tarjeta que se pulsa entera, escrita a mano **dos veces**, con
   la condición de salida ya cumplida.
3. **P68.62** se apoyaba en «~81% del LCP móvil es retraso de renderizado». Cinco mediciones del
   mismo despliegue dan una mediana de 154 ms y un rango de 137×. El 81% no era falso: era **una
   muestra** leída como propiedad (D108).
4. **P68.69** mandaba triar «los 5 hallazgos de la auditoría de motion». No existían por escrito
   en ninguna parte: ni en la tarea, ni en el repo, ni en Notion. El triaje se hizo sobre el motion
   real, contra el listón que la propia adopción de las skills había fijado.

**La lección, y es incómoda porque señala al único sitio que este proyecto no vigila.** El repo
tiene guardianes para el copy, los índices, las rutas, las figuras, el artículo, la paleta, las
skills y —desde hoy— el propio tablero. Todos nacieron de la misma frase: *una regla que hay que
recordar es una regla que se incumple*. Pero **las NOTAS de una tarea son prosa fechada que nadie
re-verifica**, y son justo lo que se lee para decidir qué hacer. Cuatro de siete llegaron a
ejecución con una premisa caducada, y ninguna lo habría dicho sola.

No se convierte en guardián: una nota de tarea no tiene fuente contra la que contrastarse, que es
lo que hace verificable a los otros nueve. Lo que sí cambia es el orden de trabajo: **al abrir una
tarea, medir la premisa antes de aceptarla**, sobre todo si trae una cifra. Salió gratis las cuatro
veces, y en dos de ellas evitó construir sobre algo falso.

**Y el guardián nuevo se validó solo.** `check:tablero` (D107) encontró en su primera corrida dos
pares de prioridades duplicadas y cuatro tareas sin `Área` — en un tablero que se creía ordenado.

## 62. Los dos sprints hacia septiembre: coherencia de las hermanas, con el activo que se lanza arrastrado dentro (2026-08-25)

Cerrado «Artículo y velocidad» —33 tareas, 32 hechas y una descartada—, **la propuesta de
Francisco fue dos sprints seguidos, los dos antes de septiembre**: primero las **tres páginas
hermanas** (Brand Kit, Design System, Accesibilidad) con una tanda por bloque, y después la
**home**, con más `General` dentro.

**La objeción de la revisión, y no es la que la propuesta esperaba.** Las tres hermanas y la
home son páginas del **sistema**, ya entregadas; lo que se lanza en septiembre es «Cómo se ha
creado esta página», y quien llegue por ahí y convierta pasa por `/contacto`. **Ninguno de los
dos sprints tocaba ni el activo que se lanza ni su enlace de conversión**, y los dos iban a
septiembre con un defecto conocido cada uno: `/contacto` publicando la tarjeta OG de la home
—probado byte a byte— y el artículo anunciando a Google que no cambia desde el 21 de agosto,
tras seis commits y un capítulo nuevo.

**La resolución no cambió el plan, lo completó:** los dos *Must* se **arrastran** al primer
sprint aunque no sean de su bloque, que es exactamente para lo que existe la regla de
movimiento. Entran como P70.03 y P70.04, por delante de toda la deuda de diseño.

**Y una tarea de contenido que no estaba y era el cuello de botella.** Francisco pidió revisar
si el contenido de Accesibilidad «es escueto para lo mucho que hacemos». Lo es, y **no por
volumen**: 7.120 caracteres frente a los 46.552 del Design System y los 82.906 del artículo,
siendo las tres las páginas donde el sitio se documenta a sí mismo. El diagnóstico que quedó
escrito en la tarea es más útil que la cifra: **la página publica lo que tiene cualquiera
—axe, Lighthouse— y calla lo que no tiene nadie**, empezando por que su censo mide el contorno
de cada control, que es WCAG 1.4.11 y axe no lo implementa. De paso apareció una afirmación
caducada —«aún no hay formulario»— en el bloque de límites, que es donde más cuesta.

**El orden lleva una dependencia dura escrita:** el discurso de esa página no se amplía
mientras sigan abiertos sus cinco hallazgos de NVDA. Subir el listón declarado justo donde el
sitio todavía falla es lo que esa página menos se puede permitir.

**Forma final.** «Páginas hermanas» abre con **28 tareas** (P70.01-P70.28): contenido primero,
los tres *Must*, los cinco de NVDA, cuatro de `General` por cupo, y las tandas de Design System
y Brand Kit. La home queda definida y en «Sin empezar», con **su carril de contenido —el kicker
del Hero— ya arrancado en paralelo**, que es lo que impide que abra bloqueada. Tres de las 28
son funcionalidad y no deuda (copy-to-clipboard, simulador de foco, ilustraciones animadas):
quedan señaladas como las primeras que salen si septiembre aprieta.

## 63. La página que documenta el sistema dejaba fuera justo la parte que no tiene nadie (2026-08-25)

**Accesibilidad medía 5.399 caracteres de texto renderizado contra los 8.934 del Brand Kit y
los 33.452 del Design System**, siendo una de las tres páginas donde el sitio se documenta a sí
mismo. El diagnóstico no era de volumen: `verify` publicaba las cuatro herramientas que tiene
cualquier proyecto —axe, Lighthouse, contraste, teclado— y callaba las tres que no tiene
ninguno; y `measures` era la lista genérica de nueve puntos sin el criterio que la sostiene.

**Pasa de cinco secciones a siete y a 12.066 caracteres** (11.550 en EN), dentro de la banda que
pidió Francisco: por encima del Brand Kit y por debajo del Design System. Las dos nuevas son las
que llevan el material propio. **«Herencia»** explica por qué cuatro de los nueve puntos no se
comprueban página a página, el atenuado que resuelve la superficie y el sello que decide cuándo
hay que volver a medir. **«El punto ciego»** cuenta qué encuentra una pasada a mano: el material
existía repartido en dos notas al pie, y con titular propio es un argumento en vez de una
anécdota. `verify` pasa de cuatro herramientas a ocho y `limits` de tres a seis, con los tres
que cuestan: nadie que use tecnología de asistencia a diario ha probado el sitio, un solo lector
y un solo navegador, y las pantallas por debajo de 320.

### Lo que se decidió NO publicar, que define la página tanto como lo que sí

**El número de pasos de CI**, cuando aún se escribía a mano: el artículo dibujaba diecinueve y
el workflow tiene veinte pasos nombrados, y dos páginas del mismo sitio con cifras distintas es
el drift que este repo persigue. *(Existía `{pasosCI}` derivado en `lib/figures.ts` y se
descubrió después; la decisión valía para el número tecleado, no para el derivado.)*

**Y el sello de un verificador externo.** Francisco propuso enlazar un informe de getwcag que
marca 100% y «Pass» en WCAG, Section 508, ADA y la **European Accessibility Act**. La sección 01
de esa misma página explica, con dos enlaces oficiales, que decir que este sitio «cumple la EAA»
sería inexacto: obliga a productos y servicios comerciales, no a una web personal. Enlazar el
sello habría puesto las dos afirmaciones a tres pantallas de distancia, y un «100% Excellent»
junto a una sección titulada «Lo que ninguna herramienta automática encuentra» se lee como
contradicción. Queda tareado citar el hecho —cero violaciones en un motor que no es el nuestro—
sin comprar su lista de normativas.

### La distinción que salvó la otra propuesta

Francisco propuso también la marca de **LoveA11y**, y a primera vista chocaba con lo anterior.
No es lo mismo: **un sello afirma que cumples una normativa; una marca de comunidad señala que
te apuntas a una idea.** Pero la defensa dependía del maquetado, así que el propio Francisco la
reencuadró y la dejó mejor: el hueco real no era decorativo. **«a11y» aparece UNA vez en toda
la página, sin explicar, en un rótulo del hero**, y la página cita axe, Lighthouse, NVDA y WCAG
sin enlazar ninguno. Lo tareado es un bloque de contenido que diga qué es el término, cómo se
usa aquí y a quién enlaza; la marca solo le da peso visual, y así deja de necesitar defensa.

### La sección de herencia estrenó diagrama, y con él dos hallazgos de método

El dibujo se eligió con `/prototype` entre tres direcciones: **matriz** (los nueve puntos con su
capa y quién los verifica), **bandas** (la proporción cuatro/uno/cuatro de un vistazo) y
**descenso** (qué baja ya puesto y qué nace en la página). Ganó la matriz por ser la única que
sostiene la segunda dimensión, que es lo que convierte la sección en criterio: ocho de los nueve
los comprueba una máquina y uno una persona.

Construirlo destapó dos cosas que no eran del diagrama, y las dos tienen entrada propia:
sacar `shared.tsx` de la carpeta del artículo **estrechó un guardián en silencio** (D112), y
`LiveStat` llevaba en la capa de artículo por vecindad y no por argumento (D113).

## 64. La revisión de las hermanas destapa que el Design System había cambiado de género (2026-08-26)

Francisco revisó las páginas hermanas tras el trabajo de las cinco tandas y preparó una lista
de ajustes. Dos de sus tres apartados eran retoques; el tercero no: *«creo que la página de
Design System se nos ha ido de las manos, antes aunque extensa estaba limpia y clara»*, *«al
final hay más texto que componentes»*, *«esta sección parece más un documento de trabajo»*.

**El diagnóstico tenía un punto de inflexión exacto, y no era el que él supuso.** Medido sobre
el diccionario: las secciones 01→07 promediaban **118 palabras** y las 08→18, **560**. Un
4,7×, y el corte está en la 08, no en la 07. Pero el problema no era la cantidad de texto:
**era que las secciones tardías habían cambiado de género**. Las primeras contestan «¿qué
valor uso?» —una tabla de consulta—; las tardías empezaron a contestar «¿por qué llegamos
aquí?»: *«estaba escrita a mano nueve veces»*, *«las dos nacieron dos veces»*, *«tres
definiciones que divergían en siete propiedades»*. Eso es arqueología, y su sitio es
`DECISIONS.md`. Estaba en los dos, que es lo que `BRAND.md` §Cómo se escribe una regla
prohíbe en su punto 5.

**Y el orden de las secciones era cronológico, no jerárquico.** Cada capa nueva se añadía al
final, así que el vídeo y los bloques de página habían acabado **debajo** de la capa de
artículo, que es la excepción del sistema y debería cerrar. La página pasa a **doce**
secciones ordenadas fundamentos → piezas → composición → excepción; con ese principio, «nada
debajo del artículo» sale solo y además queda dicho dónde va lo que se añada.

**Dos decisiones de alcance que no eran de copy, y las tomó Francisco.** El subapartado del
gris que pone la superficie se va de tipografía a claro y oscuro, porque es jerarquía de
superficies y no tipografía. Y la capa de artículo baja de **trece especímenes a seis**:
podar las notas la dejaba en 748 palabras y ahí topaba, porque el volumen no era prosa sino
catálogo. Los seis no son una selección libre — entre ellos tienen que aparecer los tres
archivos de `components/ui/` que declaran publicarse allí, o `check:indices` sale rojo.

**Resultado: 7.237 → 4.552 palabras (−37%).** Y aquí hay una corrección que conviene dejar
escrita: la estimación inicial fue 3.000, y era mía y estaba mal. Asumí que el volumen era
prosa, y en las secciones grandes es **inventario** — ocho variantes de botón, nueve niveles
tipográficos, trece piezas de artículo. La prosa de la sección más pesada bajó un 71%; lo que
no baja es el catálogo, porque es lo que se viene a consultar. Lo que sí se cumplió entero es
la queja de fondo: **cero arqueología**.

**Lo que la tanda destapó de rebote, midiendo.** Al comprobar el pliegue de Accesibilidad
—Francisco lo vio cambiando de pestaña— salió que **Contacto abría 74px por debajo de sus tres
hermanas**, y por un motivo distinto: no le sobraba alto, le faltaba. La invariante sube a la
capa (D64, ampliada). Y en el control de copiar, un arreglo resultó ser la mitad equivocada: se
etiquetó cuál de los dos hexes se llevaba el botón cuando el problema era que **el otro no se
podía copiar**. Se resolvió con `/prototype` y cinco direcciones, y de ahí sale el primer
`popover` del repositorio (D120).

**Y una cosa que no se hizo.** El sprint «Páginas hermanas» se queda sin tareas abiertas, pero
no se cierra: falta `design-review` sobre el resultado, y Francisco decidió lanzarlo con
contexto limpio antes del ritual de cierre.

## 65. «Páginas hermanas» cierra, y el method-review mide que la reducción de contexto fue una mudanza (2026-08-27)

**El sprint cierra entero**: 57 tareas archivadas, 1 descartada, cero abiertas. Ocho tandas, de
las que la última entró hoy en producción (PR #195, `main` = `7afda6d`). Lo que dejó, en una
línea: las tres páginas del sistema pasan a leerse como hermanas de verdad — mismo marco, mismo
índice, mismo cierre de sección, y una banda de bloque que rompe 60,3 pantallas sin un solo
cambio de fondo (D125).

### El hallazgo que llegó por la puerta de al lado

El `design-review` de la tanda encontró algo que **ningún gate automático podía ver, con los 22
pasos de CI en verde**: el ordinal de la banda nueva llevaba `opacity-70`, el censo lo puntuaba
con **15,32** —el anclaje, la mejor cifra del sitio— y la pantalla pintaba **5,97**. Durante ese
rato, la frase de §5 «cero pares bajo AAA en las catorce × 2 temas» era falsa por un par.

Se arregló en la rama antes de mergear (D127) y el censo pasó de 408 a 414 pares medidos. **La
lectura de producto no es la cifra**: es que la verificación automática comprueba lo que ya
sabemos comprobar, y solo una revisión manual descubre qué falta comprobar. Por eso
`design-review` sigue siendo caro y periódico en vez de sustituirse por un check.

### El check de medición cierra el bucle que el sprint anterior dejó abierto

El panel ya tiene el **cuarto marcador**: `contact_submit`, la métrica primaria de §7, que en el
cierre anterior contaba sin que ningún tile la enseñara (D71). Últimos 28 días: **1 envío de
formulario**, 9 clics de contacto, 4 descargas de CV, 48 eventos de scroll.

**Y la lectura honesta de esas cifras es que no hay lectura.** Son ventanas de 28 días rodantes
medidas con pocos días de diferencia, así que se solapan en más del 90%: los 9 clics son casi
los mismos 9, y las descargas «bajan» de 6 a 4 porque eventos viejos salen de la ventana, no
porque se descargue menos. Lo que hay no es una tendencia, es **falta de muestra**.

Eso movió una prioridad, que es justo lo que el paso 3 del check pregunta: **la tarea de
distribución sube a `Must` y por delante de todo el bloque de deuda técnica.** El argumento es
del propio producto: el instrumento funciona, el sitio está en AAA en las catorce páginas y por
encima de 90 en PageSpeed, así que **el cuello de botella dejó de ser la calidad y pasó a ser
que no lo ve nadie**. Seguir puliendo instrumentos sobre n=1 es optimizar el termómetro en una
habitación vacía.

### El sexto method-review: la familia nueva

Informe completo en el Artifact publicado ese día. Lo que importa para el registro:

**«La reducción que fue una mudanza»**, familia nueva del catálogo. Entre el 2026-08-19 y hoy,
los documentos `@`-importados bajaron un 30% (18.098 → 12.689 palabras) mientras las skills
subían un 55% (13.311 → 20.616). **El corpus total de instrucciones creció un 6%.** Se celebró
un recorte en el lado medido mientras el lado sin medir absorbía el coste y algo más.

La causa está escrita en la salida del propio guardián: `check:contexto` pone techo total a los
docs y techo *por entrada* a las skills, pero **ninguno a su suma**. Se aprobó atacarlo por dos
vías: cerrar el trasvase con un techo a la suma, y partir el porqué fechado de `CLAUDE.md` como
`BRAND.md` ya hizo con el suyo — que es la única de las cuatro alternativas evaluadas que
**reduce** en vez de trasladar.

**Y el desagüe de `General` resultó no necesitar una regla nueva.** Con 45 tareas abiertas y
**2 archivadas en toda la vida del bloque**, el cupo de «3-4 por sprint» quedó demostrado como
aspiración: drena *durante* la ejecución y los hallazgos se producen *en* los cierres, dos
momentos que no se solapan. Lo que lo resuelve es el plan de sprints de abajo, no un mecanismo.

### Los dos sprints que vienen, y por qué en ese orden

1. **«Home + General»**, abierto hoy con 14 tareas: las 5 de Home, 7 de `General` que generan
   dependencia con ella —el morado, el `text-wrap`, los dos de motion, `--border`— y las 2 del
   presupuesto.
2. **Después**, un sprint de **tareas mecánicas** que se ejecutan de forma autónoma, mientras
   Francisco revisa a fondo todos los contenidos de cara al lanzamiento. Es lo que drena
   `General` de verdad: unas 21 candidatas, todas guardianes, refactors y dependencias, ninguna
   con criterio de producto dentro.

El orden importa y es deliberado: **primero lo que pide criterio compartido, después lo que no
lo pide.** Al revés, la revisión de contenidos competiría con las decisiones de diseño de Home.

## 66. La distribución entra en el alcance del proyecto, y el orden se decide aparte (2026-08-27)

Al abrir el sprint «Home», la primera tarea de la cola no pedía construir nada: pedía
**contestar si la distribución es trabajo de este proyecto o no**. Estaba elegida por
omisión desde que el tablero existe — cincuenta y una tareas abiertas y **cero sobre
tráfico** — y el check de medición del cierre anterior la había puesto delante de toda la
deuda técnica.

### El dato que la adelantó

Panel de Looker, 28 días:

| Marcador | Valor |
|---|---|
| Usuarios | 37 |
| Clics de contacto | 9, de **2 usuarios** |
| Descargas de CV | 4, de 2 usuarios |
| **Envíos del formulario** (métrica primaria, §7) | **1** |

Con n=1 en la primaria, esa métrica no es débil: **no puede discriminar nada**. Ningún dato
de ahí puede informar una priorización, así que el bucle medir→aprender que declaran el
método y la propia web está cerrado en la mitad de medir y vacío en la de aprender.

Y lo bueno del cierre anterior es que **ya no queda nada que arreglar aguas arriba**: el
instrumento funciona, el sitio está en AAA en las catorce páginas por dos temas, PageSpeed
por encima de 90 y el SEO resuelto. **El cuello de botella dejó de ser la calidad del sitio
y pasó a ser que no lo ve nadie.**

### La decisión, y es de dos partes

**Sí, entra en alcance** (Francisco, 2026-08-27). El sitio no es solo un soporte para
conversaciones que se abren por otra vía, así que conseguir que alguien llegue a él es
trabajo del proyecto y no un extra. La otra respuesta era legítima y su consecuencia habría
sido sobre la MEDICIÓN, no sobre el marketing: con este volumen los tres scorecards no
informan nada y el paso de medición del cierre debería decirlo en vez de repetir tres cifras
planas.

**Pero no en este sprint.** Primero se cierra la deuda de diseño de «Home», que es lo
comprometido. La tarea sale del sprint activo y vuelve a `General` con la prioridad justo
detrás de la última de «Home».

### El riesgo asumido, escrito para que no se lea como olvido

Es la opción que más se parece a no decidir, y conviene decirlo. La diferencia es que ahora
hay fecha y hay sitio en la cola: el siguiente check de medición **no la levanta como
descuido, la levanta como pendiente con orden**. Si al cerrar «Home» la métrica primaria
sigue en n=1, esta es literalmente la siguiente.

### Lo que sigue sin definir

El **cómo**. Los candidatos —publicar el artículo en LinkedIn y en comunidades de producto,
enviar el enlace directamente al ICP de §2, SEO de cola larga sobre lo que el sitio ya
documenta, el README de perfil de GitHub— siguen sin evaluar. Esa parte se resuelve cuando
la tarea entre, no ahora.

## El sprint «Home» cierra, y el siguiente se parte en dos carriles — 2026-08-28

**Entregado.** «Home» cierra con **12 tareas** y sale a producción entero en `acece01`
(PR #197, squash, 19 commits, 35 archivos). Cuatro hilos: el presupuesto de contexto gana
techo a la suma de las skills y `CLAUDE.md` parte su porqué a un histórico; tres decisiones
bajan a la capa (equilibrado de línea, destello del toque, el filete por superficie); el
motion deja **D135** y **D136** y el punto del titular resulta ser dos piezas (**D137**); y
la parte visible son el nodo `WebSite` con su `isPartOf`, la casilla que no estaba en la
capa, y el kicker del Hero.

**El kicker, porque el diagnóstico de su ficha era medio correcto.** Decía «sopa de
keywords» y proponía listar menos. Lo que la fila hace es **filtrar** —rol, seniority y
stack en el escaneo de 5-10 s del ICP de RRHH (§2)—, así que las direcciones que la
convertían en afirmación («Diseño y construyo lo que gestiono») le daban el trabajo del
titular. Se afila el vocabulario, no la forma: **«Senior Product Manager · UX · SaaS · IA ·
Builder»**. «Builder» es el único de los cinco que no es una categoría que cualquier PM
lista, y es lo más cerca del founder que cabe sin quemar el reveal gradual de §3.

### El check de medición queda PENDIENTE, y se escribe como pendiente

No se hizo: la sesión no tenía acceso a GA4 ni a Looker. **La cifra de partida contra la que
leer sigue siendo la de D71** (28 días hasta el 2026-08-24): `contact_click` 9 ·
`file_download` 6 · `scroll` 62 · **`contact_submit` 1**, con 46 usuarios.

Lo que sí se verificó, por el lado del repo, es el **instrumento**: `trackContactSubmit`
sigue empujando `contact_submit` al `dataLayer` y solo se llama con `state.status === "sent"`,
o sea cuando el servidor confirma. Y la pregunta 3 se contesta con un «no» escrito: la
ventana se solapa casi entera con la del cierre anterior y cuatro días no producen lectura
nueva. **Distribución sigue en alcance, y es el tercer cierre que lo dice.**

### «Drenaje»: dos carriles a la vez, y por qué eso no es partir el trabajo por la mitad

El cuello de botella dejó de ser técnico. Lo que decide si el sitio está listo para lanzar es
si **el contenido aguanta una lectura entera**, y eso solo lo hace Francisco. Pero es lento, y
dejar el repo parado mientras dura sería tirar el tiempo.

Así que el sprint corre **en paralelo**: Francisco relee las catorce páginas apuntando lo que
vea, y en paralelo se drena la deuda que no pide criterio. **La salida de la lectura es el
sprint siguiente**, el de mejoras de contenido; la de las tandas, un tablero limpio.

**Y el orden de las tandas no lo manda la prioridad: lo manda cuánto se VE lo que tocan.** Si
el sitio cambia bajo los pies de quien lo está leyendo, sus notas caducan mientras las
escribe. Por eso van primero los guardianes y la deuda de `scripts/` (invisibles), después los
refactors que cierra un `gate:html` vacío, y **al final** lo que se ve en el artículo y el
Brand Kit, con una condición explícita: esa tanda no empieza hasta que esas dos páginas estén
leídas.

**Eso obligó a renumerar el sprint entero**, y conviene decir por qué: `CLAUDE.md` dice que
`Tanda` no es un eje de ejecución y que quien manda es `Prioridad`. Con las tandas ordenadas
por visibilidad y las prioridades heredadas de sus bloques, las dos cosas se contradecían —
ejecutar la tanda 1 significaba saltarse tareas de prioridad menor. Las 30 pasan a la banda
**50.705 → 50.99**, contigua y por delante de los bloques, que es donde tiene que estar el
sprint activo. Es la excepción que la propia regla contempla: reestructuración completa, no
inserción puntual.

### Lo que este sprint hace y no se ve en su lista: drenar `General`

`General` tenía **45 tareas abiertas** y ningún sprint que lo drene, porque la regla de
movimiento («cambia de `Etapa` al sprint que la toca») funciona para bloques de página y no
puede funcionar para uno transversal. Su único desagüe histórico había sido **inventar un
sprint de método**, dos veces. Este no lo es: es un drenaje, y **sale gratis porque el trabajo
de producto está bloqueado en la lectura, no compitiendo con ella.** `General` queda en **18**.

### Tres tareas descartadas por premisa caducada

Y se escriben en su ficha, que es lo que impide que vuelvan:

- **P86.5 «Introducir tests»** y **P75 «¿Sigue vigente D11 (sin tests)?»** — el umbral que
  pedían llegó con el formulario de Contacto. Hay cuatro suites, `npm test` está en CI y
  tienen su caso malo en `check:guardianes`. La decisión se tomó **construyendo**.
- **P71.61 «Skills sin estrenar no se puede medir»** — resuelta **retirando el indicador**,
  que era su propia conclusión. Una fila muerta en una tabla de umbrales es peor que no
  tenerla, porque da sensación de cobertura.

## «Drenaje» cierra con su medición hecha por fin, y el lanzamiento reencuadra qué entra en «Voz» — 2026-08-29

El ritual completo en una sesión: `sprint-review`, las 29 archivadas, el check de medición,
`SELLO_GENERAL`, `method-review` VIII y la apertura de «Voz». Lo que lo distingue de los dos
cierres anteriores es que **el punto 12 dejó de escribirse «pendiente»**.

### El check de medición se hizo, y llevaba dos cierres sin poder hacerse por una suposición falsa

«Home» y el primer intento de «Drenaje» lo cerraron escribiendo *«no tengo acceso a GA4 ni a
Looker»*. **Era falso.** El navegador de la sesión usa el perfil de Chrome de Francisco, así que
los dos cargan autenticados; se leyeron en tres llamadas. Dos ciclos del bucle medir→aprender
perdidos porque nadie comprobó la suposición — en la skill cuyo punto 12 nació precisamente
porque cinco etapas se habían cerrado sin medir.

El arreglo no es la anécdota: **el punto 12 nombraba el panel y no decía cómo llegar a él.** Una
regla sin portador, en el documento que las caza. Ahora lleva el cómo, y con él dos cosas que el
panel solo no da:

- **No basta el panel.** Publica «número de eventos»; las lecturas que han valido algo salieron
  de la columna de **usuarios** de GA4 → Informes → Interacción → Eventos.
- **La ventana es RODANTE.** `file_download` cayó de 6 a 1 entre los dos cierres y parecía una
  regresión del cambio de anclas del Brand Kit. No lo era: las dos ventanas comparten 24 de sus
  28 días, así que cinco de las seis descargas estaban en los cuatro días de julio que salieron
  del recuento. *Antes de leer una caída, comprobar si el solape la explica.*

**Las cifras (GA4, 1-28 ago 2026, 425 eventos y 46 usuarios):** `contact_click` 9 / 2 usuarios ·
`scroll` 41 / 10 · `file_download` 1 / 1 · `form_start` 1 / 1 · **`contact_submit` 1 / 1**.
Usuarios planos (46 → 46) frente a la línea de D71. Distribución sigue delante por **cuarta**
vez, y esta vez con un «no» escrito y un dato detrás.

### El instrumento medía mal, y no por donde se miraba

La pregunta 4 —«¿sigue midiendo bien el instrumento?»— dio el hallazgo del cierre. `contact_submit`
se dispara con `state.status === "sent"`, que es lo que D71 dejó garantizado. **Lo que nadie había
mirado es que ese estado tiene tres causas**: el envío real y los dos filtros que callan, el
honeypot y el suelo de 3 s. Solo una manda correo.

El silencio del servidor hacia el bot es correcto y los tests lo fijan a propósito. Propagarlo a
la analítica no lo es: **con la primaria en `n=1`, un falso positivo la deja en cero**, y el
camino de los 3 s lo puede recorrer una persona que pega el mensaje y pulsa. `PRD-Live` §7 se
corrigió el mismo día, sustituyendo el párrafo que afirmaba que la cadena estaba entera.

### `method-review` VIII: seis hallazgos, y ninguna familia nueva

Que no naciera ninguna familia **es** el resultado: los seis caen en cuatro que ya existían, o
sea que el catálogo cubre lo que este método produce. Los tres primeros son la misma forma —**un
indicador que mira al sitio equivocado**—, y el más instructivo es el primero:

**La fila «¿sprint de método abierto en el ciclo?» contestaba «No» leyendo el NOMBRE del sprint.**
«Drenaje» no se llamaba de método y lo fue: **15 de sus 29 tareas eran Infra**, y su diff añadió
**2.686 líneas de verificación contra 757 de producto — 3,5 a 1**. La fila se retira y la
sustituyen dos que miden composición: % Infra del sprint que cierra, y verificación÷producto de
su propio diff. La parte justa, que también se midió: **«Voz» corrige el desequilibrio sola**,
con un 68% de tareas de cara al usuario.

Los otros dos: `sprint-review` nombraba el panel sin decir cómo (arriba), y **«verificación ÷
producto» cruzó su umbral sin decir qué divide entre qué** — hubo que reconstruir la definición
probando cuatro candidatas contra el 0,40 histórico, y tres definiciones razonables daban 0,47,
0,52 y 0,62 sobre el mismo árbol. La skill se había escrito esa regla a sí misma en su sexto
disparo; la fila era anterior y sobrevivió sin cumplirla. *Al heredar una tabla, se auditan
también las filas viejas.*

**Y los ajustes se pagaron retirando, que es lo que hace que esto no sea un método que solo
crece.** La suma de skills tenía 57 palabras de holgura y las adiciones costaron 376:
`check:contexto` salió rojo, y hubo que **retirar 376 palabras** de las narrativas de disparos
anteriores conservando todas sus reglas. Es la corrección del séptimo disparo funcionando un
ciclo entero sin que nadie tuviera que acordarse — **0 techos movidos, contra 2 en el anterior**.

### La apertura de «Voz» la reencuadró una pregunta de Francisco

Con el sprint ya abierto, preguntó por qué quedaba deuda de Sobre mí y del Brand Kit fuera si
este sprint tiene que dejar listo el lanzamiento. **El filtro correcto no es de qué bloque es una
tarea, sino qué tiene que ser verdad el día de lanzar** — y el lanzamiento no es un sprint con
tareas, es un release, así que lo que no esté en «Voz» no está.

Ese filtro metió seis, y **la más urgente no estaba en la lista original**: el artefacto de
Emendu pinta sus 44 rótulos a **5,4px** en una página que se lanza, es **peor que los 5,0px** que
ya se consideraron bloqueantes en el artículo, y `check:figuras` **lo imprime en cada corrida de
CI** bajo «medidos y NO juzgados». Con él, el LCP y las imágenes de Sobre mí —que **cierran antes
que el re-sellado de PageSpeed**, o hay que medir contra producción dos veces—, el kicker de
`/contacto`, y el par del kit acoplado por archivos.

**Y una se quedó fuera con su motivo escrito:** la medición de `file_download` del Brand Kit no
se puede ejecutar hasta que exista una ventana de 28 días posterior al cambio de anclas. Meterla
habría sido programar una tarea que solo puede contestar «todavía no».

El coste, dicho: **el cupo de `General` se fue a 6 contra una regla de 3-4** y el sprint creció
un 29%. Es un desbordamiento consciente —drena más, no menos— y `General` quedó en 16, lo más
bajo que ha estado.

### Dos discrepancias del volcado que ningún guardián podía ver

Al sincronizar el tablero aparecieron dos: una tarea creada por otra sesión que **no estaba** en
el volcado, y una de «Home» archivada que **seguía** como «Listo». O sea que todos los
`check:tablero` de la sesión —incluido el que validó el cierre— corrieron sobre un tablero que no
era el real. No cambió ninguna conclusión, porque ninguna de las dos afectaba a un recuento que
se usara, pero es la misma familia que todo lo demás del día: **el guardián afirma «45 tareas en
el volcado» y no puede saber cuántas le faltan.** Queda sin tarear a propósito, con el cupo ya
desbordado.


## La tanda 1 de «Voz», y el cruce que puso la métrica primaria en su sitio — 2026-08-29

Seis tareas cerradas (P51 → P55) y una que se quedó abierta a propósito. Lo que distingue a
esta tanda es que **el hallazgo grande no salió de ninguna de sus fichas**: salió de cruzar la
bandeja de entrada con GA4, que es un sitio donde nadie había mirado.

### El criterio de «Voz» funcionando, con su medida

El sprint se abrió para que el artículo dejara de contarse desde lo que se rompió. §04 cambió
de tesis con el mismo presupuesto —459 palabras de «tres sorpresas de estrenar versión» pasan a
483 de «por qué estas piezas»—, §06 explicó por fin el trámite de alta de una pieza, y §01 dejó
de describir un mecanismo que la página no tiene: la doble lectura no está repartida entre el
índice y el deep-dive, está **dentro** del deep-dive.

Y la tanda dejó dos mediciones que cambiaron el alcance de su propia tarea:

- **Las negritas tienen un ritmo, y se puede contar.** Las zonas tratadas caen en 68-101
  palabras por negrita, y §11 —que ya venía marcada y sirve de referencia— en 87. Contra eso,
  §04 salía a **1 cada 813**: el bloque más plano del artículo, y era el que se acababa de
  reescribir tres commits antes. La ficha lo excluía porque «en esas la negrita se decide al
  escribir el texto nuevo», y al escribirlo no se hizo. *Una exclusión que confía en que el
  paso anterior hizo el trabajo necesita comprobar que lo hizo.*
- **Un contador se fue con un párrafo.** El de §08 que se borró por denso llevaba «las
  catorce», el único contador de páginas tecleado que quedaba vivo en el artículo. Los dos que
  quedan no lo son —«la página catorce» es retórico y «el mes catorce» son meses—, así que la
  tarea del contador del Design System no hereda nada de aquí.

### El cruce que nadie había hecho: la bandeja contra GA4

El check de medición del cierre anterior dejó dos preguntas abiertas sobre la métrica primaria:
**qué** cuenta y **a quién** cuenta. Las dos se contestaron el mismo día, y la segunda solo
porque Francisco trajo tres correos de spam que habían entrado por el formulario.

**Qué cuenta.** `contact_submit` se disparaba con `status: "sent"`, y ese estado tiene tres
causas de las que solo una manda correo. Se arregló, y el arreglo tiene su decisión técnica
aparte (D153).

**A quién cuenta.** Los 9 `contact_click` con 2 usuarios que llevaban dos cierres sin verificar
son **tráfico propio**, y lo que lo cierra no es que sean de Valencia, que es circunstancial:
es la fecha. Los nueve cayeron el **lunes 3 de agosto**, que es el día en que se construyó y
desplegó ese mismo evento —`5aa6402`, «tracking de clics mailto/tel vía dataLayer»—, en un
escritorio (7) y un móvil (2), y ni uno después. Son la verificación del propio instrumento.
*Dos personas mostraron intención* era, medido, **cero**.

**Y el spam no explicaba nada de eso, pero destapó otra cosa.** Los tres correos entraron por
el formulario tres semanas después, así que no tocan a `contact_click`. Lo que enseñan es el
otro lado: GA4 registró **cero eventos** por los tres, incluido el del 28 de agosto a las
21:38, en una ventana que ya lo incluía. La causa es el consentimiento —sin aceptar no carga
GTM—, de modo que **la primaria no cuenta envíos: cuenta envíos de quien aceptó cookies**, y la
diferencia medida es 1 contado contra 4 entregados. Es la primera cifra real detrás de la
tarea de la tasa de consentimiento, y abrió una nueva: los tres pasaron el honeypot y el suelo
de 3 s, o sea que los dos filtros cazan al bot ingenuo y a nadie más.

De paso quedó descartada la hipótesis cómoda: **el único `contact_submit` no es spam.** Lleva
un `form_start` delante, el mismo día y el mismo dispositivo, un móvil Android. Es una persona.

### El arreglo elegido no es el que proponía la ficha, y el motivo es el caso medido

La ficha decía «ampliar el tráfico interno más allá de una sola IP: una IP adicional o un
parámetro de depuración». **Pero de los dos usuarios contaminantes uno era un móvil**, o sea
fuera de cualquier IP fija: la vía de las IPs habría cubierto el escritorio y dejado fuera
justo el caso que apareció. *Un arreglo que no cubre el caso que lo motivó es peor que ninguno,
porque cierra la duda sin cerrarla.*

**Lo elegido es no aceptar cookies en los dispositivos propios**, y funciona por el mismo
mecanismo que acabábamos de medir con el spam: sin consentimiento no carga GTM, así que no hay
evento. Cobertura total, coste cero y efecto inmediato, sin tocar la configuración de la cuenta.
Su única grieta es que **para verificar la medición sí hay que aceptar**, que es exactamente el
tráfico del 3 de agosto, así que la regla completa lleva la excepción dentro: rechazar por
defecto, aceptar solo mientras se verifica, y anotar el día.

**El parámetro de depuración se descarta con su motivo escrito**, que es lo que impide que
vuelva en cada revisión: es una tarea de GTM más código, no un ajuste, y con el lanzamiento la
proporción de tráfico propio cae sola. Se reabre si alguna vez estorba, no antes.

**Y lo que no arregla ninguna de las tres:** los filtros de GA4 no son retroactivos. La serie de
agosto se queda contaminada haga lo que haga, y lo único que valía ahí es lo que ya está hecho,
dejarlo escrito.

**Y el embalse transversal sube a 17.** La tarea del spam nace en `General` y no en un bloque
de página porque hoy no hay bloque de Contacto vivo y porque la mitad del hallazgo es de
medición, que es transversal. Se anota aquí porque el sprint ya había desbordado su cupo a 6 y
esto lo empeora: el próximo cierre se mide contra un sello de 19 con el embalse subiendo.

### Y una regla de método que salió de un rojo

`check:guardianes` reportó «4 guardianes sin dientes» y los cuatro eran **el mismo**,
`check:contexto`, rechazado por fallar ya sobre el árbol limpio. Estaba rojo porque la nota
nueva de `PRD-Live` §7 se pasó del techo por 19 palabras, y se pagó retirando, no subiendo el
techo. Lo que conviene recordar es la forma: **un guardián en rojo por otra causa deja sin
valor a todos sus casos malos, y el informe lo presenta como fallos distintos.**

## La tanda 2 de «Voz», y el diagrama que se arregló mirándolo — 2026-08-29

Seis tareas cerradas (P55.5 → P59.5). Cinco eran de voz y salieron como estaban previstas;
la sexta era la única de código, y **es la que enseña algo**: su ficha nombraba la palanca
equivocada, la medición la confirmó, y lo que la tumbó fue mirar el dibujo.

### El criterio de «Voz», aplicado a cinco rótulos

Las cinco de copy comparten forma: **algo que ocupa el sitio de otra cosa.** Las cuatro cards
de §03 de Accesibilidad bajan de 433/421/423/400 a 269/269/282/270 caracteres, y lo que sale de
las cuatro es el mismo material —el relato de cómo se descubrió la regla—, que es el defecto que
P51 acababa de corregir en el artículo y que aquí aparecía por segunda vez. «Herencia» pasa a
«Accesibilidad heredada» porque sola en un índice no decía nada; «Sin usuarios reales» pasa a
«Testing de usuarios» con un «(que yo sepa)» dentro, porque nadie puede saber quién ha visitado
el sitio con un lector de pantalla. Y el kicker de `/contacto` deja de repetir su propia miga de
pan: **«Aquí estoy»**, elegido por Francisco entre dos que propuso él mismo, descartando
«Conectemos» porque comparte forma verbal con el titular («Hablemos») y cambiaba un solapamiento
por otro.

**Dos fichas traían la premisa mal, y las dos veces el descarte valía más que la tarea.** La de
la fila «Norma europea» mandaba mirar si la palanca estaba en la capa: **no lo estaba**, y se
midió —las cuatro tarjetas ya medían 187px iguales, lo descompensado era el relleno: 23, 23, 45
y 113px de texto—, así que el recorte se eligió probando tres candidatos en el DOM hasta dar con
el que pinta 45px, lo mismo que su hermana. Y la del `indexLabel` avisaba de comprobarlo «en el
riel»: `/accesibilidad` **no tiene riel**, solo lo montan el artículo y el Design System.

### La palanca de una ficha puede estar medida y aun así ser la equivocada

`check:figuras` llevaba desde el 2026-08-24 imprimiendo en cada corrida de CI que los 44 rótulos
del artefacto de Emendu se pintan a **5,4px a 360**, contra los 11px del contrato. La ficha, y
D54 antes que ella, decían que la palanca era **re-renderizar con una tipografía mayor**. Se hizo
y funcionó en la cifra: 56 unidades dan 11,3px. Lo que no se había previsto es lo que se ve:

- **Recoloca el grafo entero.** Mismos 22 nodos, 22 aristas, 20 etiquetas y 5 clusters
  —comprobado uno a uno—, pero dagre vuelve a correr desde cero. *En una máquina de estados la
  colocación es parte de lo que se cuenta*, que es literalmente el argumento con el que D54
  había elegido el ancho de panel: la decisión se contradecía a sí misma.
- **Los cinco títulos de cluster quedan tapados por un nodo** (71/57/33/17/0%), por un fallo de
  Mermaid que resta el alto del título del alto del cluster en vez de sumarlo. Sin ajuste
  posible y sin tamaño intermedio limpio.
- **El rótulo se leía tan grande como la prosa**, 17,6px contra los 17 del cuerpo.

Los cuatro defectos los señaló Francisco abriendo la página, no una medición. **La cifra estaba
bien y el resultado era peor**, que es el caso que ningún gate puede cazar: `check:figuras`
habría dado verde. Se resolvió por la otra palanca —el `min-w` de 46 a 96rem, 11,21px con el
dibujo intacto— aceptando el coste escrito: el diagrama ya no entra en el panel en escritorio.

### El metro acertaba por coincidencia, que es peor que fallar

De paso salió que **`check:figuras` no sabía leer este lienzo**. Su último recurso llamaba a
`getComputedStyle` de jsdom, y **jsdom no registra un `<style>` que vive dentro de un `<svg>`**:
`document.styleSheets` sale en 0 y devuelve su tamaño por defecto, 16px, para cualquier SVG de
Mermaid. El artefacto declaraba justamente 16, así que su cifra publicada era correcta **por
casualidad**, y solo se cayó al re-renderizarlo: el gate siguió diciendo 16 y bajó la cifra a
3,2px, o sea peor cuanto más grande el rótulo.

Es el sexto metro de este repo que falla en silencio, y trae un matiz nuevo. **La guarda que lo
cubría miraba al sitio equivocado**: comprobaba que la hoja del SVG declarase `font-size` y
luego se lo preguntaba a quien no había leído esa hoja. *Una guarda que valida la entrada de un
tercero y no su respuesta no protege de nada.*

### Y un contrato que llevaba cinco días siendo falso sin que nadie lo notara

La tabla de `PRD-Live` §5 promete, por gate, **qué garantiza y qué deja fuera**. La fila de
`check:figuras` decía «el rótulo pintado de **toda** figura con lienzo escalado», y desde el
2026-08-24 dos figuras estaban medidas y **no juzgadas** por una decisión legítima que la fila
nunca recogió. La tabla existe justo para que un alcance recortado no quede en silencio, y aquí
el recorte lo cantaba el propio informe del gate en cada corrida mientras el contrato decía otra
cosa. **Hoy la fila es cierta sin haberla tocado**, porque la excepción se retiró al retirarse su
causa. Lo que queda anotado es el modo de fallo: *un contrato que se escribe una vez y se
comprueba a ojo caduca por el lado que nadie relee.*

## La tanda 3 de «Voz», y las dos veces que la medición mandó sobre la intuición — 2026-08-29

Cinco tareas cerradas (P60 → P63). Tres pedían `/prototype`, que solo dispara Francisco, y se
resolvieron por el acuerdo de esta sesión: **se implementa la recomendación, se publica un
artefacto con la medición de cada decisión y la alternativa descartada, y se revisa después.**
Funcionó, y lo que lo demuestra es que una de las tres se revirtió al verla.

### El contenido: publicar lo que ya existía, y borrar cifras en vez de derivarlas

**§05 del Brand Kit prometía «dónde vive el logo» y enseñaba dos superficies del propio
dominio**, mientras `PRD-Live` §4 ya declaraba tres usos fuera de él —firma de email, banner de
LinkedIn y portada del repositorio— como «la prueba de coherencia que un sistema de marca solo
puede dar fuera de su propio sitio». No faltaba contenido por inventar: faltaba publicar lo que
ya está versionado en `brand-assets/`. La sección pasa a dos grupos y el eje es **quién sirve la
pieza**: «En el sitio», donde se baja, y «Fuera del sitio», donde solo se coloca.

Francisco eligió los tres **sin descarga**, y la falta de previsualización es consecuencia del
mismo argumento: son artefactos reales que viven fuera de `public/`, así que recrearlos en JSX
daría una maqueta que se desincroniza del artefacto sin que nada falle. *La página de marca
publica piezas reales o no publica ninguna.* La portada del repo entra **con su límite escrito**:
la sirve GitHub desde sus ajustes, no acepta una URL, y por eso no lleva ni una cifra — que es el
argumento de D60 puesto en la página que lo demuestra.

**Y los contadores del Design System se borran, no se interpolan.** La relectura pedía cambiar
dos apariciones de «las catorce páginas»; en el disco había **cuatro**. Se podía derivarlas de
`PAGE_COUNT` como ya hace `liveStatValue`, y habría sido peor: ninguna de las cuatro frases
necesita la cifra para decir lo que dice. Es **D149** llevado al final — *un contador que se puede
borrar no necesita guardián*—, y lo que se conserva es el matiz que las frases defienden: «a la
vez». Lo que argumentan no es cuántas páginas hay, es que la decisión se toma una sola vez.

### §10 se leía en un orden que ninguna página tiene

El bloque que publica las piezas de composición de página abría por la tabla, ponía el cierre de
página tercero y dejaba el índice a mitad de sección. Las siete piezas eran correctas: fallaba la
**secuencia**. El orden nuevo es el de una página de arriba abajo, y por eso no lleva rótulo que
lo explique.

**El cambio de fondo es que el par de navegación se parte.** El índice y el cierre de sección son
hermanos de familia pero **no de posición** —uno va debajo del hero y el otro al pie de cada
parada—, así que publicarlos juntos era justo lo que metía el índice en mitad de la sección.
Partidos, `SectionCloser` queda pegado a `PageCloser`: la nota que ya decía «su hermana de
peldaño» sigue siendo cierta y **ahora además se ve**.

### Las dos veces que la medición mandó, y las dos fueron correcciones

**La primera me corrigió a mí.** El tramo plano de 14,1 pantallas se partió primero **por
familia** —las tres decisiones de medida contra las dos que no se miden en píxeles—, que es el
corte que parece obvio leyendo los títulos. Medido, dejaba el tramo malo en **10,9**: el peso no
está repartido, §01 «Rejilla» mide ella sola 5,88 pantallas. El corte que funciona es tras §02, y
es la única de las cuatro particiones posibles que cabe entre el suelo y el techo.

**La segunda la hizo Francisco viendo la página, y tumbó la solución entera.** El corte se había
resuelto con una **segunda banda negra**, y el argumento contra no es de gusto: *la banda
significa «empieza otra familia», y entre §02 y §03 no empieza ninguna.* Comprar ritmo con una
banda ahí es comprarlo diciendo algo falso, y de paso gastar la moneda — cinco bandas en una
página hacen que ninguna signifique gran cosa. Se rehízo cambiando el fondo a `--muted` sin banda:
**mismo ritmo exacto, una banda menos y media pantalla menos de página.**

Y eso destapó que la regla de D125 no estaba incompleta sino **contradicha**: con la banda como
única herramienta, romper un tramo largo costaba un bloque, así que el suelo empujaba contra el
techo en cuanto una página creciera. El detalle técnico, en **D154**; el del riel, en **D155**.

*Las dos correcciones tienen la misma forma y merece la pena verla junta: en la primera, una
intuición razonable con la medición en contra; en la segunda, una implementación medida y
correcta con el significado en contra.* Ningún gate podía cazar la segunda: `check:palette` y el
censo daban verde con la banda puesta.

### Dos premisas de ficha caducadas, y las dos se cerraron con un `grep`

- **P62** avisaba de comprobar que las anclas siguieran resolviendo al reordenar. **No aplica**:
  `ORDEN` y `construirRecorrido` operan a nivel de sección y aquí se reordena *dentro* de una.
- **P63** decía que el riel lo pisan «el Design System (12) y el artículo (12)». **P70.415 lo
  retiró de las tres páginas del sistema**: hoy su único consumidor es `/como-se-ha-creado`. Se
  descubrió al ir a verificarlo y no encontrar riel donde la ficha decía que había uno.

Van cinco fichas caducadas en tres tandas. La regla que las caza —*verifica la premisa contra el
disco antes de darla por mecánica*— sigue pagándose sola.


## La tanda 4 de «Voz»: dos premisas de ficha que no aguantaron la medición — 2026-08-29

Cuatro tareas de código (P63.5 → P64.6), y **dos de las cuatro fichas resultaron estar
razonando con una cifra o una causa equivocada**. No es anécdota: es la razón por la que la
convención dice verificar la premisa contra el disco antes de dar una tarea por mecánica. El
descarte es el hallazgo, y las dos veces se escribió en la ficha.

### La invariante del pliegue deja de depender de un gate

Las tres aperturas del sistema —Brand Kit, Design System, Accesibilidad— estaban escritas tres
veces, y lo que las mantenía coherentes era `npm run pliegue`, un gate por medición, después de
tres roturas que siempre vio un ojo. Ahora salen de una pieza y no pueden divergir; el gate pasa
a red de seguridad. El detalle técnico, con **qué NO sube** y el descarte de Contacto, en
`DECISIONS.md` D156.

Lo que importa desde producto es el corte, porque es el que impide que esto siga: **sube lo que
tiene una invariante que proteger, no lo que solo comparte silueta**. Los `index.tsx` de las tres
hermanas siguen pareciéndose y se quedan como están — lo que repiten es que son la misma clase de
página, y factorizarlo escondería justo lo que esos archivos existen para enseñar.

### «La navegación no aterriza arriba»: 340 navegaciones y el síntoma no aparece

La ficha describía que al pulsar un enlace interno la página destino abría a media altura, «más o
menos donde estaba el scroll en la de origen», y traía cuatro sospechas. Se midió el `scrollY`
después de **340 navegaciones**: cada enlace interno de diez páginas, a 1920×1080 y a 1280×618,
desde el fondo y desde la mitad, contra el build de producción **y contra producción**, en cadena
sin recargar, tras pulsar un ancla, con enlaces a la página en la que ya estás, con el conmutador
de idioma y en `next dev`. **Todas aterrizan arriba.** Las tres primeras sospechas quedan
descartadas por medición, no por opinión.

La cuarta era la buena, y llevaba a un defecto real que ninguna de las dos descripciones habría
encontrado: **`/contacto` → `/cookies#privacidad` es el único enlace interno del sitio que
arrastra un hash**, y su destino era el único sitio con ancla sin `scroll-mt-[5rem]`. Aterrizaba
con el titular tapado por el header sticky. *El síntoma reportado no existía; el que había al
lado, sí.*

Se dejó escrito el par origen-destino con el que se comprueba la regresión, y se dejó **sin
guardián a propósito**: con un solo enlace de ese tipo en todo el sitio, automatizarlo sería más
maquinaria que regla. Si aparece un segundo, deja de caber en la cabeza y toca.

### El rendimiento de Sobre mí, que era criterio de lanzamiento

Las dos tareas de la página se hicieron juntas porque comparten archivos y el mismo ciclo de
medición. El elemento LCP es el vídeo de apertura y lo que pinta es su póster, que por
construcción no puede llevar `fetchpriority`: se marca desde la cabeza (D65, addendum). Y la
mitad móvil de las fotos, que P70.28 dejó abierta, **se cerró contra una cifra distinta de la que
la ficha suponía**: el móvil de referencia de Lighthouse tiene DPR 1,75, no 2,625, así que el
navegador no pedía el candidato correcto sino uno demasiado grande, y el reparto de anchos no
tenía ningún peldaño donde hacía falta (D118, sustituido).

Lo que deja para el método: **el metro no era `psi`**, que corre contra producción y solo da la
nota. Fue Lighthouse en local contra el build servido, leyendo el detalle por auditoría. Eso es
lo que convierte «el aviso sale» en una causa, y lo que permite medir un antes/después **sin
desplegar**.

### Y el sprint

Con esto cierra la tanda 4. Queda la **tanda 5**, cinco tareas de guardianes y de sellado —entre
ellas re-sellar la nota de PageSpeed con la mediana de tres tomas, que corre contra producción y
por eso va después de esta—. «Voz» sigue siendo el último sprint antes de lanzar.



## La tanda 5 de «Voz», que era toda de andamiaje — 2026-08-30

Cinco tareas que no ve el visitante y que sostienen lo que sí ve. Ninguna tocó una página.

### Un metro que daba dieciséis falsos positivos por pasada, no uno

La ficha de **P65** decía que la fila de «clases interpoladas» de `design-review` daba **un**
falso positivo por pasada. Medido, daban **16**, y los dieciséis eran legítimos: `WRAP`, `PROSE`,
`CARD` y las variables de fuente del layout son **constantes de clases completas**, y Tailwind
las ve literales donde se definen.

El modo de fallo real es otro: la utilidad **construida** por interpolación, que no se genera y
deja al elemento sin la clase **sin error de compilación**. Y los dos casos sí se distinguen por
`grep`, porque lo que los separa es si la interpolación va **pegada** al token. Tres
alternativas, que son las tres formas de romperlo: token antes, token después, y dos
interpolaciones sin espacio. Validado rompiéndolo: caza las cuatro y da **0 hits** sobre el repo.

**Y el arreglo no cupo.** La nota que lo explicaba dejó la skill en 4.716 palabras con techo
4.600, así que el patrón volvió a la columna donde vive el de todas las demás filas y la
narración se quedó en el commit. Es la primera de las dos veces que esta tanda desbordó el
presupuesto de contexto.

### `check:kit` cuadraba nombres, y un PNG en blanco los cuadra igual de bien

**P85.2** venía de un hallazgo lateral de «Drenaje»: regenerar el kit da 12 SVG idénticos y **15
de 43 binarios distintos**, porque los rasteriza una cadena nativa cuyo byte depende de la
máquina. Eso **no se arregló: se escribió**. Los PNG y el `.ico` son **artefactos versionados**,
el generador es la **receta y no el contrato**, y ese diff no se commitea. Pinnear `sharp` se
descartó con motivo: reduce la deriva sin eliminarla y compra una sensación de cierre falsa.

Lo que sí cambió es **lo que el guardián promete**. Ahora abre los 43 binarios y comprueba tres
cosas del archivo y no de su nombre: formato, medida declarada y **tinta**. Lo tercero necesita
decodificar de verdad —inflar los IDAT, deshacer los cinco filtros de PNG y sumar el canal
alfa—, con `node:zlib` y sin dependencia nueva. **Qué mide el número del nombre lo dice el
registro**, porque no significa lo mismo en las tres familias: alto en el símbolo, ancho en el
lockup, lado en el favicon. Un PNG cuyo nombre no case con ninguna sale **rojo**: un hueco del
metro no es un aprobado.

**Y lo que NO promete, escrito para no prometer de más:** que el dibujo sea el correcto. Cazarlo
exigiría rasterizar el SVG dentro del guardián, que es volver a meter ahí la cadena nativa que
el párrafo anterior acaba de declarar no determinista.

### El arnés de guardianes aprendió a manejar bytes

`check:kit` era el **único guardián de ausencia de CI sin caso malo** (**P68.737**). Le entraron
tres, uno por cada cosa que promete, para que arreglar una no pueda tapar a las otras dos: una
ruta declarada sin archivo, un archivo sin declarar, y **un PNG que cuadra su nombre y ya no es
una imagen**.

El tercero obligó a cambiar el arnés. Un caso de texto pasa por `utf8` en los dos sentidos, y eso
a un PNG lo destroza: volvería «restaurado» y distinto, y el propio arnés lo cazaría al final
como que no ha sabido limpiar. Ahora un caso puede declararse `binario: true` y se lee y se
restaura como `Buffer`. Los tres salen «lo rechaza» y el árbol queda limpio.

### El `@id` que cruza de página, y la lista que se decidió no mantener

**P66** cerraba el hueco que D87 dejó abierto: `check:marco` resuelve los `@id` contra todo el
sitio —lo que ningún validador externo hace— mientras la Rich Results Test evalúa **una página
aislada**, y ahí una referencia que cruza le llega como un `Thing` anónimo.

La salida evidente era enseñarle qué tipos son elegibles para rich results. **Se descartó**: es
otra lista escrita a mano contra un catálogo que decide Google. Lo que entró es una invariante
**posicional**, que no necesita saber de tipos: *toda referencia cuyo `@id` no se declara en su
propia página lleva `name` y `url`, salvo lo declarado con su motivo*. Patrón de `check:og`, y
como allí medido **en las dos direcciones**: una excepción que ya no ocurre también sale roja.

Cinco cruces declarados, los cinco con el mismo motivo: tres del deep-dive (`WebPage`) y dos de
`/contacto` (`ContactPage`), ninguno elegible. Validado en tres direcciones, la tercera sobre el
caso literal de P60.99.

### La nota de PageSpeed, y una predicción que salió al revés

**P66.5** iba a medias por construcción: el `README` dejó de teclear el rango y pasó a citar
`content/psi/registro.json`, y la medición la lanzó Francisco contra producción con el sprint ya
mergeado. Sello nuevo: **móvil 93-99 · escritorio 97-100**, mediana de tres tomas, **84 llamadas
y 84 análisis distintos** —ninguna deduplicación, así que ningún par se selló con una sola
muestra— y cero fallidas.

**Y la predicción escrita en la ficha era falsa.** Decía que con una sola toma el ruido de PSI es
asimétrico hacia abajo, así que el mínimo salía pesimista y lo más probable era que **subiera**.
**Bajó dos puntos** en móvil (95 a 93). El razonamiento tenía forma de causa y era una sospecha:
el ruido de PSI no es asimétrico, es **ancho** —esta corrida vio `/sobre-mi` dar 74, 96 y 97, y
dos deep-dive con 22 puntos de recorrido—, y sobre un min/max de catorce páginas más muestras
**ensanchan** el rango por los dos lados. Lo que sí se sostiene es lo único que importaba: el
umbral de PageSpeed sigue cumplido en las catorce.

## El cierre de «Voz» — 2026-08-30

Veintisiete tareas, cinco tandas, y **el último sprint de build antes de lanzar**.

### Lo que dijo el `sprint-review`

El código no era el problema: cero `any`, cero `@ts-ignore`, cero `TODO` reales, cero
vulnerabilidades, cero módulos huérfanos, y los ocho `eslint-disable` con su motivo al lado. Los
dos hallazgos estaban **en los bordes**:

- **El contexto de arranque a 13 palabras de su techo**, tras desbordarlo dos veces en una sola
  tanda. Se tareó, y el `method-review` lo convirtió en otra cosa (abajo).
- **El triaje manual de Dependabot sin dueño.** Tres PRs abiertos, dos de hace ocho días y **los
  dos ya obsoletos al encontrarlos**. El `automerge acotado` los triajó bien —`next` toca el
  build, así que va a mano— pero esa persona no existe en ningún sitio. Es el M1 del cuarto
  `method-review` (D91) otra vez, en la mitad que el automerge no cierra. Se cerraron el draft
  de diseño de la vieja P66 y el de ESLint, que ya estaba tareado como salto manual.

### El check de medición

GA4, 2-29 ago, 419 eventos y 46 usuarios. `contact_submit` **1/1**, `form_start` 1/1,
`contact_click` 9/2, `file_download` 1/1, `scroll` 41/10 — **idéntico en los cinco** al cierre
anterior, con las dos ventanas compartiendo 27 de sus 28 días. Los cuatro marcadores del panel
cuadran con GA4.

**El «no» escrito, con un matiz nuevo:** Distribución sale delante por **quinta** vez, y esta vez
ya no tiene nada por delante — el tablero se queda sin sprint de build. Y un «no» acotado con
fecha: **P85.1** (`file_download` del Brand Kit) sigue sin poder ejecutarse hasta que exista una
ventana de 28 días posterior al cambio de anclas del 26 de agosto, o sea **no antes del
2026-09-23**.

**Lo que no se puede verificar todavía:** la corrección de D153 —que `contact_submit` solo cuente
envíos reales— entró un día antes y la primaria vale 1. No hay dato con el que comprobar que hace
lo que dice.

### El sello, y un número que no existió

`SELLO_GENERAL` pasa a **20**: **+1 neto, el segundo ámbar seguido**, y en los dos cierres por lo
mismo — ni «Drenaje» ni «Voz» arrastraron cupo, así que el embalse se movió solo por sus bordes.

**Primero se selló 18, y estaba mal.** El volcado se tomó *antes* de crear las dos tareas del
propio `sprint-review`, así que 18 no existió en ningún momento. Es la regla nueva de `CLAUDE.md`
y su caso está en `CLAUDE-historical.md`.

### Y el `method-review`: una familia nueva

**Convergió con la nota de Francisco** —«ha sido un sprint bastante limpio pero seguimos
**siempre** al límite del presupuesto»—, escrita sin ver la medición. Cuarta convergencia de esa
revisión, y las tres anteriores fueron su hallazgo de más confianza.

Su «siempre» es lo que convirtió «quedan 13 palabras» en un diagnóstico. La curva va de 13.084 el
19 de agosto a 12.287 hoy, oscilando entre **12.058 y 12.698**, y **el objetivo de 11.600 no se
ha alcanzado nunca**. El techo, en cambio, **no se ha movido** (0 de 3, verificado). Así que no
es «el umbral que persigue al dato» del catálogo: es su **imagen especular**, y nace como familia
propia — **«el dato que persigue al techo»**: el techo aguanta y es el dato el que se le pega,
porque retirar solo se dispara al cruzarlo. El sistema equilibra en «techo menos épsilon», y un
indicador que siempre está al 99,9 % no distingue sano de a-punto-de-romperse.

Los dos rojos que dejó «Drenaje» se dieron la vuelta con holgura: **18,5 % de Infra** (era 52 %)
y **0,71 : 1** de verificación por producto (era 3,5 : 1). Y hay un candidato estructural medido
para la retirada: la sección «Cómo se verifica lo que no ve un compilador» son **824 palabras**,
el 6,7 % del arranque y **63 veces el margen que queda** — y es la sección que el propio
`PRD-Live` describe como *«este no se lee hasta que un check sale rojo diciendo su nombre»*.

**El informe completo, con el panel de los siete indicadores:**
<https://claude.ai/code/artifact/5c85a53e-4fba-4aa2-8a22-028ceae74ec6>


## El sprint «Agentes» — abierto el 2026-08-30

Diez tareas: **seis propias** y **cuatro de cupo de `General`**, que es lo que no hicieron ni
«Drenaje» ni «Voz». El embalse baja de 20 a 16, el primer verde en tres cierres.

### Por qué entra por delante de la Distribución, que llevaba cinco «no»

`PRD-Live` §9 acababa de decir, esa misma mañana, que no quedaba sprint de build y que lo único
Must abierto era la **Distribución**. El triaje de dos escáneres agénticos y de un post sobre
elementos semánticos dejó seis tareas en P67-68, y se abren por delante con un argumento que no es
«ya lo haremos»: **«Agentes» *es* distribución**, en el canal que el sitio no tenía cubierto. Un
agente al que le piden «PMs senior de SaaS B2B en España» se tragaba 218 KB de HTML y no tenía
forma de saber cuándo elegir esta fuente. La Distribución humana va a su **sexto** aplazamiento,
ahora con motivo escrito en vez de por inercia.

**Lo que se arrastró de `General`, y por qué esas cuatro:** las tres que no piden criterio y son de
la familia del sprint —un guardián que no particiona su recuento, cinco assets sin dueño en un repo
público, el triaje de Dependabot— más el **Must del octavo `method-review`**, el objetivo de
contexto que no se ha cumplido nunca. Fuera del cupo a propósito: el trío del censo, que pide
criterio de medición, y los saltos de ESLint y TypeScript, que son riesgo dentro de un sprint de
contenido servido.

### Tanda 1 — el descarte se escribe antes de construir (D157)

La primera tarea del sprint no construye nada: fija la premisa. De los dos escáneres, **dos de los
tres «críticos» no reproducen** —la home sirve 1 `h1` y 6.497 caracteres de prosa, y una ruta
inexistente devuelve 404 de verdad en los dos idiomas— y **12 checks del segundo miden superficies
que este sitio no tiene**. El criterio reutilizable quedó escrito: *un check de superficie agéntica
aplica si el sitio TIENE esa superficie; publicar un `api-catalog` sin API no es estar preparado
para agentes, es mentir en un formato que un agente sabe leer*.

**Y el metro del propio descarte estaba mal.** La ficha tumbaba el primer hallazgo con «~77.500
caracteres de texto», que salían de contar como prosa el payload RSC de dentro de un `<script>`. El
texto real son 6.497. El veredicto no cambia —sigue siendo 13 veces el umbral, no 155— pero es la
regla 3 de `BRAND.md` apareciendo **dentro de la tarea que existe para validar el metro de otro**.

### Tanda 2 — el markdown por página, y tres cosas que no estaban en la ficha (D158)

La entrega: cada página también en markdown, por URL explícita y por negociación `Accept`, con la
home pasando de 216.323 a 6.585 bytes y las 28 variantes intactas como estáticas. El *cuándo* que
la ficha dejaba abierto se resolvió como **artefacto commiteado**, porque leer `Accept` dentro de
una página la haría dinámica y eso lo cerró D48.

Lo que no estaba previsto, y las tres las encontró un metro y no una revisión:

- **La frontera de CSS.** Dos elementos pegados sin texto en medio estaban separados por la hoja de
  estilos, no por prosa; sin esa regla el markdown decía `Correofranciscojavier…` y
  `NombreImpactoAño`. En prosa no se dispara por construcción, porque React emite el espacio entre
  palabras como nodo de texto.
- **`Vary: Accept` no llega a la página prerenderizada.** Puesto en el proxy y en `next.config`, y
  medido que Next lo sobrescribe en las dos. La consecuencia se escribió en vez de esconderse: el
  contrato se apoya en la URL explícita y la negociación se anuncia como comodidad.
- **Cada entrada de `DECISIONS.md` deja viejo el markdown del artículo**, porque el artículo enlaza
  sus fuentes con número de línea y el índice de la cabecera crece una línea por entrada. D157 y
  D158 desplazaron 22 enlaces. Se acepta con el motivo escrito, y se **tarea la revisión** (P68.79)
  para cuando el precio se haya pagado unas cuantas veces, que es la única forma honesta de saber
  si sigue pareciendo bueno.

**El arnés de guardianes hizo de tercer revisor**, y no en abstracto: avisó de que `md:verificar` y
`check:accesibilidad` ya fallaban sobre el árbol limpio, así que rechazar su caso malo no probaba
nada. Los dos eran **sellos puestos antes del último cambio**, no defectos. Y destapó que
`/accesibilidad` publica cuántos guardianes y cuántos casos malos hay: el caso nuevo movió las dos
cifras, corregidas en `design-values.ts`, que es donde D38 dice que viven.

*La lección de orden, que no llega a convención porque ya la vigila un guardián: un sello se pone al
final, sobre el estado final del árbol. Se incumplió dos veces en la misma sesión y las dos salieron
en rojo, que es exactamente lo que tiene que pasar.*


## La tanda 3 y la 4 de «Agentes», y lo que el techo de contexto obligó a retirar — 2026-08-30

**La tanda 3** puso la sección «Cuándo usar esta fuente» en `llms.txt` y los tres elementos
semánticos que faltaban. Las tres decisiones que cambiaron respecto a lo escrito en las fichas
—dónde vive el copy, de qué cuelga la invariante del `<article>` y qué fechas existen de verdad—
están en las propias fichas y en D159; aquí queda lo que no es de una tarea.

**La tanda 4 estrenó `check:agentes` (D159), y lo que enseña es dónde mira cada cosa.** Un solo
guardián con **tres fuentes distintas**, porque la promesa ocurre en tres sitios: el artefacto de
`llms.txt`, el proxy **ejecutado** —una cabecera no está en el prerender— y `robots()` con sus dos
entornos, porque el `robots.txt` que se construye en CI es el de **no** producción y leerlo habría
certificado en verde lo contrario de lo que se cree.

### El techo de contexto es una regla de suma cero, y así se nota

Añadir la fila del gate nuevo a la tabla de `PRD-Live` **tiró `check:contexto`**: 12.341 palabras
contra un techo de 12.300. El guardián no pide recortar lo recién escrito, pide **retirar**, y su
primera pregunta —¿hay párrafos fechados en `PRD-Live`?— señalaba a uno concreto: la aclaración
del 2026-08-29 sobre qué cuenta como envío del formulario, que narraba una corrección (el
`status: "sent"` tenía tres causas y solo una manda correo) donde bastaba la regla en presente.
La regla se queda en una línea y apunta a `cuentaComoEnvio`; el relato baja aquí y a D153.

**Lo reutilizable: un documento @-importado con techo convierte cada añadido en una decisión de
qué sale.** Sin el techo, la tabla de gates habría crecido una fila por sprint hasta que nadie la
leyera, que es exactamente el destino del que este método intenta escapar.

### Qué contaba como envío, antes de que la regla quedara en una línea *(2026-08-29, D153)*

`status: "sent"` tenía **tres causas** —el envío de verdad y los dos filtros que callan a un bot,
el honeypot y el suelo de 3 segundos— y solo una manda correo. La analítica las contaba las tres,
así que la métrica primaria del sitio incluía bots silenciados. Se corrigió contándola en
`cuentaComoEnvio` (`lib/contact-form.ts`) y no con una comparación en el componente: ahí la regla
tiene tests y caso malo. **El silencio hacia el bot no se tocó** —callar es lo correcto—;
propagarlo a la analítica era lo que estaba mal.

### El cierre de las tandas 3 y 4, y lo que encontró la revisión antes de mergear

Las cuatro tandas salieron a producción juntas el 2026-08-30 (`ed55c1b`), y el batch fue **todo
el carril de agentes**: la tanda 5 es deuda transversal y no comparte tema.

**La revisión con IA sobre el PR fue lo que impidió publicar el sprint roto.** Encontró que el
conversor a markdown metía **391 separadores en medio de las frases** —el detalle está en el
addendum de D158— y ahí es donde se ve para qué sirve la convención de pasar `/code-review` en un
PR grande: los quince commits estaban en verde, CI incluido, y el artefacto que el sprint existe
para publicar estaba corrupto. Ningún gate podía verlo, porque `md:verificar` compara el artefacto
**consigo mismo**.

**Lo que el escáner externo dijo mientras tanto, y por qué no significaba lo que parecía.** El
mismo día, los dos informes de is-agentic daban 75 al dominio y 84 al preview de la rama, con
notas cualitativas peores en el segundo. Medido antes de interpretarlo: producción **no tenía
nada del sprint** —el PR seguía sin mergear— y el preview servía `Disallow: /`, que es D13
haciendo su trabajo. El propio evaluador lo delataba: *«pivoted to web search and a related
canonical domain»*, o sea que se fue a leer el sitio viejo. Y su afirmación técnica —«client-side
rendering, minimal text content»— era **falsa en las dos**: las dos servían 742 palabras dentro
de `<main>` en el HTML prerenderizado, con su `<h1>`.

**Lo reutilizable no es que el escáner se equivocara, sino cuál era la comparación honesta:**
producción antes contra producción después. Un escaneo de un preview no puede leer bien mientras
se respete D13, y respetarlo es correcto. En su grafo, además, el agente buscó `/es/servicios` y
`/en/services` —dos rutas que no existen— y se quejó de que faltaban *pricing* y *service scope*:
la plantilla de evaluación es la de un negocio que vende servicios, que es exactamente lo que D157
había concluido una semana antes con otras palabras.

**El techo de contexto quedó en 12.300 de 12.300**, cero holgura, después de cuatro retiradas para
pagar dos filas de gate y dos decisiones. El corpus de skills, en cambio, encogió pese a ganar un
gate. Está tareado desde antes (P68.7405) y hoy es un ejemplo más de lo que esa tarea nombra.

## La tanda 5 de «Agentes»: cuatro metros que no decían lo que estaban haciendo — 2026-08-30

Cuatro tareas de Infra, ninguna de página, y todas con la misma forma: **un mecanismo que ya
existía y publicaba sobre sí mismo algo que no era exacto**. Lo específico de cada una está en su
ficha y en D162, D163 y D164; aquí queda lo que no es de una tarea.

**Dos premisas de ficha no aguantaron la ejecución, y las dos por el mismo motivo: se habían
escrito mirando el código y no corriéndolo.** La de `check:excepciones` decía «85 = 79 + 2 + 4
sin nombrar»; al ejecutarla eran **87 = 81 + 2**, seis sin explicar, y la segunda casilla ni
siquiera era una casilla —publicaba el número de MARCAS en los archivos, no de controles que se
van por llevar una cerca—. La de Dependabot proponía que el workflow dijera en el PR por qué no
se mergea, y **eso llevaba implementado desde el 2026-08-22**: el #152 tenía su etiqueta y su
motivo escrito. Es la tercera tanda seguida que abre con una premisa caducada, y las tres veces
comprobarla ha costado menos que ejecutar la tarea equivocada.

**Y en las dos, comprobar la premisa produjo un hallazgo mejor que el de la ficha.** En la
primera, que el reparto no sumaba era el síntoma y la causa era que no había forma de saberlo:
ahora hay un contador por salida y **la partición se comprueba en ejecución**, así que una salida
nueva sin casilla pone el check en rojo en vez de dejar un residuo mudo. En la segunda, que el
aviso existía llevó a mirar el PR de verdad y ahí estaba lo bueno: **se había publicado cinco
veces**, una por cada push de Dependabot, y el motivo visible arriba era el del *primer* bump y no
el de la rama de ahora. Un aviso que se repite no avisa más: enseña a no leerlo. Eso vuelve la
conclusión de la propia ficha —«es un problema de atención, no de detección»— más fuerte de lo que
ella sabía, porque el PR gritó cinco veces y no había nadie escuchando.

**La retirada estructural que la tanda 3 dejó pendiente.** Aquella cerró con el techo en 12.300
de 12.300 y cero holgura, después de cuatro retiradas para pagar dos filas de gate. Aquí bajó la
pieza gorda: la tabla de contrato de los gates, **992 palabras** —el 8 % del presupuesto, y 824
cuando se escribió la ficha dos días antes: creció 168 con las filas de este mismo sprint— a
`GATES.md`, a demanda. `12.289 → 11.455`.

**Lo que eso contestó, y no era la pregunta que traía la ficha.** Traía como salida decidir que el
objetivo de 11.600 estaba mal, con el argumento de que **no se había alcanzado nunca** en toda la
vida del techo — cierto, la banda vivía entre 12.058 y 12.698. No estaba mal: **estaba esperando a
que se retirara algo estructural**, y las dos podas anteriores habían sido de lluvia fina. Una vez
alcanzado no hay nada que discutir, solo lo que ya estaba escrito: el objetivo baja un escalón de
200 a **11.400** y el techo aprieta a **11.700**. La lección de método es que *un objetivo que no
se cumple nunca* tiene dos lecturas —está mal puesto, o le falta la operación que lo alcanzaría— y
la segunda no se le había ocurrido a nadie en tres revisiones.

**Y por eso el cierre no es una victoria: la familia sigue abierta.** El `method-review` proponía
además convertir la retirada en un **paso del ciclo**, en el momento de abrir sprint. Francisco lo
dejó fuera, así que esto cierra **una instancia** de «el dato que persigue al techo», no la
familia: mientras retirar sea una reacción al rojo, el equilibrio vuelve a ser el rojo y lo único
que ha cambiado es desde dónde se sube.

**Dos decisiones se tomaron para no volver a levantarlas.** Que el barrido de huérfanos **no** se
generaliza al resto de `public/` —con criterio de salida: el día que aparezca una segunda carpeta
enumerada por un registro del repo—, y que un PR de Dependabot que espera **se cierra** en vez de
revisarse, porque a los ocho días ya no es el bump que había que mirar. Las dos estaban planteadas
como preguntas abiertas en sus fichas, que es como una revisión las vuelve a hacer cada trimestre.

**Un efecto lateral que resultó ser la prueba de que el arnés funciona.** Mover la sección puso en
rojo `check:accesibilidad` y `check:articulo`, que la declaraban como fuente sin que nadie lo
recordara. Ninguna copia había dejado de ser cierta, así que se re-selló. Los otros cinco punteros
—`CLAUDE.md` ×2, `BRAND.md`, `README.md` y la declaración de `content/accesibilidad/`— se
actualizaron a mano y **ninguno tiene guardián**: es deuda conocida y no se tarea, porque el ratio
no la justifica todavía.

**Y el cierre lo volvió a demostrar en pequeño.** Documentar la tanda pedía una fila nueva en la
tabla de documentos de la skill `close-session` —`GATES.md` es un documento a demanda más— y esa
fila puso **la suma de skills en 20.520 sobre un techo de 20.500**. El techo hizo lo suyo: no se
sube, se retira. Y lo retirado fue el bullet «no dupliques: cada cosa en su documento», que a
continuación **reenumeraba entera la tabla que tenía tres líneas por encima**, más la séptima
repetición de «ningún documento tiene espejo» dentro del mismo archivo. La regla contra la
duplicación estaba duplicada, y hasta que un techo no se cruzó nadie la leyó dos veces seguidas.

## Fuentes

- [Brief — Web Portfolio / CV · Francisco López](https://app.notion.com/p/39f2caec08be80d29d81d07da9a5e478) (Notion)
- [Referencias — moodboard visual](https://app.notion.com/p/39f2caec08be8090bf5bf6cb39ee63e2) (Notion)
- [CV — Francisco López](https://docs.google.com/document/d/1bPn6IhP5v-RfVIPkpIxQTP8dC4FDQVofQcHt80BO_1Y/edit) (Google Docs)
- [Análisis de mejora V1 — Diseño, Marca y Arquitectura](https://app.notion.com/p/3a12caec08be8133b636eefaccd9bbb2) (Notion, 2026-07-19)

## El cierre de «Agentes» — 2026-08-31

Diez tareas comprometidas y **veintitrés cerradas**: las diez más las trece que fueron
apareciendo por el camino, casi todas de los propios `code-review` y de los dos escáneres. El
sprint entregó lo que abrió a decir: que un agente pueda **encontrar, leer y citar** este sitio.

### El `sprint-review`

**Veredicto:** el criterio de aceptación duro se cumplió y se verificó contra producción, no
leyendo el código. La negociación de `Accept` funciona y **es segura en caché en los dos
sentidos** — sobre `/trayectoria`: HTML `PRERENDER` → `HIT` (86.859 B), markdown `MISS` → `HIT`
(1.846 B), y el HTML vuelve a servirse HTML. Ninguna dirección envenena a la otra.

**Eso corrige a la baja lo que `next.config.ts` y D158 escribían** («detrás de una caché
compartida que ya tenga guardado el HTML puede no llegar»): en Vercel llega. Un documento que
promete de menos, hermana del defecto que D162 corrigió.

**Los hallazgos, y los dos que se arreglaron en el acto:**

- **`q=0` era un «sí».** RFC 9110 §12.5.1 da al peso cero el significado «este tipo NO es
  aceptable», y `quiereMarkdown()` leía solo el token, así que `Accept: text/markdown;q=0`
  servía markdown. Arreglado con guardián —el caso no aparece en producción, así que sin él se
  deshace solo— y **comprobado que muerde**: con el proxy de ayer, `check:agentes` da 5 fallos.
- **`check-marco.ts` decía «las 24 variantes»** tres líneas encima del código que calcula 28.
- **`GATES.md` promete «una fila por gate» y le faltan doce** (`check:guardianes` incluido), lo
  que deja su `grep` devolviendo vacío para más de la mitad de los gates de CI. Tareado.
- **La cifra estrella del sprint está tecleada y ya derivó**: el artículo publica «de 216 KB a
  6,6 KB» y hoy son **221.678 y 6.925 bytes**, mientras la nota de ora del mismo párrafo sí se
  sella. Tareado.
- **La ruta del prerender, a mano en cuatro guardianes** más cuatro usos en línea, sin primitiva
  compartida. No es peligroso —los cuatro derivan sus variantes del registro y afirman cuántas
  leyeron—, es coste.
- **La fricción de `md:verificar` tiene número:** 3 de los 4 CI en rojo del sprint. Escrito en
  P68.79, que pedía exactamente ese dato.

### El check de medición

GA4, 3-30 ago: **342 eventos y 45 usuarios**. `contact_submit` **1/1**, `form_start` 1/1,
`contact_click` 9/2, `file_download` 1/1 — **idénticos** al cierre anterior. `scroll` baja de
**41/10 a 27/9**, y es la ventana rodante, con la aritmética cuadrando: las dos comparten 27 de
28 días, sale el 2 de agosto y entra el 30, y 419 − 77 = 342.

**El instrumento se verificó con prueba positiva, no con ausencia de rojo:** los cuatro
scorecards del panel cuadran evento a evento con GA4 (9 / 1 / 27 / 1), **incluido el scroll que
se movió**. Un panel congelado habría seguido diciendo 41.

**El «no» escrito:** ninguna prioridad cambia. Y **segundo cierre consecutivo** en el que la
corrección de D153 no se puede verificar, porque con la primaria en 1 no hay dato con el que
comprobarla. Si al tercero sigue igual, el problema no es el instrumento: es que n=1 no es
medible, y eso lo arregla la distribución.

### El sello: 20, ±0, primer verde en tres cierres

Y la aritmética dice por qué: **«Agentes» sí arrastró cupo** —cuatro de `General`, que es lo que
ni «Drenaje» ni «Voz» hicieron— y su revisión devolvió cuatro. **El cupo es la palanca**, y los
dos ámbares anteriores fueron sprints que no lo tocaron. Lo que no confirma: ±0 no es drenar.
Cuatro cierres en la banda 18-20.

### El `method-review` X: la nota que corrigió el diagnóstico

**Quinta convergencia con Francisco, y la primera que CORRIGE en vez de confirmar.** La medición
decía que el andamiaje crece más rápido que lo que sostiene (`verificación ÷ producto` a **rojo
por primera vez**, 0,49 → 0,554, empujado por un sprint con ratio propio de **1,57 : 1**). Su
nota apuntaba a otro órgano: no al tamaño del presupuesto de contexto sino **al tiempo de
negociarlo**.

**No converge el órgano, converge la enfermedad: el método no tenía retirada programada en
ninguna parte.** Tres órganos, la misma causa, y el peaje del tercero medido en **31 de 236
commits (13 %)**. De ahí sale la regla nueva de `CLAUDE.md` —retirar en lote al abrir— cuyo caso
está en `CLAUDE-historical.md`, y que **se demostró sola**: guardar el hallazgo en el catálogo
puso `check:contexto` en −576.

**Nace también «el arreglo que se quedó en su archivo»**: un defecto de familia conocida se
corrige donde se encontró y nadie barre a sus hermanos. Tres instancias el mismo día — los
recuentos de pasos de CI en `.github/` («dieciséis», «doce», con 27) con la regla escrita en
`ci.yml`; el «24 variantes» de `check-marco.ts`; y las doce filas de `GATES.md`.

**Cero tareas nuevas**, que en este disparo importaba más de lo normal: un hallazgo sobre el
exceso de andamiaje no se arregla añadiendo andamiaje.

**El informe completo:**
<https://claude.ai/code/artifact/f0242963-2e52-4ee7-a0c2-b3d3f8740ae8>

## El cierre de «Distribución» y el `method-review` XI — 2026-09-01

La etapa cerró con las **nueve piezas de la serie escritas y aprobadas** y solo R1 publicada,
que es lo que la decisión de ese mismo día había previsto: el seguimiento de las ocho restantes
vive en una base de Notion aparte y sobrevive al cierre, porque el desarrollo no se para
esperando datos.

### El `sprint-review`: el sprint más de contenido subió la fila de andamiaje

Seis commits, de los que solo tres tocan código. Y aun así **`verificación ÷ producto` pasó de
0,554 a 0,571** —rojo y subiendo—, con `scripts/` creciendo 780 líneas contra 543 del producto.
Las 780 son casi enteras el generador de carruseles (622) y `consentimiento.ts` (127). Es el
hallazgo que hay que tener delante al planificar: **publicar contenido en este proyecto
significa construir herramientas para publicarlo**, así que esa fila no baja cambiando de tipo
de sprint.

### El check de medición, y la caída que no era una caída

GA4, 4-31 ago: **240 eventos / 39 usuarios**, con `contact_submit` en **1 evento / 1 usuario**.
El cierre anterior medía 45 usuarios (3-30 ago) y la primaria también en 1. Los 6 usuarios de
diferencia **los explica la ventana rodante** —salió el 3 de agosto, entró el 31—, no una
regresión: es la trampa que el propio check nombra, aplicada correctamente por primera vez sin
que costara una investigación.

Y dejó dos huecos que se tarearon: **la tasa de consentimiento no se pudo leer** (las
credenciales de Upstash no están en `.env.local` y el camino documentado, `vercel env pull`,
sobrescribe el archivo y se lleva `PSI_API_KEY`), y **la cifra de Vercel Web Analytics tampoco**
—su transporte sí quedó verificado, con el POST a su ruta ofuscada devolviendo 200 en
producción—. De las cuatro fuentes de medición, solo una se pudo leer entera.

### La cola de Dependabot, donde el triaje valió lo que costó

Seis PR. Cuatro entraron y dos se cerraron con su motivo medido, y las dos mitades importan:

- **`next` 16.3.1 → 16.3.4 no era un bump menor**: parchea dos advisories **críticos** —RCE no
  autenticado en servidores Windows y en la Image Optimization API con AVIF—. **`npm audit`
  daba 0 y no los conocía**; los trajo Dependabot. Pasó el `gate:html` con **diff vacío en las
  28 variantes**, así que entró verificado.
- **`@react-pdf/renderer` 4.8.1 rompe `npm run cv`**, comprobado con su control (4.6.1 genera
  los dos PDF a 2 páginas; 4.8.1 sale con `ERR_PACKAGE_PATH_NOT_EXPORTED`). La causa es
  upstream y precisa: `@react-pdf/textkit` importa `@react-pdf/hyphenate/en-us`, y el `exports`
  de `hyphenate@0.1.0` declara `"./*"` **solo bajo la condición `import`**, mientras `tsx`
  resuelve por CJS. Se abrió ficha porque, a diferencia de ESLint 10 y TypeScript 7, **media
  solución es nuestra**: dejar de resolver el generador de CV por CJS.

### El `method-review` XI: el hallazgo de más impacto no lo encontró la revisión

**Lo trajo Francisco**, en una nota de tres palabras: *«seguimos teniendo muchos fallos de PR
run failed: CI»*. Medido, **14 de 80 runs en rojo en tres días (18 %)**, agrupados en la misma
rama —tres fallos en 34 minutos—, o sea empujar y ver qué dice CI.

Y el desglose convierte la queja en diagnóstico: **12 de los 14 son gates «al día»** —Markdown
7, Artículo 4, Accesibilidad 1—, artefactos derivados que quedaron viejos. Los tres son
deterministas, corren en segundos en local y **cada uno ya tiene su regenerador**. El control
que cierra el argumento: **el paso «Formato» no ha fallado ni una vez en 80 runs**, porque
tiene un *hook* (`scripts/hooks/format-stop.mjs`) que lo arregla al terminar. **El mecanismo
existe en este repo y nunca se extendió a los cinco regeneradores.**

**Convergencia con las notas de Francisco: cero.** Ninguna de sus dos notas estaba en los
cuatro hallazgos de la revisión, y ninguno de los cuatro en sus notas. Verificadas las suyas
con cifra, las dos se sostienen — y eso deja escrito un límite del barrido: **sus nueve medidas
no incluían mirar si CI pasa**. Celebraba «27 gates automáticos contra 9 manuales» sin ver que
el 18 % falla. Se añadió como décimo paso, con su comando y su umbral.

### Y la regla que se pagó con el margen que existía para aplicarla

El margen del presupuesto `@`-importado cayó de **133 a 10**, y la traza dice dónde: el cierre
de «Agentes» añadió 105 palabras a `CLAUDE.md` —que **son, literalmente, la regla «ABRIR
EMPIEZA RETIRANDO»**— y la apertura de «Distribución» retiró **cero**. Todo el sprint sumó +7
palabras: el margen ya estaba en 17 cuando abrió.

La apertura de «Higiene» lo corrigió, y encontrando el duplicado **donde el ciclo anterior no
lo buscó: en lo que el propio cierre acababa de escribir**. Las 105 palabras repetían su porqué
y su medida con `CLAUDE-historical.md`, al que ya apuntaban; se dejó la regla y se retiró la
justificación. Con eso cupieron dos reglas nuevas y `CLAUDE.md` salió en **−4 palabras netas**.

### Lo que abre «Higiene»

**31 tareas en 7 tandas**, y la decisión de alcance es de Francisco: hacer todo lo que quedaba
en `Sin empezar` salvo V4, para entrar en la IA conversacional sin deuda. La tanda 1 la forman
las cuatro que **producen información o abaratan el resto** —el *hook*, Silktide, Search
Console y el «About» de GitHub—, y las tres últimas son auditorías cuyo resultado puede generar
tareas para tandas posteriores.

**El embalse transversal pasó de 23 a 2** con eso, que es el drenaje que `SELLO_GENERAL` llevaba
tres cierres pidiendo. Conviene decir que no lo consiguió el cupo: lo consiguió absorber el
bloque entero, que es una operación que solo cabe una vez.

**El informe completo:**
<https://claude.ai/code/artifact/fbf55041-74b8-405a-9285-0528ed3b0fe2>
