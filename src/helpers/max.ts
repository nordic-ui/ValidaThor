import { HelperReturnType } from '../types'

export const max = (max: number, message?: string): HelperReturnType => {
  const errorMessage = message || 'Maximum value exceeded'
  return {
    name: 'max',
    args: { max, message: errorMessage },
  }
}
