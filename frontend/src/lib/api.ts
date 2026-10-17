import type { ActivityRequest, ActivityResponse, FieldError, Mode } from '../types.ts'
import { parseResponse } from './validation.ts'
import sampleRequest from '../data/request.example.json'
import sampleResponse from '../data/response.example.json'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
export const ENDPOINT = '/api/generate-activities'

export class GenerationError extends Error {
  code: string
  fields: FieldError[]
  constructor(message: string, code = 'UNKNOWN_ERROR', fields: FieldError[] = []) {
    super(message); this.name = 'GenerationError'; this.code = code; this.fields = fields
  }
}

export function matchesSample(input: ActivityRequest) {
  return input.learning_objective.trim() === sampleRequest.learning_objective
    && input.student_age === sampleRequest.student_age
    && input.duration_minutes_per_activity === sampleRequest.duration_minutes_per_activity
    && JSON.stringify(input.available_materials) === JSON.stringify(sampleRequest.available_materials)
    && Object.keys(sampleRequest.access).every(key => input.access[key as keyof typeof input.access] === sampleRequest.access[key as keyof typeof sampleRequest.access])
}

export async function generateActivities(input: ActivityRequest, mode: Mode, signal: AbortSignal): Promise<ActivityResponse> {
  if (mode === 'mock') {
    if (!matchesSample(input)) throw new GenerationError('Örnek modunda yalnızca kayıtlı 3/4 senaryosu gösterilir. “Örnek senaryoyu yükle” ile bu girdiyi açın veya canlı API moduna geçin.', 'MOCK_INPUT_MISMATCH')
    await new Promise<void>((resolve, reject) => {
      const abort = () => { clearTimeout(timer); reject(new DOMException('İptal edildi', 'AbortError')) }
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve() }, 950)
      if (signal.aborted) abort()
      else signal.addEventListener('abort', abort, { once: true })
    })
    return parseResponse(structuredClone(sampleResponse), input)
  }
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal,
    })
  } catch (error) {
    if (signal.aborted) throw error
    throw new GenerationError('Sunucuya bağlanılamadı. Backend adresini ve bağlantıyı kontrol edip yeniden deneyin.', 'NETWORK_ERROR')
  }
  let data: unknown
  try { data = await response.json() } catch {
    throw new GenerationError('Sunucu beklenen JSON yanıtını göndermedi. Bağlantı ayarlarını kontrol edin.', 'INVALID_JSON')
  }
  if (!response.ok) {
    let fields: FieldError[] = []
    let code = `HTTP_${response.status}`
    // Display local, teacher-facing messages rather than raw provider/stack output.
    if (typeof data === 'object' && data !== null && 'error' in data) {
      const body = data.error
      if (typeof body === 'object' && body !== null && 'code' in body && typeof body.code === 'string') code = body.code
      if (typeof body === 'object' && body !== null && 'field_errors' in body && Array.isArray(body.field_errors)) {
        fields = body.field_errors.filter((x): x is FieldError => typeof x === 'object' && x !== null && typeof x.field === 'string' && typeof x.message === 'string')
      }
    }
    const messages: Record<string, string> = {
      VALIDATION_ERROR: 'Girdi alanlarını kontrol edin ve yeniden deneyin.',
      CONSTRAINTS_UNSATISFIABLE: 'Bu koşullarda üç uygun etkinlik hazırlanamadı. Süreyi, malzemeleri veya kazanımı gözden geçirin.',
      MODEL_OUTPUT_INVALID: 'Üretilen içerik beklenen kontrolleri geçemedi. Yeniden deneyebilirsiniz.',
      MODEL_UNAVAILABLE: 'Üretim hizmeti şu anda kullanılamıyor. Biraz sonra yeniden deneyin.',
      MODEL_TIMEOUT: 'Üretim beklenenden uzun sürdü. Yeniden deneyebilirsiniz.',
    }
    throw new GenerationError(messages[code] || `İstek tamamlanamadı (${response.status}). Yeniden deneyebilirsiniz.`, code, fields)
  }
  try { return parseResponse(data, input) } catch (error) {
    throw new GenerationError(`Sunucu yanıtı gösterilemedi. ${error instanceof Error ? error.message : ''}`, 'MODEL_OUTPUT_INVALID')
  }
}
