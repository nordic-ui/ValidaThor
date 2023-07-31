import { max } from './max'

export const maxDate = (date: Date, message?: string) => ({
  ...max(date.valueOf(), message),
  name: 'maxDate' as const,
})
