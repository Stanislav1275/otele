import {DefaultError} from "@tanstack/react-query";
import {FabricResponseSchema} from "@/shared/models/fabric.ts";
import {useOptimisticMutation} from "@/shared/lib/query";
import {FabricStockRepository} from "@/entities/fabric-stocks/model/repository.ts";
import {UpdateFabricStockRequestSchema} from "@/shared/models/fabric-stack.ts";
import {FabricStockKeys} from "@/entities/fabric-stocks/model/keys.ts";



export const useUpdateFabricStock = () => {
    return useOptimisticMutation<FabricResponseSchema, DefaultError, UpdateFabricStockRequestSchema & {
        fabric_id: number
    }>({
        mutationFn: ({fabric_id, ...other}) => FabricStockRepository.updateStock(fabric_id, other),
        invalidate: [FabricStockKeys.getFabricsStock()]
    })
}

