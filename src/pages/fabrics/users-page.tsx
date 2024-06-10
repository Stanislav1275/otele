import {useClientsQuery} from "@/entities/client/queries.ts";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/shared/ui/table.tsx";

export const UsersPage = () => {
    const {data: {clients = []} = {}} = useClientsQuery();
    return <Table>
        <TableCaption>Список юзеров</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[100px]">id</TableHead>
                <TableHead className="w-[100px]">ФИО</TableHead>
            </TableRow>
        </TableHeader>

        <TableBody>
            {clients?.map(client => (
                <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.id}</TableCell>
                    <TableCell className="font-medium">{client.first_name}</TableCell>
                </TableRow>
            ))}

        </TableBody>

    </Table>
}
