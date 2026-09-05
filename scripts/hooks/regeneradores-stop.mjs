// Hook Stop: los gates de artefacto derivado, en el momento en que salen baratos.
//
// POR QUÉ EXISTE. Medido el 2026-09-01 sobre los 80 runs de CI más recientes: 14
// en rojo en tres días, un 18 %, y no eran *flaky* — se agrupaban en la misma
// rama, que es la firma de empujar y ver qué dice CI. Doce de esos catorce eran
// tres gates de artefacto derivado (markdown 7, artículo 4, accesibilidad 1), o
// sea cosas que un comando local dice al instante y que costaron catorce esperas
// de diez minutos.
//
// Y ESTE REPO YA RESOLVIÓ ESTE PROBLEMA EXACTO UNA VEZ: `format-stop.mjs` pasa
// Prettier al cerrar el turno, y por eso el paso «Formato» no ha fallado ni una
// sola vez en los 80 runs. No faltaba herramienta —los cinco regeneradores ya
// tenían su comando—: faltaba el disparador.
//
// LO QUE LA MEDICIÓN CAMBIÓ DE LA FICHA (2026-09-02). «Los cinco regeneradores»
// no son una familia. Son tres cosas distintas, y solo una se puede regenerar
// sola:
//
//   1. DERIVADO PURO — SE REGENERA SOLO. `npm run indices` (1,0 s) deriva los
//      índices de las cabeceras de los cuatro documentos a demanda. Es
//      determinista, idempotente y no juzga nada: regenerarlo no puede afirmar
//      nada que no fuera ya cierto. Se comprueba primero y solo se escribe si el
//      índice estaba viejo, para que el mensaje diga qué ha pasado en vez de
//      correr en silencio.
//
//   2. SELLOS — SE AVISAN, Y NUNCA SE SELLAN. `check:articulo` (1,5 s) y
//      `check:accesibilidad` (1,2 s). Un sello en rojo NO dice «regenérame»:
//      dice «una fuente se movió, mira si la prosa sigue siendo cierta». Sellar
//      desde aquí congelaría el fallo y lo volvería invisible, que es justo lo
//      que los dos guardianes existen para evitar —lo dice cada uno en su
//      cabecera— y en el de accesibilidad además movería una FECHA DE
//      CONFORMIDAD (D38), o sea afirmaría una revisión que nadie ha hecho.
//      Así que aquí se corren y se NOMBRA lo que sale rojo, con el comando al
//      lado. El valor nunca fue el sellado automático: era enterarse al instante
//      en vez de a los diez minutos.
//
//   3. `npm run md` — NO CABE, Y ESO TAMBIÉN ESTÁ MEDIDO. `md:verificar` tarda
//      46 s, y encima lee `.next/server/app`: sobre un build viejo da un verde
//      falso, así que en honestidad hay que sumarle el build entero. La propia
//      ficha puso el listón —«un hook que añade diez segundos a cada parada es
//      peor que el problema que arregla»— y esto lo triplica antes de compilar
//      nada. Lo que sí cabe es su caso DOMINANTE: `npm run md:anclas`, que
//      comprueba en milisegundos y sin build las 90 anclas de decisión del
//      markdown, que es por donde se rompen siete de los catorce. El porqué
//      completo, en la cabecera de `scripts/md/anclas.ts`.
//
// `agentes:sellar` queda fuera a propósito, y no por coste: sella la nota de un
// tercero (`ora.ai`) contra producción, o sea hace red. Un hook que llama a una
// API en cada parada es otra cosa, y se mira aparte.
//
// LO QUE ESTO NO ES. No sustituye a CI: `md:verificar` sigue siendo quien
// certifica el markdown entero, y este hook solo adelanta la parte barata. Un
// verde de aquí no es un verde del PR.
//
// DEJA RASTRO, Y EL RASTRO TIENE QUE LLEGARLE A QUIEN ACTÚA — reescrito el
// 2026-09-02, y esto es la corrección de un cabo suelto, no un cambio de idea.
// Aquí decía «NO BLOQUEA NUNCA: sale 0 pase lo que pase», razonando que un hook
// de cierre que impide cerrar el turno es peor que el fallo que evita. El
// razonamiento sigue siendo bueno; lo que no se comprobó es a QUIÉN le llegaba
// el aviso. El contrato de un hook de Stop reparte por código de salida:
//
//   · exit 0  — stdout/stderr NO se muestran
//   · exit 2  — stderr va AL MODELO y la conversación continúa
//   · otros   — stderr va solo al usuario
//
// Con `systemMessage` y exit 0, el aviso llegaba como mucho a la persona, y
// **quien commitea y empuja es el modelo**. Medido el día que se escribió esto:
// las dos primeras tareas hechas DESPUÉS de construir este hook (P72.03 y
// P72.04) se fueron a CI en rojo por `md:verificar`, con el hook registrado, el
// fallo presente y el aviso emitiéndose correctamente. El guardián funcionaba y
// hablaba hacia el lado equivocado.
//
// ASÍ QUE BLOQUEA UNA VEZ, Y SOLO UNA. Sale 2 con el aviso por stderr cuando hay
// rojo, que es el único canal al modelo que el contrato ofrece. No puede
// encadenarse: la guarda de `stop_hook_active` de más abajo ya estaba puesta
// —red tendida para un exit 2 que nunca se entregó—, así que en la segunda
// llamada sale 0 y el turno cierra. El coste máximo es un turno extra; el que
// evitaba era un viaje de diez minutos a CI, y se pagó dos veces seguidas.
//
// SIGUE SIN ARREGLAR NADA POR SU CUENTA: dice qué está rojo y con qué comando se
// resuelve. Sellar sin mirar congelaría el fallo, que es el motivo de siempre.

// LOS CUATRO CARRILES VIVEN EN `regeneradores.mjs` desde el 2026-09-05 (P72.52),
// porque el hook de pre-push mira exactamente el mismo conjunto. Lo que queda aquí
// es lo propio del momento de PARAR: que se regenera lo automático y que se
// bloquea una vez.

import { revisaCarriles } from "./regeneradores.mjs";

/** Lee el JSON del evento por stdin. Sin entrada válida, no hay nada que hacer. */
const leerEvento = async () => {
  try {
    const trozos = [];
    for await (const trozo of process.stdin) trozos.push(trozo);
    return JSON.parse(Buffer.concat(trozos).toString("utf8"));
  } catch {
    return null;
  }
};

const evento = await leerEvento();
if (evento?.stop_hook_active) process.exit(0);

const avisos = await revisaCarriles({ regenera: true });

if (avisos.length > 0) {
  // stderr + exit 2: el único canal que le llega al modelo, que es quien
  // commitea. Ver la cabecera.
  process.stderr.write(
    "Artefactos derivados al cierre — " +
      avisos.join(" · ") +
      " (y el pre-push no dejará empujar con esto en rojo).\n",
  );
  process.exit(2);
}

process.exit(0);
