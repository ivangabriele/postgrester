# postgrester

**⚠️ THIS PACKAGE IS DEPRECATED AND NO LONGER MAINTAINED,
YOU CAN USE [@supabase/postgrest-js](https://github.com/supabase/postgrest-js) AS A REPLACEMENT.**

---

[![License][img-license]][lnk-license]
[![NPM Package][img-npm]][lnk-npm]
[![Build Status][img-github]][lnk-github]
[![Code Coverage][img-codecov]][lnk-codecov]

Isomorphic [PostgREST][lnk-postgrest] API Client for Javascript and Typescript.

Supported PostgREST versions:

- `v9.0.0`
- `v8.0.0`

---

- [Gettting Started](#gettting-started)
- [Example](#example)
- [API](#api)
  - [Options](#options)
  - [Vertical Filtering (columns) Methods](#vertical-filtering-columns-methods)
    - [select()](#select)
  - [Hoizontal Filtering (rows) Methods](#hoizontal-filtering-rows-methods)
    - [is()](#is)
    - [eq()](#eq)
    - [neq()](#neq)
    - [gt()](#gt)
    - [gte()](#gte)
    - [lt()](#lt)
    - [lte()](#lte)
    - [in()](#in)
    - [like()](#like)
    - [ilike()](#ilike)
    - [not](#not)
    - [and](#and)
    - [or](#or)
  - [Ordering Methods](#ordering-methods)
    - [orderBy()](#orderby)
  - [Pagination Methods](#pagination-methods)
    - [page()](#page)
  - [Request Methods](#request-methods)
    - [get()](#get)
    - [post() / Insert](#post--insert)
    - [post() / Upsert](#post--upsert)
    - [patch()](#patch)
    - [put()](#put)
    - [delete()](#delete)
- [Contribute](#contribute)
- [License](#license)

## Gettting Started

```bash
npm i postgrester
```

## Example

```js
import { create } from "postgrester";

const postgrestClient = create({
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

When creating the instance via `create([options])`:

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

### Vertical Filtering (columns) Methods

#### select()

| Name       | Type     | Default      | Examples                                  |
| ---------- | -------- | ------------ | ----------------------------------------- |
| `selector` | `string` | **required** | `"*"`, `"author"`, `"category(id,label)"` |

You can also rename them by inserting a colon: `original_column_name:new_column_name`.

### Hoizontal Filtering (rows) Methods

#### is()

| Name     | Type              | Default      | Examples                       |
| -------- | ----------------- | ------------ | ------------------------------ |
| `column` | `string`          | **required** | `"author"`, `"category.label"` |
| `value`  | `boolean \| null` | **required** |                                |

#### eq()

| Name         | Type                                  | Default      | Examples                       |
| ------------ | ------------------------------------- | ------------ | ------------------------------ |
| `column`     | `string`                              | **required** | `"author"`, `"category.label"` |
| `value`      | `boolean \| number \| null \| string` | **required** | `"Leo Tolstoy"`                |
| `withQuotes` | `boolean`                             | `false`      |                                |

> **Note:** `boolean` and `null` values will be converted into an `is()`.

#### neq()

| Name         | Type                                  | Default      | Examples                       |
| ------------ | ------------------------------------- | ------------ | ------------------------------ |
| `column`     | `string`                              | **required** | `"author"`, `"category.label"` |
| `value`      | `boolean \| number \| null \| string` | **required** | `"Leo Tolstoy"`                |
| `withQuotes` | `boolean`                             | `false`      |                                |

> **Note:** `boolean` and `null` values will be converted into a **negated** `is()`.

#### gt()

| Name          | Type               | Default      | Examples                              |
| ------------- | ------------------ | ------------ | ------------------------------------- |
| `column`      | `string`           | **required** | `"quantity"`, `"category.updated_at"` |
| `value`       | `number \| string` | **required** |                                       |
| `isInclusive` | `boolean`          | `false`      |                                       |

#### gte()

| Name     | Type               | Default      | Examples                              |
| -------- | ------------------ | ------------ | ------------------------------------- |
| `column` | `string`           | **required** | `"quantity"`, `"category.updated_at"` |
| `value`  | `number \| string` | **required** |                                       |

> **Note:** This method is an alias for `gt()` with `<isInclusive>` set to `true`.

#### lt()

| Name          | Type               | Default      | Examples                              |
| ------------- | ------------------ | ------------ | ------------------------------------- |
| `column`      | `string`           | **required** | `"quantity"`, `"category.updated_at"` |
| `value`       | `number \| string` | **required** |                                       |
| `isInclusive` | `boolean`          | `false`      |                                       |

#### lte()

| Name     | Type               | Default      | Examples                              |
| -------- | ------------------ | ------------ | ------------------------------------- |
| `column` | `string`           | **required** | `"quantity"`, `"category.updated_at"` |
| `value`  | `number \| string` | **required** |                                       |

> **Note:** This method is an alias for `lt()` with `<isInclusive>` set to `true`.

#### in()

| Name         | Type                      | Default      | Examples                               |
| ------------ | ------------------------- | ------------ | -------------------------------------- |
| `column`     | `string`                  | **required** | `"author"`, `"category.label"`         |
| `value`      | `Array<number \| string>` | **required** | `["Leo Tolstoy", "Fyodor Dostoevsky"]` |
| `withQuotes` | `boolean`                 | `false`      |                                        |

#### like()

| Name     | Type     | Default      | Examples                       |
| -------- | -------- | ------------ | ------------------------------ |
| `column` | `string` | **required** | `"author"`, `"category.label"` |
| `value`  | `string` | **required** | `"Tolstoy"`                    |

#### ilike()

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

### Ordering Methods

#### orderBy()

| Name     | Type      | Default      | Examples                       |
| -------- | --------- | ------------ | ------------------------------ |
| `column` | `string`  | **required** | `"author"`, `"category.label"` |
| `isDesc` | `boolean` | `false`      |                                |

### Pagination Methods

#### page()

| Name        | Type     | Default      | Examples   |
| ----------- | -------- | ------------ | ---------- |
| `pageIndex` | `number` | **required** | `0`, `123` |
| `limit`     | `number` | `10`         |            |

### Request Methods

All request methods are asynchronous promises.

#### get()

| Name              | Type      | Default      | Examples   |
| ----------------- | --------- | ------------ | ---------- |
| `path`            | `string`  | **required** | `"/books"` |
| `withPagesLength` | `boolean` | `false`      |            |

Return value:

```ts
Promise<{
  data: any;
  pagesLength: number;
  totalLength: number;
}>
```

> **:warning: Important**<br>
> Both `pagesLength` and `totalLength` will equal `-1` if `<withPagesLength>` parameter is `false`
> or if the length couldn't be resolved.

#### post() / Insert

| Name      | Type                                              | Default      | Examples   |
| --------- | ------------------------------------------------- | ------------ | ---------- |
| `path`    | `string`                                          | **required** | `"/books"` |
| `data`    | `object`                                          | **required** |            |
| `options` | `{ return?: 'headers-only' \| 'representation' }` |              |            |

Return value:

```ts
Promise<void>
```

or (with `{ return: "representation" }`):

```ts
Promise<{
  data: T
}>
```

#### post() / Upsert

> **:warning: Important**  
> If `data` is an array, it will be considered as an [upsert](https://postgrest.org/en/v9.0/api.html#upsert).  
> In this case, if you don't specify otherwise in `options`, `merge-duplicates` resolution will be used by default.

| Name      | Type                                                                                                                           | Default                              | Examples   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ | ---------- |
| `path`    | `string`                                                                                                                       | **required**                         | `"/books"` |
| `data`    | `object[]`                                                                                                                     | **required**                         |            |
| `options` | `{ onConflict?: string, resolution?: "ignore-duplicates" \| "merge-duplicates", return?: 'headers-only' \| 'representation' }` | `{ resolution: "merge-duplicates" }` |            |

Return value:

```ts
Promise<void>
```

or (with `{ return: "representation" }`):

```ts
Promise<{
  data: T[]
}>
```

#### patch()

| Name   | Type     | Default      | Examples   |
| ------ | -------- | ------------ | ---------- |
| `path` | `string` | **required** | `"/books"` |
| `data` | `object` | **required** |            |

Return value:

```ts
Promise<void>
```

#### put()

| Name   | Type     | Default      | Examples   |
| ------ | -------- | ------------ | ---------- |
| `path` | `string` | **required** | `"/books"` |
| `data` | `object` | **required** |            |

Return value:

```ts
Promise<void>
```

#### delete()

| Name      | Type                                              | Default      | Examples   |
| --------- | ------------------------------------------------- | ------------ | ---------- |
| path      | `string`                                          | **required** | `"/books"` |
| `options` | `{ return?: 'headers-only' \| 'representation' }` |              |            |

Return value:

```ts
Promise<void>
```

or (with `{ return: "representation" }`):

```ts
Promise<{
  data: T[]
}>
```

## Contribute

Please check our [contributing documentation][lnk-contributing].

## License

This package and its sources are distributed under [Apache 2.0][lnk-license].

---

[img-codecov]: https://img.shields.io/codecov/c/github/ivangabriele/postgrester/main?style=flat-square
[img-github]: https://img.shields.io/github/workflow/status/ivangabriele/postgrester/Check/main?style=flat-square
[img-license]: https://img.shields.io/github/license/ivangabriele/postgrester?style=flat-square
[img-npm]: https://img.shields.io/npm/v/postgrester?style=flat-square
[lnk-contributing]: https://github.com/ivangabriele/postgrester/blob/main/CONTRIBUTING.md
[lnk-codecov]: https://codecov.io/gh/ivangabriele/postgrester/branch/main
[lnk-github]: https://github.com/ivangabriele/postgrester/actions?query=branch%3Amain++
[lnk-license]: https://github.com/ivangabriele/postgrester/blob/main/LICENSE
[lnk-npm]: https://www.npmjs.com/package/postgrester
[lnk-postgrest]: http://postgrest.org
