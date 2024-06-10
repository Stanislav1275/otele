import {Dialog, DialogContent, DialogHeader, DialogTrigger} from '@/shared/ui/dialog';
import {lazy, ReactNode, Suspense} from 'react';
import {TabsList} from '@radix-ui/react-tabs';
import {Tabs, TabsContent, TabsTrigger} from '@/shared/ui/tabs';
import {useAuthModal} from "@/entities/client/queries.ts";
import {AuthFormSkeleton} from "@/features/auth/ui/AuthForm.tsx";
import {RegisterFormSkeleton} from "@/features/auth/ui/RegisterForm.tsx";

const RegisterForm = lazy(() => import(/*RegisterFOrm*/ './RegisterForm').then(({RegisterForm}) => ({default: RegisterForm})))
const AuthForm = lazy(() => import(/*RegisterFOrm*/ './AuthForm').then(({AuthForm}) => ({default: AuthForm})))
export const AuthModal = ({trigger}: { trigger?: ReactNode }) => {
    const [open, setOpen] = useAuthModal();
    if (!open) return null;

    return (
        <Dialog modal open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <Tabs className="w-full" defaultValue="signin">
                    <DialogHeader>
                        <TabsList className="grid m-auto grid-cols-2 bg-muted p-1 rounded-lg">
                            <TabsTrigger value="signin">Войти</TabsTrigger>
                            <TabsTrigger value="signup">Новый аккаунт</TabsTrigger>
                        </TabsList>
                    </DialogHeader>

                    <TabsContent value="signin">
                        <Suspense fallback={<AuthFormSkeleton/>}>
                            <AuthForm/>
                        </Suspense>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Suspense fallback={<RegisterFormSkeleton/>}>
                            <RegisterForm/>
                        </Suspense>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
