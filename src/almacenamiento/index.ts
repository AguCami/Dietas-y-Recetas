import { almacenLocal } from './local'
import type { Almacen } from './tipos'

export type { Almacen } from './tipos'

/**
 * Adaptador en uso.
 *
 * Para sincronizar entre dispositivos más adelante: crear `remoto.ts` con la
 * misma interfaz `Almacen` y cambiar esta única línea.
 */
export const almacen: Almacen = almacenLocal

export const CLAVES = {
  despensa: 'despensa',
  perfil: 'perfil',
  favoritos: 'favoritos',
} as const
