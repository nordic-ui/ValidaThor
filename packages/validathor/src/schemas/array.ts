import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, Max, Min } from '@/modifiers'
import type { MaybeArray, Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

/** An array of the accepted modifier types */
export type ArraySchemaModifiers = (Min<number[]> | Max<number[]> | Custom<unknown>)[]

export const array = <T>(
  schema: MaybeArray<Parser<T>>,
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
    parse: (value: unknown): T[] => {
      assert(
        Array.isArray(value),
        new TypeError(message?.type_error || ERROR_CODES.ERR_VAL_8000.message()),
      )

      validateModifiers(value, modifiers)

      return value.reduce((result: T[], item: unknown) => {
        _schema.forEach((s) => result.push(s.parse(item)))
        return result
      }, [])
    },
  }
}
