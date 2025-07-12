import { validateModifiers } from '@/core/validateModifiers'
import type { Custom, Enumerator, Max, Min } from '@/modifiers'
import type { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export type NumberSchemaModifiers = (
  | Min<number>
  | Max<number>
  | Enumerator<number>
  | Custom<number>
)[]

/**
 * Creates a schema that validates finite number values
 * @param modifiers Optional modifiers like min/max validation
 * @param message Optional custom error messages
 * @returns A parser that validates finite numbers
 */
export const number = (
  modifiers: NumberSchemaModifiers = [],
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

    validateModifiers(value, modifiers)

    return value
  },
})
