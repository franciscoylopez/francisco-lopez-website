/**
 * Las reglas del tablero, probadas en CI aunque el tablero viva fuera del repo.
 *
 * `check:tablero` corre a demanda porque leer Notion necesita su MCP, y un gate
 * que solo corre si alguien se acuerda no es un gate. La mitad que SÍ puede
 * vigilarse siempre es el criterio, y es lo que se prueba aquí: cada regla, con un
 * caso bueno que tiene que pasar y uno malo que tiene que rechazar. Es la misma
 * forma que `check:guardianes` —un test de que sabe fallar, no de que funciona—,
 * traída a vitest porque aquí no hay archivo que mutar.
 */
import { describe, expect, it } from "vitest";

import {
  revisarTablero,
  sprintActivo,
  type Tarea,
} from "@/scripts/tablero/reglas";

/** Un tablero sano en miniatura: un sprint activo, dos bloques y el carril. */
const SANO: Tarea[] = [
  {
    nombre: "La del sprint que está en marcha",
    prioridad: 10,
    etapa: "Artículo y velocidad",
    area: "Código",
    estado: "En progreso",
  },
  {
    nombre: "La siguiente del mismo sprint",
    prioridad: 11,
    etapa: "Artículo y velocidad",
    area: "Infra",
    estado: "To-Do",
  },
  {
    nombre: "Deuda de un bloque temático",
    prioridad: 20,
    etapa: "Design System",
    area: "Código",
    estado: "Sin empezar",
  },
  {
    nombre: "Deuda transversal",
    prioridad: 30,
    etapa: "General",
    area: "Infra",
    estado: "Sin empezar",
  },
  {
    nombre: "Una cerrada con su prioridad histórica repetida",
    prioridad: 10,
    etapa: "Artículo y velocidad",
    area: "Código",
    estado: "Archivado",
  },
];

describe("revisarTablero", () => {
  it("no encuentra nada en un tablero sano", () => {
    expect(revisarTablero(SANO)).toEqual([]);
  });

  it("no cuenta las cerradas: su prioridad histórica puede repetirse", () => {
    // La quinta fila de SANO comparte el 10 con la primera y está Archivada. Si
    // el filtro de abiertas se cayera, este caso lo diría.
    const soloAbiertas = revisarTablero(
      SANO.filter((t) => t.estado !== "Archivado"),
    );
    expect(soloAbiertas).toEqual([]);
  });

  it("rechaza dos abiertas con la misma prioridad (el caso 69,93)", () => {
    const malo: Tarea[] = [
      ...SANO,
      {
        nombre: "La que duplica el número de otra",
        prioridad: 11,
        etapa: "Artículo y velocidad",
        area: "Código",
        estado: "To-Do",
      },
    ];
    const hallazgos = revisarTablero(malo);
    expect(hallazgos.map((h) => h.regla)).toContain("prioridad-duplicada");
    expect(hallazgos[0]?.tareas).toHaveLength(2);
  });

  it("rechaza una abierta sin Área", () => {
    const malo: Tarea[] = [
      ...SANO,
      {
        nombre: "La que nadie clasificó",
        prioridad: 12,
        etapa: "Artículo y velocidad",
        area: null,
        estado: "To-Do",
      },
    ];
    expect(revisarTablero(malo).map((h) => h.regla)).toContain("sin-area");
  });

  it("rechaza una abierta sin Prioridad, que es no estar en el orden", () => {
    const malo: Tarea[] = [
      ...SANO,
      {
        nombre: "La que no está en ninguna parte de la cola",
        prioridad: null,
        etapa: "General",
        area: "Infra",
        estado: "Sin empezar",
      },
    ];
    expect(revisarTablero(malo).map((h) => h.regla)).toContain("sin-prioridad");
  });

  it("rechaza un To-Do fuera del sprint activo", () => {
    const malo: Tarea[] = [
      ...SANO,
      {
        nombre: "Una de un bloque que alguien puso en To-Do",
        prioridad: 21,
        etapa: "Design System",
        area: "Código",
        estado: "To-Do",
      },
    ];
    expect(revisarTablero(malo).map((h) => h.regla)).toContain(
      "estado-fuera-del-sprint",
    );
  });

  it("NO rechaza el carril de contenido en marcha por delante de su sprint", () => {
    // Es la excepción que hace que un sprint no abra bloqueado por un texto que
    // solo escribe Francisco. Sin ella, el guardián saldría rojo justo sobre lo
    // que el tablero protege.
    const carril: Tarea[] = [
      ...SANO,
      {
        nombre: "Escribir el texto de una sección futura",
        prioridad: 40,
        etapa: "Sobre mí",
        area: "Contenido",
        estado: "En progreso",
      },
    ];
    expect(revisarTablero(carril)).toEqual([]);
  });

  it("no le importa que un bloque se numere dentro del rango del sprint", () => {
    // Un bloque es un backlog temático, no una cola: su numeración puede
    // entrelazarse con la del sprint sin que eso signifique nada.
    const entrelazado: Tarea[] = [
      ...SANO,
      {
        nombre: "Deuda encontrada durante el sprint y numerada donde apareció",
        prioridad: 10.5,
        etapa: "General",
        area: "Infra",
        estado: "Sin empezar",
      },
    ];
    expect(revisarTablero(entrelazado)).toEqual([]);
  });

  it("sí le importa que otro SPRINT abierto se cuele por delante", () => {
    const dosSprints: Tarea[] = [
      ...SANO,
      {
        nombre: "Una de otro sprint, en ejecución y por delante",
        prioridad: 10.5,
        etapa: "Footer y contacto",
        area: "Código",
        estado: "To-Do",
      },
    ];
    const reglas = revisarTablero(dosSprints).map((h) => h.regla);
    expect(reglas).toContain("orden-entre-sprints");
  });
});

describe("sprintActivo", () => {
  it("lo deriva de dónde están las tareas en ejecución", () => {
    expect(sprintActivo(SANO)).toBe("Artículo y velocidad");
  });

  it("no lo confunde con el carril de contenido, que corre por delante", () => {
    const carril: Tarea[] = [
      ...SANO,
      {
        nombre: "Contenido de una sección futura",
        prioridad: 40,
        etapa: "Sobre mí",
        area: "Contenido",
        estado: "En progreso",
      },
    ];
    expect(sprintActivo(carril)).toBe("Artículo y velocidad");
  });

  it("devuelve null si no hay nada en ejecución", () => {
    expect(
      sprintActivo(SANO.map((t) => ({ ...t, estado: "Sin empezar" }))),
    ).toBeNull();
  });
});
