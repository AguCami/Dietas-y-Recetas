import { useEffect, useMemo, useState } from 'react'
import { RECETAS } from '../datos/recetas'
import { evaluarRecetario } from '../dominio/match'
import type { RecetaEvaluada } from '../dominio/match'
import { franjaActual } from '../dominio/horario'
import type { Momento } from '../dominio/tipos'
import { useDatos } from '../estado/contexto'
import { Llama } from '../componentes/Llama'
import type { Pose } from '../componentes/Llama'
import { BarraCobertura, SelloAptitud, Tarjeta } from '../componentes/ui'
import { Portada } from '../componentes/Portada'

/** Cómo se llama la mascota. Una línea para cambiarlo. */
const NOMBRE_MASCOTA = 'Llamachef'

/** A la tarde y de trasnoche vale mirar también los dulces y los snacks. */
const RELACIONADOS: Record<Momento, Momento[]> = {
  desayuno: ['desayuno'],
  almuerzo: ['almuerzo'],
  merienda: ['merienda', 'dulce', 'snack'],
  cena: ['cena'],
  snack: ['snack', 'dulce'],
  dulce: ['dulce', 'merienda'],
  basico: ['basico'],
}

export function Inicio({
  onAbrir,
  onIrADespensa,
  onVerTodas,
}: {
  onAbrir: (id: string) => void
  onIrADespensa: () => void
  onVerTodas: () => void
}) {
  const { idsDespensa, perfil } = useDatos()

  // El reloj avanza: si entra a las 14:58 y se queda mirando, a las 15 la
  // sugerencia cambia sola de almuerzo a merienda.
  const [ahora, setAhora] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const franja = useMemo(() => franjaActual(ahora), [ahora])

  const sugeridas = useMemo(() => {
    const momentos = RELACIONADOS[franja.momento]
    return evaluarRecetario(RECETAS, idsDespensa, perfil)
      .filter((ev) => ev.receta.momentos.some((m) => momentos.includes(m)) && ev.aptitud !== 'no-apta')
      .slice(0, 3)
  }, [franja, idsDespensa, perfil])

  const listas = sugeridas.filter((s) => s.cobertura === 1)
  const despensaVacia = idsDespensa.size === 0

  // Cada situación tiene su pose: saluda si no sabe nada, festeja si podés
  // cocinar ya, explica si falta poco, y se confunde si no encontró nada.
  const pose: Pose = despensaVacia
    ? 'saludo'
    : listas.length > 0
      ? 'feliz'
      : sugeridas.length > 0
        ? 'hablando'
        : 'confundida'

  const mensaje = despensaVacia
    ? 'Todavía no sé qué hay en casa. Contame qué tenemos y te digo qué cocinar.'
    : listas.length > 0
      ? `Con lo que hay en casa podés hacer ${listas.length === 1 ? 'una receta entera' : `${listas.length} recetas`} sin salir a comprar.`
      : sugeridas.length > 0
        ? 'No tenés todo para estas, pero mirá qué poquito falta.'
        : 'No encuentro nada en el recetario para este rato. Probá mirando todas las recetas.'

  return (
    <div className="flex flex-col gap-5">
      <Tarjeta className="overflow-hidden">
        {/* En el celular van apilados: si comparten el ancho, la llama queda
            chiquita y el texto se parte en cinco renglones. Desde `sm` hay
            lugar de sobra y vuelven a ir lado a lado. */}
        <div className="flex flex-col items-start gap-2 bg-gradient-to-b from-lila-100/60 to-transparent px-5 pt-5 sm:flex-row sm:items-end sm:gap-1">
          <Llama
            pose={pose}
            interactiva
            className="h-44 w-32 shrink-0 self-center drop-shadow-sm sm:h-32 sm:w-24 sm:self-auto"
          />
          {/* La esquina recta apunta a la llama: arriba cuando está apilado,
              abajo a la izquierda cuando está al lado. */}
          <div className="relative mb-4 w-full rounded-2xl rounded-tl-sm border border-borde bg-papel px-4 py-3 sm:mb-6 sm:w-auto sm:flex-1 sm:rounded-tl-2xl sm:rounded-bl-sm">
            <p className="text-xs font-bold tracking-wide text-tinta-suave uppercase">
              {NOMBRE_MASCOTA}
            </p>
            <p className="mt-1 text-[15px] leading-snug text-tinta">{mensaje}</p>
          </div>
        </div>

        {despensaVacia && (
          <div className="px-5 pb-5">
            <button
              type="button"
              onClick={onIrADespensa}
              className="w-full rounded-2xl bg-salvia-400 px-4 py-3 font-bold text-white transition hover:bg-salvia-600 active:scale-[0.99]"
            >
              Cargar la despensa
            </button>
          </div>
        )}
      </Tarjeta>

      {sugeridas.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="font-titulo text-2xl text-tinta">
              Para {franja.articulo} {franja.nombre}
            </h2>
            <button
              type="button"
              onClick={onVerTodas}
              className="text-sm font-bold text-salvia-600 hover:underline"
            >
              Ver todas
            </button>
          </div>

          {sugeridas.map((ev) => (
            <Sugerencia key={ev.receta.id} ev={ev} onAbrir={() => onAbrir(ev.receta.id)} />
          ))}
        </section>
      )}
    </div>
  )
}

function Sugerencia({ ev, onAbrir }: { ev: RecetaEvaluada; onAbrir: () => void }) {
  const requeridos = ev.receta.ingredientes.filter((i) => !i.opcional).length
  const faltan = ev.faltan.filter((f) => !f.pedido.opcional).length

  return (
    <Tarjeta>
      <button type="button" onClick={onAbrir} className="w-full p-4 text-left">
        <div className="flex items-start gap-3">
          <Portada receta={ev.receta} className="h-16 w-16 shrink-0 rounded-2xl" tamanoEmoji="text-2xl" />
          <div className="min-w-0 flex-1">
            <h3 className="font-titulo text-xl leading-tight text-tinta">{ev.receta.nombre}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-tinta-suave">{ev.receta.descripcion}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-tinta-suave">
              {ev.aptitud !== 'apta' && <SelloAptitud aptitud={ev.aptitud} />}
              <span>⏱ {ev.receta.minutos} min · 🍽 {ev.receta.porciones} porciones</span>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <BarraCobertura valor={ev.cobertura} />
        </div>
        <p className="mt-2 text-sm">
          {faltan === 0 ? (
            <span className="font-bold text-salvia-600">Tenés todo lo que hace falta ✨</span>
          ) : (
            <span className="text-tinta-suave">
              Te faltan {faltan} de {requeridos}: {ev.faltan.filter((f) => !f.pedido.opcional).slice(0, 3).map((f) => f.nombre).join(', ')}
            </span>
          )}
        </p>
      </button>
    </Tarjeta>
  )
}
