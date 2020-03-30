exports.seed = async knex => {
  await knex("api.books").insert([
    {
      title: "An Analysis of Betty Friedan's The Feminine Mystique",
      author_id: 5,
    },
    {
      title: "Anna Karenina",
      author_id: 4,
    },
    {
      title: "Crow Blue",
      author_id: 3,
    },
    {
      title: "Immortality",
      author_id: 2,
    },
    {
      title: "Symphony in White",
      author_id: 3,
    },
    {
      title: "The Prophet",
      author_id: 1,
    },
    {
      title: "The Unbearable Lightness of Being",
      author_id: 2,
    },
    {
      title: "War and Peace",
      author_id: 4,
    },
  ]);
};
