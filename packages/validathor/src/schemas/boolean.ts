import { validateModifiers } from '@/core/validateModifiers'
import type { Custom } from '@/modifiers/custom'
import { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export type BooleanSchemaArgs = Array<Custom<boolean>>

export const boolean = (
  args?: BooleanSchemaArgs,
  message?: {
    type_error?: string
  },
): Parser<boolean> => ({
  name: 'boolean' as const,
  parse: (value: unknown) => {
    assert(
      typeof value === 'boolean',
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_7000.message()),
    )

    validateModifiers(value, args)

    return value
  },
})
