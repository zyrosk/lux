// @flow
import { pluralize, singularize } from 'inflection';
import type Knex from 'knex';

type Schema = $PropertyType<Knex, 'schema'>;

/**
 * @private
 */
function createTableBuilder(table: any): any {
  return new Proxy(table, {
    get(target, key) {
      switch (key) {
        case 'timestamps':
          return (index: boolean = true) => {
            const result = target.timestamps();

            if (index) {
              target.index('created_at');
              target.index('updated_at');
            }

            return result;
          };

        case 'references':
          return (modelName: string, tableName: string = modelName) => (
            target
              .integer(`${singularize(modelName)}_id`)
              .unsigned()
              .references(`${pluralize(tableName)}.id`)
              .index()
          );

        case 'dropReference':
          return (modelName: string) => (
            target.dropColumn(`${singularize(modelName)}_id`)
          );

        default:
          return target[key];
      }
    }
  });
}

/**
 * @private
 */
export default function createSchemaBuilder(schema: Schema): Schema {
  return new Proxy(schema, {
    get(target, key) {
      switch (key) {
        case 'alterTable':
          return (name: string, fn: Function) => (
            target.alterTable(name, table => fn(createTableBuilder(table)))
          );

        case 'createTable':
          return (name: string, fn: Function) => (
            target.createTable(name, table => fn(createTableBuilder(table)))
          );

        default:
          return target[key];
      }
    }
  });
}
