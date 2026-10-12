/**
 * El informe compartido de `check:agentes`: lo que falla y cuánto se ha mirado.
 *
 * LOS BLOQUES ESCRIBEN AQUÍ EN VEZ DE DEVOLVER, y no es pereza: de una pasada
 * importa la lista ENTERA, no el primer fallo. Un guardián que corta en el
 * primero obliga a repetir la corrida por cada problema, y en CI eso es un ciclo
 * por hallazgo.
 *
 * Y `vistos` es el SUELO DEL METRO —cuántas cosas ha mirado cada bloque—, que el
 * entry comprueba al final: con cero entradas ese trozo aprobaría siempre, que es
 * el modo de fallo que este repo se ha encontrado seis veces (D70).
 */

export const problemas: string[] = [];

export const fallo = (donde: string, msg: string) =>
  problemas.push(`${donde}: ${msg}`);

/** Lo que se ha mirado de verdad, para el informe. Ninguno puede quedarse en 0. */
export const vistos = {
  paginasEnLlms: 0,
  variantesMd: 0,
  negociaciones: 0,
  entornosRobots: 0,
  senalesDeContenido: 0,
  segmentosDinamicos: 0,
  rutasDeCabecera: 0,
  alias: 0,
  entradasArd: 0,
};
