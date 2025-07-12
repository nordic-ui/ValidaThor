import type { Parser } from '@/types'

/**
 * Creates a schema that allows the value to be undefined
 * @param schema The schema to make optional
 * @returns A parser that accepts undefined or the schema type
 */
export function optional<T>(schema: Parser<T>): Parser<T | undefined> {
  return {
    name: 'optional' as const,
    parse: (value): T | undefined => {
      if (value === undefined) {
        return undefined
      }

      return schema.parse(value)
    },
  }
}
