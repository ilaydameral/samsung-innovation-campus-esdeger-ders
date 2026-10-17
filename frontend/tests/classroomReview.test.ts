import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { isReviewComplete, reviewClassroom } from '../src/lib/classroomReview.ts'
import type { ActivityRequest, ActivityResponse } from '../src/types.ts'
const input = JSON.parse(readFileSync(new URL('../src/data/request.example.json', import.meta.url), 'utf8')) as ActivityRequest
const output = () => JSON.parse(readFileSync(new URL('../src/data/response.example.json', import.meta.url), 'utf8')) as ActivityResponse

test('reference scenario reports matching materials with no closed-resource mentions', () => {
  const findings = reviewClassroom(input, output())
  assert.equal(findings.length, 3)
  assert.ok(findings.every(item => !item.unlistedMaterials.length && !item.resourceMentions.length))
})
test('unlisted materials and increased quantities remain visible for review', () => {
  const data = output(); data.activities[0].materials_used = ['2 kâğıt', 'makas']
  assert.deepEqual(reviewClassroom(input, data)[0].unlistedMaterials, ['2 kâğıt', 'makas'])
})
test('whitespace and Turkish casing do not cause false material mismatches', () => {
  const data = output(); data.activities[0].materials_used = [' 1   KÂĞIT ', '1 KALEM']
  assert.deepEqual(reviewClassroom(input, data)[0].unlistedMaterials, [])
})
test('closed resources mentioned only in steps are surfaced; allowed resources are not flagged', () => {
  const data = output(); data.activities[0].steps = ['YouTube videosunu projeksiyonla açın; çalışma kâğıdını yazdırın.']
  assert.deepEqual(reviewClassroom(input, data)[0].resourceMentions.map(item => item.resource), ['İnternet', 'Ekran', 'Yazıcı'])
  const allowed = { ...input, access: { internet: true, screen: true, printer: true } }
  assert.deepEqual(reviewClassroom(allowed, data)[0].resourceMentions, [])
})
test('negated resource mentions remain review prompts rather than automatic rejection', () => {
  const data = output(); data.activities[0].steps = ['İnternet gerekmez.']
  assert.equal(reviewClassroom(input, data)[0].resourceMentions[0].excerpt, 'İnternet gerekmez.')
})
test('review requires a chosen method and exactly three explicit checks', () => {
  assert.equal(isReviewComplete('', [true, true, true]), false)
  assert.equal(isReviewComplete('reading', [true, false, true]), false)
  assert.equal(isReviewComplete('oral', []), false)
  assert.equal(isReviewComplete('oral', [true, true, true, true]), false)
  assert.equal(isReviewComplete('hands_on', [true, true, true]), true)
})
