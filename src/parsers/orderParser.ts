import { has, isEmpty, isString, mapValues, reduce } from 'lodash';

import { PostgrestClientOrder } from '..';

const ORDER_KEY = 'order';

export interface IParsedOrder {
    [orderResource: string]: string;
}

interface IParsedOrderArray {
    [orderResource: string]: string[];
}

export function parseOrders(orderValue?: PostgrestClientOrder): IParsedOrder {
    if (!orderValue || isEmpty(orderValue)) {
        return {};
    }

    const orderQuery: IParsedOrderArray = reduce(orderValue, (query, order) => {
        if (isString(order)) {
            if (has(query, ORDER_KEY)) {
                query[ORDER_KEY].push(order);
            } else {
                query[ORDER_KEY] = [order];
            }
        } else {
            const resource = order.resource;

            const key = resource ? `${resource}.${ORDER_KEY}` : ORDER_KEY;

            const column = order.column;
            const direction = order.direction ? ('.' + order.direction) : '';
            const nulls = (order.nulls) ? ('.nulls' + order.nulls) : '';
            const value = column + direction + nulls;

            if (has(query, key)) {
                query[key].push(value);
            } else {
                query[key] = [value];
            }
        }
        return query;
    }, {} as IParsedOrderArray);

    return mapValues(orderQuery, (value) => {
        return value.join(',');
    });
}
