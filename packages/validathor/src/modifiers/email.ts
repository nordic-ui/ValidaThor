import { assert } from '../utils/assert'

export type Email = {
  name: 'email'
  validate: (value: string) => string
}

/**
 * Used to validate that a string is an email
 * @param domain [optional] The domain that the email should end with
 * @param message [optional] The error message to display if the email is invalid
 */
export const email = (domain?: `@${string}`, message?: string): Email => {
  const errorMessage = message
    ? message
    : domain
    ? `Expected an email ending with ${domain}`
    : 'Expected an email'

  return {
    name: 'email',
    validate: (value: string) => {
      const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      assert(emailRegex.test(value), errorMessage)
      if (domain) {
        assert(value.endsWith(domain), errorMessage)
      }
      return value
    },
  }
}
