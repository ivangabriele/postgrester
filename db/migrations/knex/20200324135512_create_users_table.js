exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE auth.users(
      id serial PRIMARY KEY,
      role name NOT NULL,
      email varchar(255) UNIQUE NOT NULL,
      password varchar(255) NOT NULL
    );

    -- Encrypt "password" field value on any INSERT ot UPDATE within "auth.users" table.
    -- https://www.postgresql.org/docs/12/pgcrypto.html
    CREATE FUNCTION
      auth.encrypt_password() RETURNS TRIGGER AS $$
      BEGIN
        IF tg_op = 'INSERT' OR new.password <> old.password THEN
          new.password = crypt(new.password, gen_salt('bf'));
        END IF;

        RETURN new;
      END
      $$ LANGUAGE plpgsql;

    -- Trigger "password" field value encryption on any INSERT ot UPDATE within "auth.users" table.
    CREATE TRIGGER encrypt_password
      BEFORE INSERT OR UPDATE ON auth.users
      FOR EACH ROW
      EXECUTE PROCEDURE auth.encrypt_password();

    -- Anonymous users need access to this table to use the later on login() function.
    -- This table is not exposed by PostgREST since only the ones under "api" schema are.
    GRANT SELECT ON auth.users TO anonymous;
    GRANT USAGE, SELECT ON SEQUENCE auth.users_id_seq TO member;
    GRANT SELECT, INSERT, UPDATE, DELETE ON auth.users TO member;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    REVOKE SELECT, INSERT, UPDATE, DELETE ON auth.users FROM member;
    REVOKE USAGE, SELECT ON SEQUENCE auth.users_id_seq FROM member;
    REVOKE SELECT ON auth.users FROM anonymous;

    DROP TRIGGER encrypt_password ON auth.users;

    DROP FUNCTION auth.encrypt_password;

    DROP TABLE auth.users;
  `);
};
