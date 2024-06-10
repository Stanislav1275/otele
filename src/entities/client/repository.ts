import {ClientCreateRequestSchema, ClientListSchema, ClientResponseSchema} from "@/shared/models/client.ts";
import {$api} from "@/shared/lib/axios/instance.tsx";

export class ClientRepository {
    public static createClient = async (query: ClientCreateRequestSchema): Promise<ClientResponseSchema> => {
        return $api.post<ClientResponseSchema>('api/client', query).then(v => v.data)
    }
    public static getClients = async (): Promise<ClientListSchema> => {
        return $api.get<ClientListSchema>('api/client').then(v => v.data)
    }

}
