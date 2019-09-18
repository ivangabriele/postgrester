#!/bin/bash

# Exit when any command fails:
set -e

yarn --frozen-lockfile
yarn test --coverage

# Push tests coverage data to Coveralls:
./node_modules/.bin/coveralls < ./coverage/lcov.info
