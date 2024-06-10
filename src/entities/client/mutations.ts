import {AUTH_DEPEND, queryClient, useOptimisticMutation} from "@/shared/lib/query";
import {ClientCreateRequestSchema, ClientResponseSchema} from "@/shared/models/client.ts";
import {DefaultError} from "@tanstack/react-query";
import {ClientRepository} from "@/entities/client/repository.ts";

export const useSignup = () => useOptimisticMutation<ClientResponseSchema, DefaultError, ClientCreateRequestSchema>({
    mutationFn: async (data) => {
        const user = await ClientRepository.createClient(data)
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    },
    invalidate: [AUTH_DEPEND]
})

export const useSingIn = () => {
    return useOptimisticMutation<ClientResponseSchema, DefaultError, ClientCreateRequestSchema>({
        invalidate: [AUTH_DEPEND],
        mutationFn: async (data) => {
            const {clients} = await ClientRepository.getClients();
            const c = clients.find(v => v.first_name === data.first_name && v.last_name === v.last_name)
            localStorage.setItem('user', JSON.stringify(c));
            if (c) return c;
            throw new Error("Такого клиента нет")
        }
    })
}
export const logout = async () => {
    localStorage.removeItem('user');
    queryClient.removeQueries({predicate: (query) => query.queryKey.includes(AUTH_DEPEND)})
}
