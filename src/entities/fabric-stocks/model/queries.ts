import {useQuery} from "@tanstack/react-query";
import {FabricStockKeys} from "@/entities/fabric-stocks/model/keys.ts";
import {FabricStockRepository} from "@/entities/fabric-stocks/model/repository.ts";

export const useFabricsStockListQuery = () => {
    return useQuery({
        queryFn: () => {
            return FabricStockRepository.getFabricsStocksList()
        }, queryKey: FabricStockKeys.getFabricsStock()
    })
}
