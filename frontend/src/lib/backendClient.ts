import type { ActivityRequest, ActivityResponse, FieldError } from '../types.ts'
import { GenerationError } from './errors.ts'
import { fromBackendResponse, toBackendRequest } from './backendAdapter.ts'

export const ENDPOINT = '/api/esdeger-ders/generate'

export async function requestBackend(input: ActivityRequest, baseUrl: string, signal: AbortSignal, fetcher: typeof fetch = fetch): Promise<ActivityResponse> {
  signal.throwIfAborted()
  let response: Response
  try {
    response = await fetcher(`${baseUrl}${ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toBackendRequest(input)),
      signal,
    })
  } catch (error) {
    if (signal.aborted) throw error
    throw new GenerationError('Sunucuya bağlanılamadı. Backend adresini ve bağlantıyı kontrol edip yeniden deneyin.', 'NETWORK_ERROR')
  }
  let data: unknown
  try { data = await response.json() } catch (error) {
    if (signal.aborted) throw error
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
      MODEL_NOT_CONFIGURED: 'Backend çalışıyor ancak Gemini API anahtarı yapılandırılmamış. Anahtarı yalnız backend ortamına ekleyin.',
      MODEL_AUTH_ERROR: 'Gemini erişimi doğrulanamadı. Backend anahtarı ve API izinlerini kontrol edin.',
      MODEL_RATE_LIMITED: 'Gemini istek sınırına ulaşıldı. Biraz bekleyip yeniden deneyin.',
      MODEL_TIMEOUT: 'Üretim beklenenden uzun sürdü. Yeniden deneyebilirsiniz.',
    }
    throw new GenerationError(messages[code] || `İstek tamamlanamadı (${response.status}). Yeniden deneyebilirsiniz.`, code, fields)
  }
  try { return fromBackendResponse(data, input) } catch (error) {
    throw new GenerationError(`Sunucu yanıtı gösterilemedi. ${error instanceof Error ? error.message : ''}`, 'MODEL_OUTPUT_INVALID')
  }
}
