import { respuestaDelCatalogo } from "@/lib/ard";

// `/.well-known/ard.json` — la ruta CANÓNICA del catálogo.
//
// Agentic Resource Discovery v0.91, §5.1: «un consumidor resolviendo las entradas
// de un dominio DEBE pedir `/.well-known/ard.json`». Es la que un cliente
// conformante prueba sin que nadie se la diga, igual que `/about` o `/agents.md`.
//
// LA GEMELA DE AL LADO (`ai-catalog.json`) SIRVE EL MISMO DOCUMENTO, y el porqué
// —dos especificaciones, dos mecanismos de descubrimiento, un solo cuerpo— está
// escrito una vez en `lib/ard.ts`, no dos veces aquí.
//
// EL CONTENIDO SE DERIVA y aquí no se escribe nada: este archivo es transporte.
// Misma división que `/llms.txt`, `/robots.txt` y el sitemap.
//
// ESTÁTICA, como el resto: el catálogo no depende de la petición, así que se
// prerenderiza en build y se sirve desde el CDN. Y no lleva `Vary: Accept` —la
// regla acotada de `next.config.ts` deja fuera toda ruta con extensión, y esta
// termina en `.json`—, que es correcto: devuelve siempre lo mismo.
//
// NO ENTRA EN EL SITEMAP. Es una superficie de máquina, no una página; el
// sitemap lista las variantes canónicas que una persona puede leer.
export const dynamic = "force-static";

export async function GET() {
  return respuestaDelCatalogo();
}
