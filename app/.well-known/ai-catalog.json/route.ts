import { respuestaDelCatalogo } from "@/lib/ard";

// `/.well-known/ai-catalog.json` — la MISMA respuesta, para la otra
// especificación *(2026-08-31)*.
//
// POR QUÉ EXISTE, SI ARD DICE QUE NO HACE FALTA. Porque no es «la ruta vieja de
// ARD»: es el mecanismo de descubrimiento propio del **AI Catalog Standard**
// (ai-catalog.io), que es de donde sale el formato de documento que este sitio
// emite —`specVersion`, `host`, `entries`— y contra cuyo modelo de entrada
// valida el conformance. ARD hereda ese formato y le pone ruta nueva; el
// consumidor que sigue la otra especificación busca aquí y solo aquí.
//
// LO QUE HACE QUE ESTO NO SEA UNA COPIA: el cuerpo lo compone
// `respuestaDelCatalogo()`, una sola vez, con las mismas cabeceras. Las dos rutas
// no pueden divergir porque no hay dos documentos — hay dos puertas.
//
// LO QUE SE ACEPTA A CAMBIO, dicho porque es real: dos URLs públicas donde la
// especificación canónica solo pide una. Se paga porque el coste es este archivo
// y el beneficio es un ecosistema entero de clientes que, si no, no nos ven.
export const dynamic = "force-static";

export async function GET() {
  return respuestaDelCatalogo();
}
