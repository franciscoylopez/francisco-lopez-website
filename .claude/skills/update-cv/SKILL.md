---
name: update-cv
description: >
  Actualizar el CV en PDF (ES + EN) y la web tras un cambio de carrera de Francisco:
  nuevo trabajo o cambio de rol/fechas, ampliar el toolkit, una formación nueva, un
  hito o una métrica. Regenera ambos PDFs desde la fuente única, verifica que caben
  en 2 páginas, deja los enlaces y el deploy listos y entrega el PDF para enviar.
  Úsalo siempre que Francisco diga cosas como "cambié de trabajo", "añade X al
  toolkit", "hice una formación", "actualiza el CV" o "regenera el CV".
---

# Actualizar el CV (y la web) — playbook

El CV se **genera por código** desde una **fuente única** (D22). Los **hechos**
(periodos, roles, formación, toolkit) viven en el **diccionario i18n** de la web y
el CV los **hereda**; el **texto rico** del CV (summary, bullets, métricas,
reporting) vive aparte. Por eso una actualización toca la web y el CV de forma
coordinada, y **nunca hay que duplicar hechos**.

## 1 · Qué editar según el cambio

| Cambio | Editar | Notas |
|---|---|---|
| **Nuevo trabajo / cambio de rol, empresa o fechas** | `app/[lang]/dictionaries/es.json` **y** `en.json` → bloque `trayectoria` (facts + copy de la web) **y** `scripts/cv/content.es.ts` / `content.en.ts` → array `experience` (context + reporting + bullets del CV) | El CV une por la clave `company`. La misma empresa debe existir en ambos sitios (ver §6). El rol/periodo del CV salen del diccionario: **no** los escribas en el CV. |
| **Nueva formación** | Solo diccionario `formacion` (es + en) | El CV la hereda automáticamente. |
| **Nuevo item de toolkit / categoría** | Solo diccionario `toolkit` (es + en) | El CV toma categoría + nombre (sin descripción). |
| **Nuevo hito** | Diccionario `hitos` (web) **y** `content.{es,en}.ts` → `milestones` | Los hitos del CV son una lista curada (no derivable limpiamente del bloque `hitos`). |
| **Retocar un bullet / métrica / summary / reporting del CV** | Solo `content.{es,en}.ts` | No afecta a la web. |
| **Skills del CV** | Solo `content.{es,en}.ts` → `skills` | La web no tiene sección de skills. |
| **Contacto** | `content.{es,en}.ts` → `contact` (y donde la web los muestre) | |

Regla de idioma: **`es.json` / `content.es.ts` son la fuente de verdad**; el EN se
**revisa contra el ES, no se traduce literal** (D20). El `kicker`/eyebrow de una
sección no repite su título.

## 2 · Regenerar los PDFs

```
npm run cv
```

Genera `public/cv/francisco-lopez-cv-es.pdf` y `…-en.pdf`. La salida imprime el
**nº de páginas de cada uno** y **avisa con ⚠ si supera 2**.

> Si un PDF está **abierto en un visor** (p. ej. la vista previa del panel), la
> escritura falla con `EBUSY`. Pide a Francisco que cierre la vista previa y repite.

## 3 · Verificar

- **Objetivo: 2 páginas.** Si `npm run cv` avisa de 3:
  1. Recorta bullets (5-6 en roles grandes / 3 en cortos, PRD §25 conf 6), o
  2. aprieta el espaciado en los estilos de `scripts/cv/generate.tsx`
     (`job.marginBottom`, `bulletRow.marginBottom`, `section.marginTop`…), o
  3. acepta 3 páginas **con el OK explícito de Francisco**.
- **Revisar visualmente**: abre cada PDF con la herramienta **Read** (lee PDFs vía
  poppler, ver D22) y comprueba maquetación, que no se parta nada raro, y que
  **web y CV coinciden en los hechos** (mismos rol/fecha/empresa).
- **ATS**: el texto debe ser seleccionable — `pdftotext francisco-lopez-cv-es.pdf -`
  debe extraer el contenido (no es imagen).

## 4 · Enlaces de la web — no hay que tocar nada

Los enlaces del CV se resuelven por locale con `cvPath(lang)` (`lib/i18n/config.ts`)
y el **menú deriva su propio enlace**; la home los usa en Trayectoria y Contacto.
Regenerar los PDFs basta: cada idioma ya sirve el suyo. Solo confirma que **ambos
ficheros existen** en `public/cv/`.

## 5 · Entregar y publicar

1. **Entrega el PDF** a Francisco para enviarlo: `SendUserFile` con el/los PDF(s).
2. **Commit en rama corta** (D12): `git checkout -b <feat|fix|docs>/cv-...`, commitea
   los cambios (dicts + content + PDFs regenerados) → `push` → **PR**.
3. **QA**: `npm run typecheck` y `npm run build` deben pasar.
4. **Publicar** = mergear el PR a `main` y desplegar en Vercel (D16). Es una acción
   de producción: **confírmalo con Francisco antes de mergear**. Tras el deploy,
   verifica en `franciscolopez.es` que `/` sirve `-es` y `/en` sirve `-en`, y
   etiqueta la release `vX.Y.Z`.

## 6 · Gotchas

- **Single-source de hechos**: no dupliques periodos/roles/formación/toolkit en el
  CV; salen del diccionario. Si los escribes a mano en el CV, divergen.
- **El join CV ↔ diccionario es por `company`** (por prefijo). Si **renombras una
  empresa**, cámbiala en el diccionario **y** en la clave `company` del CV, o el
  generador lanza un error claro al no encontrar los hechos. Ese error es
  deliberado: prefiere fallar a generar un CV con datos incoherentes.
- **Assets**: la foto redondeada está en `assets/cv/`; las fuentes en
  `assets/fonts/`. Si cambia la foto de origen, reprocésala con `sharp` (ver D22).
- **Docs**: si el cambio altera una decisión, actualiza `DECISIONS.md` / `PRD-Live.md` (o `PRD-Historical.md`);
  si hay tarea en Notion, refléjalo.

## 7 · Mapa de ficheros

- `scripts/cv/content.{es,en}.ts` — texto rico autorado (fuente ES).
- `scripts/cv/facts.ts` — lee los hechos del diccionario (formación, toolkit, roles/periodos).
- `scripts/cv/generate.tsx` — ensambla y renderiza; guard de páginas; estilos de marca.
- `scripts/cv/types.ts` — tipos.
- `app/[lang]/dictionaries/{es,en}.json` — diccionario (fuente de los hechos + web).
- `lib/i18n/config.ts` → `cvPath(lang)` — ruta del PDF por locale.
- `public/cv/francisco-lopez-cv-{es,en}.pdf` — salida (se commitea).
