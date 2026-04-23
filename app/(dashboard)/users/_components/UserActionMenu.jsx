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

export default function UserActionMenu({user, onChangePassword, onUpdateRole, onDelete}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'icon'}>
                    <MoreVertical className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border p-2">
                <DropdownMenuItem onClick={() => onChangePassword(user)} className="rounded-lg py-2.5 cursor-pointer">
                    <KeyRound className="mr-2 h-4 w-4 text-muted-foreground"/>
                    <span className="font-medium">Change Password</span>
                </DropdownMenuItem>
                
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="rounded-lg py-2.5 cursor-pointer">
                        <RefreshCcw className="mr-2 h-4 w-4 text-muted-foreground"/>
                        <span className="font-medium">Update User Role</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent className="rounded-xl p-1.5 shadow-xl border-border min-w-[120px]">
                            <DropdownMenuItem
                                onClick={() => onUpdateRole(user, "admin")}
                                className={cn('rounded-lg py-2 cursor-pointer font-bold gap-2', 
                                    user.role === 'admin' ? 'bg-blue-50 text-blue-700' : 'text-muted-foreground'
                                )}>
                                <ShieldCheck className={cn('w-4 h-4', user.role === 'admin' ? 'text-blue-600' : 'text-gray-400')}/> 
                                ADMIN
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onUpdateRole(user, "user")}
                                className={cn('rounded-lg py-2 cursor-pointer font-bold gap-2', 
                                    user.role === 'user' ? 'bg-muted/50 text-foreground' : 'text-muted-foreground'
                                )}>
                                <User className={cn('w-4 h-4', user.role === 'user' ? 'text-muted-foreground' : 'text-gray-400')}/> 
                                USER
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator className="my-1.5 bg-muted/50" />

                <DropdownMenuItem 
                    onClick={() => onDelete(user.id)}
                    className="text-red-500 focus:bg-red-50 focus:text-red-600 hover:bg-red-50 rounded-lg py-2.5 cursor-pointer font-medium"
                >
                    <Trash2 className="mr-2 h-4 w-4 text-red-500"/>
                    Delete User
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

import {cn} from "@/lib/utils";