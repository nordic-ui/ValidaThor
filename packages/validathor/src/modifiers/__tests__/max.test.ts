import { ValidationError, TypeError } from '../../utils/errors'
import { max } from '../max'

describe('max()', () => {
  it('should work', () => {
    const modifier = max(4)

    expect(modifier.name).toEqual('max')
    expect(modifier.validate(3)).toEqual(3)
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError(new TypeError('Expected a number'))
  })

  it('should work with custom error message', () => {
    const modifier = max(4, { error: 'Invalid value', type_error: 'Invalid type' })

    expect(() => modifier.validate(9)).toThrowError(new ValidationError('Invalid value'))
  })
})
