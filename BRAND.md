# Sistema de marca

Reglas de identidad visual para este proyecto. Aplícalas siempre al generar UI.

## Stack

Next.js + TypeScript + Tailwind (v4) + shadcn/ui. Iconos: lucide-react.
Los tokens viven en `app/globals.css`. No inventes colores fuera de esos tokens.

## Tipografía

- **Titulares (h1–h4):** Bricolage Grotesque, weight 600. Variable `--font-bricolage` / utilidad `font-display`.
- **Texto y UI:** Inter. Variable `--font-inter` / utilidad `font-sans` (por defecto).
- No uses Bricolage para texto corrido ni para labels de formulario.

## Color — regla de las dos capas

El sistema tiene DOS grupos de tokens que no se mezclan:

1. **Tokens semánticos de shadcn** (`primary`, `secondary`, `muted`, `accent`, `border`…).
   - `secondary`, `accent` y `muted` son NEUTROS a propósito. Nunca los pintes de cian ni de morado.
   - El color de acción es `primary` (cian): botones, foco y estados activos.
   - **Enlaces: depende de si son contenido o chrome.**
     - **Contenido** (dentro del cuerpo de una sección, en medio del texto): `primary`. Es donde el cian hace su trabajo, señalar que ahí hay una acción en un sitio donde no se espera.
     - **Chrome de navegación** (nav, breadcrumb, footer, menús): `foreground` o `muted-foreground`, nunca `primary`. En un bloque cuya función *entera* es navegar, el cian no distingue nada: solo mete ruido. Se leen como enlace por su posición, y el subrayado al pasar por encima o al recibir foco basta como afordancia.

     *Matizado 2026-07-21:* la redacción anterior decía "botones, enlaces, foco y estados activos usan `primary`", sin distinguir. Producía un breadcrumb con "Inicio" en cian (#0B7C7C) justo debajo de un nav que ya usaba `foreground` (#21262B) para "Descargar CV" — dos elementos de chrome contiguos con criterios distintos, y el que se salía era el que seguía la regla al pie de la letra.

2. **Tokens de marca** (`brand-cyan`, `brand-purple`, `brand-cyan-soft`, `brand-purple-soft`).
   - Son DECORATIVOS: fondos de sección, detalles, ilustración, gráficos.
   - `brand-*-soft` (los pasteles) son de bajo contraste: NO los uses como color de texto, de botón ni de cualquier elemento que deba leerse. Solo relleno decorativo.
   - `brand-cyan` manda; `brand-purple` es apoyo, con cuentagotas.
   - `brand-purple-accent` (oklch(0.62 0.16 290)): variante de `brand-purple` ajustada para servir como texto/acento legible en **secciones con fondo invertido** (fondo = `foreground`, texto = `background`), donde el `brand-purple` estándar no llega a AA de texto grande en ambas direcciones de tema. Úsalo solo ahí — como acento de texto grande (≥3:1, no como texto corrido ≥4.5:1) sobre esos fondos invertidos. Fuera de ese contexto, sigue usando `brand-purple`.

## Accesibilidad (no negociable)

- Todo texto y todo elemento interactivo debe cumplir WCAG AA (4.5:1 texto, 3:1 UI). **AA es el suelo, no el objetivo:** se empuja a AAA siempre que se pueda. Estado a 2026-07-22, todo medido: texto principal 13,79:1 claro y 15,32:1 oscuro; `primary` como texto 7,01:1 y 8,36:1; texto sobre botón 7,44:1 y 8,36:1; `muted-foreground` 7,12:1 y 7,08:1. **Todo el sistema está en AAA en ambos temas**, sin ningún par en AA suelto.
- Los pasteles (`*-soft`) no pasan contraste como primer plano. Si necesitas texto sobre un fondo pastel, usa `foreground` (gris/hueso), nunca otro pastel.
- Cian primario: `#005E5F` en claro y `#3FC9C4` en oscuro (ya resuelto en los tokens; no lo hardcodees).

  *Ajustado 2026-07-22:* el cian claro era `#0B7C7C`, que daba **4,53:1** como texto sobre el fondo — pasaba AA por 0,03. Aprobado raspado: cualquier retoque futuro del cian o del fondo lo tumbaba sin que nadie se enterase, y como botón estaba aún más justo (4,81:1). Al comparar las opciones se vio que llegar a AAA costaba un oscurecimiento **visualmente indistinguible**, así que quedarse en AA era dejar margen sobre la mesa por nada. Ahora da **7,01:1 como texto y 7,44:1 sobre botón**, y `primary` es AAA en los dos temas (oscuro ya estaba en 8,36:1). `--brand-cyan` se mueve con él para que no queden dos cianes casi iguales con nombres distintos. **El `brand-cyan-split` del logo (#16BDBD) no se toca:** es otro token, no tiene requisito de contraste y la firma no se negocia.

## Modo oscuro

Obligatorio en toda UI. Los pasteles se mantienen entre temas; solo el cian primario cambia (se aclara en oscuro). Nunca hardcodees hex: usa siempre los tokens, que ya conmutan.

## Qué cuestionar

Si una petición de UI implica meter un color de marca en un slot semántico neutro, romper contraste, o usar un pastel como color de acción, deténte y avísalo en vez de ejecutarlo.

## Logo y firma split

Componente: `components/ui/logo.tsx` → `<Logo />` (variantes `split`/`flat`, props `showWordmark`/`forceColor`; hereda claro/oscuro por tokens).

**Reglas mínimas siempre activas:**
- El **split es la firma de marca**: solo en el logo/monograma y solo a **≥48px** (por debajo, `flat`). Nunca en UI general, texto fino ni iconos.
- Colores del split: `brand-cyan-split` (#16BDBD) + `brand-purple-split` (#9B87F5). No tienen requisito de contraste; **no se tocan**.
- Tamaño mínimo del componente: 24px. El favicon 16px usa asset propio, no el componente reescalado.

**El detalle exhaustivo** (tabla de uso por contexto, umbrales split→flat, proporciones símbolo/wordmark, transición del nav, «dónde respira la marca» y el rationale fechado) vive en **`BRAND-logo.md`** — consúltalo **al tocar el logo o los assets de marca**. No se `@`-importa.
