import cleaner from "rollup-plugin-cleaner";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",

  output: [
    {
      file: "./dist/index.js",
      format: "cjs"
    }
  ],

  plugins: [
    // Clean /dist directory:
    cleaner({ targets: ["./dist"] }),
    // Import JSON files:
    json(),
    // Locate dependencies via node.js resolution algorithm:
    nodeResolve({
      preferBuiltins: true
    }),
    // Transpile Typescript to ES6:
    typescript({
      clean: true,
      rollupCommonJSResolveHack: true
    }),
    // Convert CommonJS dependencies to ES2015:
    commonjs()
  ]
};
