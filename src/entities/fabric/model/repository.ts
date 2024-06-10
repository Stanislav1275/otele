import {$api} from "@/shared/lib/axios/instance.tsx";
import {CreateFabricRequestSchema, FabricListResponseSchema, FabricResponseSchema} from "@/shared/models/fabric.ts";

export class FabricRepository {
    public static createFabric = async (query: CreateFabricRequestSchema): Promise<FabricResponseSchema> => {
        //@ts-ignore
        return $api.post<FabricResponseSchema, CreateFabricRequestSchema>('api/fabric', query).then(v => v.data)
    }
    public static getFabricsList = async (): Promise<FabricListResponseSchema> => {
        return $api.get<FabricListResponseSchema>('api/fabric').then(v => v.data)
    }

}
