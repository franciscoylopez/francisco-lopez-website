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
// GitHub, el SEGUNDO icono propio. lucide-react dejó de exportarlo en la v1.24
// junto al resto de marcas (comprobado: `Github` ya no existe en el paquete), y
// es el caso que BRAND.md §Iconos propios nombra expresamente. El trazado es el
// glifo monolineal que la propia lucide mantuvo hasta esa versión —licencia ISC—,
// así que cumple su rejilla por construcción: artboard 24, trazo 2, coordenadas
// dentro de 2-22 y la cola del gato como línea suelta en vez de contorneada, que
// es lo que manda la regla de «nada se contornea por debajo de 8 unidades».
// Redibujarlo a mano habría sido dibujar peor lo mismo.
export function GithubIcon({ className }: { className?: string }) {
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
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

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
