import {ReactNode} from "react";
import {useCurrentUser} from "@/entities/client/queries.ts";
import {Loader} from "lucide-react";
import {EmptyView} from "@/shared/ui/empty-view.tsx";

export const PrivateRouter = ({children}: { children: ReactNode }) => {
    const {data: user, isLoading} = useCurrentUser()
    if (isLoading) return <Loader/>;
    if (!user && !isLoading) return <EmptyView text='Недостаточно прав'/>;
    return <>
        {children}
    </>
}
