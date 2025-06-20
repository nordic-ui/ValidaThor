import { assert } from '@/utils/assert/assert'

export type Custom<TValue> = {
  name: 'custom'
  validate: (value: TValue) => TValue
}

type CustomAssertions<TValue> = (value: TValue) => [boolean | (() => boolean), string | Error][]

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
