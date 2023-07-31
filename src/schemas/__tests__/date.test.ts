import { parse } from '../../core/parse'
import { maxDate, minDate } from '../../helpers'
import { date } from '../date'

describe('date()', () => {
  it('should work with no args', () => {
    const schema = date()

    expect(parse(schema, new Date())).toEqual(new Date())

    expect(() => parse(schema, 'hello world')).toThrowError('Expected a Date')
    expect(() => parse(schema, 123)).toThrowError('Expected a Date')
    expect(() => parse(schema, false)).toThrowError('Expected a Date')
    // TODO: Maybe consider handling this case?
    expect(() => parse(schema, () => new Date())).toThrowError('Expected a Date')
  })

  it('should work with custom error message', () => {
    const schema = date([], 'Date out of range')

    expect(() => parse(schema, 123)).toThrowError('Date out of range')
  })

  it('should work with minDate() and maxDate() args', () => {
    const schema1 = date([minDate(new Date('2021/01/01'))])
    const schema2 = date([maxDate(new Date('2021/12/31'))])
    const schema3 = date([minDate(new Date('2021/01/01')), maxDate(new Date('2021/12/31'))])
    const schema4 = date([minDate(new Date('2021/01/01'), 'Date is too early')])
    const schema5 = date([maxDate(new Date('2021/12/31'), 'Date is too late')])

    expect(parse(schema1, new Date('2021/01/02'))).toEqual(new Date('2021/01/02'))
    expect(parse(schema2, new Date('2021/12/30'))).toEqual(new Date('2021/12/30'))
    expect(parse(schema3, new Date('2021/06/15'))).toEqual(new Date('2021/06/15'))

    expect(() => parse(schema1, new Date('2020/12/31'))).toThrowError('Minimum value not met')
    expect(() => parse(schema2, new Date('2022/01/01'))).toThrowError('Maximum value exceeded')
    expect(() => parse(schema3, new Date('2022/01/01'))).toThrowError('Maximum value exceeded')
    expect(() => parse(schema4, new Date('2020/12/31'))).toThrowError('Date is too early')
    expect(() => parse(schema5, new Date('2022/01/01'))).toThrowError('Date is too late')
  })
})
