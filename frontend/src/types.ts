export type Method = 'reading' | 'hands_on' | 'oral'
export type Mode = 'mock' | 'api'

export interface ActivityRequest {
  learning_objective: string
  student_age: number
  duration_minutes_per_activity: number
  available_materials: string[]
  access: { internet: boolean; screen: boolean; printer: boolean }
}

export interface Activity {
  id: string
  method: Method
  title: string
  duration_minutes: number
  materials_used: string[]
  steps: string[]
  expected_student_behavior: string
}

export interface ActivityResponse {
  learning_objective: string
  activities: Activity[]
  common_assessment: {
    question: string
    expected_answer: string
    evaluation_criteria: string[]
  }
  teacher_notes: string[]
}

export interface FieldError { field: string; message: string }
