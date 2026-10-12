/**
 * Los dos diccionarios del artículo, con la ruta que sale en el informe.
 *
 * Vive aparte porque lo comparten las tres comprobaciones que recorren el copy
 * —citas, secciones y datos en vivo—, y porque una sola de ellas importándolo y
 * reexportándolo haría que el orden de los imports decidiera quién depende de
 * quién.
 */
import enArticulo from "../../app/[lang]/dictionaries/en/como-se-ha-creado.json";
import esArticulo from "../../app/[lang]/dictionaries/es/como-se-ha-creado.json";

export const DICCIONARIOS = [
  { dict: esArticulo as unknown, ruta: "es/como-se-ha-creado.json" },
  { dict: enArticulo as unknown, ruta: "en/como-se-ha-creado.json" },
];

export { esArticulo, enArticulo };
