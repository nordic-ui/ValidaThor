import { Parser } from '@/types'
import { assert, TypeError, ValidationError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export type EnumSchemaArgs = Array<string | number>

export const enum_ = (
  args?: EnumSchemaArgs,
  message?: {
    type_error?: string
    error?: string | ((value: string | number) => string)
  },
): Parser<string | number> => ({
  name: 'enum' as const,
  parse: (value: unknown) => {
    assert(
      typeof value === 'string' || typeof value === 'number',
      new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_6000.message()),
    )

    assert(
      (args ?? []).includes(value),
      new ValidationError(
        typeof message?.error === 'function'
          ? message?.error(value)
          : message?.error || ERROR_CODES.ERR_TYP_0000.message(),
      ),
    )

    return value
  },
})
