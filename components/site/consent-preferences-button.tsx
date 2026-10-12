"use client";

import { actionVariants } from "@/components/ui/action";
import { OPEN_CONSENT_EVENT } from "@/lib/consent";

// Reabre el centro de preferencias de cookies (RGPD: retirar el consentimiento debe
// ser tan fácil como darlo). Despacha un evento que escucha el ConsentBanner.
//
// `outline-primary`, el mismo que el CTA «Descargar CV» de Trayectoria (P37.58): vive
// solo en el cuerpo del texto, sin otro CTA al lado con el que competir —a diferencia
// de los botones del propio diálogo de consentimiento, donde el outline neutro sí
// tiene sentido para no pisar al primary de «Guardar»—, así que le toca el mismo
// tratamiento que ese otro CTA de contenido.
//
// TENÍA UNA PROP `variant` CON DOS RAMAS Y LA DE POR DEFECTO NO LA USABA NADIE
// (borrada el 2026-08-09, P37.656). `variant="link"` pintaba un enlace de chrome
// «del footer» que nunca llegó a existir; el único call site, en la política de
// cookies, pasaba `variant="button"`. Dos consecuencias que la hacen borrable y no
// conservable: era **el valor por defecto**, o sea que el siguiente que usara este
// componente sin pensar se habría llevado la rama muerta; y esa rama estaba escrita
// a mano sin `min-h-[44px]` ni `inline-flex`, así que habría medido ~28px de alto,
// por debajo del suelo de 44 que publica la checklist de Accesibilidad del sitio.
// Es el precedente literal de D36: `components/ui/button.tsx` llevaba desde el
// principio en el repo con cero usos, con un mecanismo de foco propio y un hover que
// contradecía la regla, y se borró por eso mismo. Código muerto no es código neutro
// — es el sitio donde un incumplimiento espera sin que nadie lo vea.
export function ConsentPreferencesButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
      className={actionVariants({ variant: "outline-primary" })}
    >
      {label}
    </button>
  );
}
