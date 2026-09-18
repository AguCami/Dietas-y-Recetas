import { useMemo, useState } from 'react'
import { ETIQUETAS } from '../dominio/tipos'
import type { Estado, Etiqueta } from '../dominio/tipos'
import { INGREDIENTES, INGREDIENTE_POR_ID } from '../datos/ingredientes'
import { coincide, porRelevancia } from '../dominio/texto'
import { useDatos } from '../estado/contexto'
import { Pildora, Tarjeta } from '../componentes/ui'

export function Perfil() {
  const { perfil, guardarPerfil, restablecerPerfil } = useDatos()
  const [consulta, setConsulta] = useState('')

  const cambiarRegla = (etiqueta: Etiqueta, estado: Estado) =>
    guardarPerfil({ ...perfil, reglas: { ...perfil.reglas, [etiqueta]: estado } })

  const agregarExcepcion = (id: string) => {
    guardarPerfil({ ...perfil, excepciones: { ...perfil.excepciones, [id]: 'permitido' } })
    setConsulta('')
  }

  const quitarExcepcion = (id: string) => {
    const { [id]: _, ...resto } = perfil.excepciones
    guardarPerfil({ ...perfil, excepciones: resto })
  }

  const excepciones = Object.entries(perfil.excepciones)

  // Solo tiene sentido hacer una excepción con algo que hoy está excluido.
  const candidatos = useMemo(() => {
    if (!consulta.trim()) return []
    return INGREDIENTES.filter(
      (i) =>
        !perfil.excepciones[i.id] &&
        i.etiquetas.some((e) => perfil.reglas[e] === 'excluido') &&
        coincide(consulta, i.nombre, ...(i.alias ?? [])),
    )
      .sort(porRelevancia(consulta))
      .slice(0, 10)
  }, [consulta, perfil])

  return (
    <div className="flex flex-col gap-5">
      <header className="px-1">
        <h2 className="font-titulo text-3xl text-tinta">El plan de Cami</h2>
        <p className="mt-1 text-sm text-tinta-suave">
          Esto define qué recetas aparecen como aptas. A medida que reintroduce alimentos, se cambia acá.
        </p>
      </header>

      <Tarjeta className="border-lila-100 bg-lila-100/40 p-4">
        <p className="text-sm leading-relaxed text-tinta">
          <strong>Ojo:</strong> esta lista arranca con el Protocolo Autoinmune estándar, que es un punto de
          partida, no una indicación médica. La que vale es la que le dio su nutricionista: revisala con ella
          y ajustá lo que haga falta.
        </p>
      </Tarjeta>

      <Tarjeta className="p-5">
        <h3 className="font-titulo text-xl text-tinta">Grupos de alimentos</h3>
        <p className="mt-0.5 text-sm text-tinta-suave">
          Lo que esté en «No» se marca como fuera del plan en todas las recetas.
        </p>
        <ul className="mt-4 divide-y divide-borde">
          {ETIQUETAS.map((et) => {
            const estado = perfil.reglas[et.id]
            return (
              <li key={et.id} className="flex items-center gap-3 py-3">
                <div className="flex-1">
                  <p className="font-bold text-tinta">{et.nombre}</p>
                  <p className="text-xs text-tinta-suave">{et.ejemplo}</p>
                </div>
                <div className="flex shrink-0 overflow-hidden rounded-full border border-borde">
                  <button
                    type="button"
                    onClick={() => cambiarRegla(et.id, 'permitido')}
                    aria-pressed={estado === 'permitido'}
                    className={`px-3 py-1.5 text-sm font-bold transition ${
                      estado === 'permitido' ? 'bg-salvia-100 text-salvia-700' : 'text-tinta-suave hover:bg-crema'
                    }`}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => cambiarRegla(et.id, 'excluido')}
                    aria-pressed={estado === 'excluido'}
                    className={`px-3 py-1.5 text-sm font-bold transition ${
                      estado === 'excluido' ? 'bg-rosa-100 text-rosa-600' : 'text-tinta-suave hover:bg-crema'
                    }`}
                  >
                    No
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </Tarjeta>

      <Tarjeta className="p-5">
        <h3 className="font-titulo text-xl text-tinta">Excepciones</h3>
        <p className="mt-0.5 text-sm text-tinta-suave">
          Alimentos permitidos aunque su grupo esté excluido. Es donde van las reintroducciones.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {excepciones.length === 0 ? (
            <p className="text-sm text-tinta-suave">Todavía no hay ninguna.</p>
          ) : (
            excepciones.map(([id]) => (
              <Pildora key={id} tono="si" onClick={() => quitarExcepcion(id)} titulo="Tocá para quitarla">
                {INGREDIENTE_POR_ID.get(id)?.nombre ?? id}
                <span aria-hidden className="opacity-40">✕</span>
              </Pildora>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-crema px-4 py-3">
          <span aria-hidden className="text-tinta-suave">＋</span>
          <input
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Sumar una reintroducción…"
            className="w-full bg-transparent text-base outline-none placeholder:text-tinta-suave"
            aria-label="Buscar alimento para agregar como excepción"
          />
        </div>

        {consulta.trim() && (
          <div className="mt-3 flex flex-wrap gap-2">
            {candidatos.length === 0 ? (
              <p className="text-sm text-tinta-suave">
                No hay nada excluido que coincida con «{consulta}».
              </p>
            ) : (
              candidatos.map((ing) => (
                <Pildora key={ing.id} tono="neutro" onClick={() => agregarExcepcion(ing.id)}>
                  <span aria-hidden>+</span> {ing.nombre}
                </Pildora>
              ))
            )}
          </div>
        )}
      </Tarjeta>

      <Tarjeta className="p-5">
        <h3 className="font-titulo text-xl text-tinta">Notas</h3>
        <p className="mt-0.5 text-sm text-tinta-suave">Lo que dijo la nutricionista, fechas, qué probar después.</p>
        <textarea
          value={perfil.notas}
          onChange={(e) => guardarPerfil({ ...perfil, notas: e.target.value })}
          rows={5}
          className="mt-3 w-full resize-y rounded-2xl bg-crema px-4 py-3 text-base leading-relaxed outline-none focus:ring-2 focus:ring-salvia-200"
          placeholder="Ej: 12/03 reintrodujo huevo, sin reacción."
        />
      </Tarjeta>

      <button
        type="button"
        onClick={() => {
          if (confirm('¿Volver al Protocolo Autoinmune estándar? Se pierden los cambios del perfil.')) {
            restablecerPerfil()
          }
        }}
        className="mx-auto rounded-full px-4 py-2 text-sm text-tinta-suave transition hover:bg-rosa-50 hover:text-rosa-600"
      >
        Restablecer el plan por defecto
      </button>
    </div>
  )
}
