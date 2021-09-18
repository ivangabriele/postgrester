exports.up = knex =>
  knex.raw(`
    CREATE ROLE member NOINHERIT;

    GRANT USAGE ON SCHEMA api, auth, public TO member;
  `)

exports.down = knex =>
  knex.raw(`
    REVOKE USAGE ON SCHEMA api, auth, public FROM member;

    DROP ROLE member;
  `)
