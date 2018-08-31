import axios, { AxiosRequestConfig } from 'axios';
import { cloneDeep, isEmpty } from 'lodash';

import { FilterOperator, Ordering, PostgrestAction } from './constants';
import { parseFilters } from './parsers/filterParser';
import { parseOrders } from './parsers/orderParser';
import { parseSelect } from './parsers/selectParser';

export interface IPostgrestClientConfig {
  jwt?: string;
  url?: string;
  // TODO option for selecting limit/offset in header or query params
}

export interface IPostgrestClientSelect {
  column: string;
  alias?: string;
  cast?: string;
}

export type PostgrestClientSelect = Array<IPostgrestClientSelect | string>;

export interface IPostgrestClientASD {
  or?: IPostgrestClientFilter;
  and?: IPostgrestClientFilter;
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

export interface IPostgrestClientOrder {
  [key: string]: {
    direction?: Ordering,
    nulls?: 'first' | 'last',
  };
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

export type PostgrestClientOrder = IPostgrestClientOrder | string[];

/**
 * Factory function for postgrestClient
 * @export
 * @param {IPostgrestClientConfig} [config]
 * @returns
 */
export function postgrestClient(config?: IPostgrestClientConfig) {
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
  }

  public model(modelName: string) {
    this.urlModel = modelName;
    return this;
  }

  public toQuery() {
    const filterQuery = parseFilters(this.filterValue);

    const selectQuery = parseSelect(this.selectFields);

    const orderQuery = parseOrders(this.orderValue);

    const queryString = Object.assign({}, filterQuery, selectQuery, orderQuery);

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
      throw new Error('url and rpc/model must be specified');
    }

    return `${this.baseUrl}/${this.urlModel}`;
  }

  private prepareAxiosRequest(): AxiosRequestConfig {
    const query = this.toQuery();

    const baseRequest: AxiosRequestConfig = {
      headers: {
        accept: this.acceptType,
        ['content-type']: this.contentType,
      },
      method: this.typeValue,
      url: query.url,
    };

    let requestConfig: AxiosRequestConfig  = {};

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
