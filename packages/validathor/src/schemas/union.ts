import type { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

type ExtractParserType<T> = T extends Parser<infer U> ? U : never

type UnionSchemaType<T extends readonly Parser<unknown>[]> = ExtractParserType<T[number]>

/**
 * Creates a schema that validates values matching any of the provided schemas
 * @param schemas An array of parsers, value must match at least one
 * @param message Optional custom error messages
 * @returns A parser that validates union types
 */
export const union = <TSchemas extends readonly Parser<unknown>[]>(
  schemas: TSchemas,
  message?: {
    type_error?: string
  },
): Parser<UnionSchemaType<TSchemas>> => {
  assert(
    Array.isArray(schemas) && schemas.length > 0,
    new TypeError('Union schema requires at least one schema'),
  )

  return {
    name: 'union' as const,
    parse: (value: unknown): UnionSchemaType<TSchemas> => {
      assert(
        typeof value !== 'undefined' && value !== null,
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_0001.message()),
      )

      const errors: Error[] = []

      for (const schema of schemas) {
        try {
          return schema.parse(value) as UnionSchemaType<TSchemas>
        } catch (error) {
          errors.push(error instanceof Error ? error : new Error(String(error)))
        }
      }

      const schemaNames = schemas.map((s) => s.name).join(' | ')
      throw new TypeError(message?.type_error || `Expected value to match one of: ${schemaNames}`)
    },
  }
}
