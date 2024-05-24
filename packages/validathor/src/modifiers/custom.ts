import { assert } from '@/utils/assert/assert'

export type Custom<T> = {
  name: 'custom'
  validate: (value: T) => T
}

type CustomAssertions<T> = (value: T) => Array<[boolean | (() => boolean), string | Error]>

export const custom = <T = unknown>(assertions: CustomAssertions<T>): Custom<T> => {
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
