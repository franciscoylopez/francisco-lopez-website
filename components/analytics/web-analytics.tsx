"use client";

import { Analytics } from "@vercel/analytics/next";

// Vercel Web Analytics (P68.61 opción 1, D170).
//
// ISLA DE CLIENTE POR OBLIGACIÓN, NO POR ESTILO: `beforeSend` es una función, y
// una función no cruza de un Server Component a uno de cliente. El envoltorio es
// el sitio donde esa función puede existir.
//
// QUÉ ES ESTO Y QUÉ NO. Es lo único del sitio que mide SIN preguntar, y esa es la
// decisión entera de D170: detrás del consentimiento no aportaría nada sobre GA4
// —mismo denominador, mismo sesgo— y no habría razón para tenerlo. Lo que compra
// es el volumen absoluto y el embudo de quien no consiente, que el contador de
// D169 no puede dar porque solo cuenta el diálogo.

/**
 * Los parámetros que SÍ se conservan. Es una **allowlist**, misma forma que la
 * CSP de este sitio, y la primera versión de esto no lo era: recortaba la cadena
 * de consulta entera.
 *
 * Recortarla del todo parecía lo prudente y salía caro: las URLs de este sitio no
 * aceptan ningún parámetro propio, así que lo único que aparece ahí de forma
 * legítima son los **UTM de los posts del lanzamiento** — que no son un dato
 * personal, son la etiqueta de una campaña, y son justo la separación por post
 * que esta herramienta puede dar para *todo* el tráfico y GA4 solo para el que
 * consiente. Tirarlos habría quitado la mitad del motivo de tener esto.
 *
 * Lo que la allowlist garantiza es la otra mitad: **nada que no esté aquí llega a
 * medirse**, venga de donde venga. Un enlace que alguien comparta con lo que sea
 * pegado detrás pierde ese resto antes de salir del navegador.
 */
const PARAMETROS_CONSERVADOS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function saneaUrl(crudo: string): string {
  try {
    const url = new URL(crudo);
    const limpios = new URLSearchParams();
    for (const clave of PARAMETROS_CONSERVADOS) {
      const valor = url.searchParams.get(clave);
      if (valor) limpios.set(clave, valor);
    }
    url.search = limpios.toString();
    // El fragmento nunca viaja al servidor y aquí tampoco tiene nada que hacer:
    // en este sitio son anclas de sección, y medir a qué apartado saltó alguien
    // es más de lo que esta herramienta necesita saber para contar una visita.
    url.hash = "";
    return url.toString();
  } catch {
    // Una URL que no parsea se deja como está: inventarse una la contaría en el
    // sitio equivocado, que es peor que no sanearla.
    return crudo;
  }
}

export function WebAnalytics() {
  return (
    <Analytics
      beforeSend={(evento) => ({ ...evento, url: saneaUrl(evento.url) })}
    />
  );
}
