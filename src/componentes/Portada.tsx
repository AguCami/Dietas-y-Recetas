import type { Momento, Receta } from '../dominio/tipos'
import { urlDeReceta, useIlustracion } from './ilustracion'

/**
 * Portada de una receta.
 *
 * Si hay una foto en `public/recetas/<id>.webp`, se usa. Si no, se dibuja un
 * fondo con el color del momento del día y el emoji de la receta. La idea es
 * que la app se vea completa desde el primer día y que subir fotos sea algo
 * que se pueda hacer de a una, sin que falte nada mientras tanto.
 */

/**
 * Un degradado por momento, para que el listado tenga ritmo de color y se
 * distinga de un vistazo un desayuno de una cena.
 *
 * Van escritas enteras y no armadas con plantillas: Tailwind busca las clases
 * como texto literal en el código, y `from-${x}` no lo encuentra.
 */
const FONDO: Record<Momento, string> = {
  desayuno: 'from-durazno-50 to-durazno-100',
  almuerzo: 'from-salvia-50 to-salvia-100',
  merienda: 'from-lila-100 to-rosa-50',
  cena: 'from-lila-100 to-salvia-100',
  snack: 'from-durazno-50 to-salvia-50',
  dulce: 'from-rosa-50 to-rosa-100',
  basico: 'from-crema to-borde',
}

export function Portada({
  receta,
  className = '',
  tamanoEmoji = 'text-3xl',
}: {
  receta: Receta
  className?: string
  tamanoEmoji?: string
}) {
  const url = urlDeReceta(receta.id)
  const foto = useIlustracion(url)

  if (foto === 'existe') {
    return <img src={url} alt="" loading="lazy" className={`object-cover ${className}`} />
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${FONDO[receta.momentos[0] ?? 'basico']} ${className}`}
    >
      <span className={`${tamanoEmoji} leading-none select-none`} aria-hidden>
        {receta.emoji}
      </span>
    </div>
  )
}
