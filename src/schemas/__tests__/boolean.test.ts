import { parse } from '../../core/parse'
import { boolean } from '../boolean'

describe('boolean()', () => {
  it('should work with no args', () => {
    const schema = boolean()

    expect(parse(schema, true)).toEqual(true)
    expect(parse(schema, false)).toEqual(false)
    expect(parse(schema, !!'hello')).toEqual(true)

    expect(() => parse(schema, 'hello world')).toThrowError('Expected a boolean')
    expect(() => parse(schema, 123)).toThrowError('Expected a boolean')
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => false)).toThrowError('Expected a boolean')
  })

  it('should work with custom error message', () => {
    const schema = boolean('Invalid value')

    expect(() => parse(schema, 'hello world')).toThrowError('Invalid value')
    expect(() => parse(schema, 123)).toThrowError('Invalid value')
  })
})
