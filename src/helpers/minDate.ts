import { min } from './min'

export const minDate = (date: Date, message?: string) => ({
  ...min(date.valueOf(), message),
  name: 'minDate' as const,
})
