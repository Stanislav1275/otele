import {Button} from '@/shared/ui/button';
import {Spinner} from '@radix-ui/themes';
import {useAuthModal, useCurrentUser} from "@/entities/client/queries.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger} from "@/shared/ui/dropdown-menu.tsx";
import {Lead} from "@/shared/ui/typography.tsx";
import {logout} from "@/entities/client/mutations.ts";
import {Link} from "react-router-dom";

const AuthButton = () => {
    const [_, setOpen] = useAuthModal()
    return <Button onClick={() => {
        setOpen(v => !v)
    }}>Войти</Button>
};
const AccountWrapper = () => {
    const {data: user, isLoading} = useCurrentUser()
    if (isLoading) return <Spinner loading={isLoading}/>
    if (!user && !isLoading) return <AuthButton/>

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <Button asChild className="cursor-pointer">
                    <div>{user?.first_name}</div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div>
                    <Lead>
                        {user?.last_name}
                    </Lead>
                    <Button onClick={async () => {
                        await logout()
                    }}>
                        Выйти
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );

};

export function Header() {

    return (
        <header
            className="py-2  px-4 sticky top-0 z-50 w-full border-border/40 bg-secondary/95 backdrop-blur supports-[backdrop-filter]:bg-secondary/60">
            <div className="px-4 flex h-14 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button size="icon" className="text-foreground" variant="ghost" asChild>
                        <Link to="/">
                            аТЕЛЬЕ
                        </Link>
                    </Button>

                    <Button asChild>
                        <Link className="hover:underline" to="/fabric">
                            Ткани
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link className="hover:underline" to="/models">
                            Модели
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link className="hover:underline" to="/orders">
                            Заказы
                        </Link>
                    </Button>
                    {/*<HeaderNavigation />*/}
                </div>

                <AccountWrapper/>
            </div>
        </header>
    );
}
