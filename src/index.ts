import { DEFAULT_CONFIG } from "./constants";
// tslint:disable-next-line: import-name
import PostgresterClass from "./Postgrester";
import {
  PostgresterConfig,
  PostgresterInstance,
  PostgresterOptions,
  PostgresterStatic
} from "./types";

/**
 * Create an instance of Postgrester.
 */
function createInstance(config: PostgresterConfig): PostgresterInstance {
  return new PostgresterClass(config);
}

// Create the default instance to be exported:
const postgrester: PostgresterStatic = createInstance(DEFAULT_CONFIG) as any;

// Expose Postgrester class to allow class inheritance:
(postgrester as any).Postgrester = PostgresterClass;

// Factory for creating new instances:
postgrester.create = function create(options: PostgresterOptions) {
  return createInstance({ ...DEFAULT_CONFIG, ...options });
};

export default postgrester;

// Allow use of default import syntax in TypeScript:
module.exports.default = postgrester;
