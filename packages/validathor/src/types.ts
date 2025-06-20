import type { Custom, Min, Max, Email, Enumerator } from '@/modifiers'

export type Modifier<TValue> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Custom<any> | Enumerator<TValue> | Min<TValue> | Max<TValue> | Email

// TODO: Improve the parser type to more accurately reflect the return type
export type Parser<TInput, TOutput = unknown> = {
  name: string
  parse: (input: TOutput) => TInput
}

// Helper type to infer the schema shape and convert to the correct types
export type InferSchemaType<TSchema> = {
  [PKey in keyof TSchema]: TSchema[PKey] extends Parser<infer U> ? U : never
}

export type MaybeArray<TInput> = TInput | TInput[]
