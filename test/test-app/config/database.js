export default [
  'test',
  'production',
  'development',
].reduce((config, env) => ({
  ...config,
  [env]: {
    pool: { min: 1, max: 10 },
    driver: process.env.DATABASE_DRIVER || 'sqlite3',
    database: 'lux_test',
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
}), {});
