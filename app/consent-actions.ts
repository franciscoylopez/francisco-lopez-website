"use server";

import { headers } from "next/headers";

import { esEventoConsentimiento } from "@/lib/consent-metrics";
import { incrementar } from "@/lib/consent-store";

// El registro del contador de consentimiento (P68.61, opción 2).
//
// POR QUÉ UNA SERVER ACTION. Misma razón que el formulario de contacto: el POST
// sale al MISMO ORIGEN, así que la CSP no cambia — `form-action 'self'` y
// `connect-src 'self'` ya lo permiten y no hay que abrir ningún dominio de
// terceros. La alternativa (llamar a Upstash desde el navegador) publicaría el
// token en el cliente y abriría un origen en la CSP para escribirle: dos cosas
// que este sitio no hace.
//
// FUERA DE `app/[lang]/` A PROPÓSITO. El consentimiento no es de una página ni de
// un idioma: el diálogo vive en el layout y el contador cuenta navegadores, no
// visitas a una ruta.
//
// ─────────────────────────────────────────────────────────────────────────────
// ESTO ES SUPERFICIE PÚBLICA, Y HAY QUE LEERLO COMO TAL. Una Server Action es un
// POST que puede invocar cualquiera, así que lo que la protege no es que solo la
// llame nuestro componente. Son tres cosas, y ninguna es la confianza:
//
//   1. LA ENTRADA ES UN ENUM CERRADO. Lo único que cruza es una de tres cadenas
//      conocidas, validada contra la lista. No hay texto libre, así que no hay
//      nada que sanear, que registrar ni que reflejar de vuelta.
//   2. NO DEVUELVE NADA. Ni el valor del contador ni si se escribió. Un atacante
//      no puede usarla como oráculo de lectura, y el navegador no aprende nada
//      que no supiera.
//   3. HAY UN LÍMITE DE FRECUENCIA, y aquí importa MÁS que en el formulario: allí
//      el peor caso era una bandeja llena; aquí es un contador envenenado, o sea
//      una MEDICIÓN falsa que se usaría para decidir. El techo es bajo a propósito
//      —una persona genera como mucho dos sucesos por navegador— y sigue el patrón
//      de `contacto/actions.ts`: en memoria de instancia, con lo que eso NO es
//      escrito al lado.
//
// LO QUE ESTE LÍMITE NO PUEDE: en serverless cada instancia tiene su mapa y una
// instancia fría empieza a cero, así que un actor distribuido y decidido puede
// inflar los contadores. Se acepta y se dice, porque la defensa proporcionada
// —un almacén compartido de tasas— cuesta más que el dato que protege. La señal
// de que ha pasado es una tasa que se mueve sin que se mueva el tráfico, y el
// contraste vive fuera: GA4 sigue contando los `aceptado` por su cuenta.

const VENTANA_MS = 60 * 60 * 1_000;
const MAX_POR_VENTANA = 10;
const golpes = new Map<string, number[]>();

function limitado(clave: string): boolean {
  const ahora = Date.now();
  const recientes = (golpes.get(clave) ?? []).filter(
    (t) => ahora - t < VENTANA_MS,
  );
  if (recientes.length >= MAX_POR_VENTANA) {
    golpes.set(clave, recientes);
    return true;
  }
  recientes.push(ahora);
  golpes.set(clave, recientes);
  if (golpes.size > 500) {
    for (const [k, tiempos] of golpes) {
      if (tiempos.every((t) => ahora - t >= VENTANA_MS)) golpes.delete(k);
    }
  }
  return false;
}

/**
 * La IP solo se usa para el límite de frecuencia, en memoria y durante una hora.
 * No se almacena, no se escribe junto al contador y no sale de la instancia — el
 * mismo tratamiento que ya hace `contacto/actions.ts`.
 */
async function claveCliente(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || h.get("x-real-ip") || "anon";
}

/**
 * Suma uno al contador del suceso. No devuelve nada, ni siquiera si funcionó: el
 * cliente no tiene nada que hacer con esa respuesta y no dársela es una superficie
 * menos.
 */
export async function registrarConsentimiento(evento: unknown): Promise<void> {
  if (!esEventoConsentimiento(evento)) return;
  if (limitado(await claveCliente())) return;
  await incrementar(evento);
}
