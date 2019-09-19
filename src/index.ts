import axios, { AxiosInstance } from "axios";

import { PostgrestContructor, PostgrestInterface, PostgrestOptions } from "./types";

const Postgrest: PostgrestContructor = class Postgrest implements PostgrestInterface {
  private ands: string[];
  private readonly axios: AxiosInstance;
  private foreignSorters: { [k: string]: string[] };
  private isAnd: boolean;
  private isNot: boolean;
  private isOr: boolean;
  private limit: number;
  private offset: number;
  private ors: string[];
  private queries: string[];
  private selectors: string[];
  private sorters: string[];

  public get and() {
    this.isAnd = true;

    return this;
  }

  public get or() {
    this.isOr = true;

    return this;
  }

  public get not() {
    this.isNot = true;

    return this;
  }

  constructor({ baseUri }: PostgrestOptions) {
    this.axios = axios.create({
      baseURL: baseUri
    });

    this.reset();
  }

  private reset() {
    this.ands = [];
    this.foreignSorters = {};
    this.isAnd = false;
    this.isOr = false;
    this.isNot = false;
    this.limit = -1;
    this.offset = -1;
    this.ors = [];
    this.queries = [];
    this.selectors = [];
    this.sorters = [];
  }

  private buildUri(path: string, isGet = false) {
    const params = [];

    // Selectors
    if (isGet) {
      params.push(`select=${this.selectors.length !== 0 ? this.selectors.join(",") : "*"}`);
    }

    // Filters
    this.queries.forEach(query => params.push(query));

    // "and" Filters
    if (this.ands.length !== 0) {
      const isNot = this.isNot ? "not." : "";

      params.push(`${isNot}and=(${this.ands.join(",")})`);
    }

    // "or" Filters
    if (this.ors.length !== 0) {
      const isNot = this.isNot ? "not." : "";

      params.push(`${isNot}or=(${this.ors.join(",")})`);
    }

    if (!isGet) return `${path}?${params.join("&")}`;

    // Sorters
    if (this.sorters.length !== 0) {
      params.push(`order=${this.sorters.join(",")}`);
    }

    // Foreign Sorters
    if (Object.entries(this.foreignSorters).length !== 0) {
      for (const resource in this.foreignSorters) {
        params.push(`${resource}.order=${this.foreignSorters[resource].join(",")}`);
      }
    }

    // Pagination
    if (this.limit !== -1) {
      params.push(`limit=${this.limit}`);
      params.push(`offset=${this.offset}`);
    }

    return `${path}?${params.join("&")}`;
  }

  async get<T = any>(path: string, withLength = false) {
    const uri = this.buildUri(path, true);
    this.reset();

    const config = withLength
      ? {
          headers: {
            Prefer: "count=exact"
          }
        }
      : {};

    const { data, headers } = await this.axios.get<T>(uri, config);

    let pagesLength = -1;
    if (withLength && headers["content-range"] !== undefined) {
      const length = Number(headers["content-range"].split("/")[1]);
      pagesLength = Math.ceil(length / this.limit);
    }

    return { data, pagesLength };
  }

  public async post(path: string, data: Object) {
    this.reset();

    await this.axios.post(path, data);
  }

  public async patch(path: string, data: Object) {
    const uri = this.buildUri(path);
    this.reset();

    await this.axios.patch(uri, data);
  }

  public async delete(path: string) {
    const uri = this.buildUri(path);
    this.reset();

    await this.axios.delete(uri);
  }

  public select(selector: string) {
    this.selectors.push(selector);

    return this;
  }

  public orderBy(column: string, isDesc = false) {
    if (column.includes(".")) {
      const [foreignResource, foreignColumn] = column.split(".");
      if (this.foreignSorters[foreignResource] === undefined) {
        this.foreignSorters[foreignResource] = [];
      }
      this.foreignSorters[foreignResource].push(`${foreignColumn}.${isDesc ? "desc" : "asc"}`);
    } else {
      this.sorters.push(`${column}.${isDesc ? "desc" : "asc"}`);
    }

    return this;
  }

  public page(pageIndex: number, limit = 10) {
    this.limit = limit;
    this.offset = pageIndex * limit;

    return this;
  }

  public eq(column: string, value: boolean | number | string | null, withQuotes = false) {
    if (typeof value === "boolean" || value === null) {
      return this.is(column, value);
    }

    const isNot = this.isNot ? "not." : "";
    const cleanValue = withQuotes ? `"${value}"` : value;

    if (this.isAnd) {
      this.ands.push(`${column}.eq.${cleanValue}`);
    } else if (this.isOr) {
      this.ors.push(`${column}.eq.${cleanValue}`);
    } else {
      this.queries.push(`${column}=${isNot}eq.${cleanValue}`);
      this.isNot = false;
    }

    return this;
  }

  public like(column: string, value: string) {
    const isNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.like."*${value}*"`);
    } else if (this.isOr) {
      this.ors.push(`${column}.like."*${value}*"`);
    } else {
      this.queries.push(`${column}=${isNot}like."*${value}*"`);
      this.isNot = false;
    }

    return this;
  }

  public ilike(column: string, value: string) {
    const isNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.ilike."*${value}*"`);
    } else if (this.isOr) {
      this.ors.push(`${column}.ilike."*${value}*"`);
    } else {
      this.queries.push(`${column}=${isNot}ilike."*${value}*"`);
      this.isNot = false;
    }

    return this;
  }

  public in(column: string, values: (number | string)[], withQuotes = false) {
    const finalValues = withQuotes ? values.map(value => `"${value}"`) : values;
    const isNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.in.(${finalValues.join(",")})`);
    } else if (this.isOr) {
      this.ors.push(`${column}.in.(${finalValues.join(",")})`);
    } else {
      this.queries.push(`${column}=${isNot}in.(${finalValues.join(",")})`);
      this.isNot = false;
    }

    return this;
  }

  public is(column: string, value: boolean | null) {
    const isNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.is.${String(value)}`);
    } else if (this.isOr) {
      this.ors.push(`${column}.is.${String(value)}`);
    } else {
      this.queries.push(`${column}=${isNot}is.${String(value)}`);
    }

    this.isNot = false;

    return this;
  }
};

export default Postgrest;
