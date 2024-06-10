import {$api} from "@/shared/lib/axios/instance.tsx";
import {CreateModelRequestSchema, ModelListResponseSchema, ModelResponseSchema} from "@/shared/models/models.ts";

export class ModelsRepository {
    public static createModel = async (query: CreateModelRequestSchema): Promise<ModelResponseSchema> => {
        //@ts-ignore
        return $api.post<ModelResponseSchema, CreateModelRequestSchema>(`api/model`, query).then(v => v.data)
    }
    public static getModels = async (): Promise<ModelListResponseSchema> => {
        return $api.get<ModelListResponseSchema>('api/model').then(v => v.data)
    }

}
