import { TypeError } from '@/utils/errors/errors'

import { ip } from '../ip'

describe('ip()', () => {
  it('should be named correctly', () => {
    expect(ip().name).toEqual('ip')
  })

  it('should validate valid IPv4 addresses', () => {
    const validator = ip()

    expect(validator.validate('192.168.1.1')).toEqual('192.168.1.1')
    expect(validator.validate('10.0.0.0')).toEqual('10.0.0.0')
    expect(validator.validate('172.16.0.1')).toEqual('172.16.0.1')
    expect(validator.validate('8.8.8.8')).toEqual('8.8.8.8')
    expect(validator.validate('255.255.255.255')).toEqual('255.255.255.255')
    expect(validator.validate('0.0.0.0')).toEqual('0.0.0.0')
    expect(validator.validate('127.0.0.1')).toEqual('127.0.0.1')
  })

  it('should validate valid IPv6 addresses', () => {
    const validator = ip()

    expect(validator.validate('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toEqual(
      '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    )
    expect(validator.validate('2001:db8:85a3::8a2e:370:7334')).toEqual(
      '2001:db8:85a3::8a2e:370:7334',
    )
    expect(validator.validate('2001:db8::8a2e:370:7334')).toEqual('2001:db8::8a2e:370:7334')
    expect(validator.validate('::1')).toEqual('::1')
    expect(validator.validate('::')).toEqual('::')
    expect(validator.validate('fe80::1')).toEqual('fe80::1')
    expect(validator.validate('::ffff:192.168.1.1')).toEqual('::ffff:192.168.1.1')
    expect(validator.validate('2001:db8:85a3:0:0:8a2e:370:7334')).toEqual(
      '2001:db8:85a3:0:0:8a2e:370:7334',
    )
  })

  it('should validate only IPv4 when version is specified', () => {
    const validator = ip('v4')

    expect(validator.validate('192.168.1.1')).toEqual('192.168.1.1')
    expect(() => validator.validate('2001:db8::8a2e:370:7334')).toThrowError(
      new TypeError('Expected a valid IP v4 address'),
    )
  })

  it('should validate only IPv6 when version is specified', () => {
    const validator = ip('v6')

    expect(validator.validate('2001:db8::8a2e:370:7334')).toEqual('2001:db8::8a2e:370:7334')
    expect(() => validator.validate('192.168.1.1')).toThrowError(
      new TypeError('Expected a valid IP v6 address'),
    )
  })

  it('should throw on invalid IP addresses', () => {
    const validator = ip()

    // Invalid IPv4
    expect(() => validator.validate('256.1.1.1')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('1.1.1')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('1.1.1.1.1')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('192.168.1')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('192.168.1.256')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('192.168.-1.1')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('192.168.1.1.1')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('a.b.c.d')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )

    // Invalid IPv6
    expect(() => validator.validate('gggg::1')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('2001:db8:::8a2e:370:7334')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('2001:db8:85a3::8a2e:370g:7334')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('02001:db8::1')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )

    // Not an IP
    expect(() => validator.validate('not an ip')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('localhost')).toThrowError(
      new TypeError('Expected a valid IP address'),
    )
    expect(() => validator.validate('')).toThrowError(new TypeError('Expected a valid IP address'))
  })

  it('should throw on non-string values', () => {
    const validator = ip()

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
    const validator = ip(undefined, {
      type_error: 'Expected a valid IP',
      invalid_error: 'Custom IP error',
    })

    expect(() => validator.validate('not an ip')).toThrowError(new TypeError('Custom IP error'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Expected a valid IP'))
  })
})
