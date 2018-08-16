import { isEmpty, reduce } from 'lodash';
import { PostgrestClientOrder } from '..';

export function parseOrders(orderValue?: PostgrestClientOrder): string | undefined {
    if (!orderValue || isEmpty(orderValue)) {
      return undefined;
    }

    let orderQuery = reduce(orderValue, (query, value, key) => {
        if (typeof value === typeof '') {
            query.push(value);
        } else {
            const direction = (value.direction) ? ('.' + value.direction) : '';
            const nulls = (value.nulls) ? ('.nulls' + value.nulls) : '';
            query.push(`${key}${direction}${nulls}`);
        }
        return query;
    }, [] as string[]).join(',');

    if (orderQuery.length > 0) {
        orderQuery = 'order=' + orderQuery;
    }

    return orderQuery;
}
