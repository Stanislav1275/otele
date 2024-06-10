import {SubmitHandler, useForm} from 'react-hook-form';
import {z} from 'zod';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/shared/ui/form';
import {Input} from '@/shared/ui/input';
import {zodResolver} from '@hookform/resolvers/zod';
import {Skeleton} from '@/shared/ui/skeleton';
import {useToast} from '@/shared/ui/use-toast';
import {Button} from '@/shared/ui/button';
import {useDeferredValue} from 'react';
import axios from 'axios';
import {revalidateAuth} from '@/shared/lib/query';
import {useSingIn} from "@/entities/client/mutations.ts";
import {useAuthModal} from "@/entities/client/queries.ts";
import {ClientAuthSchema} from "@/features/auth/model/schema.ts";

type SchemaClient = z.infer<typeof ClientAuthSchema>;
export const AuthForm = () => {
    const [, setOpen] = useAuthModal();
    const methods = useForm<SchemaClient>({
        resolver: zodResolver(ClientAuthSchema),
        defaultValues: {first_name: '', last_name: ''},
    });
    const {
        control,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;
    const {toast} = useToast();
    const {mutateAsync} = useSingIn()
    const onSubmit: SubmitHandler<SchemaClient> = async (data) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {...signInData} = data;
            await mutateAsync(signInData)
            toast({variant: 'default', description: 'Авторизация прошла успешна'});
            await revalidateAuth();
            setOpen(false);
        } catch (e) {
            if (axios.isAxiosError(e)) {
                toast({variant: 'destructive', description: `Ошибка сервера: ${e?.response?.data?.message || '\n'}`});
            } else {
                console.log({e})
                //@ts-expect-error
                if (e?.['message']) {
                    const error = e as { message: string }
                    toast({variant: 'destructive', description: `Ошибка сервера: ${error.message || '\n'}`});

                }
                throw e;
            }
        }
    };
    const isSubmittingDeffered = useDeferredValue(isSubmitting);
    return (
        <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-2 justify-between ">
                <div className="space-y-2">
                    <FormField
                        control={control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Имя</FormLabel>
                                <FormControl>
                                    <Input autoComplete="on" placeholder="cocktail" type="text" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="first_name"
                    />
                    <FormField
                        control={control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input autoComplete="on" placeholder="пароль" type="password" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="last_name"
                    />
                </div>

                <Button className="w-full" type="submit" loading={isSubmittingDeffered}>
                    Войти
                </Button>
            </form>
        </Form>
    );
};
export const AuthFormSkeleton = () => (
    <div className="flex flex-col space-y-8">
        <div>
            <Skeleton className="w-[100px] h-4 rounded-full mb-1"/>
            <Skeleton className="w-full h-9 rounded-full"/>
        </div>
        <div>
            <Skeleton className="w-[100px] h-4 rounded-full mb-1"/>
            <Skeleton className="w-full h-9 rounded-full"/>
        </div>
        <Skeleton className="w-[177px] self-start h-9 rounded-full"/>
    </div>
);
