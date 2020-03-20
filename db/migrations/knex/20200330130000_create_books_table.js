exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE api.books(
      id serial PRIMARY KEY,
      title varchar(255) NOT NULL,

      author_id serial REFERENCES api.authors(id)
    );

    GRANT SELECT ON api.books TO anonymous;
    GRANT USAGE, SELECT ON SEQUENCE api.books_id_seq TO member;
    GRANT SELECT, INSERT, UPDATE, DELETE ON api.books TO member;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    REVOKE SELECT, INSERT, UPDATE, DELETE ON api.books FROM member;
    REVOKE USAGE, SELECT ON SEQUENCE api.books_id_seq FROM member;
    REVOKE SELECT ON api.books FROM anonymous;

    DROP TABLE api.books;
  `);
};
