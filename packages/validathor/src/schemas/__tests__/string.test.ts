import { parse } from '@/core/parse'
import { email, min, max, enumerator, custom } from '@/modifiers'
import { ValidationError, TypeError } from '@/utils/errors/errors'

import { string } from '../string'

describe('string()', () => {
  it('should be named correctly', () => {
    expect(string().name).toEqual('string')
  })

  it('should work with no modifiers', () => {
    const schema = string()

    expect(parse(schema, 'hello world')).toEqual('hello world')
    expect(schema.parse('hello world')).toEqual('hello world')
    expect(() => parse(schema, '')).toThrowError(new TypeError('Expected a non-empty string'))
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Expected a string'))
    expect(() => schema.parse(123)).toThrowError(new TypeError('Expected a string'))
    expect(() => parse(schema, false)).toThrowError(new TypeError('Expected a string'))
    expect(() => schema.parse(false)).toThrowError(new TypeError('Expected a string'))
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => 'hi')).toThrowError(new TypeError('Expected a string'))
  })

  it('should work with custom error message', () => {
    const schema = string([], { type_error: 'Invalid value' })

    expect(() => parse(schema, 123)).toThrowError(new TypeError('Invalid value'))
  })

  it('should work with min() and max() modifiers', () => {
    const schema1 = string([min(4)])
    const schema2 = string([max(6)])

    expect(parse(schema1, 'hello')).toEqual('hello')
    expect(parse(schema2, 'hello')).toEqual('hello')

    expect(() => parse(schema1, 'bye')).toThrowError(
      new ValidationError('Value must be at least 4 characters long'),
    )
    expect(() => parse(schema2, 'goodbye')).toThrowError(
      new ValidationError('Value must be at most 6 characters long'),
    )
  })

  it('should work with min() and max() modifiers', () => {
    const schema1 = string([min(2)])
    const schema2 = string([max(6)])
    const schema3 = string([min(2), max(6)])
    const schema4 = string([min(2, { error: 'Expected a longer string' })])
    const schema5 = string([max(6, { error: 'Expected a shorter string' })])
    const schema6 = string([min(-2)])
    const schema7 = string([max(-6)])

    expect(parse(schema1, 'hello')).toEqual('hello')
    expect(parse(schema2, 'world')).toEqual('world')
    expect(parse(schema3, 'hello')).toEqual('hello')

    expect(() => parse(schema1, 'x')).toThrowError(
      new ValidationError('Value must be at least 2 characters long'),
    )
    expect(() => parse(schema2, 'hello world')).toThrowError(
      new ValidationError('Value must be at most 6 characters long'),
    )
    expect(() => parse(schema3, 'hello world')).toThrowError(
      new ValidationError('Value must be at most 6 characters long'),
    )
    expect(() => parse(schema4, 'x')).toThrowError(new ValidationError('Expected a longer string'))
    expect(() => parse(schema5, 'hello world')).toThrowError(
      new ValidationError('Expected a shorter string'),
    )
    expect(() => parse(schema6, 'hello world')).toThrowError(
      new ValidationError('Minimum length must be a positive number'),
    )
    expect(() => parse(schema7, 'hello world')).toThrowError(
      new ValidationError('Maximum length must be a positive number'),
    )
  })

  it('should work with email() modifier', () => {
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

  it('should work with enumerator() modifier', () => {
    const schema = string([enumerator(['😀', '🙂', '😐', '☹️', '😠'])])

    expect(parse(schema, '😀')).toEqual('😀')
    expect(parse(schema, '😠')).toEqual('😠')

    expect(() => parse(schema, 'invalid')).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
  })

  it('should work with custom() modifier', () => {
    const schema = string([
      custom((value) => [[value === 'John Doe', new ValidationError('Should be "John Doe"')]]),
    ])

    expect(() => parse(schema, 'John Doe')).not.toThrowError(
      new ValidationError('Should be "John Doe"'),
    )
    expect(() => parse(schema, 'Jane Doe')).toThrowError(
      new ValidationError('Should be "John Doe"'),
    )
  })
})
