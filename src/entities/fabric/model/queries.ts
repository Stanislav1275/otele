import {useQuery} from "@tanstack/react-query";
import {FabricKeys} from "@/entities/fabric/model/keys.ts";
import {FabricRepository} from "@/entities/fabric/model/repository.ts";

export const useFabricsListQuery = () => {
    return useQuery({
        queryFn: () => {
            return FabricRepository.getFabricsList()
        }, queryKey: FabricKeys.getFabrics()
    })
}
