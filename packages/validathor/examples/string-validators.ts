import { string, parse } from '../src'
import {
  url,
  uuid,
  phone,
  ip,
  creditCard,
  trim,
  includes,
  startsWith,
  endsWith,
  slug,
  email,
  min,
  max,
  pattern,
} from '../src/modifiers'

// URL validation
const urlSchema = string([url()])
console.log('URL:', parse(urlSchema, 'https://example.com'))

// UUID validation
const uuidSchema = string([uuid()])
console.log('UUID:', parse(uuidSchema, '123e4567-e89b-12d3-a456-426614174000'))

// Phone number validation
const phoneSchema = string([phone()])
console.log('Phone:', parse(phoneSchema, '+1-555-123-4567'))

// IP address validation
const ipSchema = string([ip()])
console.log('IP:', parse(ipSchema, '192.168.1.1'))

const ipv6Schema = string([ip('v6')])
console.log('IPv6:', parse(ipv6Schema, '2001:db8::8a2e:370:7334'))

// Credit card validation
const creditCardSchema = string([creditCard()])
console.log('Credit Card:', parse(creditCardSchema, '4111 1111 1111 1111'))

// String manipulation with trim
const trimmedSchema = string([trim(), min(1)])
console.log('Trimmed:', parse(trimmedSchema, '  hello world  ')) // Returns: "hello world"

// Substring checking
const includesSchema = string([includes('@'), includes('.com')])
console.log('Includes:', parse(includesSchema, 'user@example.com'))

const startsWithSchema = string([startsWith('https://'), url()])
console.log('Starts with:', parse(startsWithSchema, 'https://secure.example.com'))

const endsWithSchema = string([endsWith('.pdf')])
console.log('Ends with:', parse(endsWithSchema, 'document.pdf'))

// Slug validation
const slugSchema = string([slug()])
console.log('Slug:', parse(slugSchema, 'my-awesome-blog-post'))

// Combined usage - email with specific domain
const emailSchema = string([trim(), email('@company.com')])
console.log('Company Email:', parse(emailSchema, '  john.doe@company.com  '))

// Complex validation - secure URL
const secureUrlSchema = string([trim(), startsWith('https://'), url(), max(100)])
console.log('Secure URL:', parse(secureUrlSchema, 'https://api.example.com/v1/users'))

// Username validation
const usernameSchema = string([trim(), min(3), max(30), slug()])
console.log('Username:', parse(usernameSchema, 'john-doe-123'))

// Pattern validation - alphanumeric only
const alphanumericSchema = string([pattern(/^[a-zA-Z0-9]+$/, { pattern_error: 'Only letters and numbers allowed' })])
console.log('Alphanumeric:', parse(alphanumericSchema, 'Test123'))

// Pattern validation - strong password
const passwordSchema = string([
  min(8),
  pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    { pattern_error: 'Password must contain uppercase, lowercase, number and special character' }
  )
])
console.log('Strong Password:', parse(passwordSchema, 'Test123!@'))

// Pattern validation - hex color
const hexColorSchema = string([
  pattern(/^#[0-9a-fA-F]{6}$/, { pattern_error: 'Must be a valid hex color' })
])
console.log('Hex Color:', parse(hexColorSchema, '#FF5733'))
