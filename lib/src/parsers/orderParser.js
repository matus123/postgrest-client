"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function parseOrders(orderValue) {
    if (!orderValue || lodash_1.isEmpty(orderValue)) {
        return undefined;
    }
    let orderQuery = lodash_1.reduce(orderValue, (query, value, key) => {
        if (typeof value === typeof '') {
            query.push(value);
        }
        else {
            const direction = (value.direction) ? ('.' + value.direction) : '';
            const nulls = (value.nulls) ? ('.nulls' + value.nulls) : '';
            query.push(`${key}${direction}${nulls}`);
        }
        return query;
    }, []).join(',');
    if (orderQuery.length > 0) {
        orderQuery = 'order=' + orderQuery;
    }
    return orderQuery;
}
exports.parseOrders = parseOrders;
//# sourceMappingURL=orderParser.js.map