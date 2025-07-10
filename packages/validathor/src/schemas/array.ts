import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, Max, Min } from '@/modifiers'
import type { Parser } from '@/types'
import { assert, TypeError, ValidationError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

/** An array of the accepted modifier types */
export type ArraySchemaModifiers = (Min<number[]> | Max<number[]> | Custom<unknown>)[]

// Helper type to extract the parsed type from a Parser or array of Parsers
type ExtractParsedType<T> = T extends Parser<infer U, unknown>
  ? U
  : T extends readonly Parser<unknown, unknown>[]
  ? T[number] extends Parser<infer U, unknown>
    ? U
    : never
  : never

// Helper type to get the return type based on schema input
type ArrayReturnType<T> = T extends Parser<unknown, unknown>
  ? ExtractParsedType<T>[]
  : T extends readonly Parser<unknown, unknown>[]
  ? ExtractParsedType<T[number]>[]
  : never

const isValidArray = <TParser>(value: unknown[]): value is ArrayReturnType<TParser> => {
  return Array.isArray(value)
}

export function array<TParser extends Parser<unknown, unknown>>(
  schema: TParser,
  modifiers?: ArraySchemaModifiers,
  message?: { type_error?: string },
): Parser<ExtractParsedType<TParser>[], unknown>

export function array<TParsers extends readonly Parser<unknown, unknown>[]>(
  schema: TParsers,
  modifiers?: ArraySchemaModifiers,
  message?: { type_error?: string },
): Parser<ExtractParsedType<TParsers[number]>[], unknown>

export function array<
  TParser extends Parser<unknown, unknown> | readonly Parser<unknown, unknown>[],
>(
  schema: TParser,
  modifiers: ArraySchemaModifiers = [],
  message?: { type_error?: string },
): Parser<ArrayReturnType<TParser>, unknown> {
  const _schema = Array.isArray(schema) ? schema : [schema]

  return {
    name: 'array' as const,
    parse: (value): ArrayReturnType<TParser> => {
      assert(
        Array.isArray(value),
        new TypeError(message?.type_error || ERROR_CODES.ERR_VAL_8000.message()),
      )

      validateModifiers(value, modifiers)

      const result: unknown[] = value.reduce((acc: unknown[], item: unknown) => {
        // Mixed schema case: Try each parser until one succeeds
        if (_schema.length > 1) {
          let parsed = false
          let lastError: Error | undefined

          for (const parser of _schema) {
            try {
              acc.push(parser.parse(item))
              parsed = true
              break
            } catch (error) {
              lastError = error instanceof Error ? error : new Error(String(error))
              continue
            }
          }

          if (!parsed && lastError) {
            throw lastError
          }
        } else {
          // Single schema case: Use the parser directly
          const parser = _schema[0]
          acc.push(parser.parse(item))
        }

        return acc
      }, [])

      if (isValidArray(result)) {
        return result
      }

      throw new ValidationError('Something went wrong, this should not be reachable')
    },
  }
}
