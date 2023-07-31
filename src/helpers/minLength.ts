import { min } from './min'

export const minLength = (value: string, message?: string) => ({
  ...min(value.length, message),
  name: 'minLength' as const,
})
