import { TypeError } from '@/utils/errors/errors'

import { includes } from '../includes'

describe('includes()', () => {
  it('should be named correctly', () => {
    expect(includes('test').name).toEqual('includes')
  })

  it('should validate strings that include the substring', () => {
    const validator = includes('test')

    expect(validator.validate('test')).toEqual('test')
    expect(validator.validate('testing')).toEqual('testing')
    expect(validator.validate('a test string')).toEqual('a test string')
    expect(validator.validate('untested')).toEqual('untested')
    expect(validator.validate('TEST test TEST')).toEqual('TEST test TEST')
  })

  it('should work with different substrings', () => {
    expect(includes('foo').validate('foobar')).toEqual('foobar')
    expect(includes('bar').validate('foobar')).toEqual('foobar')
    expect(includes(' ').validate('hello world')).toEqual('hello world')
    expect(includes('.com').validate('example.com')).toEqual('example.com')
    expect(includes('@').validate('user@example.com')).toEqual('user@example.com')
  })

  it('should throw when substring is not found', () => {
    const validator = includes('test')

    expect(() => validator.validate('hello')).toThrowError(
      new TypeError('Value must include "test"'),
    )
    expect(() => validator.validate('TEST')).toThrowError(
      new TypeError('Value must include "test"'),
    )
    expect(() => validator.validate('')).toThrowError(new TypeError('Value must include "test"'))
    expect(() => validator.validate('tes')).toThrowError(new TypeError('Value must include "test"'))
  })

  it('should throw on non-string values', () => {
    const validator = includes('test')

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
    const validator = includes('test', {
      type_error: 'Custom type error',
      include_error: 'Must contain the word test',
    })

    expect(() => validator.validate('hello')).toThrowError(
      new TypeError('Must contain the word test'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Custom type error'))
  })
})
