import type { Custom, Min, Max, Email, Enumerator } from '@/modifiers'

export type Modifier<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Custom<any> | Enumerator<T> | Min<T> | Max<T> | Email

// TODO: Improve the parser type to more accurately reflect the return type
export type Parser<T, U = unknown> = {
  name: string
  parse: (input: U) => T
}

// Helper type to infer the schema shape and convert to the correct types
export type InferSchemaType<T> = {
  [P in keyof T]: T[P] extends Parser<infer U> ? U : never
}

export type MaybeArray<T> = T | T[]
