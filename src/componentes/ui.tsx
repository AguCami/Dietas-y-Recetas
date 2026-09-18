import type { ReactNode } from 'react'
import type { AptitudReceta } from '../dominio/match'

export function Tarjeta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-borde bg-papel shadow-[0_1px_2px_rgba(74,66,60,0.04),0_8px_24px_-12px_rgba(74,66,60,0.12)] ${className}`}
    >
      {children}
    </div>
  )
}

const ESTILO_APTITUD: Record<AptitudReceta, { texto: string; clase: string }> = {
  apta: { texto: 'Apta', clase: 'bg-salvia-100 text-salvia-700' },
  adaptable: { texto: 'Con cambios', clase: 'bg-durazno-100 text-durazno-600' },
  'no-apta': { texto: 'Fuera del plan', clase: 'bg-rosa-100 text-rosa-600' },
}

export function SelloAptitud({ aptitud }: { aptitud: AptitudReceta }) {
  const { texto, clase } = ESTILO_APTITUD[aptitud]
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${clase}`}>{texto}</span>
  )
}

/** Barra de "cuánto de esta receta ya tenés en casa". */
export function BarraCobertura({ valor }: { valor: number }) {
  const porcentaje = Math.round(valor * 100)
  const color = porcentaje === 100 ? 'bg-salvia-400' : porcentaje >= 60 ? 'bg-durazno-300' : 'bg-rosa-300'
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-crema"
      role="progressbar"
      aria-valuenow={porcentaje}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Tenés el ${porcentaje}% de los ingredientes`}
    >
      <div className={`h-full rounded-full transition-[width] duration-500 ${color}`} style={{ width: `${porcentaje}%` }} />
    </div>
  )
}

export function Pildora({
  children,
  tono = 'neutro',
  onClick,
  titulo,
}: {
  children: ReactNode
  tono?: 'neutro' | 'si' | 'no' | 'cambio' | 'lila'
  onClick?: () => void
  titulo?: string
}) {
  const tonos = {
    neutro: 'bg-crema text-tinta-suave border-borde',
    si: 'bg-salvia-50 text-salvia-700 border-salvia-100',
    no: 'bg-rosa-50 text-rosa-600 border-rosa-100',
    cambio: 'bg-durazno-50 text-durazno-600 border-durazno-100',
    lila: 'bg-lila-100 text-lila-600 border-lila-100',
  }
  const clases = `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${tonos[tono]}`
  if (!onClick) return <span className={clases} title={titulo}>{children}</span>
  return (
    <button type="button" onClick={onClick} title={titulo} className={`${clases} transition hover:brightness-97 active:scale-95`}>
      {children}
    </button>
  )
}

export function Vacio({ emoji, titulo, texto }: { emoji: string; titulo: string; texto: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <span className="text-5xl" aria-hidden>{emoji}</span>
      <h3 className="font-titulo text-xl text-tinta">{titulo}</h3>
      <p className="max-w-sm text-sm text-tinta-suave">{texto}</p>
    </div>
  )
}
