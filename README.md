# postgrester

[![License][img-license]][link-license]
[![NPM Version][img-npm]][link-npm]
[![Build Status][img-travis]][link-travis]
[![Code Coverage][img-coveralls]][link-coveralls]

[PostgREST][link-postgrest] API Client.

## Install

```bash
npm i postgrester
```

## Example

```js
import postgrester from "postgrester";

const postgrestClient = postgrester.create({
  baseUri: "https://api.example.com"
});

(async () => {
  const [data, pagesLength] = postgrester
    .select("*")
    .select("author(first_name,last_name)")
    .is("is_published", true)
    .not.is("isbn", null)
    .eq("publication_year", 1970)
    .in("language_code", ["en-UK", "en-US"])
    .ilike("title", "island")
    .like("author.last_name", "Hemingway")
    .orderBy("publication_year", true) // `true` = DESC
    .orderBy("title")
    .page(3, 25) // 4th page with 25 items per page
    .get("/books", true); // `true` = require the total `pagesLength` value to be calculated
})();
```

## Contribute

### Get Started

```bash
yarn
```

### Test

- All Tests: `yarn test`
- Lint Tests: `yarn test:lint`
- Unit Tests: `yarn test:unit`
- Unit Tests (watch): `yarn test:watch`

### Publish

```bash
npm version [major|minor|patch|preversion]
```

This will automatically build, tag and publish into Github.

### VSCode Settings

```json
{
  "editor.formatOnSave": true,
  "editor.rulers": [100],
  "travis.pro": true
}
```

## License

This package and its sources are distributed under [Apache 2.0][link-license].

---

[img-coveralls]: https://img.shields.io/coveralls/github/SocialGouv/postgrester/master?style=flat-square
[img-license]: https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square
[img-npm]: https://img.shields.io/npm/v/postgrester?style=flat-square
[img-travis]: https://img.shields.io/travis/com/SocialGouv/postgrester/master?style=flat-square
[link-coveralls]: https://coveralls.io/github/SocialGouv/postgrester
[link-license]: https://github.com/SocialGouv/postgrester/blob/master/LICENSE
[link-npm]: https://www.npmjs.com/package/postgrester
[link-postgrest]: http://postgrest.org
[link-travis]: https://travis-ci.com/SocialGouv/postgrester
