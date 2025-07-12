import { isParserRecords } from '@/guards'
import type { Parser } from '@/types'
import { assert, assertType, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

// Helper type to infer the schema shape and convert to the correct types
type InferSchemaType<TSchema> = {
  [PKey in keyof TSchema]: TSchema[PKey] extends Parser<infer U> ? U : never
}

// Type predicate helper function
const isInferredSchemaType = <TSchema extends Record<string, Parser<unknown>>>(
  obj: Record<string, unknown>,
): obj is InferSchemaType<TSchema> => {
  return typeof obj === 'object' && obj !== null
}

/**
 * Creates a schema that validates objects with a specific shape
 * @param schema An object mapping keys to parser schemas
 * @param message Optional custom error messages
 * @returns A parser that validates objects matching the schema shape
 */
export const object = <TSchema extends Record<string, Parser<unknown>>>(
  schema: TSchema,
  message?: {
    type_error?: string
  },
) => ({
  name: 'object' as const,
  parse: (value: unknown): InferSchemaType<TSchema> => {
    assert(
      typeof value !== 'undefined' && value !== null,
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_0001.message()),
    )

    assertType<Record<string, unknown>>(
      value,
      isParserRecords<TSchema>,
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_5000.message()),
    )

    const result = Object.fromEntries(
      Object.entries(schema).map(([key, parser]) => [key, parser.parse(value[key])]),
    )

    if (isInferredSchemaType<TSchema>(result)) {
      return result
    }

    throw new TypeError('Failed to construct object schema result')
  },
})
