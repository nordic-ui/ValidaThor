import { assert, TypeError, ValidationError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

export type Enumerator<TValue> = {
  name: 'enumerator'
  validate: (value: TValue) => TValue
}

// Support for both array of values and TypeScript enums
type EnumLike = Record<string | number, string | number> | readonly (string | number)[]

// Helper to extract enum values (reused from enum schema)
const getEnumValues = (enumObject: EnumLike): (string | number)[] => {
  if (Array.isArray(enumObject)) return [...enumObject]

  // For TypeScript enums, we need to extract the actual enum values
  // while avoiding reverse mappings
  const entries = Object.entries(enumObject)
  const validValues: (string | number)[] = []

  for (const [key, value] of entries) {
    // Skip reverse mappings (where key is a string representation of a number)
    if (!isNaN(Number(key))) continue
    validValues.push(value)
  }

  return validValues
}

// Overload for when we can infer it's a string-only enum/array
export function enumerator(input: string[] | readonly string[]): Enumerator<string>
export function enumerator(input: number[] | readonly number[]): Enumerator<number>
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
  input: EnumLike,
  message?: { type_error?: string; error?: string },
): Enumerator<string | number>

export function enumerator<TValue extends string | number = string | number>(
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
