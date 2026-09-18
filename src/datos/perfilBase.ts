import type { Perfil } from '../dominio/tipos'

/**
 * Perfil inicial: Protocolo Autoinmune (PAI / AIP) en su fase de eliminación,
 * con las excepciones que Cami ya tiene reintroducidas.
 *
 * ⚠️ Esto es un punto de partida editable, no una indicación médica. La lista
 * real la define su nutricionista. Toda la app lee de acá, así que corregir
 * el perfil en la pantalla "Perfil" alcanza para que cambie qué recetas
 * aparecen como aptas.
 */
export const PERFIL_BASE: Perfil = {
  nombre: 'Protocolo Autoinmune (PAI)',
  reglas: {
    solanacea: 'excluido',
    cereal: 'excluido',
    pseudocereal: 'excluido',
    legumbre: 'excluido',
    lacteo: 'excluido',
    huevo: 'excluido',
    fruto_seco: 'excluido',
    semilla: 'excluido',
    especia_semilla: 'excluido',
    azucar_refinada: 'excluido',
    edulcorante_artificial: 'excluido',
    alcohol: 'excluido',
    cafe: 'excluido',
    cacao: 'excluido',
    aditivo: 'excluido',
  },
  excepciones: {
    // Reintroducidos: el grupo sigue excluido, pero estos puntualmente van.
    huevo: 'permitido',
    'harina-sarraceno': 'permitido',
    'sarraceno-grano': 'permitido',
  },
  notas:
    'Fase de eliminación con huevo y trigo sarraceno ya reintroducidos.\n' +
    'Revisar esta lista con la nutricionista y actualizarla en cada consulta.',
}
