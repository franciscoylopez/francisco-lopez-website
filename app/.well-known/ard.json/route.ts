import { ardCatalog } from "@/lib/ard";

// `/.well-known/ard.json` — el catálogo de Agentic Resource Discovery.
//
// LA RUTA CANÓNICA, Y SOLO ELLA. La especificación (v0.91, §5.1) es explícita:
// un consumidor conformante DEBE pedir `/.well-known/ard.json`, y la ruta
// anterior `/.well-known/ai-catalog.json` es una cortesía que un consumidor
// PUEDE consultar, no un requisito. En sus palabras, «un publicador que sirve
// ard.json es descubrible por todo consumidor conformante». Servir además la
// heredada valdría un punto de bonus del escáner, y por eso se dice que no se
// hace: sería una segunda URL pública abierta por una casilla, que es lo que
// D157 no deja hacer. Está anotado en la ficha para que sea una decisión y no un
// olvido.
//
// EL CONTENIDO SE DERIVA (`lib/ard.ts`) y aquí no se escribe nada: este archivo
// es el transporte. Misma división que `/llms.txt`, `/robots.txt` y el sitemap.
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
  return new Response(JSON.stringify(ardCatalog(), null, 2) + "\n", {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
