import { HelperReturnType } from '../types'

export const minDate = (min: Date, message?: string): HelperReturnType => {
  const errorMessage = message || 'Minimum value not met'
  return {
    name: 'minDate',
    args: { minDate: min.valueOf(), message: errorMessage },
  }
}
