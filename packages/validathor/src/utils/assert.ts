import { ValidationError } from './errors'

/**
 * Asserts that a condition is true, otherwise throws a ValidationError
 * @param condition A boolean or a function that returns a boolean
 * @param message A string or an Error
 */
export function assert(
  condition: boolean | (() => boolean),
  message: string | Error,
): asserts condition {
  const _condition = typeof condition === 'function' ? condition() : condition
  if (!_condition) {
    throw typeof message === 'string' ? new ValidationError(message) : message
  }
}
