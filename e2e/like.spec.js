// eslint-disable-next-line import/no-unresolved
const { create } = require('..')

const postgrestClient = create({
  axiosConfig: { baseURL: 'http://localhost:3000' },
})

describe('E2E: #like()', () => {
  test(`should find all the books which title contains "u"`, async () => {
    const { data: result } = await postgrestClient
      .select('title')
      .select('authors(name)')
      .like('title', 'u')
      .orderBy('title')
      .get('/books')

    expect(result.length).toEqual(2)
    expect(result[0].title).toEqual("An Analysis of Betty Friedan's The Feminine Mystique")
    expect(result[0].authors.name).toEqual('Elizabeth Whitaker')
    expect(result[1].title).toEqual('Crow Blue')
    expect(result[1].authors.name).toEqual('Adriana Lisboa')
  })

  test(`should find all the books which title contains "U"`, async () => {
    const { data: result } = await postgrestClient
      .select('title')
      .select('authors(name)')
      .like('title', 'U')
      .orderBy('title')
      .get('/books')

    expect(result.length).toEqual(1)
    expect(result[0].title).toEqual('The Unbearable Lightness of Being')
    expect(result[0].authors.name).toEqual('Milan Kundera')
  })
})
