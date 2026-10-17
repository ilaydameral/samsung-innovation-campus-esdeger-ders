import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { parseResponse, validateRequest } from '../src/lib/validation.ts'
import type { ActivityRequest, ActivityResponse } from '../src/types.ts'

const request = JSON.parse(readFileSync(new URL('../src/data/request.example.json', import.meta.url), 'utf8')) as ActivityRequest
const example = () => JSON.parse(readFileSync(new URL('../src/data/response.example.json', import.meta.url), 'utf8')) as ActivityResponse

test('agreed request and complete example are accepted', () => {
  assert.deepEqual(validateRequest(request), [])
  assert.equal(parseResponse(example(), request).activities.length, 3)
})
test('blank objective, NaN age, and nonpositive duration are reported', () => {
  const errors = validateRequest({ ...request, learning_objective: ' ', student_age: NaN, duration_minutes_per_activity: 0 })
  assert.deepEqual(errors.map(x => x.field), ['learning_objective', 'student_age', 'duration_minutes_per_activity'])
})
test('fractional ages and durations are rejected, empty materials allowed', () => {
  assert.equal(validateRequest({ ...request, student_age: 9.5, duration_minutes_per_activity: 2.1 }).length, 2)
  assert.deepEqual(validateRequest({ ...request, available_materials: [] }), [])
})
test('null and partial model output cannot be shown as success', () => {
  assert.throws(() => parseResponse(null, request))
  assert.throws(() => parseResponse({ learning_objective: request.learning_objective }, request))
})
test('a different objective cannot be passed off as the requested result', () => {
  const data = example(); data.learning_objective = 'Başka bir kazanım'
  assert.throws(() => parseResponse(data, request), /kazanım/)
})
test('exactly three distinct methods and IDs are required', () => {
  const missing = example(); missing.activities.pop()
  assert.throws(() => parseResponse(missing, request), /üç etkinlik/)
  const duplicate = example(); duplicate.activities[1].method = duplicate.activities[0].method
  assert.throws(() => parseResponse(duplicate, request), /benzersiz/)
  const ids = example(); ids.activities[1].id = ids.activities[0].id
  assert.throws(() => parseResponse(ids, request), /benzersiz/)
})
test('durations exceeding the request or invalid values are rejected', () => {
  const data = example(); data.activities[0].duration_minutes = 11
  assert.throws(() => parseResponse(data, request), /süre/)
  data.activities[0].duration_minutes = -1
  assert.throws(() => parseResponse(data, request), /süre/)
})
test('empty steps and missing answer key are rejected', () => {
  const steps = example(); steps.activities[0].steps = []
  assert.throws(() => parseResponse(steps, request), /adımlar/)
  const answer = example(); answer.common_assessment.expected_answer = ''
  assert.throws(() => parseResponse(answer, request), /cevap anahtarı/)
})
test('optional list contents are still validated', () => {
  const data = example(); data.teacher_notes = [null] as unknown as string[]
  assert.throws(() => parseResponse(data, request), /notları/)
})
