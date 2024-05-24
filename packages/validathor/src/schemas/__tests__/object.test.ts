import { parse } from '@/core/parse'
import { max, min } from '@/modifiers'
import { boolean, string, number } from '@/schemas'

import { enum_ } from '../enum'
import { object } from '../object'

describe('object()', () => {
  it('should be named correctly', () => {
    expect(object({}).name).toEqual('object')
  })

  it('should work with no modifiers', () => {
    const schema = object({})

    expect(parse(schema, {})).toEqual({})
    expect(schema.parse({})).toEqual({})

    expect(() => parse(schema, 'hello world')).toThrowError('Expected an object')
    expect(() => parse(schema, 123)).toThrowError('Expected an object')
    expect(() => parse(schema, false)).toThrowError('Expected an object')
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => ({}))).toThrowError('Expected an object')

    expect(() => schema.parse('hello world')).toThrowError('Expected an object')
    expect(() => schema.parse(123)).toThrowError('Expected an object')
    expect(() => schema.parse(false)).toThrowError('Expected an object')
    expect(() => schema.parse(() => ({}))).toThrowError('Expected an object')
  })

  it('should work with custom error message', () => {
    const schema = object({}, { type_error: 'Object shape not permitted' })

    expect(() => parse(schema, 123)).toThrowError('Object shape not permitted')
    expect(() => schema.parse(123)).toThrowError('Object shape not permitted')
  })

  it('should work with data', () => {
    const schema1 = object({ name: string(), age: number(), isAdmin: boolean() })
    const schema2 = object({ name: string([max(3)]) })
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
    expect(schema1.parse({ name: 'John', age: 31, isAdmin: false })).toEqual({
      name: 'John',
      age: 31,
      isAdmin: false,
    })
    expect(
      schema3.parse({
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
    expect(() => parse(schema2, { name: 'John' })).toThrowError(
      'Value must be at most 3 characters long',
    )

    expect(() => schema1.parse({ name: 31, age: 'John', isAdmin: false })).toThrowError(
      'Expected a string',
    )
    expect(() => schema2.parse({ name: 'John' })).toThrowError(
      'Value must be at most 3 characters long',
    )
  })
})

describe('[FUTURE]', () => {
  it('should work with nested objects', () => {
    const getUserResponseSchema = object({
      id: number(),
      name: string([min(1)]),
    })

    expect(
      getUserResponseSchema.parse({
        id: 1,
        name: 'John',
      }),
    ).toEqual({
      id: 1,
      name: 'John',
    })
  })

  it('should do stuff', () => {
    const envSchema = object({
      // TODO: Add support for enums
      VITE_ENVIRONMENT: enum_(['local', 'dev', 'qa', 'prod']),
      VITE_API_BASE_URL: string([min(1)]),
      VITE_ENABLE_MOCK_APIS: boolean(),
      VITE_ENABLE_DEV_TOOLS: boolean(),
    })

    expect(
      envSchema.parse({
        VITE_ENVIRONMENT: 'local',
        VITE_API_BASE_URL: 'http://localhost:3000',
        VITE_ENABLE_MOCK_APIS: true,
        VITE_ENABLE_DEV_TOOLS: false,
      }),
    ).toEqual({
      VITE_ENVIRONMENT: 'local',
      VITE_API_BASE_URL: 'http://localhost:3000',
      VITE_ENABLE_MOCK_APIS: true,
      VITE_ENABLE_DEV_TOOLS: false,
    })

    expect(() =>
      envSchema.parse({
        VITE_ENVIRONMENT: 'local',
        VITE_API_BASE_URL: 'http://localhost:3000',
        VITE_ENABLE_MOCK_APIS: true,
        VITE_ENABLE_DEV_TOOLS: 'false',
      }),
    ).toThrowError('Expected a boolean')
  })

  it('should do more stuff', () => {
    const addProductFormSchema = object({
      name: string([min(1), max(50)]),
      description: string([min(2), max(50)]),
      price: number([min(2), max(100)]),
    })

    expect(
      addProductFormSchema.parse({
        name: 'Foo',
        description: 'Bar',
        price: 10,
      }),
    ).toEqual({
      name: 'Foo',
      description: 'Bar',
      price: 10,
    })
  })
})
