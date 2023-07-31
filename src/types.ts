import { boolean, date, number, object, regex, string } from './schemas'
import { min, max, email, minDate, maxDate, minLength, maxLength } from './helpers'

type HelperArgs =
  | ReturnType<typeof min>
  | ReturnType<typeof max>
  | ReturnType<typeof email>
  | ReturnType<typeof minDate>
  | ReturnType<typeof maxDate>
  | ReturnType<typeof minLength>
  | ReturnType<typeof maxLength>

export type HelperReturnType = {
  name: string
  args: HelperArgs['args']
}

export type Schema =
  | ReturnType<typeof boolean>
  | ReturnType<typeof date>
  | ReturnType<typeof number>
  | ReturnType<typeof object>
  | ReturnType<typeof regex>
  | ReturnType<typeof string>
