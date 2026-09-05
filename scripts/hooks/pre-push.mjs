// Hook pre-push: una rama no llega a CI con un artefacto derivado en rojo.
//
// POR QUÉ EXISTE (2026-09-05, P72.52). El hook de Stop entró el 2026-09-02 sobre
// la medida de que 10 de 14 runs rojos eran uno de estos cuatro gates, y **la tasa
// no se movió**: 20,8 % antes (5/24), 21,4 % después (12/56), con los mismos tres
// dominando —markdown 3, accesibilidad 3, artículo 2—. No falló el guardián: falló
// el DISPARADOR. Avisar al parar convierte «enterarse en CI diez minutos después»
// en «enterarse al parar», que es una mejora de latencia real y **no puede** bajar
// los rojos si después se empuja igual. Es la familia «arreglar la mitad que se
// abre»: se resolvió el lado que PRODUCE la señal y quedó intacto el que la
// CONSUME.
//
// EL DISPARADOR MIRA DONDE OCURRE LA COSA — regla 1 de `BRAND.md` §Cómo se escribe
// una regla. El daño no es parar con un sello viejo: es EMPUJARLO. El push es el
// evento, y es además el único momento en que el coste de un gate se compara con
// el que ya se estaba pagando: diez minutos de CI y un run rojo en el historial.
//
// AQUÍ SÍ BLOQUEA, Y NO SE PUEDE ENCADENAR COMO EL DE STOP. Un `exit 2` en Stop
// devuelve el turno al modelo; aquí el contrato es de git y solo hay una salida:
// código distinto de cero aborta el push. Quien quiera empujar igual tiene
// `--no-verify`, que es la puerta correcta —explícita, escrita en el comando y
// visible en el historial de la sesión— y no un techo que se ablanda solo.
//
// QUÉ NO CUBRE, dicho para que no se dé por cubierto:
//
//   · **`md:verificar` entero**, que tarda 46 s y encima lee `.next/server/app`:
//     sobre un build viejo da un verde falso, así que en honestidad hay que
//     sumarle el build. Corre su caso dominante (`md:anclas`, milisegundos y sin
//     build), que es por donde se rompen siete de cada catorce. El markdown
//     completo lo sigue certificando CI.
//   · **Los rojos que no son de artefacto derivado** (contexto, trinquete de
//     deuda): esos son gates haciendo su trabajo, y el problema nunca fue el
//     listón.
//   · **El árbol que se empuja.** Mira el árbol de trabajo, no los commits que
//     viajan. En este repo se empuja lo que se acaba de commitear, así que la
//     diferencia es teórica; si algún día deja de serlo, lo dirá CI.

import { revisaCarriles } from "./regeneradores.mjs";

/**
 * git pasa por stdin una línea por ref: `<local ref> <local sha> <remote ref>
 * <remote sha>`. Un borrado de rama lleva el sha local a ceros y no empuja
 * contenido: ahí no hay nada que comprobar.
 */
const soloBorrados = async () => {
  try {
    const trozos = [];
    for await (const trozo of process.stdin) trozos.push(trozo);
    const lineas = Buffer.concat(trozos)
      .toString("utf8")
      .split(/\r?\n/)
      .filter(Boolean);
    return (
      lineas.length > 0 && lineas.every((l) => /^\S+\s+0{40}\s/.test(`${l} `))
    );
  } catch {
    return false;
  }
};

if (await soloBorrados()) process.exit(0);

const avisos = await revisaCarriles({ regenera: false });

// El metro afirma cuánto ha mirado: sin esta línea, un pre-push que no encontrara
// ningún carril se vería exactamente igual que uno que los pasó todos.
console.log(
  `pre-push — 4 gates de artefacto derivado comprobados · ${avisos.length} en rojo.`,
);

if (avisos.length > 0) {
  console.error(
    "\nPUSH ABORTADO — esto saldría rojo en CI dentro de diez minutos:\n\n" +
      avisos.map((a) => `  · ${a}`).join("\n") +
      "\n\nCuando esté resuelto, se vuelve a empujar. Para empujar igual: " +
      "`git push --no-verify`.\n",
  );
  process.exit(1);
}

process.exit(0);
