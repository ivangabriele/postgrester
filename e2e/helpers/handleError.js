const assert = require('assert')
const axios = require('axios')
const ß = require('bhala')

module.exports = function handleError(error) {
  if (!axios.isAxiosError(error)) {
    throw error
  }

  ß.debug(`Response Status Code: ${error.response.status}`)
  ß.debug(`Response Headers:\n${JSON.stringify(error.response.headers, null, 2)}`)
  ß.debug(`Response Data:\n${JSON.stringify(error.response.data, null, 2)}`)

  assert.fail()
}
