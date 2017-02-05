// @flow
import type Knex from 'knex';

import createSchemaBuilder from './utils/create-schema-builder';

type Schema = $PropertyType<Knex, 'schema'>;
type Migrator = (schema: Schema) => Schema;

/**
 * @private
 */
class Migration {
  run: Migrator;

  constructor(fn: Migrator) {
    this.run = schema => (
      fn(createSchemaBuilder(schema))
    );
  }
}

export default Migration;
export { default as generateTimestamp } from './utils/generate-timestamp';
export type { Migration$Fn } from './interfaces';
