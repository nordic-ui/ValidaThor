import { Parser } from '@/types'

export const isParser = <TParser>(input: unknown): input is TParser => {
  return input !== null && typeof input === 'object' && 'parse' in input && 'name' in input
}

export const isParserRecords = <TParserRecords extends Record<string, Parser<unknown>>>(
  input: unknown,
): input is TParserRecords =>
  input instanceof Object &&
  !(input instanceof Array) &&
  !(input instanceof Boolean) &&
  !(input instanceof Date) &&
  !(input instanceof Error) &&
  !(input instanceof Function) &&
  !(input instanceof Number) &&
  !(input instanceof RegExp) &&
  !(input instanceof String)
// && Object.values(input).every((value) => isParser(value))
// 'parse' in input &&
// 'name' in input
