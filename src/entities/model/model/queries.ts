import {useQuery} from "@tanstack/react-query";
import {ModelsRepository} from "@/entities/model/model/repository.ts";
import {ModelsKeys} from "@/entities/model/model/keys.ts";

export const useModelsListQuery = () => {
    return useQuery({
        queryFn: () => {
            return ModelsRepository.getModels()
        }, queryKey: ModelsKeys.getModels()
    })
}
