export interface IParsedLimit {
    limit?: string;
}

export function parseLimit(limitValue?: number): IParsedLimit {
    if (!limitValue) {
        return {};
    }

    const limitQuery = `limit=${limitValue}`;

    if (limitQuery) {
        return {
            limit: limitQuery,
        };
    }

    return {};
}

export interface IParsedOffset {
    offset?: string;
}

export function parseOffset(offsetValue?: number): IParsedOffset {
    if (!offsetValue) {
        return {};
    }

    const offsetQuery = `offset=${offsetValue}`;

    if (offsetQuery) {
        return {
            offset: offsetQuery,
        };
    }

    return {};
}
