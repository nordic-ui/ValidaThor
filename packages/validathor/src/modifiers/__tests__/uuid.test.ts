import { TypeError, ValidationError } from '@/utils/errors/errors'

import { uuid } from '../uuid'

describe('uuid()', () => {
  it('should be named correctly', () => {
    expect(uuid().name).toEqual('uuid')
  })

  it('should validate valid UUIDs', () => {
    const validator = uuid()

    // Version 1
    expect(validator.validate('550e8400-e29b-11d4-a716-446655440000')).toEqual(
      '550e8400-e29b-11d4-a716-446655440000',
    )
    // Version 4
    expect(validator.validate('123e4567-e89b-12d3-a456-426614174000')).toEqual(
      '123e4567-e89b-12d3-a456-426614174000',
    )
    expect(validator.validate('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toEqual(
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    )
    // Version 5
    expect(validator.validate('6ba7b810-9dad-51d1-80b4-00c04fd430c8')).toEqual(
      '6ba7b810-9dad-51d1-80b4-00c04fd430c8',
    )
    // Mixed case (case insensitive)
    expect(validator.validate('F47AC10B-58CC-4372-A567-0E02B2C3D479')).toEqual(
      'F47AC10B-58CC-4372-A567-0E02B2C3D479',
    )
    expect(validator.validate('f47AC10b-58cc-4372-a567-0e02b2c3d479')).toEqual(
      'f47AC10b-58cc-4372-a567-0e02b2c3d479',
    )
  })

  it('should throw on invalid UUIDs', () => {
    const validator = uuid()

    // Invalid format
    expect(() => validator.validate('123e4567-e89b-12d3-a456-42661417400')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )
    expect(() => validator.validate('123e4567-e89b-12d3-a456-4266141740000')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )
    expect(() => validator.validate('123e4567e89b12d3a456426614174000')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )
    expect(() => validator.validate('123e4567_e89b_12d3_a456_426614174000')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )
    expect(() => validator.validate('g47ac10b-58cc-4372-a567-0e02b2c3d479')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )
    expect(() => validator.validate('not-a-uuid')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )
    expect(() => validator.validate('')).toThrowError(new TypeError('Expected a valid UUID'))

    // Invalid version (0 and 6-9 are invalid)
    expect(() => validator.validate('123e4567-e89b-02d3-a456-426614174000')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )
    expect(() => validator.validate('123e4567-e89b-62d3-a456-426614174000')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )

    // Invalid variant (must be 8, 9, a, or b)
    expect(() => validator.validate('123e4567-e89b-12d3-7456-426614174000')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )
    expect(() => validator.validate('123e4567-e89b-12d3-c456-426614174000')).toThrowError(
      new TypeError('Expected a valid UUID'),
    )
  })

  it('should throw on non-string values', () => {
    const validator = uuid()

    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(null)).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(undefined)).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate({})).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate([])).toThrowError(new TypeError('Expected a string'))
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(true)).toThrowError(new TypeError('Expected a string'))
  })

  it('should use custom error messages', () => {
    const validator = uuid({
      type_error: 'Input is not a valid UUID',
      invalid_error: 'Custom UUID error',
    })

    expect(() => validator.validate('not-a-uuid')).toThrowError(
      new ValidationError('Custom UUID error'),
    )
    // @ts-expect-error - Testing invalid input
    expect(() => validator.validate(123)).toThrowError(new TypeError('Input is not a valid UUID'))
  })
})
