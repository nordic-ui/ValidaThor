type TypeErrorCode = `ERR_TYP_${number}`
type ValidationErrorCode = `ERR_VAL_${number}`

type ErrorPayload<TErrorCode> = {
  code: TErrorCode
  message: (...args: string[]) => string
}

type ErrorCodes<TError extends string> = Record<TError, ErrorPayload<TError>>

const TYPE_ERROR_CODE: ErrorCodes<TypeErrorCode> = {
  // Generic type errors
  ERR_TYP_0000: {
    code: 'ERR_TYP_1000',
    message: () => 'Expected a valid value',
  },
  ERR_TYP_0001: {
    code: 'ERR_TYP_1000',
    message: () => "Value can't be null or undefined",
  },

  // Number type errors
  ERR_TYP_1000: {
    code: 'ERR_TYP_1000',
    message: () => 'Expected a number',
  },
  ERR_TYP_1001: {
    code: 'ERR_TYP_1001',
    message: () => 'Expected a finite number',
  },

  // String type errors
  ERR_TYP_2000: {
    code: 'ERR_TYP_2000',
    message: () => 'Expected a string',
  },
  ERR_TYP_2001: {
    code: 'ERR_TYP_2001',
    message: () => 'Expected an email',
  },

  // Date type errors
  ERR_TYP_3000: {
    code: 'ERR_TYP_3000',
    message: () => 'Expected a date',
  },
  ERR_TYP_3001: {
    code: 'ERR_TYP_3001',
    message: () => 'Minimum date must be a valid date',
  },
  ERR_TYP_3002: {
    code: 'ERR_TYP_3002',
    message: () => 'Maximum date must be a valid date',
  },

  // Regex type errors
  ERR_TYP_4000: {
    code: 'ERR_TYP_4000',
    message: () => 'Expected a valid RegExp',
  },

  // Object type errors
  ERR_TYP_5000: {
    code: 'ERR_TYP_5000',
    message: () => 'Expected an object',
  },

  // Enum type errors
  ERR_TYP_6000: {
    code: 'ERR_TYP_6000',
    message: () => 'Expected a string or number',
  },

  // Boolean type errors
  ERR_TYP_7000: {
    code: 'ERR_TYP_7000',
    message: () => 'Expected a boolean',
  },

  // Array type errors
  ERR_TYP_8000: {
    code: 'ERR_TYP_8000',
    message: () => 'Expected an array',
  },
}

const VALIDATION_ERROR_CODE: ErrorCodes<ValidationErrorCode> = {
  // Generic validation errors
  ERR_VAL_0000: {
    code: 'ERR_VAL_0000',
    message: () => 'Validation error',
  },
  ERR_VAL_0100: {
    code: 'ERR_VAL_0100',
    message: () => 'Minimum length must be a positive number',
  },
  ERR_VAL_0200: {
    code: 'ERR_VAL_0200',
    message: () => 'Maximum length must be a positive number',
  },

  // Number validation errors
  ERR_VAL_1000: {
    code: 'ERR_VAL_1000',
    message: () => 'Expected a non-empty number',
  },

  // String validation errors
  ERR_VAL_2000: {
    code: 'ERR_VAL_2000',
    message: () => 'Expected a non-empty string',
  },
  ERR_VAL_2001: {
    code: 'ERR_VAL_2001',
    message: (min: string) => `Value must be at least ${min} characters long`,
  },
  ERR_VAL_2002: {
    code: 'ERR_VAL_2002',
    message: (min: string) => `Value must be at least ${min} or more`,
  },
  ERR_VAL_2003: {
    code: 'ERR_VAL_2003',
    message: (max: string) => `Value must be at most ${max} characters long`,
  },
  ERR_VAL_2004: {
    code: 'ERR_VAL_2004',
    message: (max: string) => `Value must be at most ${max} or less`,
  },
  ERR_VAL_2005: {
    code: 'ERR_VAL_2005',
    message: (domain: string) => `Expected an email ending with ${domain}`,
  },

  // Date validation errors
  ERR_VAL_3001: {
    code: 'ERR_VAL_3001',
    message: (min: string) => `Value must be at least ${min}`,
  },
  ERR_VAL_3002: {
    code: 'ERR_VAL_3002',
    message: (max: string) => `Value must be at most ${max}`,
  },

  // Regex validation errors
  ERR_VAL_4000: {
    code: 'ERR_VAL_4000',
    message: () => 'Value must match the regular expression',
  },

  // Object validation errors
  ERR_VAL_5000: {
    code: 'ERR_VAL_5000',
    message: () => 'Value must be an object',
  },

  // Enum validation errors
  ERR_VAL_6000: {
    code: 'ERR_VAL_6000',
    message: () => 'Expected a non-empty input',
  },
  ERR_VAL_6001: {
    code: 'ERR_VAL_6001',
    message: () => 'Value is not a valid enum option',
  },
  ERR_VAL_6002: {
    code: 'ERR_VAL_6002',
    message: () => 'Value is not in the allowed list',
  },

  // Boolean validation errors
  ERR_VAL_7000: {
    code: 'ERR_VAL_7000',
    message: () => 'Expected a boolean',
  },

  // Array validation errors
  ERR_VAL_8000: {
    code: 'ERR_VAL_8000',
    message: () => 'Value must be an array',
  },
  ERR_VAL_8001: {
    code: 'ERR_VAL_8001',
    message: () => 'Expected a non-empty input',
  },
  ERR_VAL_8101: {
    code: 'ERR_VAL_8101',
    message: (min: string) => `Value must be at least ${min} x long`,
  },
  ERR_VAL_8102: {
    code: 'ERR_VAL_8102',
    message: (min: string) => `Value must be at least ${min} or more`,
  },
  ERR_VAL_8103: {
    code: 'ERR_VAL_8103',
    message: (max: string) => `Value must be at most ${max} x long`,
  },
  ERR_VAL_8104: {
    code: 'ERR_VAL_8104',
    message: (max: string) => `Value must be at most ${max} or less`,
  },
}

export const ERROR_CODES: ErrorCodes<TypeErrorCode> & ErrorCodes<ValidationErrorCode> = {
  ...TYPE_ERROR_CODE,
  ...VALIDATION_ERROR_CODE,
}
