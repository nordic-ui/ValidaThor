import { TypeError, ValidationError } from '@/utils/errors/errors'

import { url } from '../url'

describe('url()', () => {
  it('should be named correctly', () => {
    expect(url().name).toEqual('url')
  })

  it('should validate valid URLs', () => {
    const validator = url()

    expect(validator.validate('https://example.com')).toEqual('https://example.com')
    expect(validator.validate('http://example.com')).toEqual('http://example.com')
    expect(validator.validate('https://example.com/path')).toEqual('https://example.com/path')
    expect(validator.validate('https://example.com/path?query=value')).toEqual(
      'https://example.com/path?query=value',
    )
    expect(validator.validate('https://example.com:8080')).toEqual('https://example.com:8080')
    expect(validator.validate('ftp://example.com')).toEqual('ftp://example.com')
    expect(validator.validate('https://subdomain.example.com')).toEqual(
      'https://subdomain.example.com',
    )
    expect(validator.validate('https://example.com/path/to/resource')).toEqual(
      'https://example.com/path/to/resource',
    )
    expect(validator.validate('https://example.com#anchor')).toEqual('https://example.com#anchor')
    expect(validator.validate('https://user:pass@example.com')).toEqual(
      'https://user:pass@example.com',
    )
  })

  it('should throw on invalid URLs', () => {
    const validator = url()

    expect(() => validator.validate('not a url')).toThrowError(
      new TypeError('Expected a valid URL'),
    )
    expect(() => validator.validate('example.com')).toThrowError(
      new TypeError('Expected a valid URL'),
    )
    expect(() => validator.validate('http://')).toThrowError(new TypeError('Expected a valid URL'))
    expect(() => validator.validate('ftp://')).toThrowError(new TypeError('Expected a valid URL'))
    expect(() => validator.validate('https://')).toThrowError(new TypeError('Expected a valid URL'))
    expect(() => validator.validate('://example.com')).toThrowError(
      new TypeError('Expected a valid URL'),
    )
    expect(() => validator.validate('')).toThrowError(new TypeError('Expected a valid URL'))
    expect(() => validator.validate(' ')).toThrowError(new TypeError('Expected a valid URL'))
  })

  it('should throw on non-string values', () => {
    const validator = url()

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
    const validator = url({ type_error: 'Expected a valid URL', invalid_error: 'Custom URL error' })

    expect(() => validator.validate('not a url')).toThrowError(
      new ValidationError('Custom URL error'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Expected a valid URL'))
  })
})
