/**
 * Chequeo de integridad del recetario.
 *
 * Los datos se editan a mano, y un id mal escrito no rompe nada visible:
 * simplemente el ingrediente deja de cruzar con la despensa y la receta
 * queda mal para siempre. Este script lo detecta antes del commit.
 *
 *   npm run validar
 */
import { INGREDIENTES, INGREDIENTE_POR_ID } from '../src/datos/ingredientes'
import { RECETAS } from '../src/datos/recetas'
import { SUSTITUCIONES } from '../src/datos/sustituciones'
import { PERFIL_BASE } from '../src/datos/perfilBase'
import { evaluarReceta } from '../src/dominio/match'

const errores: string[] = []
const avisos: string[] = []

// 1. Ids de ingredientes únicos
const vistos = new Set<string>()
for (const i of INGREDIENTES) {
  if (vistos.has(i.id)) errores.push(`Ingrediente duplicado: "${i.id}"`)
  vistos.add(i.id)
}

// 2. Todo lo que menciona una receta tiene que existir en el catálogo
for (const receta of RECETAS) {
  for (const ing of receta.ingredientes) {
    if (!INGREDIENTE_POR_ID.has(ing.id)) {
      errores.push(`[${receta.id}] ingrediente inexistente: "${ing.id}"`)
    }
    for (const alt of ing.alternativas ?? []) {
      if (!INGREDIENTE_POR_ID.has(alt)) {
        errores.push(`[${receta.id}] alternativa inexistente para "${ing.id}": "${alt}"`)
      }
      if (alt === ing.id) {
        errores.push(`[${receta.id}] "${ing.id}" se lista como alternativa de sí mismo`)
      }
    }
  }
  if (receta.ingredientes.length === 0) errores.push(`[${receta.id}] no tiene ingredientes`)
  if (receta.pasos.length === 0) errores.push(`[${receta.id}] no tiene pasos`)
}

// 3. Ids de recetas únicos
const idsReceta = new Set<string>()
for (const r of RECETAS) {
  if (idsReceta.has(r.id)) errores.push(`Receta duplicada: "${r.id}"`)
  idsReceta.add(r.id)
}

// 4. La tabla de sustituciones también apunta a ingredientes reales
for (const [id, alts] of Object.entries(SUSTITUCIONES)) {
  if (!INGREDIENTE_POR_ID.has(id)) errores.push(`SUSTITUCIONES: ingrediente inexistente "${id}"`)
  for (const alt of alts) {
    if (!INGREDIENTE_POR_ID.has(alt)) errores.push(`SUSTITUCIONES["${id}"]: alternativa inexistente "${alt}"`)
  }
}

// 5. Toda receta del recetario base debe ser apta para el perfil base.
//    Si alguna no lo es, o está mal cargada o el perfil cambió.
const despensaVacia = new Set<string>()
for (const receta of RECETAS) {
  const ev = evaluarReceta(receta, despensaVacia, PERFIL_BASE)
  if (ev.aptitud === 'no-apta') {
    errores.push(
      `[${receta.id}] no es apta para el perfil base por: ${ev.bloqueantes.map((b) => b.nombre).join(', ')}`,
    )
  } else if (ev.aptitud === 'adaptable') {
    avisos.push(`[${receta.id}] necesita reemplazo en: ${ev.aReemplazar.map((b) => b.nombre).join(', ')}`)
  }
}

// 6. Ingredientes del catálogo que ninguna receta usa (no es un error, es info)
const usados = new Set(RECETAS.flatMap((r) => r.ingredientes.map((i) => i.id)))
const sinUsar = INGREDIENTES.filter((i) => !usados.has(i.id)).length

console.log(`Ingredientes: ${INGREDIENTES.length}  |  Recetas: ${RECETAS.length}`)
console.log(`Ingredientes sin usar en ninguna receta: ${sinUsar}`)
if (avisos.length) {
  console.log(`\n${avisos.length} aviso(s):`)
  for (const a of avisos) console.log('  - ' + a)
}
if (errores.length) {
  console.error(`\n✖ ${errores.length} error(es):`)
  for (const e of errores) console.error('  - ' + e)
  process.exit(1)
}
console.log('\n✔ Todo consistente.')
