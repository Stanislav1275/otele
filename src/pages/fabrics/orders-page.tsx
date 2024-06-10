import {useOrdersListQuery} from "@/entities/order/model/queries.ts";
import {AbstractList} from "@/shared/ui/abstract-list.tsx";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/shared/ui/table.tsx";
import {Fragment, useEffect} from "react";
import {Button} from "@/shared/ui/button.tsx";
import {Dialog, DialogContent, DialogTrigger} from "@/shared/ui/dialog.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from 'zod';
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/shared/ui/form.tsx";
import {useClientsQuery} from "@/entities/client/queries.ts";
import {useFabricsListQuery} from "@/entities/fabric/model/queries.ts";
import {useModelsListQuery} from "@/entities/model/model/queries.ts";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/shared/ui/select.tsx";
import {SelectLabel} from "@radix-ui/react-select";
import {DateTimePicker} from "@/shared/ui/date-time-picker.tsx";
import {useCreateOrder, useUpdateOrder} from "@/entities/order/model/mutations.ts";
import {useToast} from "@/shared/ui/use-toast.ts";
import {Input} from "@/shared/ui/input.tsx";
import {UpdateOrderRequestSchema} from "@/shared/models/orders.ts";
import {Switch} from "@/shared/ui/switch.tsx";

function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // месяцы начинаются с 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

