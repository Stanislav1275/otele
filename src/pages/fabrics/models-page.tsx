import {useModelsListQuery} from "@/entities/model/model/queries.ts";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/shared/ui/table.tsx";
import {Spinner} from "@radix-ui/themes";
import {useFabricsListQuery} from "@/entities/fabric/model/queries.ts";
import {CreateModelRequestSchema, ModelResponseSchema} from "@/shared/models/models.ts";
import {useEffect} from "react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/shared/ui/form.tsx";
import {Input} from "@/shared/ui/input.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/shared/ui/select.tsx";
import {SelectLabel} from "@radix-ui/react-select";
import {Button} from "@/shared/ui/button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useToast} from "@/shared/ui/use-toast.ts";
import {useCreateModel} from "@/entities/model/model/mutations.ts";
import {z} from "zod";

const resolver = z.object({
    fabric_consumption: z.number(),
    recommended_fabric_id: z.string(),
    name: z.string().min(2).max(50),
    price: z.number().min(0).max(1000000)
} satisfies Record<keyof CreateModelRequestSchema, any>)
export const ModelsPage = () => {
    const {data: {models = []} = {}, isLoading: isModelLoading} = useModelsListQuery();
    const {data: {fabrics = []} = {}} = useFabricsListQuery()
    const {toast} = useToast();
    const {mutate, isSuccess, isError, isPending} = useCreateModel();
    const joinedModels: Array<Omit<ModelResponseSchema, 'recommended_fabric_id'> & {
        id_joined: string
    }> = models.map(({recommended_fabric_id, ...model}) => {
        return {
            ...model,
            id_joined: (fabrics.find(fabric => fabric.id === recommended_fabric_id)?.name + ':' + String(recommended_fabric_id)) || String(recommended_fabric_id)
        }
    })

    const methods = useForm<CreateModelRequestSchema>({resolver: zodResolver(resolver)});
    const {control, handleSubmit} = methods;
    const onCreate: SubmitHandler<CreateModelRequestSchema> = (data) => {
        mutate(data)
    }
    useEffect(() => {
        if (isSuccess) {
            toast({variant: 'default', description: 'Успешно создана модель'});

        }
        if (isError) {
            toast({variant: 'destructive', description: 'Ошибка при создании модели'});

        }
    }, [isSuccess, isError])
    return <div>
        <Table>
            <TableCaption>Список моделей</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">id</TableHead>
                    <TableHead className="w-[100px]">Наименование</TableHead>
                    <TableHead>Цена</TableHead>
                    <TableHead>Колво ткани</TableHead>
                    <TableHead>Рекомендуемая ткань</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isModelLoading ? <Spinner loading={isModelLoading}/> : null}
                {joinedModels.map((model) => (
                    <TableRow key={model.id}>
                        <TableCell className="font-medium">{model.id}</TableCell>
                        <TableCell className="font-medium">{model.name}</TableCell>
                        <TableCell className="font-medium">{model.price}</TableCell>
                        <TableCell>{model.fabric_consumption}</TableCell>
                        <TableCell>{model.id_joined}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
        <div>
            <form onSubmit={handleSubmit(onCreate)}>
                <Form {...methods}>
                    <FormField
                        control={control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Наименование</FormLabel>
                                <FormControl>
                                    <Input placeholder="Костюмчик" type="text" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="name"
                    />
                    <FormField
                        control={control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Необходимое колво ткани</FormLabel>
                                <FormControl>
                                    <Input placeholder="10м" type="number" {...field} onChange={e => {
                                        field.onChange(Number(e.currentTarget.value))
                                    }}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="fabric_consumption"
                    />
                    <FormField
                        control={control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Цена в рублях</FormLabel>
                                <FormControl>
                                    <Input placeholder="0Р" type="number" {...field} onChange={e => {
                                        field.onChange(Number(e.currentTarget.value))
                                    }}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="price"
                    />
                    <FormField
                        control={control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Рекомендуемая ткань</FormLabel>
                                <FormControl>

                                    <Select onValueChange={(value) => {
                                        field.onChange(value)
                                    }} {...field} name='recommended_fabric_id'>
                                        <SelectTrigger>
                                            <SelectValue placeholder='выберите ткань'/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Ткани
                                                </SelectLabel>
                                                {fabrics.map(fabric => (
                                                    <SelectItem value={String(fabric.id)}>{fabric.name}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="recommended_fabric_id"
                    />
                    <Button disabled={isPending} loading={isPending}>Создать</Button>
                </Form>
            </form>

        </div>
    </div>

}
