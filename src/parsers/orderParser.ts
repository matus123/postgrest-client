import { isEmpty, reduce } from 'lodash';

import { PostgrestClientOrder } from '..';

export interface IParsedOrder {
    order?: string;
}

export function parseOrders(orderValue?: PostgrestClientOrder): IParsedOrder {
    if (!orderValue || isEmpty(orderValue)) {
      return {};
    }

    const orderQuery = reduce(orderValue, (query, value, key) => {
        if (typeof value === typeof '') {
            query.push(value);
        } else {
            const direction = (value.direction) ? ('.' + value.direction) : '';
            const nulls = (value.nulls) ? ('.nulls' + value.nulls) : '';
            query.push(`${key}${direction}${nulls}`);
        }
        return query;
    }, [] as string[]).join(',');

    if (orderQuery) {
        return {
            order: orderQuery,
        };
    }

    return {};
}
