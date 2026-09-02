/**
 * ¿Qué fracción del tráfico acepta? — `npm run consentimiento`.
 *
 * POR QUÉ UN SCRIPT Y NO UNA RUTA. La cifra la lee una persona, una vez cada
 * cierre y durante la ventana del lanzamiento. Publicarla en una ruta añadiría una
 * superficie pública a un sitio que acaba de añadir una (la Server Action del
 * contador) y no compraría nada: leerla desde la terminal usa las mismas
 * credenciales que ya tiene el proyecto y no expone nada a nadie.
 *
 * QUÉ AFIRMA. Los tres contadores, la tasa y —esto es la mitad importante— si el
 * almacén está configurado. Un cero con almacén y un cero sin almacén son cosas
 * distintas y este script no las imprime igual: es D71 en su versión más barata de
 * evitar, «no hay datos» que no distingue entre cero filas y mal configurado.
 *
 * DE DÓNDE SACA LAS CREDENCIALES *(2026-09-02)*. De `.env.local` y `.env.vercel`,
 * en `scripts/medicion/entorno.ts`, que es donde está escrito por qué son dos
 * archivos y no uno. En corto: hasta hoy esta cabecera mandaba hacer
 * `vercel env pull .env.local`, y ese comando **sobrescribe** el archivo llevándose
 * la `PSI_API_KEY` de la otra herramienta.
 *
 * Y ESTE SCRIPT ES LA LECTURA SUELTA, no el cierre. El cierre de etapa lee las
 * cuatro fuentes de una vez y deja sello: `npm run medicion`.
 */
import { leeConsentimiento } from "./medicion/fuentes";

async function main() {
  const entorno =
    // El entorno va en la clave (ver `lib/consent-store.ts`), así que hay que
    // elegirlo al leer. POR DEFECTO PRODUCTION y no «todos sumados»: la cifra que
    // significa algo es la de producción, y un total que mezcla las pruebas de
    // Preview con las visitas reales sería exactamente el dato envenenado que la
    // separación existe para evitar.
    process.argv.find((a) => a.startsWith("--entorno="))?.split("=")[1] ??
    "production";

  const lectura = await leeConsentimiento(entorno);

  if (lectura.estado !== "leida") {
    console.error(
      `\nconsentimiento — SIN CIFRA: ${lectura.motivo}.\n\n` +
        "Esto NO es una tasa de cero: es la ausencia del dato, y son cosas distintas.\n",
    );
    process.exit(1);
  }

  const { contadores, tasa, salvedad } = lectura.valor;
  const sinDecidir =
    contadores.visto - contadores.aceptado - contadores.rechazado;

  console.log(
    `\nconsentimiento — entorno «${entorno}» · ${contadores.visto} navegador(es) vieron el diálogo:`,
  );
  console.log(
    `  ${String(contadores.aceptado).padStart(6)}  aceptaron analíticas`,
  );
  console.log(`  ${String(contadores.rechazado).padStart(6)}  las rechazaron`);
  console.log(
    `  ${String(sinDecidir).padStart(6)}  se fueron sin decidir` +
      (sinDecidir < 0 ? "  ⚠ negativo: ver la salvedad de abajo" : ""),
  );

  if (tasa === null) {
    console.log(
      "\n  Todavía no hay denominador, así que no hay tasa. Con almacén y sin\n" +
        "  visitas esto es correcto: dice que nadie ha llegado, no que nadie acepte.\n",
    );
  } else {
    const pct = (tasa * 100).toFixed(1);
    console.log(
      `\n  Tasa de aceptación: ${pct} %  ·  la analítica ve ${pct} de cada 100 visitantes NUEVOS\n` +
        `  ${salvedad}\n`,
    );
  }
}

// El error se imprime, no se lanza: una traza de Node encima de un mensaje que ya
// explica qué hacer solo entierra la explicación.
void main().catch((e: unknown) => {
  console.error(`
${e instanceof Error ? e.message : String(e)}
`);
  process.exit(1);
});
