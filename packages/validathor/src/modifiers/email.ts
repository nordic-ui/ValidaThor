import { assert } from '@/utils/assert'
import { TypeError } from '@/utils/errors'

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
    error?: string
    domain_error?: string
  },
): Email => {
  return {
    name: 'email',
    validate: (value: string) => {
      const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      // Type checks
      assert(typeof value === 'string', new TypeError(message?.type_error || 'Expected a string'))
      assert(emailRegex.test(value), new TypeError(message?.type_error || 'Expected an email'))

      // Validation checks
      if (domain)
        assert(
          value.endsWith(domain),
          message?.domain_error || `Expected an email ending with ${domain}`,
        )

      return value
    },
  }
}
