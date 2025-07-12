import { parse } from '@/core/parse'

import * as v from '../'

export type MqttConfig = {
  mqtt_broker: string
  mqtt_user: string
  mqtt_pass: string
}

export type MqttCallback = (
  source: string,
  type: string,
  message: MqttButtonAdv1 | MqttButtonAdv4 | MqttButtonAdv8 | MqttGatewayAlive,
) => void

export type MqttButtonAdv1 = {
  type: number
  dmac: string
  time: string
  rssi: number
  ver: number
  vbatt: number
  temp: number
  humidty: number
  x0: number
  y0: number
  z0: number
  newTHCnt: number
}

export type MqttButtonAdv4 = {
  type: number
  dmac: string
  uuid: string
  majorID: number
  minorID: number
  refpower: number
  rssi: number
  time: string
}

export type MqttButtonAdv8 = {
  type: number
  dmac: string
  vbatt: number
  temp: number
  advCnt: number
  secCnt: number
  rssi: number
  time: string
}

export type MqttGatewayAlive = {
  msg: string
  gmac: string
  ver: string
  subaction: string
  pubaction: string
  downDevices: number
  blever: string
  wanIP: string
  hver: string
  model: string
  temp: number
  lowVoltage: number
  voltageDjk: number
  load: number
  mem_free: number
  utc: number
  uptime: number
  state: number
}

export type MqttBeaconMessage = MqttButtonAdv1 | MqttButtonAdv4 | MqttButtonAdv8

export type MqttGatewayAdvData = {
  msg: string
  gmac: string
  obj: MqttBeaconMessage[]
}

type ErrorCounter = { count: number }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function json_safe_parse(str: string): any {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}

// Schemas
const MqttButtonAdv1SchemaValidathor = v.object({
  type: v.literal(1),
  dmac: v.string(),
  time: v.string(),
  rssi: v.number(),
  ver: v.number(),
  vbatt: v.number(),
  temp: v.number(),
  humidty: v.number(),
  x0: v.number(),
  y0: v.number(),
  z0: v.number(),
  newTHCnt: v.number(),
})

const MqttButtonAdv4SchemaValidathor = v.object({
  type: v.literal(4),
  dmac: v.string(),
  uuid: v.string(),
  majorID: v.number(),
  minorID: v.number(),
  refpower: v.number(),
  rssi: v.number(),
  time: v.string(),
})

const MqttButtonAdv8SchemaValidathor = v.object({
  type: v.literal(8),
  dmac: v.string(),
  vbatt: v.number(),
  temp: v.number(),
  advCnt: v.number(),
  secCnt: v.number(),
  rssi: v.number(),
  time: v.string(),
})

const MqttGatewayAliveSchemaValidathor = v.object({
  msg: v.literal('alive'),
  gmac: v.string(),
  ver: v.string(),
  subaction: v.string(),
  pubaction: v.string(),
  downDevices: v.number(),
  blever: v.string(),
  wanIP: v.string(),
  hver: v.string(),
  model: v.string(),
  temp: v.number(),
  lowVoltage: v.number(),
  voltageDjk: v.number(),
  load: v.number(),
  mem_free: v.number(),
  utc: v.number(),
  uptime: v.number(),
  state: v.number(),
})

const MqttBeaconMessageSchemaValidathor = v.union([
  MqttButtonAdv1SchemaValidathor,
  MqttButtonAdv4SchemaValidathor,
  MqttButtonAdv8SchemaValidathor,
])

const MqttGatewayAdvDataSchemaValidathor = v.object({
  msg: v.literal('advData'),
  gmac: v.string(),
  obj: v.array(MqttBeaconMessageSchemaValidathor),
})

const MqttGatewayMessageSchemaValidathor = v.union([
  MqttGatewayAdvDataSchemaValidathor,
  MqttGatewayAliveSchemaValidathor,
])

