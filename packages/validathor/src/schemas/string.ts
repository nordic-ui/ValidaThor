import { validateModifiers } from '@/core/validateModifiers'
import type {
  CreditCard,
  Custom,
  Email,
  EndsWith,
  Enumerator,
  Includes,
  Ip,
  Max,
  Min,
  Pattern,
  Phone,
  Slug,
  StartsWith,
  Trim,
  Url,
  Uuid,
} from '@/modifiers'
import type { Parser } from '@/types'
import { assert, TypeError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

/** An array of the accepted modifier types */
export type StringSchemaModifiers = (
  | Min<string>
  | Max<string>
  | Email
  | Enumerator<string>
  | Custom<string>
  | Url
  | Uuid
  | Phone
  | Ip
  | CreditCard
  | Trim
  | Includes
  | StartsWith
  | EndsWith
  | Slug
  | Pattern
)[]

/**
 * Creates a schema that validates non-empty string values
 * @param modifiers Optional modifiers for additional validation and transformation
 * @param message Optional custom error messages
 * @returns A parser that validates non-empty strings
 */
export const string = (
  modifiers: StringSchemaModifiers = [],
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

    validateModifiers(value, modifiers)

    return value
  },
})
