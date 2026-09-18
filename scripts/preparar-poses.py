"""
Prepara las ilustraciones de Llamachef para la web.

Entrada:  disenio/poses/*.png   (las originales, como salen del generador)
Salida:   public/llamachef/*.webp  (lo que realmente se publica)

Las originales vienen de 1024x1024 con mucho vacío alrededor y pesan medio
mega cada una. Este script las recorta, las achica a lo que la app muestra de
verdad y las guarda en WebP. En total pasan de ~3,3 MB a ~200 KB, sin
diferencia visible: en un render suave como este, el WebP con pérdida se ve
mejor que un PNG de paleta reducida, que le cuartea el gorro.

Lo importante: el recorte usa UNA SOLA caja común a todas las poses, no la de
cada imagen. Si se recortara cada una a su propio contenido, las poses con un
brazo levantado quedarían a otra escala y la llama pegaría un salto al cambiar
de pose.

Correr con:  python3 scripts/preparar-poses.py
"""

import glob
import os

from PIL import Image

ORIGEN = 'disenio/poses'
DESTINO = 'public/llamachef'
ALTO_OBJETIVO = 512     # la app la muestra a ~140 px; 512 cubre pantallas 3x
LADO_CARA = 224         # recorte de cabeza para el encabezado
CALIDAD = 88            # probado contra el original: sin diferencia visible
UMBRAL_ALFA = 10        # por debajo de esto el generador deja neblina de fondo


def limpiar(imagen: Image.Image) -> Image.Image:
    """El fondo viene con alfa 1-5 en vez de 0. Se ve igual, pero rompe el recorte."""
    alfa = imagen.getchannel('A').point(lambda v: 0 if v < UMBRAL_ALFA else v)
    imagen.putalpha(alfa)
    return imagen


def guardar(imagen: Image.Image, nombre: str) -> int:
    ruta = f'{DESTINO}/{nombre}.webp'
    imagen.save(ruta, 'WEBP', quality=CALIDAD, method=6)
    return os.path.getsize(ruta) // 1024


def main() -> None:
    archivos = sorted(glob.glob(f'{ORIGEN}/*.png'))
    if not archivos:
        print(f'No hay poses en {ORIGEN}/')
        return

    os.makedirs(DESTINO, exist_ok=True)
    imagenes = {
        os.path.splitext(os.path.basename(f))[0]: limpiar(Image.open(f).convert('RGBA'))
        for f in archivos
    }

    cajas = [im.getbbox() for im in imagenes.values() if im.getbbox()]
    caja = (
        min(b[0] for b in cajas),
        min(b[1] for b in cajas),
        max(b[2] for b in cajas),
        max(b[3] for b in cajas),
    )
    ancho, alto = caja[2] - caja[0], caja[3] - caja[1]
    escala = min(1.0, ALTO_OBJETIVO / alto)
    destino = (round(ancho * escala), round(alto * escala))
    print(f'Caja común {caja} -> {destino[0]}x{destino[1]}\n')

    total = 0
    for nombre, imagen in imagenes.items():
        recorte = imagen.crop(caja)
        if escala < 1.0:
            recorte = recorte.resize(destino, Image.LANCZOS)
        antes = os.path.getsize(f'{ORIGEN}/{nombre}.png') // 1024
        kb = guardar(recorte, nombre)
        total += kb
        print(f'  {nombre + ".webp":18} {antes:4} KB -> {kb:3} KB')

    total += generar_cara(imagenes, caja)
    print(f'\n  {"total":18}          {total:4} KB')


def generar_cara(imagenes: dict, caja: tuple) -> int:
    """
    Recorte de cabeza para el encabezado.

    De cuerpo entero a 36 px la cabeza queda de unos 10 px y no se entiende
    nada; con este recorte se leen el gorro y la cara.
    """
    if 'reposo' not in imagenes:
        print('  (sin reposo.png, no genero la cara)')
        return 0

    cuerpo = imagenes['reposo'].crop(caja)

    # La cabeza vive en el tercio superior. Se mide su ancho real en esas filas
    # en lugar de fijarlo a mano, así sigue andando si cambia la ilustración.
    franja = cuerpo.crop((0, 0, cuerpo.width, int(cuerpo.height * 0.42)))
    b = franja.getbbox()
    if not b:
        return 0

    centro_x, centro_y = (b[0] + b[2]) // 2, (b[1] + b[3]) // 2
    lado = max(b[2] - b[0], b[3] - b[1]) // 2 + 12
    cara = cuerpo.crop((centro_x - lado, max(0, centro_y - lado), centro_x + lado, centro_y + lado))

    cuadrado = Image.new('RGBA', (max(cara.size),) * 2, (0, 0, 0, 0))
    cuadrado.alpha_composite(
        cara,
        ((cuadrado.width - cara.width) // 2, (cuadrado.height - cara.height) // 2),
    )
    kb = guardar(cuadrado.resize((LADO_CARA, LADO_CARA), Image.LANCZOS), 'cara')
    print(f'  {"cara.webp":18}          {kb:3} KB')
    return kb


if __name__ == '__main__':
    main()
