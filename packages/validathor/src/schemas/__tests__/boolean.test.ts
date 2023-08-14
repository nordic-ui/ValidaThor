import { parse } from '../../core/parse'
import { TypeError } from '../../utils/errors'
import { boolean } from '../boolean'

describe('boolean()', () => {
  it('should work', () => {
    const schema = boolean()

    expect(parse(schema, true)).toEqual(true)
    expect(parse(schema, false)).toEqual(false)
    expect(parse(schema, !!'hello')).toEqual(true)

    expect(schema.parse(true)).toEqual(true)
    expect(schema.parse(false)).toEqual(false)
    expect(schema.parse(!!'hello')).toEqual(true)

    expect(() => parse(schema, 'hello world')).toThrowError(new TypeError('Expected a boolean'))
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Expected a boolean'))
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => false)).toThrowError(new TypeError('Expected a boolean'))

    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse('hello world')).toThrowError(new TypeError('Expected a boolean'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(123)).toThrowError(new TypeError('Expected a boolean'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(() => false)).toThrowError(new TypeError('Expected a boolean'))
  })

  it('should work with custom error message', () => {
    const schema = boolean(undefined, { type_error: 'Invalid value' })

    expect(() => parse(schema, undefined)).toThrowError(new TypeError('Invalid value'))
    expect(() => parse(schema, 'hello world')).toThrowError(new TypeError('Invalid value'))
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Invalid value'))

    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(undefined)).toThrowError(new TypeError('Invalid value'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse('hello world')).toThrowError(new TypeError('Invalid value'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(123)).toThrowError(new TypeError('Invalid value'))
  })
})
