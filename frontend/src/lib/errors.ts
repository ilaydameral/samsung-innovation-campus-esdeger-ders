import type { FieldError } from '../types.ts'

export class GenerationError extends Error {
  code: string
  fields: FieldError[]
  constructor(message: string, code = 'UNKNOWN_ERROR', fields: FieldError[] = []) {
    super(message); this.name = 'GenerationError'; this.code = code; this.fields = fields
  }
}

