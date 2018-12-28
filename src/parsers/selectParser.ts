import { isEmpty, isString, reduce } from 'lodash';

import { PostgrestClientSelect } from '..';

export interface IParsedSelect {
    select?: string;
}

export function parseSelect(selectValue?: PostgrestClientSelect): IParsedSelect {
    if (!selectValue || isEmpty(selectValue)) {
        return {};
    }

    const filterQuery = reduce(selectValue, (query, select) => {

        if (isString(select)) {
            query.push(select);
        } else {
            const alias = select.alias ? `${select.alias}:` : '';
            const column = select.column;
            const cast = select.cast ? `::${select.cast}` : '';
            const value = alias + column + cast;
            query.push(value);
        }

        return query;
    }, [] as string[])
        .join(',');

    if (filterQuery) {
        return {
            select: filterQuery,
        };
    }

    return {};
}
