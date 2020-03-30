exports.up = function (knex) {
  return knex.raw(`
    CREATE ROLE member NOINHERIT;

    GRANT USAGE ON SCHEMA api, auth, public TO member;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    REVOKE USAGE ON SCHEMA api, auth, public FROM member;

    DROP ROLE member;
  `);
};
