import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError, ValidationError } from '@/utils/errors/errors'

export type EndsWith = {
  name: 'endsWith'
  validate: (value: string) => string
}

/**
 * Used to validate that a string ends with a specific suffix
 * @param suffix The suffix that the string must end with
 * @param message [optional] The error message to throw if the string doesn't end with the suffix
 */
export const endsWith = (
  suffix: string,
  message?: {
    type_error?: string
    suffix_error?: string
  },
): EndsWith => {
  return {
    name: 'endsWith' as const,
    validate: (value) => {
      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      assert(
        value.endsWith(suffix),
        new ValidationError(message?.suffix_error || `Value must end with "${suffix}"`),
      )

      return value
    },
  }
}
