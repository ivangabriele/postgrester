exports.seed = async knex => {
  await knex("auth.users").insert([
    {
      id: 1,
      email: "bob@example.org",
      password: "Qwerty123",
      role: "member",
    },
  ]);
};
