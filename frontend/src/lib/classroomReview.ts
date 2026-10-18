import type { ActivityRequest, ActivityResponse, Method } from '../types.ts'
import { normalizeMaterial } from './materials.ts'

const normalize = (text: string) => text.normalize('NFC').toLocaleLowerCase('tr-TR').trim().replace(/\s+/g, ' ')
const resources = [
  { key: 'internet', label: 'İnternet', pattern: /internet|çevrimiçi|çevrim içi|youtube|https?:\/\/|wi-?fi/i },
  { key: 'screen', label: 'Ekran', pattern: /ekran|projeksiyon|akıllı tahta|tablet|bilgisayar|video/i },
  { key: 'printer', label: 'Yazıcı', pattern: /yazıcı|çıktı|yazdır|fotokopi/i },
] as const

// A transparent lexical review aid, not a semantic compliance verdict.
// Exact material matching preserves quantities; uncertain aliases need human review.
export function reviewClassroom(request: ActivityRequest, response: ActivityResponse) {
  const available = new Set(request.available_materials.map(normalizeMaterial))
  return response.activities.map(activity => {
    const unlistedMaterials = activity.materials_used.filter(item => !available.has(normalizeMaterial(item)))
    const snippets = [activity.title, ...activity.materials_used, ...activity.steps, activity.expected_student_behavior]
    const resourceMentions = resources.filter(resource => !request.access[resource.key]).flatMap(resource => {
      const excerpt = snippets.find(text => resource.pattern.test(normalize(text)))
      return excerpt ? [{ resource: resource.label, excerpt }] : []
    })
    return { id: activity.id, method: activity.method, title: activity.title, unlistedMaterials, resourceMentions }
  })
}

export const reviewChecks = [
  'Yönergeler seçtiğim kazanımı gerçekten çalıştırıyor; yalnızca konu başlığı benzemiyor.',
  'Malzemeler ve miktarları yeterli; adımlar sınıfın olanakları, yaş grubu ve süre için uygulanabilir.',
  'Ortak soru kazanımı ölçüyor; cevap anahtarı ve ölçütler doğru.',
] as const

export function isReviewComplete(method: Method | '', checks: boolean[]) {
  return method !== '' && checks.length === reviewChecks.length && checks.every(Boolean)
}
