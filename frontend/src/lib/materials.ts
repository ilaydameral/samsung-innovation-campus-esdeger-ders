// Match spelling case and spacing, while retaining quantities and original labels.
export const normalizeMaterial = (text: string) =>
  text.normalize('NFC').toLocaleLowerCase('tr-TR').trim().replace(/\s+/g, ' ')

export function mergeMaterials(current: string[], additions: string[]): string[] {
  const seen = new Set<string>()
  return [...current, ...additions].filter(item => {
    const key = normalizeMaterial(item)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}
