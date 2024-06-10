export const removeUnusedQueryParams = (query: any) => Object.fromEntries(Object.entries(query).filter(([_, v]) => v !== undefined));
