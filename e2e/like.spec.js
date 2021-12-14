const assert = require('assert')

const { create } = require('..')

const postgrestClient = create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: #like()', () => {
  it(`should find all the books which title contains "u"`, async () => {
    const { data: result } = await postgrestClient
      .select('title')
      .select('authors(name)')
      .like('title', 'u')
      .orderBy('title')
      .get('/books')

    assert.equal(result.length, 2)
    assert.equal(result[0].title, "An Analysis of Betty Friedan's The Feminine Mystique")
    assert.equal(result[0].authors.name, 'Elizabeth Whitaker')
    assert.equal(result[1].title, 'Crow Blue')
    assert.equal(result[1].authors.name, 'Adriana Lisboa')
  })

  it(`should find all the books which title contains "U"`, async () => {
    const { data: result } = await postgrestClient
      .select('title')
      .select('authors(name)')
      .like('title', 'U')
      .orderBy('title')
      .get('/books')

    assert.equal(result.length, 1)
    assert.equal(result[0].title, 'The Unbearable Lightness of Being')
    assert.equal(result[0].authors.name, 'Milan Kundera')
  })
})
