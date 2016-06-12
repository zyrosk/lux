import Logger from '../../logger';
import Database from '../../database';
import loader from '../../loader';

const { env: { PWD } } = process;

/**
 * @private
 */
export default async function dbSeed() {
  const { database: config } = loader(PWD, 'config');
  const seed = loader(PWD, 'seed');
  const models = loader(PWD, 'models');

  await new Database({
    config,
    models,
    path: PWD,

    logger: await new Logger({
      path: PWD,
      enabled: false
    })
  });

  await seed();
}
