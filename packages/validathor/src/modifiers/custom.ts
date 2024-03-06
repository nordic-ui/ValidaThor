import { assert } from '@/utils/assert'

export type Custom<T> = {
  name: 'custom'
  validate: (value: T) => T
}

type CustomAssertions<T> = (value: T) => Array<[boolean | (() => boolean), string | Error]>

export const custom = <T>(assertions: CustomAssertions<T>): Custom<T> => {
  return {
    name: 'custom',
    validate: (value) => {
      // Validation checks
      assertions(value as T).forEach((assertion) => {
        const [condition, errorMessage] = assertion
        assert(condition, errorMessage)
      })

      return value
    },
  }
}
