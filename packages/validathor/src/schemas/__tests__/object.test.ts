import { parse } from '@/core/parse'
import { max, min } from '@/modifiers'
import { boolean, string, number, array, enum_, literal } from '@/schemas'

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

  it('should work with nested objects', () => {
    const getUserResponseSchema = object({
      id: number(),
      name: string([min(1)]),
      obj: object({
        foo: object({ bar: string() }),
      }),
    })

    expect(
      getUserResponseSchema.parse({
        id: 1,
        name: 'John',
        obj: {
          foo: { bar: 'baz' },
        },
      }),
    ).toEqual({
      id: 1,
      name: 'John',
      obj: {
        foo: { bar: 'baz' },
      },
    })
  })

  it('should work with complex data', () => {
    const schema1 = object({ name: string(), age: number(), isAdmin: boolean() })
    const schema2 = object({ name: string([max(3)]) })
    const schema3 = object({
      venue: object({
        name: string(),
        location: object({
          lat: number(),
          lng: number(),
        }),
        eventIds: array(number([min(1)])),
      }),
    })

    expect(parse(schema1, { name: 'John', age: 31, isAdmin: false })).toEqual({
      name: 'John',
      age: 31,
      isAdmin: false,
    })
    expect(
      parse(schema3, {
        venue: {
          name: 'Petit Bain',
          location: { lat: 48.8355263, lng: 2.3741375 },
          eventIds: [4, 8, 15, 16, 23, 42],
        },
      }),
    ).toEqual({
      venue: {
        name: 'Petit Bain',
        location: {
          lat: 48.8355263,
          lng: 2.3741375,
        },
        eventIds: [4, 8, 15, 16, 23, 42],
      },
    })
    expect(schema1.parse({ name: 'John', age: 31, isAdmin: false })).toEqual({
      name: 'John',
      age: 31,
      isAdmin: false,
    })
    expect(
      schema3.parse({
        venue: {
          name: 'Petit Bain',
          location: { lat: 48.8355263, lng: 2.3741375 },
          eventIds: [4, 8, 15, 16, 23, 42],
        },
      }),
    ).toEqual({
      venue: {
        name: 'Petit Bain',
        location: {
          lat: 48.8355263,
          lng: 2.3741375,
        },
        eventIds: [4, 8, 15, 16, 23, 42],
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
    expect(() =>
      schema3.parse({
        venue: {
          name: 'Petit Bain',
          location: { lat: 48.8355263, lng: 2.3741375 },
          eventIds: ['first', 'second'],
        },
      }),
    ).toThrowError('Expected a number')
  })

  it('should work with literal schemas', () => {
    const schema = object({
      status: literal('active'),
      count: literal(42),
      isEnabled: literal(true),
      nullValue: literal(null),
      undefinedValue: literal(undefined),
    })

    expect(
      parse(schema, {
        status: 'active',
        count: 42,
        isEnabled: true,
        nullValue: null,
        undefinedValue: undefined,
      }),
    ).toEqual({
      status: 'active',
      count: 42,
      isEnabled: true,
      nullValue: null,
      undefinedValue: undefined,
    })

    expect(() =>
      parse(schema, {
        status: 'inactive',
        count: 42,
        isEnabled: true,
        nullValue: null,
        undefinedValue: undefined,
      }),
    ).toThrowError('Value does not match the literal value')

    expect(() =>
      parse(schema, {
        status: 'active',
        count: 43,
        isEnabled: true,
        nullValue: null,
        undefinedValue: undefined,
      }),
    ).toThrowError('Value does not match the literal value')

    expect(() =>
      parse(schema, {
        status: 'active',
        count: 42,
        isEnabled: false,
        nullValue: null,
        undefinedValue: undefined,
      }),
    ).toThrowError('Value does not match the literal value')
  })

  it('should work with literal schemas in nested objects', () => {
    const schema = object({
      user: object({
        role: literal('admin'),
        permissions: object({
          canEdit: literal(true),
          level: literal(5),
        }),
      }),
      config: object({
        environment: literal('production'),
        debugMode: literal(false),
      }),
    })

    expect(
      parse(schema, {
        user: {
          role: 'admin',
          permissions: {
            canEdit: true,
            level: 5,
          },
        },
        config: {
          environment: 'production',
          debugMode: false,
        },
      }),
    ).toEqual({
      user: {
        role: 'admin',
        permissions: {
          canEdit: true,
          level: 5,
        },
      },
      config: {
        environment: 'production',
        debugMode: false,
      },
    })

    expect(() =>
      parse(schema, {
        user: {
          role: 'user',
          permissions: {
            canEdit: true,
            level: 5,
          },
        },
        config: {
          environment: 'production',
          debugMode: false,
        },
      }),
    ).toThrowError('Value does not match the literal value')
  })

  it('should work with literal schemas mixed with other types', () => {
    const schema = object({
      type: literal('user'),
      name: string([min(1)]),
      age: number([min(0)]),
      active: boolean(),
      role: literal('member'),
    })

    expect(
      parse(schema, {
        type: 'user',
        name: 'John Doe',
        age: 30,
        active: true,
        role: 'member',
      }),
    ).toEqual({
      type: 'user',
      name: 'John Doe',
      age: 30,
      active: true,
      role: 'member',
    })

    expect(() =>
      parse(schema, {
        type: 'admin',
        name: 'John Doe',
        age: 30,
        active: true,
        role: 'member',
      }),
    ).toThrowError('Value does not match the literal value')

    expect(() =>
      parse(schema, {
        type: 'user',
        name: '',
        age: 30,
        active: true,
        role: 'member',
      }),
    ).toThrowError('Expected a non-empty string')
  })
})

describe('[FUTURE]', () => {
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

    expect(() =>
      envSchema.parse({
        VITE_ENVIRONMENT: 'fake',
        VITE_API_BASE_URL: 'http://localhost:3000',
        VITE_ENABLE_MOCK_APIS: true,
        VITE_ENABLE_DEV_TOOLS: false,
      }),
    ).toThrowError('Value is not a valid enum option')
  })

  it('should do more stuff', () => {
    const addProductFormSchema = object({
      name: string([min(1), max(50)]),
      description: string([min(2), max(50)]),
      price: number([min(2), max(100)]),
      imageIds: array(number([min(1)])),
    })

    expect(
      addProductFormSchema.parse({
        name: 'Foo',
        description: 'Bar',
        price: 10,
        imageIds: [1, 2, 3],
      }),
    ).toEqual({
      name: 'Foo',
      description: 'Bar',
      price: 10,
      imageIds: [1, 2, 3],
    })
  })

  it('should have correct return type', () => {
    const schema = object({ name: string(), age: number() })

    expectTypeOf(schema.parse).returns.toEqualTypeOf<{ name: string; age: number }>()
  })
})
