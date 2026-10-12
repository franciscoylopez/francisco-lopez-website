# Brand assets (piezas externas a la web)

Activos de marca que no forman parte de la web pero se versionan aquí para tener
una fuente única. Reutilizan el logo-kit (`public/logo-kit/`) y los tokens de marca.

- **`email-signature.html`** — firma de email (P27). Símbolo split + nombre + teléfono
  + iconos web/LinkedIn, en gris. Email-safe (tabla + estilos inline); las imágenes
  van por URL absoluta a `franciscolopez.es` porque Gmail capa los data-URI.
  - Iconos alojados en `public/email-signature/` (`globe.png`, `linkedin.png`).
  - Uso: abrir en el navegador → seleccionar la firma → copiar → pegar en Gmail
    (Ajustes → Firma) o en Outlook.

- **`linkedin-banner.png`** — header de LinkedIn (P28), 1584×396. Fondo oscuro
  (modo oscuro del sitio) + "Del discovery al dato." + `franciscolopez.es` + símbolo
  split a la derecha. La esquina inferior-izquierda se deja libre a propósito: ahí
  LinkedIn superpone la foto de perfil (por eso el banner NO lleva la foto). Generado
  con `<canvas>` y las fuentes reales para que sea nítido y exacto.
  - Uso: LinkedIn → Editar perfil → icono de cámara del banner → subir imagen.
