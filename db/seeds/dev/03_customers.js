exports.seed = async knex => {
  await knex('api.customers').insert([
    {
      email: 'bob.dylan@protonmail.com',
      name: 'Bob Dylan',
    },
  ])
}
