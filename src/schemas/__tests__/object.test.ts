import { boolean, string, number } from '../'
import { parse } from '../../core/parse'
import { maxLength } from '../../modifiers'
import { object } from '../object'

describe('object()', () => {
  it('should work with no args', () => {
    const schema = object({})

    expect(parse(schema, {})).toEqual({})

    expect(() => parse(schema, 'hello world')).toThrowError('Expected an object')
    expect(() => parse(schema, 123)).toThrowError('Expected an object')
    expect(() => parse(schema, false)).toThrowError('Expected an object')
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => ({}))).toThrowError('Expected an object')
  })

  it('should work with custom error message', () => {
    const schema = object({}, 'Object shape not permitted')

    expect(() => parse(schema, 123)).toThrowError('Object shape not permitted')
  })

  it('should work with data', () => {
    const schema1 = object({ name: string(), age: number(), isAdmin: boolean() })
    const schema2 = object({ name: string([maxLength(3)]) })
    const schema3 = object({
      venue: object({
        name: string(),
        location: object({
          lat: number(),
          lng: number(),
        }),
      }),
    })

    expect(parse(schema1, { name: 'John', age: 31, isAdmin: false })).toEqual({
      name: 'John',
      age: 31,
      isAdmin: false,
    })
    expect(
      parse(schema3, {
        venue: { name: 'Petit Bain', location: { lat: 48.8355263, lng: 2.3741375 } },
      }),
    ).toEqual({
      venue: {
        name: 'Petit Bain',
        location: {
          lat: 48.8355263,
          lng: 2.3741375,
        },
      },
    })

    expect(() => parse(schema1, { name: 31, age: 'John', isAdmin: false })).toThrowError(
      'Expected a string',
    )
    expect(() => parse(schema2, { name: 'John' })).toThrowError('Maximum value exceeded')
  })
})
