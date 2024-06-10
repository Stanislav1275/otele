import {DefaultError, QueryKey, useMutation} from "@tanstack/react-query";
import {queryClient, useOptimisticMutation} from "@/shared/lib/query";
import {
    CreateOrderRequestSchema,
    OrderListResponseSchema,
    OrderResponseSchema,
    UpdateOrderRequestSchema
} from "@/shared/models/orders.ts";
import {OrdersRepository} from "@/entities/order/model/repository.ts";
import {OrdersKeys} from "@/entities/order/model/keys.ts";

export const useCreateOrder = () => (
    useMutation<OrderResponseSchema, DefaultError, CreateOrderRequestSchema>({
        mutationFn: (query) => OrdersRepository.createOrder(query),
        onMutate: async (newOrder) => {
            const prev = queryClient.getQueryData<OrderListResponseSchema>(OrdersKeys.getOrders())
            if (prev) {
                queryClient.setQueryData<OrderListResponseSchema, QueryKey>(OrdersKeys.getOrders(), (old) => {
                    if (old?.orders) {
                        if (!old.orders.length) {
                            old.orders = [{
                                ...newOrder,
                                id: 1,
                                is_completed: false,
                                completion_date: new Date().toISOString().slice(0, 19)
                            }]
                        }
                        old.orders = [...prev.orders, {
                            ...newOrder, id: prev.orders[prev.orders.length - 1].id + 1, is_completed: false,
                            completion_date: new Date().toISOString().slice(0, 19)
                        }]
                    }
                    return {...old}
                })
            }
        }
    })
)

export const useUpdateOrder = () => (
    useOptimisticMutation<OrderResponseSchema, DefaultError, UpdateOrderRequestSchema & { id: number }>({
            mutationFn: (query) => OrdersRepository.updateOrderStatus(query.id, query),
            invalidate: [OrdersKeys.getOrders()]
        }
    ))
