// El límite de frecuencia de las dos Server Actions públicas — las REGLAS, sin E/S.
//
// POR QUÉ ESTÁ AQUÍ Y NO EN CADA ACCIÓN. Estaba escrito dos veces, carácter por
// carácter salvo el techo: en `app/[lang]/contacto/actions.ts` (5 por hora) y en
// `app/consent-actions.ts` (10, hoy 100). Es la partición que este repo ya aplica
// en `lib/contact-form.ts` ↔ `contacto/actions.ts` y en `lib/consent-metrics.ts`:
// **aquí la decisión, con tests y con caso malo; la E/S —leer la IP de las
// cabeceras— se queda en la acción**, que es lo único que no se puede probar.
//
// LO QUE ESTE LÍMITE NO PUEDE, y va escrito porque los dos call sites lo repetían:
// el mapa vive en la memoria de la INSTANCIA. En serverless cada instancia tiene
// el suyo y una instancia fría empieza a cero, así que esto no es un límite duro
// —un actor distribuido lo esquiva— sino un tope al abuso repetido desde una misma
// IP en una misma instancia.
//
// Y LO QUE CUENTA ES UNA IP, NO UNA PERSONA. Detrás de un CGNAT móvil o de la red
// de una oficina, decenas de personas comparten la misma IP saliente. El techo hay
// que elegirlo por IP y no por persona: es el error que tuvo el contador de
// consentimiento entre el 2026-08-31 y el 2026-09-02, y su consecuencia no era una
// puerta abierta sino una medición **deflactada** justo en el escenario que ese
// contador existe para medir.

/** El reloj, inyectable: sin esto el caso malo tendría que esperar una hora real. */
export type Reloj = () => number;

export interface Limitador {
  /** `true` si esta llamada se descarta. Consume cupo cuando devuelve `false`. */
  limitado(clave: string): boolean;
  /** Cuántas claves vivas hay. Solo para los tests del barrido. */
  readonly tamano: number;
}

export interface OpcionesLimite {
  ventanaMs: number;
  max: number;
  /** A partir de cuántas claves se barren las caducadas. */
  barrerDesde?: number;
  ahora?: Reloj;
}

export function creaLimitador({
  ventanaMs,
  max,
  barrerDesde = 500,
  ahora = Date.now,
}: OpcionesLimite): Limitador {
  const golpes = new Map<string, number[]>();

  return {
    get tamano() {
      return golpes.size;
    },

    limitado(clave: string): boolean {
      const t = ahora();
      const recientes = (golpes.get(clave) ?? []).filter(
        (previo) => t - previo < ventanaMs,
      );

      // Al llegar al techo se guardan los recientes YA FILTRADOS y no se añade
      // nada: si se apuntara el golpe rechazado, insistir alargaría el castigo
      // para siempre y la ventana dejaría de ser una ventana.
      if (recientes.length >= max) {
        golpes.set(clave, recientes);
        return true;
      }

      recientes.push(t);
      golpes.set(clave, recientes);

      // El mapa no crece sin fin: cada llamada barre las claves ya caducadas.
      if (golpes.size > barrerDesde) {
        for (const [k, tiempos] of golpes) {
          if (tiempos.every((previo) => t - previo >= ventanaMs)) {
            golpes.delete(k);
          }
        }
      }
      return false;
    },
  };
}
