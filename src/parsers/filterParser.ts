import { isArray, isEmpty, reduce, isString } from 'lodash';

import { PostgrestClientFilter, PostgrestClientSelect } from '..';
import { FilterOperator } from '../constants';

function escapeValue(value: string|number|string[]|number[], operator: FilterOperator) {
  if (operator === FilterOperator.in && isArray(value)) {
    return `(${value.join(',')})`;
  }

  if ([FilterOperator.like, FilterOperator.ilike].includes(operator) && !isArray(value)) {
    return value.toString().replace('%', '*');
  }

  return value;
}

export function parseFilters(filterValue?: PostgrestClientFilter): string | undefined {
  if (!filterValue || isEmpty(filterValue)) {
    return undefined;
  }

  const filterQuery = reduce(filterValue, (query, filterObj, key) => {
    if (key === 'or' || key === 'and') {
      return query;
    }

    const value = escapeValue(filterObj.value, filterObj.operator);

    query.push(`${filterObj.tableName ? `${filterObj.tableName}.` : ''}${key}=${filterObj.operator}.${value}`);

    return query;
  }, [] as string[]).join('&');

  return filterQuery;
}

export function parseSelect(selectValue?: PostgrestClientSelect): string | undefined {
  if (!selectValue || isEmpty(selectValue)) {
    return undefined;
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
    return `select=${filterQuery}`;
  }

  return filterQuery;
}
