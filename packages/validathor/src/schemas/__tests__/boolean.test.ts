import { parse } from '../../core/parse'
import { TypeError } from '../../utils/errors'
import { boolean } from '../boolean'

describe('boolean()', () => {
  it('should work with no args', () => {
    const schema = boolean()

    expect(parse(schema, true)).toEqual(true)
    expect(parse(schema, false)).toEqual(false)
    expect(parse(schema, !!'hello')).toEqual(true)

    expect(schema.parse(true)).toEqual(true)
    expect(schema.parse(false)).toEqual(false)
    expect(schema.parse(!!'hello')).toEqual(true)

    expect(() => parse(schema, 'hello world')).toThrowError('Expected a boolean')
    expect(() => parse(schema, 'hello world')).toThrowError(TypeError)
    expect(() => parse(schema, 123)).toThrowError('Expected a boolean')
    expect(() => parse(schema, 123)).toThrowError(TypeError)
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => false)).toThrowError('Expected a boolean')
    expect(() => parse(schema, () => false)).toThrowError(TypeError)

    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse('hello world')).toThrowError('Expected a boolean')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse('hello world')).toThrowError(TypeError)
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(123)).toThrowError('Expected a boolean')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(123)).toThrowError(TypeError)
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(() => false)).toThrowError('Expected a boolean')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(() => false)).toThrowError(TypeError)
  })

  it('should work with custom error message', () => {
    const schema = boolean(undefined, 'Invalid value')

    expect(() => parse(schema, 'hello world')).toThrowError('Invalid value')
    expect(() => parse(schema, 'hello world')).toThrowError(TypeError)
    expect(() => parse(schema, 123)).toThrowError('Invalid value')
    expect(() => parse(schema, 123)).toThrowError(TypeError)

    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse('hello world')).toThrowError('Invalid value')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse('hello world')).toThrowError(TypeError)
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(123)).toThrowError('Invalid value')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(123)).toThrowError(TypeError)
  })
})
