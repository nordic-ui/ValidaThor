import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError } from '@/utils/errors/errors'

type Input = number | string | Date | (number | string | Date)[]

export type Min<TValue> = {
  name: 'min'
  validate: (value: TValue) => TValue
}

type ErrorMessages = Partial<{
  type_error: string
  min_length_error: string
  error: string
}>

export function min<TValue extends Input>(
  min: TValue extends Date ? Date : number,
  message?: ErrorMessages,
): Min<TValue> {
  return {
    name: 'min' as const,
    validate: (value) => {
      assert(
        typeof value === 'number' ||
          typeof value === 'string' ||
          value instanceof Date ||
          Array.isArray(value),
        new TypeError(message?.type_error || ERROR_CODES['ERR_TYP_0000'].message()),
      )

      if (typeof value === 'number') {
        // Type checks
        assert(
          typeof min === 'number',
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1000.message()),
        )
        assert(
          isFinite(value),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )
        assert(
          isFinite(min),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )

        // Validation checks
        assert(min >= 0, message?.min_length_error || ERROR_CODES.ERR_VAL_0100.message())
        assert(value >= min, message?.error || ERROR_CODES.ERR_VAL_2002.message(String(min)))
      }

      if (typeof value === 'string') {
        // Type checks
        assert(
          typeof min === 'number',
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1000.message()),
        )
        assert(
          isFinite(min),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )

        // Validation checks
        assert(min >= 0, message?.min_length_error || ERROR_CODES.ERR_VAL_0100.message())
        assert(value.length >= min, message?.error || ERROR_CODES.ERR_VAL_2001.message(String(min)))
      }

      if (value instanceof Date) {
        // Type checks
        assert(
          min instanceof Date,
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_3000.message()),
        )

        // Validation checks
        assert(
          !isNaN(min.getTime()),
          message?.min_length_error || ERROR_CODES.ERR_TYP_3001.message(),
        )
        assert(
          value.getTime() >= min.getTime(),
          message?.error || ERROR_CODES.ERR_VAL_3001.message(min.toISOString()),
        )
      }

      if (Array.isArray(value)) {
        // Type checks
        assert(
          typeof min === 'number',
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1000.message()),
        )
        assert(
          isFinite(min),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )

        // Validation checks
        assert(min >= 0, message?.min_length_error || ERROR_CODES.ERR_VAL_0100.message())
        assert(value.length >= min, message?.error || ERROR_CODES.ERR_VAL_8101.message(String(min)))
      }

      return value
    },
  }
}
