import { HelperReturnType } from '../types'

/**
 * Used to validate that a string is an email
 * @param domain [optional] The domain that the email should end with
 * @param message [optional] The error message to display if the email is invalid
 */
export const email = (domain?: `@${string}`, message?: string): HelperReturnType => {
  const errorMessage = !!message
    ? message
    : domain
    ? `Expected an email ending with ${domain}`
    : 'Expected an email'
  return {
    name: 'email',
    args: { domain, message: errorMessage },
  }
}
