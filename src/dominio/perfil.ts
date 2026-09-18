import { INGREDIENTE_POR_ID } from '../datos/ingredientes'
import type { Estado, Etiqueta, Perfil } from './tipos'

export interface Veredicto {
  estado: Estado
  /** Qué grupo lo dejó afuera. Sirve para explicar el porqué en la UI. */
  motivo?: Etiqueta
  /** true si el resultado viene de una excepción del perfil y no de las reglas. */
  porExcepcion?: boolean
}

/**
 * Decide si un ingrediente entra en el protocolo.
 *
 * Orden de precedencia:
 *   1. Excepción puntual del perfil (gana siempre).
 *   2. Reglas por grupo: si alguna etiqueta del ingrediente está excluida, sale.
 *   3. Si nada lo excluye, está permitido.
 */
export function evaluar(idIngrediente: string, perfil: Perfil): Veredicto {
  const excepcion = perfil.excepciones[idIngrediente]
  if (excepcion) return { estado: excepcion, porExcepcion: true }

  const ingrediente = INGREDIENTE_POR_ID.get(idIngrediente)
  if (!ingrediente) return { estado: 'permitido' }

  const motivo = ingrediente.etiquetas.find((e) => perfil.reglas[e] === 'excluido')
  return motivo ? { estado: 'excluido', motivo } : { estado: 'permitido' }
}

export const esPermitido = (id: string, perfil: Perfil) => evaluar(id, perfil).estado === 'permitido'
