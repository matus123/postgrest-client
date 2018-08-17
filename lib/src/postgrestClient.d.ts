import { FilterOperator, Ordering } from './constants';
export interface IPostgrestClientConfig {
    jwt?: string;
    url?: string;
}
export interface IPostgrestClientSelect {
    column: string;
    alias?: string;
    cast?: string;
}
export declare type PostgrestClientSelect = Array<IPostgrestClientSelect | string>;
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
export declare type PostgrestClientFilter = IPostgrestClientASD & IPostgrestClientFilter;
export interface IPostgrestClientOrder {
    [key: string]: {
        direction?: Ordering;
        nulls?: 'first' | 'last';
    };
}
export declare type PostgrestClientOrder = IPostgrestClientOrder | string[];
/**
 * Factory function for postgrestClient
 * @export
 * @param {IPostgrestClientConfig} [config]
 * @returns
 */
export declare function postgrestClient(config?: IPostgrestClientConfig): PostgrestClient;
export declare class PostgrestClient {
    private jwtValue?;
    private urlValue?;
    private limitValue?;
    private offsetValue?;
    private filterValue?;
    private selectFields?;
    private orderValue?;
    private typeValue;
    constructor(config?: IPostgrestClientConfig);
    url(url: string): this;
    select(select: PostgrestClientSelect): this;
    limit(limit: number): this;
    filter(filters: PostgrestClientFilter): this;
    order(orders: PostgrestClientOrder): this;
    clone(): this;
    toQueryUrl(): string;
    exec(): Promise<void>;
}
