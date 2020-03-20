import axios, { AxiosInstance } from "axios";

// tslint:disable-next-line:import-name
import T from "./texts";
import { PostgresterConfig, PostgresterConstructor, PostgresterInstance } from "./types";

const Postgrester: PostgresterConstructor = class Postgrester implements PostgresterInstance {
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

  constructor({ axiosConfig, axiosInstance, baseUri }: PostgresterConfig) {
    if (baseUri !== undefined) {
      console.warn(T.POSTGRESTER_DEPRECATION_BASE_URI);
    }

    if (axiosInstance !== undefined) {
      this.axios = axiosInstance;
    } else {
      const newAxiosConfig = axiosConfig !== undefined ? axiosConfig : {};

      if (baseUri !== undefined) {
        newAxiosConfig.baseURL = baseUri;
      }

      this.axios = axios.create(newAxiosConfig);
    }

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

    if (!isGet) {
      const query = params.join("&");

      return query.length > 0 ? `${path}?${params.join("&")}` : path;
    }

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

  public async get<T = any>(path: string, withPagesLength = false) {
    const uri = this.buildUri(path, true);
    const limit = this.limit;
    this.reset();

    const config = withPagesLength
      ? {
          headers: {
            Prefer: "count=exact"
          }
        }
      : {};

    const { data, headers } = await this.axios.get<T>(uri, config);

    let pagesLength = -1;
    if (limit > 0 && withPagesLength && headers["content-range"] !== undefined) {
      const length = Number(headers["content-range"].split("/")[1]);
      pagesLength = Math.ceil(length / limit);
    }

    return { data, pagesLength };
  }

  public async post(path: string, data: object | object[]) {
    this.reset();

    await this.axios.post(path, data);
  }

  public async patch(path: string, data: object) {
    const uri = this.buildUri(path);
    this.reset();

    await this.axios.patch(uri, data);
  }

  public async put(path: string, data: object) {
    const uri = this.buildUri(path);
    this.reset();

    await this.axios.put(uri, data);
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

    const mayBeNot = this.isNot ? "not." : "";
    const cleanValue = withQuotes ? `"${value}"` : value;

    if (this.isAnd) {
      this.ands.push(`${column}.eq.${cleanValue}`);
    } else if (this.isOr) {
      this.ors.push(`${column}.eq.${cleanValue}`);
    } else {
      this.queries.push(`${column}=${mayBeNot}eq.${cleanValue}`);
      this.isNot = false;
    }

    return this;
  }

  public neq(column: string, value: boolean | number | string | null, withQuotes = false) {
    if (typeof value === "boolean" || value === null) {
      return this.not.is(column, value);
    }

    const mayBeNot = this.isNot ? "not." : "";
    const cleanValue = withQuotes ? `"${value}"` : value;

    if (this.isAnd) {
      this.ands.push(`${column}.neq.${cleanValue}`);
    } else if (this.isOr) {
      this.ors.push(`${column}.neq.${cleanValue}`);
    } else {
      this.queries.push(`${column}=${mayBeNot}neq.${cleanValue}`);
      this.isNot = false;
    }

    return this;
  }

  public gt(column: string, value: number | string, isInclusive = false) {
    const mayBeNot = this.isNot ? "not." : "";
    const operator = isInclusive ? "gte" : "gt";

    if (this.isAnd) {
      this.ands.push(`${column}.${operator}.${value}`);
    } else if (this.isOr) {
      this.ors.push(`${column}.${operator}.${value}`);
    } else {
      this.queries.push(`${column}=${mayBeNot}${operator}.${value}`);
      this.isNot = false;
    }

    return this;
  }

  public gte(column: string, value: number | string) {
    this.gt(column, value, true);

    return this;
  }

  public lt(column: string, value: number | string, isInclusive = false) {
    const mayBeNot = this.isNot ? "not." : "";
    const operator = isInclusive ? "lte" : "lt";

    if (this.isAnd) {
      this.ands.push(`${column}.${operator}.${value}`);
    } else if (this.isOr) {
      this.ors.push(`${column}.${operator}.${value}`);
    } else {
      this.queries.push(`${column}=${mayBeNot}${operator}.${value}`);
      this.isNot = false;
    }

    return this;
  }

  public lte(column: string, value: number | string) {
    this.lt(column, value, true);

    return this;
  }

  public like(column: string, value: string) {
    const mayBeNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.like.*${value}*`);
    } else if (this.isOr) {
      this.ors.push(`${column}.like.*${value}*`);
    } else {
      this.queries.push(`${column}=${mayBeNot}like.*${value}*`);
      this.isNot = false;
    }

    return this;
  }

  public ilike(column: string, value: string) {
    const mayBeNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.ilike.*${value}*`);
    } else if (this.isOr) {
      this.ors.push(`${column}.ilike.*${value}*`);
    } else {
      this.queries.push(`${column}=${mayBeNot}ilike.*${value}*`);
      this.isNot = false;
    }

    return this;
  }

  public in(column: string, values: (number | string)[], withQuotes = false) {
    const finalValues = withQuotes ? values.map(value => `"${value}"`) : values;
    const mayBeNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.in.(${finalValues.join(",")})`);
    } else if (this.isOr) {
      this.ors.push(`${column}.in.(${finalValues.join(",")})`);
    } else {
      this.queries.push(`${column}=${mayBeNot}in.(${finalValues.join(",")})`);
      this.isNot = false;
    }

    return this;
  }

  public is(column: string, value: boolean | null) {
    const mayBeNot = this.isNot ? "not." : "";

    if (this.isAnd) {
      this.ands.push(`${column}.is.${String(value)}`);
    } else if (this.isOr) {
      this.ors.push(`${column}.is.${String(value)}`);
    } else {
      this.queries.push(`${column}=${mayBeNot}is.${String(value)}`);
    }

    this.isNot = false;

    return this;
  }
};

export default Postgrester;

// Allow use of default import syntax in TypeScript:
module.exports.default = Postgrester;
