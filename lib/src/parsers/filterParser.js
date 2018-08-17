"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
function escapeValue(value, operator) {
    if (operator === constants_1.FilterOperator.in && lodash_1.isArray(value)) {
        return `(${value.join(',')})`;
    }
    if ([constants_1.FilterOperator.like, constants_1.FilterOperator.ilike].includes(operator) && !lodash_1.isArray(value)) {
        return value.toString().replace('%', '*');
    }
    return value;
}
function parseFilters(filterValue) {
    if (!filterValue || lodash_1.isEmpty(filterValue)) {
        return undefined;
    }
    const filterQuery = lodash_1.reduce(filterValue, (query, filterObj, key) => {
        if (key === 'or' || key === 'and') {
            return query;
        }
        const value = escapeValue(filterObj.value, filterObj.operator);
        query.push(`${filterObj.tableName ? `${filterObj.tableName}.` : ''}${key}=${filterObj.operator}.${value}`);
        return query;
    }, []).join('&');
    return filterQuery;
}
exports.parseFilters = parseFilters;
function parseSelect(selectValue) {
    if (!selectValue || lodash_1.isEmpty(selectValue)) {
        return undefined;
    }
    const filterQuery = lodash_1.reduce(selectValue, (query, select) => {
        if (lodash_1.isString(select)) {
            query.push(select);
        }
        else {
            query.push(`${select.alias ? `${select.alias}:` : ''}${select.column}${select.cast ? `::${select.cast}` : ''}`);
        }
        return query;
    }, []).join(',');
    if (filterQuery) {
        return `select=${filterQuery}`;
    }
    return filterQuery;
}
exports.parseSelect = parseSelect;
//# sourceMappingURL=filterParser.js.map