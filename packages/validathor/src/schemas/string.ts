import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, Email, Max, Min } from '@/modifiers'
import { Enumerator } from '@/modifiers/enumerator'
import { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

/** An array of the accepted modifier types */
export type StringSchemaArgs = Array<
  Min<string> | Max<string> | Email | Enumerator<string> | Custom<string>
>

export const string = (
  args?: StringSchemaArgs,
  message?: {
    type_error?: string
  },
): Parser<string> => ({
  name: 'string' as const,
  parse: (value: unknown) => {
    assert(
      typeof value === 'string',
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
    )
    assert(value !== '', new TypeError(message?.type_error || ERROR_CODES.ERR_VAL_2000.message()))

    validateModifiers(value, args)

    return value
  },
})
