import { TypeError, ValidationError } from '@/utils/errors/errors'

import { startsWith } from '../startsWith'

describe('startsWith()', () => {
  it('should be named correctly', () => {
    expect(startsWith('test').name).toEqual('startsWith')
  })

  it('should validate strings that start with the prefix', () => {
    const validator = startsWith('test')

    expect(validator.validate('test')).toEqual('test')
    expect(validator.validate('testing')).toEqual('testing')
    expect(validator.validate('test string')).toEqual('test string')
    expect(validator.validate('test123')).toEqual('test123')
    expect(validator.validate('test_case')).toEqual('test_case')
  })

  it('should work with different prefixes', () => {
    expect(startsWith('http://').validate('http://example.com')).toEqual('http://example.com')
    expect(startsWith('https://').validate('https://example.com')).toEqual('https://example.com')
    expect(startsWith('prefix_').validate('prefix_value')).toEqual('prefix_value')
    expect(startsWith('+').validate('+1234567890')).toEqual('+1234567890')
    expect(startsWith('$').validate('$100')).toEqual('$100')
  })

  it('should throw when string does not start with prefix', () => {
    const validator = startsWith('test')

    expect(() => validator.validate('hello test')).toThrowError(
      new TypeError('Value must start with "test"'),
    )
    expect(() => validator.validate('TEST')).toThrowError(
      new TypeError('Value must start with "test"'),
    )
    expect(() => validator.validate('Test')).toThrowError(
      new TypeError('Value must start with "test"'),
    )
    expect(() => validator.validate(' test')).toThrowError(
      new TypeError('Value must start with "test"'),
    )
    expect(() => validator.validate('')).toThrowError(new TypeError('Value must start with "test"'))
  })

  it('should throw on non-string values', () => {
    const validator = startsWith('test')

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
    const validator = startsWith('test', {
      type_error: 'Custom type error',
      prefix_error: 'Must begin with test',
    })

    expect(() => validator.validate('hello')).toThrowError(
      new ValidationError('Must begin with test'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Custom type error'))
  })
})
