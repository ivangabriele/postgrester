exports.up = function (knex) {
  return knex.raw(`
    CREATE ROLE anonymous NOINHERIT NOLOGIN;

    GRANT USAGE ON SCHEMA api, auth, public TO anonymous;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    REVOKE USAGE ON SCHEMA api, auth, public FROM anonymous;

    DROP ROLE anonymous;
  `);
};
