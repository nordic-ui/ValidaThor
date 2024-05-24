import { Parser } from '@/types'

export const parse = <T>(schema: Parser<T>, value: unknown) => {
  return schema.parse(value)
}
