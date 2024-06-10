import {DefaultError, QueryKey, useMutation} from "@tanstack/react-query";
import {FabricResponseSchema} from "@/shared/models/fabric.ts";
import {queryClient, useOptimisticMutation} from "@/shared/lib/query";
import {FabricStockRepository} from "@/entities/fabric-stocks/model/repository.ts";
import {UpdateFabricStockRequestSchema} from "@/shared/models/fabric-stack.ts";
import {FabricStockKeys} from "@/entities/fabric-stocks/model/keys.ts";
import {CreateModelRequestSchema, ModelListResponseSchema, ModelResponseSchema} from "@/shared/models/models.ts";
import {ModelsRepository} from "@/entities/model/model/repository.ts";
import {ModelsKeys} from "@/entities/model/model/keys.ts";

export const useCreateModel = () => (
    useMutation<ModelResponseSchema, DefaultError, CreateModelRequestSchema>({
        mutationFn: (query) => ModelsRepository.createModel(query),
        onMutate: async (newModel) => {
            const prev = queryClient.getQueryData<ModelListResponseSchema>(ModelsKeys.getModels())
            if (prev) {
                queryClient.setQueryData<ModelListResponseSchema, QueryKey>(ModelsKeys.getModels(), (old) => {
                    if (old?.models) {
                        if (!old.models.length) {
                            old.models = [{...newModel, id: 1}]
                        }
                        old.models = [...prev.models, {...newModel, id: prev.models[prev.models.length - 1].id + 1}]
                    }
                    return {...old}
                })
            }
        }
    })
)

export const useUpdateFabricStock = () => {
    return useOptimisticMutation<FabricResponseSchema, DefaultError, UpdateFabricStockRequestSchema & {
        fabric_id: number
    }>({
        mutationFn: ({fabric_id, ...other}) => FabricStockRepository.updateStock(fabric_id, other),
        invalidate: [FabricStockKeys.getFabricsStock()]
    })
}

