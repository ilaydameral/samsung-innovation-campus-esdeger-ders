import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mergeMaterials } from '../src/lib/materials.ts'

test('material entry deduplicates Turkish case, Unicode and whitespace without replacing first label', () => {
  assert.deepEqual(mergeMaterials(['1 Kalem', 'Kâğıt'], ['1 kalem', 'KÂĞIT', ' 1   KALEM ', 'Kâğıt']), ['1 Kalem', 'Kâğıt'])
})
test('different material quantities and uncertain spellings remain separate', () => {
  assert.deepEqual(mergeMaterials(['1 kalem', 'kâğıt'], ['2 kalem', 'kalem', 'kağıt']), ['1 kalem', 'kâğıt', '2 kalem', 'kalem', 'kağıt'])
})
test('material entry does not mutate inputs and ignores blank entries', () => {
  const current = ['kalem']; const additions = ['KALEM', ' ', 'taş']
  assert.deepEqual(mergeMaterials(current, additions), ['kalem', 'taş'])
  assert.deepEqual(current, ['kalem']); assert.deepEqual(additions, ['KALEM', ' ', 'taş'])
})
