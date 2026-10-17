import type { ActivityRequest } from '../types.ts'

export function removeUnavailableMaterials(request: ActivityRequest, removed: string[]): ActivityRequest {
  const unavailable = new Set(removed)
  if (!removed.length || removed.some(item => !request.available_materials.includes(item))) {
    throw new Error('Çıkarılacak malzemeyi mevcut listeden seçin.')
  }
  return { ...structuredClone(request), available_materials: request.available_materials.filter(item => !unavailable.has(item)) }
}
