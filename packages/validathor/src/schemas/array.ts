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
  | Array<AcceptedParserPrimitives>

type ParserMap = {
  string: Parser<string>
  number: Parser<number>
  boolean: Parser<boolean>
  Date: Parser<Date>
  object: Parser<object>
  Array: Parser<Array<AcceptedParserPrimitives>>
}

type GetParser<T> = T extends keyof ParserMap ? ParserMap[T] : never
type MixedParser<T> = T extends AcceptedParserPrimitives ? GetParser<keyof ParserMap & T> : never

export const array = <T extends AcceptedParserPrimitives>(
  schema: MaybeArray<MixedParser<T>>,
  modifiers: ArraySchemaModifiers = [],
  message?: { type_error?: string },
): Parser<T[]> => {
  const _schema = Array.isArray(schema) ? schema : [schema]

  assert(
    Array.isArray(_schema),
    new TypeError(message?.type_error || ERROR_CODES.ERR_VAL_8000.message()),
  )

  return {
    name: 'array' as const,
    parse: (value): T[] => {
      assert(
        Array.isArray(value),
        new TypeError(message?.type_error || ERROR_CODES.ERR_VAL_8000.message()),
      )

      validateModifiers(value, modifiers)

      // return value.reduce((result: T[], item: unknown, index: number) => {
      //   const parser = _schema[index % _schema.length]
      //   const parsedItem = parser.parse(item as any)
      //   validateModifiers([parsedItem], [modifiers[index % modifiers.length]])
      //   result.push(parsedItem)
      //   return result
      // }, [])

      return value.reduce((result: T[], item: unknown) => {
        _schema.forEach((s) => result.push(s.parse(item)))
        return result
      }, [])
    },
  }
}