export async function process_validathor(
  message: Buffer,
  callback: MqttCallback,
  errorCounter: ErrorCounter,
): Promise<void> {
  // eslint-disable-next-line no-control-regex
  const msg_string = message.toString().replace(/[\u0000-\u0019]+/g, '')
  const payload = json_safe_parse(msg_string)
  if (!payload) {
    errorCounter.count++
    return
  }

  let result

  try {
    result = MqttGatewayMessageSchemaValidathor.parse(payload)
  } catch {
    errorCounter.count++
    return
  }

  const validatedPayload = result
  if (validatedPayload.msg === 'advData') {
    const payload_adv = validatedPayload
    payload_adv.obj.forEach((obj) => {
      if (obj.type === 1) {
        callback(payload_adv.gmac, 'adv1', obj as MqttButtonAdv1)
      } else if (obj.type === 4) {
        callback(payload_adv.gmac, 'adv4', obj as MqttButtonAdv4)
      } else if (obj.type === 8) {
        callback(payload_adv.gmac, 'adv8', obj as MqttButtonAdv8)
      }
    })
  } else if (validatedPayload.msg === 'alive') {
    callback(validatedPayload.gmac, 'alive', validatedPayload as MqttGatewayAlive)
  }
}

// Extended example demonstrating all schema types
describe('All validathor schema types', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should demonstrate usage of all schema types', () => {
    // Boolean schema
    const isActiveSchema = v.boolean()
    expect(parse(isActiveSchema, true)).toEqual(true)

    // Date schema
    const lastSeenSchema = v.date()
    const testDate = new Date('2024-01-01T00:00:00Z')
    expect(parse(lastSeenSchema, testDate)).toEqual(testDate)

    // Enum schema
    const statusSchema = v.enum_(['online', 'offline', 'idle'])
    expect(parse(statusSchema, 'online')).toEqual('online')

    // Tuple schema
    const coordinatesSchema = v.tuple([v.number(), v.number(), v.number()])
    expect(parse(coordinatesSchema, [10, 20, 30])).toEqual([10, 20, 30])

    // Complex schema combining all types
    const complexSchema = v.object({
      id: v.string(),
      isActive: v.boolean(),
      status: v.enum_(['online', 'offline', 'idle']),
      lastSeen: v.date(),
      macAddress: v.string(),
      coordinates: v.tuple([v.number(), v.number(), v.number()]),
      tags: v.array(v.string()),
      metadata: v.union([
        v.object({ type: v.literal('sensor'), sensorId: v.string() }),
        v.object({ type: v.literal('gateway'), gatewayId: v.string() }),
      ]),
    })

    const testData = {
      id: 'device-001',
      isActive: true,
      status: 'online' as const,
      lastSeen: new Date('2024-01-01T00:00:00Z'),
      macAddress: 'AA:BB:CC:DD:EE:FF',
      coordinates: [10, 20, 30] as [number, number, number],
      tags: ['iot', 'sensor', 'temperature'],
      metadata: { type: 'sensor' as const, sensorId: 'temp-001' },
    }

    expect(parse(complexSchema, testData)).toEqual(testData)
  })
})

