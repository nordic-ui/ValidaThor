import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError } from '@/utils/errors/errors'

export type Uuid = {
  name: 'uuid'
  validate: (value: string) => string
}

/**
 * Used to validate that a string is a valid UUID
 * @param message [optional] The error message to throw if the UUID is invalid
 */
export const uuid = (message?: { type_error?: string; invalid_error?: string }): Uuid => {
  return {
    name: 'uuid' as const,
    validate: (value) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      assert(
        uuidRegex.test(value),
        new TypeError(message?.invalid_error || 'Expected a valid UUID'),
      )

      return value
    },
  }
}
