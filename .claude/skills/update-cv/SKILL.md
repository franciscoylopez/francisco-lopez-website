---
name: update-cv
description: >
  Actualizar el CV en PDF (ES + EN) y la web tras un cambio de carrera de Francisco:
  nuevo trabajo o cambio de rol/fechas, retocar un bullet o una métrica, ampliar el
  toolkit, una formación nueva o un hito. Regenera ambos PDFs desde la fuente única,
  verifica que caben en 2 páginas, deja los enlaces y el deploy listos y entrega el
  PDF para enviar. Úsalo siempre que Francisco diga cosas como "cambié de trabajo",
  "añade X al toolkit", "hice una formación", "actualiza el CV" o "regenera el CV".
---

# Actualizar el CV (y la web) — playbook

El CV se **genera por código** desde una **fuente única** (D22), y desde el
2026-08-17 esa fuente cambió de sitio: **de una experiencia, todo lo que se
cuenta —rol, periodo, sector, reporting, la frase de la home y los bullets— vive
en `content/experience-copy/`** (D57/D58). El CV no autora casi nada: decide **a
qué experiencias da papel** y aporta lo que es suyo (summary, hitos, skills).

> **Si vienes de una versión anterior de esta skill, lo que más ha cambiado:** los
> bullets del CV **ya no están en `content/cv/`** y **tocar uno cambia también la
> web**. Ver §0.

---

## 0 · Lo que hay que entender antes de editar nada

**De cada experiencia se cuenta lo mismo en tres longitudes, y son el MISMO
objeto:**

| Longitud | Dónde se lee | Campo |
|---|---|---|
| Larga — «En un minuto» | La página de deep-dive | `bullets[].deep` |
| Media — bullet del CV | El PDF | `bullets[].cv` |
| Corta — frase de Trayectoria | La home | `short` |

Las tres viven en `content/experience-copy/{es,en}.ts`. **El bullet del CV y su
gemelo del deep-dive son el mismo elemento del array**, así que no se puede
escribir uno sin el otro — y **editar un bullet del CV cambia la web**. Eso no es
un efecto secundario: es el objetivo. Mientras vivieron en archivos distintos
habían divergido **ocho veces**, y una era de hecho («construí el MVP» frente a
«definí el MVP junto al product designer»).

**La regla de derivación:** manda la larga. Si una cifra sube al CV, sube también
al deep-dive, y al revés.

---

## 1 · Qué editar según el cambio

| Cambio | Editar | Notas |
|---|---|---|
| **Nuevo trabajo / cambio de rol, empresa o fechas** | **CUATRO sitios**: `content/experience-copy/{es,en}.ts` (rol, periodo, sector, reporting, `short`, bullets) · `content/experiences.ts` → `EXPERIENCES` (logo y slug) · `content/cv/content.{es,en}.ts` → `experience` (**solo `company`**: a qué experiencias da papel el CV y en qué orden) · `app/[lang]/dictionaries/{es,en}/home.json` → `trayectoria` (**solo `company`**: qué filas salen en la home y en qué grupo) | El rol y el periodo **NO se escriben** ni en el CV ni en el diccionario: salen del registro. Si olvidas `content/experiences.ts`, `npm run build` **FALLA** — `experienceOf()` lanza a propósito (D44). |
| **Retocar un bullet o una métrica** | `content/experience-copy/{es,en}.ts` → `bullets[]` | **AFECTA A LA WEB.** `cv` y `deep` son el mismo elemento: se editan **uno al lado del otro**, no por separado. Y la cifra tiene que estar en los dos — el guardián lo comprueba. |
| **Reporting** | `content/experience-copy/` → `reporting: { deep, cv }` | Dos longitudes del mismo hecho: la corta para los Datos del deep-dive, la larga para el papel. |
| **Summary / hitos / skills del CV** | `content/cv/content.{es,en}.ts` | Esto **sí** es solo del CV. Los hitos son una lista curada, no derivable del bloque `hitos` de la home. |
| **Nueva formación** | Diccionario `formacion` (es + en) | El CV la hereda automáticamente. |
| **Nuevo item de toolkit / categoría** | Diccionario `toolkit` (es + en) | El CV toma categoría + nombre (sin descripción). |
| **Nuevo hito de la home** | Diccionario `hitos` **y**, si toca, `content.{es,en}.ts` → `milestones` | Son dos listas distintas a propósito. |
| **Contacto** | `content.{es,en}.ts` → `contact` (y `lib/contact.ts` para la web) | |

