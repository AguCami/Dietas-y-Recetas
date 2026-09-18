import { createContext, useContext } from 'react'
import type { ItemDespensa, Perfil } from '../dominio/tipos'

export interface Datos {
  cargando: boolean
  despensa: ItemDespensa[]
  /** Para consultar en O(1) desde el matcher. */
  idsDespensa: Set<string>
  perfil: Perfil
  favoritos: string[]
  agregarADespensa: (id: string, cantidad?: string) => void
  quitarDeDespensa: (id: string) => void
  vaciarDespensa: () => void
  guardarPerfil: (perfil: Perfil) => void
  restablecerPerfil: () => void
  alternarFavorito: (id: string) => void
}

export const Contexto = createContext<Datos | null>(null)

export function useDatos(): Datos {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useDatos tiene que usarse dentro de <ProveedorDatos>')
  return ctx
}
