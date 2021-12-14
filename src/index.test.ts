import axios from 'axios'

import { create } from '.'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('postgrester', () => {
  describe('#create()', () => {
    test('should return the expected Postgrester instance', () => {
      const options = {
        baseUri: 'https://contributions-api.codedutravail.num.social.gouv.fr',
      }

      const postgrestClient = create(options)

      expect(mockedAxios.create).toHaveBeenCalledTimes(1)
      // TODO Solve this test expectation.
      /* expect(mockedAxios.create).toHaveBeenCalledWith(
        // Default config first:
        {
          baseURL: ""
        },
        // Then custom options:
        {
          baseURL: "https://contributions-api.codedutravail.num.social.gouv.fr"
        }
      ); */

      expect(postgrestClient.constructor.name).toStrictEqual('Postgrester')
      expect((postgrestClient as any).create).toBeUndefined()
    })
  })
})
