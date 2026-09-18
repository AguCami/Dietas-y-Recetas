import { useMemo } from 'react'
import { RECETA_POR_ID } from '../datos/recetas'
import { nombreEnFrase } from '../datos/ingredientes'
import { evaluarReceta } from '../dominio/match'
import type { IngredienteEvaluado } from '../dominio/match'
import { ETIQUETAS } from '../dominio/tipos'
import { useDatos } from '../estado/contexto'
import { Pildora, SelloAptitud, Tarjeta } from '../componentes/ui'

const NOMBRE_ETIQUETA = Object.fromEntries(ETIQUETAS.map((e) => [e.id, e.nombre]))

export function Receta({ id, onVolver }: { id: string; onVolver: () => void }) {
  const { idsDespensa, perfil, favoritos, alternarFavorito, agregarADespensa } = useDatos()
  const receta = RECETA_POR_ID.get(id)

  const ev = useMemo(
    () => (receta ? evaluarReceta(receta, idsDespensa, perfil) : null),
    [receta, idsDespensa, perfil],
  )

  if (!receta || !ev) {
    return (
      <div className="py-10 text-center">
        <p className="text-tinta-suave">No encontré esa receta.</p>
        <button type="button" onClick={onVolver} className="mt-3 font-bold text-salvia-600">
          Volver
        </button>
      </div>
    )
  }

  const esFavorita = favoritos.includes(receta.id)
  const faltantes = ev.faltan.filter((f) => !f.pedido.opcional)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onVolver}
          className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-tinta-suave transition hover:bg-papel"
        >
          <span aria-hidden>←</span> Volver
        </button>
        <button
          type="button"
          onClick={() => alternarFavorito(receta.id)}
          aria-pressed={esFavorita}
          className="rounded-full px-3 py-2 text-sm font-bold text-tinta-suave transition hover:bg-papel"
        >
          {esFavorita ? '★ Guardada' : '☆ Guardar'}
        </button>
      </div>

      <header className="px-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-titulo text-3xl leading-tight text-tinta">{receta.nombre}</h2>
          <SelloAptitud aptitud={ev.aptitud} />
        </div>
        <p className="mt-2 text-tinta-suave">{receta.descripcion}</p>
        <p className="mt-3 text-sm text-tinta-suave">
          ⏱ {receta.minutos} min · 🍽 {receta.porciones} porciones
        </p>
      </header>

      {ev.aReemplazar.length > 0 && (
        <Tarjeta className="border-durazno-100 bg-durazno-50 p-4">
          <h3 className="font-bold text-durazno-600">Hay que cambiar algo</h3>
          <ul className="mt-2 space-y-1 text-sm text-durazno-600">
            {ev.aReemplazar.map((r) => (
              <li key={r.pedido.id}>
                <strong>{r.nombre}</strong> queda fuera del protocolo
                {r.motivoExclusion && ` (${NOMBRE_ETIQUETA[r.motivoExclusion]?.toLowerCase()})`}. Usá{' '}
                {r.alternativasSugeridas.slice(0, 3).map(nombreEnFrase).join(' o ')}.
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}

      {ev.bloqueantes.length > 0 && (
        <Tarjeta className="border-rosa-100 bg-rosa-50 p-4">
          <h3 className="font-bold text-rosa-600">Esta receta no entra en el plan</h3>
          <ul className="mt-2 space-y-1 text-sm text-rosa-600">
            {ev.bloqueantes.map((b) => (
              <li key={b.pedido.id}>
                <strong>{b.nombre}</strong>
                {b.motivoExclusion && ` — ${NOMBRE_ETIQUETA[b.motivoExclusion]?.toLowerCase()}`}, y no tengo
                un reemplazo cargado.
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}

      <Tarjeta className="p-5">
        <h3 className="font-titulo text-xl text-tinta">Ingredientes</h3>
        <p className="mt-0.5 text-sm text-tinta-suave">
          Tenés {ev.tenes.length} de {receta.ingredientes.length}. Tocá lo que falta para sumarlo a la despensa.
        </p>
        <ul className="mt-4 divide-y divide-borde">
          {ev.ingredientes.map((item) => (
            <FilaIngrediente key={item.pedido.id} item={item} onAgregar={() => agregarADespensa(item.pedido.id)} />
          ))}
        </ul>
      </Tarjeta>

      {faltantes.length > 0 && (
        <Tarjeta className="p-5">
          <h3 className="font-titulo text-xl text-tinta">Para comprar</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {faltantes.map((f) => (
              <Pildora key={f.pedido.id} tono="cambio">
                {f.nombre}
                {f.pedido.cantidad && <span className="opacity-70">· {f.pedido.cantidad}</span>}
              </Pildora>
            ))}
          </div>
        </Tarjeta>
      )}

      <Tarjeta className="p-5">
        <h3 className="font-titulo text-xl text-tinta">Preparación</h3>
        <ol className="mt-4 space-y-4">
          {receta.pasos.map((paso, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-salvia-100 text-sm font-bold text-salvia-700">
                {i + 1}
              </span>
              <p className="pt-0.5 leading-relaxed">{paso}</p>
            </li>
          ))}
        </ol>
      </Tarjeta>

      {receta.nota && (
        <Tarjeta className="border-lila-100 bg-lila-100/40 p-4">
          <p className="text-sm text-tinta">
            <strong>Tip:</strong> {receta.nota}
          </p>
        </Tarjeta>
      )}
    </div>
  )
}

function FilaIngrediente({ item, onAgregar }: { item: IngredienteEvaluado; onAgregar: () => void }) {
  const { pedido, disponible, cubiertoCon, alternativasSugeridas } = item

  return (
    <li className="flex items-start gap-3 py-3">
      <span
        aria-hidden
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          disponible ? 'bg-salvia-100 text-salvia-700' : 'bg-crema text-tinta-suave'
        }`}
      >
        {disponible ? '✓' : '○'}
      </span>

      <div className="flex-1">
        <p className={disponible ? 'text-tinta' : 'text-tinta-suave'}>
          <strong className="font-bold">{item.nombre}</strong>
          <span className="text-tinta-suave"> · {pedido.cantidad}</span>
          {pedido.opcional && <span className="ml-1 text-xs text-tinta-suave">(opcional)</span>}
        </p>

        {pedido.nota && <p className="mt-0.5 text-xs text-tinta-suave">{pedido.nota}</p>}

        {cubiertoCon && (
          <p className="mt-1 text-sm text-salvia-600">
            No lo tenés, pero podés usar <strong>{nombreEnFrase(cubiertoCon)}</strong>, que sí está en casa.
          </p>
        )}

        {!disponible && alternativasSugeridas.length > 0 && (
          <p className="mt-1 text-sm text-tinta-suave">
            Si no conseguís: {alternativasSugeridas.slice(0, 3).map(nombreEnFrase).join(', ')}.
          </p>
        )}
      </div>

      {!disponible && (
        <button
          type="button"
          onClick={onAgregar}
          className="shrink-0 rounded-full border border-borde px-3 py-1.5 text-xs font-bold text-tinta-suave transition hover:border-salvia-200 hover:bg-salvia-50 hover:text-salvia-700"
        >
          Lo tengo
        </button>
      )}
    </li>
  )
}
