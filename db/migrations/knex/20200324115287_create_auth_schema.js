exports.up = knex =>
  knex.raw(`
    CREATE SCHEMA auth;
  `)

exports.down = knex =>
  knex.raw(`
    DROP SCHEMA auth;
  `)
