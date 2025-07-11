import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, Enumerator, Max, Min } from '@/modifiers'
import type { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export type DateSchemaModifiers = (Min<Date> | Max<Date> | Enumerator<Date> | Custom<Date>)[]

export const date = (
  modifiers: DateSchemaModifiers = [],
  message?: { type_error?: string },
): Parser<Date> => ({
  name: 'date' as const,
  parse: (value) => {
    assert(
      value instanceof Date,
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_3000.message()),
    )

    validateModifiers(value, modifiers)

    return value
  },
})
