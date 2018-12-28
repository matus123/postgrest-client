export function parseAuthorizationHeader(jwt?: string) {
    if (!jwt) {
        return {};
    }

    return {
        Authorization: `Bearer ${jwt}`,
    };
}
