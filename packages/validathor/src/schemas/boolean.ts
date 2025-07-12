import { validateModifiers } from '@/core/validateModifiers'
import type { Custom } from '@/modifiers/custom'
import type { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export type BooleanSchemaModifiers = Custom<boolean>[]

/**
 * Creates a schema that validates boolean values
 * @param modifiers Optional modifiers to apply additional validation
 * @param message Optional custom error messages
 * @returns A parser that validates boolean values
 */
export const boolean = (
  modifiers: BooleanSchemaModifiers = [],
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

    validateModifiers(value, modifiers)

    return value
  },
})
