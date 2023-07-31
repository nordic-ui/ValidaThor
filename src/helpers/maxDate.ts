import { HelperReturnType } from '../types'

export const maxDate = (max: Date, message?: string): HelperReturnType => {
  const errorMessage = message || 'Maximum value exceeded'
  return {
    name: 'maxDate',
    args: { maxDate: max.valueOf(), message: errorMessage },
  }
}
