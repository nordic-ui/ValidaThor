import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, Max, Min } from '@/modifiers'
import { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export type DateSchemaArgs = Array<Min<Date> | Max<Date> | Custom<Date>>

export const date = (args?: DateSchemaArgs, message?: { type_error?: string }): Parser<Date> => ({
  name: 'date' as const,
  parse: (value: unknown) => {
    assert(
      value instanceof Date,
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_3000.message()),
    )

    validateModifiers(value, args)

    return value
  },
})
