import { ValidationError, TypeError } from '../../utils/errors'
import { min } from '../min'

describe('min()', () => {
  it('should work', () => {
    const modifier = min(2)

    expect(modifier.name).toEqual('min')
    expect(modifier.validate(3)).toEqual(3)
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError(new TypeError('Expected a number'))
  })

  it('should work with custom error message', () => {
    const modifier = min(2, { error: 'Invalid value', type_error: 'Invalid type' })

    expect(() => modifier.validate(1)).toThrowError(new ValidationError('Invalid value'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError(new ValidationError('Invalid type'))
  })
})
