const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
require("colors");

const { version: VERSION } = require("../../package");
const CHANGELOG_PATH = path.join(__dirname, "../../CHANGELOG.md");
const CHANGELOG_REGEX = /## \[UNRELEASED\]/;
const DATE = new Date().toISOString().split("T")[0];
const NEW_CHANGELOG_VERSION = `## [${VERSION}] - ${DATE}`;

function run(command) {
  shelljs.echo(`Running: \`${command}\`…`.blue);
  const output = shelljs.exec(command);
  if (output.code !== 0) shelljs.exit(1);
}

(() => {
  try {
    const changelogSource = fs.readFileSync(CHANGELOG_PATH, "utf8");
    if (!CHANGELOG_REGEX.test(changelogSource)) {
      throw new Error(`Missing or malformed "## [UNRELEASED]" in CHANGELOG.md.`);
    }
    console.log(CHANGELOG_REGEX.test(changelogSource));
    run(`git checkout -B ${VERSION}`);
    const newChangelogSource = changelogSource.replace(CHANGELOG_REGEX, NEW_CHANGELOG_VERSION);
    fs.writeFileSync(CHANGELOG_PATH, newChangelogSource);
    run(`git add .`);
  } catch (err) {
    shelljs.echo(`[scripts/ci/release.js] Error: ${err.message}`.red);

    shelljs.exit(1);
  }
})();
