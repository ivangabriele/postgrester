exports.up = knex =>
  knex.raw(`
    CREATE TABLE api.authors(
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL UNIQUE
    );

    GRANT USAGE, SELECT ON SEQUENCE api.authors_id_seq TO anonymous;
    GRANT SELECT, INSERT, UPDATE, DELETE ON api.authors TO anonymous;
  `)

exports.down = knex =>
  knex.raw(`
    REVOKE SELECT, INSERT, UPDATE, DELETE ON api.authors FROM anonymous;
    REVOKE USAGE, SELECT ON SEQUENCE api.authors_id_seq FROM anonymous;

    DROP TABLE api.authors;
  `)
