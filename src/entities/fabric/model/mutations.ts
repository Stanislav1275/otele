import {DefaultError, QueryKey, useMutation} from "@tanstack/react-query";
import {FabricRepository} from "@/entities/fabric/model/repository.ts";
import {CreateFabricRequestSchema, FabricListResponseSchema, FabricResponseSchema} from "@/shared/models/fabric.ts";
import {queryClient} from "@/shared/lib/query";
import {FabricKeys} from "@/entities/fabric/model/keys.ts";

export function generateRandom(min = 0, max = 100) {

    // find diff
    const difference = max - min;

    // generate random number
    let rand = Math.random();

    // multiply with difference
    rand = Math.floor(rand * difference);

    // add with min value
    rand = rand + min;

    return rand;
}

export const useCreateFabric = () => (
    useMutation<FabricResponseSchema, DefaultError, CreateFabricRequestSchema>({
        mutationFn: (query) => FabricRepository.createFabric(query),
        onMutate: async (newFabric) => {
            const prev = queryClient.getQueryData(FabricKeys.getFabrics());
            if (prev) {
                queryClient.setQueryData<FabricListResponseSchema, QueryKey>(FabricKeys.getFabrics(), (old) => {
                    if (old?.fabrics) {
                        //@ts-ignore
                        old.fabrics = [...old.fabrics, {...newFabric, id: old.fabrics[old.fabrics.length - 1].id + 1}]
                    }
                    return {...old}
                })
            }

        }
    })
)
