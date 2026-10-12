"use client";

import { Loader, CircleCheck } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

import { submitContact } from "@/app/[lang]/contacto/actions";
import { trackContactSubmit } from "@/lib/analytics";
import type { ContactoPaginaDict } from "@/app/[lang]/dictionaries";
import { actionVariants } from "@/components/ui/action";
import { Field, FieldErrorSummary } from "@/components/ui/field";
import { Rich } from "@/components/ui/rich";
import {
  FIELD_NAMES,
  HONEYPOT_FIELD,
  INITIAL_STATE,
  MESSAGE_MIN,
  TIMESTAMP_FIELD,
  type ContactValues,
  type FieldErrors,
  type FieldName,
  cuentaComoEnvio,
  hasErrors,
  validateContact,
} from "@/lib/contact-form";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { titleVariants } from "@/components/ui/heading";

// El formulario de contacto (P67). Primera superficie del sitio que ESCRIBE.
//
// FUNCIONA SIN JAVASCRIPT, y esa es la decisión que ordena el resto: el `<form>`
// lleva la Server Action en `action`, así que con el JS caído el navegador postea
// igual y el servidor contesta. Todo lo de este archivo —validar al salir de un
// campo, mover el foco, el estado «enviando»— es la capa de comodidad que se pone
// ENCIMA de eso, nunca el mecanismo. Por eso la validación de verdad está en la
// acción y no aquí (ver `lib/contact-form.ts`).
//
// LOS MENSAJES DE ERROR SALEN DEL DICCIONARIO, no del validador: la validación
// devuelve códigos y aquí se traducen. Es lo que evita que media página hable
// español en `/en/contact`, y es donde se olvida el i18n de un formulario.

const EMPTY: ContactValues = { nombre: "", email: "", mensaje: "" };

export function ContactForm({
  dict,
  lang,
  legalHref,
}: {
  dict: ContactoPaginaDict["form"];
  lang: Locale;
  /** A dónde lleva la capa 1 del aviso: la sección del art. 13 de `/cookies`. */
  legalHref: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitContact,
    INITIAL_STATE,
  );
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState(false);
  const firstErrorRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const stampRef = useRef<HTMLInputElement>(null);

  // El sello de tiempo se escribe EN EL DOM al montar, no en el estado: la
  // página es estática y prerenderizada, así que calcularlo al renderizar daría
  // la hora del build (y una discrepancia de hidratación). Un efecto que
  // actualiza un campo del formulario es exactamente para lo que sirve un
  // efecto: sincronizar React con algo de fuera. Meterlo en `useState` sería un
  // render de más por una cadena que nadie mira.
  useEffect(() => {
    if (stampRef.current) stampRef.current.value = String(Date.now());
  }, []);

  // El envío se mide cuando el SERVIDOR confirma, no al pulsar: un clic que
  // falla la validación o que no sale no es un contacto (PRD §7). Y «confirma»
  // no es `status === "sent"`: ese estado también lo devuelven los dos filtros
  // que callan, que no mandan correo. Quién cuenta lo decide `cuentaComoEnvio`,
  // que vive en `lib/` porque ahí la regla tiene tests (P52.5).
  const cuenta = cuentaComoEnvio(state);
  useEffect(() => {
    if (cuenta) trackContactSubmit();
  }, [cuenta]);

  // Si el servidor rechaza algo que el cliente dio por bueno, manda el
  // servidor. Se DERIVA en el render en vez de copiarse al estado con un
  // efecto: son la misma información en dos sitios, y copiarla es lo que
  // provoca la cascada de renders que avisa `react-hooks/set-state-in-effect`.
  // El cliente pisa al servidor porque es el más reciente: al escribir se
  // limpia el error del campo, y esa limpieza tiene que ganarle a la respuesta
  // anterior.
  const errors: FieldErrors =
    state.status === "invalid"
      ? { ...state.errors, ...clientErrors }
      : clientErrors;
  const summaryVisible = summary || state.status === "invalid";

  const message = (name: FieldName): string | undefined => {
    const code = errors[name];
    if (!code) return undefined;
    const perField: Record<string, string> = dict.errors[name];
    const text = perField[code];
    if (!text) return undefined;
    return text
      .replace("{n}", String(values[name].trim().length))
      .replace("{min}", String(MESSAGE_MIN));
  };

  const setField = (name: FieldName, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    // Un error se retira en cuanto deja de ser cierto, nunca antes: revalidar en
    // cada tecla desde el primer carácter regaña mientras se escribe.
    setClientErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  };

  const blurField = (name: FieldName) => {
    const next = validateContact(values);
    setClientErrors((e) => ({ ...e, [name]: next[name] }));
  };

  const onSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    const next = validateContact(values);
    if (!hasErrors(next)) return; // Sigue adelante: la acción se encarga.
    // Con el JS activo se corta aquí para no gastar un viaje en un campo vacío.
    event.preventDefault();
    setClientErrors(next);
    setSummary(true);
    // El foco va al primer campo que falla: sin esto, un lector de pantalla se
    // entera de que algo pasó pero no de dónde.
    requestAnimationFrame(() => firstErrorRef.current?.focus());
  };

  if (state.status === "sent") {
    return <Sent dict={dict} onAgain={() => window.location.reload()} />;
  }

  const failing = FIELD_NAMES.filter((name) => errors[name]);

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-[1.1rem]"
    >
      <div>
        <h2 className={cn(titleVariants({ size: "sub" }), "text-foreground")}>
          {dict.title}
        </h2>
        <p className="text-muted-foreground m-0 mt-[0.3rem] text-[0.875rem]">
          {dict.respuesta}
        </p>
      </div>

      {summaryVisible && failing.length > 0 ? (
        <FieldErrorSummary
          title={dict.summary}
          items={failing.map((name) => dict.labels[name])}
        />
      ) : null}

      {state.status === "failed" ? (
        <FieldErrorSummary title={dict.failed[state.reason]} items={[]} />
      ) : null}

      {/* Dos columnas para los cortos: bajo una cabecera a ancho completo, una
          sola columna de campos deja el bloque encogido y descentrado. */}
      <div className="grid grid-cols-1 gap-[1.1rem] sm:grid-cols-2">
        {(["nombre", "email"] as const).map((name) => (
          <Field
            key={name}
            id={`contacto-${name}`}
            name={name}
            label={dict.labels[name]}
            placeholder={dict.placeholders[name]}
            error={message(name)}
            value={values[name]}
            onChange={(e) => setField(name, e.target.value)}
            onBlur={() => blurField(name)}
            type={name === "email" ? "email" : "text"}
            autoComplete={name === "email" ? "email" : "name"}
            spellCheck={name === "email" ? false : undefined}
            ref={failing[0] === name ? firstErrorRef : undefined}
          />
        ))}
      </div>

      <Field
        id="contacto-mensaje"
        name="mensaje"
        label={dict.labels.mensaje}
        placeholder={dict.placeholders.mensaje}
        error={message("mensaje")}
        value={values.mensaje}
        onChange={(e) => setField("mensaje", e.target.value)}
        onBlur={() => blurField("mensaje")}
        multiline
        rows={5}
        ref={failing[0] === "mensaje" ? firstErrorRef : undefined}
      />

      {/* La trampa. `aria-hidden` + `tabIndex={-1}` la sacan del recorrido de
          teclado y del lector de pantalla, así que ninguna persona la encuentra;
          un bot rellena todo lo que parece un campo. No se oculta con
          `type="hidden"`: eso no lo rellena nadie y la trampa no cazaría nada. */}
      <div aria-hidden className="hidden">
        <label htmlFor="contacto-empresa">{dict.honeypot}</label>
        <input
          id="contacto-empresa"
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name={TIMESTAMP_FIELD} ref={stampRef} />
      <input type="hidden" name="lang" value={lang} />

      <button
        type="submit"
        disabled={pending}
        aria-busy={pending || undefined}
        className={cn(
          actionVariants({ variant: "solid", size: "lg" }),
          "w-full",
          pending && "cursor-progress",
        )}
      >
        {/* El sólido NO lleva icono: la regla mira la acción, y enviar no saca al
            usuario de la página. El spinner no es un icono de acción, es el
            estado, y por eso solo aparece mientras dura. */}
        {pending ? (
          <Loader
            aria-hidden
            className="size-[18px] shrink-0 animate-spin motion-reduce:animate-none"
          />
        ) : null}
        {pending ? dict.sending : dict.submit}
      </button>

      {/* Capa 1 del art. 13 del RGPD: lo esencial donde se recogen los datos, con
          enlace al documento completo. Es el modelo por capas de la AEPD, y sin
          casilla de aceptación a propósito (P66): con la base legal de medidas
          precontractuales, la línea visible antes de enviar basta. */}
      <p className="text-muted-foreground m-0 text-[0.8125rem] leading-[1.5]">
        <Rich text={`${dict.legal} [${dict.legalLink}](${legalHref}).`} />
      </p>
    </form>
  );
}

