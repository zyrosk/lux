/* @flow */

import { camelize, singularize } from 'inflection'

import Model from '../../../model'
import entries from '../../../../../utils/entries'
import toMap from '../../../../../utils/to-map'
import underscore from '../../../../../utils/underscore'

type Options<T: Model> = {
  model: Class<T>,
  records: Promise<Array<Object>>,
  relationships: Object,
}

const createKeyer = model => row => row[model.primaryKey]

const createLinker = table => related =>
  related
    .map(([name, foreignKey, rows]) => [
      name,
      foreignKey,
      toMap(rows, row => row[foreignKey]),
    ])
    .forEach(([name, , map]) => map.forEach((row, id) => {
      const match = table.get(id)

      if (match) {
        match[name] = row
      }

      map.delete(id)
    }))

const fetchRelationships = (ids, relationships) => {
  const related = entries(relationships).reduce((arr, entry) => {
    const [name, relationship] = entry
    let query = relationship.model.select(...relationship.attrs)
    let foreignKey = camelize(relationship.foreignKey, true)

    if (relationship.through) {
      const baseKey =
        `${relationship.through.tableName}.` +
        `${singularize(underscore(name))}_id`

      foreignKey =
        `${relationship.through.tableName}.` +
        `${relationship.foreignKey}`

      query.snapshots.push(
        ['select', [
          `${baseKey} as ${camelize(baseKey.split('.').pop(), true)}`,
          `${foreignKey} as ${camelize(foreignKey.split('.').pop(), true)}`,
        ]],
        ['innerJoin', [
          relationship.through.tableName,
          `${relationship.model.tableName}.` +
          `${relationship.model.primaryKey}`,
          '=',
          baseKey,
        ]],
      )
    }

    query = query
      .where({
        [foreignKey]: ids,
      })
      .then(record => [
        name,
        foreignKey,
        record,
      ])

    return arr.concat(query)
  }, [])

  return Promise.all(related)
}

/**
 * @private
 */
const buildResults = <T: Model>(options: Options<T>): Promise<Array<T>> =>
  options.records
    .then(rows => {
      const keyer = createKeyer(options.model)
      const table = toMap(rows, keyer)
      const ids = rows.map(keyer)

      return fetchRelationships(ids, options.relationships)
        .then(createLinker(table))
        .then(() => {
          table.clear()
          return rows
        })
    })
    .then(rows => rows.map(row => {
      // eslint-disable-next-line
      const instance = new options.model(row)

      instance.currentChangeSet.persist()
      return instance
    }))


export default buildResults
