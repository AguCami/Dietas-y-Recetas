"""
Prepara las fotos de portada de las recetas.

Entrada:  disenio/recetas/<id-de-receta>.(png|jpg|jpeg|webp)
Salida:   public/recetas/<id-de-receta>.webp

El nombre del archivo tiene que ser el id de la receta, tal como figura en
src/datos/recetas.ts (por ejemplo: pollo-batatas-romero.jpg). La app busca ese
nombre; si no lo encuentra, muestra la portada de color con el emoji, así que
se pueden ir subiendo fotos de a una sin que falte nada mientras tanto.

Recorta al 3:2 que usa la app y achica: una foto de cámara pesa varios megas y
en la pantalla ocupa 900 px de ancho como mucho.

Correr con:  python3 scripts/preparar-fotos.py
"""

import glob
import os

from PIL import Image, ImageOps

ORIGEN = 'disenio/recetas'
DESTINO = 'public/recetas'
ANCHO, ALTO = 900, 600   # 3:2, la proporción de la portada en el detalle
CALIDAD = 82


def main() -> None:
    archivos = [
        f
        for patron in ('*.png', '*.jpg', '*.jpeg', '*.webp')
        for f in glob.glob(f'{ORIGEN}/{patron}')
    ]
    if not archivos:
        print(f'No hay fotos en {ORIGEN}/')
        return

    os.makedirs(DESTINO, exist_ok=True)
    ids = ids_de_recetas()

    for archivo in sorted(archivos):
        nombre = os.path.splitext(os.path.basename(archivo))[0]
        if ids and nombre not in ids:
            print(f'  ⚠ {nombre}: no hay ninguna receta con ese id, la salteo')
            continue

        imagen = Image.open(archivo)
        # exif_transpose respeta la orientación con la que se sacó la foto:
        # sin esto, las verticales del celular salen acostadas.
        imagen = ImageOps.exif_transpose(imagen).convert('RGB')
        recorte = ImageOps.fit(imagen, (ANCHO, ALTO), Image.LANCZOS, centering=(0.5, 0.5))

        salida = f'{DESTINO}/{nombre}.webp'
        recorte.save(salida, 'WEBP', quality=CALIDAD, method=6)
        antes = os.path.getsize(archivo) // 1024
        print(f'  {nombre + ".webp":34} {antes:5} KB -> {os.path.getsize(salida) // 1024:3} KB')


def ids_de_recetas() -> set:
    """Lee los ids del recetario para avisar si una foto está mal nombrada."""
    import re

    try:
        with open('src/datos/recetas.ts', encoding='utf-8') as f:
            return set(re.findall(r"^    id: '([^']+)'", f.read(), re.M))
    except OSError:
        return set()


if __name__ == '__main__':
    main()
