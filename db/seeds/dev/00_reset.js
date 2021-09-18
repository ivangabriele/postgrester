exports.seed = async knex => {
  await knex('api.books').del()
  await knex('api.authors').del()
  await knex('auth.users').del()
}
