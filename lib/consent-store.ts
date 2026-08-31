import "server-only";

import type { Contadores, EventoConsentimiento } from "./consent-metrics";
import { EVENTOS_CONSENTIMIENTO } from "./consent-metrics";

// El almacén de los tres contadores (P68.61, opción 2) — la E/S.
//
// UPSTASH REDIS, POR SU API REST Y SIN PAQUETE. `INCR` es atómico, que es la
// operación exacta que esto necesita y la que un JSON leído-modificado-escrito no
// puede dar sin perder escrituras concurrentes. Y se llama con `fetch` a su API
// REST en vez de con `@upstash/redis`: son cuatro líneas, el proyecto tiene once
// dependencias de producción (D27) y una más para esto no se paga sola.
//
// LO QUE SE GUARDA, ENTERO: tres enteros. Sin IP, sin user-agent, sin
// identificador, sin marca de tiempo por evento. Por eso esto no es un encargado
// del tratamiento y no cambia lo que `/cookies` declara — el porqué, en
// `lib/consent-metrics.ts`.
//
// SIN VARIABLES DE ENTORNO NO ESCRIBE, Y NO FALLA. En local y en Preview no hay
// almacén y no debe haberlo: contaminaría la cuenta de producción con cada
// recarga de desarrollo. Lo que NO hace es fallar en silencio de la otra forma —
// `leerContadores` distingue «cero» de «sin configurar», que es la diferencia que
// D71 pagó cara.

const PREFIJO = "flm:consent:";

/**
 * Las credenciales que crea la integración de Upstash en Vercel. Se aceptan los
 * dos juegos de nombres porque el Marketplace ha usado los dos: `KV_REST_API_*`
 * es el que inyecta la integración de Vercel KV, y `UPSTASH_REDIS_REST_*` el que
 * da Upstash directamente. Leer los dos evita un fallo de configuración que se
 * manifestaría como un contador que no sube.
 */
function credenciales(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export function almacenConfigurado(): boolean {
  return credenciales() !== null;
}

/**
 * Una orden de Redis por la API REST. El comando va en la RUTA, así que cada
 * segmento se codifica: los nombres de clave los pone este módulo y no vienen de
 * fuera, pero una ruta construida por concatenación es la forma de bug que no da
 * la cara hasta que alguien añade un carácter raro a una constante.
 */
async function redis(comando: readonly string[]): Promise<unknown | null> {
  const cred = credenciales();
  if (!cred) return null;
  const ruta = comando.map(encodeURIComponent).join("/");
  try {
    const res = await fetch(`${cred.url}/${ruta}`, {
      headers: { Authorization: `Bearer ${cred.token}` },
      // Un contador no se cachea. Sin esto, `fetch` dentro de una Server Action
      // hereda la caché de datos de Next y el segundo `INCR` devolvería el primero.
      cache: "no-store",
    });
    if (!res.ok) return null;
    const cuerpo: unknown = await res.json();
    if (cuerpo && typeof cuerpo === "object" && "result" in cuerpo) {
      return (cuerpo as { result: unknown }).result;
    }
    return null;
  } catch {
    // Un contador caído no puede tumbar el diálogo de consentimiento, que es un
    // mecanismo con peso legal. Falla callado hacia el usuario y visible hacia
    // quien lee: `leerContadores` dirá que no hay almacén, no que hay ceros.
    return null;
  }
}

/** Suma uno al contador del suceso. No espera a nadie y no devuelve nada. */
export async function incrementar(evento: EventoConsentimiento): Promise<void> {
  await redis(["INCR", `${PREFIJO}${evento}`]);
}

/**
 * Los tres contadores, o `null` si no hay almacén configurado.
 *
 * EL `null` ES LA MITAD QUE IMPORTA. Devolver `{0,0,0}` sin almacén sería un
 * «nadie acepta» indistinguible de «no hay nada montado», que es literalmente el
 * fallo de D71: «no hay datos» no distingue entre cero filas y mal configurado.
 */
export async function leerContadores(): Promise<Contadores | null> {
  if (!almacenConfigurado()) return null;
  const claves = EVENTOS_CONSENTIMIENTO.map((e) => `${PREFIJO}${e}`);
  const crudo = await redis(["MGET", ...claves]);
  if (!Array.isArray(crudo)) return null;
  // Por índice y no por desestructuración: con `noUncheckedIndexedAccess` cada
  // hueco es `number | undefined`, y un `MGET` que devuelva menos elementos de los
  // pedidos tiene que dar cero, no `undefined` colado dentro de un `number`.
  const cuentas = crudo.map(aEntero);
  return {
    visto: cuentas[0] ?? 0,
    aceptado: cuentas[1] ?? 0,
    rechazado: cuentas[2] ?? 0,
  };
}

/** `MGET` devuelve `null` para una clave que aún no existe: eso es un cero. */
function aEntero(valor: unknown): number {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}
