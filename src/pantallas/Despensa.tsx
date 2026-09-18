import { useMemo, useState } from 'react'
import { CATEGORIAS, ETIQUETAS } from '../dominio/tipos'
import type { Categoria } from '../dominio/tipos'
import { INGREDIENTES, INGREDIENTE_POR_ID } from '../datos/ingredientes'
import { evaluar } from '../dominio/perfil'
import { coincide } from '../dominio/texto'
import { useDatos } from '../estado/contexto'
import { Pildora, Tarjeta, Vacio } from '../componentes/ui'

const NOMBRE_ETIQUETA = Object.fromEntries(ETIQUETAS.map((e) => [e.id, e.nombre]))

export function Despensa() {
  const { despensa, idsDespensa, perfil, agregarADespensa, quitarDeDespensa, vaciarDespensa } = useDatos()
  const [consulta, setConsulta] = useState('')

  // Resultados de la búsqueda, dejando afuera lo que ya está cargado.
  const sugerencias = useMemo(() => {
    if (!consulta.trim()) return []
    return INGREDIENTES.filter(
      (i) => !idsDespensa.has(i.id) && coincide(consulta, i.nombre, ...(i.alias ?? [])),
    ).slice(0, 12)
  }, [consulta, idsDespensa])

  // La despensa agrupada por categoría, para que se lea como la heladera.
  const porCategoria = useMemo(() => {
    const grupos = new Map<Categoria, typeof INGREDIENTES>()
    for (const item of despensa) {
      const ing = INGREDIENTE_POR_ID.get(item.id)
      if (!ing) continue
      const lista = grupos.get(ing.categoria) ?? []
      lista.push(ing)
      grupos.set(ing.categoria, lista)
    }
    return CATEGORIAS.map((c) => ({ categoria: c, items: grupos.get(c.id) ?? [] })).filter(
      (g) => g.items.length > 0,
    )
  }, [despensa])

  const fueraDePlan = despensa.filter((i) => evaluar(i.id, perfil).estado === 'excluido').length

  return (
    <div className="flex flex-col gap-5">
      <header className="px-1">
        <h2 className="font-titulo text-3xl text-tinta">Qué tenemos en casa</h2>
        <p className="mt-1 text-sm text-tinta-suave">
          Cargá lo que hay y en la pestaña de recetas vas a ver qué se puede cocinar con eso.
        </p>
      </header>

      <Tarjeta className="p-4">
        <label htmlFor="buscar-ingrediente" className="sr-only">
          Buscar ingrediente
        </label>
        <div className="flex items-center gap-2 rounded-2xl bg-crema px-4 py-3">
          <span aria-hidden className="text-tinta-suave">🔍</span>
          <input
            id="buscar-ingrediente"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Buscar: zapallo, pollo, leche de coco…"
            className="w-full bg-transparent text-base outline-none placeholder:text-tinta-suave"
            autoComplete="off"
          />
          {consulta && (
            <button
              type="button"
              onClick={() => setConsulta('')}
              className="text-sm text-tinta-suave hover:text-tinta"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {consulta.trim() && (
          <div className="mt-3 flex flex-wrap gap-2">
            {sugerencias.length === 0 ? (
              <p className="px-1 py-2 text-sm text-tinta-suave">
                No encontré «{consulta}» en la lista. Si es algo que usan seguido, se agrega al catálogo
                en <code className="rounded bg-crema px-1">src/datos/ingredientes.ts</code>.
              </p>
            ) : (
              sugerencias.map((ing) => {
                const veredicto = evaluar(ing.id, perfil)
                const excluido = veredicto.estado === 'excluido'
                return (
                  <Pildora
                    key={ing.id}
                    tono={excluido ? 'no' : 'si'}
                    onClick={() => {
                      agregarADespensa(ing.id)
                      setConsulta('')
                    }}
                    titulo={
                      excluido
                        ? `Fuera del protocolo: ${NOMBRE_ETIQUETA[veredicto.motivo ?? ''] ?? ''}`
                        : 'Agregar a la despensa'
                    }
                  >
                    <span aria-hidden>+</span>
                    {ing.nombre}
                    {excluido && <span aria-hidden title="Fuera del protocolo">⚠️</span>}
                  </Pildora>
                )
              })
            )}
          </div>
        )}
      </Tarjeta>

      {despensa.length === 0 ? (
        <Tarjeta>
          <Vacio
            emoji="🧺"
            titulo="La despensa está vacía"
            texto="Buscá arriba y andá tocando los ingredientes que tengas. Con tres o cuatro ya empiezan a aparecer recetas."
          />
        </Tarjeta>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <p className="text-sm text-tinta-suave">
              <strong className="text-tinta">{despensa.length}</strong>{' '}
              {despensa.length === 1 ? 'ingrediente' : 'ingredientes'}
              {fueraDePlan > 0 && <> · {fueraDePlan} fuera del protocolo</>}
            </p>
            <button
              type="button"
              onClick={vaciarDespensa}
              className="ml-auto rounded-full px-3 py-1.5 text-sm text-tinta-suave transition hover:bg-rosa-50 hover:text-rosa-600"
            >
              Vaciar todo
            </button>
          </div>

          {porCategoria.map(({ categoria, items }) => (
            <Tarjeta key={categoria.id} className="p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-tinta-suave">
                <span aria-hidden>{categoria.emoji}</span>
                {categoria.nombre}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((ing) => {
                  const veredicto = evaluar(ing.id, perfil)
                  const excluido = veredicto.estado === 'excluido'
                  return (
                    <Pildora
                      key={ing.id}
                      tono={excluido ? 'no' : 'neutro'}
                      onClick={() => quitarDeDespensa(ing.id)}
                      titulo={
                        excluido
                          ? `Fuera del protocolo (${NOMBRE_ETIQUETA[veredicto.motivo ?? ''] ?? ''}). Tocá para quitarlo.`
                          : 'Tocá para quitarlo'
                      }
                    >
                      {ing.nombre}
                      {excluido && <span aria-hidden>⚠️</span>}
                      <span aria-hidden className="opacity-40">✕</span>
                    </Pildora>
                  )
                })}
              </div>
            </Tarjeta>
          ))}
        </>
      )}
    </div>
  )
}