**Regla de idioma:** `es` es la fuente de verdad; el EN se **revisa contra el ES,
no se traduce literal** (D20). Ojo con el rol: **no se traduce** en este sitio
(«Product Manager», «Cofounder & Product»), y el guardián falla si ES y EN
divergen.

---

## 2 · El guardián, antes de regenerar

```bash
npm run check:experiencias
```

Corre en CI y comprueba lo que el typecheck no puede ver: que ES y EN tengan la
**misma cobertura** de bullets, que tenga versión larga **exactamente** quien tiene
página (`slug !== null`), que el rol no diverja entre idiomas, y que **una cifra no
viva en una longitud y falte en la otra**. Afirma cuánto ha mirado —«8 experiencias
· 62 bullets · 50 pares de cifras»—, así que un cero se lee como avería y no como
aprobado.

**Lo que el guardián NO puede ver, y sigue siendo trabajo de persona:** que dos
textos **digan** lo mismo. «Construí el MVP» y «definí el MVP junto al product
designer» tienen las mismas cifras —ninguna— y afirman cosas distintas. Esa se
coló durante meses.

---

## 3 · Regenerar los PDFs

```bash
npm run cv
```

Genera `public/cv/francisco-lopez-cv-es.pdf` y `…-en.pdf`, imprime el **nº de
páginas de cada uno** y avisa con ⚠ si supera 2. Y deja el **sello**
(`public/cv/cv.huella`) que usa el gate del §3.1: **commitea los tres**, PDFs y
sello, o CI falla.

> Si un PDF está **abierto en un visor**, la escritura falla con `EBUSY`. Pide a
> Francisco que cierre la vista previa y repite.

---

### 3.1 · Y el gate que impide olvidarse

```bash
npm run check:cv
```

Corre en CI y compara la **huella de lo que entra en el CV** contra el sello de la
última generación. Existe porque los PDFs son un artefacto **commiteado**: la
fuente única garantiza que no haya dos verdades, no que la copia impresa esté al
día. El 2026-08-18 un cambio de sector en `content/experience-copy/` dejó los dos
PDFs viejos y no lo vio nada.

Si falla, la respuesta es siempre la misma: `npm run cv` y commitear.

> **Lo que el gate NO ve:** un cambio de **estilos** en `generate.tsx` (márgenes,
> tipografía). Cambia el PDF y no cambia la huella — es deliberado, porque
> hashear el fuente del generador haría fallar el gate por un comentario, y quien
> toca los estilos está mirando el PDF de todas formas.

## 4 · Si se sale de 2 páginas — las dos palancas evidentes NO sirven

Está medido (P48.5), así que no se vuelve a intentar:

- **Quitar «Habilidades» no devuelve nada.** Estaba en la *cola que desborda*, no
  en la presión: Habilidades y Toolkit caían las dos en la página 3, y quitar la
  primera solo deja a la segunda ocupándola.
- **Recortar prosa tampoco.** Cada empleo se renderiza con `wrap={false}`, así que
  **salta entero** a la página siguiente: recortar dentro de un bloque no mueve el
  corte. Se recortó una cifra y la página 2 pasó de 71 a 70 fragmentos — el mismo
  número de páginas.

**Lo que sí funciona: apretar el margen ENTRE bloques, con el interlineado
INTACTO** (`job.marginBottom`, `bulletRow.marginBottom`, `section.marginTop` en
`scripts/cv/generate.tsx`). El criterio es de Francisco y es el correcto: **el
interlineado es legibilidad; el margen entre bloques es solo aire.**

Tercera opción: aceptar 3 páginas **con su OK explícito**.

---

## 5 · Verificar

- **Revisar visualmente**: abre cada PDF con **Read** (lee PDFs vía poppler) y
  comprueba maquetación, que no se parta nada raro, y que **web y CV coinciden en
  los hechos**. Con el registro único esto ya no puede divergir por copia, pero sí
  por edición a medias.
- **ATS**: el texto debe ser seleccionable — `pdftotext francisco-lopez-cv-es.pdf -`
  extrae el contenido (no es imagen).
