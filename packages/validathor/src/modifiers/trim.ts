import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError } from '@/utils/errors/errors'

export type Trim = {
  name: 'trim'
  validate: (value: string) => string
}

/**
 * Used to trim whitespace from the beginning and end of a string
 * @param message [optional] The error message to throw if the value is not a string
 */
export const trim = (message?: { type_error?: string }): Trim => {
  return {
    name: 'trim' as const,
    validate: (value) => {
      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      return value.trim()
    },
  }
}
