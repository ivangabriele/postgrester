exports.seed = async knex => {
  await knex("api.authors").insert([
    {
      id: 1,
      name: "Khalil Gibran",
    },
    {
      id: 2,
      name: "Milan Kundera",
    },
    {
      id: 3,
      name: "Adriana Lisboa",
    },
    {
      id: 4,
      name: "Leo Tolstoy",
    },
    {
      id: 5,
      name: "Elizabeth Whitaker",
    },
  ]);
};
