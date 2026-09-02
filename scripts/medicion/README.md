# `scripts/medicion/` — el check de medición deja una cifra que restar

`registro.json` **no se edita a mano**. Lo escribe `npm run medicion -- --sellar`
al cerrar una etapa, y de ahí lo lee la pasada siguiente para contestar la
pregunta 2 del check («¿ha cambiado algo desde el cierre anterior?»). Antes esa
respuesta dependía de que alguien se acordara de escribir el número en la prosa de
un D-entry: el «45 usuarios» del cierre de julio hubo que sacarlo grepeando.

```
npm run medicion                     # lee lo automático y compara con el sello
npm run medicion -- --sellar --etapa=Higiene \
  --ventana=2026-09-01..2026-09-28 \
  --ga4-eventos=240 --ga4-usuarios=39 --primaria=1
```

## Las cuatro fuentes, y cuál se lee sola

| Fuente | Automática | Por qué |
|---|---|---|
| GA4 | no | Necesita sesión autenticada en el navegador. Entra por bandera y el sello anota que la cifra se tecleó |
| Panel de Looker | — | **No aporta**, que no es lo mismo que no legible: publica un subconjunto de GA4 |
| `consentimiento` | sí | Contra el almacén de producción, con las `KV_REST_API_*` de `.env.vercel` |
| Vercel Web Analytics | no | Su API contesta **404 en plan Hobby**, comprobado el 2026-09-02 por dos caminos. La cifra existe y la lee Francisco en el panel |

Las dos que no se leen solas **salen en el sello igual, con su motivo**. Un sello
que omitiera esa lista se leería como uno completo, que es la definición de un
metro que engaña.

## Qué significa `ventana`

Describe las **cifras de analítica**, que son de una ventana rodante de 28 días.
Los contadores de consentimiento **no**: son acumulados desde que el contador
existe (2026-08-31), así que su delta entre dos sellos es lo que pasó en medio,
no lo que pasó en la ventana.

## Las credenciales van en DOS archivos

- `.env.local` — lo escribe una persona. `PSI_API_KEY`. **No lo toca ningún comando.**
- `.env.vercel` — `vercel env pull .env.vercel --environment=production`. Regenerable.

Los dos están en `.gitignore` y gana `.env.local`. Son dos porque `vercel env pull`
**sobrescribe** su destino: apuntarlo a `.env.local` —que es lo que este repo
documentaba hasta el 2026-09-02— se llevaba por delante la clave de PageSpeed.
El detalle, en `entorno.ts`.
