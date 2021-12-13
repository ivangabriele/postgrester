const ß = require('bhala')
const knex = require('knex')
const shelljs = require('shelljs')

if (!shelljs.which('docker')) {
  ß.error('[script/dev/setup] Error: Sorry, this script requires docker.')

  shelljs.exit(1)
}
if (!shelljs.which('docker-compose')) {
  ß.error('[script/dev/setup] Error: Sorry, this script requires docker-compose.')

  shelljs.exit(1)
}

const DB_URI = `postgresql://test_db_user:test_db_password@localhost:5432/test_db`

const knexClient = knex({
  client: 'pg',
  connection: DB_URI,
})

function run(command) {
  ß.info(`Running: \`${command}\`…`)

  const output = shelljs.exec(command)
  if (output.code !== 0) {
    shelljs.exit(1)
  }
}

async function waitForDb() {
  try {
    await knexClient.raw('SELECT 1 + 1 AS result;')
  } catch {
    await waitForDb()
  }
}

;(async () => {
  try {
    run(`docker-compose down --remove-orphans -v`)
    run(`docker-compose up -d db`)
    ß.info(`Waiting for db to be up and ready…`)
    await waitForDb()
    run(`yarn knex migrate:latest`)
    run(`yarn knex seed:run`)
    run(`docker-compose up -d postgrest`)

    shelljs.exit()
  } catch (err) {
    ß.error(`[script/dev/setup] Error: ${err.message}`)

    shelljs.exit(1)
  }
})()
