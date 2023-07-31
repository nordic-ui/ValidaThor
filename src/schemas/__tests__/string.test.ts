import { parse } from '../../core/parse'
import { string } from '../string'
import { email, minLength, maxLength } from '../../modifiers'

describe('string()', () => {
  it('should work with no args', () => {
    const schema = string()

    expect(parse(schema, 'hello world')).toEqual('hello world')
    expect(() => parse(schema, 123)).toThrowError('Expected a string')
    expect(() => parse(schema, false)).toThrowError('Expected a string')
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => 'hi')).toThrowError('Expected a string')
  })

  it('should work with custom error message', () => {
    const schema = string([], 'Invalid value')

    expect(() => parse(schema, 123)).toThrowError('Invalid value')
  })

  it('should work with min() and max() args', () => {
    const schema1 = string([minLength(2)])
    const schema2 = string([maxLength(6)])
    const schema3 = string([minLength(2), maxLength(6)])
    const schema4 = string([minLength(2, 'Expected a string with at least 2 characters')])
    const schema5 = string([maxLength(6, 'Expected a string with at most 6 characters')])

    expect(parse(schema1, 'hello')).toEqual('hello')
    expect(parse(schema2, 'world')).toEqual('world')
    expect(parse(schema3, 'hello')).toEqual('hello')

    expect(() => parse(schema1, 'x')).toThrowError('Minimum value not met')
    expect(() => parse(schema2, 'hello world')).toThrowError('Maximum value exceeded')
    expect(() => parse(schema3, 'hello world')).toThrowError('Maximum value exceeded')
    expect(() => parse(schema4, 'x')).toThrowError('Expected a string with at least 2 characters')
    expect(() => parse(schema5, 'hello world')).toThrowError(
      'Expected a string with at most 6 characters'
    )
  })

  it('should work with email() arg', () => {
    const schema1 = string([email()])
    const schema2 = string([email('@example.com')])
    const schema3 = string([email('@example.com', 'Email domain not allowed')])

    expect(parse(schema2, 'passing@example.com')).toEqual('passing@example.com')

    expect(() => parse(schema1, 'notanemail')).toThrowError('Expected an email')
    expect(() => parse(schema2, 'invalid@invalid.com')).toThrowError(
      'Expected an email ending with @example.com'
    )
    expect(() => parse(schema3, 'invalid@invalid.com')).toThrowError('Email domain not allowed')
  })
})
