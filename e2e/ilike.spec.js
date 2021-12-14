const assert = require('assert')

const { create } = require('..')

const postgrestClient = create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: ILIKE', () => {
  it(`should find all the books which title contains "an" or "An"`, async () => {
    const { data: result } = await postgrestClient
      .select('title')
      .select('authors(name)')
      .ilike('title', 'an')
      .orderBy('title')
      .get('/books')

    assert.equal(result.length, 3)
    assert.equal(result[0].title, "An Analysis of Betty Friedan's The Feminine Mystique")
    assert.equal(result[0].authors.name, 'Elizabeth Whitaker')
    assert.equal(result[1].title, 'Anna Karenina')
    assert.equal(result[1].authors.name, 'Leo Tolstoy')
    assert.equal(result[2].title, 'War and Peace')
    assert.equal(result[2].authors.name, 'Leo Tolstoy')
  })
})
