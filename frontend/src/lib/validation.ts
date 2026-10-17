import type { ActivityRequest, ActivityResponse, FieldError } from '../types.ts'

const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
const texts = (value: unknown): value is string[] => Array.isArray(value) && value.every(text)
const positiveInteger = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value > 0

export function validateRequest(input: ActivityRequest): FieldError[] {
  const errors: FieldError[] = []
  if (!text(input.learning_objective)) errors.push({ field: 'learning_objective', message: 'Öğrencinin kazanmasını istediğiniz bilgi veya beceriyi yazın.' })
  if (!positiveInteger(input.student_age)) errors.push({ field: 'student_age', message: 'Yaşı pozitif bir tam sayı olarak girin.' })
  if (!positiveInteger(input.duration_minutes_per_activity)) errors.push({ field: 'duration_minutes_per_activity', message: 'Etkinlik başına süreyi pozitif bir tam sayı olarak girin.' })
  if (!texts(input.available_materials)) errors.push({ field: 'available_materials', message: 'Malzemeleri boş olmayan metinler olarak ekleyin.' })
  return errors
}

export function parseResponse(value: unknown, request: ActivityRequest): ActivityResponse {
  const fail = (message: string): never => { throw new Error(message) }
  if (!record(value) || !text(value.learning_objective)) return fail('Yanıtta kazanım alanı eksik.')
  if (value.learning_objective.trim() !== request.learning_objective.trim()) return fail('Yanıtın kazanımı gönderilen kazanımla eşleşmiyor.')
  if (!Array.isArray(value.activities) || value.activities.length !== 3) return fail('Yanıtta üç etkinlik bulunmalı.')
  const methods = new Set<string>()
  const ids = new Set<string>()
  for (const activity of value.activities) {
    if (!record(activity) || !text(activity.id) || !text(activity.title) || !text(activity.expected_student_behavior)) return fail('Etkinliğin zorunlu alanları eksik.')
    if (typeof activity.method !== 'string' || !['reading', 'hands_on', 'oral'].includes(activity.method)) return fail('Etkinlik yöntemi tanınmıyor.')
    if (methods.has(activity.method) || ids.has(activity.id)) return fail('Etkinlik yöntemleri ve kimlikleri benzersiz olmalı.')
    methods.add(activity.method); ids.add(activity.id)
    if (!positiveInteger(activity.duration_minutes) || activity.duration_minutes > request.duration_minutes_per_activity) return fail('Etkinliğin süresi belirtilen sınırı aşıyor veya geçersiz.')
    if (!texts(activity.materials_used) || !texts(activity.steps) || activity.steps.length === 0) return fail('Etkinlik adımları veya malzemeleri geçersiz.')
  }
  if (!record(value.common_assessment) || !text(value.common_assessment.question) || !text(value.common_assessment.expected_answer) || !texts(value.common_assessment.evaluation_criteria) || value.common_assessment.evaluation_criteria.length === 0) return fail('Ortak değerlendirme veya cevap anahtarı eksik.')
  if (!texts(value.teacher_notes)) return fail('Öğretmen notları beklenen biçimde değil.')
  return value as unknown as ActivityResponse
}
