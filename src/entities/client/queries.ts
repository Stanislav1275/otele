import {useRQValue} from "@/shared/lib/query/useRQValue.ts";
import {useQuery} from "@tanstack/react-query";
import {ClientResponseSchema} from "@/shared/models/client.ts";
import {ClientKeys} from "@/entities/client/keys.ts";
import {ClientRepository} from "@/entities/client/repository.ts";

export const useClientsQuery = () => (
    useQuery({queryKey: ClientKeys.getClients(), queryFn: () => ClientRepository.getClients()})
)
export const useAuthModal = () => useRQValue({key: 'authModal', defaultValue: false});
export const useCurrentUser = () => {
    const u = localStorage.getItem('user')
    const client = u && u !== 'undefined' ? JSON.parse(u) as ClientResponseSchema : null;
    return useQuery<ClientResponseSchema | null>({
        queryFn: () => {
            return client;
        }, queryKey: ClientKeys.getClient(client?.id || -1)
    })
}
export const useLogged = () => {
    const {data} = useCurrentUser();
    return !!localStorage.getItem('user')
}
