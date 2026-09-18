import type { Categoria, Etiqueta, Ingrediente } from '../dominio/tipos'

/**
 * Catálogo de ingredientes.
 *
 * Incluye a propósito alimentos que hoy están FUERA del protocolo (tomate,
 * arroz, leche...). No es un error: la despensa es la de la casa, no la de
 * la dieta. La app los muestra marcados, y si algún día se reintroducen,
 * se cambia el perfil y las recetas con ese ingrediente aparecen solas.
 */
const ing = (
  id: string,
  nombre: string,
  categoria: Categoria,
  etiquetas: Etiqueta[] = [],
  alias: string[] = [],
): Ingrediente => ({ id, nombre, categoria, etiquetas, alias })

export const INGREDIENTES: Ingrediente[] = [
  // ─── Verduras permitidas ───────────────────────────────────────────────
  ing('batata', 'Batata', 'verdura', [], ['boniato', 'camote']),
  ing('mandioca', 'Mandioca', 'verdura', [], ['yuca', 'casava']),
  ing('zapallo', 'Zapallo', 'verdura', [], ['calabaza', 'anco', 'kabutia']),
  ing('zapallito', 'Zapallito', 'verdura', [], ['zucchini', 'calabacín']),
  ing('zanahoria', 'Zanahoria', 'verdura'),
  ing('remolacha', 'Remolacha', 'verdura'),
  ing('apio', 'Apio', 'verdura'),
  ing('cebolla', 'Cebolla', 'verdura'),
  ing('cebolla-verdeo', 'Cebolla de verdeo', 'verdura', [], ['cebollín', 'cebolla verde']),
  ing('puerro', 'Puerro', 'verdura'),
  ing('ajo', 'Ajo', 'verdura'),
  ing('brocoli', 'Brócoli', 'verdura'),
  ing('coliflor', 'Coliflor', 'verdura'),
  ing('repollo', 'Repollo', 'verdura', [], ['col']),
  ing('repollo-colorado', 'Repollo colorado', 'verdura', [], ['col lombarda']),
  ing('repollitos-bruselas', 'Repollitos de Bruselas', 'verdura'),
  ing('espinaca', 'Espinaca', 'verdura'),
  ing('acelga', 'Acelga', 'verdura'),
  ing('rucula', 'Rúcula', 'verdura'),
  ing('lechuga', 'Lechuga', 'verdura'),
  ing('kale', 'Kale', 'verdura', [], ['col rizada']),
  ing('pepino', 'Pepino', 'verdura'),
  ing('esparrago', 'Espárragos', 'verdura'),
  ing('alcaucil', 'Alcaucil', 'verdura', [], ['alcachofa']),
  ing('hinojo', 'Hinojo', 'verdura'),
  ing('nabo', 'Nabo', 'verdura'),
  ing('rabanito', 'Rabanito', 'verdura', [], ['rábano']),
  ing('palmito', 'Palmito', 'verdura'),
  ing('champinon', 'Champiñones', 'verdura', [], ['hongos', 'portobello']),
  ing('palta', 'Palta', 'verdura', [], ['aguacate']),
  ing('aceituna', 'Aceitunas', 'verdura'),
  ing('alga-nori', 'Alga nori', 'verdura', [], ['alga']),
  ing('berro', 'Berro', 'verdura'),
  ing('radicheta', 'Radicheta', 'verdura', [], ['achicoria']),
  ing('chaucha', 'Chauchas', 'verdura', ['legumbre'], ['judía verde', 'ejote']),

  // ─── Frutas ────────────────────────────────────────────────────────────
  ing('banana', 'Banana', 'fruta', [], ['plátano']),
  ing('platano-verde', 'Plátano verde', 'fruta'),
  ing('manzana', 'Manzana', 'fruta'),
  ing('pera', 'Pera', 'fruta'),
  ing('naranja', 'Naranja', 'fruta'),
  ing('mandarina', 'Mandarina', 'fruta'),
  ing('limon', 'Limón', 'fruta'),
  ing('lima', 'Lima', 'fruta'),
  ing('pomelo', 'Pomelo', 'fruta'),
  ing('frutilla', 'Frutillas', 'fruta', [], ['fresa']),
  ing('arandano', 'Arándanos', 'fruta'),
  ing('frambuesa', 'Frambuesas', 'fruta'),
  ing('mora', 'Moras', 'fruta'),
  ing('cereza', 'Cerezas', 'fruta'),
  ing('durazno', 'Durazno', 'fruta', [], ['melocotón']),
  ing('damasco', 'Damasco', 'fruta', [], ['albaricoque']),
  ing('ciruela', 'Ciruela', 'fruta'),
  ing('uva', 'Uvas', 'fruta'),
  ing('melon', 'Melón', 'fruta'),
  ing('sandia', 'Sandía', 'fruta'),
  ing('anana', 'Ananá', 'fruta', [], ['piña']),
  ing('mango', 'Mango', 'fruta'),
  ing('kiwi', 'Kiwi', 'fruta'),
  ing('higo', 'Higos', 'fruta'),
  ing('datil', 'Dátiles', 'fruta'),
  ing('coco-rallado', 'Coco rallado', 'fruta'),
  ing('granada', 'Granada', 'fruta'),

  // ─── Carnes ────────────────────────────────────────────────────────────
  ing('pollo', 'Pollo', 'carne'),
  ing('pechuga-pollo', 'Pechuga de pollo', 'carne'),
  ing('muslo-pollo', 'Muslos de pollo', 'carne', [], ['pata muslo']),
  ing('pavo', 'Pavo', 'carne'),
  ing('carne-vacuna', 'Carne vacuna', 'carne', [], ['ternera', 'res']),
  ing('carne-picada', 'Carne picada', 'carne', [], ['carne molida']),
  ing('cerdo', 'Cerdo', 'carne'),
  ing('cordero', 'Cordero', 'carne'),
  ing('higado', 'Hígado', 'carne'),
  ing('conejo', 'Conejo', 'carne'),
  ing('huesos', 'Huesos para caldo', 'carne', [], ['carcasa']),

  // ─── Pescados y mariscos ───────────────────────────────────────────────
  ing('salmon', 'Salmón', 'pescado'),
  ing('merluza', 'Merluza', 'pescado'),
  ing('trucha', 'Trucha', 'pescado'),
  ing('sardina', 'Sardinas', 'pescado'),
  ing('caballa', 'Caballa', 'pescado'),
  ing('atun', 'Atún', 'pescado'),
  ing('camaron', 'Camarones', 'pescado', [], ['langostinos']),
  ing('mejillon', 'Mejillones', 'pescado'),
  ing('calamar', 'Calamar', 'pescado'),
  ing('anchoa', 'Anchoas', 'pescado'),

  // ─── Grasas ────────────────────────────────────────────────────────────
  ing('aceite-oliva', 'Aceite de oliva', 'grasa', [], ['AOVE']),
  ing('aceite-coco', 'Aceite de coco', 'grasa'),
  ing('aceite-palta', 'Aceite de palta', 'grasa', [], ['aceite de aguacate']),
  ing('grasa-cerdo', 'Grasa de cerdo', 'grasa', [], ['manteca de cerdo']),
  ing('grasa-pato', 'Grasa de pato', 'grasa'),

  // ─── Hierbas ───────────────────────────────────────────────────────────
  ing('albahaca', 'Albahaca', 'hierba'),
  ing('perejil', 'Perejil', 'hierba'),
  ing('cilantro', 'Cilantro fresco', 'hierba'),
  ing('oregano', 'Orégano', 'hierba'),
  ing('romero', 'Romero', 'hierba'),
  ing('tomillo', 'Tomillo', 'hierba'),
  ing('laurel', 'Laurel', 'hierba'),
  ing('menta', 'Menta', 'hierba'),
  ing('salvia', 'Salvia', 'hierba'),
  ing('eneldo', 'Eneldo', 'hierba'),
  ing('ciboulette', 'Ciboulette', 'hierba'),

  // ─── Condimentos ───────────────────────────────────────────────────────
  ing('sal', 'Sal', 'condimento', [], ['sal marina', 'sal común', 'sal fina', 'sal gruesa', 'sal de mesa', 'sal entrefina', 'sal rosada']),
  ing('curcuma', 'Cúrcuma', 'condimento'),
  ing('jengibre', 'Jengibre', 'condimento'),
  ing('canela', 'Canela', 'condimento'),
  ing('ajo-polvo', 'Ajo en polvo', 'condimento'),
  ing('cebolla-polvo', 'Cebolla en polvo', 'condimento'),
  ing('vinagre-manzana', 'Vinagre de manzana', 'condimento'),
  ing('vinagre-coco', 'Vinagre de coco', 'condimento'),
  ing('ralladura-limon', 'Ralladura de limón', 'condimento'),
  // Fuera de protocolo PAI estricto:
  ing('pimienta', 'Pimienta negra', 'condimento', ['especia_semilla']),
  ing('comino', 'Comino', 'condimento', ['especia_semilla']),
  ing('pimenton', 'Pimentón', 'condimento', ['solanacea'], ['paprika']),
  ing('mostaza', 'Mostaza', 'condimento', ['especia_semilla', 'aditivo']),
  ing('curry', 'Curry en polvo', 'condimento', ['especia_semilla', 'solanacea']),
  ing('salsa-soja', 'Salsa de soja', 'condimento', ['legumbre', 'cereal']),

  // ─── Harinas y almidones ───────────────────────────────────────────────
  ing('harina-coco', 'Harina de coco', 'harina'),
  ing('harina-mandioca', 'Harina de mandioca', 'harina', [], ['tapioca']),
  ing('almidon-mandioca', 'Almidón de mandioca', 'harina', [], ['fécula de mandioca']),
  ing('harina-platano', 'Harina de plátano verde', 'harina'),
  ing('harina-castanas', 'Harina de castañas', 'harina'),
  ing('harina-sarraceno', 'Harina de trigo sarraceno', 'harina', ['pseudocereal'], ['harina de alforfón']),
  ing('sarraceno-grano', 'Trigo sarraceno en grano', 'harina', ['pseudocereal'], ['alforfón']),
  // Fuera de protocolo:
  ing('harina-trigo', 'Harina de trigo', 'harina', ['cereal']),
  ing('harina-almendra', 'Harina de almendras', 'harina', ['fruto_seco']),
  ing('avena', 'Avena', 'harina', ['cereal']),
  ing('arroz', 'Arroz', 'harina', ['cereal']),
  ing('fideos', 'Fideos', 'harina', ['cereal']),
  ing('pan', 'Pan', 'harina', ['cereal']),
  ing('quinoa', 'Quinoa', 'harina', ['pseudocereal']),
  ing('maiz', 'Maíz', 'harina', ['cereal']),
  ing('polenta', 'Polenta', 'harina', ['cereal']),

  // ─── Huevo (excepción del perfil de Cami) ──────────────────────────────
  ing('huevo', 'Huevo', 'otro', ['huevo']),

  ing('gelatina', 'Gelatina sin sabor', 'otro', [], ['grenetina']),
  ing('bicarbonato', 'Bicarbonato de sodio', 'condimento'),
  ing('cremor-tartaro', 'Cremor tártaro', 'condimento'),

  // ─── Fermentados ───────────────────────────────────────────────────────
  ing('chucrut', 'Chucrut', 'fermento', [], ['sauerkraut']),
  ing('kombucha', 'Kombucha', 'fermento'),
  ing('kefir-agua', 'Kéfir de agua', 'fermento'),

  // ─── Endulzantes ───────────────────────────────────────────────────────
  ing('miel', 'Miel', 'endulzante'),
  ing('jarabe-arce', 'Jarabe de arce', 'endulzante', [], ['maple']),
  ing('azucar', 'Azúcar', 'endulzante', ['azucar_refinada']),
  ing('edulcorante', 'Edulcorante', 'endulzante', ['edulcorante_artificial']),

  // ─── Líquidos ──────────────────────────────────────────────────────────
  ing('caldo-huesos', 'Caldo de huesos', 'liquido'),
  ing('caldo-verduras', 'Caldo de verduras', 'liquido'),
  ing('leche-coco', 'Leche de coco', 'liquido'),
  ing('crema-coco', 'Crema de coco', 'liquido'),
  ing('agua-coco', 'Agua de coco', 'liquido'),
  ing('te-verde', 'Té verde', 'liquido'),
  ing('agua', 'Agua', 'liquido'),

  // ─── Fuera de protocolo, comunes en casa ───────────────────────────────
  ing('tomate', 'Tomate', 'verdura', ['solanacea']),
  ing('papa', 'Papa', 'verdura', ['solanacea']),
  ing('morron', 'Morrón', 'verdura', ['solanacea'], ['pimiento']),
  ing('berenjena', 'Berenjena', 'verdura', ['solanacea']),
  ing('aji', 'Ají', 'verdura', ['solanacea']),
  ing('lenteja', 'Lentejas', 'otro', ['legumbre']),
  ing('garbanzo', 'Garbanzos', 'otro', ['legumbre']),
  ing('poroto', 'Porotos', 'otro', ['legumbre'], ['frijoles']),
  ing('mani', 'Maní', 'otro', ['legumbre'], ['cacahuete']),
  ing('almendra', 'Almendras', 'otro', ['fruto_seco']),
  ing('nuez', 'Nueces', 'otro', ['fruto_seco']),
  ing('castana-caju', 'Castañas de cajú', 'otro', ['fruto_seco'], ['anacardo']),
  ing('chia', 'Chía', 'otro', ['semilla']),
  ing('lino', 'Lino', 'otro', ['semilla']),
  ing('sesamo', 'Sésamo', 'otro', ['semilla']),
  ing('girasol', 'Semillas de girasol', 'otro', ['semilla']),
  ing('leche', 'Leche', 'liquido', ['lacteo']),
  ing('queso', 'Queso', 'otro', ['lacteo']),
  ing('yogur', 'Yogur', 'otro', ['lacteo']),
  ing('manteca', 'Manteca', 'grasa', ['lacteo'], ['mantequilla']),
  ing('ghee', 'Ghee', 'grasa', ['lacteo']),
  ing('cafe', 'Café', 'liquido', ['cafe']),
  ing('cacao', 'Cacao', 'otro', ['cacao'], ['chocolate']),
  ing('vino', 'Vino', 'liquido', ['alcohol']),
]

export const INGREDIENTE_POR_ID = new Map(INGREDIENTES.map((i) => [i.id, i]))

export function nombreDe(id: string): string {
  return INGREDIENTE_POR_ID.get(id)?.nombre ?? id
}

/** El nombre para usar en medio de una oración: "podés usar espinaca". */
export function nombreEnFrase(id: string): string {
  const n = nombreDe(id)
  return n.charAt(0).toLowerCase() + n.slice(1)
}
