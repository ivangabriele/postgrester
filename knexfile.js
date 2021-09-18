module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgresql://test_db_user:test_db_password@localhost:5432/test_db',
    migrations: {
      directory: `${__dirname}/db/migrations/knex`,
      tableName: 'migrations',
    },
    seeds: {
      directory: `${__dirname}/db/seeds/dev`,
    },
  },
}
