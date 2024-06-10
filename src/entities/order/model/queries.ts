import {useQuery} from "@tanstack/react-query";
import {OrdersRepository} from "@/entities/order/model/repository.ts";
import {OrdersKeys} from "@/entities/order/model/keys.ts";

export const useOrdersListQuery = () => {
    return useQuery({
        queryFn: () => {
            return OrdersRepository.getOrders()
        }, queryKey: OrdersKeys.getOrders()
    })
}
