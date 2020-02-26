/// <reference types="axios" />

import { AxiosInstance, AxiosRequestConfig } from "axios";

export type PostgresterConfig = {
  axiosConfig?: AxiosRequestConfig;
  axiosInstance?: AxiosInstance;
  /** @deprecated https://github.com/SocialGouv/postgrester/wiki/Deprecations#baseuri-option */
  baseUri?: string;
};
export type PostgresterOptions = Partial<PostgresterConfig>;

export interface PostgresterConstructor {
  new (options: PostgresterOptions): PostgresterInstance;
}

export interface PostgresterInstance {
  and: this;
  or: this;
  not: this;

  delete(path: string): Promise<void>;
  get<T = any>(path: string, withPagesLength?: boolean): Promise<{ data: T; pagesLength: number }>;
  patch(path: string, data: object): Promise<void>;
  post(path: string, data: object | object[]): Promise<void>;
  put(path: string, data: object): Promise<void>;

  eq(column: string, value: boolean | number | string | null, withQuotes?: boolean): this;
  gt(column: string, value: number | string, isInclusive?: boolean): this;
  gte(column: string, value: number | string): this;
  ilike(column: string, value: string): this;
  in(column: string, values: (number | string)[], withQuotes?: boolean): this;
  is(column: string, value: boolean | null): this;
  like(column: string, value: string): this;
  lt(column: string, value: number | string, isInclusive?: boolean): this;
  lte(column: string, value: number | string): this;
  neq(column: string, value: boolean | number | string | null, withQuotes?: boolean): this;
  orderBy(column: string, isDesc?: boolean): this;
  page(pageIndex: number, limit?: number): this;
  select(selector: string): this;
}

export interface PostgresterStatic extends PostgresterInstance {
  create(options?: PostgresterOptions): PostgresterInstance;
}
