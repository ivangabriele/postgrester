exports.up = function (knex) {
  return knex.raw(`
    -- JWT extension:
    -- https://github.com/michelp/pgjwt
    CREATE EXTENSION pgjwt;

    CREATE TYPE auth.jwt_token AS (token text);

      -- Attempt to login the user matching this email and password and return a JWT valid for 1h.
    CREATE FUNCTION
      api.login(email text, password text) RETURNS auth.jwt_token AS $$
      DECLARE
        _location_name varchar;
        _result auth.jwt_token;
        _role name;
        _user_id char(36);
      BEGIN
        -- Check user email and password
        SELECT auth.get_user_role(email, password) INTO _role;
        IF _role IS NULL THEN
          RAISE invalid_password USING MESSAGE = 'Invalid email and/or password.';
        END IF;

        -- Select the logged user ID and assign it to _user_id variable:
        -- https://www.postgresql.org/docs/12/plpgsql-statements.html#PLPGSQL-STATEMENTS-SQL-ONEROW
        SELECT u.id, u.name, l.name INTO _user_id, _location_name
        FROM auth.users u
        INNER JOIN api.locations l ON u.location_id = l.id
        WHERE u.email = login.email;

        -- Generate a JWT token and return it within a stringified JSON object:
        SELECT sign(row_to_json(r), current_setting('app.jwt_secret')) AS token
        FROM (
          SELECT
            _role AS role,
            _user_id AS id,
            -- Set the JWT expiration date to 30 days from now:
            extract(epoch FROM now())::integer + 2592000 AS exp
        ) r
        INTO _result;

        RETURN _result;
      END
      $$ LANGUAGE plpgsql;

    GRANT EXECUTE ON FUNCTION api.login TO anonymous;
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    REVOKE EXECUTE ON FUNCTION api.login FROM anonymous;

    DROP FUNCTION api.login;

    DROP TYPE auth.jwt_token;

    DROP EXTENSION pgjwt;
  `);
};
