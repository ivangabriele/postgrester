exports.up = function (knex) {
  return knex.raw(`
    CREATE SCHEMA auth;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    DROP SCHEMA auth;
  `);
};
