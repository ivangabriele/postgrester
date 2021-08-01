/// <reference types="axios" />

import { AxiosInstance, AxiosRequestConfig } from "axios";

export type PostgresterConfig = {
  axiosConfig?: AxiosRequestConfig;
  axiosInstance?: AxiosInstance;
  /** @deprecated https://github.com/ivangabriele/postgrester/wiki/Deprecations#baseuri-option */
  baseUri?: string;
};
export type PostgresterOptions = Partial<PostgresterConfig>;

export interface PostgresterConstructor {
  new (options: PostgresterOptions): PostgresterInstance;
}

export interface PostgresterInstance {
  and: PostgresterInstance;
  or: PostgresterInstance;
  not: PostgresterInstance;

  delete(path: string): Promise<void>;
  get<T = any>(
    path: string,
    withPagesLength?: boolean,
  ): Promise<{ data: T; pagesLength: number; totalLength: number }>;
  patch(path: string, data: object): Promise<void>;
  post(
    path: string,
    data: object | object[],
    upsertOptions?: PostgesterPostUpsertOptions,
  ): Promise<void>;
  put(path: string, data: object): Promise<void>;

  eq(
    column: string,
    value: boolean | number | string | null,
    withQuotes?: boolean,
  ): PostgresterInstance;
  gt(column: string, value: number | string, isInclusive?: boolean): PostgresterInstance;
  gte(column: string, value: number | string): PostgresterInstance;
  ilike(column: string, value: string): PostgresterInstance;
  in(column: string, values: (number | string)[], withQuotes?: boolean): PostgresterInstance;
  is(column: string, value: boolean | null): PostgresterInstance;
  like(column: string, value: string): PostgresterInstance;
  lt(column: string, value: number | string, isInclusive?: boolean): PostgresterInstance;
  lte(column: string, value: number | string): PostgresterInstance;
  neq(
    column: string,
    value: boolean | number | string | null,
    withQuotes?: boolean,
  ): PostgresterInstance;
  orderBy(column: string, isDesc?: boolean): PostgresterInstance;
  page(pageIndex: number, limit?: number): PostgresterInstance;
  select(selector: string): PostgresterInstance;
}

export interface PostgresterStatic extends PostgresterInstance {
  create(options?: PostgresterOptions): PostgresterInstance;
}

export type PostgesterPostUpsertOptions = {
  onConflict?: string;
  resolution?: "ignore-duplicates" | "merge-duplicates";
};
