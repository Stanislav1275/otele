import {$api} from "@/shared/lib/axios/instance.tsx";
import {
    CreateOrderRequestSchema,
    OrderListResponseSchema,
    OrderResponseSchema,
    UpdateOrderRequestSchema,
    UpdateOrderResponseSchema
} from "@/shared/models/orders.ts";

export class OrdersRepository {
    public static createOrder = async (query: CreateOrderRequestSchema): Promise<OrderResponseSchema> => {
        //@ts-ignore
        return $api.post<OrderResponseSchema, CreateOrderRequestSchema>(`api/order`, query).then(v => v.data)
    }
    public static getOrders = async (): Promise<OrderListResponseSchema> => {
        return $api.get<OrderListResponseSchema>('api/order').then(v => v.data)
    }
    public static updateOrderStatus = async (orderId: number, query: UpdateOrderRequestSchema) => {
        //@ts-ignore
        return $api.patch<UpdateOrderResponseSchema, UpdateOrderRequestSchema>(`api/order/${orderId}/complete`, query).then(v => v.data)
    }

}
