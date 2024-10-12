import type { Parser } from '@/types'
import { assert, assertType, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

const isParser = <T>(input: unknown): input is Parser<T> => {
  return input !== null && typeof input === 'object' && 'parse' in input
}

export const tuple = <T extends Parser<unknown>[]>(
  schema: T,
  message?: {
    type_error?: string
  },
): Parser<T[]> => ({
  name: 'tuple' as const,
  parse: (value: unknown): T[] => {
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

    return value.reduce((result: T[], item: T, index) => {
      assertType<Parser<T>>(
        schema[index],
        isParser<T>,
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_0000.message()),
      )
      result.push(schema[index].parse(item))
      return result
    }, [])
  },
})
