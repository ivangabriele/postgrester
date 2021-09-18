const ß = require('bhala')
const knex = require('knex')
const shell = require('shelljs')

if (!shell.which('docker')) {
  shell.echo('[script/dev/setup] Error: Sorry, this script requires docker.'.red)

  shell.exit(1)
}
if (!shell.which('docker-compose')) {
  shell.echo('[script/dev/setup] Error: Sorry, this script requires docker-compose.'.red)

  shell.exit(1)
}

const DB_URI = `postgresql://test_db_user:test_db_password@localhost:5432/test_db`

const knexClient = knex({
  client: 'pg',
  connection: DB_URI,
})

function run(command) {
  ß.info(`Running: \`${command}\`…`.blue)

  const output = shell.exec(command)
  if (output.code !== 0) {
    shell.exit(1)
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
    shell.echo(`Waiting for db to be up and ready…`.blue)
    await waitForDb()
    run(`yarn knex migrate:latest`)
    run(`yarn knex seed:run`)
    run(`docker-compose up -d postgrest`)
    shell.exit(0)
  } catch (err) {
    shell.echo(`[script/dev/setup] Error: ${err.message}`.red)

    shell.exit(1)
  }
})()
