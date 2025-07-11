import { parse } from '@/core/parse'
import { TypeError } from '@/utils/errors/errors'

import { boolean } from '../boolean'

describe('boolean()', () => {
  it('should be named correctly', () => {
    expect(boolean().name).toEqual('boolean')
  })

  it('should work', () => {
    const schema = boolean()

    expect(parse(schema, true)).toEqual(true)
    expect(parse(schema, false)).toEqual(false)
    // @ts-expect-error - This value is always truthy but let's be explicit here
    expect(parse(schema, !!'hello')).toEqual(true)

    expect(schema.parse(true)).toEqual(true)
    expect(schema.parse(false)).toEqual(false)
    // @ts-expect-error - This value is always truthy but let's be explicit here
    expect(schema.parse(!!'hello')).toEqual(true)

    expect(() => parse(schema, 'hello world')).toThrowError(new TypeError('Expected a boolean'))
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Expected a boolean'))
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => false)).toThrowError(new TypeError('Expected a boolean'))

    expect(() => schema.parse('hello world')).toThrowError(new TypeError('Expected a boolean'))
    expect(() => schema.parse(123)).toThrowError(new TypeError('Expected a boolean'))
    expect(() => schema.parse(() => false)).toThrowError(new TypeError('Expected a boolean'))
  })

  it('should work with custom error message', () => {
    const schema = boolean(undefined, { type_error: 'Invalid value' })

    expect(() => parse(schema, undefined)).toThrowError(new TypeError('Invalid value'))
    expect(() => parse(schema, 'hello world')).toThrowError(new TypeError('Invalid value'))
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Invalid value'))

    expect(() => schema.parse(undefined)).toThrowError(new TypeError('Invalid value'))
    expect(() => schema.parse('hello world')).toThrowError(new TypeError('Invalid value'))
    expect(() => schema.parse(123)).toThrowError(new TypeError('Invalid value'))
  })
})
