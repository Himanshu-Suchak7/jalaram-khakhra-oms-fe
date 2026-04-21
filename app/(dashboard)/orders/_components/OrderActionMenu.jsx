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
import { updateOrderStatus } from "@/lib/orders";
import { toast } from "sonner"; // Assuming sonner is used for notifications or use simple alert

export default function OrderActionMenu({order, onMutation}) {
    const orderId = order.id || order.order_id;

    const handleChangeStatus = async (status) => {
        try {
            await updateOrderStatus(orderId, status);
            toast.success(`Order status updated to ${status}`);
            if (onMutation) onMutation();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'icon'} className="cursor-pointer">
                    <MoreVertical className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/orders/${orderId}/invoice`}>
                        <Pencil className="mr-2 h-4 w-4"/>
                        View Invoice
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                        <RefreshCcw className="mr-2 h-4 w-4"/>
                        Change Status
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem 
                                onClick={() => handleChangeStatus("FULFILLED")}
                                className={'cursor-pointer text-green-500 focus:bg-green-100 focus:text-green-500 font-medium flex items-center gap-1'}
                            >
                                <PackageCheck className={'text-green-500 w-4 h-4'}/> FULFILLED
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handleChangeStatus("PENDING")}
                                className={'cursor-pointer text-orange-500 focus:bg-orange-100 focus:text-orange-500 font-medium flex items-center gap-1'}
                            >
                                <Clock className={'text-orange-500 w-4 h-4'}/> PENDING
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handleChangeStatus("CANCELLED")}
                                className={'cursor-pointer text-red-500 focus:bg-red-100 focus:text-red-500 font-medium flex items-center gap-1'}
                            >
                                <Ban className={'text-red-500 w-4 h-4'}/> CANCELLED
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator/>

                <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-100 focus:text-red-600 hover:bg-red-100">
                    <Trash2 className="mr-2 h-4 w-4 text-red-600"/>
                    Delete Order
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}