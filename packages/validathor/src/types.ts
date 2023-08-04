import type { Custom, Min, Max, Email, MinDate, MaxDate, MinLength, MaxLength } from './modifiers'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Modifier = Custom<any> | Min | Max | Email | MinDate | MaxDate | MinLength | MaxLength

export type Schema<T> = {
  parse: (value: T) => T
}
