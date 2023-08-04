import { ValidationError, TypeError } from '../../utils/errors'
import { minDate } from '../minDate'

describe('minDate()', () => {
  it('should work', () => {
    const modifier = minDate(new Date('2023/06/14'))

    expect(modifier.name).toEqual('minDate')
    expect(modifier.validate(new Date('2023/06/15'))).toEqual(new Date('2023/06/15'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError('Expected a date')
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError(TypeError)
  })

  it('should work with custom error message', () => {
    const modifier = minDate(new Date('2023/06/14'), 'Invalid value')

    expect(() => modifier.validate(new Date('2021/06/14'))).toThrowError('Invalid value')
    expect(() => modifier.validate(new Date('2021/06/14'))).toThrowError(ValidationError)
  })
})
