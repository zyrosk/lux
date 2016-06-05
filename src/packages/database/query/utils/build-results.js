// @flow
import { camelize } from 'inflection';

import Model from '../../model';

import entries from '../../../../utils/entries';
import promiseHash from '../../../../utils/promise-hash';

export default async function buildResults({
  model,
  records,
  relationships
}: {
  model: typeof Model,
  records: Promise<Array<Object>>,
  relationships: Object
}): Promise<Array<Object>> {
  let related;

  const pkPattern = new RegExp(`^.+\.${model.primaryKey}$`);
  let results = await records;

  if (Object.keys(relationships).length) {
    related = entries(relationships)
      .reduce((hash, [name, relationship]) => {
        const foreignKey = camelize(relationship.foreignKey, true);

        hash[name] = relationship.model
          .select(...relationship.attrs)
          .where({
            [foreignKey]: results.map(({ id }) => id)
          });

        return hash;
      }, {});

    related = await promiseHash(related);
  }

  return results.map((record) => {
    entries(related)
      .forEach(([name, relatedresults]: [string, Array<{}>]) => {
        const relationship = model.relationshipFor(name);

        if (relationship) {
          let { foreignKey } = relationship;
          foreignKey = camelize(foreignKey, true);

          const match = relatedresults.filter((relatedRecord): boolean => {
            return record[model.primaryKey] ===
              relatedRecord[camelize(foreignKey, true)];
          });

          if (match.length) {
            record[name] = match;
          }
        }
      });

    record = entries(record)
      .reduce((r, [key, value]) => {
        if (!value && pkPattern.test(key)) {
          return r;
        } else if (key.indexOf('.') >= 0) {
          const [a, b] = key.split('.');
          let parent: ?Object = r[a];

          if (!parent) {
            parent = {};
          }

          key = a;
          value = {
            ...parent,
            [b]: value
          };
        }

        return {
          ...r,
          [key]: value
        };
      }, {});

    return new model(record);
  });
}
