import { parse } from '@/core/parse'
import { min, max, email, pattern } from '@/modifiers'
import { ValidationError, TypeError } from '@/utils'

import { array } from '../array'
import { boolean } from '../boolean'
import { date } from '../date'
import { literal } from '../literal'
import { number } from '../number'
import { object } from '../object'
import { optional } from '../optional'
import { string } from '../string'
import { union } from '../union'

describe('optional()', () => {
  it('should be named correctly', () => {
    expect(optional(string()).name).toEqual('optional')
  })

  it('should accept undefined values', () => {
    const schema = optional(string())

    expect(parse(schema, undefined)).toBeUndefined()
    expect(schema.parse(undefined)).toBeUndefined()
  })

  it('should accept valid values for the wrapped schema', () => {
    const stringSchema = optional(string())
    const numberSchema = optional(number())
    const booleanSchema = optional(boolean())
    const dateSchema = optional(date())

    expect(parse(stringSchema, 'hello')).toEqual('hello')
    expect(parse(numberSchema, 42)).toEqual(42)
    expect(parse(booleanSchema, true)).toEqual(true)
    expect(parse(dateSchema, new Date('2023-01-01'))).toEqual(new Date('2023-01-01'))
  })

  it('should work with modifiers', () => {
    const schema = optional(string([min(5), max(10)]))

    expect(parse(schema, undefined)).toBeUndefined()
    expect(parse(schema, 'hello')).toEqual('hello')
    expect(parse(schema, 'helloworld')).toEqual('helloworld')

    expect(() => parse(schema, 'hi')).toThrowError(
      new ValidationError('Value must be at least 5 characters long'),
    )
    expect(() => parse(schema, 'this is too long')).toThrowError(
      new ValidationError('Value must be at most 10 characters long'),
    )
  })

  it('should work with object schemas', () => {
    const addressSchema = object({
      street: string([min(5)]),
      city: string([min(2)]),
      zip: string([pattern(/^\d{5}$/)]),
    })

    const userSchema = object({
      name: string(),
      address: optional(addressSchema),
    })

    // With address
    expect(
      parse(userSchema, {
        name: 'John',
        address: {
          street: '123 Main St',
          city: 'New York',
          zip: '10001',
        },
      }),
    ).toEqual({
      name: 'John',
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
      },
    })

    // Without address (undefined)
    expect(
      parse(userSchema, {
        name: 'John',
        address: undefined,
      }),
    ).toEqual({
      name: 'John',
      address: undefined,
    })

    // Without address field entirely
    expect(
      parse(userSchema, {
        name: 'John',
      }),
    ).toEqual({
      name: 'John',
      address: undefined,
    })

    // Invalid address
    expect(() =>
      parse(userSchema, {
        name: 'John',
        address: {
          street: '123',
          city: 'NY',
          zip: '10001',
        },
      }),
    ).toThrowError(new ValidationError('Value must be at least 5 characters long'))
  })

  it('should work with array schemas', () => {
    const schema = optional(array(number()))

    expect(parse(schema, undefined)).toBeUndefined()
    expect(parse(schema, [])).toEqual([])
    expect(parse(schema, [1, 2, 3])).toEqual([1, 2, 3])

    expect(() => parse(schema, ['not', 'numbers'])).toThrowError(new TypeError('Expected a number'))
  })

  it('should work with nested optional schemas', () => {
    const schema = optional(optional(string()))

    expect(parse(schema, undefined)).toBeUndefined()
    expect(parse(schema, 'hello')).toEqual('hello')
  })

  it('should work with union schemas', () => {
    const schema = optional(union([string(), number()]))

    expect(parse(schema, undefined)).toBeUndefined()
    expect(parse(schema, 'hello')).toEqual('hello')
    expect(parse(schema, 42)).toEqual(42)

    expect(() => parse(schema, true)).toThrowError(
      new TypeError('Expected value to match one of: string | number'),
    )
  })

  it('should work with literal schemas', () => {
    const schema = optional(literal('test'))

    expect(parse(schema, undefined)).toBeUndefined()
    expect(parse(schema, 'test')).toEqual('test')

    expect(() => parse(schema, 'other')).toThrowError(
      new ValidationError('Value does not match the literal value'),
    )
  })

  it('should reject null values', () => {
    const schema = optional(string())

    expect(() => parse(schema, null)).toThrowError(new TypeError('Expected a string'))
  })

  it('should work in complex real-world scenarios', () => {
    // Phone schema
    const phoneSchema = string([pattern(/^\+?[\d\s-()]+$/), min(10), max(20)])

    // Address schema
    const addressSchema = object({
      street: string([min(5)]),
      city: string([min(2)]),
      state: string([min(2), max(2)]),
      zip: string([pattern(/^\d{5}(-\d{4})?$/)]),
    })

    // User profile schema
    const userProfileSchema = object({
      id: string([pattern(/^usr_[a-zA-Z0-9]{12}$/)]),
      personalInfo: object({
        firstName: string([min(2), max(50)]),
        lastName: string([min(2), max(50)]),
        phone: optional(phoneSchema),
      }),
      email: string([email()]),
      addresses: object({
        billing: addressSchema,
        shipping: optional(addressSchema),
      }),
    })

    // Valid user with all fields
    const fullUser = {
      id: 'usr_abc123def456',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1 (555) 123-4567',
      },
      email: 'john@example.com',
      addresses: {
        billing: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zip: '10001',
        },
        shipping: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001-1234',
        },
      },
    }

    expect(parse(userProfileSchema, fullUser)).toEqual(fullUser)

    // Valid user with optional fields omitted
    const minimalUser = {
      id: 'usr_xyz789ghi012',
      personalInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: undefined,
      },
      email: 'jane@example.com',
      addresses: {
        billing: {
          street: '789 Elm Street',
          city: 'Chicago',
          state: 'IL',
          zip: '60601',
        },
        shipping: undefined,
      },
    }

    expect(parse(userProfileSchema, minimalUser)).toEqual(minimalUser)

    // Invalid - missing required field
    expect(() =>
      parse(userProfileSchema, {
        id: 'usr_abc123def456',
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
        },
        // missing email
        addresses: {
          billing: {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zip: '10001',
          },
        },
      }),
    ).toThrowError(new ValidationError('Expected a string'))

    // Invalid - invalid optional field
    expect(() =>
      parse(userProfileSchema, {
        ...minimalUser,
        personalInfo: {
          ...minimalUser.personalInfo,
          phone: '123', // too short
        },
      }),
    ).toThrowError(new ValidationError('Value must be at least 10 characters long'))
  })

  it('should have correct return type', () => {
    const schema1 = optional(string())
    const schema2 = optional(number())
    const schema3 = optional(object({ name: string() }))

    expectTypeOf(schema1.parse).returns.toEqualTypeOf<string | undefined>()
    expectTypeOf(schema2.parse).returns.toEqualTypeOf<number | undefined>()
    expectTypeOf(schema3.parse).returns.toEqualTypeOf<{ name: string } | undefined>()
  })
})
