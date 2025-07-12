import { TypeError, ValidationError } from '@/utils/errors/errors'

import { slug } from '../slug'

describe('slug()', () => {
  it('should be named correctly', () => {
    expect(slug().name).toEqual('slug')
  })

  it('should validate valid slugs', () => {
    const validator = slug()

    expect(validator.validate('hello')).toEqual('hello')
    expect(validator.validate('hello-world')).toEqual('hello-world')
    expect(validator.validate('my-awesome-post')).toEqual('my-awesome-post')
    expect(validator.validate('123')).toEqual('123')
    expect(validator.validate('post-123')).toEqual('post-123')
    expect(validator.validate('a')).toEqual('a')
    expect(validator.validate('a-b-c-d-e')).toEqual('a-b-c-d-e')
    expect(validator.validate('product-123-version-2')).toEqual('product-123-version-2')
  })

  it('should throw on invalid slugs', () => {
    const validator = slug()

    // Uppercase letters
    expect(() => validator.validate('Hello')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('hello-World')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('HELLO')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )

    // Spaces
    expect(() => validator.validate('hello world')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate(' hello')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('hello ')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )

    // Special characters
    expect(() => validator.validate('hello_world')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('hello.world')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('hello@world')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('hello!world')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('hello/world')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )

    // Invalid hyphen usage
    expect(() => validator.validate('-hello')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('hello-')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('hello--world')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
    expect(() => validator.validate('-')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )

    // Empty string
    expect(() => validator.validate('')).toThrowError(
      new TypeError('Expected a valid slug (lowercase letters, numbers, and hyphens only)'),
    )
  })

  it('should throw on non-string values', () => {
    const validator = slug()

    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(null)).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(undefined)).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate({})).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate([])).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(true)).toThrowError(new TypeError('Expected a string'))
  })

  it('should use custom error messages', () => {
    const validator = slug({
      type_error: 'Expected a valid slug',
      invalid_error: 'Custom slug error',
    })

    expect(() => validator.validate('Hello World')).toThrowError(
      new ValidationError('Custom slug error'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Expected a valid slug'))
  })
})
