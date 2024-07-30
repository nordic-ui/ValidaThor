import type { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

// Helper type to infer the schema shape and convert to the correct types
type InferSchemaType<T> = {
  [P in keyof T]: T[P] extends Parser<infer U> ? U : never
}

export const object = <T extends Record<string, Parser<unknown>>>(
  schema: T,
  message?: {
    type_error?: string
  },
) => ({
  name: 'object' as const,
  parse: (value: unknown): InferSchemaType<T> => {
    assert(
      value !== null &&
        value instanceof Object &&
        !(value instanceof Array) &&
        !(value instanceof Boolean) &&
        !(value instanceof Date) &&
        !(value instanceof Error) &&
        !(value instanceof Function) &&
        !(value instanceof Number) &&
        !(value instanceof RegExp) &&
        !(value instanceof String),
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_5000.message()),
    )

    const result: Record<string, unknown> = {}
    Object.entries(schema).forEach(([key, parser]) => {
      // Safely use the parser on each property
      result[key] = parser.parse((value as Record<string, unknown>)[key])
    })
    return result as InferSchemaType<T>
  },
})
