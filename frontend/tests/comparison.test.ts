import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { comparePlans } from '../src/lib/comparison.ts'
import type { ActivityRequest, ActivityResponse } from '../src/types.ts'
const input = JSON.parse(readFileSync(new URL('../src/data/request.example.json', import.meta.url), 'utf8')) as ActivityRequest
const before = JSON.parse(readFileSync(new URL('../src/data/response.example.json', import.meta.url), 'utf8')) as ActivityResponse

test('pending comparison never substitutes old activities for the missing new answer', () => {
  const compared = comparePlans(input, before, { ...input, available_materials: [] }, null)
  assert.equal(compared.objectiveTextPreserved, true)
  assert.equal(compared.questionTextChanged, null)
  assert.ok(compared.methods.every(pair => pair.current === null && pair.stepsTextChanged === null))
})
test('methods are paired by method even when response ordering and IDs change', () => {
  const after = structuredClone(before)
  after.activities.reverse()
  after.activities.forEach((activity, i) => activity.id = `new-${i}`)
  after.activities.find(activity => activity.method === 'hands_on')!.steps = ['Yeni bir test adımı']
  const compared = comparePlans(input, before, input, after)
  assert.deepEqual(compared.methods.map(pair => [pair.method, pair.stepsTextChanged]), [['reading', false], ['hands_on', true], ['oral', false]])
  assert.ok(compared.methods.every(pair => pair.previous.method === pair.current?.method))
})
test('changed objectives and changed common questions are reported without scoring equivalence', () => {
  const after = structuredClone(before); after.common_assessment.question = 'Yeni soru'
  const compared = comparePlans(input, before, { ...input, learning_objective: 'Başka kazanım' }, after)
  assert.equal(compared.objectiveTextPreserved, false)
  assert.equal(compared.questionTextChanged, true)
})
