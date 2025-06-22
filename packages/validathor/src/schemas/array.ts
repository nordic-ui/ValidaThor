import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, Max, Min } from '@/modifiers'
import type { MaybeArray, Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

/** An array of the accepted modifier types */
export type ArraySchemaModifiers = (Min<number[]> | Max<number[]> | Custom<unknown>)[]

type AcceptedParserPrimitives =
  | string
  | number
  | boolean
  | Date
  | object
  | AcceptedParserPrimitives[]

type ParserMap = {
  string: Parser<string>
  number: Parser<number>
  boolean: Parser<boolean>
  Date: Parser<Date>
  object: Parser<object>
  Array: Parser<AcceptedParserPrimitives[]>
}

type PrimitiveTypeMap = {
  string: 'string'
  number: 'number'
  boolean: 'boolean'
  Date: 'Date'
  object: 'object'
}

// Ensure PrimitiveTypeName returns only valid keys of ParserMap
type PrimitiveTypeName<T extends AcceptedParserPrimitives> = T extends keyof PrimitiveTypeMap
  ? PrimitiveTypeMap[T]
  : never

// Now, define the GetParser type function that retrieves the correct parser based on T
type GetParser<T extends AcceptedParserPrimitives> = T extends (infer U)[]
  ? Parser<U[]>
  : PrimitiveTypeName<T> extends keyof ParserMap
  ? ParserMap[PrimitiveTypeName<T>] extends Parser<infer U>
    ? Parser<U>
    : never
  : never

type MixedParser<T extends AcceptedParserPrimitives> = GetParser<T>

export const array = <TSchema extends AcceptedParserPrimitives>(
  schema: MaybeArray<MixedParser<TSchema>>,
  modifiers: ArraySchemaModifiers = [],
  message?: { type_error?: string },
): Parser<TSchema[]> => {
  const _schema = Array.isArray(schema) ? schema : [schema]

  return {
    name: 'array' as const,
    parse: (value): TSchema[] => {
      assert(
        Array.isArray(value),
        new TypeError(message?.type_error || ERROR_CODES.ERR_VAL_8000.message()),
      )

      validateModifiers(value, modifiers)

      const result: TSchema[] = value.reduce((acc: unknown[], item: AcceptedParserPrimitives) => {
        // For mixed schemas, try each parser until one succeeds
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
          // Single schema case - use the parser directly
          const parser = _schema[0]
          acc.push(parser.parse(item))
        }

        return acc
      }, [])

      return result
    },
  }
}
