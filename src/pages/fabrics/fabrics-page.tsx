import {useFabricsListQuery} from "@/entities/fabric/model/queries.ts";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/shared/ui/table.tsx";
import {Spinner} from "@radix-ui/themes";
import {useCreateFabric} from "@/entities/fabric/model/mutations.ts";
import {Button} from "@/shared/ui/button.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {CreateFabricRequestSchema} from "@/shared/models/fabric.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/shared/ui/form.tsx";
import {Input} from "@/shared/ui/input.tsx";
import {useEffect} from "react";
import {useToast} from "@/shared/ui/use-toast.ts";
import {z} from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {FabrickStocksDataTAble} from "@/features/fabric-stocks/data-table.tsx";

const resolver = z.object({
    width: z.number().min(1).max(100),
    price_per_meter: z.number().min(100).max(100000),
    total_length: z.number().min(10).max(50000),
    name: z.string().min(2).max(50)

} satisfies Record<keyof CreateFabricRequestSchema, any>)
export const FabricsPage = () => {
    const {data: {fabrics = []} = {}, isLoading} = useFabricsListQuery()
    const {mutate, isSuccess, isError} = useCreateFabric()
    const methods = useForm<CreateFabricRequestSchema>({resolver: zodResolver(resolver)})
    const {control, handleSubmit} = methods;
    const {toast} = useToast()
    const onCreate: SubmitHandler<CreateFabricRequestSchema> = (data) => {
        mutate(data);
    }
    useEffect(() => {
        if (isSuccess) {
            toast({variant: 'default', description: 'Ткань создана'});
        }
        if (isError) {
            toast({variant: 'destructive', description: 'Ткань не создана('});

        }
    }, [isSuccess, isError])
    return (
        <div>
            <Table>
                <TableCaption>Список тканей</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">id</TableHead>
                        <TableHead className="w-[100px]">Наименование</TableHead>
                        <TableHead>Ширина</TableHead>
                        <TableHead>Цена за метр(РУБ)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? <Spinner loading={isLoading}/> : null}
                    {fabrics.map((fabric) => (
                        <TableRow key={fabric.id}>
                            <TableCell className="font-medium">{fabric.id}</TableCell>
                            <TableCell className="font-medium">{fabric.name}</TableCell>
                            <TableCell>{fabric.width}</TableCell>
                            <TableCell>{fabric.price_per_meter}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(onCreate, console.log)}>
                <Form {...methods}>
                    <FormField
                        defaultValue=''
                        control={control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Наименование</FormLabel>
                                <FormControl>
                                    <Input placeholder="Шелк" type="text" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        name="name"
                    />
                    <FormField defaultValue={0} control={control} render={({field}) => (
                        <FormItem>
                            <FormLabel>Ширина</FormLabel>
                            <FormControl>
                                <Input datatype='number' autoComplete="on" type="number" {...field} onChange={(e) => {
                                    field.onChange(Number(e.currentTarget.value))
                                }}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} name='width'/>
                    <FormField defaultValue={0} control={control} render={({field}) => (
                        <FormItem>
                            <FormLabel>цена за метр</FormLabel>
                            <FormControl>
                                <Input datatype='number' autoComplete="on" type="number" {...field} onChange={(e) => {
                                    field.onChange(Number(e.currentTarget.value))
                                }}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} name='price_per_meter'/>
                    <FormField defaultValue={0} control={control} render={({field}) => (
                        <FormItem>
                            <FormLabel>Общая длина</FormLabel>
                            <FormControl>
                                <Input autoComplete="on" type="number" {...field} onChange={(e) => {
                                    field.onChange(Number(e.currentTarget.value))
                                }}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )} name='total_length'/>
                    <Button>
                        Создать
                    </Button>
                </Form>
            </form>
            <FabrickStocksDataTAble/>
        </div>

    )
}
