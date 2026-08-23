"use client";

import { useCallback, useRef, useState, type FormEvent } from "react";

// La máquina de estados que comparten las cuatro variantes. Vive aparte a
// propósito: lo que se está comparando es la FORMA del bloque, así que el
// comportamiento tiene que ser idéntico en las cuatro o la comparación mide otra
// cosa. Aquí no hay ninguna decisión de diseño.

export type FieldName = "nombre" | "email" | "mensaje";
export type FormPhase = "idle" | "sending" | "sent";

export type Errors = Partial<Record<FieldName, string>>;

const MENSAJE_MIN = 10;

/** Validación deliberadamente simple: la del servidor es otra cosa (P67). */
function validate(values: Record<FieldName, string>): Errors {
  const e: Errors = {};
  if (!values.nombre.trim())
    e.nombre = "Escribe tu nombre para saber quién eres.";
  if (!values.email.trim()) e.email = "Necesito un correo al que responderte.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
    e.email =
      "Ese correo no parece completo. Revisa la parte de después de la arroba.";
  if (!values.mensaje.trim())
    e.mensaje = "Cuéntame algo, aunque sean dos líneas.";
  else if (values.mensaje.trim().length < MENSAJE_MIN)
    e.mensaje = `Un poco más de contexto ayuda. Van ${values.mensaje.trim().length} caracteres de ${MENSAJE_MIN}.`;
  return e;
}

export function useContactForm() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<FormPhase>("idle");
  const [summaryVisible, setSummaryVisible] = useState(false);
  const firstErrorRef = useRef<HTMLElement | null>(null);

  const setField = useCallback((name: FieldName, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    // Un error se retira en cuanto deja de ser cierto, nunca antes: revalidar
    // en cada tecla desde el primer carácter regaña mientras se escribe.
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e));
  }, []);

  const blurField = useCallback(
    (name: FieldName) => {
      const next = validate(values);
      setErrors((e) => ({ ...e, [name]: next[name] }));
    },
    [values],
  );

  const submit = useCallback(
    (ev: FormEvent) => {
      ev.preventDefault();
      const next = validate(values);
      setErrors(next);
      if (Object.values(next).some(Boolean)) {
        setSummaryVisible(true);
        // El foco va al primer campo con error: sin esto, un lector de pantalla
        // se entera de que algo falló pero no de dónde.
        requestAnimationFrame(() => firstErrorRef.current?.focus());
        return;
      }
      setSummaryVisible(false);
      setPhase("sending");
      // No hay endpoint: el prototipo simula la latencia para que el estado
      // «enviando» sea visible de verdad y no un fotograma.
      window.setTimeout(() => setPhase("sent"), 1100);
    },
    [values],
  );

  const reset = useCallback(() => {
    setValues({ nombre: "", email: "", mensaje: "" });
    setErrors({});
    setPhase("idle");
    setSummaryVisible(false);
  }, []);

  const errorList = (Object.keys(errors) as FieldName[]).filter(
    (k) => errors[k],
  );

  return {
    values,
    errors,
    errorList,
    phase,
    summaryVisible,
    setField,
    blurField,
    submit,
    reset,
    firstErrorRef,
  };
}

export type ContactForm = ReturnType<typeof useContactForm>;

/** El copy que comparten las cuatro. Lo que cambia es dónde se coloca. */
export const COPY = {
  eyebrow: "Contacto",
  title: "Hablemos",
  lead: "Si has llegado hasta aquí es porque algo te ha llamado la atención, así que gracias por tu tiempo. Si quieres crear productos que generen experiencias increíbles, estás en el sitio adecuado. Usa cualquiera de las vías de contacto disponibles y hablemos de producto.",
  respuesta: "Tendrás una respuesta en 24 horas",
  formTitle: "Escríbeme",
  labels: {
    nombre: "Nombre",
    email: "Correo",
    mensaje: "Mensaje",
  },
  placeholders: {
    nombre: "Marta Ruiz",
    email: "marta@empresa.com",
    mensaje: "Cuéntame qué construís y qué buscáis en producto.",
  },
  submit: "Enviar mensaje",
  sending: "Enviando",
  sentTitle: "Mensaje enviado",
  sentBody:
    "Te he contestado al correo que dejaste. Si en un par de días no ves nada, mira en spam o llámame.",
  sentAgain: "Escribir otro",
  summary: "Revisa estos campos antes de enviar:",
  canales: "Vías de contacto",
  legal:
    "Tus datos los uso solo para contestarte y no se ceden a nadie más. Puedes pedir acceso, corrección o borrado cuando quieras.",
  legalLink: "Privacidad y cookies",
} as const;
