// eslint-disable-next-line import/no-unresolved
const { create } = require('..')

const postgrestClient = create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: #post()', () => {
  beforeEach(async () => {
    await postgrestClient.delete('/customers')
  })

  test(`should return undefined with a single item and no option`, async () => {
    const result = await postgrestClient.post('/customers', {
      email: 'bob.marley@protonmail.com',
      name: 'Bob Marley',
    })

    expect(result.data).toBeUndefined()
  })

  test(`should return the created row with a single item and { return: "representation" }`, async () => {
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

    expect(result.data.email).toEqual('bob.marley@protonmail.com')
    expect(result.data.name).toEqual('Bob Marley')
  })

  test(`should return the created rows with multiple items and { return: "representation" }`, async () => {
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

    expect(result.data.length).toEqual(2)
    expect(result.data[0].email).toEqual('bob.marley@protonmail.com')
    expect(result.data[0].name).toEqual('Bob Marley')
    expect(result.data[1].email).toEqual('bob.sinclar@protonmail.com')
    expect(result.data[1].name).toEqual('Bob Sinclar')
  })
})
