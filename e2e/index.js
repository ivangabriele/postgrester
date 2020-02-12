const postgrester = require("..");

const baseURL = "https://contributions-api.codedutravail.fabrique.social.gouv.fr";

const postgrestClient = postgrester.create({
  axiosConfig: { baseURL }
});

(async () => {
  try {
    const { data } = await postgrestClient.select("*").get("/questions");

    if (!Array.isArray(data)) throw new Error(`Expected an array by got a "${typeof data}".`);
    if (data.length === 0) throw new Error(`Expected a non-empty array but got an empty one.`);
    process.exit(0);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
})();
