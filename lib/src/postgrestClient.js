"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const lodash_1 = require("lodash");
const constants_1 = require("./constants");
const filterParser_1 = require("./parsers/filterParser");
const orderParser_1 = require("./parsers/orderParser");
/**
 * Factory function for postgrestClient
 * @export
 * @param {IPostgrestClientConfig} [config]
 * @returns
 */
function postgrestClient(config) {
    return new PostgrestClient(config);
}
exports.postgrestClient = postgrestClient;
class PostgrestClient {
    constructor(config) {
        this.typeValue = constants_1.PostgrestAction.Get;
        if (config) {
            this.jwtValue = config.jwt;
            this.urlValue = config.url;
        }
    }
    url(url) {
        this.urlValue = url;
        return this;
    }
    select(select) {
        this.selectFields = select;
        return this;
    }
    limit(limit) {
        this.limitValue = limit;
        return this;
    }
    filter(filters) {
        this.filterValue = filters;
        return this;
    }
    order(orders) {
        this.orderValue = orders;
        return this;
    }
    clone() {
        return lodash_1.cloneDeep(this);
    }
    toQueryUrl() {
        const filterQuery = filterParser_1.parseFilters(this.filterValue);
        const selectQuery = filterParser_1.parseSelect(this.selectFields);
        const orderQuery = orderParser_1.parseOrders(this.orderValue);
        const queries = lodash_1.compact([selectQuery, filterQuery, orderQuery]);
        const queryString = queries.length > 0 ? `?${queries.join('&')}` : '';
        return `${this.urlValue}${queryString}`;
    }
    async exec() {
        try {
            const response = axios_1.default.request({
                method: this.typeValue,
                url: this.urlValue,
            });
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.PostgrestClient = PostgrestClient;
//# sourceMappingURL=postgrestClient.js.map