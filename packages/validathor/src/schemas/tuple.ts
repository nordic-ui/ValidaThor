import { isParser } from '@/guards'
import type { Parser } from '@/types'
import { assert, assertType, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export const tuple = <TSchema extends Parser<unknown>[]>(
  schema: TSchema,
  message?: {
    type_error?: string
  },
): Parser<TSchema[]> => ({
  name: 'tuple' as const,
  parse: (value): TSchema[] => {
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

    return value.reduce((result: TSchema[], item: TSchema, index) => {
      const schemaItem = schema[index]

      assertType<Parser<TSchema>>(
        schemaItem,
        isParser<Parser<TSchema>>,
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_0000.message()),
      )

      result.push(schemaItem.parse(item))
      return result
    }, [])
  },
})
