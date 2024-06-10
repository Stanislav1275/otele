import {z} from 'zod';
import {ClientResponseSchema} from "@/shared/models/client.ts";

export const ClientAuthSchema = z.object({
    first_name: z.string().min(2, {message: 'Слишком короткое ФИО'}).max(50, {message: 'Имя должен быть меньше 100 символов'}),
    last_name: z
        .string()
        .min(5, {message: 'Пароль должен быть более длиннее 4 символов'})
        .regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/, {message: 'Пароль должен состоять из латинских букв и иметь хотя бы один спец.символ:@$@%&&*'}),
} satisfies Record<keyof ClientResponseSchema & 'password', never>);
export const ClientRegisterFormSchema = ClientAuthSchema.extend({
    confirmPassword: z.string().min(5),
}).refine((data) => data.last_name === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
});
