const { readFileSync, writeFileSync } = require("fs");
const { parser } = require("keep-a-changelog");

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const changelog = parser(readFileSync("./CHANGELOG.md", "UTF-8"));

let source = "";
changelog.releases[0].changes.forEach((changes, key) => {
  if (changes.length === 0) return;

  if (source.length !== 0) source += "\n";
  source += `### ${capitalize(key)}\n\n`;
  source += changes.reduce((prev, change) => `${prev}${change}\n`, "");
});

writeFileSync("./RELEASE_NOTES.md", source.trim(), "utf8");
