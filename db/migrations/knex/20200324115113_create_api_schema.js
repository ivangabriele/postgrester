exports.up = function (knex) {
  return knex.raw(`
    CREATE SCHEMA api;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    DROP SCHEMA api;
  `);
};
