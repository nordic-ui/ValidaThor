import { isParser } from '@/guards'
import type { Parser } from '@/types'
import { assert, assertType, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

type InferTupleType<T> = T extends readonly [...infer U]
  ? {
      [K in keyof U]: U[K] extends Parser<infer V> ? V : never
    }
  : never

const isValidTuple = <T extends readonly Parser<unknown>[]>(
  value: unknown[],
): value is InferTupleType<T> => {
  return Array.isArray(value)
}

/**
 * Creates a schema that validates tuples (fixed-length arrays with specific types at each position)
 * @param schema An array of parsers defining the type for each position in the tuple
 * @param message Optional custom error messages
 * @returns A parser that validates tuples matching the schema
 */
export const tuple = <const TSchema extends readonly Parser<unknown>[]>(
  schema: TSchema,
  message?: {
    type_error?: string
  },
): Parser<InferTupleType<TSchema>> => ({
  name: 'tuple' as const,
  parse: (value): InferTupleType<TSchema> => {
    assert(
      Array.isArray(value),
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_0000.message()),
    )

    assert(
      value.length === schema.length,
      new TypeError(
        ERROR_CODES.ERR_TYP_0000.message(message?.type_error || 'Tuple length mismatch'),
      ),
    )

    const result = value.reduce((acc: unknown[], item: unknown, index) => {
      const schemaItem = schema[index]

      assertType<Parser<unknown>>(
        schemaItem,
        isParser<Parser<unknown>>,
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_0000.message()),
      )

      acc.push(schemaItem.parse(item))
      return acc
    }, [])

    assert(
      isValidTuple<TSchema>(result),
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_0000.message()),
    )

    return result
  },
})
