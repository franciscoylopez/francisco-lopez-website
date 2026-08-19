# Procesado de logos monocromo

Convierte los logos de origen (`.webp`, a color y muchos sin canal alfa) en las
siluetas monocromo que usan Toolkit, Trayectoria y Formación. Genera dos PNG por
logo — uno para tema claro y otro para oscuro — a lienzo unificado, en
`public/logos/{tools,companies,education}/`.

Esto es lo que permite cumplir la regla de `BRAND.md` de **no usar logos de
empresa a color**: no son iconos genéricos, son la silueta real de cada marca,
pero aplanada a un único color por tema.

## Uso

```bash
node scripts/logos/batch_process.js
```

La carpeta de origen por defecto es `./logos-src`, con
subcarpetas `Tools/`, `Empresas/` y `Formacion/`. Para usar otra:

```bash
LOGOS_SRC="/ruta/a/Logos Web" node scripts/logos/batch_process.js
```

Para añadir un logo nuevo, mete su entrada en el array `jobs` de
`batch_process.js`.

## Por qué no es un proceso por lotes ciego

Varios `.webp` de origen no tienen canal alfa: traen fondo sólido en vez de
transparente. `process_logo.js` recorta el fondo por distancia de color con una
rampa alfa entre `D_LO` y `D_HI`, deliberadamente empinada para conservar el
trazo fino sin arrastrar la neblina de tonos medios.

Aun así, **hay que revisar cada logo a ojo después de generarlo.** Ya pasó una
vez: el `.webp` de Amplitude traía ruido de compresión alrededor del círculo que
el recorte leyó como un entramado de puntos, y hubo que tratarlo aparte.

## Cobertura

Los 26 logos del array cubren Toolkit, Trayectoria y Formación. Dos ausencias
deliberadas, no olvidos: **Miss Conversion** (no hay logo) y **Havas
Media / Increnta**, porque su fila de Trayectoria agrupa tres empresas y se
decidió dejarla sin icono en vez de mostrar solo dos de los tres logos — ver
PRD 8.5.
