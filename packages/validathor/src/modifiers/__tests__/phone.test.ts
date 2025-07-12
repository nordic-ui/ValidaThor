import { TypeError, ValidationError } from '@/utils/errors/errors'

import { phone } from '../phone'

describe('phone()', () => {
  it('should be named correctly', () => {
    expect(phone().name).toEqual('phone')
  })

  it('should validate valid phone numbers', () => {
    const validator = phone()

    // US formats
    expect(validator.validate('+1-555-123-4567')).toEqual('+1-555-123-4567')
    expect(validator.validate('1-555-123-4567')).toEqual('1-555-123-4567')
    expect(validator.validate('555-123-4567')).toEqual('555-123-4567')
    expect(validator.validate('(555) 123-4567')).toEqual('(555) 123-4567')
    expect(validator.validate('555.123.4567')).toEqual('555.123.4567')
    expect(validator.validate('5551234567')).toEqual('5551234567')

    // International formats
    expect(validator.validate('+44 20 7946 0958')).toEqual('+44 20 7946 0958')
    expect(validator.validate('+33 1 42 86 82 00')).toEqual('+33 1 42 86 82 00')
    expect(validator.validate('+49 30 12345678')).toEqual('+49 30 12345678')
    expect(validator.validate('+81 3-1234-5678')).toEqual('+81 3-1234-5678')
    expect(validator.validate('+86 10 1234 5678')).toEqual('+86 10 1234 5678')

    // With extensions
    expect(validator.validate('555-123-4567')).toEqual('555-123-4567')
    expect(validator.validate('+1-555-123-4567')).toEqual('+1-555-123-4567')

    // Edge cases
    expect(validator.validate('911')).toEqual('911')
    expect(validator.validate('123')).toEqual('123')
  })

  it('should throw on invalid phone numbers', () => {
    const validator = phone()

    expect(() => validator.validate('not a phone')).toThrowError(
      new TypeError('Expected a valid phone number'),
    )
    expect(() => validator.validate('123-abc-defg')).toThrowError(
      new TypeError('Expected a valid phone number'),
    )
    expect(() => validator.validate('')).toThrowError(
      new TypeError('Expected a valid phone number'),
    )
    expect(() => validator.validate('++1-555-123-4567')).toThrowError(
      new TypeError('Expected a valid phone number'),
    )
    expect(() => validator.validate('1-555-123-456789012345')).toThrowError(
      new TypeError('Expected a valid phone number'),
    )
    expect(() => validator.validate('12')).toThrowError(
      new TypeError('Expected a valid phone number'),
    )
  })

  it('should throw on non-string values', () => {
    const validator = phone()

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
    const validator = phone({
      type_error: 'Expected a phone number',
      invalid_error: 'Custom phone error',
    })

    expect(() => validator.validate('not a phone')).toThrowError(
      new ValidationError('Custom phone error'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Expected a phone number'))
  })
})
