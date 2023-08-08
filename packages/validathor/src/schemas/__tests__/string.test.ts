import { parse } from '../../core/parse'
import { email, minLength, maxLength } from '../../modifiers'
import { ValidationError, TypeError } from '../../utils/errors'
import { string } from '../string'

describe('string()', () => {
  it('should work with no args', () => {
    const schema = string()

    expect(parse(schema, 'hello world')).toEqual('hello world')
    expect(schema.parse('hello world')).toEqual('hello world')
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(123)).toThrowError(new TypeError('Expected a string'))
    expect(() => parse(schema, false)).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => schema.parse(false)).toThrowError(new TypeError('Expected a string'))
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => 'hi')).toThrowError(new TypeError('Expected a string'))
  })

  it('should work with custom error message', () => {
    const schema = string([], 'Invalid value')

    expect(() => parse(schema, 123)).toThrowError(new TypeError('Invalid value'))
  })

  it('should work with min() and max() args', () => {
    const schema1 = string([minLength(2)])
    const schema2 = string([maxLength(6)])
    const schema3 = string([minLength(2), maxLength(6)])
    const schema4 = string([
      minLength(2, { error: 'Expected a string with at least 2 characters' }),
    ])
    const schema5 = string([maxLength(6, { error: 'Expected a string with at most 6 characters' })])
    const schema6 = string([minLength(-2)])
    const schema7 = string([maxLength(-6)])

    expect(parse(schema1, 'hello')).toEqual('hello')
    expect(parse(schema2, 'world')).toEqual('world')
    expect(parse(schema3, 'hello')).toEqual('hello')

    expect(() => parse(schema1, 'x')).toThrowError(new ValidationError('Minimum value not met'))
    expect(() => parse(schema2, 'hello world')).toThrowError(
      new ValidationError('Maximum value exceeded'),
    )
    expect(() => parse(schema3, 'hello world')).toThrowError(
      new ValidationError('Maximum value exceeded'),
    )
    expect(() => parse(schema4, 'x')).toThrowError(
      new ValidationError('Expected a string with at least 2 characters'),
    )
    expect(() => parse(schema5, 'hello world')).toThrowError(
      new ValidationError('Expected a string with at most 6 characters'),
    )
    expect(() => parse(schema6, 'hello world')).toThrowError(
      new ValidationError('Minimum length must be a positive number'),
    )
    expect(() => parse(schema7, 'hello world')).toThrowError(
      new ValidationError('Maximum length must be a positive number'),
    )
  })

  it('should work with email() arg', () => {
    const schema1 = string([email()])
    const schema2 = string([email('@example.test')])
    const schema3 = string([email('@example.test', { domain_error: 'Email domain not allowed' })])

    expect(parse(schema2, 'passing@example.test')).toEqual('passing@example.test')

    expect(() => parse(schema1, 'notanemail')).toThrowError(
      new ValidationError('Expected an email'),
    )
    expect(() => parse(schema2, 'invalid@invalid.test')).toThrowError(
      new ValidationError('Expected an email ending with @example.test'),
    )
    expect(() => parse(schema3, 'invalid@invalid.test')).toThrowError(
      new ValidationError('Email domain not allowed'),
    )
  })
})
