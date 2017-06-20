/* @flow */

import { NODE_ENV } from '@lux/constants'
import { mock, http } from '@lux/packages/adapter'
import type { AdapterFactory } from '@lux/packages/adapter'
import type { Config as LoggerConfig } from '@lux/packages/logger'

export type Config = {
  server: {
    cors: {
      enabled: boolean,
    },
  },
  adapter: AdapterFactory,
  logging: LoggerConfig,
}

export function createDefaultConfig(): Config {
  const isTestENV = NODE_ENV === 'test'
  const isProdENV = NODE_ENV === 'production'

  return {
    server: {
      cors: {
        enabled: false,
      },
    },
    adapter: isTestENV ? mock : http,
    logging: {
      level: isProdENV ? 'INFO' : 'DEBUG',
      format: isProdENV ? 'json' : 'text',
      enabled: !isTestENV,
      filter: {
        params: [],
      },
    },
  }
}
