exports.up = knex =>
  knex.raw(`
    CREATE ROLE anonymous NOINHERIT NOLOGIN;

    GRANT USAGE ON SCHEMA api, public TO anonymous;
  `)

exports.down = knex =>
  knex.raw(`
    REVOKE USAGE ON SCHEMA api, public FROM anonymous;

    DROP ROLE anonymous;
  `)
