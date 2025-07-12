import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError, ValidationError } from '@/utils/errors/errors'

export type StartsWith = {
  name: 'startsWith'
  validate: (value: string) => string
}

/**
 * Used to validate that a string starts with a specific prefix
 * @param prefix The prefix that the string must start with
 * @param message [optional] The error message to throw if the string doesn't start with the prefix
 */
export const startsWith = (
  prefix: string,
  message?: {
    type_error?: string
    prefix_error?: string
  },
): StartsWith => {
  return {
    name: 'startsWith' as const,
    validate: (value) => {
      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      assert(
        value.startsWith(prefix),
        new ValidationError(message?.prefix_error || `Value must start with "${prefix}"`),
      )

      return value
    },
  }
}
