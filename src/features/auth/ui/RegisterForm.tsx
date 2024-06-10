import {SubmitHandler, useForm} from 'react-hook-form';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/shared/ui/form';
import {Input} from '@/shared/ui/input';
import {zodResolver} from '@hookform/resolvers/zod';
import {Skeleton} from '@/shared/ui/skeleton';
import {useToast} from '@/shared/ui/use-toast';
import {Button} from '@/shared/ui/button';
import {useDeferredValue} from 'react';
import axios from 'axios';
import {z} from 'zod';
import {ClientRegisterFormSchema} from "@/features/auth/model/schema.ts";
import {useAuthModal} from "@/entities/client/queries.ts";
import {useSignup} from "@/entities/client/mutations.ts";
import {revalidateAuth} from "@/shared/lib/query";

type SchemaClient = z.infer<typeof ClientRegisterFormSchema>;
export const RegisterForm = () => {
    const [, setOpen] = useAuthModal();
    const methods = useForm<SchemaClient>({
        resolver: zodResolver(ClientRegisterFormSchema),
        defaultValues: {first_name: '', last_name: '', password: '', confirmPassword: ''},
    });
    const {
        control,
        handleSubmit,
        formState: {isSubmitting},
    } = methods;
    const {toast} = useToast();
    const {mutateAsync} = useSignup()
    const onSubmit: SubmitHandler<SchemaClient> = async (data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {confirmPassword, ...signUpData} = data;
        try {
            await mutateAsync(signUpData);
            await revalidateAuth();
            setOpen((v) => !v);
            toast({variant: 'default', description: 'Регистрация прошла успешна'});
        } catch (e) {
            if (axios.isAxiosError(e)) {
                toast({variant: 'destructive', description: `Ошибка сервера: ${e?.response?.data.message}`});
            } else {
                throw e;
            }
        }
    };
    const isSubmittingDeffered = useDeferredValue(isSubmitting);
    return (
        <Form {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Имя</FormLabel>
                            <FormControl>
                                <Input placeholder="cocktail" type="text" {...field} />
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
                                <Input placeholder="пароль" type="password" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    name="last_name"
                />
                <FormField
                    control={control}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Подвердите пароль пароль</FormLabel>
                            <FormControl>
                                <Input placeholder="Пароль ещё раз" type="password" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    name="confirmPassword"
                />

                <Button className="w-full" loading={isSubmittingDeffered}>
                    Зарегистрироваться
                </Button>
            </form>
        </Form>
    );
};
export const RegisterFormSkeleton = () => (
    <div className="flex flex-col space-y-8">
        <div>
            <Skeleton className="w-[100px] h-4 rounded-full mb-1"/>
            <Skeleton className="w-full h-9 rounded-full"/>
        </div>
        <div>
            <Skeleton className="w-[100px] h-4 rounded-full mb-1"/>
            <Skeleton className="w-full h-9 rounded-full"/>
        </div>
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
