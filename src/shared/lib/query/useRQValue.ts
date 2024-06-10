import {useQuery} from '@tanstack/react-query';
import {queryClient} from "@/shared/lib/query/queryClient.ts";

interface UseRQValue<T> {
    key: string;
    defaultValue: T;
}


export const useRQValue = <T>({key, defaultValue}: UseRQValue<T>) => {
    const value = useQuery({
        queryKey: [key],
        queryFn: () => defaultValue,
        refetchOnMount: false,
        staleTime: Infinity,
    }).data! as T;

    const setValue = (newValue: T | ((prev: T) => T)) => {
        queryClient.setQueryData([key], newValue);
    };

    return [value, setValue] as const;
};