describe('process_validathor with union schemas', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockCallback: any
  let errorCounter: { count: number }

  beforeEach(() => {
    mockCallback = vi.fn()
    errorCounter = { count: 0 }
  })

  describe('MqttGatewayAdvData messages', () => {
    it('should parse and process advData messages with type 1 beacons', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 1,
              dmac: '11:22:33:44:55:66',
              time: '2024-01-01T00:00:00Z',
              rssi: -65,
              ver: 1,
              vbatt: 3000,
              temp: 22.5,
              humidty: 45.2,
              x0: 10,
              y0: 20,
              z0: 30,
              newTHCnt: 5,
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith(
        'AA:BB:CC:DD:EE:FF',
        'adv1',
        expect.objectContaining({
          type: 1,
          dmac: '11:22:33:44:55:66',
          vbatt: 3000,
          temp: 22.5,
        }),
      )
    })

    it('should parse and process advData messages with type 4 beacons', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 4,
              dmac: '11:22:33:44:55:66',
              uuid: '550e8400-e29b-41d4-a716-446655440000',
              majorID: 100,
              minorID: 200,
              refpower: -55,
              rssi: -70,
              time: '2024-01-01T00:00:00Z',
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith(
        'AA:BB:CC:DD:EE:FF',
        'adv4',
        expect.objectContaining({
          type: 4,
          uuid: '550e8400-e29b-41d4-a716-446655440000',
          majorID: 100,
          minorID: 200,
        }),
      )
    })

    it('should parse and process advData messages with type 8 beacons', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 8,
              dmac: '11:22:33:44:55:66',
              vbatt: 2800,
              temp: 25.0,
              advCnt: 100,
              secCnt: 50,
              rssi: -68,
              time: '2024-01-01T00:00:00Z',
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith(
        'AA:BB:CC:DD:EE:FF',
        'adv8',
        expect.objectContaining({
          type: 8,
          vbatt: 2800,
          temp: 25.0,
          advCnt: 100,
        }),
      )
    })

    it('should handle multiple beacons in a single advData message', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 1,
              dmac: '11:11:11:11:11:11',
              time: '2024-01-01T00:00:00Z',
              rssi: -65,
              ver: 1,
              vbatt: 3000,
              temp: 22.5,
              humidty: 45.2,
              x0: 10,
              y0: 20,
              z0: 30,
              newTHCnt: 5,
            },
            {
              type: 4,
              dmac: '22:22:22:22:22:22',
              uuid: '550e8400-e29b-41d4-a716-446655440000',
              majorID: 100,
              minorID: 200,
              refpower: -55,
              rssi: -70,
              time: '2024-01-01T00:00:00Z',
            },
            {
              type: 8,
              dmac: '33:33:33:33:33:33',
              vbatt: 2800,
              temp: 25.0,
              advCnt: 100,
              secCnt: 50,
              rssi: -68,
              time: '2024-01-01T00:00:00Z',
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(3)
      expect(mockCallback).toHaveBeenNthCalledWith(
        1,
        'AA:BB:CC:DD:EE:FF',
        'adv1',
        expect.any(Object),
      )
      expect(mockCallback).toHaveBeenNthCalledWith(
        2,
        'AA:BB:CC:DD:EE:FF',
        'adv4',
        expect.any(Object),
      )
      expect(mockCallback).toHaveBeenNthCalledWith(
        3,
        'AA:BB:CC:DD:EE:FF',
        'adv8',
        expect.any(Object),
      )
    })
  })

  describe('MqttGatewayAlive messages', () => {
    it('should parse and process alive messages', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'alive',
          gmac: 'AA:BB:CC:DD:EE:FF',
          ver: '1.0.0',
          subaction: 'subscribe',
          pubaction: 'publish',
          downDevices: 5,
          blever: '2.0.0',
          wanIP: '192.168.1.100',
          hver: '3.0.0',
          model: 'GW1000',
          temp: 30.5,
          lowVoltage: 3200,
          voltageDjk: 3300,
          load: 50,
          mem_free: 1024,
          utc: 1704067200,
          uptime: 86400,
          state: 1,
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith(
        'AA:BB:CC:DD:EE:FF',
        'alive',
        expect.objectContaining({
          msg: 'alive',
          gmac: 'AA:BB:CC:DD:EE:FF',
          model: 'GW1000',
          temp: 30.5,
        }),
      )
    })
  })

  describe('Union schema validation errors', () => {
    it('should increment error counter for invalid JSON', async () => {
      const message = Buffer.from('invalid json{')

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(1)
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should increment error counter for messages that do not match any union schema', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'unknown',
          randomField: 'value',
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(1)
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should increment error counter for advData with invalid beacon types', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 1,
              dmac: '11:22:33:44:55:66',
              // Missing required fields for type 1
              rssi: -65,
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(1)
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should increment error counter for alive messages with missing fields', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'alive',
          gmac: 'AA:BB:CC:DD:EE:FF',
          // Missing all other required fields
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(1)
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should ignore unknown beacon types in advData', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 1,
              dmac: '11:11:11:11:11:11',
              time: '2024-01-01T00:00:00Z',
              rssi: -65,
              ver: 1,
              vbatt: 3000,
              temp: 22.5,
              humidty: 45.2,
              x0: 10,
              y0: 20,
              z0: 30,
              newTHCnt: 5,
            },
            {
              type: 99, // Unknown type
              dmac: '99:99:99:99:99:99',
              someField: 'value',
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(1)
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should handle messages with null bytes', async () => {
      const messageStr = 'test\u0000message\u0010with\u0019nulls'
      const message = Buffer.from(messageStr)

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(1)
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should fail validation when beacon array contains mixed valid and invalid objects', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 1,
              dmac: '11:11:11:11:11:11',
              time: '2024-01-01T00:00:00Z',
              rssi: -65,
              ver: 1,
              vbatt: 3000,
              temp: 22.5,
              humidty: 45.2,
              x0: 10,
              y0: 20,
              z0: 30,
              newTHCnt: 5,
            },
            {
              type: 4,
              // Invalid type 4 - missing required fields
              dmac: '22:22:22:22:22:22',
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(1)
      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('Edge cases and special scenarios', () => {
    it('should handle empty beacon array in advData', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should process messages after removing control characters', async () => {
      const messageWithControlChars = JSON.stringify({
        msg: 'alive',
        gmac: 'AA:BB:CC:DD:EE:FF',
        ver: '1.0.0',
        subaction: 'subscribe',
        pubaction: 'publish',
        downDevices: 5,
        blever: '2.0.0',
        wanIP: '192.168.1.100',
        hver: '3.0.0',
        model: 'GW1000',
        temp: 30.5,
        lowVoltage: 3200,
        voltageDjk: 3300,
        load: 50,
        mem_free: 1024,
        utc: 1704067200,
        uptime: 86400,
        state: 1,
      })

      // Add control characters
      const message = Buffer.from('\u0000\u0001' + messageWithControlChars + '\u0019')

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })
  })

  describe('Additional schema types coverage', () => {
    it('should handle messages with boolean, date, and enum fields', async () => {
      // Create an extended beacon type that uses more schema types
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 1,
              dmac: '11:22:33:44:55:66',
              time: '2024-01-01T00:00:00Z',
              rssi: -65,
              ver: 1,
              vbatt: 3000,
              temp: 22.5,
              humidty: 45.2,
              x0: 10,
              y0: 20,
              z0: 30,
              newTHCnt: 5,
              // Additional fields that would use other schema types
              isActive: true, // boolean
              lastSeen: '2024-01-01T12:00:00Z', // date string
              status: 'online', // enum-like string
              macPattern: 'AA:BB:CC:DD:EE:FF', // regex pattern
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      // The current schema doesn't validate these extra fields, but they should be ignored
      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })

    it('should validate tuple-like structures in beacon coordinates', async () => {
      // The x0, y0, z0 fields could be represented as a tuple
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 1,
              dmac: '11:22:33:44:55:66',
              time: '2024-01-01T00:00:00Z',
              rssi: -65,
              ver: 1,
              vbatt: 3000,
              temp: 22.5,
              humidty: 45.2,
              x0: 10,
              y0: 20,
              z0: 30,
              newTHCnt: 5,
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(mockCallback).toHaveBeenCalledWith(
        'AA:BB:CC:DD:EE:FF',
        'adv1',
        expect.objectContaining({
          x0: 10,
          y0: 20,
          z0: 30,
        }),
      )
    })

    it('should handle enum-like string values in gateway messages', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'alive',
          gmac: 'AA:BB:CC:DD:EE:FF',
          ver: '1.0.0',
          subaction: 'subscribe', // enum-like: 'subscribe' | 'unsubscribe'
          pubaction: 'publish', // enum-like: 'publish' | 'unpublish'
          downDevices: 5,
          blever: '2.0.0',
          wanIP: '192.168.1.100',
          hver: '3.0.0',
          model: 'GW1000',
          temp: 30.5,
          lowVoltage: 3200,
          voltageDjk: 3300,
          load: 50,
          mem_free: 1024,
          utc: 1704067200,
          uptime: 86400,
          state: 1, // Could be an enum: 0 | 1 | 2
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledWith(
        'AA:BB:CC:DD:EE:FF',
        'alive',
        expect.objectContaining({
          subaction: 'subscribe',
          pubaction: 'publish',
          state: 1,
        }),
      )
    })

    it('should validate MAC addresses that match regex patterns', async () => {
      const validMacMessage = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF', // Valid MAC format
          obj: [
            {
              type: 1,
              dmac: '11:22:33:44:55:66', // Valid MAC format
              time: '2024-01-01T00:00:00Z',
              rssi: -65,
              ver: 1,
              vbatt: 3000,
              temp: 22.5,
              humidty: 45.2,
              x0: 10,
              y0: 20,
              z0: 30,
              newTHCnt: 5,
            },
          ],
        }),
      )

      await process_validathor(validMacMessage, mockCallback, errorCounter)
      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(1)

      // Test with invalid MAC format (though current schema just uses string())
      const invalidMacMessage = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'INVALID-MAC-FORMAT',
          obj: [
            {
              type: 1,
              dmac: 'NOT-A-MAC',
              time: '2024-01-01T00:00:00Z',
              rssi: -65,
              ver: 1,
              vbatt: 3000,
              temp: 22.5,
              humidty: 45.2,
              x0: 10,
              y0: 20,
              z0: 30,
              newTHCnt: 5,
            },
          ],
        }),
      )

      // Current schema accepts any string for MAC addresses
      await process_validathor(invalidMacMessage, mockCallback, errorCounter)
      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledTimes(2)
    })

    it('should handle date strings in time fields', async () => {
      const message = Buffer.from(
        JSON.stringify({
          msg: 'advData',
          gmac: 'AA:BB:CC:DD:EE:FF',
          obj: [
            {
              type: 1,
              dmac: '11:22:33:44:55:66',
              time: '2024-01-01T00:00:00.000Z', // ISO 8601 date string
              rssi: -65,
              ver: 1,
              vbatt: 3000,
              temp: 22.5,
              humidty: 45.2,
              x0: 10,
              y0: 20,
              z0: 30,
              newTHCnt: 5,
            },
          ],
        }),
      )

      await process_validathor(message, mockCallback, errorCounter)

      expect(errorCounter.count).toEqual(0)
      expect(mockCallback).toHaveBeenCalledWith(
        'AA:BB:CC:DD:EE:FF',
        'adv1',
        expect.objectContaining({
          time: '2024-01-01T00:00:00.000Z',
        }),
      )
    })
  })
})

