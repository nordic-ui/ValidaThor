import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError, ValidationError } from '@/utils/errors/errors'

export type Url = {
  name: 'url'
  validate: (value: string) => string
}

/**
 * Used to validate that a string is a valid URL
 * @param message [optional] The error message to throw if the URL is invalid
 */
export const url = (message?: { type_error?: string; invalid_error?: string }): Url => {
  return {
    name: 'url' as const,
    validate: (value) => {
      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      try {
        new URL(value)
        return value
      } catch {
        throw new ValidationError(message?.invalid_error || 'Expected a valid URL')
      }
    },
  }
}
