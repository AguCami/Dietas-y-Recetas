import type { Momento } from './tipos'

export interface Franja {
  momento: Momento
  /** Cómo nombrarlo en un título: "Para el almuerzo", "Para la merienda". */
  nombre: string
  articulo: 'el' | 'la'
}

/**
 * Franjas del día, en horario argentino de casa: la merienda existe y la cena
 * es tarde. Si comen a otra hora, se corrigen los cortes acá.
 *
 * Esto solo decide QUÉ se sugiere. No se muestra la hora en ningún lado:
 * la app propone merienda a las cinco de la tarde sin anunciarlo.
 */
const FRANJAS: { desde: number; hasta: number; franja: Franja }[] = [
  { desde: 5, hasta: 11, franja: { momento: 'desayuno', nombre: 'desayuno', articulo: 'el' } },
  { desde: 11, hasta: 15, franja: { momento: 'almuerzo', nombre: 'almuerzo', articulo: 'el' } },
  { desde: 15, hasta: 19, franja: { momento: 'merienda', nombre: 'merienda', articulo: 'la' } },
  { desde: 19, hasta: 23, franja: { momento: 'cena', nombre: 'cena', articulo: 'la' } },
]

const TRASNOCHE: Franja = { momento: 'snack', nombre: 'picoteo', articulo: 'el' }

export function franjaActual(fecha: Date = new Date()): Franja {
  const hora = fecha.getHours()
  return FRANJAS.find((f) => hora >= f.desde && hora < f.hasta)?.franja ?? TRASNOCHE
}
