import { HelperReturnType } from '../types'

export const min = (min: number, message?: string): HelperReturnType => {
  const errorMessage = message || 'Minimum value not met'
  return {
    name: 'min',
    args: { min, message: errorMessage },
  }
}
