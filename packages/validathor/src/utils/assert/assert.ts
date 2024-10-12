import { TypeError, ValidationError } from '../errors/errors'

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

/**
 * Type guard function type.
 *
 * @internal Should not be exported.
 */
type TypeGuard<T> = (input: unknown) => input is T

/**
 * Asserts the type of input to be of `T`.
 *
 * This is preferable to using `as` for type casting.
 * @param input - The input to be checked.
 * @param guard - The type guard function to validate the input.
 * @param message A string or an Error
 * @throws {Error} - Will throw an error if the input does not match the type `T`.
 */
export function assertType<T>(
  input: unknown,
  guard: TypeGuard<T>,
  message: string | Error,
): asserts input is T {
  if (!guard(input)) {
    throw typeof message === 'string' ? new TypeError(message) : message
  }
}
