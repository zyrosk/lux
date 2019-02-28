import { join as joinPath } from 'path'

import type Knex from 'knex'

import { NODE_ENV, DATABASE_URL } from '../../../constants'
import { VALID_DRIVERS } from '../constants'
import { InvalidDriverError } from '../errors'

/**
 * @private
 */
export default function connect(path: string, config: Object = {}): Knex {
  let { pool } = config

  const {
    host,
    socket,
    driver,
    memory,
    database,
    username,
    password,
    port,
    ssl,
    _instanceKey,
    url
  } = config

  if (VALID_DRIVERS.indexOf(driver) < 0) {
    throw new InvalidDriverError(driver)
  }

  if (pool && typeof pool === 'number') {
    pool = {
      min: pool > 1 ? 2 : 1,
      max: pool
    }
  }

  const knex: Class<Knex> = require(joinPath(path, 'node_modules', 'knex'))
  const usingSQLite = driver === 'sqlite3'
  let filename

  if (usingSQLite) {
    if (memory) {
      pool = undefined
      const memId = _instanceKey || Math.random().toString(36).substring(2)
      filename = `file:db-${memId}?mode=memory&cache=shared`
    } else {
      filename = joinPath(
        path,
        'db',
        `${_instanceKey || database || 'default'}_${NODE_ENV}.sqlite`
      )
    }
  }

  return knex({
    pool,
    connection: DATABASE_URL || url || {
      ssl,
      host,
      port,
      filename,
      database,
      password,
      user: username,
      socketPath: socket,
    },
    debug: false,
    client: driver,
    useNullAsDefault: usingSQLite,
  })
}
