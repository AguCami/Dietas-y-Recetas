# Ilustraciones de Llamachef

Dejá acá los PNG de la mascota. La app los levanta sola: no hay que tocar código.

## Archivos que busca

| Nombre exacto    | Cuándo se muestra                                  |
| ---------------- | -------------------------------------------------- |
| `feliz.png`      | Por defecto, y en el encabezado de toda la app      |
| `pensando.png`   | Cuando la despensa está vacía o no hay receta lista |
| `dormida.png`    | Disponible, todavía no está enganchada a nada       |

**Si falta alguno, no pasa nada**: esa pose usa la llama dibujada en código
(`src/componentes/Llama.tsx`). Podés subir de a una y ver cómo queda.

## Formato

- PNG con **fondo transparente** (canal alfa). No JPG, no fondo blanco.
- Cuadrado, 1024×1024.
- **Mismo encuadre en todas**: mismo tamaño y misma posición del cuerpo.
  Si el cuerpo se mueve entre poses, al cambiar de humor pega un salto.
- Tiene que leerse a 36 px, que es el tamaño del encabezado: formas simples
  y grandes, sin detalles finos.

## Paleta

```
lana        #FFFAF4 → #F2DFCC      contorno    #E0CBB5
rosa        #F0B0B8               lila         #C3B5E4
salvia      #C2D9BA               durazno      #F3C193
ojos        #4A423C               fondo app    #FDF8F3
```
