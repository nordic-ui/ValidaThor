import { TypeError, ValidationError } from '@/utils/errors/errors'

import { creditCard } from '../creditCard'

describe('creditCard()', () => {
  it('should be named correctly', () => {
    expect(creditCard().name).toEqual('creditCard')
  })

  it('should validate valid credit card numbers', () => {
    const validator = creditCard()

    // Visa
    expect(validator.validate('4111111111111111')).toEqual('4111111111111111')
    expect(validator.validate('4012888888881881')).toEqual('4012888888881881')
    expect(validator.validate('4222222222222')).toEqual('4222222222222')

    // Mastercard
    expect(validator.validate('5555555555554444')).toEqual('5555555555554444')
    expect(validator.validate('5105105105105100')).toEqual('5105105105105100')
    expect(validator.validate('2221000000000009')).toEqual('2221000000000009')

    // American Express
    expect(validator.validate('378282246310005')).toEqual('378282246310005')
    expect(validator.validate('371449635398431')).toEqual('371449635398431')

    // Discover
    expect(validator.validate('6011111111111117')).toEqual('6011111111111117')
    expect(validator.validate('6011000990139424')).toEqual('6011000990139424')

    // JCB
    expect(validator.validate('3530111333300000')).toEqual('3530111333300000')
    expect(validator.validate('3566002020360505')).toEqual('3566002020360505')

    // With spaces and dashes (should be handled)
    expect(validator.validate('4111 1111 1111 1111')).toEqual('4111 1111 1111 1111')
    expect(validator.validate('4111-1111-1111-1111')).toEqual('4111-1111-1111-1111')
    expect(validator.validate('4111 1111-1111 1111')).toEqual('4111 1111-1111 1111')
  })

  it('should throw on invalid credit card numbers', () => {
    const validator = creditCard()

    // Invalid checksum
    expect(() => validator.validate('4111111111111112')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )
    expect(() => validator.validate('5555555555554445')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )
    expect(() => validator.validate('378282246310006')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )

    // Too short
    expect(() => validator.validate('411111111111')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )
    expect(() => validator.validate('123456789012')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )

    // Too long
    expect(() => validator.validate('41111111111111111111')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )
    expect(() => validator.validate('12345678901234567890')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )

    // Not a number
    expect(() => validator.validate('not a credit card')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )
    expect(() => validator.validate('4111-abcd-efgh-ijkl')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )
    expect(() => validator.validate('')).toThrowError(
      new TypeError('Expected a valid credit card number'),
    )
  })

  it('should throw on non-string values', () => {
    const validator = creditCard()

    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(4111111111111111)).toThrowError(
      new TypeError('Expected a string'),
    )
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
    const validator = creditCard({
      type_error: 'Expected a credit card format',
      invalid_error: 'Custom credit card error',
    })

    expect(() => validator.validate('4111111111111112')).toThrowError(
      new TypeError('Custom credit card error'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(
      new ValidationError('Expected a credit card format'),
    )
  })
})
