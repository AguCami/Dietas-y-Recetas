import { useEffect, useState } from 'react'

/**
 * Detecta si existe la ilustración de una pose en `public/llamachef/`.
 *
 * La idea es que subir un PNG a esa carpeta alcance para que la app lo use,
 * sin tocar código. Como el navegador no ofrece un "¿existe este archivo?",
 * lo intentamos cargar y miramos si falla.
 *
 * El resultado vive en un mapa fuera de React: la comprobación ocurre una
 * sola vez por archivo, aunque la llama se dibuje en varios lugares a la vez.
 */
const comprobadas = new Map<string, boolean>()

export type EstadoIlustracion = 'comprobando' | 'existe' | 'falta'

export function useIlustracion(url: string): EstadoIlustracion {
  // El estado solo sirve para volver a renderizar cuando termina la carga;
  // la respuesta se lee del mapa durante el render.
  const [, redibujar] = useState(0)

  useEffect(() => {
    if (comprobadas.has(url)) return

    let vigente = true
    const imagen = new Image()
    const resolver = (existe: boolean) => {
      comprobadas.set(url, existe)
      if (vigente) redibujar((n) => n + 1)
    }
    imagen.onload = () => resolver(true)
    imagen.onerror = () => resolver(false)
    imagen.src = url

    return () => {
      vigente = false
    }
  }, [url])

  const existe = comprobadas.get(url)
  return existe === undefined ? 'comprobando' : existe ? 'existe' : 'falta'
}

/** La URL respeta el `base` de Vite, que en GitHub Pages no es la raíz. */
export const urlDePose = (pose: string) => `${import.meta.env.BASE_URL}llamachef/${pose}.png`
