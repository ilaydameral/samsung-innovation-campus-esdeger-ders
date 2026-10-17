import type { ActivityRequest, ActivityResponse, Method } from '../types.ts'

const textEqual = (a: string, b: string) => a.trim().replace(/\s+/g, ' ') === b.trim().replace(/\s+/g, ' ')

export function comparePlans(beforeInput: ActivityRequest, before: ActivityResponse, afterInput: ActivityRequest, after: ActivityResponse | null) {
  return {
    objectiveTextPreserved: textEqual(beforeInput.learning_objective, afterInput.learning_objective),
    methods: (['reading', 'hands_on', 'oral'] as Method[]).map(method => {
      const previous = before.activities.find(activity => activity.method === method)!
      const current = after?.activities.find(activity => activity.method === method) ?? null
      return { method, previous, current, stepsTextChanged: current ? !textEqual(previous.steps.join('\n'), current.steps.join('\n')) : null }
    }),
    questionTextChanged: after ? !textEqual(before.common_assessment.question, after.common_assessment.question) : null,
  }
}