/** Confirmación. `role="status"` porque sustituye al formulario sin robar el foco. */
function Sent({
  dict,
  onAgain,
}: {
  dict: ContactoPaginaDict["form"];
  onAgain: () => void;
}) {
  return (
    <div role="status" className="flex flex-col items-start gap-[0.9rem]">
      <CircleCheck aria-hidden className="text-primary size-[28px]" />
      {/* ES UN `h2` Y NO UN `p` (design-review, 2026-08-23): al enviar, este
          bloque SUSTITUYE al formulario entero, y con él al `h2` que lo abría.
          Con un párrafo, la página perdía un encabezado al cambiar de estado y su
          esquema dejaba de ser el mismo que verifica `check:marco` sobre el HTML
          prerenderizado — que nunca ve este estado, porque solo existe después de
          un envío. El punto 4 del checklist es de la página, no del primer
          render. */}
      {/* NO SALE DE `titleVariants`, y es el único de los doce de P70.20 que se
          queda fijo. Es el acuse de envío, y mide MÁS que el título del propio
          formulario a propósito: el formulario desaparece y esto ocupa su sitio,
          así que tiene que leerse como un remate y no como otra cabecera. El
          título es `sub`, cuyo suelo son estos mismos 1,35rem; con `sub` los dos
          serían iguales y se perdería la diferencia que alguien decidió. Al
          segundo caso de «un escalón por encima de `sub`», es una variante. */}
      <h2 className="font-display text-foreground m-0 text-[1.5rem] font-semibold">
        {dict.sent.title}
      </h2>
      <p className="text-muted-foreground m-0 max-w-[34ch] text-[0.95rem] leading-[1.6]">
        {dict.sent.body}
      </p>
      <button
        type="button"
        onClick={onAgain}
        className={actionVariants({ variant: "outline-neutral", size: "md" })}
      >
        {dict.sent.again}
      </button>
    </div>
  );
}
