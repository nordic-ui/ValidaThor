import { boolean, date, number, object, regex, string } from './schemas'

export type HelperReturnType = {
  name: string
  args: {
    message: string
    [key: string]: any
  }
}

export type Schema =
  | ReturnType<typeof boolean>
  | ReturnType<typeof date>
  | ReturnType<typeof number>
  | ReturnType<typeof object>
  | ReturnType<typeof regex>
  | ReturnType<typeof string>
