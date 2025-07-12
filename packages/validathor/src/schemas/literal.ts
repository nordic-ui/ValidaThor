import type { Parser } from '@/types'
import { ValidationError } from '@/utils'
import { ERROR_CODES } from '@/utils/errors/errorCodes'

type Literal = string | number | boolean | null | undefined

// Type guard function to ensure value is valid literal type
const isValidLiteralValue = <TLiteral extends Literal>(
  input: unknown,
  value: TLiteral,
): input is TLiteral => {
  return input === value
}

/**
 * Creates a schema that validates exact literal values
 * @param value The exact literal value to match (string, number, boolean, null, or undefined)
 * @param message Optional custom error messages
 * @returns A parser that validates the exact literal value
 */
export const literal = <TLiteral extends Literal>(
  value: TLiteral,
  message?: {
    error?: string | ((value: unknown) => string)
  },
): Parser<TLiteral> => ({
  name: 'literal' as const,
  parse: (input: unknown) => {
    if (isValidLiteralValue(input, value)) {
      return input
    }

    throw new ValidationError(
      typeof message?.error === 'function'
        ? message?.error(input)
        : message?.error || ERROR_CODES.ERR_VAL_9000.message(),
    )
  },
})
