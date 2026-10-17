import type { ActivityRequest, ActivityResponse, Method } from '../types.ts'
import { parseResponse } from './validation.ts'

const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value)
const methodMap: Record<string, Method> = {
  reading: 'reading', hands_on: 'hands_on', oral: 'oral',
  'kısa okuma': 'reading', 'kısa metin': 'reading', 'kısa metin/okuma': 'reading', 'kısa metin / okuma': 'reading',
  'somut malzeme': 'hands_on', 'sözlü etkileşim': 'oral',
}
export function toBackendRequest(input: ActivityRequest) {
  return {
    kazanim: input.learning_objective.trim(), yas_seviye: `${input.student_age} yaş`,
    malzemeler: [...input.available_materials], sure_dakika: input.duration_minutes_per_activity,
    erisim_kosullari: `İnternet ${input.access.internet ? 'var' : 'yok'}, ekran ${input.access.screen ? 'var' : 'yok'}, yazıcı ${input.access.printer ? 'var' : 'yok'}.`,
    prompt_version: 'v2',
  }
}

export function fromBackendResponse(value: unknown, input: ActivityRequest): ActivityResponse {
  if (!record(value) || !Array.isArray(value.etkinlikler) || !record(value.degerlendirme)
    || typeof value.uygulanabilirlik_notu !== 'string' || !value.uygulanabilirlik_notu.trim()
    || !['v1', 'v2'].includes(String(value.prompt_version_used))) throw new Error('Backend yanıtının zorunlu alanları eksik.')
  const assessment = value.degerlendirme
  const response = {
    learning_objective: input.learning_objective.trim(),
    activities: value.etkinlikler.map((activity, i) => {
      if (!record(activity) || typeof activity.hedef_kazanim !== 'string' || activity.hedef_kazanim.trim() !== input.learning_objective.trim()) throw new Error('Etkinliğin kazanımı gönderilen kazanımla eşleşmiyor.')
      const method = typeof activity.yontem === 'string' ? methodMap[activity.yontem.trim().toLocaleLowerCase('tr-TR')] : undefined
      if (!method) throw new Error('Backend tanınmayan bir etkinlik yöntemi döndürdü.')
      return { id: `${method}_${i + 1}`, method, title: activity.ad, duration_minutes: activity.tahmini_sure_dakika,
        materials_used: activity.kullanilan_malzemeler, steps: activity.uygulama_adimlari,
        expected_student_behavior: activity.beklenen_ogrenci_davranisi }
    }),
    common_assessment: { question: assessment.ortak_soru, expected_answer: assessment.dogru_cevap,
      evaluation_criteria: [assessment.degerlendirme_olcutu_ve_gerekce] },
    teacher_notes: [value.uygulanabilirlik_notu],
  }
  return parseResponse(response, input)
}
