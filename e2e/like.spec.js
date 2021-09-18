const assert = require('assert')

const postgrester = require('..')

const postgrestClient = postgrester.create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: LIKE', () => {
  it(`should find all the books which title contains "u"`, async () => {
    const { data: result } = await postgrestClient
      .select('title')
      .select('author(name)')
      .like('title', 'u')
      .orderBy('title')
      .get('/books')

    assert.equal(result.length, 2)
    assert.equal(result[0].title, "An Analysis of Betty Friedan's The Feminine Mystique")
    assert.equal(result[0].author.name, 'Elizabeth Whitaker')
    assert.equal(result[1].title, 'Crow Blue')
    assert.equal(result[1].author.name, 'Adriana Lisboa')
  })

  it(`should find all the books which title contains "U"`, async () => {
    const { data: result } = await postgrestClient
      .select('title')
      .select('author(name)')
      .like('title', 'U')
      .orderBy('title')
      .get('/books')

    assert.equal(result.length, 1)
    assert.equal(result[0].title, 'The Unbearable Lightness of Being')
    assert.equal(result[0].author.name, 'Milan Kundera')
  })
})
