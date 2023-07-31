import { boolean, date, number, object, regex, string } from './schemas'

export type Schema =
  | ReturnType<typeof boolean>
  | ReturnType<typeof date>
  | ReturnType<typeof number>
  | ReturnType<typeof object>
  | ReturnType<typeof regex>
  | ReturnType<typeof string>
