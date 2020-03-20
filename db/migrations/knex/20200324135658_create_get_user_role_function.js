exports.up = function (knex) {
  return knex.raw(`
    CREATE EXTENSION pgcrypto;

    -- Get the "role" of a user in "auth.users" table.
    CREATE FUNCTION
      auth.get_user_role(email text, password text) RETURNS name AS $$
      BEGIN
        RETURN (
          SELECT ROLE FROM auth.users
          WHERE users.email = user_role.email
          AND users.password = crypt(user_role.password, users.password)
        );
      END
      $$ LANGUAGE plpgsql;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    DROP FUNCTION auth.get_user_role;

    DROP EXTENSION pgcrypto;
  `);
};
