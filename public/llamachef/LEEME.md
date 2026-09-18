# Ilustraciones de Llamachef

**Los archivos `.webp` de esta carpeta se generan solos. No los edites a mano.**

Las originales viven en `disenio/poses/` y de ahí sale todo lo de acá, con:

```bash
python3 scripts/preparar-poses.py
```

## Qué hace ese script

Las imágenes salen del generador en 1024×1024 y pesan medio mega cada una: 3,3 MB
en total, demasiado para abrir en el celular con datos. El script las recorta,
las achica a lo que la app muestra de verdad y las guarda en WebP. Quedan en
unos 200 KB en total, sin diferencia visible.

Recorta todas con **una sola caja común**, no con la de cada imagen. Si cada pose
se recortara a su propio contenido, las que tienen un brazo levantado quedarían a
otra escala y la llama pegaría un salto al cambiar de pose.

También genera `cara.webp`, un recorte de la cabeza a partir de `reposo.png`: de
cuerpo entero, en el encabezado, la cabeza queda de unos 10 px y no se entiende nada.

## Cuándo se usa cada pose

| Pose         | Cuándo aparece                                     |
| ------------ | -------------------------------------------------- |
| `cara`       | En el encabezado de toda la app                     |
| `saludo`     | Inicio, cuando la despensa está vacía               |
| `feliz`      | Inicio, cuando podés cocinar algo sin comprar nada  |
| `hablando`   | Inicio, cuando falta poco para alguna receta        |
| `confundida` | Inicio, cuando no encontró nada para ese momento    |
| `pensando`   | Mientras carga la app                               |
| `reposo`     | Por defecto, si no se pide otra                     |

## Para agregar o cambiar una pose

1. Subí el PNG a `disenio/poses/` con el nombre de la pose.
2. Corré el script.
3. Si es una pose nueva, hay que sumarla al tipo `Pose` en `src/componentes/Llama.tsx`
   y decidir cuándo se muestra.

Si falta alguna ilustración, esa pose cae en la llama dibujada en código
(`src/componentes/Llama.tsx`), así que nada se rompe.

## Formato de las originales

- PNG con **fondo transparente**. No JPG, no fondo blanco.
- Cuadrado, 1024×1024.
- **Mismo encuadre en todas**: mismo tamaño y misma posición del cuerpo.
- Que se lea a 36 px: formas simples y grandes, sin detalles finos.
