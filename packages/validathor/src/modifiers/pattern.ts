import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError, ValidationError } from '@/utils/errors/errors'

export type Pattern = {
  name: 'pattern'
  validate: (value: string) => string
}

/**
 * Used to validate that a string matches a regular expression pattern
 * @param regex The regular expression pattern to match against
 * @param message [optional] The error message to throw if the pattern doesn't match
 */
export const pattern = (
  regex: RegExp,
  message?: {
    type_error?: string
    pattern_error?: string
  },
): Pattern => {
  return {
    name: 'pattern' as const,
    validate: (value) => {
      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      assert(
        regex.test(value),
        new ValidationError(message?.pattern_error || `Value must match pattern: ${regex.source}`),
      )

      return value
    },
  }
}
