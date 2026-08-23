// @pieza núcleo · pendiente · El campo de formulario: etiqueta, control y su error, con el resumen del envío.

import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// La capa de formulario (P67). El sitio no tenía ninguna: hasta ahora era de solo
// lectura, y esta es la primera superficie que recibe algo escrito por otra
// persona.
//
// POR QUÉ NO SALE DE shadcn, QUE ES LO QUE LA TAREA PEDÍA. La cascada de la
// «Regla de construcción» manda a shadcn los widgets «con estado, foco atrapado o
// portal», y un `<input>` no es ninguna de las tres cosas: el disparador no llega
// a activarse. Se trajo igualmente para comprobarlo, y lo que llegó fue esto:
//
//   · una dependencia nueva de frontend (`@base-ui/react`) para un `<input>`,
//     que además exigiría pasar antes por `/pick-ui-library`;
//   · `h-8` — 32px de alto, contra el suelo de 44px del checklist;
//   · `outline-none` + su propio anillo de 3px, cuando este sitio tiene UN
//     mecanismo de foco (`:focus-visible` global, 2px de `--ring` con offset) y
//     `BRAND.md` dice explícitamente que ninguna variante lo sobrescribe;
//   · `dark:bg-input/30`, `ring-destructive/20` y demás valores propios, fuera de
//     la disciplina de tokens.
//
// O sea que adoptarlo era reescribirle todas las clases y quedarse con el nombre
// del archivo más una dependencia. Se escribe aquí, con los tokens del sitio.
// Queda anotado porque contradice la letra de la tarea: si algún día entra un
// widget de verdad (un combobox, un date picker), la cascada sigue mandando.
//
// EL COLOR DEL ERROR es la decisión de sistema que se toma aquí, y sale medida:
// `--destructive` da 4,31:1 sobre `--background` en claro, así que NO llega ni a
// AA como texto. El mensaje va por tanto en `--foreground` y el rojo se queda
// donde 4,31 sí basta —el 3:1 que WCAG 1.4.11 pide a un componente—: el borde del
// campo y el icono. De paso, el error no queda codificado solo por color, que es
// el punto 6 del checklist.

const CONTROL = [
  // El suelo táctil es del control, no del contenedor: aquí es donde se pulsa.
  "w-full min-h-[44px] rounded-md border px-[0.85rem] py-[0.7rem]",
  "border-input bg-transparent text-foreground text-[0.95rem] leading-[1.5]",
  "placeholder:text-muted-foreground transition-colors",
].join(" ");

export type FieldProps = {
  /** El `id` del control, y la base del `id` de su mensaje de error. */
  id: string;
  name: string;
  label: string;
  /** Ya traducido: esta capa no sabe de idiomas. */
  error?: string;
  multiline?: boolean;
  rows?: number;
} & Omit<
  React.ComponentProps<"input"> & React.ComponentProps<"textarea">,
  "id" | "name" | "rows" | "className"
>;

export function Field({
  id,
  name,
  label,
  error,
  multiline = false,
  rows = 5,
  ref,
  ...rest
}: FieldProps & {
  ref?: React.Ref<HTMLInputElement & HTMLTextAreaElement>;
}) {
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    // `aria-invalid` y `aria-describedby` son lo que hace que un lector de
    // pantalla oiga el error AL LLEGAR al campo, y no solo al enviar.
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: cn(CONTROL, error && "border-destructive"),
  };

  return (
    <div className="flex flex-col gap-[0.4rem]">
      <label
        htmlFor={id}
        className="text-foreground text-[0.85rem] font-semibold"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          {...rest}
          rows={rows}
          ref={ref}
          className={cn(shared.className, "resize-y")}
        />
      ) : (
        <input {...shared} {...rest} ref={ref} />
      )}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </div>
  );
}

/** El mensaje de un campo. Icono rojo, texto legible: ver la nota de arriba. */
export function FieldError({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) {
  return (
    <p
      id={id}
      className="text-foreground m-0 flex items-start gap-[0.4rem] text-[0.82rem] leading-[1.4]"
    >
      <CircleAlert
        aria-hidden
        className="text-destructive mt-[0.15rem] size-[15px] shrink-0"
      />
      <span>{children}</span>
    </p>
  );
}

/**
 * El resumen que aparece al intentar enviar con errores. `role="alert"` para que
 * se anuncie sin robar el foco: el foco lo mueve el formulario al primer campo
 * que falla, y dos saltos a la vez dejan al lector de pantalla sin saber dónde
 * está.
 */
export function FieldErrorSummary({
  title,
  items,
}: {
  title: string;
  /** Los campos que fallan. Vacío = el aviso es el título y no hay lista. */
  items: string[];
}) {
  return (
    <div
      role="alert"
      className="border-destructive bg-background flex flex-col gap-[0.3rem] rounded-md border-l-2 px-[0.85rem] py-[0.6rem]"
    >
      <p className="text-foreground m-0 flex items-center gap-[0.4rem] text-[0.85rem] font-semibold">
        <CircleAlert
          aria-hidden
          className="text-destructive size-[16px] shrink-0"
        />
        {title}
      </p>
      {items.length > 0 ? (
        <ul className="text-muted-foreground m-0 list-disc pl-[1.6rem] text-[0.82rem]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
