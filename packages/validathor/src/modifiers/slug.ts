import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError, ValidationError } from '@/utils/errors/errors'

export type Slug = {
  name: 'slug'
  validate: (value: string) => string
}

/**
 * Used to validate that a string is a valid slug (lowercase, hyphens, no spaces)
 * @param message [optional] The error message to throw if the string is not a valid slug
 */
export const slug = (message?: { type_error?: string; invalid_error?: string }): Slug => {
  return {
    name: 'slug' as const,
    validate: (value) => {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      assert(
        slugRegex.test(value),
        new ValidationError(
          message?.invalid_error ||
            'Expected a valid slug (lowercase letters, numbers, and hyphens only)',
        ),
      )

      return value
    },
  }
}
