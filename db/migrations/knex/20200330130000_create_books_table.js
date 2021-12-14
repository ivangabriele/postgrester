exports.up = knex =>
  knex.raw(`
    CREATE TABLE api.books(
      id serial PRIMARY KEY,
      title varchar(255) NOT NULL,

      author_id serial REFERENCES api.authors(id)
    );

    GRANT USAGE, SELECT ON SEQUENCE api.books_id_seq TO anonymous;
    GRANT SELECT, INSERT, UPDATE, DELETE ON api.books TO anonymous;
  `)

exports.down = knex =>
  knex.raw(`
    REVOKE SELECT, INSERT, UPDATE, DELETE ON api.books FROM anonymous;
    REVOKE USAGE, SELECT ON SEQUENCE api.books_id_seq FROM anonymous;

    DROP TABLE api.books;
  `)
