import {useFabricsStockListQuery} from "@/entities/fabric-stocks/model/queries.ts";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/shared/ui/table.tsx";
import {Input} from "@/shared/ui/input.tsx";
import {Button} from "@/shared/ui/button.tsx";
import {useUpdateFabricStock} from "@/entities/fabric-stocks/model/mutations.ts";
import {useToast} from "@/shared/ui/use-toast.ts";
import {FabricStockResponseSchema, UpdateFabricStockRequestSchema} from "@/shared/models/fabric-stack.ts";
import {z} from 'zod';
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/shared/ui/form.tsx";
import {useForm} from "react-hook-form";
import {Dialog, DialogContent, DialogTrigger} from "@/shared/ui/dialog.tsx";
import {useEffect} from "react";
import {zodResolver} from "@hookform/resolvers/zod";

const Resolver = z.object({
    total_length: z.number()
})
const UpdateInput = ({stock}: { stock: FabricStockResponseSchema }) => {
    const form = useForm<UpdateFabricStockRequestSchema>({
        defaultValues: {
            total_length: stock.total_length
        },
        resolver: zodResolver(Resolver)
    })
    const {toast} = useToast()

    const {control, handleSubmit} = form;
    const {mutate, isError, isSuccess} = useUpdateFabricStock();

    const update = (data) => {
        mutate({fabric_id: stock.fabric_id, total_length: data.total_length})
    }
    useEffect(() => {
        if (isError) {
            toast({variant: 'destructive', description: `Неудача`});

        }
        if (isSuccess) {
            toast({variant: 'default', description: `Успех`});

        }
    }, [isError, isSuccess])
    return (
        <form onSubmit={handleSubmit(update)}>
            <Form {...form}>
                <FormField
                    control={control}
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Input datatype='number' autoComplete="on" type="number" {...field}
                                       onChange={(e) => {
                                           field.onChange(Number(e.currentTarget.value))
                                       }}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    name="total_length"
                />

                <Button>
                    Отправить
                </Button>
            </Form>
        </form>
    )
}
export const FabrickStocksDataTAble = () => {
    const {data: {fabric_stocks = []} = {}} = useFabricsStockListQuery();

    return (
        <Table>
            <TableCaption>Список тканей</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">id</TableHead>
                    <TableHead className="w-[100px]">id ткани</TableHead>
                    <TableHead>Текущая длина</TableHead>
                    <TableHead>Изменить</TableHead>
                </TableRow>
            </TableHeader>
            {/*    <UpdateInput stock={fabric_stock} mutate={mutate}/>*/}

            <TableBody>

                {fabric_stocks?.map((fabric_stock) => (
                    <TableRow key={fabric_stock.id}>
                        <TableCell className="font-medium">{fabric_stock.id}</TableCell>
                        <TableCell>{fabric_stock.fabric_id}</TableCell>
                        <TableCell>
                            {fabric_stock.total_length}
                        </TableCell>
                        <TableCell>
                            <Dialog>
                                <DialogTrigger>
                                    <Button>
                                        Редактировать
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <UpdateInput stock={fabric_stock}/>
                                </DialogContent>
                            </Dialog>

                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
    )
}
