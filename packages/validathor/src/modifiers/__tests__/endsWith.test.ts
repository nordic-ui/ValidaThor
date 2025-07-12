import { TypeError } from '@/utils/errors/errors'

import { endsWith } from '../endsWith'

describe('endsWith()', () => {
  it('should be named correctly', () => {
    expect(endsWith('test').name).toEqual('endsWith')
  })

  it('should validate strings that end with the suffix', () => {
    const validator = endsWith('test')

    expect(validator.validate('test')).toEqual('test')
    expect(validator.validate('mytest')).toEqual('mytest')
    expect(validator.validate('string test')).toEqual('string test')
    expect(validator.validate('123test')).toEqual('123test')
    expect(validator.validate('unit_test')).toEqual('unit_test')
  })

  it('should work with different suffixes', () => {
    expect(endsWith('.com').validate('example.com')).toEqual('example.com')
    expect(endsWith('.pdf').validate('document.pdf')).toEqual('document.pdf')
    expect(endsWith('!').validate('Hello World!')).toEqual('Hello World!')
    expect(endsWith('ing').validate('testing')).toEqual('testing')
    expect(endsWith('?').validate('How are you?')).toEqual('How are you?')
  })

  it('should throw when string does not end with suffix', () => {
    const validator = endsWith('test')

    expect(() => validator.validate('test hello')).toThrowError(
      new TypeError('Value must end with "test"'),
    )
    expect(() => validator.validate('TEST')).toThrowError(
      new TypeError('Value must end with "test"'),
    )
    expect(() => validator.validate('Test')).toThrowError(
      new TypeError('Value must end with "test"'),
    )
    expect(() => validator.validate('test ')).toThrowError(
      new TypeError('Value must end with "test"'),
    )
    expect(() => validator.validate('')).toThrowError(new TypeError('Value must end with "test"'))
  })

  it('should throw on non-string values', () => {
    const validator = endsWith('test')

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
    const validator = endsWith('test', {
      type_error: 'Custom type error',
      suffix_error: 'Must finish with test',
    })

    expect(() => validator.validate('hello')).toThrowError(new TypeError('Must finish with test'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Custom type error'))
  })
})
