# PRD — Web personal de Francisco López

> Documento de referencia único para diseñar (Claude Design) y desarrollar esta web.
> Consolida el Brief y el CV de partida. Versión V1 (Portfolio/CV en Vercel).
> **V1.1** (2026-07-16): incorpora análisis crítico del Brief/CV y decisiones resultantes — ver sección 14.
> **V1.2** (2026-07-19): incorpora el [Análisis de mejora V1 — Diseño, Marca y Arquitectura](https://app.notion.com/p/3a12caec08be8133b636eefaccd9bbb2) (Notion), hecho tras ver la V1 ya montada en Claude Design. Reestructura Hero, Selected Work (→ Hitos), Trayectoria y Más allá del PM, y añade reequilibrio de color/motion — ver sección 15.

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

**Decisión (2026-07-19, ver sección 15):** el Hero deja de llevar CTA propio — se queda solo con kicker, headline, subheadline y foto, para invitar a explorar el resto de la página en vez de quedarse arriba. Descargar CV, Sobre mí y el toggle Claro/Oscuro pasan a un **nav sticky** presente en toda la página (ver sección 7); LinkedIn se queda únicamente en el footer. Al ser sticky, el CV sigue disponible en todo momento — no hay pérdida real de conversión temprana, solo cambia de sitio visual.

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

**Comportamiento final (validado 2026-07-19, tras tres rondas de revisión en vivo sobre el primer resultado de Claude Design):**
- El **nav sticky es el único responsable** de la presencia del logo en toda la página — no hay un logo adicional en el Hero (ver sección 5). Un primer intento puso también un logo grande en el Hero, pero al estar visible a la vez que el logo del nav en la carga inicial, generaba ruido/redundancia (dos marcas iguales, mismo trabajo, una encima de otra) — se retiró del Hero.
- Al **cargar la página** (sin scroll), el nav muestra la variante `flat` compacta, en su círculo, junto al nombre "Francisco López" — nunca vacío.
- Al **hacer scroll**, el nav cambia a la variante `split` a color, **sin el círculo** que la recorta y sin el texto del nombre, con altura igualada a la de los demás controles del nav (CV, menú, toggle) — no puede quedar más bajo que ellos. Este es el único "momento donde la marca respira" del sitio; no hace falta un segundo sitio para lo mismo.
- **Mobile:** "Descargar CV" y "Sobre mí" colapsan los dos detrás de un icono de menú (☰) — en la barra de mobile solo quedan siempre visibles el logo, el icono de menú y el toggle de tema, sin texto partido en dos líneas.

**Cerrado 2026-07-19:** diseño de Hero + Hitos + nav sticky validado y aprobado tras tres rondas de correcciones (comportamiento del logo, colapso mobile, alineación de la fila destacada de Hitos) — ver tarea de Notion.

---

## 7. Arquitectura de la página

**Arquitectura vigente (2026-07-19 — ver decisión "Análisis de mejora V1" más abajo y sección 15):**

1. **Nav (sticky, presente en todo el scroll)** — logo `flat` compacto desde la carga; al hacer scroll cambia a `split` a color sin círculo, con altura igualada a la de los demás controles del nav (ver sección 6); Descargar CV; Sobre mí (enlace a página propia); toggle Claro/Oscuro (solo icono, ver sección 11). En mobile, CV y Sobre mí colapsan detrás de un icono de menú. LinkedIn no vive aquí.
2. **Hero** — foto, headline, subheadline. Sin CTA propio (ver sección 5).
3. **Hitos** *(sustituye a "Selected Work")* — filas escaneables (icono monocromo + nombre + una línea de impacto/resultado + año). El exit de TheTool es el hito destacado. Sigue siendo la red de seguridad para el lector que escanea rápido (ver decisión en sección 4): va justo después del Hero.
4. **Cómo trabajo** — el proceso: Investigar → Prototipar → Construir → Medir.
5. **Más allá del PM** — reformulado como pieza narrativa (cofundador, growth, marketing) que no repite los proyectos ya vistos en Hitos; forma visual concreta pendiente de fase de diseño.
6. **Toolkit** — herramientas agrupadas por categoría.
7. **Trayectoria** *(promovida en jerarquía, por encima de Toolkit)* — cronología con 1-2 frases de qué trabajo se hizo y con qué autoridad (seniority) por experiencia; incluye un CTA secundario de Descargar CV (cubre el nav oculto tras el menú hamburguesa en mobile).
8. **Formación** — sección independiente, escaneable.
9. **Contacto** — email, teléfono, LinkedIn, descargar CV.
10. **Footer** — Brand Kit + Sistema de diseño + Accesibilidad + LinkedIn.

**Sobre mí** no es una sección de este flujo — ver decisión abajo: es una **página propia con URL**, enlazada desde el nav, con contenido de tono personal. No compite por posición en la lista de arriba, igual que Brand Kit y Sistema de diseño ya son páginas propias enlazadas desde el footer.

**Decisión (2026-07-17):** se confirman las 4 secciones adicionales que estaban pendientes (ver sección 12). **Brand Kit** y **Accesibilidad** viven en el **footer** (bloque 8 de arriba). **Sobre mí** (sección nueva, no listada arriba) y **Contacto ampliado** (expande el bloque 7) tienen ubicación propia dentro del flujo de página — el layout exacto se define en la fase de diseño (Claude Design), no aquí.

**Decisión (2026-07-17, ampliación):** se añade un tercer enlace de footer, **Sistema de diseño** — la página generada en la tarea "Diseño Claude Design — Sistema global" (grid, breakpoints, tipografía, accesibilidad medida, motion), publicada como prueba de proceso, no solo de estética. Va como enlace propio, separado de Brand Kit: Brand Kit demuestra identidad visual (logo, color, tipografía como activo de marca); Sistema de diseño demuestra rigor de producto/ingeniería (grid, accesibilidad, motion) — son señales distintas y fusionarlas diluye ambas. Encaja con el objetivo de la sección 1 ("la propia web actúa como prueba de criterio técnico y de diseño") y diferencia frente al "portfolio tipo freelancer" que la sección 6 pide evitar. Antes de publicar, requiere una pasada de limpieza: la versión actual lleva chrome de editor (panel "Tweaks" de density/readingMeasure) que no debe llegar a producción — ver tarea de seguimiento en Notion.

**Diseño Claude Design — Trayectoria + Formación (resuelto 2026-07-18):** construidas como dos secciones independientes (no una sola de dos columnas como sugería la redacción original del bloque 6), cada una a partir de una referencia de moodboard distinta, adaptada a los tokens y patrones ya establecidos en el resto de la página:
- **Trayectoria**: basada en `timeline-empleos-opcion3` — filas fecha / rol+empresa / icono, separadas por línea divisoria. Adaptación obligatoria sobre la referencia: sin logos de empresa a color (choca con "Evitar", sección 6, y con `BRAND.md`), sustituidos por icono monocromo genérico. Shutapp Projects se renderiza como fila padre con TheTool y PICKASO anidados debajo, conectados con un borde vertical — mantiene visible la agrupación ya decidida en 8.5. En la primera construcción aparecieron 3 errores de datos (fechas de KUOTIP y TheTool, y una empresa inventada — "Canvas Media" — en la fila de Marketing & Growth); corregidos y verificados contra la tabla de 8.5.
- **Formación**: basada en `timeline-empleos-opcion2` — mismo patrón de aside fijo + lista con icono/título/institución que ya usa "Cómo trabajo", agrupada en Producto y Marketing. Verificada contra 8.6 sin errores en la primera construcción.

**Diseño Claude Design — Contacto (resuelto 2026-07-18):** se descarta la referencia de moodboard `contacto.webp` — trae un formulario (Nombre/Email/Empresa/Mensaje) y una foto grande decorativa, y ambas cosas chocan con decisiones ya tomadas: no hay formulario en V1 (sección 9, "no hay forma de medir conversión real, solo el clic") y no hay fotografía secundaria en la página (solo la del Hero). En su lugar se reutiliza el mismo patrón fila+divisor de Trayectoria: 4 filas (Email, Teléfono, LinkedIn, CV), cada una un enlace completo clicable (`mailto:`, `tel:+34629832720`, LinkedIn en pestaña nueva, CV con `href="#"` como placeholder hasta que exista el PDF).

**Diseño Claude Design — Footer (resuelto 2026-07-18):** tarea añadida fuera del backlog original (gap de planificación detectado esta sesión — el footer nunca tuvo tarea propia pese a estar en la arquitectura de página). Se revisaron 5 referencias de moodboard (`footer-1` a `footer-5`); se descartan las de tipo SaaS multi-página con 4-5 columnas de navegación (`footer-1`, `footer-2`, `footer-4`) por sobredimensionar una web de una sola página — justo el riesgo de "portfolio tipo freelancer" que la sección 6 pide evitar. Se toman ideas puntuales de `footer-3` (fila de utilidades, selector de idioma) y `footer-5` (baja densidad). Layout final: **una sola fila**, no el bloque de dos pisos de las referencias — logo en variante `flat` + copyright a la izquierda, los 3 enlaces (Brand Kit, Sistema de diseño, Accesibilidad) en el centro, LinkedIn a la derecha. Sin GitHub (no hay perfil en los datos del candidato, sección 10). Sin texto de cierre/tagline, coherente con la regla de espacio en blanco (sección 6). Se deja hueco conceptual junto a los 3 enlaces para el selector de idioma de V2 (i18n), sin construir un control no funcional en V1.

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

Formato: fila escaneable = icono monocromo + nombre + **una línea de impacto/resultado** + año. Base de contenido: la lista "Logros" de la sección 10.

**Redacción final (validada 2026-07-19):** un hito = un reconocimiento/resultado externo, no un resumen por empresa — orden **cronológico descendente** (más reciente primero), igual que la referencia de moodboard `hitos.webp` (formato "Awards"):

- **2026 — Emendu**: Partnership estratégico con Sesame HR.
- **2023 — INDYA**: Churn mensual 16% → 10%, activación primer mes +28%.
- **2022 — INDYA**: Seleccionada por Apple App Store Foundations.
- **2021 — TheTool**: Exit → adquirida por AppRadar. *(hito destacado — candidato al acento decorativo morado, ver sección 6/15)*
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

Proceso: **Discovery → UX → Prototipado → Desarrollo → Analítica.**

### 8.3 Más allá del PM

**Reformulación (resuelto 2026-07-19, ver sección 15):** esta sección deja de ser una lista más (que repetía proyectos ya vistos en Hitos/Trayectoria) y se reformula como **pieza narrativa** — un "separador" visual que rompa la monotonía de la mitad inferior de la página. El contenido de fondo (founder, growth) se mantiene; la forma concreta (qué es visualmente, qué tan largo, qué agarra al morado como acento) queda **pendiente de la fase de diseño** (ver sección 12).

**Founder**
- TheTool → Exit (ver Selected Work).
- PICKASO (Shutapp Projects) — profesionalicé estructura, procesos y cartera de servicios de la agencia; ese trabajo financió el arranque de TheTool y me dio el conocimiento de mercado (apps, herramientas, sector) con el que lo fundé. Bootstrapping real, no narrativa a posteriori.
- KUOTIP — Cofundador & Product (SaaS B2B · IA/Reviews), Feb 2024 – Nov 2024: validación de problema (fraude/manipulación en reviews), diseño de flujos con verificación por voz y resúmenes automáticos con IA, MVP con UI visual moderna, apoyo a la CEO en fundraising pre-seed.

**Decisión (2026-07-16):** KUOTIP se queda fuera de Selected Work (se mantienen los 3 casos SaaS B2B/B2C ya definidos) pero, al ser la prueba más directa del pilar "IA aplicada" del brief (sección 1), su componente de IA generativa debe quedar explícito aquí — no diluirlo a una línea de founder más.

**Growth** (experiencia 2009–2015, base analítica y de experimentación que define su enfoque actual como PM)
- SEO / SEM / CRO / Marketing Digital.
- Ontecnia (proyecto Malavida.com): crecimiento orgánico de 3,2M → 9,4M visitas mensuales; transición de modelo de negocio (de instaladores intrusivos a contenido de valor + monetización por vídeo).
- Havas Media, Searchmedia, Miss Conversion: adquisición y performance en agencias líderes.

### 8.4 Toolkit

> "Las herramientas son medios, no fines. Aquí tienes las que me ayudan a trabajar mejor y cumplir objetivos."

**Redacción final (validada 2026-07-19):** se afiló en vez de quitar — la primera frase se mantiene (justifica el porqué del tratamiento sin logos/certificaciones, ver más abajo) y la segunda la convierte en lead-in personal hacia las tarjetas, en vez de una sentencia suelta genérica. Ver decisión "Pendiente (2026-07-19)" más abajo.

- **Analítica / usuarios:** Amplitude, Google Analytics.
- **Gestión:** Jira, Notion, Miro.
- **Diseño y desarrollo:** Figma, v0, Claude Code.
- **Pagos:** Stripe.
- **IA:** Anthropic API, Claude Code, MCP — uso práctico aplicado a producto (no listar como certificación formal; ver decisión abajo).

**Decisión (2026-07-16):** el uso de IA se movió aquí desde "Formación" (sección 8.6) — listarlo junto a un máster o un bootcamp sobredimensionaba una práctica de herramienta como si fuera una credencial formal, exactamente el riesgo que el propio brief señala ("sobrevalorar certificaciones IA", sección 11).

**Riesgo de diseño a vigilar:** el brief pide evitar "portfolio tipo freelancer", pero un Toolkit resuelto como grid de logos cae justo en ese patrón. La cita de arriba ayuda en el copy, pero la solución real es de diseño (fase Claude Design): evitar el grid de logos, priorizar cómo se usa cada herramienta sobre qué herramienta es.

**Tratamiento visual (resuelto 2026-07-17):** tarjetas agrupadas por categoría (las 5 de arriba), cada una con icono monocromo `lucide-react` (hereda `foreground`, sin color de marca) + nombre + una frase en primera persona de cómo se usa esa herramienta (no descripción genérica del producto). Se descartó explícitamente el logo a color: entra en conflicto con "Evitar" (sección 6, "logos de empresas a color") y con la disciplina de color de `BRAND.md` (los tokens semánticos neutros no admiten colores de marca ajenos). Referencia de moodboard: [Referencias — Tools](https://app.notion.com/p/39f2caec08be8090bf5bf6cb39ee63e2) (las 3 opciones usan logo a color + tarjeta; se adapta la estructura — agrupación por categoría, ritmo de tarjeta — sin el logo a color).

**Navegación (resuelto 2026-07-17):** la primera versión mostraba las 5 categorías apiladas y visibles a la vez — demasiada información de golpe. Se corrige a **pestañas por categoría**: se ve una categoría (sus tarjetas) cada vez, cambiando entre Analítica/Gestión/Diseño y desarrollo/Pagos/IA mediante pestañas — más cercano a la referencia del moodboard, reduce la densidad visual y mantiene la coherencia con "muchísimo espacio en blanco" (sección 6). El contenido y los iconos monocromo no cambian, solo cómo se revela. Verificado en claro y oscuro; la pestaña activa usa `primary` (se corrigió una implementación inicial que usaba un color neutro, incumpliendo la regla de BRAND.md de que los estados activos usan `primary`).

**QA de esta fase (2026-07-17):** verificado en claro y oscuro. Se detectó y corrigió un bug de renderizado exclusivo de modo oscuro en "Más allá del PM" (el texto de PICKASO y de Ontecnia se duplicaba con un fragmento roto entre repeticiones) — no afectaba a modo claro.

### 8.5 Trayectoria

**Trayectoria promovida y ampliada (resuelto 2026-07-19, ver sección 15):** sube de posición en la jerarquía (por encima de Toolkit) y cada fila gana un **Resumen de 1-2 frases**: qué trabajo se hizo + con qué autoridad (seniority) — el contenido de autoridad que antes vivía en la línea "Seniority" de Selected Work/Hitos (8.1) se traslada aquí.

**Estructura en dos bloques (resuelto 2026-07-19):** igual que Formación (8.6) ya separa Producto/Marketing, Trayectoria se divide en **Producto** (el timeline principal) y **Experiencia previa — Marketing & Growth** (2009–2015), cada uno con una frase de apertura que resume el bloque. **No cambia el tratamiento visual**: sigue siendo el mismo patrón de fila+divisor ya diseñado, con Shutapp Projects como fila padre y TheTool/PICKASO anidados debajo tal como se decidió el 2026-07-17 — solo se añade la frase de apertura por bloque, nada más.

**Redacción final (validada 2026-07-19):**

**Producto**
> Diez años liderando producto en SaaS B2B y B2C — de cofundador con exit a Product Manager en scale-ups — con foco constante en discovery, UX y resultados medibles.

| Empresa | Rol | Periodo | Resumen |
|---|---|---|---|
| Emendu | Product Manager | Feb 2025 – Actualidad | Lideré la digitalización de Sales & Operaciones y evolucioné el agente IA LISA; reporto directamente al CEO, en el equipo de liderazgo junto a Operaciones, Finanzas y Tech. |
| KUOTIP | Cofounder & Product | Feb 2024 – Nov 2024 | Validé el problema de fraude en reviews y diseñé el MVP con verificación por voz e IA; como cofundador, apoyé a la CEO en el fundraising pre-seed. |
| INDYA | Product Lead | Ene 2022 – Dic 2023 | Rediseñé pricing y onboarding para mejorar activación y reducir churn; reportaba al CPO/cofundador, liderazgo por influencia sin autoridad formal. |
| Freepik | Product Manager | Oct 2021 – Dic 2021 | Investigué y definí funcionalidades para el área de contributors; mejoré el onboarding (registro, emailing, calidad de perfiles) a partir de análisis cualitativo y cuantitativo con diseño. |
| **Shutapp Projects** — TheTool | Cofounder & Product Manager | May 2016 – Oct 2021 | Cofundador con voz y voto en las decisiones clave; lideré producto, roadmap y el equipo no-código (backend, frontend, diseño). |
| **Shutapp Projects** — PICKASO | COO | Sep 2015 – Dic 2016 | Profesionalicé estructura y cartera de servicios de la agencia; ese trabajo financió el arranque de TheTool. |

**Experiencia previa — Marketing & Growth (2009–2015)**
> Esta etapa previa en marketing y growth construye la base analítica, de experimentación y user-first que define mi enfoque como Product Manager.

| Proyecto | Rol | Periodo | Resumen |
|---|---|---|---|
| Ontecnia — Malavida.com (portal internacional de software) | Digital Marketing Manager | 2009 – 2015 | Crecimiento orgánico de 3,2M → 9,4M visitas mensuales; llevé el modelo de negocio de instaladores intrusivos a contenido de valor y monetización por vídeo — el inicio de mi giro hacia product-first. |
| Havas Media, Searchmedia, Miss Conversion | Digital Marketing / Performance | 2009 – 2015 | Adquisición y performance en agencias líderes — la base de analítica, CRO, UX y liderazgo que facilitó el salto a producto. |

**Resuelto (2026-07-16):** PICKASO y TheTool no son un solapamiento accidental — ambos son proyectos de **Shutapp Projects**. Entré en PICKASO (agencia de marketing de apps) por dos motivos: profesionalizar la empresa y mejorar su cartera de servicios, y conocer desde dentro el mercado de apps y sus herramientas — el background que hizo posible fundar TheTool con criterio. Además, la mejora de facturación que impulsé en PICKASO sustentó financieramente el arranque de TheTool. Es decir: la agencia fue a la vez la escuela de mercado y el motor financiero del SaaS.

**Tratamiento visual (resuelto 2026-07-17):** se agrupan ambas entradas bajo el paraguas **"Shutapp Projects"** en el timeline (ver tabla arriba), en vez de dejarlas como dos filas independientes con una nota inline. Motivo: la duda sobre el solapamiento de fechas ya ha surgido en entrevistas reales — merece la pena resolverla visualmente desde el principio para evitar que un reclutador la interprete como un error o una inconsistencia del CV.

**Composición de página (resuelta 2026-07-18):** construida en Claude Design — ver decisión "Diseño Claude Design — Trayectoria + Formación" en sección 7. El patrón visual de fila+divisor **no cambia** con la ampliación de 2026-07-19: al quedarse en 1-2 frases por fila, el timeline ligero ya diseñado sigue sirviendo, solo se rediseña la posición de la sección en el flujo. La división en bloques Producto / Marketing & Growth (ver arriba) tampoco exige un componente nuevo — cada bloque es el mismo timeline con su frase de apertura encima; Shutapp Projects mantiene su tratamiento de fila padre + TheTool/PICKASO anidados sin cambios. Añade además un **CTA secundario "Descargar CV"** (cubre el hueco del nav sticky oculto tras el menú hamburguesa en mobile — ver sección 7).

### 8.6 Formación

**Producto**
- Product Management — TheHeroCamp (2021).
- Scrum & Agile Leadership — theUncoding (2021).

**Marketing**
- **Resuelto (2026-07-17):** se confirma la versión CV (dos formaciones distintas, no una sola como decía el Brief):
  - *Máster en Comunicación Digital — Olea Europea (2001).*
  - *Gestión Comercial y Marketing — ESIC (2000).*

**Composición de página (resuelta 2026-07-18):** construida en Claude Design — ver decisión "Diseño Claude Design — Trayectoria + Formación" en sección 7.

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
- **Pospuesto (2026-07-19):** contenido de la página **Sobre mí** — resuelto que es página propia con URL y tono personal (ver sección 7), pero falta definir qué entra exactamente (¿hobbies, valores, una foto distinta, una anécdota?). Francisco lo deja para más adelante; tarea marcada Blocked en Notion. Hay referencia de moodboard (`Sobre-mi.png`) con layout tipo "About Us" (headline + intro + collage de fotos de equipo/oficina) — es corporativa/de equipo y necesitará la misma adaptación que ya se hizo con `contacto.webp`: se toma el layout, se descarta el tono "we/team" y el collage de fotos ajenas al Hero (no hay sesión de fotos adicional planeada, sección 6).
- **Nuevo (2026-07-19):** forma concreta de **"Más allá del PM"** como pieza narrativa (ver 8.3) — el análisis de mejora V1 lo deja como concepto ("separador visual que rompa la monotonía"), sin definir qué es en concreto. Pendiente de la fase de diseño.
- ~~Afilar o quitar la cita del Toolkit ("Las herramientas son medios, no fines") — señalada en el análisis de mejora V1 como el eslabón más débil del copy actual~~ — **resuelto (2026-07-19, ver 8.4):** se afiló añadiendo un lead-in personal en vez de quitarla.
- Foto profesional (pendiente sesión).
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

## 13. Roadmap

**V1**
- Portfolio con seniority, en español, en Vercel, editorial, preparado para i18n.
- Brand Kit y Accesibilidad en el footer; Contacto ampliado con ubicación propia (resuelto 2026-07-17, ver sección 7) — layout pendiente de fase de diseño. Sobre mí es página propia con URL (resuelto 2026-07-19, ver sección 7) — contenido pendiente.
- Arquitectura reestructurada 2026-07-19 (ver sección 15): Hitos sustituye a Selected Work, Trayectoria promovida, Más allá del PM reformulado, nav sticky con CV/Sobre mí/tema, reequilibrio de color (morado decorativo) y motion con propósito.
- Medición con Microsoft Clarity (adelantado desde V2, ver sección 9) — sin esto no se puede evaluar si V1 funcionó.
- Banner de consentimiento de cookies (resuelto 2026-07-17, ver sección 9/12), previo a la carga de Clarity.

**V2**
- Inglés · dominio propio · CV en PDF con identidad visual propia · medición ampliada (Google Tag Manager, Google Analytics, Search Console).

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

## Fuentes

- [Brief — Web Portfolio / CV · Francisco López](https://app.notion.com/p/39f2caec08be80d29d81d07da9a5e478) (Notion)
- [Referencias — moodboard visual](https://app.notion.com/p/39f2caec08be8090bf5bf6cb39ee63e2) (Notion)
- [CV — Francisco López](https://docs.google.com/document/d/1bPn6IhP5v-RfVIPkpIxQTP8dC4FDQVofQcHt80BO_1Y/edit) (Google Docs)
- [Análisis de mejora V1 — Diseño, Marca y Arquitectura](https://app.notion.com/p/3a12caec08be8133b636eefaccd9bbb2) (Notion, 2026-07-19)
