import { assert } from '@/utils/assert/assert'

export type Custom<TValue> = {
  name: 'custom'
  validate: (value: TValue) => TValue
}

type CustomAssertions<TValue> = (value: TValue) => [boolean | (() => boolean), string | Error][]

/**
 * Used to create custom validation rules with user-defined assertions
 * @param assertions A function that returns an array of assertion tuples, each containing a condition and error message
 * @returns A custom modifier that validates values according to the provided assertions
 */
export const custom = <TValue = unknown>(assertions: CustomAssertions<TValue>): Custom<TValue> => {
  return {
    name: 'custom' as const,
    validate: (value) => {
      // Validation checks
      assertions(value).forEach(([condition, errorMessage]) => {
        assert(condition, errorMessage)
      })

      return value
    },
  }
}
