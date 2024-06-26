import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, Enumerator, Max, Min } from '@/modifiers'
import { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export type NumberSchemaArgs = Array<
  Min<number> | Max<number> | Enumerator<number> | Custom<number>
>

export const number = (
  args?: NumberSchemaArgs,
  message?: {
    type_error?: string
  },
): Parser<number> => ({
  name: 'number' as const,
  parse: (value: unknown) => {
    assert(
      typeof value === 'number',
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1000.message()),
    )
    assert(
      isFinite(value),
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
    )

    validateModifiers(value, args)

    return value
  },
})
