/* @flow */

import type { Model } from '../../database'

/**
 * @private
 */
export default function resolveRelationships<T: Model>(
  model: Class<T>,
  relationships: Object = {}
): Object {
  return Object.entries(relationships).reduce((obj, [key, value]) => {
    let { data = null } = value || {}

    if (data) {
      const opts = model.relationshipFor(key)

      if (opts) {
        if (Array.isArray(data)) {
          data = data.map(item => Reflect.construct(opts.model, [item]))
        } else {
          data = Reflect.construct(opts.model, [data])
        }
      }
    }

    return {
      ...obj,
      [key]: data
    }
  }, {})
}
