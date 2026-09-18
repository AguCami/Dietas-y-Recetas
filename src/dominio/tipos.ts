/**
 * Tipos del dominio.
 *
 * La idea central: NO hardcodeamos "la dieta PAI". Cada ingrediente lleva
 * etiquetas (`Etiqueta`) y el perfil decide qué etiquetas se excluyen y qué
 * excepciones puntuales hay. Así, cuando Cami reintroduce un alimento, se
 * toca el perfil desde la app y no hace falta tocar el código.
 */

/** Grupos de alimentos que un protocolo puede excluir en bloque. */
export type Etiqueta =
  | 'solanacea'
  | 'cereal'
  | 'pseudocereal'
  | 'legumbre'
  | 'lacteo'
  | 'huevo'
  | 'fruto_seco'
  | 'semilla'
  | 'especia_semilla'
  | 'azucar_refinada'
  | 'edulcorante_artificial'
  | 'alcohol'
  | 'cafe'
  | 'cacao'
  | 'aditivo'

export const ETIQUETAS: { id: Etiqueta; nombre: string; ejemplo: string }[] = [
  { id: 'solanacea', nombre: 'Solanáceas', ejemplo: 'tomate, papa, morrón, berenjena, ají' },
  { id: 'cereal', nombre: 'Cereales', ejemplo: 'trigo, arroz, maíz, avena' },
  { id: 'pseudocereal', nombre: 'Pseudocereales', ejemplo: 'quinoa, amaranto, trigo sarraceno' },
  { id: 'legumbre', nombre: 'Legumbres', ejemplo: 'lentejas, garbanzos, soja, maní' },
  { id: 'lacteo', nombre: 'Lácteos', ejemplo: 'leche, queso, yogur, manteca' },
  { id: 'huevo', nombre: 'Huevo', ejemplo: 'huevo entero, clara, yema' },
  { id: 'fruto_seco', nombre: 'Frutos secos', ejemplo: 'almendra, nuez, castaña de cajú' },
  { id: 'semilla', nombre: 'Semillas', ejemplo: 'chía, lino, girasol, sésamo' },
  { id: 'especia_semilla', nombre: 'Especias de semilla', ejemplo: 'pimienta, comino, mostaza, cilantro en grano' },
  { id: 'azucar_refinada', nombre: 'Azúcar refinada', ejemplo: 'azúcar blanca, jarabes' },
  { id: 'edulcorante_artificial', nombre: 'Edulcorantes artificiales', ejemplo: 'sucralosa, aspartamo' },
  { id: 'alcohol', nombre: 'Alcohol', ejemplo: 'vino, cerveza' },
  { id: 'cafe', nombre: 'Café', ejemplo: 'café, café descafeinado' },
  { id: 'cacao', nombre: 'Cacao', ejemplo: 'cacao, chocolate' },
  { id: 'aditivo', nombre: 'Aditivos', ejemplo: 'gomas, emulsionantes, conservantes' },
]

/** Categorías para agrupar en la UI (heladera, alacena, etc.). */
export type Categoria =
  | 'verdura'
  | 'fruta'
  | 'carne'
  | 'pescado'
  | 'grasa'
  | 'hierba'
  | 'condimento'
  | 'harina'
  | 'fermento'
  | 'endulzante'
  | 'liquido'
  | 'otro'

export const CATEGORIAS: { id: Categoria; nombre: string; emoji: string }[] = [
  { id: 'verdura', nombre: 'Verduras', emoji: '🥬' },
  { id: 'fruta', nombre: 'Frutas', emoji: '🍐' },
  { id: 'carne', nombre: 'Carnes', emoji: '🍗' },
  { id: 'pescado', nombre: 'Pescados y mariscos', emoji: '🐟' },
  { id: 'grasa', nombre: 'Grasas y aceites', emoji: '🫒' },
  { id: 'hierba', nombre: 'Hierbas', emoji: '🌿' },
  { id: 'condimento', nombre: 'Condimentos', emoji: '🧂' },
  { id: 'harina', nombre: 'Harinas y almidones', emoji: '🥣' },
  { id: 'fermento', nombre: 'Fermentados', emoji: '🫙' },
  { id: 'endulzante', nombre: 'Endulzantes', emoji: '🍯' },
  { id: 'liquido', nombre: 'Líquidos y caldos', emoji: '🥥' },
  { id: 'otro', nombre: 'Otros', emoji: '🧺' },
]

export interface Ingrediente {
  id: string
  nombre: string
  categoria: Categoria
  etiquetas: Etiqueta[]
  /** Nombres alternativos, para que el buscador entienda cómo le decimos acá. */
  alias?: string[]
}

export type Estado = 'permitido' | 'excluido'

export interface Perfil {
  nombre: string
  /** Estado por grupo de alimento. */
  reglas: Record<Etiqueta, Estado>
  /**
   * Excepciones puntuales, que ganan por encima de las reglas.
   * Es lo que permite decir "el grupo huevo está excluido, pero el huevo sí".
   */
  excepciones: Record<string, Estado>
  /** Notas libres: qué dijo la nutricionista, fecha de la última revisión, etc. */
  notas: string
}

export type Momento = 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack' | 'dulce' | 'basico'

export const MOMENTOS: { id: Momento; nombre: string; emoji: string }[] = [
  { id: 'desayuno', nombre: 'Desayuno', emoji: '🌅' },
  { id: 'almuerzo', nombre: 'Almuerzo', emoji: '☀️' },
  { id: 'merienda', nombre: 'Merienda', emoji: '🫖' },
  { id: 'cena', nombre: 'Cena', emoji: '🌙' },
  { id: 'snack', nombre: 'Snack', emoji: '🥕' },
  { id: 'dulce', nombre: 'Dulce', emoji: '🍮' },
  { id: 'basico', nombre: 'Básicos', emoji: '🧱' },
]

export interface IngredienteDeReceta {
  id: string
  cantidad: string
  /** Si es opcional, no penaliza el match cuando no lo tenés. */
  opcional?: boolean
  /** "bien madura", "sin piel", etc. */
  nota?: string
  /**
   * Reemplazos válidos para ESTA receta, en orden de preferencia.
   * Si tenés alguno de estos, el ingrediente cuenta como cubierto.
   * Para equivalencias genéricas (que sirven en cualquier receta) está
   * la tabla `SUSTITUCIONES` en datos/sustituciones.ts.
   */
  alternativas?: string[]
}

export interface Receta {
  id: string
  nombre: string
  /** Ícono de la portada cuando no hay foto subida. */
  emoji: string
  descripcion: string
  momentos: Momento[]
  porciones: number
  minutos: number
  ingredientes: IngredienteDeReceta[]
  pasos: string[]
  nota?: string
}

/** Un ítem de la despensa: qué hay en casa. */
export interface ItemDespensa {
  id: string
  /** Opcional y libre a propósito: "medio atado", "2 latas". */
  cantidad?: string
  agregadoEn: string
}
