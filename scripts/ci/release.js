const ß = require('bhala')
const fs = require('fs')
const path = require('path')
const shelljs = require('shelljs')

const { version: VERSION } = require('../../package.json')

const CHANGELOG_PATH = path.join(__dirname, '../../CHANGELOG.md')
const CHANGELOG_REGEX = /## \[UNRELEASED\]/
const DATE = new Date().toISOString().split('T')[0]
const NEW_CHANGELOG_VERSION = `## [${VERSION}] - ${DATE}`

function run(command) {
  ß.info(`Running: \`${command}\`…`)

  const output = shelljs.exec(command)
  if (output.code !== 0) {
    shelljs.exit(1)
  }
}

;(() => {
  try {
    const changelogSource = fs.readFileSync(CHANGELOG_PATH, 'utf8')
    if (!CHANGELOG_REGEX.test(changelogSource)) {
      throw new Error(`Missing or malformed "## [UNRELEASED]" in CHANGELOG.md.`)
    }

    run(`git checkout -B ${VERSION}`)

    const newChangelogSource = changelogSource.replace(CHANGELOG_REGEX, NEW_CHANGELOG_VERSION)
    fs.writeFileSync(CHANGELOG_PATH, newChangelogSource)

    run(`git add .`)
    run(`git commit --amend --no-edit`)
    run(`git tag -f v${VERSION}`)
    run(`git push origin HEAD --tags`)

    run(`git checkout main`)
    run(`git fetch`)
    run(`git reset --hard origin/main`)
  } catch (err) {
    ß.error(`[scripts/ci/release.js] Error: ${err.message}`)

    shelljs.exit(1)
  }
})()
