exports.up = knex =>
  knex.raw(`
    CREATE TABLE api.customers(
      id serial PRIMARY KEY,
      email varchar(255) NOT NULL UNIQUE,
      name varchar(255) NOT NULL
    );

    GRANT USAGE, SELECT ON SEQUENCE api.customers_id_seq TO anonymous;
    GRANT SELECT, INSERT, UPDATE, DELETE ON api.customers TO anonymous;
  `)

exports.down = knex =>
  knex.raw(`
    REVOKE SELECT, INSERT, UPDATE, DELETE ON api.customers FROM anonymous;
    REVOKE USAGE, SELECT ON SEQUENCE api.customers_id_seq FROM anonymous;

    DROP TABLE api.customers;
  `)
