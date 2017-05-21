/* @flow */

import isNull from './is-null'
import isUndefined from './is-undefined'

type Keyer<K, V> = (item: V) => K

const toMap = <K, V>(source: Array<V>, keyer: Keyer<K, V>): Map<K, V> =>
  source.reduce((map, item) => {
    const key = keyer(item)

    if (!isNull(key) && !isUndefined(key)) {
      map.set(key, item)
    }

    return map
  }, new Map())

export default toMap
