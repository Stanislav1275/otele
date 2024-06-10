import {QueryClientProvider} from "@tanstack/react-query";
import {ReactNode} from "react";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {queryClient} from "@/shared/lib/query";

export const Providers = ({children}: { children: ReactNode }) => {


    return (
        //@ts-expect-error
        <QueryClientProvider contextSharing client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}/>

        </QueryClientProvider>
    )
}
