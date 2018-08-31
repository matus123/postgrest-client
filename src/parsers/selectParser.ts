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
            query.push(`${select.alias ? `${select.alias}:` : ''}${select.column}${select.cast ? `::${select.cast}` : ''}`);
        }

        return query;
    }, [] as string[]).join(',');

    if (filterQuery) {
        return {
            select: filterQuery,
        };
    }

    return {};
}
