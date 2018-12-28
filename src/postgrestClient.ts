import axios, { AxiosRequestConfig } from 'axios';
import { cloneDeep, isEmpty } from 'lodash';

import { FilterOperator, Ordering, PostgrestAction } from './constants';
import { parseFilters } from './parsers/filterParser';
import { parseOrders } from './parsers/orderParser';
import { parseLimit, parseOffset } from './parsers/paginationParser';
import { parseSelect } from './parsers/selectParser';
import { parseAuthorizationHeader } from './utils';

export interface IPostgrestClientConfig {
  jwt?: string;
  url?: string;
}

export interface IPostgrestClientSelect {
  column: string;
  alias?: string;
  cast?: string;
  resource?: string;
}

export type PostgrestClientSelect = Array<IPostgrestClientSelect | string>;

export interface IPostgrestClientASD {
  or?: IPostgrestClientFilter;
}

export interface IPostgrestClientFilterDefinition {
  tableName?: string;
  operator: FilterOperator;
  value: string | string[] | number | number[];
}

export type PostgrestClientFilterValue = IPostgrestClientFilterDefinition | string | number | boolean;

export interface IPostgrestClientFilter {
  [key: string]: PostgrestClientFilterValue;
}

export type PostgrestClientFilter = IPostgrestClientASD & IPostgrestClientFilter;

export type PostgrestClientOrder = Array<IPostgrestClientOrder | string>;
export interface IPostgrestClientOrder {
  column: string;
  resource?: string;
  direction?: Ordering;
  nulls?: 'first' | 'last';
}

export enum PostContentType {
  Json = 'application/json',
  Csv = 'text/csv',
}

export enum GetAcceptType {
  Json = 'application/json',
  Csv = 'text/csv',
  Single = 'application/vnd.pgrst.object+json',
  OctetStream = 'application/octet-stream',
}

/**
 * Factory function for postgrestClient
 * @export
 * @param {IPostgrestClientConfig} [config]
 * @returns
 */
export function makePostgrestClient(config?: IPostgrestClientConfig) {
  return new PostgrestClient(config);
}

export class PostgrestClient {
  private jwtValue?: string;
  private baseUrl?: string;
  private urlModel?: string;

  private limitValue?: number;
  private offsetValue?: number;

  private filterValue?: PostgrestClientFilter;

  private selectFields?: PostgrestClientSelect;

  private orderValue?: PostgrestClientOrder;

  private payload?: any | any[];
  private contentType: PostContentType = PostContentType.Json;
  private acceptType: GetAcceptType = GetAcceptType.Json;

  private typeValue: PostgrestAction = PostgrestAction.Get;

  constructor(config?: IPostgrestClientConfig) {
    if (config) {
      this.jwtValue = config.jwt;
      this.baseUrl = config.url;
    }
  }

  public get<T>(select?: PostgrestClientSelect, acceptType?: GetAcceptType) {
    this.typeValue = PostgrestAction.Get;
    this.acceptType = acceptType || this.acceptType;
    this.selectFields = select;
    return this.exec<T>();
  }

  public post<T>(payload: T | T[], contentType?: PostContentType) {
    this.typeValue = PostgrestAction.Post;
    this.contentType = contentType || this.contentType;
    this.payload = payload;
    return this.exec<T>();
  }

  public put<T>() {
    return this.exec<T>();
  }

  public url(url: string) {
    this.baseUrl = url;
    return this;
  }

  public select(select: PostgrestClientSelect) {
    this.selectFields = select;
    return this;
  }

  public limit(limit: number) {
    this.limitValue = limit;
    return this;
  }

  public filter(filters: PostgrestClientFilter) {
    this.filterValue = filters;
    return this;
  }

  public order(orders: PostgrestClientOrder) {
    this.orderValue = orders;
    return this;
  }

  public clone() {
    return cloneDeep(this);
  }

  public rpc(rpcName: string) {
    this.urlModel = `rpc/${rpcName}`;
    return this;
  }

  public model(modelName: string) {
    this.urlModel = modelName;
    return this;
  }

  public toQuery() {
    const filterQuery = parseFilters(this.filterValue);

    const selectQuery = parseSelect(this.selectFields);

    const orderQuery = parseOrders(this.orderValue);

    const limitQuery = parseLimit(this.limitValue);

    const offsetQuery = parseOffset(this.offsetValue);

    const queryString = {
      ...filterQuery,
      ...selectQuery,
      ...orderQuery,
      ...limitQuery,
      ...offsetQuery,
    };

    return {
      url: this.getUrl(),
      queryString: !isEmpty(queryString) ? queryString : undefined,
    };
  }

  private async exec<T>() {
    const requestBody = this.prepareAxiosRequest();

    try {
      const response = await axios.request<T>(requestBody);
      return response;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private getUrl() {
    if (!this.baseUrl || !this.urlModel) {
      throw new Error('baseUrl and rpc/model must be specified');
    }

    return `${this.baseUrl}/${this.urlModel}`;
  }

  private prepareAxiosRequest(): AxiosRequestConfig {
    const query = this.toQuery();

    const baseRequest: AxiosRequestConfig = {
      headers: {
        ...parseAuthorizationHeader(this.jwtValue),
        accept: this.acceptType,
        ['content-type']: this.contentType,
      },
      method: this.typeValue,
      url: query.url,
    };

    let requestConfig: AxiosRequestConfig = {};

    if (this.typeValue === PostgrestAction.Get) {
      requestConfig = Object.assign({}, baseRequest, { params: query.queryString });
    }

    if (this.typeValue === PostgrestAction.Post) {
      requestConfig = Object.assign({}, baseRequest, { data: this.payload });
    }

    if (this.typeValue === PostgrestAction.Put) {
      requestConfig = Object.assign({}, baseRequest, { data: this.payload });
    }

    {

      // TODO
      // headers
    }

    return requestConfig;
  }
}
