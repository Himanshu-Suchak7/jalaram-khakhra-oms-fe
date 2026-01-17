import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuPortal,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {
    KeyRound,
    MoreVertical,
    RefreshCcw, ShieldCheck,
    Trash2, User,
} from "lucide-react";

export default function UserActionMenu({onChangePassword}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'icon'}>
                    <MoreVertical className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onChangePassword}>
                    <KeyRound className="mr-2 h-4 w-4"/>
                    Change Password
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <RefreshCcw className="mr-2 h-4 w-4"/>
                        Change User Role
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem
                                className={'text-blue-500 focus:bg-blue-100 focus:text-blue-500 font-medium flex items-center gap-1'}>
                                <ShieldCheck className={'text-blue-500 w-4 h-4'}/> ADMIN
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className={'text-gray-500 focus:bg-gray-100 focus:text-gray-500 font-medium flex items-center gap-1'}>
                                <User className={'text-gray-500 w-4 h-4'}/> USER
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator/>

                <DropdownMenuItem className="text-red-600 focus:bg-red-100 focus:text-red-600 hover:bg-red-100">
                    <Trash2 className="mr-2 h-4 w-4 text-red-600"/>
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}