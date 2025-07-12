import { assert } from '@/utils/assert/assert'
import { ERROR_CODES } from '@/utils/errors/errorCodes'
import { TypeError, ValidationError } from '@/utils/errors/errors'

export type Ip = {
  name: 'ip'
  validate: (value: string) => string
}

/**
 * Used to validate that a string is a valid IP address (IPv4 or IPv6)
 * @param version [optional] Specify 'v4' or 'v6' to restrict to a specific version
 * @param message [optional] The error message to throw if the IP is invalid
 */
export const ip = (
  version?: 'v4' | 'v6',
  message?: {
    type_error?: string
    invalid_error?: string
  },
): Ip => {
  return {
    name: 'ip' as const,
    validate: (value) => {
      const ipv4Regex =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      const ipv6Regex =
        /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/

      assert(
        typeof value === 'string',
        new TypeError(message?.type_error || ERROR_CODES.ERR_TYP_2000.message()),
      )

      let isValid = false

      if (version === 'v4') {
        isValid = ipv4Regex.test(value)
      } else if (version === 'v6') {
        isValid = ipv6Regex.test(value)
      } else {
        isValid = ipv4Regex.test(value) || ipv6Regex.test(value)
      }

      assert(
        isValid,
        new ValidationError(
          message?.invalid_error || `Expected a valid IP${version ? ` ${version}` : ''} address`,
        ),
      )

      return value
    },
  }
}
