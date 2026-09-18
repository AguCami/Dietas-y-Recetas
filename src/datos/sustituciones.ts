/**
 * Equivalencias genéricas: si no conseguís X, en general sirve Y.
 *
 * Aplican a cualquier receta. Las recetas pueden además declarar sus propias
 * `alternativas`, que tienen prioridad porque conocen el contexto
 * (no es lo mismo reemplazar zapallo en un puré que en una tarta).
 */
export const SUSTITUCIONES: Record<string, string[]> = {
  // Almidones y guarniciones
  batata: ['mandioca', 'zapallo', 'platano-verde', 'nabo'],
  mandioca: ['batata', 'zapallo', 'platano-verde'],
  zapallo: ['batata', 'zanahoria', 'mandioca'],
  'platano-verde': ['mandioca', 'batata'],
  nabo: ['rabanito', 'coliflor', 'mandioca'],
  coliflor: ['brocoli', 'repollo', 'nabo'],
  brocoli: ['coliflor', 'repollitos-bruselas', 'chaucha'],

  // Hojas verdes: entre ellas son casi siempre intercambiables
  espinaca: ['acelga', 'kale', 'rucula'],
  acelga: ['espinaca', 'kale'],
  kale: ['espinaca', 'acelga', 'repollo'],
  rucula: ['berro', 'radicheta', 'espinaca'],
  lechuga: ['rucula', 'radicheta', 'berro'],

  // Grasas
  'aceite-oliva': ['aceite-palta', 'aceite-coco', 'grasa-cerdo'],
  'aceite-coco': ['aceite-oliva', 'grasa-cerdo', 'grasa-pato'],
  'aceite-palta': ['aceite-oliva', 'aceite-coco'],
  'grasa-cerdo': ['grasa-pato', 'aceite-coco', 'aceite-oliva'],

  // Líquidos
  'leche-coco': ['crema-coco', 'caldo-huesos'],
  'crema-coco': ['leche-coco'],
  'caldo-huesos': ['caldo-verduras', 'agua'],
  'caldo-verduras': ['caldo-huesos', 'agua'],

  // Harinas (no son intercambiables 1:1, ver nota en cada receta)
  'harina-mandioca': ['almidon-mandioca', 'harina-platano'],
  'almidon-mandioca': ['harina-mandioca'],
  'harina-coco': ['harina-castanas'],
  'harina-sarraceno': ['harina-mandioca', 'harina-platano'],

  // Ácidos
  'vinagre-manzana': ['vinagre-coco', 'limon', 'lima'],
  'vinagre-coco': ['vinagre-manzana', 'limon'],
  limon: ['lima', 'vinagre-manzana'],
  lima: ['limon'],

  // Proteínas
  'pechuga-pollo': ['muslo-pollo', 'pavo'],
  'muslo-pollo': ['pechuga-pollo', 'pollo'],
  salmon: ['trucha', 'caballa', 'merluza'],
  merluza: ['trucha', 'salmon'],
  'carne-picada': ['carne-vacuna', 'cordero', 'cerdo'],

  // Aromáticos
  albahaca: ['perejil', 'oregano'],
  perejil: ['cilantro', 'ciboulette', 'albahaca'],
  'cebolla-verdeo': ['ciboulette', 'puerro', 'cebolla'],
  puerro: ['cebolla', 'cebolla-verdeo'],
  cebolla: ['puerro', 'cebolla-verdeo'],
  romero: ['tomillo', 'salvia'],
  tomillo: ['romero', 'oregano'],

  // Dulces
  miel: ['jarabe-arce', 'datil'],
  'jarabe-arce': ['miel'],
  datil: ['higo', 'miel'],
  'coco-rallado': ['harina-coco'],

  // Frutas
  frutilla: ['frambuesa', 'arandano', 'mora'],
  arandano: ['frutilla', 'frambuesa', 'mora'],
  manzana: ['pera'],
  pera: ['manzana'],
  banana: ['platano-verde'],
}
