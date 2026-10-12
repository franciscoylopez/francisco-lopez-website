/**
 * De dónde salen las credenciales de los scripts que corren fuera de Next.
 *
 * POR QUÉ EXISTE, y no es «factorizar un bucle». Hasta el 2026-09-02 cada script
 * leía `.env.local` por su cuenta y el propio `consentimiento.ts` documentaba
 * `vercel env pull .env.local` como forma de conseguir sus claves. Ese comando
 * **sobrescribe el archivo**, así que el camino escrito para desbloquear una
 * herramienta se llevaba por delante la `PSI_API_KEY` de otra. Un comando
 * documentado que rompe otra cosa no es una instrucción: es una trampa.
 *
 * LA SALIDA SON DOS ARCHIVOS, no un merge. Cada uno con un dueño distinto:
 *
 *   · `.env.local`  — lo escribe una persona. Lo que no está en Vercel y no se
 *     puede regenerar: hoy `PSI_API_KEY`. **No lo toca ningún comando.**
 *   · `.env.vercel` — lo escribe `vercel env pull .env.vercel --environment=production`.
 *     Regenerable y desechable: si se borra, se vuelve a bajar. Aquí viven las
 *     `KV_REST_API_*` del contador de consentimiento.
 *
 * Los dos están cubiertos por `.env*` en `.gitignore`. **Gana `.env.local`**, que
 * es el que una persona editó a propósito; y por encima de los dos manda el
 * entorno del proceso, para que CI y Vercel sigan inyectando lo suyo.
 */
import { existsSync, readFileSync } from "node:fs";

/** En orden de menos a más prioridad al resolver: gana el último que la tenga. */
export const ARCHIVOS_ENV = [".env.vercel", ".env.local"] as const;

/** Cómo se rellena `.env.vercel`. Se cita en los mensajes de error, no se ejecuta. */
export const COMANDO_PULL =
  "vercel env pull .env.vercel --environment=production";

function pares(archivo: string): Map<string, string> {
  const mapa = new Map<string, string>();
  if (!existsSync(archivo)) return mapa;
  for (const linea of readFileSync(archivo, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(linea);
    if (m?.[1]) mapa.set(m[1], (m[2] ?? "").replace(/^["']|["']$/g, ""));
  }
  return mapa;
}

/**
 * Una variable, del entorno del proceso o de los dos archivos. `undefined` si no
 * está en ninguno — nunca cadena vacía disfrazada de valor.
 */
export function delEntorno(nombre: string): string | undefined {
  if (process.env[nombre]) return process.env[nombre];
  for (const archivo of [...ARCHIVOS_ENV].reverse()) {
    const valor = pares(archivo).get(nombre);
    if (valor) return valor;
  }
  return undefined;
}

/** La primera de varias gemelas que exista. Para `KV_*` ↔ `UPSTASH_*`. */
export function delEntornoAlguna(...nombres: string[]): string | undefined {
  for (const nombre of nombres) {
    const valor = delEntorno(nombre);
    if (valor) return valor;
  }
  return undefined;
}

/** Qué archivos hay de verdad, para decirlo cuando falta una credencial. */
export function archivosPresentes(): string[] {
  return ARCHIVOS_ENV.filter((a) => existsSync(a));
}
