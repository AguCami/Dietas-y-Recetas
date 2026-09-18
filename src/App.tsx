import { useEffect, useState } from 'react'
import { ProveedorDatos } from './estado/datos'
import { useDatos } from './estado/contexto'
import { Inicio } from './pantallas/Inicio'
import { Despensa } from './pantallas/Despensa'
import { Recetas } from './pantallas/Recetas'
import { Receta } from './pantallas/Receta'
import { Perfil } from './pantallas/Perfil'
import { Llama } from './componentes/Llama'

type Vista = 'inicio' | 'despensa' | 'recetas' | 'perfil'

const PESTANAS: { id: Vista; nombre: string; emoji: string }[] = [
  { id: 'inicio', nombre: 'Inicio', emoji: '🏠' },
  { id: 'despensa', nombre: 'Despensa', emoji: '🧺' },
  { id: 'recetas', nombre: 'Recetas', emoji: '🍲' },
  { id: 'perfil', nombre: 'Plan', emoji: '🌿' },
]

function Aplicacion() {
  const { cargando, idsDespensa } = useDatos()
  const [vista, setVista] = useState<Vista>('inicio')
  const [recetaAbierta, setRecetaAbierta] = useState<string | null>(null)

  // Cambiar de pantalla y quedar a mitad de scroll es desorientador.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [vista, recetaAbierta])

  const ir = (v: Vista) => {
    setRecetaAbierta(null)
    setVista(v)
  }

  if (cargando) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Llama pose="pensando" className="h-24 w-24 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-borde/70 bg-crema/85 backdrop-blur">
        {/* En el celular la navegación vive abajo, así que acá arriba sobra
            lugar a la derecha: se centra el título en vez de dejarlo colgado. */}
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-3 px-4 py-3 sm:justify-start">
          <Llama pose="cara" className="h-9 w-9 shrink-0" />
          <div className="text-center sm:flex-1 sm:text-left">
            <h1 className="font-titulo text-lg leading-none text-tinta">Recetas de Llamachef</h1>
            {idsDespensa.size > 0 && (
              <p className="mt-0.5 text-xs text-tinta-suave">{idsDespensa.size} en la despensa</p>
            )}
          </div>

          {/* En escritorio hay lugar para la navegación arriba. */}
          <nav className="hidden gap-1 sm:flex">
            {PESTANAS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => ir(p.id)}
                aria-current={vista === p.id ? 'page' : undefined}
                className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                  vista === p.id ? 'bg-salvia-100 text-salvia-700' : 'text-tinta-suave hover:bg-papel'
                }`}
              >
                {p.nombre}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-5 pb-28 sm:pb-10">
        {recetaAbierta ? (
          <Receta id={recetaAbierta} onVolver={() => setRecetaAbierta(null)} />
        ) : vista === 'inicio' ? (
          <Inicio
            onAbrir={setRecetaAbierta}
            onIrADespensa={() => ir('despensa')}
            onVerTodas={() => ir('recetas')}
          />
        ) : vista === 'despensa' ? (
          <Despensa />
        ) : vista === 'recetas' ? (
          <Recetas onAbrir={setRecetaAbierta} />
        ) : (
          <Perfil />
        )}
      </main>

      {/* En el celular, la navegación va al alcance del pulgar. */}
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-borde bg-papel/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-2xl">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => ir(p.id)}
              aria-current={vista === p.id && !recetaAbierta ? 'page' : undefined}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold transition ${
                vista === p.id && !recetaAbierta ? 'text-salvia-600' : 'text-tinta-suave'
              }`}
            >
              <span aria-hidden className="text-xl leading-none">{p.emoji}</span>
              {p.nombre}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <ProveedorDatos>
      <Aplicacion />
    </ProveedorDatos>
  )
}
