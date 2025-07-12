import { TypeError } from '@/utils/errors/errors'

import { trim } from '../trim'

describe('trim()', () => {
  it('should be named correctly', () => {
    expect(trim().name).toEqual('trim')
  })

  it('should trim whitespace from strings', () => {
    const validator = trim()

    expect(validator.validate('  hello  ')).toEqual('hello')
    expect(validator.validate('\thello\t')).toEqual('hello')
    expect(validator.validate('\nhello\n')).toEqual('hello')
    expect(validator.validate('  hello world  ')).toEqual('hello world')
    expect(validator.validate('hello')).toEqual('hello')
    expect(validator.validate('   ')).toEqual('')
    expect(validator.validate('\t\n  \r')).toEqual('')
    expect(validator.validate('  multiple   spaces   inside  ')).toEqual(
      'multiple   spaces   inside',
    )
  })

  it('should throw on non-string values', () => {
    const validator = trim()

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
    const validator = trim({ type_error: 'Custom trim error' })

    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Custom trim error'))
  })
})
