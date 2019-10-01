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
  const [data, pagesLength] = postgrestClient
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

## API

### Options

When creating the instance via `postgrester.create()`:

| Property        | Type                 | Default | Description                                |
| --------------- | -------------------- | ------- | ------------------------------------------ |
| `axiosConfig`   | `AxiosRequestConfig` | `{}`    | Axios config called with `axios.create()`. |
| `axiosInstance` | `AxiosInstance`      | `null`  | Axios custom instance.                     |
| `baseUri`       | `string`             | `""`    | API URL.                                   |

> **:warning: Important**<br>
> If you specify the `axiosInstance` property, it's useless to set the `axiosConfig` one since it
> will be overridden by your instance. And if you use the `axiosConfig` property with the `baseUri`
> one, the provided `baseUri` will ooverride the axios `baseURL` if you set it whithin your
> `axiosConfig`.

### Query Methods

#### select()

**Parameters**

| Name       | Type     | Default      | Examples                                  |
| ---------- | -------- | ------------ | ----------------------------------------- |
| `selector` | `string` | **required** | `"*"`, `"author"`, `"category(id,label)"` |

### Filter Methods

#### is()

**Parameters**

| Name     | Type             | Default      | Examples                       |
| -------- | ---------------- | ------------ | ------------------------------ |
| `column` | `string`         | **required** | `"author"`, `"category.label"` |
| `value`  | `boolean | null` | **required** |                                |

#### eq()

**Parameters**

| Name         | Type              | Default      | Examples                       |
| ------------ | ----------------- | ------------ | ------------------------------ |
| `column`     | `string`          | **required** | `"author"`, `"category.label"` |
| `value`      | `number | string` | **required** | `"Leo Tolstoy"`                |
| `withQuotes` | `boolean`         | `false`      |                                |

#### in()

**Parameters**

| Name         | Type                     | Default      | Examples                               |
| ------------ | ------------------------ | ------------ | -------------------------------------- |
| `column`     | `string`                 | **required** | `"author"`, `"category.label"`         |
| `value`      | `Array<number | string>` | **required** | `["Leo Tolstoy", "Fyodor Dostoevsky"]` |
| `withQuotes` | `boolean`                | `false`      |                                        |

#### like()

**Parameters**

| Name     | Type     | Default      | Examples                       |
| -------- | -------- | ------------ | ------------------------------ |
| `column` | `string` | **required** | `"author"`, `"category.label"` |
| `value`  | `string` | **required** | `"Tolstoy"`                    |

#### ilike()

**Parameters**

| Name     | Type     | Default      | Examples                       |
| -------- | -------- | ------------ | ------------------------------ |
| `column` | `string` | **required** | `"author"`, `"category.label"` |
| `value`  | `string` | **required** | `"tolstoy"`                    |

#### not

This getter negates the next filter method.

For example, `postgrestClient.not.is("category_id", null).ilike("author", "dostoevsky")` will negate
the `is()` filter but not the `ilike()` one.

#### and

This getter condition \*_all_ the next filter methods to be conjuncted as "ors".

For example, `postgrestClient.not.is("category_id", null).ilike("author", "dostoevsky")` will negate
the `is()` filter but not the `ilike()` one.

#### or

This getter condition \*_all_ the next filter methods to be conjuncted as "ands".

### Sort Methods

#### orderBy()

**Parameters**

| Name     | Type      | Default      | Examples                       |
| -------- | --------- | ------------ | ------------------------------ |
| `column` | `string`  | **required** | `"author"`, `"category.label"` |
| `isDesc` | `boolean` | `false`      |                                |

### Pagination Methods

#### page()

**Parameters**

| Name        | Type     | Default      | Examples   |
| ----------- | -------- | ------------ | ---------- |
| `pageIndex` | `number` | **required** | `0`, `123` |
| `limit`     | `number` | `10`         |            |

### Call Methods

All calling methods are asynchronous promises.

#### get()

**Parameters**

| Name            | Type      | Default      | Examples   |
| --------------- | --------- | ------------ | ---------- |
| path            | `string`  | **required** | `"/books"` |
| withPagesLength | `boolean` | `false`      |            |

**Return value**

```ts
Promise<{
  data: any;
  pagesLength: number; // -1 if the pages length was not requested or couldn't be calculated.
}>
```

#### post()

**Parameters**

| Name            | Type      | Default      | Examples   |
| --------------- | --------- | ------------ | ---------- |
| path            | `string`  | **required** | `"/books"` |
| withPagesLength | `boolean` | false        |            |

**Return value**

```ts
Promise<void>
```

#### patch()

**Parameters**

| Name            | Type      | Default      | Examples   |
| --------------- | --------- | ------------ | ---------- |
| path            | `string`  | **required** | `"/books"` |
| withPagesLength | `boolean` | false        |            |

**Return value**

```ts
Promise<void>
```

#### delete()

**Parameters**

| Name            | Type      | Default      | Examples   |
| --------------- | --------- | ------------ | ---------- |
| path            | `string`  | **required** | `"/books"` |
| withPagesLength | `boolean` | false        |            |

**Return value**

```ts
Promise<void>
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

This will automatically tag, push, build and publish to Github & NPM.

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
