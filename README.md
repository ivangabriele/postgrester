# Postgrest Client

[![License][img-license]][link-license]
[![Latest Version][img-version]][link-version]
[![Build Status][img-travis]][link-travis]
[![Code Coverage][img-coveralls]][link-coveralls]

PostgREST-based API Client in JS.

## Install

**TODO: Publish on npm.**

```bash
npm i https://github.com/SocialGouv/postgrest
```

## Example

```js
import Postgrest from "@socialgouv/postgrest";

const postgrest = new Postgrest({
  baseUri: "https://api.example.com"
});

(async () => {
  const [data, pagesLength] = postgrest
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

```bash
yarn test:watch
```

---

[img-coveralls]: https://img.shields.io/coveralls/github/SocialGouv/postgrest/master?style=flat-square
[img-license]: https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square
[img-travis]: https://img.shields.io/travis/com/SocialGouv/postgrest/master?style=flat-square
[img-version]: https://img.shields.io/github/package-json/v/SocialGouv/postgrest?style=flat-square
[link-coveralls]: https://coveralls.io/github/SocialGouv/postgrest
[link-license]: https://github.com/SocialGouv/postgrest/blob/master/LICENSE
[link-mattermost]: https://mattermost.com
[link-travis]: https://travis-ci.com/SocialGouv/postgrest
[link-version]: https://github.com/SocialGouv/postgrest/releases
