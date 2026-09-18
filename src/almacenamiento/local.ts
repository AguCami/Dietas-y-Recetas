import type { Almacen } from './tipos'

const PREFIJO = 'dyr:'

/**
 * Guarda en localStorage.
 *
 * Todo va envuelto en try/catch: en modo incógnito, con el almacenamiento
 * lleno o con las cookies bloqueadas, `localStorage` tira excepción. Que no
 * se pueda guardar la despensa no puede romper la app entera.
 */
export const almacenLocal: Almacen = {
  async leer<T>(clave: string): Promise<T | null> {
    try {
      const crudo = localStorage.getItem(PREFIJO + clave)
      return crudo ? (JSON.parse(crudo) as T) : null
    } catch {
      return null
    }
  },

  async guardar<T>(clave: string, valor: T): Promise<void> {
    try {
      localStorage.setItem(PREFIJO + clave, JSON.stringify(valor))
    } catch {
      // Sin persistencia la sesión sigue funcionando en memoria.
    }
  },
}
