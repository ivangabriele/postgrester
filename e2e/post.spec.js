const assert = require('assert')

const { create } = require('..')
const handleError = require('./helpers/handleError')

const postgrestClient = create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: #post()', () => {
  beforeEach(async () => {
    await postgrestClient.gt('id', 1).delete('/customers')
  })

  it(`should return undefined with a single item and no option`, async () => {
    try {
      const result = await postgrestClient.post('/customers', {
        email: 'bob.marley@protonmail.com',
        name: 'Bob Marley',
      })

      assert.equal(result.data, undefined)
    } catch (err) {
      handleError(err)
    }
  })

  it(`should return the created row with a single item and { return: "representation" }`, async () => {
    try {
      const result = await postgrestClient.post(
        '/customers',
        {
          email: 'bob.marley@protonmail.com',
          name: 'Bob Marley',
        },
        {
          return: 'representation',
        },
      )

      assert.equal(result.data.email, 'bob.marley@protonmail.com')
      assert.equal(result.data.name, 'Bob Marley')
    } catch (err) {
      handleError(err)
    }
  })

  it(`should return the created rows with multiple items and { return: "representation" }`, async () => {
    try {
      const result = await postgrestClient.post(
        '/customers',
        [
          {
            email: 'bob.marley@protonmail.com',
            name: 'Bob Marley',
          },
          {
            email: 'bob.sinclar@protonmail.com',
            name: 'Bob Sinclar',
          },
        ],
        {
          return: 'representation',
        },
      )

      assert.equal(result.data.length, 2)
      assert.equal(result.data[0].email, 'bob.marley@protonmail.com')
      assert.equal(result.data[0].name, 'Bob Marley')
      assert.equal(result.data[1].email, 'bob.sinclar@protonmail.com')
      assert.equal(result.data[1].name, 'Bob Sinclar')
    } catch (err) {
      handleError(err)
    }
  })
})
