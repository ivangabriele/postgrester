const assert = require('assert')

const postgrester = require('..')

const postgrestClient = postgrester.create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: ILIKE', () => {
  it(`should find all the books which title contains "an" or "An"`, async () => {
    const { data: result } = await postgrestClient
      .select('title')
      .select('author(name)')
      .ilike('title', 'an')
      .orderBy('title')
      .get('/books')

    assert.equal(result.length, 3)
    assert.equal(result[0].title, "An Analysis of Betty Friedan's The Feminine Mystique")
    assert.equal(result[0].author.name, 'Elizabeth Whitaker')
    assert.equal(result[1].title, 'Anna Karenina')
    assert.equal(result[1].author.name, 'Leo Tolstoy')
    assert.equal(result[2].title, 'War and Peace')
    assert.equal(result[2].author.name, 'Leo Tolstoy')
  })
})
