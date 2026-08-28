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
  medirGeneral,
  revisarTablero,
  type Sello,
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

/** SANO tiene exactamente una abierta en `General`: la «Deuda transversal». */
const SELLO_AL_DIA: Sello = {
  fecha: "2026-08-28",
  cierre: "Home",
  abiertas: 1,
};

/** Cuatro más en el bloque transversal, que es justo el umbral rojo. */
const CUATRO_NUEVAS: Tarea[] = [1, 2, 3, 4].map((n) => ({
  nombre: `Deuda transversal recién archivada en General ${n}`,
  prioridad: 30 + n,
  etapa: "General",
  area: "Infra",
  estado: "Sin empezar",
}));

describe("medirGeneral", () => {
  it("cuenta las abiertas del bloque transversal y nada más", () => {
    // Ni las de otros bloques ni las cerradas: SANO tiene una sola en `General`.
    expect(medirGeneral(SANO, SELLO_AL_DIA).abiertas).toBe(1);
  });

  it("no cuenta como crecimiento una cerrada de General", () => {
    const conCerrada: Tarea[] = [
      ...SANO,
      {
        nombre: "Deuda transversal ya archivada",
        prioridad: 31,
        etapa: "General",
        area: "Infra",
        estado: "Archivado",
      },
    ];
    expect(medirGeneral(conCerrada, SELLO_AL_DIA).variacion).toBe(0);
  });

  it("un embalse que baja es verde, no ámbar", () => {
    const drenado = SANO.filter((t) => t.etapa !== "General");
    const medida = medirGeneral(drenado, SELLO_AL_DIA);
    expect(medida.variacion).toBe(-1);
    expect(medida.nivel).toBe("verde");
  });

  it("una sola tarea nueva es ámbar: se dice y no se falla", () => {
    const medida = medirGeneral(
      [...SANO, CUATRO_NUEVAS[0] as Tarea],
      SELLO_AL_DIA,
    );
    expect(medida.variacion).toBe(1);
    expect(medida.nivel).toBe("ambar");
  });
});

describe("revisarTablero · el embalse transversal", () => {
  it("no dice nada del embalse si no se le da sello", () => {
    // Las cuatro primeras reglas no lo necesitan, y sin sello no hay contra qué
    // comparar: inventarse un cero sería el verde falso de siempre.
    expect(revisarTablero([...SANO, ...CUATRO_NUEVAS])).toEqual([]);
  });

  it("con el sello al día, un tablero sano sigue sin hallazgos", () => {
    expect(revisarTablero(SANO, SELLO_AL_DIA)).toEqual([]);
  });

  it("rechaza que General gane 4 netas desde el cierre anterior", () => {
    const hallazgos = revisarTablero([...SANO, ...CUATRO_NUEVAS], SELLO_AL_DIA);
    expect(hallazgos.map((h) => h.regla)).toContain("general-no-drena");
    expect(hallazgos[0]?.mensaje).toContain("1 → 5");
  });

  it("no lo rechaza con 3, que es el ruido que el umbral deja pasar", () => {
    expect(
      revisarTablero([...SANO, ...CUATRO_NUEVAS.slice(0, 3)], SELLO_AL_DIA),
    ).toEqual([]);
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
