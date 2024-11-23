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

export const array = <T extends AcceptedParserPrimitives>(
  schema: MaybeArray<MixedParser<T>>,
  modifiers: ArraySchemaModifiers = [],
  message?: { type_error?: string },
): Parser<T[]> => {
  const _schema = Array.isArray(schema) ? schema : [schema]

  return {
    name: 'array' as const,
    parse: (value): T[] => {
      assert(
        Array.isArray(value),
        new TypeError(message?.type_error || ERROR_CODES.ERR_VAL_8000.message()),
      )

      validateModifiers(value, modifiers)

      // Use reduce to ensure the type is correctly inferred
      const result: T[] = value.reduce((acc: unknown[], item: AcceptedParserPrimitives, index) => {
        const parser = _schema[index % _schema.length] // Handle cyclic schema application
        acc.push(parser.parse(item))
        return acc
      }, [])

      return result
    },
  }
}
