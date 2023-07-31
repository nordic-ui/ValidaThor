import { max } from './max'

export const maxLength = (value: string, message?: string) => ({
  ...max(value.length, message),
  name: 'maxLength' as const,
})
