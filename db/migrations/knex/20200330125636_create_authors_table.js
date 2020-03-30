exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE api.authors(
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL
    );

    GRANT SELECT ON api.authors TO anonymous;
    GRANT USAGE, SELECT ON SEQUENCE api.authors_id_seq TO member;
    GRANT SELECT, INSERT, UPDATE, DELETE ON api.authors TO member;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    REVOKE SELECT, INSERT, UPDATE, DELETE ON api.authors FROM member;
    REVOKE USAGE, SELECT ON SEQUENCE api.authors_id_seq FROM member;
    REVOKE SELECT ON api.authors FROM anonymous;

    DROP TABLE api.authors;
  `);
};
