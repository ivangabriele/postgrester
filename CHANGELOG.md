## [2.1.1](https://github.com/ivangabriele/postgrester/compare/v2.1.0...v2.1.1) (2022-01-23)


### Bug Fixes

* **deps:** update all non-major dependencies ([#215](https://github.com/ivangabriele/postgrester/issues/215)) ([ea97ff4](https://github.com/ivangabriele/postgrester/commit/ea97ff4c2e690cb6194e45a64687077ee45e63c7))
* **dev-deps:** resolve nanoid@>=3.1.31 to fix CVE-2021-23566 ([ca34a6e](https://github.com/ivangabriele/postgrester/commit/ca34a6e43e51b1da15238f623308bf92e49092dc))

# [2.1.0](https://github.com/ivangabriele/postgrester/compare/v2.0.0...v2.1.0) (2021-12-14)


### Features

* add representation return option to delete() ([#207](https://github.com/ivangabriele/postgrester/issues/207)) ([d620b0a](https://github.com/ivangabriele/postgrester/commit/d620b0a19e30fe496c918640b714f0eeef6cbced))

# [2.0.0](https://github.com/ivangabriele/postgrester/compare/v1.0.5...v2.0.0) (2021-12-14)


### Bug Fixes

* **ci:** remove legacy behaviors ([#205](https://github.com/ivangabriele/postgrester/issues/205)) ([6fdfcc1](https://github.com/ivangabriele/postgrester/commit/6fdfcc11e11cbd7ec1fc8a31ee23e0ca4988af5a))
* **deps:** update all non-major dependencies ([#140](https://github.com/ivangabriele/postgrester/issues/140)) ([fcbee09](https://github.com/ivangabriele/postgrester/commit/fcbee0975dc76e83794f4afe4c130ba969e15ac8))
* **deps:** update all non-major dependencies ([#185](https://github.com/ivangabriele/postgrester/issues/185)) ([6017794](https://github.com/ivangabriele/postgrester/commit/6017794fbebcf7fe6c9ac5259219d517c3babf6c))
* **deps:** update all non-major dependencies ([#188](https://github.com/ivangabriele/postgrester/issues/188)) ([eb23d3b](https://github.com/ivangabriele/postgrester/commit/eb23d3b75913b665dba0501d2b1676a68e768a13))
* **deps:** update all non-major dependencies ([#189](https://github.com/ivangabriele/postgrester/issues/189)) ([eae826a](https://github.com/ivangabriele/postgrester/commit/eae826a89c598b76cd1fe32c51dbd17fb6c41c10))
* **deps:** update all non-major dependencies ([#27](https://github.com/ivangabriele/postgrester/issues/27)) ([d3de911](https://github.com/ivangabriele/postgrester/commit/d3de911b694634b113b38f6f766f9093006a73d0))
* **deps:** update all non-major dependencies ([#28](https://github.com/ivangabriele/postgrester/issues/28)) ([0204e1b](https://github.com/ivangabriele/postgrester/commit/0204e1bef6ed88066e63df6a9f9fb87df22b7f43))
* handle provided axiosConfig baseURL ([#75](https://github.com/ivangabriele/postgrester/issues/75)) ([a4943bf](https://github.com/ivangabriele/postgrester/commit/a4943bfb106387f1989c0e476aa51437bf230d13))
* remove quotes around (i)like value matching ([#96](https://github.com/ivangabriele/postgrester/issues/96)) ([e6c8d21](https://github.com/ivangabriele/postgrester/commit/e6c8d218e30be139e616b1ff7a2e43597fae8b0d))


* feat!: add representation return option (#203) ([7a8924c](https://github.com/ivangabriele/postgrester/commit/7a8924cdd94bc5b480e406a3c3acbe23e527f5fa)), closes [#203](https://github.com/ivangabriele/postgrester/issues/203)


### Features

* add neq, gt, gte, lt and lte methods ([#84](https://github.com/ivangabriele/postgrester/issues/84)) ([9981fe2](https://github.com/ivangabriele/postgrester/commit/9981fe28982c7f36b0ea4793f4bdf03372bd3d2e))
* add put request method ([#87](https://github.com/ivangabriele/postgrester/issues/87)) ([186609f](https://github.com/ivangabriele/postgrester/commit/186609f5357a689fab700e417a3f3dbc56d9ee05))
* add total length to get method return ([#100](https://github.com/ivangabriele/postgrester/issues/100)) ([2a788e6](https://github.com/ivangabriele/postgrester/commit/2a788e6d21127a671a1386ef6f658026d0b4fb2e))
* add upsert options to post method ([#161](https://github.com/ivangabriele/postgrester/issues/161)) ([97995f3](https://github.com/ivangabriele/postgrester/commit/97995f37fdf4b57e4447ff2078d94cb7f95cf13f))
* deprecate `baseUri` option ([#73](https://github.com/ivangabriele/postgrester/issues/73)) ([fd33515](https://github.com/ivangabriele/postgrester/commit/fd3351586fedb4ba2c71d522a45d14f48e73e4a1))


### Reverts

* "chore(renovate): remove force enabled bot" ([#99](https://github.com/ivangabriele/postgrester/issues/99)) ([c0ed76e](https://github.com/ivangabriele/postgrester/commit/c0ed76e2e745b6a14b02796c9cc68e9791fa5b71))
* chore(deps): pin node.js to 16.6.1 ([#25](https://github.com/ivangabriele/postgrester/issues/25)) ([62a487c](https://github.com/ivangabriele/postgrester/commit/62a487c4c093427001bd0b00f30e7b2008a5cb26))


### BREAKING CHANGES

* use named export for `create()`
* drop deprecated `baseUri` option support in `create()`

# [2.0.0](https://github.com/ivangabriele/postgrester/compare/v1.0.5...v2.0.0) (2021-12-14)


### Bug Fixes

* **deps:** update all non-major dependencies ([#140](https://github.com/ivangabriele/postgrester/issues/140)) ([fcbee09](https://github.com/ivangabriele/postgrester/commit/fcbee0975dc76e83794f4afe4c130ba969e15ac8))
* **deps:** update all non-major dependencies ([#185](https://github.com/ivangabriele/postgrester/issues/185)) ([6017794](https://github.com/ivangabriele/postgrester/commit/6017794fbebcf7fe6c9ac5259219d517c3babf6c))
* **deps:** update all non-major dependencies ([#188](https://github.com/ivangabriele/postgrester/issues/188)) ([eb23d3b](https://github.com/ivangabriele/postgrester/commit/eb23d3b75913b665dba0501d2b1676a68e768a13))
* **deps:** update all non-major dependencies ([#189](https://github.com/ivangabriele/postgrester/issues/189)) ([eae826a](https://github.com/ivangabriele/postgrester/commit/eae826a89c598b76cd1fe32c51dbd17fb6c41c10))
* **deps:** update all non-major dependencies ([#27](https://github.com/ivangabriele/postgrester/issues/27)) ([d3de911](https://github.com/ivangabriele/postgrester/commit/d3de911b694634b113b38f6f766f9093006a73d0))
* **deps:** update all non-major dependencies ([#28](https://github.com/ivangabriele/postgrester/issues/28)) ([0204e1b](https://github.com/ivangabriele/postgrester/commit/0204e1bef6ed88066e63df6a9f9fb87df22b7f43))
* handle provided axiosConfig baseURL ([#75](https://github.com/ivangabriele/postgrester/issues/75)) ([a4943bf](https://github.com/ivangabriele/postgrester/commit/a4943bfb106387f1989c0e476aa51437bf230d13))
* remove quotes around (i)like value matching ([#96](https://github.com/ivangabriele/postgrester/issues/96)) ([e6c8d21](https://github.com/ivangabriele/postgrester/commit/e6c8d218e30be139e616b1ff7a2e43597fae8b0d))


* feat!: add representation return option (#203) ([7a8924c](https://github.com/ivangabriele/postgrester/commit/7a8924cdd94bc5b480e406a3c3acbe23e527f5fa)), closes [#203](https://github.com/ivangabriele/postgrester/issues/203)


### Features

* add neq, gt, gte, lt and lte methods ([#84](https://github.com/ivangabriele/postgrester/issues/84)) ([9981fe2](https://github.com/ivangabriele/postgrester/commit/9981fe28982c7f36b0ea4793f4bdf03372bd3d2e))
* add put request method ([#87](https://github.com/ivangabriele/postgrester/issues/87)) ([186609f](https://github.com/ivangabriele/postgrester/commit/186609f5357a689fab700e417a3f3dbc56d9ee05))
* add total length to get method return ([#100](https://github.com/ivangabriele/postgrester/issues/100)) ([2a788e6](https://github.com/ivangabriele/postgrester/commit/2a788e6d21127a671a1386ef6f658026d0b4fb2e))
* add upsert options to post method ([#161](https://github.com/ivangabriele/postgrester/issues/161)) ([97995f3](https://github.com/ivangabriele/postgrester/commit/97995f37fdf4b57e4447ff2078d94cb7f95cf13f))
* deprecate `baseUri` option ([#73](https://github.com/ivangabriele/postgrester/issues/73)) ([fd33515](https://github.com/ivangabriele/postgrester/commit/fd3351586fedb4ba2c71d522a45d14f48e73e4a1))


### Reverts

* "chore(renovate): remove force enabled bot" ([#99](https://github.com/ivangabriele/postgrester/issues/99)) ([c0ed76e](https://github.com/ivangabriele/postgrester/commit/c0ed76e2e745b6a14b02796c9cc68e9791fa5b71))
* chore(deps): pin node.js to 16.6.1 ([#25](https://github.com/ivangabriele/postgrester/issues/25)) ([62a487c](https://github.com/ivangabriele/postgrester/commit/62a487c4c093427001bd0b00f30e7b2008a5cb26))


### BREAKING CHANGES

* use named export for `create()`
* drop deprecated `baseUri` option support in `create()`

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2021-09-18

### Changed

- Dependencies update.
- ESLint instead of TSLint.
- Full code re-lint with many changed rules.
- All-in-one root typings declaration.
- Files structure.
- `forEach` mapping instead of `for...in` for foreign sorters within `Postgrester.buildUri()`.

## [1.5.3] - 2021-08-01

### Changed

- License attribution.

## [1.5.2] - 2021-08-01

### Fixed

- Missing bundle.

## [1.5.1] - 2021-08-01

### Fixed

- New repository references (no significant change in code).

## [1.5.0] - 2020-11-09

### Changed

- `post()` method upsert options.

## [1.4.0] - 2020-04-27

### Added

- `get()` method total length.

## [1.3.1] - 2020-03-30

### Fixed

- Chainable methods typings.
- `like()` and `ilike()` methods useless double-quotes.

## [1.3.0] - 2020-02-26

### Added

- `put()` method.

## [1.2.0] - 2020-02-20

### Added

- `gt()` method.
- `gte()` method.
- `lt()` method.
- `lte()` method.
- `neq()` method.

## [1.1.1] - 2020-02-12

### Fixed

- Travis npm release node version.

## [1.1.0] - 2020-02-12

### Changed

- Deprecated `baseUri` option.

### Fixed

- `baseURL` property in `axiosConfig` option.

## [1.0.5] - 2020-01-23

### Changed

- First README example.

## [1.0.4] - 2020-01-23

### Changed

- Improved README.

## [1.0.3] - 2020-01-23

### Fixed

- Useless dev dependencies.

## [1.0.2] - 2020-01-23

### Fixed

- Test files in published build.

## [1.0.1] - 2020-01-22

### Fixed

- Security vulnerabilities in dev dependencies.

## [1.0.0] - 2020-01-22

### Added

- First release.
