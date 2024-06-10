import {
    DefaultError,
    QueryClient,
    QueryFilters,
    QueryKey,
    useMutation,
    UseMutationOptions,
    UseMutationResult
} from '@tanstack/react-query';

export const AUTH_DEPEND = 'AUTH_DEPEND';


export const queryClient = new QueryClient({defaultOptions: {queries: {staleTime: 60 * 1000}}});
export const useOptimisticMutation = <TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, TError, TVariables, TContext> & {
        invalidate?: QueryKey | QueryKey[] | QueryFilters['predicate'];
    },
    client: QueryClient = queryClient,
): UseMutationResult<TData, TError, TVariables, TContext> =>
    useMutation({
        ...options,
        onSuccess: async (data, error, context) => {
            await options?.onSuccess?.(data, error, context);
            if (options.invalidate) {
                await client.invalidateQueries({
                    predicate: (query) => {
                        //@ts-ignore
                        if (typeof options.invalidate === 'function') return options.invalidate(query);
                        //@ts-ignore
                        const isSingleKey = options.invalidate!.every((key) => !Array.isArray(key));
                        if (isSingleKey) {
                            return JSON.stringify(options.invalidate) === JSON.stringify(query.queryKey);
                        }
                        //@ts-ignore
                        return options.invalidate!.some((key) => JSON.stringify(key) === JSON.stringify(query.queryKey));
                    },
                });
            }
        },
    });

export const revalidateAuth = () =>
    queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(AUTH_DEPEND),
    });
