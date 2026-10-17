import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fromBackendResponse, toBackendRequest } from '../src/lib/backendAdapter.ts'
import type { ActivityRequest } from '../src/types.ts'
const input = JSON.parse(readFileSync(new URL('../src/data/request.example.json', import.meta.url), 'utf8')) as ActivityRequest
const fixture = () => JSON.parse(readFileSync(new URL('../../backend/tests/fixtures/response.json', import.meta.url), 'utf8'))

test('request maps current conditions without inventing grade or multiplying duration', () => {
  const request = toBackendRequest({...input,available_materials:[]})
  assert.equal(request.sure_dakika, input.duration_minutes_per_activity)
  assert.equal(request.yas_seviye, '9 yaş')
  assert.deepEqual(request.malzemeler, [])
  assert.equal(request.erisim_kosullari, 'İnternet yok, ekran yok, yazıcı yok.')
  assert.equal(request.prompt_version, 'v2')
})
test('shared backend fixture becomes complete UI activities and assessment', () => {
  const parsed = fromBackendResponse(fixture(), input)
  assert.equal(parsed.activities.length, 3)
  assert.deepEqual(parsed.activities.map(item => item.method), ['reading','hands_on','oral'])
  assert.equal(parsed.common_assessment.expected_answer, fixture().degerlendirme.dogru_cevap)
  assert.equal(parsed.teacher_notes[0], fixture().uygulanabilirlik_notu)
})
test('wrong objective cannot be hidden by mapping the request objective into the response', () => {
  const data = fixture(); data.etkinlikler[0].hedef_kazanim = 'Başka kazanım'
  assert.throws(() => fromBackendResponse(data,input), /kazanım/)
})
test('unknown or repeated methods and excess duration remain invalid', () => {
  const data = fixture(); data.etkinlikler[0].yontem = 'unknown'
  assert.throws(() => fromBackendResponse(data,input), /yöntem/)
  data.etkinlikler[0].yontem = 'hands_on'
  assert.throws(() => fromBackendResponse(data,input), /benzersiz/)
  const long = fixture(); long.etkinlikler[0].tahmini_sure_dakika = 11
  assert.throws(() => fromBackendResponse(long,input), /süre/)
})
test('documented Turkish method labels are mapped without relying on array order', () => {
  const data = fixture(); ['Kısa okuma','Somut malzeme','Sözlü etkileşim'].forEach((value,i) => data.etkinlikler[i].yontem = value)
  data.etkinlikler.reverse()
  assert.deepEqual(fromBackendResponse(data,input).activities.map(item=>item.method), ['oral','hands_on','reading'])
})
test('missing assessment and wrong response envelope are rejected', () => {
  const data = fixture(); data.degerlendirme.dogru_cevap = ''
  assert.throws(() => fromBackendResponse(data,input), /cevap anahtarı/)
  assert.throws(() => fromBackendResponse({data:fixture()},input), /zorunlu/)
})
