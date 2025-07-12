import type {
  CreditCard,
  Custom,
  Email,
  EndsWith,
  Enumerator,
  Includes,
  Ip,
  Max,
  Min,
  Pattern,
  Phone,
  Slug,
  StartsWith,
  Trim,
  Url,
  Uuid,
} from '@/modifiers'

export type Modifier<TValue> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Custom<any>
  | Enumerator<TValue>
  | Min<TValue>
  | Max<TValue>
  | Email
  | Url
  | Uuid
  | Phone
  | Ip
  | CreditCard
  | Trim
  | Includes
  | StartsWith
  | EndsWith
  | Slug
  | Pattern

// TODO: Improve the parser type to more accurately reflect the return type
export type Parser<TInput, TOutput = unknown> = {
  name: string
  parse: (input: TOutput) => TInput
}
