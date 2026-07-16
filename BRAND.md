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
   - El color de acción es `primary` (cian). Botones, enlaces, foco y estados activos usan `primary`.

2. **Tokens de marca** (`brand-cyan`, `brand-purple`, `brand-cyan-soft`, `brand-purple-soft`).
   - Son DECORATIVOS: fondos de sección, detalles, ilustración, gráficos.
   - `brand-*-soft` (los pasteles) son de bajo contraste: NO los uses como color de texto, de botón ni de cualquier elemento que deba leerse. Solo relleno decorativo.
   - `brand-cyan` manda; `brand-purple` es apoyo, con cuentagotas.

## Accesibilidad (no negociable)

- Todo texto y todo elemento interactivo debe cumplir WCAG AA (4.5:1 texto, 3:1 UI).
- Los pasteles (`*-soft`) no pasan contraste como primer plano. Si necesitas texto sobre un fondo pastel, usa `foreground` (gris/hueso), nunca otro pastel.
- Cian primario: usa `#0B7C7C` en claro y `#3FC9C4` en oscuro (ya resuelto en los tokens; no lo hardcodees).

## Modo oscuro

Obligatorio en toda UI. Los pasteles se mantienen entre temas; solo el cian primario cambia (se aclara en oscuro). Nunca hardcodees hex: usa siempre los tokens, que ya conmutan.

## Split RGB (firma de marca)

Efecto reservado al logo / monograma, no a la UI general.
- Colores del split: `brand-cyan-split` (#16BDBD) + `brand-purple-split` (#9B87F5) sobre la forma principal.
- Requiere trazo grueso; a tamaño pequeño usa el logo plano de fallback, sin split.
- No lo apliques a texto fino ni a iconos.

## Qué cuestionar

Si una petición de UI implica meter un color de marca en un slot semántico neutro, romper contraste, o usar un pastel como color de acción, deténte y avísalo en vez de ejecutarlo.
