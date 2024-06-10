export type CreateOrderRequestSchema = {
    "client_id": number,
    "model_id": number,
    "fabric_id": number,
    "tailor_name": string,
    "order_date": string,
    "fitting_date": string
}
export type OrderResponseSchema =
    {
        "id": number,
        "client_id": number,
        "model_id": number,
        "fabric_id": number,
        "tailor_name": string,
        "order_date": string,
        "fitting_date": string,
        "is_completed": boolean,
        "completion_date": null | string
    }
export type OrderListResponseSchema = {
    orders: Array<OrderResponseSchema>
}
export type UpdateOrderRequestSchema = {
    is_completed: boolean;
    //2017-03-12T13:37:27
    completion_date: string;
}
export type UpdateOrderResponseSchema = {
    "id": number,
    "client_id": number,
    "model_id": number,
    "fabric_id": number,
    "tailor_name": string,
    "order_date": string,
    "fitting_date": string,
    "is_completed": boolean,
    "completion_date": string
}
