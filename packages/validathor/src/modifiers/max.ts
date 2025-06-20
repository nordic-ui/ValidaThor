import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError } from '@/utils/errors/errors'

type Input = number | string | Date | (number | string | Date)[]

export type Max<TValue> = {
  name: 'max'
  validate: (value: TValue) => TValue
}

type ErrorMessages = Partial<{
  type_error: string
  max_length_error: string
  error: string
}>

export function max<TValue extends Input>(
  max: TValue extends Date ? Date : number,
  message?: ErrorMessages,
): Max<TValue> {
  return {
    name: 'max' as const,
    validate: (value) => {
      assert(
        typeof value === 'number' ||
          typeof value === 'string' ||
          value instanceof Date ||
          Array.isArray(value),
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_0000.message()),
      )

      if (typeof value === 'number') {
        // Type checks
        assert(
          typeof max === 'number',
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1000.message()),
        )
        assert(
          isFinite(value),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )
        assert(
          isFinite(max),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )

        // Validation checks
        assert(max >= 0, message?.max_length_error || ERROR_CODES.ERR_VAL_0200.message())
        assert(value <= max, message?.error || ERROR_CODES.ERR_VAL_2004.message(String(max)))
      }

      if (typeof value === 'string') {
        // Type checks
        assert(
          typeof max === 'number',
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1000.message()),
        )
        assert(
          isFinite(max),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )

        // Validation checks
        assert(max >= 0, message?.max_length_error || ERROR_CODES.ERR_VAL_0200.message())
        assert(value.length <= max, message?.error || ERROR_CODES.ERR_VAL_2003.message(String(max)))
      }

      if (value instanceof Date) {
        // Type checks
        assert(
          max instanceof Date,
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_3000.message()),
        )

        // Validation checks
        assert(
          !isNaN(max.getTime()),
          message?.max_length_error || ERROR_CODES.ERR_TYP_3002.message(),
        )
        assert(
          value.getTime() <= max.getTime(),
          message?.error || ERROR_CODES.ERR_VAL_3002.message(max.toISOString()),
        )
      }

      if (Array.isArray(value)) {
        // Type checks
        assert(
          typeof max === 'number',
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1000.message()),
        )
        assert(
          isFinite(max),
          new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_1001.message()),
        )

        // Validation checks
        assert(max >= 0, message?.max_length_error || ERROR_CODES.ERR_VAL_0200.message())
        assert(value.length <= max, message?.error || ERROR_CODES.ERR_VAL_8103.message(String(max)))
      }

      return value
    },
  }
}
