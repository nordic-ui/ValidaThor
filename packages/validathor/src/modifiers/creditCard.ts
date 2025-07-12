import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError, ValidationError } from '@/utils/errors/errors'

export type CreditCard = {
  name: 'creditCard'
  validate: (value: string) => string
}

/**
 * Used to validate that a string is a valid credit card number using the Luhn algorithm
 * @param message [optional] The error message to throw if the credit card number is invalid
 */
export const creditCard = (message?: {
  type_error?: string
  invalid_error?: string
}): CreditCard => {
  return {
    name: 'creditCard' as const,
    validate: (value) => {
      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      // Remove all non-digit characters
      const digits = value.replace(/\D/g, '')

      // Check if it's a valid length (13-19 digits)
      if (digits.length < 13 || digits.length > 19) {
        throw new TypeError(message?.type_error || 'Expected a valid credit card number')
      }

      // Luhn algorithm
      let sum = 0
      let isEven = false

      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits.charAt(i), 10)

        if (isEven) {
          digit *= 2
          if (digit > 9) {
            digit -= 9
          }
        }

        sum += digit
        isEven = !isEven
      }

      assert(
        sum % 10 === 0,
        new ValidationError(message?.invalid_error || 'Expected a valid credit card number'),
      )

      return value
    },
  }
}
