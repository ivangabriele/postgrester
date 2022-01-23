const { create } = require('..')

const postgrestClient = create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: #delete()', () => {
  beforeEach(async () => {
    await postgrestClient.delete('/customers')
  })

  test(`should return undefined with a single item and no option`, async () => {
    await postgrestClient.post('/customers', {
      email: 'bob.marley@protonmail.com',
      name: 'Bob Marley',
    })
    const result = await postgrestClient.eq('email', 'bob.marley@protonmail.com').delete('/customers')

    expect(result.data).toBeUndefined()
  })

  test(`should return undefined with a single item and { return: "representation" }`, async () => {
    await postgrestClient.post('/customers', {
      email: 'bob.marley@protonmail.com',
      name: 'Bob Marley',
    })
    const result = await postgrestClient.eq('email', 'bob.marley@protonmail.com').delete('/customers', {
      return: 'representation',
    })

    expect(result.data.email).toEqual('bob.marley@protonmail.com')
    expect(result.data.name).toEqual('Bob Marley')
  })
})
