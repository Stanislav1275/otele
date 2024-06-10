import {$api} from "@/shared/lib/axios/instance.tsx";
import {FabricResponseSchema} from "@/shared/models/fabric.ts";
import {FabricStockListResponseSchema, UpdateFabricStockRequestSchema} from "@/shared/models/fabric-stack.ts";

export class FabricStockRepository {
    public static updateStock = async (fabricId: number, query: UpdateFabricStockRequestSchema): Promise<FabricResponseSchema> => {
        //@ts-ignore
        return $api.patch<FabricResponseSchema, UpdateFabricStockRequestSchema>(`api/fabric_stock/${fabricId}`, query).then(v => v.data)
    }
    public static getFabricsStocksList = async (): Promise<FabricStockListResponseSchema> => {
        return $api.get<FabricStockListResponseSchema>('api/fabric_stock').then(v => v.data)
    }

}
