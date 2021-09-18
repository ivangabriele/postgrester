exports.seed = async knex => {
  await knex('auth.users').insert([
    {
      email: 'bob@example.org',
      id: 1,
      password: 'Qwerty123',
      role: 'member',
    },
  ])
}
