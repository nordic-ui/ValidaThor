import type { InferSchemaType, Parser } from '@/types'
import { assert, assertType, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

const isRecord = <T>(input: unknown): input is T =>
  input instanceof Object &&
  !(input instanceof Array) &&
  !(input instanceof Boolean) &&
  !(input instanceof Date) &&
  !(input instanceof Error) &&
  !(input instanceof Function) &&
  !(input instanceof Number) &&
  !(input instanceof RegExp) &&
  !(input instanceof String)

export const object = <T extends Record<string, Parser<unknown>>>(
  schema: T,
  message?: {
    type_error?: string
  },
) => ({
  name: 'object' as const,
  parse: (value: unknown): InferSchemaType<T> => {
    assert(
      typeof value !== 'undefined' && value !== null,
      new TypeError(ERROR_CODES.ERR_TYP_0001.message()),
    )
    assertType<Record<string, unknown>>(
      value,
      isRecord<T>,
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_5000.message()),
    )

    const result: Record<string, unknown> = {}
    Object.entries(schema).forEach(([key, parser]) => {
      // Safely use the parser on each property
      result[key] = parser.parse(value[key])
    })
    return result as InferSchemaType<T>
  },
})
