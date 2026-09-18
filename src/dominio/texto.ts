/**
 * Normaliza para buscar: sin acentos, sin mayúsculas.
 * Así "platano", "Plátano" y "PLATANO" encuentran lo mismo.
 */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

export function coincide(consulta: string, ...campos: (string | undefined)[]): boolean {
  const q = normalizar(consulta)
  if (!q) return true
  return campos.some((c) => c && normalizar(c).includes(q))
}

/**
 * Qué tan bien coincide un ingrediente con lo que se escribió. Menor es mejor.
 *
 * Sin esto, buscar "sal" devuelve Salmón y Salvia antes que la sal, porque
 * todos la contienen. Acá gana el nombre exacto, después el que empieza igual,
 * y al final el que la tiene en el medio.
 */
export function relevancia(consulta: string, nombre: string, alias: string[] = []): number {
  const q = normalizar(consulta)
  if (!q) return 0
  const campos = [nombre, ...alias].map(normalizar)
  if (campos.some((c) => c === q)) return 0
  if (campos.some((c) => c.startsWith(q))) return 1
  return 2
}

/** Ordena por relevancia y, a igualdad, deja primero el nombre más corto. */
export function porRelevancia<T extends { nombre: string; alias?: string[] }>(consulta: string) {
  return (a: T, b: T) =>
    relevancia(consulta, a.nombre, a.alias) - relevancia(consulta, b.nombre, b.alias) ||
    a.nombre.length - b.nombre.length ||
    a.nombre.localeCompare(b.nombre, 'es')
}
