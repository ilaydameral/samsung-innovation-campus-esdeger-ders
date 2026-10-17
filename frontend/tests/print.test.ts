import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createPrintPlan } from '../src/lib/print.ts'
import type { ActivityRequest, ActivityResponse } from '../src/types.ts'
const request = JSON.parse(readFileSync(new URL('../src/data/request.example.json', import.meta.url), 'utf8')) as ActivityRequest
const response = JSON.parse(readFileSync(new URL('../src/data/response.example.json', import.meta.url), 'utf8')) as ActivityResponse

test('student sheet excludes answer, criteria, teacher notes and revealing activity steps', () => {
  const marked = structuredClone(response)
  marked.learning_objective = 'SECRET_OBJECTIVE_WITH_ANSWER'
  marked.common_assessment.expected_answer = 'SECRET_ANSWER'
  marked.common_assessment.evaluation_criteria = ['SECRET_CRITERIA']
  marked.teacher_notes = ['SECRET_NOTE']
  marked.activities[0].steps = ['SECRET_STEP']
  marked.activities[0].expected_student_behavior = 'SECRET_BEHAVIOR'
  const plan = createPrintPlan(request, marked, 'mock', 'student')
  assert.equal(plan.question, marked.common_assessment.question)
  assert.equal(plan.teacher, null)
  assert.equal(JSON.stringify(plan).includes('SECRET_'), false)
})
test('teacher plan retains all methods and complete assessment independently of screen filters', () => {
  const plan = createPrintPlan(request, response, 'api', 'teacher')
  assert.equal(plan.teacher?.activities.length, 3)
  assert.equal(plan.teacher?.answer, response.common_assessment.expected_answer)
  assert.deepEqual(plan.teacher?.criteria, response.common_assessment.evaluation_criteria)
  assert.deepEqual(plan.teacher?.notes, response.teacher_notes)
  assert.deepEqual(plan.teacher?.access, request.access)
})
test('mock source remains explicit for both print audiences; live carries review notice', () => {
  for (const audience of ['student', 'teacher'] as const) {
    assert.match(createPrintPlan(request, response, 'mock', audience).source, /Canlı model üretimi değildir/)
    assert.match(createPrintPlan(request, response, 'api', audience).source, /Öğretmen incelemesi/)
  }
})
