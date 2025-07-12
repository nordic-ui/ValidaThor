import { TypeError, ValidationError } from '@/utils/errors/errors'

import { pattern } from '../pattern'

describe('pattern()', () => {
  it('should be named correctly', () => {
    expect(pattern(/test/).name).toEqual('pattern')
  })

  it('should validate strings that match the pattern', () => {
    const validator = pattern(/^[a-z]+$/)

    expect(validator.validate('hello')).toEqual('hello')
    expect(validator.validate('world')).toEqual('world')
    expect(validator.validate('abc')).toEqual('abc')
  })

  it('should work with different patterns', () => {
    // Email-like pattern
    expect(pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).validate('test@example.com')).toEqual(
      'test@example.com',
    )

    // Phone-like pattern
    expect(pattern(/^\d{3}-\d{3}-\d{4}$/).validate('555-123-4567')).toEqual('555-123-4567')

    // Alphanumeric
    expect(pattern(/^[a-zA-Z0-9]+$/).validate('Test123')).toEqual('Test123')

    // Hex color
    expect(pattern(/^#[0-9a-fA-F]{6}$/).validate('#FF5733')).toEqual('#FF5733')

    // URL path
    expect(pattern(/^\/[a-z0-9-/]+$/).validate('/api/v1/users')).toEqual('/api/v1/users')
  })

  it('should work with flags', () => {
    // Case insensitive
    const caseInsensitive = pattern(/^hello$/i)
    expect(caseInsensitive.validate('hello')).toEqual('hello')
    expect(caseInsensitive.validate('HELLO')).toEqual('HELLO')
    expect(caseInsensitive.validate('HeLLo')).toEqual('HeLLo')

    // Multiline
    const multiline = pattern(/^test$/m)
    expect(multiline.validate('test')).toEqual('test')
  })

  it('should throw when string does not match pattern', () => {
    const validator = pattern(/^[a-z]+$/)

    expect(() => validator.validate('Hello')).toThrowError(
      new TypeError('Value must match pattern: ^[a-z]+$'),
    )
    expect(() => validator.validate('123')).toThrowError(
      new TypeError('Value must match pattern: ^[a-z]+$'),
    )
    expect(() => validator.validate('hello world')).toThrowError(
      new TypeError('Value must match pattern: ^[a-z]+$'),
    )
    expect(() => validator.validate('')).toThrowError(
      new TypeError('Value must match pattern: ^[a-z]+$'),
    )
    expect(() => validator.validate('hello!')).toThrowError(
      new TypeError('Value must match pattern: ^[a-z]+$'),
    )
  })

  it('should work with complex patterns', () => {
    // ISO date pattern
    const isoDate = pattern(/^\d{4}-\d{2}-\d{2}$/)
    expect(isoDate.validate('2023-12-25')).toEqual('2023-12-25')
    expect(() => isoDate.validate('12/25/2023')).toThrowError(
      new TypeError('Value must match pattern: ^\\d{4}-\\d{2}-\\d{2}$'),
    )

    // Strong password pattern
    const strongPassword = pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    expect(strongPassword.validate('Test123!')).toEqual('Test123!')
    expect(() => strongPassword.validate('weak')).toThrowError(
      new TypeError(
        'Value must match pattern: ^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
      ),
    )

    // Semantic version pattern
    const semver = pattern(/^\d+\.\d+\.\d+$/)
    expect(semver.validate('1.2.3')).toEqual('1.2.3')
    expect(() => semver.validate('v1.2.3')).toThrowError(
      new TypeError('Value must match pattern: ^\\d+\\.\\d+\\.\\d+$'),
    )
  })

  it('should throw on non-string values', () => {
    const validator = pattern(/test/)

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
    const validator = pattern(/^[A-Z]+$/, {
      type_error: 'Custom type error',
      pattern_error: 'Must be all uppercase letters',
    })

    expect(() => validator.validate('hello')).toThrowError(
      new ValidationError('Must be all uppercase letters'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Custom type error'))
  })

  it('should work with special regex characters', () => {
    // Dot (any character)
    expect(pattern(/^.+$/).validate('anything')).toEqual('anything')

    // Escape special characters
    expect(pattern(/\$\d+\.\d{2}/).validate('$19.99')).toEqual('$19.99')

    // Character classes
    expect(pattern(/^\w+$/).validate('word_123')).toEqual('word_123')
    expect(pattern(/^\d+$/).validate('12345')).toEqual('12345')
    expect(pattern(/^\s+$/).validate('   ')).toEqual('   ')
  })
})
