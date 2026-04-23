import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuPortal,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import {Button} from "@/components/ui/button";
import {
    CreditCard,
    MoreVertical,
    Pencil,
    RefreshCcw,
    Trash2,
    FileText,
    Clock, PackageCheck, Ban, CheckCircle2, ShieldAlert, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { updateOrderStatus, updatePaymentStatus, deleteOrder } from "@/lib/orders";
import { toast } from "sonner"; // Assuming sonner is used for notifications or use simple alert

export default function OrderActionMenu({order, onMutation}) {
    const orderId = order.id || order.order_id;
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const normalizeStatus = (val) => String(val || "").split(".").pop().toUpperCase();
    const orderStatus = normalizeStatus(order?.order_status);
    const paymentStatus = normalizeStatus(order?.payment_status);
    const isNotesOnly = orderStatus === "FULFILLED" && paymentStatus === "PAID";
    const isStatusLocked = orderStatus === "CANCELLED" || orderStatus === "FULFILLED";
    const isPaymentLocked = paymentStatus === "PAID" || orderStatus === "CANCELLED";

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

    const handlePaymentStatus = async (status) => {
        try {
            await updatePaymentStatus(orderId, status);
            toast.success(`Payment status updated to ${status}`);
            if (onMutation) onMutation();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update payment status");
        }
    };

    const handleDeleteOrder = async () => {
        setIsDeleting(true);
        try {
            await deleteOrder(orderId);
            toast.success("Order deleted successfully");
            setIsDeleteDialogOpen(false);
            if (onMutation) onMutation();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete order");
            setIsDeleting(false);
        }
    };

    return (
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} size={'icon'} className="cursor-pointer">
                    <MoreVertical className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/orders/${orderId}/invoice`}>
                        <FileText className="mr-2 h-4 w-4"/>
                        View Invoice
                    </Link>
                </DropdownMenuItem>
                {orderStatus === "CANCELLED" ? (
                    <DropdownMenuItem
                        disabled
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-not-allowed opacity-60"
                    >
                        <Pencil className="mr-2 h-4 w-4"/>
                        Edit Order (Locked)
                    </DropdownMenuItem>
                ) : isNotesOnly ? (
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/orders/${orderId}/edit`}>
                            <Pencil className="mr-2 h-4 w-4"/>
                            Edit (Notes only)
                        </Link>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/orders/${orderId}/edit`}>
                            <Pencil className="mr-2 h-4 w-4"/>
                            Edit Order
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer" disabled={isStatusLocked}>
                        <RefreshCcw className="mr-2 h-4 w-4"/>
                        {isStatusLocked ? "Change Status (Locked)" : "Change Status"}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem 
                                onClick={() => handleChangeStatus("FULFILLED")}
                                disabled={isStatusLocked || orderStatus === "FULFILLED"}
                                className={'cursor-pointer text-green-500 focus:bg-green-100 focus:text-green-500 font-medium flex items-center gap-1'}
                            >
                                <PackageCheck className={'text-green-500 w-4 h-4'}/> FULFILLED
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handleChangeStatus("PENDING")}
                                disabled={isStatusLocked || orderStatus === "PENDING"}
                                className={'cursor-pointer text-orange-500 focus:bg-orange-100 focus:text-orange-500 font-medium flex items-center gap-1'}
                            >
                                <Clock className={'text-orange-500 w-4 h-4'}/> PENDING
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handleChangeStatus("CANCELLED")}
                                disabled={isStatusLocked || orderStatus === "CANCELLED"}
                                className={'cursor-pointer text-red-500 focus:bg-red-100 focus:text-red-500 font-medium flex items-center gap-1'}
                            >
                                <Ban className={'text-red-500 w-4 h-4'}/> CANCELLED
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer" disabled={isPaymentLocked}>
                        <CreditCard className="mr-2 h-4 w-4"/>
                        {isPaymentLocked ? "Payment Status (Locked)" : "Payment Status"}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem 
                                onClick={() => handlePaymentStatus("PAID")}
                                disabled={isPaymentLocked || paymentStatus === "PAID"}
                                className={'cursor-pointer text-green-500 focus:bg-green-100 focus:text-green-500 font-medium flex items-center gap-1 text-xs'}
                            >
                                <CheckCircle2 className={'text-green-500 w-4 h-4'}/> PAID
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handlePaymentStatus("PARTIAL")}
                                disabled={isPaymentLocked || paymentStatus === "PARTIAL"}
                                className={'cursor-pointer text-orange-500 focus:bg-orange-100 focus:text-orange-500 font-medium flex items-center gap-1 text-xs'}
                            >
                                <Clock className={'text-orange-500 w-4 h-4'}/> PARTIAL
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => handlePaymentStatus("UNPAID")}
                                disabled={isPaymentLocked || paymentStatus === "UNPAID"}
                                className={'cursor-pointer text-red-500 focus:bg-red-100 focus:text-red-500 font-medium flex items-center gap-1 text-xs'}
                            >
                                <ShieldAlert className={'text-red-500 w-4 h-4'}/> UNPAID
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator/>

                <DropdownMenuItem 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="cursor-pointer text-red-600 focus:bg-red-100 focus:text-red-600 hover:bg-red-100"
                >
                    <Trash2 className="mr-2 h-4 w-4 text-red-600"/>
                    Delete Order
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-8 h-8" />
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-lg text-muted-foreground pt-2">
                        This action cannot be undone. This will permanently delete Order #{order.order_number} and all its associated data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3 pt-6">
                    <AlertDialogCancel className="rounded-xl px-6 py-5 bg-muted/50 border-none text-lg font-medium hover:bg-muted transition-all">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteOrder}
                        className="rounded-xl px-8 py-5 bg-red-600 hover:bg-red-700 text-white text-lg font-bold shadow-lg shadow-red-500/20 transition-all"
                    >
                        {isDeleting ? "Deleting..." : "Yes, Delete Order"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    )
}
