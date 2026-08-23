"use client";

import Link from "next/link";

import {
  CircleAlert,
  CircleCheck,
  Download,
  Loader,
  Mail,
  Phone,
} from "lucide-react";

import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { LinkedinIcon } from "@/components/ui/icons";
import {
  EMAIL,
  LINKEDIN_DISPLAY,
  LINKEDIN_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  mailtoHref,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

import { COPY, type ContactForm, type FieldName } from "./use-contact-form";

// Piezas compartidas por las cuatro variantes. Lo que cambia entre ellas es el
// `look` que se les pasa, nunca el comportamiento ni el marcado accesible.
//
// EL COLOR DEL ERROR, que es la única decisión de sistema que se toma aquí:
// `--destructive` mide 4,31:1 sobre `--background` en claro y 5,86:1 en oscuro
// (medido 2026-08-23, con los anclajes del sitio reproducidos exactos). O sea que
// en claro NO llega ni a AA como texto. Así que el MENSAJE va en `--foreground`
// —13,79 / 15,32— y `--destructive` se usa solo como marca no textual: el icono y
// el filete, donde 4,31 supera de sobra el 3:1 que WCAG 1.4.11 pide a un
// componente. De paso, el error no queda codificado solo por color (punto 6).

export type FieldLook = "boxed" | "underline" | "inset";

const FIELD_BASE =
  "w-full min-h-[44px] bg-transparent text-[0.95rem] text-foreground placeholder:text-muted-foreground";

const FIELD_LOOK: Record<FieldLook, string> = {
  // Caja completa: la forma que espera cualquiera que haya rellenado un formulario.
  boxed: "border-input rounded-md border px-[0.85rem] py-[0.7rem]",
  // Solo filete inferior: el campo se lee como una línea de escritura, no como una caja.
  underline:
    "border-input rounded-none border-0 border-b px-0 py-[0.7rem] focus-visible:border-primary",
  // Relleno sin borde: el campo es un hueco excavado en la superficie que lo contiene.
  inset: "bg-background rounded-md border-transparent px-[0.85rem] py-[0.7rem]",
};

export function Field({
  form,
  name,
  look,
  multiline = false,
  rows = 5,
}: {
  form: ContactForm;
  name: FieldName;
  look: FieldLook;
  multiline?: boolean;
  rows?: number;
}) {
  const error = form.errors[name];
  const id = `f-${name}`;
  const errId = `${id}-err`;
  // El ref solo lo toma el PRIMER campo con error, que es a donde salta el foco.
  const isFirstError = form.errorList[0] === name;

  const shared = {
    id,
    name,
    value: form.values[name],
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? errId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      form.setField(name, e.target.value),
    onBlur: () => form.blurField(name),
    placeholder: COPY.placeholders[name],
    className: cn(
      FIELD_BASE,
      FIELD_LOOK[look],
      error && look !== "underline" && "border-destructive",
      error && look === "underline" && "border-destructive",
    ),
  };

  return (
    <div className="flex flex-col gap-[0.4rem]">
      <label
        htmlFor={id}
        className="text-foreground text-[0.85rem] font-semibold"
      >
        {COPY.labels[name]}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={rows}
          ref={
            isFirstError
              ? (form.firstErrorRef as React.Ref<HTMLTextAreaElement>)
              : undefined
          }
          className={cn(shared.className, "resize-y")}
        />
      ) : (
        <input
          {...shared}
          type={name === "email" ? "email" : "text"}
          autoComplete={
            name === "email" ? "email" : name === "nombre" ? "name" : undefined
          }
          ref={
            isFirstError
              ? (form.firstErrorRef as React.Ref<HTMLInputElement>)
              : undefined
          }
        />
      )}
      {error ? (
        <p
          id={errId}
          className="text-foreground flex items-start gap-[0.4rem] text-[0.82rem] leading-[1.4]"
        >
          <CircleAlert
            aria-hidden
            className="text-destructive mt-[0.15rem] size-[15px] shrink-0"
          />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

/** Resumen de errores al enviar. `role="alert"` para que se anuncie sin mover el foco dos veces. */
export function ErrorSummary({ form }: { form: ContactForm }) {
  if (!form.summaryVisible || form.errorList.length === 0) return null;
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
        {COPY.summary}
      </p>
      <ul className="text-muted-foreground m-0 list-disc pl-[1.6rem] text-[0.82rem]">
        {form.errorList.map((k) => (
          <li key={k}>{COPY.labels[k]}</li>
        ))}
      </ul>
    </div>
  );
}

export function Submit({
  form,
  full = true,
}: {
  form: ContactForm;
  full?: boolean;
}) {
  const sending = form.phase === "sending";
  return (
    <button
      type="submit"
      disabled={sending}
      aria-busy={sending || undefined}
      className={cn(
        actionVariants({ variant: "solid", size: "lg" }),
        full && "w-full",
        sending && "cursor-progress opacity-90",
      )}
    >
      {/* El sólido NO lleva icono: la regla mira la acción, y enviar no saca al
          usuario de la página. El spinner no es un icono de acción, es el estado. */}
      {sending ? (
        <Loader
          aria-hidden
          className="size-[18px] shrink-0 animate-spin motion-reduce:animate-none"
        />
      ) : null}
      {sending ? COPY.sending : COPY.submit}
    </button>
  );
}

/** Confirmación. `role="status"` porque sustituye al formulario sin robar el foco. */
export function Sent({
  form,
  tone = "page",
}: {
  form: ContactForm;
  tone?: "page" | "card";
}) {
  return (
    <div
      role="status"
      data-surface={tone === "card" ? "card" : undefined}
      className="flex flex-col items-start gap-[0.9rem]"
    >
      <CircleCheck aria-hidden className="text-primary size-[28px]" />
      <p className="font-display text-foreground m-0 text-[1.5rem] font-semibold">
        {COPY.sentTitle}
      </p>
      <p className="text-muted-foreground m-0 max-w-[34ch] text-[0.95rem] leading-[1.6]">
        {COPY.sentBody}
      </p>
      <button
        type="button"
        onClick={form.reset}
        className={actionVariants({ variant: "outline-neutral", size: "md" })}
      >
        {COPY.sentAgain}
      </button>
    </div>
  );
}

/**
 * Los cuatro canales. Van en variante de CONTENIDO (`.link-content`), que es lo que
 * P65 decidió al retirar la excepción de `ContactSecondary`.
 *
 * EL ICONO ES LA DECISIÓN ABIERTA, y por eso es una prop y no un valor fijo.
 * `BRAND.md` excluye el icono del enlace de contenido porque en PROSA rompe la
 * línea base. Aquí no están en prosa sino en columna, donde el icono clasifica el
 * canal de un vistazo y no hay línea base que romper. Si esto se promueve, es una
 * variante nueva de la regla y hay que escribirla con fecha.
 */
export function Channels({
  layout = "column",
  icons = true,
  inverted = false,
}: {
  layout?: "column" | "row";
  icons?: boolean;
  inverted?: boolean;
}) {
  const items = [
    { icon: Mail, label: EMAIL, href: mailtoHref() },
    { icon: Phone, label: PHONE_DISPLAY, href: `tel:${PHONE_TEL}` },
    { icon: LinkedinIcon, label: LINKEDIN_DISPLAY, href: LINKEDIN_URL },
    {
      icon: Download,
      label: "Descargar CV",
      href: "/cv/francisco-lopez-cv-es.pdf",
    },
  ];
  return (
    <ul
      className={cn(
        "m-0 list-none p-0",
        layout === "column"
          ? "flex flex-col gap-[0.85rem]"
          : "flex flex-wrap items-center gap-x-[1.4rem] gap-y-[0.6rem]",
      )}
    >
      {items.map(({ icon: Icon, label, href }) => (
        <li key={label} className="flex min-h-[44px] items-center gap-[0.6rem]">
          {icons ? (
            <Icon
              aria-hidden
              className={cn(
                "size-[17px] shrink-0",
                inverted ? "text-background/70" : "text-muted-foreground",
              )}
            />
          ) : null}
          <a
            href={href}
            className={cn(
              // HALLAZGO DE SISTEMA, no capricho de esta variante: `.link-content`
              // fija `color: var(--foreground)`, y en una banda invertida
              // `--foreground` ES EL FONDO. El enlace se pinta del color de la
              // banda y desaparece: solo queda el subrayado flotando. Se vio en
              // pantalla, no leyendo el CSS.
              //
              // O sea que la capa de CONTENIDO no tiene contraparte invertida,
              // mientras que la de chrome sí (`tone: "inverted"`, escrita en
              // `chrome.tsx` por este mismo motivo). Así que la variante Mostrador
              // NO PUEDE cumplir lo que decidió P65 —canales en variante de
              // contenido— sin crear antes esa contraparte. Es un coste real de
              // esta dirección, y por eso se deja a la vista en lugar de taparlo.
              inverted
                ? chromeLinkVariants({ tone: "inverted" })
                : "link-content link-content--underline",
              "text-[0.95rem]",
              // Un correo de 39 caracteres es la cadena más larga que sirve el
              // sitio: sin esto reaparece el scroll horizontal que cerró P65.5.
              "break-words",
            )}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Capa 1 de la información del art. 13 del RGPD: lo esencial donde se recogen los
 * datos, con enlace al documento completo. Es el modelo de información por capas
 * que recomienda la AEPD, y no cabe de otra forma bajo un formulario de tres
 * campos.
 *
 * SIN CASILLA DE ACEPTACIÓN, a propósito: con la base legal de medidas
 * precontractuales, la línea visible antes de enviar basta, y una casilla mete
 * fricción en el único bloque del sitio cuyo argumento entero es quitarla. Es
 * criterio, no dictamen, y es la parte que conviene verificar con un abogado.
 *
 * El enlace apunta a `/cookies` porque la recomendación de P66 es NO crear una
 * página nueva: se retitula esa a «Privacidad y cookies» y se le añade la sección
 * del formulario. Misma URL, ningún enlace roto, un solo enlace de footer.
 */
export function Legal() {
  return (
    <p className="text-muted-foreground m-0 text-[0.8125rem] leading-[1.5]">
      {COPY.legal}{" "}
      <Link href="/cookies" className="link-content link-content--underline">
        {COPY.legalLink}
      </Link>
      .
    </p>
  );
}

/** Canales en tratamiento de chrome, para la variante que los quiere discretos. */
export function ChannelsChrome() {
  return (
    <ul className="m-0 flex list-none flex-wrap items-center gap-[0.35rem] p-0">
      {[
        { label: EMAIL, href: mailtoHref() },
        { label: PHONE_DISPLAY, href: `tel:${PHONE_TEL}` },
        { label: "LinkedIn", href: LINKEDIN_URL },
      ].map(({ label, href }) => (
        <li key={label}>
          <a
            href={href}
            className={cn(
              chromeLinkVariants({ tone: "muted" }),
              "text-[0.85rem] break-words",
            )}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
