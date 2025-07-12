import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError, ValidationError } from '@/utils/errors/errors'

export type Phone = {
  name: 'phone'
  validate: (value: string) => string
}

/**
 * Used to validate that a string is a valid phone number
 * Supports international format and common variations
 * @param message [optional] The error message to throw if the phone number is invalid
 */
export const phone = (message?: { type_error?: string; invalid_error?: string }): Phone => {
  return {
    name: 'phone' as const,
    validate: (value) => {
      // Regex supports international format with optional country code
      // Allows formats like: +1-555-123-4567, (555) 123-4567, 555.123.4567, +44 20 7946 0958
      const phoneRegex =
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{0,9}$/

      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      // Remove all spaces for validation
      const cleanedValue = value.replace(/\s/g, '')

      assert(
        phoneRegex.test(cleanedValue),
        new ValidationError(message?.invalid_error || 'Expected a valid phone number'),
      )

      return value
    },
  }
}
