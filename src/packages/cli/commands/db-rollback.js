import Database from '../../database';
import Logger, { sql } from '../../logger';
import fs from '../../fs';
import loader from '../../loader';

const { env: { PWD } } = process;

/**
 * @private
 */
export default async function dbRollback() {
  const { database: config } = loader(PWD, 'config');
  const models = loader(PWD, 'models');
  const migrations = loader(PWD, 'migrations');

  const { connection, schema } = await new Database({
    config,
    models,
    path: PWD,
    checkMigrations: false,

    logger: await new Logger({
      path: PWD,
      enabled: false
    })
  });

  const migrationFiles = await fs.readdirAsync(`${PWD}/db/migrate`);

  if (migrationFiles.length) {
    let migration;
    let version = await connection('migrations')
      .orderBy('version', 'desc')
      .first();

    if (version && version.version) {
      version = version.version;
    }

    const target = migrationFiles.find(m => m.indexOf(version) === 0);

    if (target) {
      migration = target.replace(new RegExp(`${version}-(.+)\.js`), '$1');
      migration = migrations.get(`${migration}-down`);

      if (migration) {
        const query = migration.run(schema());

        await query.on('query', () => {
          process.stdout.write(sql`${query.toString()}\n`);
        });

        await connection('migrations').where({
          version
        }).del();
      }
    }
  }
}
