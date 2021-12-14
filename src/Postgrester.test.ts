import axios from 'axios'

import { Postgrester } from './Postgrester'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
mockedAxios.create.mockReturnValue(mockedAxios)

const postgresterClient = new Postgrester({
  axiosConfig: {
    baseURL: 'https://api.example.com',
  },
})

describe('Postgrester', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear()
    ;(postgresterClient as any).reset()
  })

  test('should return the expected path', () => {
    const uri = (postgresterClient as any).buildUri('/path', true)

    expect(uri).toStrictEqual('/path?select=*')
  })

  describe('#select()', () => {
    test('should return the expected path', () => {
      const uri = (postgresterClient.select('aColumn').select('aResource(*)') as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=aColumn,aResource(*)')
    })
  })

  describe('#orderBy()', () => {
    test('should return the expected path with root sorters', () => {
      const uri = (postgresterClient.orderBy('aColumn').orderBy('anotherColumn', true) as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&order=aColumn.asc,anotherColumn.desc')
    })

    test('should return the expected path with foreign sorters', () => {
      const uri = (
        postgresterClient.orderBy('aResource.aColumn').orderBy('aResource.anotherColumn', true) as any
      ).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&aResource.order=aColumn.asc,anotherColumn.desc')
    })
  })

  describe('#page()', () => {
    test('should return the expected path with no limit', () => {
      const uri = (postgresterClient.page(0) as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&limit=10&offset=0')
    })

    test('should return the expected path with a limit', () => {
      const uri = (postgresterClient.page(1, 5) as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&limit=5&offset=5')
    })
  })

  describe('#is()', () => {
    test('should return the expected path', () => {
      const uri = (postgresterClient.is('aColumn', true).is('anotherColumn', null) as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&aColumn=is.true&anotherColumn=is.null')
    })
  })

  describe('#eq()', () => {
    test('should return the expected path with {boolean} and {null} values', () => {
      const uri = (postgresterClient.eq('aColumn', true).eq('anotherColumn', null) as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&aColumn=is.true&anotherColumn=is.null')
    })

    test('should return the expected path with {number} and {string} values', () => {
      const uri = (postgresterClient.eq('aColumn', 123).eq('anotherColumn', 'aValue') as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&aColumn=eq.123&anotherColumn=eq.aValue')
    })

    test('should return the expected path with quotes', () => {
      const uri = (postgresterClient.eq('aColumn', 'aValue', true) as any).buildUri('/path', true)

      expect(uri).toStrictEqual(`/path?select=*&aColumn=eq."aValue"`)
    })
  })

  describe('#neq()', () => {
    test('should return the expected path with {boolean} and {null} values', () => {
      const uri = (postgresterClient.neq('C1', true).neq('C2', null) as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&C1=not.is.true&C2=not.is.null')
    })

    test('should return the expected path with {number} and {string} values', () => {
      const uri = (postgresterClient.neq('C1', 1).neq('C2', 'V2') as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&C1=neq.1&C2=neq.V2')
    })

    test('should return the expected path with <withQuotes> = TRUE', () => {
      const uri = (postgresterClient.neq('C1', 'V1', true) as any).buildUri('/path', true)

      expect(uri).toStrictEqual(`/path?select=*&C1=neq."V1"`)
    })
  })

  describe('#gt()', () => {
    test('should return the expected path with {number} and {string} values', () => {
      const uri = (postgresterClient.gt('C1', 1).gt('C2', 'V2') as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&C1=gt.1&C2=gt.V2')
    })

    test('should return the expected path with with {number} and {string} values AND <isInclusive> = TRUE', () => {
      const uri = (postgresterClient.gt('C1', 1, true).gt('C2', 'V2', true) as any).buildUri('/path', true)

      expect(uri).toStrictEqual(`/path?select=*&C1=gte.1&C2=gte.V2`)
    })
  })

  describe('#gte()', () => {
    test('should return the expected path with {number} and {string} values', () => {
      const uri = (postgresterClient.gte('C1', 1).gte('C2', 'V2') as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&C1=gte.1&C2=gte.V2')
    })
  })

  describe('#lt()', () => {
    test('should return the expected path with {number} and {string} values', () => {
      const uri = (postgresterClient.lt('C1', 1).lt('C2', 'V2') as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&C1=lt.1&C2=lt.V2')
    })

    test('should return the expected path with with {number} and {string} values AND <isInclusive> = TRUE', () => {
      const uri = (postgresterClient.lt('C1', 1, true).lt('C2', 'V2', true) as any).buildUri('/path', true)

      expect(uri).toStrictEqual(`/path?select=*&C1=lte.1&C2=lte.V2`)
    })
  })

  describe('#lte()', () => {
    test('should return the expected path with {number} and {string} values', () => {
      const uri = (postgresterClient.lte('C1', 1).lte('C2', 'V2') as any).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&C1=lte.1&C2=lte.V2')
    })
  })

  describe('#in()', () => {
    test('should return the expected path', () => {
      const uri = (
        postgresterClient.in('aColumn', [123, 456]).in('anotherColumn', ['aValue', 'anotherValue']) as any
      ).buildUri('/path', true)

      expect(uri).toStrictEqual('/path?select=*&aColumn=in.(123,456)&anotherColumn=in.(aValue,anotherValue)')
    })
  })

  describe('#like()', () => {
    test('should return the expected path', () => {
      const uri = (postgresterClient.like('aColumn', 'aValue').like('anotherColumn', 'anotherValue') as any).buildUri(
        '/path',
        true,
      )

      expect(uri).toStrictEqual(`/path?select=*&aColumn=like.*aValue*&anotherColumn=like.*anotherValue*`)
    })
  })

  describe('#ilike()', () => {
    test('should return the expected path', () => {
      const uri = (postgresterClient.ilike('aColumn', 'aValue').ilike('anotherColumn', 'anotherValue') as any).buildUri(
        '/path',
        true,
      )

      expect(uri).toStrictEqual(`/path?select=*&aColumn=ilike.*aValue*&anotherColumn=ilike.*anotherValue*`)
    })
  })

  describe('#not()', () => {
    test('should return the expected path with `is()`, `eq()`, `neq()`, `gt()`, `gte()`, `lt()` and `lte()`', () => {
      const uri = (
        postgresterClient.not
          .is('C1', false)
          .not.eq('C2', 2)
          .not.neq('C3', 3)
          .not.gt('C4', 4)
          .not.gte('C5', 5)
          .not.lt('C6', 6)
          .not.lte('C7', 7) as any
      ).buildUri('/path', true)

      expect(uri).toStrictEqual(
        `/path?select=*&C1=not.is.false&C2=not.eq.2&C3=not.neq.3&C4=not.gt.4&C5=not.gte.5&C6=not.lt.6&C7=not.lte.7`,
      )
    })

    test('should return the expected path with `in()`, `like()` and `ilike()`', () => {
      const uri = (
        postgresterClient.not.not.in('C1', ['V11', 'V12']).not.like('C2', 'V2').not.ilike('C3', 'V3') as any
      ).buildUri('/path', true)

      expect(uri).toStrictEqual(`/path?select=*&C1=not.in.(V11,V12)&C2=not.like.*V2*&C3=not.ilike.*V3*`)
    })
  })

  describe('#and()', () => {
    test('should return the expected path with `is()`, `eq()`, `neq()`, `gt()`, `gte()`, `lt()` and `lte()`', () => {
      const uri = (
        postgresterClient.and
          .is('C1', true)
          .eq('C2', 2)
          .neq('C3', 3)
          .gt('C4', 4)
          .gte('C5', 5)
          .lt('C6', 6)
          .lte('C7', 7) as any
      ).buildUri('/path', true)

      expect(uri).toStrictEqual(`/path?select=*&and=(C1.is.true,C2.eq.2,C3.neq.3,C4.gt.4,C5.gte.5,C6.lt.6,C7.lte.7)`)
    })

    test('should return the expected path with `in()`, `like()` and `ilike()`', () => {
      const uri = (postgresterClient.and.in('C1', ['V11', 'V12']).like('C2', 'V2').ilike('C3', 'V3') as any).buildUri(
        '/path',
        true,
      )

      expect(uri).toStrictEqual(`/path?select=*&and=(C1.in.(V11,V12),C2.like.*V2*,C3.ilike.*V3*)`)
    })
  })

  describe('#or()', () => {
    test('should return the expected path with `is()`, `eq()`, `neq()`, `gt()`, `gte()`, `lt()` and `lte()`', () => {
      const uri = (
        postgresterClient.or
          .is('C1', true)
          .eq('C2', 2)
          .neq('C3', 3)
          .gt('C4', 4)
          .gte('C5', 5)
          .lt('C6', 6)
          .lte('C7', 7) as any
      ).buildUri('/path', true)

      expect(uri).toStrictEqual(`/path?select=*&or=(C1.is.true,C2.eq.2,C3.neq.3,C4.gt.4,C5.gte.5,C6.lt.6,C7.lte.7)`)
    })

    test('should return the expected path with `in()`, `like()` and `ilike()`', () => {
      const uri = (postgresterClient.or.in('C1', ['V11', 'V12']).like('C2', 'V2').ilike('C3', 'V3') as any).buildUri(
        '/path',
        true,
      )

      expect(uri).toStrictEqual(`/path?select=*&or=(C1.in.(V11,V12),C2.like.*V2*,C3.ilike.*V3*)`)
    })
  })

  describe('#get()', () => {
    test('should return the expected response', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [],
        headers: {},
      })

      const { data, pagesLength, totalLength } = await postgresterClient.page(0, 10).get('/path')

      expect(mockedAxios.get).toHaveBeenCalledWith('/path?select=*&limit=10&offset=0', {})

      expect(data).toEqual([])
      expect(pagesLength).toEqual(-1)
      expect(totalLength).toEqual(-1)
    })

    test('should return the expected response when requiring pages length', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [],
        headers: {
          'content-range': '0-9/1103',
        },
      })

      const { data, pagesLength, totalLength } = await postgresterClient.page(0, 10).get('/path', true)

      expect(mockedAxios.get).toHaveBeenCalledWith('/path?select=*&limit=10&offset=0', {
        headers: {
          Prefer: 'count=exact',
        },
      })

      expect(data).toEqual([])
      expect(pagesLength).toEqual(111)
      expect(totalLength).toEqual(1103)
    })
  })

  describe('#post()', () => {
    test('should call axios.post() with the expected params', async () => {
      await postgresterClient.post('/path', {})

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/path',
        {},
        {
          headers: undefined,
        },
      )
    })

    test('should call axios.post() with the expected params (upsert)', async () => {
      await postgresterClient.post('/path', [])

      expect(mockedAxios.post).toHaveBeenCalledWith('/path', [], {
        headers: {
          Prefer: 'resolution=merge-duplicates',
        },
      })
    })

    test('should call axios.post() with the expected params (upsert / ON CONFLICT)', async () => {
      await postgresterClient.post('/path', [], {
        onConflict: 'C1',
      })

      expect(mockedAxios.post).toHaveBeenCalledWith('/path?on_conflict=C1', [], {
        headers: {
          Prefer: 'resolution=merge-duplicates',
        },
      })
    })

    test('should call axios.post() with the expected params (upsert / ignore duplicates)', async () => {
      await postgresterClient.post('/path', [], {
        resolution: 'ignore-duplicates',
      })

      expect(mockedAxios.post).toHaveBeenCalledWith('/path', [], {
        headers: {
          Prefer: 'resolution=ignore-duplicates',
        },
      })
    })
  })

  describe('#patch()', () => {
    test('should call axios.patch() with the expected params', async () => {
      await postgresterClient.patch('/path', {})

      expect(mockedAxios.patch).toHaveBeenCalledWith('/path', {})
    })
  })

  describe('#put()', () => {
    test('should call axios.put() with the expected params', async () => {
      await postgresterClient.put('/path', {})

      expect(mockedAxios.put).toHaveBeenCalledWith('/path', {})
    })
  })

  describe('#delete()', () => {
    test('should call axios.delete() with the expected params', async () => {
      await postgresterClient.delete('/path')

      expect(mockedAxios.delete).toHaveBeenCalledWith('/path')
    })
  })
})
