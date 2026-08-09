// Iconos propios: los que lucide no trae. Desde v1.24 ya no exporta iconos de
// marca (LinkedIn, GitHub…) por motivos de marca registrada, así que cualquier
// red o servicio que se añada al sitio se dibuja aquí a mano.
//
// CÓMO SE DIBUJA UNO: la regla de autoría —artboard, umbral de contorneado,
// contraforma mínima, puntos y verificación— vive en BRAND.md, sección «Iconos
// propios». Léela ANTES de añadir el siguiente; este archivo solo la aplica.
//
// Por qué se redibujó el de LinkedIn (P37.5989): el original —el de lucide antes
// de retirarlo— ya era outline, `fill="none"`, trazo 2 sobre rejilla de 24, y aun
// así se leía como una mancha al lado del sol y la luna del nav. No era el tamaño
// ni la pastilla: era que metía CINCO carriles de 4 unidades en las 20 del área
// útil, así que cada contraforma medía 2 unidades — 1,5px a 18px, por debajo de lo
// que el antialiasing puede separar. La «in» no cabe contorneada a este grosor
// (una barra legible pide 8 unidades de ancho y no caben tres), así que se dibuja
// CON el trazo. Huecos resultantes: 6 del punto al asta, 8 entre la i y la n, 8 de
// contraforma de la n.
export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* El punto es TRAZO, no un `circle`: `h.01` con terminación redonda da un
          punto del diámetro exacto del trazo. Un `circle r="2"` —lo que había—
          deja un hueco de 2 unidades y se rellena solo. */}
      <path d="M4 4h.01" />
      <path d="M4 10v11" />
      <path d="M12 21v-7a4 4 0 0 1 8 0v7" />
    </svg>
  );
}