- **Si tocaste bullets, mira también la página del deep-dive servida**: cambiaron
  las dos superficies.

---

## 6 · Enlaces de la web — no hay que tocar nada

Los enlaces se resuelven con `cvPath(lang)` (`lib/i18n/config.ts`) y cada punto de
uso deriva el suyo. Regenerar los PDFs basta; solo confirma que **ambos ficheros
existen** en `public/cv/`.

---

## 7 · Entregar y publicar

1. **Entrega el PDF** a Francisco con `SendUserFile`.
2. **Commit en rama corta** (D12) → `push` → **PR**.
3. **QA**: `npm run typecheck`, `npm run lint`, `npm run check:experiencias`,
   **`npm run check:cv`**, **`npm run check:raya`** y `npm run build`.
   *(`check:raya` entra en esta lista el 2026-08-19: desde que el guardián recorre las
   fuentes en vez de listar ficheros, `content/cv/` está bajo su vigilancia — y el fallo
   que lo destapó fue justo ahí, «Experiencia previa — Marketing & Growth» donde la web
   ya decía `·`. Tocar copy del CV puede tumbar este check.)*
4. **Publicar** = mergear a `main` y desplegar (D16). Es producción: **confírmalo
   con Francisco antes de mergear.** Tras el deploy, verifica que `/` sirve `-es` y
   `/en` sirve `-en`, y etiqueta `vX.Y.Z`.

---

## 8 · Gotchas

- **No dupliques hechos.** Rol, periodo, sector y reporting salen del registro; la
  formación y el toolkit, del diccionario. Escribirlos a mano en el CV es
  exactamente el drift que D57/D58 retiraron.
- **La unión es por `company`, por prefijo, y LANZA si no hay match.** El
  diccionario puede llevar la forma de display («Ontecnia (Malavida…)») y el
  registro la corta. Si renombras una empresa, cámbiala en los cuatro sitios del §1
  — el error es deliberado: mejor romper que generar un CV incoherente.
- **`matchFact` sigue existiendo, pero ya casi no aporta**: de la fila del
  diccionario solo saca el **proyecto paraguas** de los roles anidados («Shutapp
  Projects»), que es una agrupación de la home y no un hecho de la experiencia.
- **Assets**: foto en `assets/cv/`, fuentes en `assets/fonts/`. Si cambia la foto,
  reprocésala con `sharp` (D22).
- **Docs**: si el cambio altera una decisión, actualiza `DECISIONS.md` /
  `PRD-Live.md`; si hay tarea en Notion, refléjalo.

---

## 9 · Mapa de ficheros

- **`content/experience-copy/{es,en}.ts`** — **el archivo principal de esta tarea**:
  rol, periodo, sector, reporting, `short` y los bullets a dos longitudes.
- `content/experience-copy/types.ts` — el porqué del emparejamiento 1:1.
- `content/experiences.ts` — logo y slug por experiencia (D44).
- `content/cv/content.{es,en}.ts` — lo que es **solo del CV**: summary, hitos,
  skills, ui, contacto, y **a qué experiencias da papel** (solo `company`).
- `content/cv/types.ts` — tipos. `AuthoredJob` tiene **un solo campo**, y eso es la
  señal de que la experiencia se cuenta en un sitio.
- `scripts/cv/facts.ts` — lee del diccionario lo que sigue viviendo ahí: formación,
  toolkit y el proyecto paraguas. **Ya no lee roles ni periodos.**
- `scripts/cv/generate.tsx` — ensambla y renderiza; guard de páginas; estilos.
- `scripts/check-experience-copy.ts` — el guardián del §2.
- `scripts/cv/assemble.ts` — junta lo autorado con los hechos. Lo comparten el
  generador y el gate de frescura, que es por lo que vive fuera de `generate.tsx`.
- `scripts/cv/fingerprint.ts` + `scripts/check-cv-fresh.ts` — el gate del §3.1.
- `public/cv/cv.huella` — el sello. Se commitea con los PDFs.
- `app/[lang]/dictionaries/{es,en}/home.json` — `formacion`, `toolkit`, `hitos` y
  las filas de `trayectoria` (solo `company`).
- `lib/i18n/config.ts` → `cvPath(lang)`.
- `public/cv/francisco-lopez-cv-{es,en}.pdf` — salida (se commitea).