const resolver = z.object({
    client_id: z.string(),
    fabric_id: z.string(),
    model_id: z.string(),
    fitting_date: z.date(),
    order_date: z.date(),
    tailor_name: z.string().min(2).max(50),


})
const updateResolver = z.object({
    is_completed: z.boolean().default(false),
    completion_date: z.date().optional().nullable(),
}).refine(data => {
    // Если is_completed true, то completion_date должен быть обязательным и не null
    if (data.is_completed && !data.completion_date) {
        return false;
    }
    // Если указана дата завершения, то is_completed должен быть true
    if (data.completion_date && !data.is_completed) {
        return false;
    }
    return true;
}, {
    message: "Если is_completed равно true, completion_date должно быть задано. Если указана completion_date, is_completed не может быть false",
    path: ["completion_date"], // Указываем поле, к которому относится ошибка
});
export const OrdersPage = () => {
    const {data: {orders = []} = {}, isLoading} = useOrdersListQuery();
    const {data: {clients = []} = {}} = useClientsQuery();
    const {data: {fabrics = []} = {}} = useFabricsListQuery();
    const {data: {models = []} = {}} = useModelsListQuery();
    const {mutate, isError, isPending, isSuccess} = useCreateOrder()
    const {toast} = useToast();
    const methods = useForm<z.infer<typeof resolver>>({resolver: zodResolver(resolver)})

    const {
        mutate: updateOrder,
        isSuccess: isUpDateSuccess,
        isPending: isUpdatePending,
        isError: isUpdateError
    } = useUpdateOrder()
    const update = (id: number): SubmitHandler<z.infer<typeof updateResolver>> => (data) => {
        const newData = {
            ...data,
            id,
            completion_date: data?.completion_date?.toISOString()?.slice(0, 19) ?? null
        } satisfies UpdateOrderRequestSchema & { id: number };
        updateOrder(newData)
    }
    const {control, handleSubmit} = methods;
    const onCreate: SubmitHandler<z.infer<typeof resolver>> = (data) => {
        const newDate = {
            ...data,
            order_date: data.order_date.toISOString().slice(0, 19),
            fitting_date: data.fitting_date.toISOString().slice(0, 19)
        };
        //@ts-ignore
        mutate(newDate)

    }
    useEffect(() => {
        if (isError || isUpdateError) {
            toast({variant: 'destructive', description: `Неудача`});

        }
        if (isSuccess || isUpDateSuccess) {
            toast({variant: 'default', description: `Успех`});

        }
    }, [isError, isSuccess, isUpdateError, isUpDateSuccess])

    return <div>
        <Dialog>
            <DialogTrigger>

                <Button disabled={isPending} loading={isPending}>
                    Создать заказ

                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit(onCreate)}>
                    <Form {...methods}>
                        <FormField
                            control={control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>ФИО ЗАКРОЙЩИКА</FormLabel>
                                    <FormControl>
                                        <Input autoComplete="on" placeholder="Андрей Олегович" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name="tailor_name"
                        />
                        <FormField
                            control={control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Клиент</FormLabel>
                                    <FormControl>

                                        <Select onValueChange={(value) => {
                                            field.onChange(value)
                                        }} {...field} name='client_id'>
                                            <SelectTrigger>
                                                <SelectValue placeholder='выберите клиента'/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Клиенты
                                                    </SelectLabel>
                                                    {clients.map(client => (
                                                        <SelectItem
                                                            value={String(client.id)}>{client.first_name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name="client_id"
                        />
                        <FormField
                            control={control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Модель</FormLabel>
                                    <FormControl>

                                        <Select onValueChange={(value) => {
                                            field.onChange(value)
                                        }} {...field} name='model_id'>
                                            <SelectTrigger>
                                                <SelectValue placeholder='выберите модель'/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Модели
                                                    </SelectLabel>
                                                    {models.map(model => (
                                                        <SelectItem
                                                            value={String(model.id)}>{`${model.name}_${model.price + 'руб'}_${model.fabric_consumption + 'ткани'}_${fabrics.find(v => v.id === model.recommended_fabric_id)?.name || ''}`}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name="model_id"
                        />
                        <FormField
                            control={control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Ткань</FormLabel>
                                    <FormControl>

                                        <Select onValueChange={(value) => {
                                            field.onChange(value)
                                        }} {...field} name='fabric_id'>
                                            <SelectTrigger>
                                                <SelectValue placeholder='выберите ткань'/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Модели
                                                    </SelectLabel>
                                                    {fabrics.map(fabric => (
                                                        <SelectItem
                                                            value={String(fabric.id)}>{`${fabric.name} ${fabric.price_per_meter + ' руб/метр'}`}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name="fabric_id"
                        />
                        <FormField
                            control={control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Дата заказа</FormLabel>
                                    <FormControl>

                                        <DateTimePicker jsDate={field.value} onJsDateChange={field.onChange}
                                                        showClearButton granularity="second" hourCycle={24}
                                        />

                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name="order_date"
                        />
                        <FormField
                            control={control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Дата примерки</FormLabel>
                                    <FormControl>

                                        <DateTimePicker jsDate={field.value} onJsDateChange={field.onChange}
                                                        showClearButton granularity="second" hourCycle={24}
                                        />

                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            name="fitting_date"
                        />
                        <Button disabled={isPending} loading={isPending}>
                            Создать
                        </Button>
                    </Form>

                </form>
            </DialogContent>
        </Dialog>

        <Table>
            <TableCaption>Список заказов</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">id</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Модель</TableHead>
                    <TableHead>Ткань</TableHead>
                    <TableHead>Закройщик</TableHead>
                    <TableHead>Дата заказа</TableHead>
                    <TableHead>Дата примерки</TableHead>
                    <TableHead>Выполнен?</TableHead>
                    <TableHead>Дата выполнения</TableHead>
                    <TableHead>Действия</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <AbstractList component={Fragment} data={orders} maxItems={15} isLoading={isLoading}
                              disableEmptyView={isLoading}
                              renderItem={(order, index) => (
                                  <TableRow key={order.id}>
                                      <TableCell className="font-medium">{order.id}</TableCell>
                                      <TableCell
                                          className="font-medium">{clients.find(v => v.id === order.client_id)?.first_name || order.client_id}</TableCell>
                                      <TableCell
                                          className="font-medium">{models.find(v => v.id === order.model_id)?.name || order.model_id}</TableCell>
                                      <TableCell
                                          className="font-medium">{fabrics.find(v => v.id === order.fabric_id)?.name || order.fabric_id}</TableCell>
                                      <TableCell className="font-medium">{order.tailor_name}</TableCell>
                                      <TableCell
                                          className="font-medium">{formatDate(new Date(order.order_date))}</TableCell>
                                      <TableCell
                                          className="font-medium">{formatDate(new Date(order.fitting_date))}</TableCell>
                                      <TableCell className="font-medium">{order.is_completed ? 'Да' : 'Нет'}</TableCell>
                                      <TableCell
                                          className="font-medium">{order.completion_date ? formatDate(new Date(order.completion_date)) : '-'}</TableCell>
                                      <TableCell className="font-medium">
                                          <Dialog>
                                              <DialogTrigger>
                                                  <Button>
                                                      Редактировать
                                                  </Button>
                                              </DialogTrigger>
                                              <DialogContent>

                                                  <UpdateForm update={update}
                                                              order={order}
                                                              isUpdatePending={isUpdatePending}/>
                                              </DialogContent>
                                          </Dialog>

                                      </TableCell>

                                  </TableRow>
                              )}/>

            </TableBody>

        </Table>

    </div>
}
const UpdateForm = ({update, order, isUpdatePending}) => {
    // useEffect(() => {
    //     reset(order)
    // }, [])
    const upMethods = useForm<z.infer<typeof updateResolver>>({
        resolver: zodResolver(updateResolver), defaultValues: {
            is_completed: order.is_completed,
            completion_date: order.completion_date ? new Date(order.completion_date) : null
        }
    })
    const {control: upControl, handleSubmit: upHandleSubmit, reset} = upMethods;
    return (
        <form onSubmit={upHandleSubmit(update(order.id))}>
            <Form {...upMethods}>
                <FormField
                    control={upControl}
                    name="is_completed"
                    render={({field}) => (
                        <FormItem
                        >
                            <FormLabel>Выполнен?</FormLabel>

                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage/>

                        </FormItem>
                    )}
                />
                <FormField
                    control={upControl}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Дата выполнения</FormLabel>
                            <FormControl>

                                <DateTimePicker jsDate={field.value}
                                                onJsDateChange={field.onChange}
                                                showClearButton
                                                granularity="second"
                                                hourCycle={24}
                                />

                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    name="completion_date"
                />
                <Button loading={isUpdatePending}>
                    Принять
                </Button>
            </Form>
        </form>
    )
}
