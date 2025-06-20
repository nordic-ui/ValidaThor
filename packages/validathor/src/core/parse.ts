import type { Parser } from '@/types'

export const parse = <TSchema>(schema: Parser<TSchema>, value: unknown) => {
  return schema.parse(value)
}
