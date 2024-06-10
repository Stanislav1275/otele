import {ReactNode} from 'react';
import {Header} from "@/widgets/Header.tsx";
import {AuthModal} from "@/features/auth/ui/AuthModal.tsx";
import {QueryErrorResetBoundary} from "@tanstack/react-query";
import {Toaster} from "@/shared/ui/toaster.tsx";

export const Layout = ({children}: { children: ReactNode }) => (
    <main className='min-h-screen relative'>
        <Header/>
        <div className='py-2 lg:px-40 px-4'>
            {children}
            <QueryErrorResetBoundary>
                <AuthModal/>
            </QueryErrorResetBoundary>
        </div>
        <Toaster/>

    </main>
);
