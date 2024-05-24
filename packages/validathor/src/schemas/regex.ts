import { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export const regex = (message?: { type_error?: string }): Parser<RegExp> => ({
  name: 'regex' as const,
  parse: (value: unknown) => {
    assert(
      value instanceof RegExp,
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_4000.message()),
    )

    return value
  },
})
