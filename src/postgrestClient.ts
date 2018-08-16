import axios from 'axios';
import { cloneDeep, compact } from 'lodash';

import { FilterOperator, Ordering, PostgrestAction } from './constants';
import { parseFilters, parseSelect } from './parsers/filterParser';
import {  parseOrders } from './parsers/orderParser';
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

export interface IPostgrestClientFilter {
  [key: string]: {
    tableName?: string;
    operator: FilterOperator;
    value: string | string[] | number | number[];
  };
}

export type PostgrestClientFilter = IPostgrestClientASD & IPostgrestClientFilter;

export interface IPostgrestClientOrder {
  [key: string]: {
    direction?: Ordering,
    nulls?: 'first' | 'last',
  };
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
  private urlValue?: string;

  private limitValue?: number;
  private offsetValue?: number;

  private filterValue?: PostgrestClientFilter;

  private selectFields?: PostgrestClientSelect;

  private orderValue?: PostgrestClientOrder;

  private typeValue: PostgrestAction = PostgrestAction.Get;

  constructor(config?: IPostgrestClientConfig) {
    if (config) {
      this.jwtValue = config.jwt;
      this.urlValue = config.url;
    }
  }

  public url(url: string) {
    this.urlValue = url;
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

  public toQueryUrl() {
    const filterQuery = parseFilters(this.filterValue);

    const selectQuery = parseSelect(this.selectFields);

    const orderQuery = parseOrders(this.orderValue);

    const queries = compact([selectQuery, filterQuery, orderQuery]);

    const queryString = queries.length > 0 ? `?${queries.join('&')}` : '';

    return `${this.urlValue}${queryString}`;
  }

  public async exec() {
    try {
      const response = axios.request({
        method: this.typeValue,
        url: this.urlValue,

        // TODO
        // headers
        // data
        // responseType
      });
    } catch (err) {
      console.log(err);
    }
  }
}
