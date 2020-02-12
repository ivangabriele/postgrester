# postgrester

[![License][img-license]][link-license]
[![NPM Version][img-npm]][link-npm]
[![Build Status][img-travis]][link-travis]
[![Code Coverage][img-coveralls]][link-coveralls]

JS/TS [PostgREST][link-postgrest] API Client.

## Install

```bash
npm i postgrester
```

## Example

```js
import postgrester from "postgrester";

const postgrestClient = postgrester.create({
  axiosConfig: { baseURL: "https://api.example.com" }
});

(async () => {
  const { data, pagesLength } = await postgrestClient
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

When creating the instance via `postgrester.create([options])`:

| Property        | Type                 | Default | Description                                |
| --------------- | -------------------- | ------- | ------------------------------------------ |
| `axiosConfig`   | `AxiosRequestConfig` | `{}`    | Axios config called with `axios.create()`. |
| `axiosInstance` | `AxiosInstance`      | `null`  | Axios custom instance.                     |
| _`baseUri`_     | _`string`_           | _`""`_  | _API URL. <kbd>Deprecated</kbd>_           |

> :warning: If you provide an axios instance via the `axiosInstance` property, it's useless to
> set `axiosConfig` since it would be overridden by your instance.

> :warning: `baseUri` takes precedence over `axiosConfig.baseURL`. To avoid any confusion,
> `baseUri` will be **deprecated** in the next minor version release and should be removed in the
> next major one.

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

| Name         | Type               | Default      | Examples                       |
| ------------ | ------------------ | ------------ | ------------------------------ |
| `column`     | `string`           | **required** | `"author"`, `"category.label"` |
| `value`      | `number \| string` | **required** | `"Leo Tolstoy"`                |
| `withQuotes` | `boolean`          | `false`      |                                |

#### in()

**Parameters**

| Name         | Type                      | Default      | Examples                               |
| ------------ | ------------------------- | ------------ | -------------------------------------- |
| `column`     | `string`                  | **required** | `"author"`, `"category.label"`         |
| `value`      | `Array<number \| string>` | **required** | `["Leo Tolstoy", "Fyodor Dostoevsky"]` |
| `withQuotes` | `boolean`                 | `false`      |                                        |

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

This getter **ONLY** negates the **FIRST** following filtering method.

For example, `postgrestClient.not.is("category_id", null).ilike("author", "dostoevsky")` will
**negate** the `is()` filter but not the `ilike()` one.

#### and

This getter condition **ALL** the following filtering methods to be conjuncted as "ands".

For example, `postgrestClient.and.is("category_id", null).ilike("author", "dostoevsky")` will 
**intersect** both `is()` and `ilike()` filters.

#### or

This getter condition **ALL** the following filtering methods to be conjuncted as "ors".

For example, `postgrestClient.and.is("category_id", null).ilike("author", "dostoevsky")` will 
**unite** both `is()` and `ilike()` filters.

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
  pagesLength: number;
}>
```

> **:warning: Important**<br> > `pagesLength` will equal `-1` if `<withPagesLength>` parameter is
> `false` or if the pages length couldn't be calculated.

`pagesLength`

#### post()

**Parameters**

| Name | Type     | Default      | Examples   |
| ---- | -------- | ------------ | ---------- |
| path | `string` | **required** | `"/books"` |

**Return value**

```ts
Promise<void>
```

#### patch()

**Parameters**

| Name | Type     | Default      | Examples   |
| ---- | -------- | ------------ | ---------- |
| path | `string` | **required** | `"/books"` |

**Return value**

```ts
Promise<void>
```

#### delete()

**Parameters**

| Name | Type     | Default      | Examples   |
| ---- | -------- | ------------ | ---------- |
| path | `string` | **required** | `"/books"` |

**Return value**

```ts
Promise<void>
```

## Contribute

Please check our [contributing documentation][link-contributing].

## License

This package and its sources are distributed under [Apache 2.0][link-license].

---

[img-coveralls]: https://img.shields.io/coveralls/github/SocialGouv/postgrester/master?style=flat-square
[img-license]: https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square
[img-npm]: https://img.shields.io/npm/v/postgrester?style=flat-square
[img-travis]: https://img.shields.io/travis/com/SocialGouv/postgrester/master?style=flat-square

[link-contributing]: https://github.com/SocialGouv/postgrester/blob/master/CONTRIBUTING.md
[link-coveralls]: https://coveralls.io/github/SocialGouv/postgrester
[link-license]: https://github.com/SocialGouv/postgrester/blob/master/LICENSE
[link-npm]: https://www.npmjs.com/package/postgrester
[link-postgrest]: http://postgrest.org
[link-travis]: https://travis-ci.com/SocialGouv/postgrester
