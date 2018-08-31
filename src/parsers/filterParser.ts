import { isArray, isEmpty, reduce } from 'lodash';

import { IPostgrestClientFilterDefinition, PostgrestClientFilter, PostgrestClientFilterValue } from '..';
import { FilterOperator } from '../constants';

function escapeValue(value: string|number|string[]|number[], operator: FilterOperator) {
  if (operator === FilterOperator.In && isArray(value)) {
    return `(${value.join(',')})`;
  }

  if ([FilterOperator.Like, FilterOperator.Ilike].includes(operator) && !isArray(value)) {
    return value.toString().replace('%', '*');
  }

  return value;
}

function isFilterObject(filterValue: PostgrestClientFilterValue): filterValue is IPostgrestClientFilterDefinition {
  if ((filterValue as IPostgrestClientFilterDefinition).operator != null &&
      (filterValue as IPostgrestClientFilterDefinition).value != null
    ) {
    return true;
  }
  return false;
}

export interface IParsedFilters {
  [key: string]: string;
}

export function parseFilters(filterValue?: PostgrestClientFilter): IParsedFilters {
  if (!filterValue || isEmpty(filterValue)) {
    return {};
  }

  const filterQuery = reduce(filterValue, (query, filterObj, key) => {
    // TODO
    if (key === 'or' || key === 'and') {
      return query;
    }

    // complex object
    if (isFilterObject(filterObj)) {
      const value = escapeValue(filterObj.value, filterObj.operator);
      query[`${filterObj.tableName ? `${filterObj.tableName}.` : ''}${key}`] = `${filterObj.operator}.${value}`;
    } else {
      query[key] = `${FilterOperator.Eq}.${filterObj.toString()}`;
    }

    return query;
  }, {} as IParsedFilters);

  return filterQuery;
}
