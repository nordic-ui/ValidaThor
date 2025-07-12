import type { Parser } from '@/types'
import { assert, TypeError, ValidationError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

// Support for both array of values and TypeScript enums
type EnumLike = Record<string | number, string | number> | readonly (string | number)[]

// Helper to extract enum values
const getEnumValues = (enumObject: EnumLike): (string | number)[] => {
  if (Array.isArray(enumObject)) {
    return [...enumObject]
  }

  // For TypeScript enums, we need to extract the actual enum values
  // while avoiding reverse mappings
  const entries = Object.entries(enumObject)
  const validValues: (string | number)[] = []

  for (const [key, value] of entries) {
    // Skip reverse mappings (where key is a string representation of a number)
    if (!isNaN(Number(key))) {
      continue
    }
    validValues.push(value)
  }

  return validValues
}

// Infer the correct return type from the enum
type InferEnumType<TEnum extends EnumLike> = TEnum extends readonly (infer U)[]
  ? U
  : TEnum extends Record<string | number, infer V>
  ? V
  : never

// Type guard function to ensure value is valid enum type
const isValidEnumValue = <TEnum extends EnumLike>(
  value: string | number,
  allowedValues: (string | number)[],
): value is InferEnumType<TEnum> => {
  return allowedValues.includes(value)
}

/**
 * Creates a schema that validates enum values (TypeScript enums or value arrays)
 * @param enumObject A TypeScript enum object or an array of allowed values
 * @param message Optional custom error messages
 * @returns A parser that validates values against the enum
 */
export const enum_ = <TEnum extends EnumLike>(
  enumObject: TEnum,
  message?: {
    type_error?: string
    error?: string | ((value: string | number) => string)
  },
): Parser<InferEnumType<TEnum>> => {
  const allowedValues = getEnumValues(enumObject)

  return {
    name: 'enum' as const,
    parse: (value) => {
      assert(
        typeof value === 'string' || typeof value === 'number',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_6000.message()),
      )

      if (isValidEnumValue<TEnum>(value, allowedValues)) {
        return value
      }

      throw new ValidationError(
        typeof message?.error === 'function'
          ? message?.error(value)
          : message?.error || ERROR_CODES.ERR_VAL_6001.message(),
      )
    },
  }
}

export { enum_ as enum }
