---
name: sprint-review
description: >
  Revisión técnica crítica del codebase con mirada de developer externo que lo ve por
  primera vez: calidad de código, escalabilidad, deuda técnica, resiliencia, drift
  docs↔código y huecos en PRD/DECISIONS. Invócalo al CERRAR UNA ETAPA/FASE (o si Francisco lo
  pide) para que las mejoras se detecten de forma recurrente sin depender de acordarse.
  Termina proponiendo y creando tareas para los hallazgos reales, sin duplicar las ya
  tareadas. No es una review de un diff/PR (eso es /code-review), sino del proyecto entero.
---

# Revisión técnica de cierre de sprint

Al cerrar cada sprint, un developer que **acaba de aterrizar** en el repo hace un análisis
**crítico y justo** de todo lo que hay, para pulir el andamiaje y la dinámica de trabajo
antes de que se acumule deuda. La primera vez que se hizo (2026-07-30) salieron: falta de
CI, ausencia de páginas de error propias, drift docs↔código, `shadcn` mal ubicado, PRD
como diario en vez de spec viva, espejos de Notion que se desincronizan solos.

## Principios (no negociables)
- **Mirada fresca y honesta.** Escribe como si no conocieras la historia: ¿me oriento?,
  ¿qué me sorprende?, ¿qué me costaría mantener? **Calibra con lo que está bien** (para no
  inventar problemas) y sé **duro** con lo que no.
- **Basado en el código real, no de memoria.** Lee antes de opinar.
- **No cambiar por cambiar.** Cada hallazgo lleva **severidad** y un **"¿por qué importa?"**.
  Distingue lo accionable ya de lo "solo si crece".
- **No dupliques.** Antes de proponer tareas, **consulta el tablero** (incluidas las de
  revisiones anteriores) y no repitas lo ya tareado.

## Barrido (qué mirar)
1. **Tamaño y forma**: `wc -l` por área; archivos gigantes; componentes/funciones enredados.
2. **Deuda declarada**: `any`, `@ts-ignore`/`@ts-expect-error`, `TODO/FIXME/HACK`,
   `eslint-disable` — cuántos y si están justificados.
3. **Andamiaje**: ¿hay CI (`.github/workflows`)?, tests, `error.tsx`/`not-found.tsx`/`loading.tsx`, boundaries.
4. **Config/calidad**: `tsconfig` (`strict`, `noUncheckedIndexedAccess`), eslint, `package.json`
   (¿deps mal ubicadas —p. ej. una CLI en `dependencies`—?, versiones).
5. **Escalabilidad**: patrones que hoy no duelen pero dolerán con más páginas/lógica; fuentes
   únicas vs duplicación; a11y/perf ¿manual o automatizado?
