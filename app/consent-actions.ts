"use server";

import { headers } from "next/headers";

import { esEventoConsentimiento } from "@/lib/consent-metrics";
import { incrementar } from "@/lib/consent-store";
import { creaLimitador } from "@/lib/rate-limit";

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
//      una MEDICIÓN falsa que se usaría para decidir. Las reglas están en
//      `lib/rate-limit.ts`, con sus tests; aquí solo el techo y la clave.
//
// LO QUE ESTE LÍMITE NO PUEDE: en serverless cada instancia tiene su mapa y una
// instancia fría empieza a cero, así que un actor distribuido y decidido puede
// inflar los contadores. Se acepta y se dice, porque la defensa proporcionada
// —un almacén compartido de tasas— cuesta más que el dato que protege. La señal
// de que ha pasado es una tasa que se mueve sin que se mueva el tráfico, y el
// contraste vive fuera: GA4 sigue contando los `aceptado` por su cuenta.
//
// ─────────────────────────────────────────────────────────────────────────────
// EL TECHO: 100 POR HORA Y POR IP, subido desde 10 el 2026-09-02.
//
// El razonamiento del techo bajo era «una persona genera como mucho dos sucesos
// por navegador». Correcto **por persona** y falso **por IP**: detrás de un CGNAT
// móvil o de la red de una oficina, decenas comparten la misma IP saliente, y a
// partir del undécimo esta acción retornaba sin incrementar. O sea que el límite
// protegía al contador de inflarse y a cambio lo **deflactaba**, justo en el
// escenario que existe para medir —el pico de un lanzamiento, que es tráfico
// concentrado llegado por un mismo canal.
//
// Y LA CUENTA QUE DESHACE EL ARGUMENTO ORIGINAL: 10/hora ya eran 240 sucesos al
// día desde una sola IP, contra los 13 «visto» que llevaba el contador. El techo
// nunca fue lo que impedía envenenarlo; lo que lo detecta es el contraste con GA4,
// que es lo que sí está escrito. Así que el techo solo tiene que acotar una
// inundación, y 100 —unos 50 visitantes nuevos por hora tras una misma NAT— deja
// sitio a una oficina sin dejar de acotarla.
//
// LA SALVEDAD SE QUEDA ESCRITA IGUAL, en `lib/consent-metrics.ts`: el modo de
// fallo sigue existiendo por encima del número nuevo, solo que más arriba.

const VENTANA_MS = 60 * 60 * 1_000;
const MAX_POR_VENTANA = 100;

const limite = creaLimitador({ ventanaMs: VENTANA_MS, max: MAX_POR_VENTANA });

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
  if (limite.limitado(await claveCliente())) return;
  await incrementar(evento);
}
