"use client";

import { ErrorBoundaryBody } from "@/components/site/error-boundary";

// Error boundary con marca e i18n (tarea 30.2). Debe ser client component (contrato
// de Next: recibe {error, unstable_retry}). Se renderiza cuando algo del árbol falla,
// así que se mantiene autocontenido —copy desde system-messages, sin depender del
// diccionario runtime que podría ser justo lo que ha fallado—. Cubre errores de
// página/componente; los de layout van a un nivel superior (`app/global-error.tsx`).
//
// LA PANTALLA VIVE EN `ErrorBoundaryBody`, COMPARTIDA CON `global-error` (P72.19):
// las dos enseñan lo mismo y lo único que cambia es el marco. Aquí no hay marco,
// porque el layout raíz sigue en pie.
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return <ErrorBoundaryBody error={error} onRetry={unstable_retry} />;
}
