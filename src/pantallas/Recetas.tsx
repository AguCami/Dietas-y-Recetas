import { useMemo, useState } from 'react'
import { RECETAS } from '../datos/recetas'
import { evaluarRecetario } from '../dominio/match'
import type { RecetaEvaluada } from '../dominio/match'
import { MOMENTOS } from '../dominio/tipos'
import type { Momento } from '../dominio/tipos'
import { nombreEnFrase } from '../datos/ingredientes'
import { coincide } from '../dominio/texto'
import { useDatos } from '../estado/contexto'
import { BarraCobertura, Pildora, SelloAptitud, Tarjeta, Vacio } from '../componentes/ui'
import { Portada } from '../componentes/Portada'

export function Recetas({ onAbrir }: { onAbrir: (id: string) => void }) {
  const { idsDespensa, perfil, favoritos, alternarFavorito } = useDatos()
  const [momento, setMomento] = useState<Momento | 'todos'>('todos')
  const [soloListas, setSoloListas] = useState(false)
  const [soloFavoritas, setSoloFavoritas] = useState(false)
  const [consulta, setConsulta] = useState('')

  const evaluadas = useMemo(
    () => evaluarRecetario(RECETAS, idsDespensa, perfil),
    [idsDespensa, perfil],
  )

  const visibles = useMemo(
    () =>
      evaluadas.filter((ev) => {
        if (momento !== 'todos' && !ev.receta.momentos.includes(momento)) return false
        // "Puedo hacerla ya": tengo todo y además entra en el protocolo.
        if (soloListas && (ev.cobertura < 1 || ev.aptitud === 'no-apta')) return false
        if (soloFavoritas && !favoritos.includes(ev.receta.id)) return false
        if (consulta && !coincide(consulta, ev.receta.nombre, ev.receta.descripcion)) return false
        return true
      }),
    [evaluadas, momento, soloListas, soloFavoritas, favoritos, consulta],
  )

  const listas = evaluadas.filter((e) => e.cobertura === 1 && e.aptitud !== 'no-apta').length

  return (
    <div className="flex flex-col gap-5">
      <header className="px-1">
        <h2 className="font-titulo text-3xl text-tinta">Qué cocinamos</h2>
        <p className="mt-1 text-sm text-tinta-suave">
          {idsDespensa.size === 0
            ? 'Cargá la despensa y estas recetas se van a ordenar según lo que tengas.'
            : listas > 0
              ? `Con lo que hay en casa podés hacer ${listas} ${listas === 1 ? 'receta' : 'recetas'} sin comprar nada.`
              : 'Todavía no hay ninguna receta completa, pero mirá cuánto falta para la primera.'}
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-borde bg-papel px-4 py-2.5">
          <span aria-hidden className="text-tinta-suave">🔍</span>
          <input
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            placeholder="Buscar receta"
            className="w-full bg-transparent text-base outline-none placeholder:text-tinta-suave"
            aria-label="Buscar receta"
          />
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Pildora tono={momento === 'todos' ? 'lila' : 'neutro'} onClick={() => setMomento('todos')}>
            Todas
          </Pildora>
          {MOMENTOS.map((m) => (
            <Pildora
              key={m.id}
              tono={momento === m.id ? 'lila' : 'neutro'}
              onClick={() => setMomento(momento === m.id ? 'todos' : m.id)}
            >
              <span aria-hidden>{m.emoji}</span>
              <span className="whitespace-nowrap">{m.nombre}</span>
            </Pildora>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Pildora tono={soloListas ? 'si' : 'neutro'} onClick={() => setSoloListas((v) => !v)}>
            {soloListas ? '✓' : '○'} Solo las que puedo hacer ya
          </Pildora>
          <Pildora tono={soloFavoritas ? 'cambio' : 'neutro'} onClick={() => setSoloFavoritas((v) => !v)}>
            {soloFavoritas ? '★' : '☆'} Favoritas
          </Pildora>
        </div>
      </div>

      {visibles.length === 0 ? (
        <Tarjeta>
          <Vacio
            emoji="🍳"
            titulo="No hay recetas con esos filtros"
            texto="Probá quitando algún filtro, o sumá ingredientes a la despensa."
          />
        </Tarjeta>
      ) : (
        <div className="flex flex-col gap-3">
          {visibles.map((ev) => (
            <TarjetaReceta
              key={ev.receta.id}
              ev={ev}
              esFavorita={favoritos.includes(ev.receta.id)}
              onFavorita={() => alternarFavorito(ev.receta.id)}
              onAbrir={() => onAbrir(ev.receta.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TarjetaReceta({
  ev,
  esFavorita,
  onFavorita,
  onAbrir,
}: {
  ev: RecetaEvaluada
  esFavorita: boolean
  onFavorita: () => void
  onAbrir: () => void
}) {
  const requeridos = ev.receta.ingredientes.filter((i) => !i.opcional).length
  const tenes = Math.round(ev.cobertura * requeridos)
  const faltanRequeridos = ev.faltan.filter((f) => !f.pedido.opcional)

  return (
    <Tarjeta className="overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <button type="button" onClick={onAbrir} className="flex flex-1 items-start gap-3 text-left">
          <Portada receta={ev.receta} className="h-16 w-16 shrink-0 rounded-2xl" tamanoEmoji="text-2xl" />
          <span className="min-w-0 flex-1">
            <h3 className="font-titulo text-xl leading-tight text-tinta">{ev.receta.nombre}</h3>
            {/* La descripción se corta en dos renglones: si no, con la
                miniatura al lado las tarjetas se vuelven larguísimas. */}
            <span className="mt-1 line-clamp-2 text-sm text-tinta-suave">{ev.receta.descripcion}</span>
            {/* El sello va acá abajo y no al lado del título: ahí obligaba al
                nombre a partirse en dos renglones. */}
            <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-tinta-suave">
              {ev.aptitud !== 'apta' && <SelloAptitud aptitud={ev.aptitud} />}
              <span>⏱ {ev.receta.minutos} min · 🍽 {ev.receta.porciones} porciones</span>
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={onFavorita}
          aria-pressed={esFavorita}
          aria-label={esFavorita ? 'Quitar de favoritas' : 'Guardar en favoritas'}
          className="rounded-full p-2 text-xl leading-none transition hover:bg-crema"
        >
          <span aria-hidden>{esFavorita ? '★' : '☆'}</span>
        </button>
      </div>

      <button type="button" onClick={onAbrir} className="block w-full px-4 pb-4 text-left">
        <div className="flex items-center justify-between gap-3 text-xs text-tinta-suave">
          <span>
            Tenés <strong className="text-tinta">{tenes}</strong> de {requeridos} ingredientes
          </span>
          {ev.cobertura === 1 && ev.aptitud !== 'no-apta' && (
            <span className="font-bold text-salvia-600">¡Se puede hacer ya!</span>
          )}
        </div>
        <div className="mt-2">
          <BarraCobertura valor={ev.cobertura} />
        </div>

        {faltanRequeridos.length > 0 && (
          <p className="mt-3 text-sm text-tinta-suave">
            <span className="font-bold text-tinta">Falta:</span>{' '}
            {faltanRequeridos
              .slice(0, 5)
              .map((f) => f.nombre)
              .join(', ')}
            {faltanRequeridos.length > 5 && ` y ${faltanRequeridos.length - 5} más`}
          </p>
        )}

        {ev.aReemplazar.length > 0 && (
          <p className="mt-2 rounded-xl bg-durazno-50 px-3 py-2 text-sm text-durazno-600">
            Cambiá {ev.aReemplazar.map((r) => nombreEnFrase(r.pedido.id)).join(', ')} por{' '}
            {ev.aReemplazar.map((r) => nombreEnFrase(r.alternativasSugeridas[0])).join(', ')}.
          </p>
        )}

        {ev.bloqueantes.length > 0 && (
          <p className="mt-2 rounded-xl bg-rosa-50 px-3 py-2 text-sm text-rosa-600">
            Fuera del protocolo: {ev.bloqueantes.map((b) => b.nombre).join(', ')}.
          </p>
        )}
      </button>
    </Tarjeta>
  )
}
