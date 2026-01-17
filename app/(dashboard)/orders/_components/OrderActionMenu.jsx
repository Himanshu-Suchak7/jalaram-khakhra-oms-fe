import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuPortal,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {
    CreditCard,
    MoreVertical,
    Pencil,
    RefreshCcw,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock, PackageCheck, Ban
} from "lucide-react";
import Link from "next/link";

export default function OrderActionMenu({order}) {
    const orderId = order.id ?? order.orderId?.replace("#", "");
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'icon'}>
                    <MoreVertical className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                    <Link href={`/orders/${orderId}/edit-order`}>
                        <Pencil className="mr-2 h-4 w-4"/>
                        Edit Order
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <RefreshCcw className="mr-2 h-4 w-4"/>
                        Change Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem className={'text-green-500 focus:bg-green-100 focus:text-green-500 font-medium flex items-center gap-1'}><PackageCheck className={'text-green-500 w-4 h-4'}/> FULFILLED</DropdownMenuItem>
                            <DropdownMenuItem className={'text-orange-500 focus:bg-orange-100 focus:text-orange-500 font-medium flex items-center gap-1'}><Clock className={'text-orange-500 w-4 h-4'}/> PENDING</DropdownMenuItem>
                            <DropdownMenuItem className={'text-red-500 focus:bg-red-100 focus:text-red-500 font-medium flex items-center gap-1'}><Ban className={'text-red-500 w-4 h-4'}/> CANCELLED</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <CreditCard className="mr-2 h-4 w-4"/>
                        Change Payment Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem className={'text-green-500 focus:bg-green-100 focus:text-green-500 font-medium flex items-center gap-1'}><CheckCircle className={'text-green-500 w-4 h-4'}/> PAID</DropdownMenuItem>
                            <DropdownMenuItem className={'text-orange-500 focus:bg-orange-100 focus:text-orange-500 font-medium flex items-center gap-1'}><AlertCircle className={'text-orange-500 w-4 h-4'}/> PARTIAL</DropdownMenuItem>
                            <DropdownMenuItem className={'text-red-500 focus:bg-red-100 focus:text-red-500 font-medium flex items-center gap-1'}><XCircle className={'text-red-500 w-4 h-4'}/> UNPAID</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator/>

                <DropdownMenuItem className="text-red-600 focus:bg-red-100 focus:text-red-600 hover:bg-red-100">
                    <Trash2 className="mr-2 h-4 w-4 text-red-600"/>
                    Delete Order
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}