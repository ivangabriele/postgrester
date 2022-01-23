// eslint-disable-next-line import/no-unresolved
const { create } = require('..')

const postgrestClient = create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: #ilike()', () => {
  test(`should find all the books which title contains "an" or "An"`, async () => {
    const { data: result } = await postgrestClient
      .select('title')
      .select('authors(name)')
      .ilike('title', 'an')
      .orderBy('title')
      .get('/books')

    expect(result.length).toEqual(3)
    expect(result[0].title).toEqual("An Analysis of Betty Friedan's The Feminine Mystique")
    expect(result[0].authors.name).toEqual('Elizabeth Whitaker')
    expect(result[1].title).toEqual('Anna Karenina')
    expect(result[1].authors.name).toEqual('Leo Tolstoy')
    expect(result[2].title).toEqual('War and Peace')
    expect(result[2].authors.name).toEqual('Leo Tolstoy')
  })
})
