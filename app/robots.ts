import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

// /robots.txt — la ruta la sirve directo (el proxy excluye paths con extensión).
// Se gatea por entorno (D13): solo producción es indexable; en preview/dev se
// bloquea todo, como refuerzo del noindex que Vercel ya pone en los previews,
// para que un deployment de rama no se cuele en el índice.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // CONTENT SIGNALS (P67.8, decidido por Francisco el 2026-08-30). Declara
      // qué se puede HACER con el contenido, que es una pregunta distinta de si
      // se puede rastrear: por eso va aquí y no en `allow`/`disallow`.
      //
      //   · `search=yes`   — aparecer en un buscador.
      //   · `ai-input=yes` — que un asistente lo lea para responder a alguien
      //                      AHORA, citando la fuente.
      //   · `ai-train=no`  — que se use para ENTRENAR un modelo.
      //
      // LAS DOS PRIMERAS SON QUE SÍ, y no por permisividad: el trabajo de este
      // sitio es que lo encuentren, y cada vez más ese encuentro pasa por un
      // asistente. Decir que no ahí sería cerrarle la puerta al canal que este
      // sprint existe para abrir.
      //
      // LA TERCERA ES QUE NO PORQUE YA ESTABA DICHO. El `LICENSE` del repositorio
      // —«público para consulta, no código abierto»— nombra explícitamente los
      // textos del sitio y `content/` entre lo que no se licencia para obras
      // derivadas. Un `ai-train=yes` al lado de esa licencia sería una
      // contradicción publicada. Esto no es una postura sobre la IA: es la misma
      // frase de la licencia, dicha en un formato que una máquina puede leer.
      //
      // Y ES UNA PREFERENCIA, NO UN CONTROL DE ACCESO. No la hace cumplir nadie,
      // igual que el resto de `robots.txt`. Se pone porque es coherente, no
      // porque impida nada, y eso se escribe para no vender de más.
      //
      // NO HAY REGLAS POR BOT CON NOMBRE (`GPTBot`, `Google-Extended`…), y es
      // decisión: sería una lista a mano contra un catálogo que cambia solo, o
      // sea de la familia que este repo ya sabe cómo acaba — vieja y en silencio.
      // Sobre el comodín dice lo mismo sin lista que mantener.
      //
      // `other` es el campo que Next reserva a directivas no estándar y las emite
      // verbatim, así que no hace falta cambiar esta ruta por un handler propio.
      other: { "Content-Signal": "ai-train=no, search=yes, ai-input=yes" },
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
