exports.up = knex =>
  knex.raw(`
    ALTER DATABASE test_db
      SET "app.jwt_secret" TO 'a_test_only_postgrest_jwt_secret';
  `)

exports.down = knex =>
  knex.raw(`
    ALTER DATABASE test_db
      RESET "app.jwt_secret";
  `)
