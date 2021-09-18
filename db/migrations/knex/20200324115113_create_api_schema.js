exports.up = knex =>
  knex.raw(`
    CREATE SCHEMA api;
  `)

exports.down = knex =>
  knex.raw(`
    DROP SCHEMA api;
  `)
