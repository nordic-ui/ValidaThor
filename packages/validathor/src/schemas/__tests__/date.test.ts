import { parse } from '@/core/parse'
import { custom, enumerator, max, min } from '@/modifiers'
import { ValidationError, TypeError } from '@/utils/errors/errors'

import { date } from '../date'

describe('date()', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be named correctly', () => {
    expect(date().name).toEqual('date')
  })

  it('should work with no modifiers', () => {
    const schema = date()

    expect(parse(schema, new Date('2023/07/31'))).toEqual(new Date('2023/07/31'))

    expect(() => parse(schema, 'hello world')).toThrowError(new TypeError('Expected a date'))
    expect(() => parse(schema, 123)).toThrowError(new TypeError('Expected a date'))
    expect(() => parse(schema, false)).toThrowError(new TypeError('Expected a date'))
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => new Date())).toThrowError(new TypeError('Expected a date'))
  })

  it('should work with custom error message', () => {
    const schema = date([], { type_error: 'Not a date' })

    expect(() => parse(schema, 123)).toThrowError(new ValidationError('Not a date'))
  })

  it('should work with min() and max() modifiers', () => {
    const schema1 = date([min(new Date('2021/01/01'))])
    const schema2 = date([max(new Date('2021/12/31'))])
    const schema3 = date([min(new Date('2021/01/01')), max(new Date('2021/12/31'))])
    const schema4 = date([min(new Date('2021/01/01'), { error: 'Date is too early' })])
    const schema5 = date([max(new Date('2021/12/31'), { error: 'Date is too late' })])

    expect(parse(schema1, new Date('2021/01/02'))).toEqual(new Date('2021/01/02'))
    expect(parse(schema2, new Date('2021/12/30'))).toEqual(new Date('2021/12/30'))
    expect(parse(schema3, new Date('2021/06/15'))).toEqual(new Date('2021/06/15'))

    expect(() => parse(schema1, new Date('2020/12/31'))).toThrowError(
      new ValidationError('Value must be at least 2021-01-01T00:00:00.000Z'),
    )
    expect(() => parse(schema2, new Date('2022/01/01'))).toThrowError(
      new ValidationError('Value must be at most 2021-12-31T00:00:00.000Z'),
    )
    expect(() => parse(schema3, new Date('2022/01/01'))).toThrowError(
      new ValidationError('Value must be at most 2021-12-31T00:00:00.000Z'),
    )
    expect(() => parse(schema4, new Date('2020/12/31'))).toThrowError(
      new ValidationError('Date is too early'),
    )
    expect(() => parse(schema5, new Date('2022/01/01'))).toThrowError(
      new ValidationError('Date is too late'),
    )
  })

  it('should work with enumerator() modifier', () => {
    const dates = [new Date('2021/01/01'), new Date('2021/12/31'), new Date('2025/07/11')] as const
    const schema = date([enumerator(dates)])

    expect(parse(schema, dates[0])).toEqual(new Date('2021/01/01'))
    expect(parse(schema, dates[2])).toEqual(new Date('2025/07/11'))

    expect(() => parse(schema, new Date('2018/01/01'))).toThrowError(
      new ValidationError('Value is not in the allowed list'),
    )
  })

  it('should work with custom() modifier', () => {
    const schema1 = date([
      custom((value) => [[value.getDate() !== 31, 'End of the month (maybe)']]),
    ])

    expect(parse(schema1, new Date('2024/05/12'))).toEqual(new Date('2024/05/12'))
    expect(() => parse(schema1, new Date('2024/05/31'))).toThrowError(
      new ValidationError('End of the month (maybe)'),
    )
  })
})