describe('testing', () => {
  const firstObject = v.object({
    type: v.literal(1),
    message: v.union([
      v.object({
        type: v.literal(1),
        msg: v.string(),
      }),
      v.object({
        type: v.literal(4),
        msg: v.string(),
        time: v.date(),
      }),
      v.object({
        type: v.literal(8),
        value: v.number(),
        msg: v.string(),
      }),
    ]),
  })

  const secondObject = v.object({
    type: v.literal(2),
    message: v.object({
      type: v.literal(420),
      value: v.string(),
    }),
  })

  const schema = v.union([firstObject, secondObject])

  it('should work 1', () => {
    expect(
      schema.parse({
        type: 1,
        message: {
          type: 1,
          msg: 'Hello world',
        },
      }),
    ).toEqual({
      type: 1,
      message: {
        type: 1,
        msg: 'Hello world',
      },
    })
  })

  it('should work 2', () => {
    expect(
      schema.parse({
        type: 1,
        message: {
          type: 4,
          msg: 'Hello world',
          time: new Date(),
        },
      }),
    ).toEqual({
      type: 1,
      message: {
        type: 4,
        msg: 'Hello world',
        time: new Date(),
      },
    })
  })

  it('should work 3', () => {
    expect(
      schema.parse({
        type: 1,
        message: {
          type: 8,
          msg: 'Hello world',
          value: 123,
        },
      }),
    ).toEqual({
      type: 1,
      message: {
        type: 8,
        msg: 'Hello world',
        value: 123,
      },
    })
  })

  it('should work 99', () => {
    expect(
      schema.parse({
        type: 2,
        message: {
          type: 420,
          value: 'Hello world',
        },
      }),
    ).toEqual({
      type: 2,
      message: {
        type: 420,
        value: 'Hello world',
      },
    })
  })
})
