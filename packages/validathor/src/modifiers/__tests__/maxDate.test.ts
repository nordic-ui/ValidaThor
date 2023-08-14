import { ValidationError, TypeError } from '../../utils/errors'
import { maxDate } from '../maxDate'

describe('maxDate()', () => {
  it('should work', () => {
    const modifier = maxDate(new Date('2023/06/14'))

    expect(modifier.name).toEqual('maxDate')
    expect(modifier.validate(new Date('2023/06/10'))).toEqual(new Date('2023/06/10'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier.validate('foo')).toThrowError(new TypeError('Expected a date'))
  })

  it('should work with custom error message', () => {
    const modifier1 = maxDate(new Date('2023/06/14'), {
      error: 'Invalid value',
      type_error: 'Not a date',
    })
    // @ts-expect-error: Passing wrong value on purpose
    const modifier2 = maxDate('2023/06/14', { type_error: 'Not a date' })

    expect(() => modifier1.validate(new Date('2024/06/14'))).toThrowError(
      new ValidationError('Invalid value'),
    )
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier1.validate('2021/06/14')).toThrowError(new TypeError('Not a date'))
    // @ts-expect-error: Passing wrong value on purpose
    expect(() => modifier2.validate()).toThrowError(new TypeError('Not a date'))
  })
})
