import { INGREDIENTE_POR_ID } from '../datos/ingredientes'
import { SUSTITUCIONES } from '../datos/sustituciones'
import { evaluar } from './perfil'
import type { IngredienteDeReceta, Perfil, Receta } from './tipos'

/** Cómo queda un ingrediente de la receta frente a la despensa y al perfil. */
export interface IngredienteEvaluado {
  pedido: IngredienteDeReceta
  nombre: string
  /** Lo tenés en casa (el original o alguna alternativa válida). */
  disponible: boolean
  /** Si lo cubrís con un reemplazo, cuál. */
  cubiertoCon?: string
  /** Reemplazos que además tenés en casa. */
  alternativasEnCasa: string[]
  /** Reemplazos válidos según el perfil, los tengas o no. */
  alternativasSugeridas: string[]
  /** El ingrediente original entra en el protocolo. */
  permitido: boolean
  /** Si no entra, por qué grupo. */
  motivoExclusion?: string
}

export type AptitudReceta = 'apta' | 'adaptable' | 'no-apta'

export interface RecetaEvaluada {
  receta: Receta
  ingredientes: IngredienteEvaluado[]
  tenes: IngredienteEvaluado[]
  faltan: IngredienteEvaluado[]
  /** 0 a 1, sobre los ingredientes no opcionales. */
  cobertura: number
  aptitud: AptitudReceta
  /** Ingredientes fuera de protocolo que no tienen reemplazo válido. */
  bloqueantes: IngredienteEvaluado[]
  /** Ingredientes fuera de protocolo pero salvables con un reemplazo. */
  aReemplazar: IngredienteEvaluado[]
}

/** Reemplazos de la receta primero (conocen el contexto), después los genéricos. */
function candidatos(pedido: IngredienteDeReceta): string[] {
  const propias = pedido.alternativas ?? []
  const genericas = SUSTITUCIONES[pedido.id] ?? []
  return [...new Set([...propias, ...genericas])]
}

function evaluarIngrediente(
  pedido: IngredienteDeReceta,
  despensa: Set<string>,
  perfil: Perfil,
): IngredienteEvaluado {
  const veredicto = evaluar(pedido.id, perfil)
  const permitido = veredicto.estado === 'permitido'

  const opciones = candidatos(pedido)
  const sugeridas = opciones.filter((id) => evaluar(id, perfil).estado === 'permitido')
  const enCasa = sugeridas.filter((id) => despensa.has(id))

  // El original solo cuenta como disponible si además está permitido: no tiene
  // sentido decir "lo tenés" de algo que igual no puede comer.
  const tieneOriginal = despensa.has(pedido.id) && permitido
  const disponible = tieneOriginal || enCasa.length > 0

  return {
    pedido,
    nombre: INGREDIENTE_POR_ID.get(pedido.id)?.nombre ?? pedido.id,
    disponible,
    cubiertoCon: !tieneOriginal && enCasa.length > 0 ? enCasa[0] : undefined,
    alternativasEnCasa: enCasa,
    alternativasSugeridas: sugeridas,
    permitido,
    motivoExclusion: veredicto.motivo,
  }
}

export function evaluarReceta(receta: Receta, despensa: Set<string>, perfil: Perfil): RecetaEvaluada {
  const ingredientes = receta.ingredientes.map((p) => evaluarIngrediente(p, despensa, perfil))
  const requeridos = ingredientes.filter((i) => !i.pedido.opcional)

  const problematicos = requeridos.filter((i) => !i.permitido)
  const aReemplazar = problematicos.filter((i) => i.alternativasSugeridas.length > 0)
  const bloqueantes = problematicos.filter((i) => i.alternativasSugeridas.length === 0)

  const aptitud: AptitudReceta =
    bloqueantes.length > 0 ? 'no-apta' : aReemplazar.length > 0 ? 'adaptable' : 'apta'

  const cubiertos = requeridos.filter((i) => i.disponible).length
  const cobertura = requeridos.length === 0 ? 1 : cubiertos / requeridos.length

  return {
    receta,
    ingredientes,
    tenes: ingredientes.filter((i) => i.disponible),
    faltan: ingredientes.filter((i) => !i.disponible),
    cobertura,
    aptitud,
    bloqueantes,
    aReemplazar,
  }
}

const ORDEN_APTITUD: Record<AptitudReceta, number> = { apta: 0, adaptable: 1, 'no-apta': 2 }

/**
 * Evalúa todo el recetario y lo ordena por "qué tan cerca estás de cocinarlo".
 * No filtra nada: mostramos todas las recetas, con lo que tenés y lo que falta.
 */
export function evaluarRecetario(
  recetas: Receta[],
  despensa: Set<string>,
  perfil: Perfil,
): RecetaEvaluada[] {
  return recetas
    .map((r) => evaluarReceta(r, despensa, perfil))
    .sort(
      (a, b) =>
        ORDEN_APTITUD[a.aptitud] - ORDEN_APTITUD[b.aptitud] ||
        b.cobertura - a.cobertura ||
        a.receta.nombre.localeCompare(b.receta.nombre, 'es'),
    )
}

/** Lo que habría que comprar para cerrar una lista de recetas. */
export function listaDeCompras(evaluadas: RecetaEvaluada[]): { id: string; nombre: string; para: string[] }[] {
  const mapa = new Map<string, { id: string; nombre: string; para: string[] }>()
  for (const ev of evaluadas) {
    for (const falta of ev.faltan) {
      if (falta.pedido.opcional) continue
      const actual = mapa.get(falta.pedido.id)
      if (actual) actual.para.push(ev.receta.nombre)
      else mapa.set(falta.pedido.id, { id: falta.pedido.id, nombre: falta.nombre, para: [ev.receta.nombre] })
    }
  }
  return [...mapa.values()].sort((a, b) => b.para.length - a.para.length)
}
