import { parse } from '../../core/parse'
import { regex } from '../regex'

describe('regex()', () => {
  it('should work with no args', () => {
    const schema = regex()

    expect(parse(schema, /hello world/)).toEqual(/hello world/)

    expect(() => parse(schema, 'hello world')).toThrowError('Expected a RegExp')
    expect(() => parse(schema, 123)).toThrowError('Expected a RegExp')
    expect(() => parse(schema, false)).toThrowError('Expected a RegExp')
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => /hello world/)).toThrowError('Expected a RegExp')
  })

  it('should work with custom error message', () => {
    const schema = regex('Invalid regex')

    expect(() => parse(schema, 123)).toThrowError('Invalid regex')
  })
})
