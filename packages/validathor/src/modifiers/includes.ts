import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError, ValidationError } from '@/utils/errors/errors'

export type Includes = {
  name: 'includes'
  validate: (value: string) => string
}

/**
 * Used to validate that a string includes a specific substring
 * @param substring The substring that must be included
 * @param message [optional] The error message to throw if the substring is not found
 */
export const includes = (
  substring: string,
  message?: {
    type_error?: string
    include_error?: string
  },
): Includes => {
  return {
    name: 'includes' as const,
    validate: (value) => {
      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      assert(
        value.includes(substring),
        new ValidationError(message?.include_error || `Value must include "${substring}"`),
      )

      return value
    },
  }
}
