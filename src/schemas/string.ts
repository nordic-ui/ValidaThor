import { assert } from '../utils/assert'

export const string = (value: string, message?: string) => {
  assert(typeof value === 'string', message || 'Expected a string')

  return value
}
