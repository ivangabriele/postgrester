const assert = require('assert')

const { create } = require('..')
const handleError = require('./helpers/handleError')

const postgrestClient = create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: #delete()', () => {
  it(`should return undefined with a single item and no option`, async () => {
    try {
      await postgrestClient.post('/customers', {
        email: 'bob.marley@protonmail.com',
        name: 'Bob Marley',
      })
      const result = await postgrestClient.eq('email', 'bob.marley@protonmail.com').delete('/customers')

      assert.equal(result.data, undefined)
    } catch (err) {
      handleError(err)
    }
  })

  it(`should return undefined with a single item and no option`, async () => {
    try {
      await postgrestClient.post('/customers', {
        email: 'bob.marley@protonmail.com',
        name: 'Bob Marley',
      })
      const result = await postgrestClient.eq('email', 'bob.marley@protonmail.com').delete('/customers', {
        return: 'representation',
      })

      assert.equal(result.data.email, 'bob.marley@protonmail.com')
      assert.equal(result.data.name, 'Bob Marley')
    } catch (err) {
      handleError(err)
    }
  })
})
