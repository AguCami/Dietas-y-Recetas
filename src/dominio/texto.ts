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
