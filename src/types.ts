/* eslint-disable typescript-sort-keys/interface */

/// <reference types="axios" />

import { AxiosInstance, AxiosRequestConfig } from 'axios'

export type Data = {
  [key: string]: any
}

export type StringPojo = {
  [key: string]: string
}

export type PostgresterConfig = {
  axiosConfig?: AxiosRequestConfig
  axiosInstance?: AxiosInstance
  /** @deprecated https://github.com/ivangabriele/postgrester/wiki/Deprecations#baseuri-option */
  baseUri?: string
}
export type PostgresterOptions = Partial<PostgresterConfig>

export interface PostgresterConstructor {
  new (options: PostgresterOptions): PostgresterInstance
}

export interface PostgresterInstance {
  and: PostgresterInstance
  delete(path: string): Promise<void>
  eq(column: string, value: boolean | number | string | null, withQuotes?: boolean): PostgresterInstance
  get<T = Data>(
    path: string,
    withPagesLength?: boolean,
  ): Promise<{ data: T[]; pagesLength: number; totalLength: number }>
  gt(column: string, value: number | string, isInclusive?: boolean): PostgresterInstance
  gte(column: string, value: number | string): PostgresterInstance
  ilike(column: string, value: string): PostgresterInstance
  in(column: string, values: (number | string)[], withQuotes?: boolean): PostgresterInstance
  is(column: string, value: boolean | null): PostgresterInstance
  like(column: string, value: string): PostgresterInstance
  lt(column: string, value: number | string, isInclusive?: boolean): PostgresterInstance
  lte(column: string, value: number | string): PostgresterInstance
  neq(column: string, value: boolean | number | string | null, withQuotes?: boolean): PostgresterInstance
  not: PostgresterInstance
  or: PostgresterInstance
  orderBy(column: string, isDesc?: boolean): PostgresterInstance
  page(pageIndex: number, limit?: number): PostgresterInstance
  patch(path: string, data: Data): Promise<void>
  put(path: string, data: Data): Promise<void>
  select(selector: string): PostgresterInstance

  post<T extends Data = any>(
    path: string,
    data: Partial<T>,
  ): Promise<{
    data: undefined
  }>
  post<T extends Data = any>(
    path: string,
    data: Partial<T>,
    options: {
      return: 'headers-only'
    },
  ): Promise<{
    data: undefined
  }>
  post<T extends Data = any>(
    path: string,
    data: Partial<T>,
    options: {
      return: 'representation'
    },
  ): Promise<{
    data: T
  }>
  post<T extends Data = any>(
    path: string,
    data: Partial<T>[],
    options: {
      return: 'representation'
    } & PostgesterPostUpsertOptions,
  ): Promise<{
    data: T[]
  }>
  post<T extends Data = any>(
    path: string,
    data: Partial<T>[],
    options?: PostgesterCommonOptions & PostgesterPostUpsertOptions,
  ): Promise<{
    data: undefined
  }>
}

export interface PostgresterStatic extends PostgresterInstance {
  create(options?: PostgresterOptions): PostgresterInstance
}

export type PostgesterCommonOptions = {
  return?: 'headers-only' | 'representation'
}

export type PostgesterPostUpsertOptions = {
  onConflict?: string
  resolution?: 'ignore-duplicates' | 'merge-duplicates'
}
