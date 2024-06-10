export type ClientCreateRequestSchema = {
    "first_name": string,
    "last_name": string
}
export type ClientResponseSchema = {
    "id": number,
    "first_name": string,
    "last_name": string
}
export type ClientListSchema = {
    clients: Array<ClientResponseSchema>
}
