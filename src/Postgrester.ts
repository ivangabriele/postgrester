/* eslint-disable import/prefer-default-export */

import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios'

import {
  PostgresterConfig,
  PostgresterConstructor,
  PostgresterInstance,
  PostgesterPostUpsertOptions,
  Data,
  PostgesterCommonOptions,
  StringPojo,
} from './types'

const Postgrester: PostgresterConstructor = class Postgrester implements PostgresterInstance {
  private ands: string[] = []

  private readonly axios: AxiosInstance

  private foreignSorters: { [k: string]: string[] } = {}

  private isAnd: boolean = false

  private isNot: boolean = false

  private isOr: boolean = false

  private limit: number = -1

  private offset: number = -1

  private ors: string[] = []

  private queries: string[] = []

  private selectors: string[] = []

  private sorters: string[] = []

  public get and() {
    this.isAnd = true

    return this
  }

  public get or() {
    this.isOr = true

    return this
  }

  public get not() {
    this.isNot = true

    return this
  }

  constructor({ axiosConfig, axiosInstance }: PostgresterConfig) {
    if (axiosInstance !== undefined) {
      this.axios = axiosInstance
    } else {
      const newAxiosConfig = axiosConfig !== undefined ? axiosConfig : {}

      this.axios = axios.create(newAxiosConfig)
    }
  }

  private reset() {
    this.ands = []
    this.foreignSorters = {}
    this.isAnd = false
    this.isOr = false
    this.isNot = false
    this.limit = -1
    this.offset = -1
    this.ors = []
    this.queries = []
    this.selectors = []
    this.sorters = []
  }

  private buildUri(path: string, isGet = false) {
    const params: string[] = []

    // Selectors
    if (isGet) {
      params.push(`select=${this.selectors.length !== 0 ? this.selectors.join(',') : '*'}`)
    }

    // Filters
    this.queries.forEach(query => params.push(query))

    // "and" Filters
    if (this.ands.length !== 0) {
      const isNot = this.isNot ? 'not.' : ''

      params.push(`${isNot}and=(${this.ands.join(',')})`)
    }

    // "or" Filters
    if (this.ors.length !== 0) {
      const isNot = this.isNot ? 'not.' : ''

      params.push(`${isNot}or=(${this.ors.join(',')})`)
    }

    if (!isGet) {
      const query = params.join('&')

      return query.length > 0 ? `${path}?${params.join('&')}` : path
    }

    // Sorters
    if (this.sorters.length !== 0) {
      params.push(`order=${this.sorters.join(',')}`)
    }

    // Foreign Sorters
    const foreignSorterPairs = Object.entries(this.foreignSorters)
    if (foreignSorterPairs.length !== 0) {
      foreignSorterPairs.forEach(([resource, sorters]) => {
        params.push(`${resource}.order=${sorters.join(',')}`)
      })
    }

    // Pagination
    if (this.limit !== -1) {
      params.push(`limit=${this.limit}`)
      params.push(`offset=${this.offset}`)
    }

    return `${path}?${params.join('&')}`
  }

  // eslint-disable-next-line class-methods-use-this
  private buildHeaders({ preferOptions }: { preferOptions: StringPojo }): AxiosRequestHeaders | undefined {
    const preferOptionsKeys = Object.keys(preferOptions).sort()
    if (preferOptionsKeys.length === 0) {
      return undefined
    }

    const preferHeader = preferOptionsKeys
      .map(key => `${key}=${preferOptions[key]}`)
      // https://github.com/PostgREST/postgrest/pull/698
      .join(',')

    return {
      Prefer: preferHeader,
    }
  }

  public async get<T = Data>(
    path: string,
    withPagesLength = false,
  ): Promise<{
    data: T[]
    pagesLength: number
    totalLength: number
  }> {
    const uri = this.buildUri(path, true)
    const { limit } = this
    this.reset()

    const config = withPagesLength
      ? {
          headers: {
            Prefer: 'count=exact',
          },
        }
      : {}

    const { data, headers } = await this.axios.get<T[]>(uri, config)

    let totalLength = -1
    let pagesLength = -1
    if (limit > 0 && withPagesLength && headers['content-range'] !== undefined) {
      totalLength = Number(headers['content-range'].split('/')[1])
      pagesLength = Math.ceil(totalLength / limit)
    }

    return { data, pagesLength, totalLength }
  }

  public async post(
    path: string,
    data: any,
    options: any = {},
  ): Promise<{
    data: any
  }> {
    this.reset()

    // Upsert
    // http://postgrest.org/en/v9.0.0/api.html#upsert
    if (Array.isArray(data)) {
      const upsertOptions: PostgesterCommonOptions & PostgesterPostUpsertOptions = {
        ...options,
        resolution: options.resolution || 'merge-duplicates',
      }

      const { onConflict, ...preferOptions } = upsertOptions
      const fullPath = onConflict !== undefined ? `${path}?on_conflict=${onConflict}` : path
      const headers = this.buildHeaders({ preferOptions: preferOptions as StringPojo })
      const response = await this.axios.post(fullPath, data, {
        headers,
      })

      return {
        data: response?.data.length ? response.data : undefined,
      }
    }

    const insertOptions: PostgesterCommonOptions = options
    const headers = this.buildHeaders({ preferOptions: insertOptions })
    const response = await this.axios.post(path, data, {
      headers,
    })

    return {
      data: response?.data.length ? response.data[0] : undefined,
    }
  }

  public async patch(path: string, data: Data) {
    const uri = this.buildUri(path)
    this.reset()

    await this.axios.patch(uri, data)
  }

  public async put(path: string, data: Data) {
    const uri = this.buildUri(path)
    this.reset()

    await this.axios.put(uri, data)
  }

  public async delete(path: string, options: any = {}): Promise<any> {
    const uri = this.buildUri(path)
    this.reset()

    const headers = this.buildHeaders({ preferOptions: options })
    const response = await this.axios.delete(uri, {
      headers,
    })

    return {
      data: response?.data.length ? response.data[0] : undefined,
    }
  }

  public select(selector: string) {
    this.selectors.push(selector)

    return this
  }

  public orderBy(column: string, isDesc = false) {
    if (column.includes('.')) {
      const [foreignResource, foreignColumn] = column.split('.')
      if (this.foreignSorters[foreignResource] === undefined) {
        this.foreignSorters[foreignResource] = []
      }
      this.foreignSorters[foreignResource].push(`${foreignColumn}.${isDesc ? 'desc' : 'asc'}`)
    } else {
      this.sorters.push(`${column}.${isDesc ? 'desc' : 'asc'}`)
    }

    return this
  }

  public page(pageIndex: number, limit = 10) {
    this.limit = limit
    this.offset = pageIndex * limit

    return this
  }

  public eq(column: string, value: boolean | number | string | null, withQuotes = false) {
    if (typeof value === 'boolean' || value === null) {
      return this.is(column, value)
    }

    const mayBeNot = this.isNot ? 'not.' : ''
    const cleanValue = withQuotes ? `"${value}"` : value

    if (this.isAnd) {
      this.ands.push(`${column}.eq.${cleanValue}`)
    } else if (this.isOr) {
      this.ors.push(`${column}.eq.${cleanValue}`)
    } else {
      this.queries.push(`${column}=${mayBeNot}eq.${cleanValue}`)
      this.isNot = false
    }

    return this
  }

  public neq(column: string, value: boolean | number | string | null, withQuotes = false) {
    if (typeof value === 'boolean' || value === null) {
      return this.not.is(column, value)
    }

    const mayBeNot = this.isNot ? 'not.' : ''
    const cleanValue = withQuotes ? `"${value}"` : value

    if (this.isAnd) {
      this.ands.push(`${column}.neq.${cleanValue}`)
    } else if (this.isOr) {
      this.ors.push(`${column}.neq.${cleanValue}`)
    } else {
      this.queries.push(`${column}=${mayBeNot}neq.${cleanValue}`)
      this.isNot = false
    }

    return this
  }

  public gt(column: string, value: number | string, isInclusive = false) {
    const mayBeNot = this.isNot ? 'not.' : ''
    const operator = isInclusive ? 'gte' : 'gt'

    if (this.isAnd) {
      this.ands.push(`${column}.${operator}.${value}`)
    } else if (this.isOr) {
      this.ors.push(`${column}.${operator}.${value}`)
    } else {
      this.queries.push(`${column}=${mayBeNot}${operator}.${value}`)
      this.isNot = false
    }

    return this
  }

  public gte(column: string, value: number | string) {
    this.gt(column, value, true)

    return this
  }

  public lt(column: string, value: number | string, isInclusive = false) {
    const mayBeNot = this.isNot ? 'not.' : ''
    const operator = isInclusive ? 'lte' : 'lt'

    if (this.isAnd) {
      this.ands.push(`${column}.${operator}.${value}`)
    } else if (this.isOr) {
      this.ors.push(`${column}.${operator}.${value}`)
    } else {
      this.queries.push(`${column}=${mayBeNot}${operator}.${value}`)
      this.isNot = false
    }

    return this
  }

  public lte(column: string, value: number | string) {
    this.lt(column, value, true)

    return this
  }

  public like(column: string, value: string) {
    const mayBeNot = this.isNot ? 'not.' : ''

    if (this.isAnd) {
      this.ands.push(`${column}.like.*${value}*`)
    } else if (this.isOr) {
      this.ors.push(`${column}.like.*${value}*`)
    } else {
      this.queries.push(`${column}=${mayBeNot}like.*${value}*`)
      this.isNot = false
    }

    return this
  }

  public ilike(column: string, value: string) {
    const mayBeNot = this.isNot ? 'not.' : ''

    if (this.isAnd) {
      this.ands.push(`${column}.ilike.*${value}*`)
    } else if (this.isOr) {
      this.ors.push(`${column}.ilike.*${value}*`)
    } else {
      this.queries.push(`${column}=${mayBeNot}ilike.*${value}*`)
      this.isNot = false
    }

    return this
  }

  public in(column: string, values: (number | string)[], withQuotes = false) {
    const finalValues = withQuotes ? values.map(value => `"${value}"`) : values
    const mayBeNot = this.isNot ? 'not.' : ''

    if (this.isAnd) {
      this.ands.push(`${column}.in.(${finalValues.join(',')})`)
    } else if (this.isOr) {
      this.ors.push(`${column}.in.(${finalValues.join(',')})`)
    } else {
      this.queries.push(`${column}=${mayBeNot}in.(${finalValues.join(',')})`)
      this.isNot = false
    }

    return this
  }

  public is(column: string, value: boolean | null) {
    const mayBeNot = this.isNot ? 'not.' : ''

    if (this.isAnd) {
      this.ands.push(`${column}.is.${String(value)}`)
    } else if (this.isOr) {
      this.ors.push(`${column}.is.${String(value)}`)
    } else {
      this.queries.push(`${column}=${mayBeNot}is.${String(value)}`)
    }

    this.isNot = false

    return this
  }
}

export { Postgrester }
