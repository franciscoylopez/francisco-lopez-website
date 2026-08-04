# PRD Historical — Web personal de Francisco López

> **Registro histórico de decisiones de producto/diseño/alcance** — secciones fechadas,
> debates y cosas revertidas, en orden cronológico. Es el "por qué" completo. Para el
> **estado actual del producto** (qué es y qué cumple hoy), ver **[PRD-Live.md](./PRD-Live.md)**,
> que es la spec viva y el documento que se `@`-importa en cada sesión. Este archivo
> vive **solo en el repo** (no tiene espejo en Notion).

> Documento de referencia para diseñar (Claude Design) y desarrollar esta web.
> Consolida el Brief y el CV de partida. Versión V1 (Portfolio/CV en Vercel).
> **V1.1** (2026-07-16): incorpora análisis crítico del Brief/CV y decisiones resultantes — ver sección 14.
> **V1.2** (2026-07-19): incorpora el [Análisis de mejora V1 — Diseño, Marca y Arquitectura](https://app.notion.com/p/3a12caec08be8133b636eefaccd9bbb2) (Notion), hecho tras ver la V1 ya montada en Claude Design. Reestructura Hero, Selected Work (→ Hitos), Trayectoria y Más allá del PM, y añade reequilibrio de color/motion — ver sección 15.
> **V1.12** (2026-07-29): arranque del CV en PDF con identidad propia (generado desde el diccionario, bloque `cv`) y cierre del gap del deep-dive por experiencia —que nunca fue tarea y ahora sí—, con el que el CV comparte fuente de contenido — ver sección 25.
> **V1.11** (2026-07-29): pasada de revisión de copy ES↔EN (P29) — cambios validados en Notion aplicados al sitio (`es.json` fuente de verdad, EN revisado contra el ES) y reconciliados en §8.2, §8.3 y la tabla de §8.5 — ver sección 24.
> **V1.10** (2026-07-23): se cierra el Sprint 1. La foto del Hero se resuelve con una imagen generada con IA a partir de una foto de Francisco (recorte 4:5) en vez de una sesión de estudio, y se fijan las notas de uso para el build — ver sección 23.
> **V1.9** (2026-07-23): reenfoque a lanzar V1 lo antes posible y priorización con MoSCoW en un tablero enlazado aparte. Sobre mí y Accesibilidad vuelven a V2, GA4 pasa a ser la medición del lanzamiento (Clarity queda para lo cualitativo), la arquitectura i18n es Must desde la primera línea, y los sprints se reorganizan a seis — ver sección 22.
> **V1.8** (2026-07-22): pasada de responsive de la home —seis secciones que no apilaban en móvil por la misma causa— y ronda de ajustes de contenido, incluida la corrección del email y el LinkedIn, que estaban mal en la web — ver sección 21.
> **V1.7** (2026-07-22): se construye la página Design System, con la sección de Accesibilidad convertida en checklist de cierre, y el sistema de color entero pasa a AAA en ambos temas — ver sección 20.
> **V1.6** (2026-07-22): se construye la página Brand Kit, la primera de las cuatro páginas propias, y se consolida todo el diseño en una sola fuente con componentes compartidos — ver sección 19.
> **V1.5** (2026-07-21): reorganización de sprints y ampliación del alcance de V1 — Sobre mí y Accesibilidad vuelven a V1, el responsive pasa a ser tarea de diseño, y Brand Kit y Sistema de diseño se montan como páginas en Sprint 1 — ver sección 18.
> **V1.4** (2026-07-21): antes de abordar el footer, Francisco cuestionó si el logo se estaba usando de forma coherente con lo que documentarán las páginas Brand Kit y Sistema de diseño. Se auditaron los tres usos construidos, se descubrió que `BRAND.md` nunca cerró la tabla de uso del logo, y se cerró — ver sección 17.
> **V1.3** (2026-07-20): tras cerrar el diseño de Más allá del PM y Trayectoria, Francisco revisó el conjunto y planteó una segunda ronda de ajustes de contenido y arquitectura — logos reales de empresa/herramienta/institución, nuevo paso "Lanzamiento" en Cómo trabajo, recategorización de Toolkit, y repriorización (Sobre mí entero a V2, Accesibilidad a V2, nuevas páginas Brand Kit/Sistema de diseño) — ver sección 16.

**Fuentes originales:** ver sección [Fuentes](#fuentes) al final.

**Seguimiento de tareas:** [Tareas — Web personal](https://app.notion.com/p/f3ee9a949c58482888423d5917087962) (Notion, al mismo nivel que este PRD dentro de "New Website") — base de datos derivada de este PRD, por Área (Código/Diseño/Analítica/Legal/Contenido/Infra), Versión (V1/V2/V3) y Sprint semanal.

---

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
- **Reparto del contenido que antes vivía en la línea "Seniority" de cada caso de Selected Work:** Hitos se queda con el resultado/impacto puro (ej. TheTool → "Nominado a Mejor Software ASO de Europa · Exit con AppRadar"); Trayectoria se queda con la autoridad real (reporta a CEO, socio con voto, liderazgo por influencia) dentro de sus 1-2 frases por experiencia — así ninguna sección se sobrecarga y la mitigación del riesgo "aspecto demasiado junior" (sección 11) sigue viva, solo que cambia de sitio.
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
| Aspecto demasiado junior | **Mitigado, actualizado 2026-07-19:** la evidencia de autoridad real (socio con voto en TheTool, reporting a CEO en Emendu, liderazgo por influencia en INDYA) ya no vive en Selected Work — con la sustitución por Hitos (8.1, quick-scan de resultados puros), esa autoridad se trasladó al "Resumen" de cada fila de Trayectoria (8.5). Sigue siendo evidencia concreta, solo cambió de sección. |
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
- **Señales de seniority:** no había evidencia sistematizada de autoridad real, solo narración de proceso — la mitigación directa al riesgo "aspecto demasiado junior" (sección 11). **Resuelto** con contexto real del usuario: TheTool (socio 1 de 4, voz y voto, liderazgo de facto del equipo no-código), Emendu (reporta al CEO, equipo de liderazgo junto a Ops/Finanzas/Tech), INDYA (reporta a CPO/cofundador, liderazgo por influencia sin autoridad formal). Añadido como línea "Seniority" en cada caso de 8.1. No se aportaron cifras de presupuesto/P&L — queda abierto si se quiere añadir más adelante, no bloqueante.

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

**Efecto a vigilar sobre §11 (riesgo "aspecto demasiado junior"):** al quitar las líneas de reporting de Emendu e INDYA, la evidencia de autoridad en Trayectoria se sostiene ahora en "miembro del equipo de liderazgo" (Emendu), "liderazgo del equipo" (INDYA) y "voz y voto" (TheTool). Sigue habiendo señal de seniority, solo que reformulada — no se rompe la mitigación, pero queda menos explícita. Las líneas de reporting siguen en los datos de fondo de §8.1 (insumo/deep-dive), que no se tocan porque el hecho no cambió, solo salió del copy visible.

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

**Estado al cerrar**: implementado y verificado (build/lint/typecheck limpios,
comprobación visual en Chrome claro/oscuro) en `rich.tsx`, `cookies-policy.tsx`,
`contact-actions.tsx`, `nav.tsx`, `breadcrumb.tsx`, `footer.tsx`, `consent-banner.tsx` y
`consent-preferences-button.tsx`. Rama `feat/p37-55-links-hover`, PR #73. Pendiente:
verificación real de contraste con axe/Lighthouse sobre los componentes en producción.

---

## Fuentes

- [Brief — Web Portfolio / CV · Francisco López](https://app.notion.com/p/39f2caec08be80d29d81d07da9a5e478) (Notion)
- [Referencias — moodboard visual](https://app.notion.com/p/39f2caec08be8090bf5bf6cb39ee63e2) (Notion)
- [CV — Francisco López](https://docs.google.com/document/d/1bPn6IhP5v-RfVIPkpIxQTP8dC4FDQVofQcHt80BO_1Y/edit) (Google Docs)
- [Análisis de mejora V1 — Diseño, Marca y Arquitectura](https://app.notion.com/p/3a12caec08be8133b636eefaccd9bbb2) (Notion, 2026-07-19)
