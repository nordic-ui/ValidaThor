import type { Min, Max, Email, MinDate, MaxDate, MinLength, MaxLength } from './modifiers'
import { boolean, date, number, object, regex, string } from './schemas'

export type Modifier = Min | Max | Email | MinDate | MaxDate | MinLength | MaxLength

export type Schema =
  | ReturnType<typeof boolean>
  | ReturnType<typeof date>
  | ReturnType<typeof number>
  | ReturnType<typeof object>
  | ReturnType<typeof regex>
  | ReturnType<typeof string>
