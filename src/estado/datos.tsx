import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { almacen, CLAVES } from '../almacenamiento'
import { PERFIL_BASE } from '../datos/perfilBase'
import type { ItemDespensa, Perfil } from '../dominio/tipos'
import { Contexto } from './contexto'
import type { Datos } from './contexto'

export function ProveedorDatos({ children }: { children: ReactNode }) {
  const [cargando, setCargando] = useState(true)
  const [despensa, setDespensa] = useState<ItemDespensa[]>([])
  const [perfil, setPerfil] = useState<Perfil>(PERFIL_BASE)
  const [favoritos, setFavoritos] = useState<string[]>([])

  // Carga inicial. Hasta que termine no guardamos nada, para no pisar con
  // los valores por defecto lo que ya había guardado.
  useEffect(() => {
    let vigente = true
    ;(async () => {
      const [d, p, f] = await Promise.all([
        almacen.leer<ItemDespensa[]>(CLAVES.despensa),
        almacen.leer<Perfil>(CLAVES.perfil),
        almacen.leer<string[]>(CLAVES.favoritos),
      ])
      if (!vigente) return
      if (d) setDespensa(d)
      // Fusionamos con el perfil base: si en una actualización agregamos un
      // grupo nuevo, el perfil guardado no lo tiene y quedaría `undefined`.
      if (p) {
        setPerfil({
          ...PERFIL_BASE,
          ...p,
          reglas: { ...PERFIL_BASE.reglas, ...p.reglas },
          excepciones: { ...p.excepciones },
        })
      }
      if (f) setFavoritos(f)
      setCargando(false)
    })()
    return () => {
      vigente = false
    }
  }, [])

  useEffect(() => {
    if (!cargando) void almacen.guardar(CLAVES.despensa, despensa)
  }, [despensa, cargando])
  useEffect(() => {
    if (!cargando) void almacen.guardar(CLAVES.perfil, perfil)
  }, [perfil, cargando])
  useEffect(() => {
    if (!cargando) void almacen.guardar(CLAVES.favoritos, favoritos)
  }, [favoritos, cargando])

  const agregarADespensa = useCallback((id: string, cantidad?: string) => {
    setDespensa((actual) =>
      actual.some((i) => i.id === id)
        ? actual.map((i) => (i.id === id ? { ...i, cantidad } : i))
        : [...actual, { id, cantidad, agregadoEn: new Date().toISOString() }],
    )
  }, [])

  const quitarDeDespensa = useCallback((id: string) => {
    setDespensa((actual) => actual.filter((i) => i.id !== id))
  }, [])

  const vaciarDespensa = useCallback(() => setDespensa([]), [])

  const alternarFavorito = useCallback((id: string) => {
    setFavoritos((actual) => (actual.includes(id) ? actual.filter((f) => f !== id) : [...actual, id]))
  }, [])

  const restablecerPerfil = useCallback(() => setPerfil(PERFIL_BASE), [])

  const idsDespensa = useMemo(() => new Set(despensa.map((i) => i.id)), [despensa])

  const valor = useMemo<Datos>(
    () => ({
      cargando,
      despensa,
      idsDespensa,
      perfil,
      favoritos,
      agregarADespensa,
      quitarDeDespensa,
      vaciarDespensa,
      guardarPerfil: setPerfil,
      restablecerPerfil,
      alternarFavorito,
    }),
    [
      cargando,
      despensa,
      idsDespensa,
      perfil,
      favoritos,
      agregarADespensa,
      quitarDeDespensa,
      vaciarDespensa,
      restablecerPerfil,
      alternarFavorito,
    ],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}
