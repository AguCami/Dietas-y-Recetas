/**
 * Capa de persistencia.
 *
 * Hoy todo vive en el navegador (GitHub Pages es estático, no hay servidor).
 * La interfaz es asincrónica a propósito: el día que quieran sincronizar la
 * despensa entre los dos celulares, se escribe otro adaptador que hable con
 * un backend y no hay que tocar ni una pantalla.
 */
export interface Almacen {
  leer<T>(clave: string): Promise<T | null>
  guardar<T>(clave: string, valor: T): Promise<void>
}
