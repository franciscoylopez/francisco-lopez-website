import { describe, expect, it } from "vitest";

import { creaLimitador } from "@/lib/rate-limit";

// Los tests del límite de frecuencia de las dos Server Actions públicas (P72.11).
// Lo que se prueba no es que cuente, es DÓNDE muerde: el defecto que lo trajo aquí
// no era una puerta abierta sino una medición deflactada, y el caso malo es
// exactamente «la llamada N+1 desde la misma clave».

/** Un reloj de mentira: sin esto la ventana de una hora sería una hora real. */
function relojFalso(inicio = 1_700_000_000_000) {
  let t = inicio;
  return {
    ahora: () => t,
    avanza(ms: number) {
      t += ms;
    },
  };
}

const HORA = 60 * 60 * 1_000;

describe("creaLimitador — el caso malo: N llamadas y la N+1", () => {
  it("deja pasar exactamente `max` y descarta la siguiente", () => {
    const reloj = relojFalso();
    const limite = creaLimitador({
      ventanaMs: HORA,
      max: 5,
      ahora: reloj.ahora,
    });

    for (let i = 0; i < 5; i += 1) {
      expect(limite.limitado("1.2.3.4")).toBe(false);
    }
    expect(limite.limitado("1.2.3.4")).toBe(true);
  });

  it("el techo es POR CLAVE: una IP agotada no calla a otra", () => {
    // Es la mitad del defecto de P72.11 leída al revés. El límite discrimina por
    // clave, y la clave es una IP: por eso agotarla castiga a todo lo que haya
    // detrás de esa misma NAT y a nadie más.
    const reloj = relojFalso();
    const limite = creaLimitador({
      ventanaMs: HORA,
      max: 2,
      ahora: reloj.ahora,
    });

    limite.limitado("oficina");
    limite.limitado("oficina");
    expect(limite.limitado("oficina")).toBe(true);
    expect(limite.limitado("otra-casa")).toBe(false);
  });

  it("cien sucesos por hora es lo que hoy cabe tras una misma NAT", () => {
    // El techo del contador de consentimiento, con su cuenta: una persona genera
    // como mucho dos sucesos, así que 100 son ~50 visitantes nuevos por hora
    // detrás de una misma IP saliente. Con el techo viejo de 10 eran cinco.
    const reloj = relojFalso();
    const limite = creaLimitador({
      ventanaMs: HORA,
      max: 100,
      ahora: reloj.ahora,
    });

    for (let persona = 0; persona < 50; persona += 1) {
      expect(limite.limitado("cgnat")).toBe(false); // visto
      expect(limite.limitado("cgnat")).toBe(false); // decisión
    }
    expect(limite.limitado("cgnat")).toBe(true);
  });
});

describe("creaLimitador — la ventana es una ventana", () => {
  it("repone el cupo al salir los golpes viejos", () => {
    const reloj = relojFalso();
    const limite = creaLimitador({
      ventanaMs: HORA,
      max: 2,
      ahora: reloj.ahora,
    });

    limite.limitado("ip");
    limite.limitado("ip");
    expect(limite.limitado("ip")).toBe(true);

    reloj.avanza(HORA + 1);
    expect(limite.limitado("ip")).toBe(false);
  });

  it("insistir mientras se está limitado NO alarga el castigo", () => {
    // El golpe rechazado no se apunta. Si se apuntara, quien reintenta cada
    // minuto no volvería a pasar nunca y la ventana dejaría de ser una ventana —
    // que es justo el modo de fallo silencioso de un contador deflactado.
    const reloj = relojFalso();
    const limite = creaLimitador({
      ventanaMs: HORA,
      max: 1,
      ahora: reloj.ahora,
    });

    limite.limitado("ip");
    reloj.avanza(HORA / 2);
    expect(limite.limitado("ip")).toBe(true); // rechazado, no apuntado
    reloj.avanza(HORA / 2 + 1); // fuera de ventana el ÚNICO golpe válido
    expect(limite.limitado("ip")).toBe(false);
  });
});

describe("creaLimitador — el mapa no crece sin fin", () => {
  it("barre las claves caducadas al pasar del umbral", () => {
    const reloj = relojFalso();
    const limite = creaLimitador({
      ventanaMs: HORA,
      max: 5,
      barrerDesde: 10,
      ahora: reloj.ahora,
    });

    for (let i = 0; i < 10; i += 1) limite.limitado(`vieja-${i}`);
    expect(limite.tamano).toBe(10);

    reloj.avanza(HORA + 1);
    limite.limitado("nueva"); // supera el umbral y dispara el barrido
    expect(limite.tamano).toBe(1);
  });

  it("el barrido NO se lleva claves todavía vivas", () => {
    const reloj = relojFalso();
    const limite = creaLimitador({
      ventanaMs: HORA,
      max: 5,
      barrerDesde: 2,
      ahora: reloj.ahora,
    });

    limite.limitado("a");
    limite.limitado("b");
    limite.limitado("c"); // pasa de 2 y barre, pero las tres están vivas
    expect(limite.tamano).toBe(3);
  });
});
