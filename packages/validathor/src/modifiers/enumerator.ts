import { assert, TypeError, ValidationError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export type Enumerator<TValue> = {
  name: 'enumerator'
  validate: (value: TValue) => TValue
}

// Support for both array of values and TypeScript enums
type EnumLike =
  | Record<string | number, string | number | Date>
  | readonly (string | number | Date)[]

// Helper to extract enum values (reused from enum schema)
const getEnumValues = (enumObject: EnumLike): (string | number | Date)[] => {
  if (Array.isArray(enumObject)) return [...enumObject]

  // For TypeScript enums, we need to extract the actual enum values
  // while avoiding reverse mappings
  const entries = Object.entries(enumObject)
  const validValues: (string | number | Date)[] = []

  for (const [key, value] of entries) {
    // Skip reverse mappings (where key is a string representation of a number)
    if (!isNaN(Number(key))) continue
    validValues.push(value)
  }

  return validValues
}

/**
 * Used to validate that a value is one of the allowed values from an array or enum
 * @param input An array of allowed values or a TypeScript enum object
 * @param message Optional custom error messages
 * @returns An enumerator modifier that validates values against the allowed list
 */
// Overload for when we can infer it's a string-only enum/array
export function enumerator(input: string[] | readonly string[]): Enumerator<string>
export function enumerator(input: number[] | readonly number[]): Enumerator<number>
export function enumerator(input: Date[] | readonly Date[]): Enumerator<Date>
// Generic fallback for enums (TypeScript can't easily infer these)
export function enumerator(input: EnumLike): Enumerator<string | number>
export function enumerator(
  input: string[] | readonly string[],
  message?: { type_error?: string; error?: string },
): Enumerator<string>
export function enumerator(
  input: number[] | readonly number[],
  message?: { type_error?: string; error?: string },
): Enumerator<number>
export function enumerator(
  input: Date[] | readonly Date[],
  message?: { type_error?: string; error?: string },
): Enumerator<Date>
export function enumerator(
  input: EnumLike,
  message?: { type_error?: string; error?: string },
): Enumerator<string | number | Date>

export function enumerator<TValue extends string | number | Date = string | number | Date>(
  input: EnumLike,
  message?: {
    type_error?: string
    error?: string
  },
): Enumerator<TValue> {
  const allowedValues = getEnumValues(input)

  return {
    name: 'enumerator' as const,
    validate: (value) => {
      // Validation checks
      if (typeof value === 'string') {
        assert(
          !!value.length,
          new ValidationError(message?.error || ERROR_CODES.ERR_VAL_6000.message()),
        )
      }

      // Type checks
      if (typeof value === 'number') {
        assert(
          isFinite(value),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )
      }

      // Inclusion check
      assert(
        allowedValues.includes(value),
        new ValidationError(message?.error || ERROR_CODES.ERR_VAL_6002.message()),
      )

      return value
    },
  }
}
