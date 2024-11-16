import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError } from '@/utils/errors/errors'

export type Email = {
  name: 'email'
  validate: (value: string) => string
}

/**
 * Used to validate that a string is an email
 * @param domain [optional] The domain that the email should end with
 * @param message [optional] The error message to throw if the email is invalid
 */
export const email = (
  domain?: `@${string}`,
  message?: {
    type_error?: string
    domain_error?: string
  },
): Email => {
  return {
    name: 'email' as const,
    validate: (value) => {
      const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      // Type checks
      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )
      assert(
        emailRegex.test(value),
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2001.message()),
      )

      // Validation checks
      if (domain)
        assert(
          value.endsWith(domain),
          message?.domain_error || ERROR_CODES.ERR_VAL_2005.message(domain),
        )

      return value
    },
  }
}
