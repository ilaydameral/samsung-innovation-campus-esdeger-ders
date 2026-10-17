import { test } from 'node:test'
import assert from 'node:assert/strict'
import { removeUnavailableMaterials } from '../src/lib/adaptation.ts'
import type { ActivityRequest } from '../src/types.ts'
const request: ActivityRequest = { learning_objective: 'Dört eş parçadan üçünü temsil eder.', student_age: 9, duration_minutes_per_activity: 10, available_materials: ['1 kâğıt', '1 kalem', '8 taş'], access: { internet: false, screen: false, printer: false } }
test('removing a resource preserves objective, age, duration and access without mutating original', () => {
  const before = structuredClone(request)
  const next = removeUnavailableMaterials(request, ['8 taş'])
  assert.deepEqual(next, { ...request, available_materials: ['1 kâğıt', '1 kalem'] })
  assert.deepEqual(request, before)
  next.access.screen = true
  assert.equal(request.access.screen, false)
})
test('all materials can be removed without substituting unrequested resources', () => {
  assert.deepEqual(removeUnavailableMaterials(request, request.available_materials).available_materials, [])
})
test('empty and nonexistent selections are rejected', () => {
  assert.throws(() => removeUnavailableMaterials(request, []))
  assert.throws(() => removeUnavailableMaterials(request, ['tablet']))
})
