import {AUTH_DEPEND} from "@/shared/lib/query";

export class ClientKeys {
    public static getClients = () => [AUTH_DEPEND, 'clients']
    public static getClient = (clientId: number) => [AUTH_DEPEND, 'client', clientId]
}