6. **Resiliencia**: 404/500 propios, manejo de errores, estados de carga.
7. **Seguridad**: `npm audit` (vulnerabilidades de dependencias) y si hay escaneo
   automatizado; **cabeceras de seguridad** en `next.config` (CSP, `X-Frame-Options`/
   `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
   HSTS); **secretos** (grep de claves/tokens; `.env*` gitignored, nada commiteado);
   `dangerouslySetInnerHTML` (¿escapa `<`?, ¿entra dato no confiable?); **rutas públicas /
   API con params** (¿allowlist y validación?); y **superficie nueva** (formularios,
   uploads, auth, server actions) → validación/sanitización de input no confiado,
   rate-limiting, CSRF, y su efecto en la CSP.
8. **Drift docs↔código**: ¿los docs marcan "pendiente" algo ya hecho (o al revés)?, ¿referencias rotas?
9. **Docs**: ¿`PRD-Live.md` refleja el estado real?, ¿`DECISIONS.md` al día?, ¿huecos/dudas de
   producto o técnica que poner sobre la mesa?, ¿algún doc sobra, falta, o hay que simplificar?
10. **Limpieza**: archivos muertos/deprecados; contenido en carpetas que no le tocan.
11. **Dinámica/proceso**: qué revela el estado del repo sobre cómo se trabaja (fricciones que se
    repiten, pasos manuales frágiles) — alimenta la mejora continua de la forma de trabajar.
12. **Medición** — ver abajo. Es el paso 3 del ritual de cierre de etapa y **no tenía portador**.

### 12 · El check de medición (obligatorio, con salida escrita)

> **Por qué está aquí y no en la cabeza de nadie.** `CLAUDE.md` dice que al cerrar una etapa
> se hace «(1) `sprint-review`, (2) archivar tareas, **(3) el check de medición**». El paso 3
> no estaba en ninguna parte: este barrido tenía once puntos y ninguno era de medición.
> Cinco etapas cerradas, cero checks hechos. Medido el 2026-08-19: **73 menciones de GA4 y
> Clarity en los tres documentos grandes, todas sobre INSTALAR la medición, y CERO
> decisiones que citen un dato de analítica como razón.** La web argumenta «del discovery al
> dato» y el método declara el bucle medir→aprender en dos documentos. Era el único hueco
> que contradecía la tesis del producto.

Cuatro preguntas, no más. **Se contestan con cifra y van en la salida como sección propia**;
una etapa no se cierra sin haberlas escrito.

> **EMPIEZA POR `npm run medicion`, y termina sellando** *(2026-09-02, D176)*. El comando lee
> las cuatro fuentes, **imprime el diff contra el cierre anterior** —que es la pregunta 2, ya
> contestada— y nombra las que no pudo leer con su motivo. Solo `consentimiento` se lee sola;
> GA4 lo lee una persona con el navegador y entra por bandera. Al cerrar:
> `npm run medicion -- --sellar --etapa=<la que cierra> --ventana=DESDE..HASTA --ga4-eventos=N --ga4-usuarios=N --primaria=N`.
> Sin ese sello, el cierre siguiente vuelve a depender de que alguien apuntara el número en un
> párrafo, que es de donde hubo que sacar grepeando el «45 usuarios» de julio.

1. **¿Qué dicen los marcadores del panel, y qué dice la métrica PRIMARIA?** No se escribe
   cuántos son —decía «los tres» y el panel iba camino de cuatro—: se lee lo que haya, últimos
   28 días, cifra y no impresión. Panel:
   `https://datastudio.google.com/reporting/6126da1d-21ba-480b-b56e-f124e47c2e01/page/I7T5F`
   **CÓMO SE LEEN, que es lo que faltaba** *(2026-08-29)*: con el navegador, que usa la sesión
   de Chrome de Francisco, así que panel y GA4 cargan autenticados. Los tabs que él ya tenga
   abiertos **no se ven** —se navega uno nuevo—. **Y no basta el panel:** solo publica «número
   de eventos», mientras que las lecturas que han valido algo salieron de la columna de
   **usuarios** de *GA4 → Informes → Interacción → Eventos*, a 28 días — el `9 / 2 usuarios`
   que abrió P69.91, y el par `form_start` ↔ `contact_submit`.
   **Ojo a la ventana RODANTE:** una caída puede ser solo que los eventos viejos salieron de
   los 28 días. Antes de leerla como regresión, comprueba si el solape con la ventana anterior
   la explica; el 2026-08-29 un 6 → 1 lo explicaba entero.
   **Y DESDE EL 2026-08-31 EL PANEL Y GA4 YA NO SON TODA LA MEDICIÓN** (D168/D169/D170). Dos
   fuentes más, y ninguna depende del consentimiento: **Vercel Web Analytics** (volumen
   absoluto, en el panel de Vercel) y **`npm run consentimiento`**, que da la tasa de
   aceptación. Y cambia CÓMO se lee GA4: sus cifras son un **índice relativo**, nunca un
   volumen. Ojo al denominador, que no es el mismo: el contador solo ve visitantes NUEVOS.
   **Y la primaria se busca aunque no esté en el panel**: `contact_submit` llevaba desde el
   2026-08-24 contando y ningún marcador la enseñaba, así que leer solo el panel habría dado
   «cero» donde el dato decía «la cadena funciona» (D71, cierre del sprint 4).
2. **¿Ha cambiado algo desde el cierre anterior?** Sin el número anterior no hay lectura, así
   que cada cierre deja el suyo apuntado para el siguiente.
3. **¿Hay algo aquí que cambie una prioridad del tablero?** Si la respuesta es **no**, dilo
   explícitamente. Un «no» escrito es una decisión; un silencio es el bucle sin cerrar.
4. **¿Sigue midiendo bien el instrumento?** Esta es la que faltó y la que costó caro. P31
   (el dashboard) se cerró el 2026-08-03 con dos de sus tres tiles en «No hay datos» y una
   nota que lo daba por **esperado** — «GA4 tarda 24-48h en procesarlo». Nadie volvió a
   mirar. *Una tarea de medición que se cierra sobre una predicción en vez de sobre una
   verificación no ha medido nada.* Y al abrirlo el 2026-08-19, la causa **no era** la que se
   suponía: el tag de GA4 estaba publicado desde el primer día y la medición llevaba dieciséis
   días funcionando. Lo roto eran los **filtros de los propios scorecards**, con el valor vacío.
   Si un scorecard está a cero, la primera hipótesis es **el instrumento**, no la audiencia — y
   dentro del instrumento, el **filtro del tile** antes que la instrumentación aguas arriba. El
   procedimiento de verificación, en `DECISIONS.md` **D71**.

Herramientas: `Bash`/`Grep`/`Glob` para el barrido; `Read` para los archivos grandes y los
puntos de entrada (routing, layout, `lib/`); cruza con `PRD-Live.md` / `PRD-Historical.md` /
`DECISIONS.md` para drift y huecos.

## Salida
1. **Análisis escrito**: veredicto rápido → fortalezas (para calibrar) → hallazgos **por
   severidad** (pronto / escala / limpieza, cada uno con "¿por qué importa?") → sección de
   docs → **sección de medición** (las cuatro preguntas del punto 12, con sus cifras y el
   número del cierre anterior) → huecos y dudas abiertas → **recomendaciones priorizadas**
   (marcando qué es "ya" y qué es "solo si crece").
2. **Propón antes de crear.** Preséntale a Francisco los hallazgos y la lista de tareas
   sugeridas para que confirme, ajuste o descarte.
3. **Crea/actualiza tareas** en el tablero para lo acordado, respetando las **reglas del
   tablero** de `CLAUDE.md` (Estado, MoSCoW, Prioridad con decimales para insertar, Área,
   Versión, Sprint, Tamaño). Sin duplicar las existentes.
4. **Y antes de dar un hallazgo por cerrado, BARRE A SUS HERMANOS** *(2026-08-31)*. Si encaja
   en una familia conocida, `grep` del mismo defecto en los archivos vecinos: la corrección se
   aplica donde se encontró y sus gemelos siguen vivos porque nadie los buscó. Se dio de alta
   como familia el día que `ci.yml` llevaba la regla escrita mientras sus dos vecinos de
   `.github/` la incumplían — y ese mismo día había otras dos instancias.

## Al terminar, dispara `method-review`

Esta revisión mira el **codebase**; la de metodología mira **cómo se trabaja** —los gates y su
proporción manual/automática, el presupuesto de contexto, si los guardianes saben fallar, el
drift de docs y skills, el bucle de medición, el tablero—. Van seguidas y en este orden, y el
sitio de la segunda es **el hueco entre dos sprints**: el andamiaje hay que ponerlo antes de
que existan las cosas que tiene que sostener.

**Nómbrala explícitamente en tu salida**, con el paso 4 del ritual de cierre de `CLAUDE.md`.
Es lo que impide que `method-review` sea una cosa más que hay que acordarse de disparar, que
es exactamente el fallo que ella misma va a buscar.

## Relación con otros flujos
- Es la revisión **técnica/de código**; el cierre de **documentación** de sesión lo hace el
  skill `close-session` (cadencia distinta: sesión vs sprint).
- El **archivado de tareas** del sprint que cierra (terminadas → Archivado; pendientes →
  "Sin empezar" del siguiente) sigue las reglas del tablero de `CLAUDE.md`; hazlo junto con
  esta revisión. **El barrido no toca el carril de contenido**: esa tarea no pertenece a
  ningún sprint, corre por delante y se queda como esté. Ya se la llevó por delante una vez y
  el sprint siguiente abrió bloqueado (2026-08-22).
- La revisión hermana de **Diseño** ya existe: skill `design-review` (cumplimiento del
  sistema + expresión de marca, verificando en pantalla). Es de **disparo manual** hasta que
  Francisco la valide, así que no se lanza sola al cerrar etapa — pero si esta revisión
  encuentra drift visual o incoherencias de diseño, propónsela. *(Sigue pendiente una
  hermana de Copy; esta cubre Desarrollo.)*

Tablero de tareas y su data source: ver "Referencias rápidas" del skill `close-session`.
