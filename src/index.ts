/* eslint-disable import/prefer-default-export */

import { Postgrester } from './Postgrester'
import { PostgresterConfig, PostgresterInstance } from './types'

/**
 * Create an instance of Postgrester.
 */
function create(config: PostgresterConfig): PostgresterInstance {
  return new Postgrester(config)
}

export { create }
