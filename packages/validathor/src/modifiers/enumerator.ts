import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError } from '@/utils/errors/errors'

export type Enumerator<T> = {
  name: 'enumerator'
  validate: (value: T) => T
}

// Overload definitions
export function enumerator(
  input: Array<string>,
  message?: {
    type_error?: string
    error?: string
  },
): Enumerator<string>

export function enumerator(
  input: Array<number>,
  message?: {
    type_error?: string
    error?: string
  },
): Enumerator<number>

// TODO: Add support for date and object types maybe?
export function enumerator<T extends string | number>(
  input: T[],
  message?: {
    type_error?: string
    error?: string
  },
): Enumerator<T> {
  return {
    name: 'enumerator' as const,
    validate: (value: T) => {
      // Type checks
      assert(
        input.includes(value),
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_0000.message()),
      )

      // Validation checks
      if (typeof value === 'string') {
        assert(value.length !== 0, message?.error || ERROR_CODES.ERR_VAL_6000.message())
      } else if (typeof value === 'number') {
        assert(
          isFinite(value),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )
      }

      return value
    },
  }
}
