import type { ActivityRequest, ActivityResponse, Mode } from '../types.ts'

export type PrintAudience = 'student' | 'teacher'

// Student sheets deliberately contain no activity steps: these may reveal answers.
export function createPrintPlan(request: ActivityRequest, response: ActivityResponse, mode: Mode, audience: PrintAudience) {
  const common = {
    audience, source: mode === 'mock' ? 'Kayıtlı örnek veri · Canlı model üretimi değildir.' : 'AI destekli içerik · Öğretmen incelemesi gerektirir.',
    age: request.student_age,
    question: response.common_assessment.question,
  }
  return audience === 'student' ? { ...common, teacher: null } : {
    ...common,
    teacher: {
      objective: response.learning_objective,
      activities: structuredClone(response.activities),
      answer: response.common_assessment.expected_answer,
      criteria: [...response.common_assessment.evaluation_criteria],
      notes: [...response.teacher_notes],
      access: { ...request.access },
    },
  }
}
