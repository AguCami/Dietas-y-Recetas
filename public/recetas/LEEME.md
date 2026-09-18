# Fotos de portada de las recetas

Cada receta puede tener su foto. Si no la tiene, la app muestra una portada de
color con el emoji de la receta, distinta según el momento del día. O sea que
**se pueden subir de a una** sin que quede nada a medias.

## Cómo agregar una

1. Poné la foto en `disenio/recetas/` con el **id de la receta** como nombre.
   Los ids están en `src/datos/recetas.ts`; por ejemplo, para el pollo al horno
   el archivo es `pollo-batatas-romero.jpg`.
2. Corré `python3 scripts/preparar-fotos.py`.
3. El script la recorta al 3:2 que usa la app, la achica y la guarda acá en
   `.webp`. Si el nombre no coincide con ninguna receta, te avisa.

Sirve JPG, PNG o WebP, de cualquier tamaño: cuanto más grande la original,
mejor. La foto se recorta desde el centro, así que conviene que el plato esté
más o menos centrado.

**Los `.webp` de esta carpeta se generan solos. No los edites a mano.**
