import type { ActivityRequest, ActivityResponse, Mode } from '../types.ts'
import { parseResponse } from './validation.ts'
import { requestBackend } from './backendClient.ts'
import { GenerationError } from './errors.ts'
export { GenerationError } from './errors.ts'
export { ENDPOINT } from './backendClient.ts'
import sampleRequest from '../data/request.example.json'
import sampleResponse from '../data/response.example.json'

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')

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
  return requestBackend(input, API_BASE_URL, signal)
}
