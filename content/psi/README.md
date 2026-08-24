# `content/psi/` — lo que midió la última pasada de PageSpeed

`registro.json` NO se edita a mano. Lo escribe `npm run psi -- --registro`
cuando la pasada cubre el registro entero con las dos estrategias y sin fallos,
y de ahí lo lee el artículo para publicar la nota con su fecha (`D102`).

Una pasada parcial no sella: un rango sacado de cuatro páginas publicado como si
fuera el del sitio es peor que no publicar nada.
