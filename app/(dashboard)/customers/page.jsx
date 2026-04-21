'use client';
import MainButton from "@/components/MainButton";
import {Plus, Search, Trash2, AlertCircle} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHeader, TableRow, TableHead} from "@/components/ui/table";
import {useState, useMemo} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getCustomers, deleteCustomer} from "@/lib/customer";
import {useAuth} from "@/lib/auth-context";
import {toast} from "sonner";
import CustomerPopUp from "./_components/CustomerPopUp";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const userTableHeader = ['Customer Name', 'PHONE NUMBER', 'STATUS', 'ACTIONS']

export default function Customers() {
    const {accessToken} = useAuth();
    const queryClient = useQueryClient();
    const [openCustomerModal, setOpenCustomerModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [deletingCustomerId, setDeletingCustomerId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const {
        data: customers = [],
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ["customers", accessToken],
        queryFn: async () => {
            const response = await getCustomers(accessToken);
            return Array.isArray(response) ? response : (response.customers || []);
        },
        enabled: !!accessToken,
    });

    const deleteMutation = useMutation({
        mutationFn: (customerId) => deleteCustomer(accessToken, customerId),
        onSuccess: () => {
            toast.success("Customer deleted successfully");
            setIsDeleteDialogOpen(false);
            setDeletingCustomerId(null);
            queryClient.invalidateQueries({ queryKey: ["customers"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete customer");
        }
    });

    const filteredCustomers = useMemo(() => {
        if (!Array.isArray(customers)) return [];
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone_number?.includes(searchQuery) ||
            customer.phone?.includes(searchQuery)
        );
    }, [customers, searchQuery]);

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setOpenCustomerModal(true);
    };

    const handleAdd = () => {
        setEditingCustomer(null);
        setOpenCustomerModal(true);
    };

    const requestDelete = (customerId) => {
        setDeletingCustomerId(customerId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deletingCustomerId) {
            deleteMutation.mutate(deletingCustomerId);
        }
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-red-500 font-bold text-xl">Failed to load customers</p>
                <Button onClick={() => refetch()} variant="outline" className="rounded-xl px-10 py-7 text-lg">Retry Connection</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className={'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'}>
                <div className="space-y-1">
                    <h1 className={'text-4xl font-bold font-heading'}>Customer Directory</h1>
                    <p className="text-gray-500 font-medium text-lg">Track your client relationships and order history.</p>
                </div>
                <div className="w-full sm:w-auto">
                    <MainButton
                        content={'Register Client'}
                        Icon={Plus}
                        onClick={handleAdd}
                    />
                </div>
            </div>

            <Card className="overflow-hidden border-gray-100/60 shadow-sm rounded-2xl">
                <div className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className={'w-full relative shadow-sm rounded-xl'}>
                            <Search className={'absolute left-4 top-[50%] -translate-y-1/2 h-5 w-5 text-muted-foreground'}/>
                            <Input
                                className={'pl-11 h-14 rounded-xl text-lg border-gray-100 focus:border-blue-400 transition-all font-medium'}
                                type={'text'}
                                placeholder={'Search customers by name or phone...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 overflow-hidden">
                        <Table>
                            <TableHeader className={'bg-gray-50/50'}>
                                <TableRow className="hover:bg-transparent border-gray-100">
                                    {userTableHeader.map((header) => (
                                        <TableHead key={header} className={'px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider'}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Skeleton className="h-12 w-12 rounded-full" />
                                                    <Skeleton className="h-5 w-32" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5"><Skeleton className="h-5 w-24" /></TableCell>
                                            <TableCell className="px-6 py-5"><Skeleton className="h-7 w-20 rounded-full" /></TableCell>
                                            <TableCell className="px-6 py-5 text-right"><Skeleton className="h-10 w-28 ml-auto rounded-lg" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredCustomers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center py-10 text-gray-500 font-medium">
                                            {searchQuery ? `No matches found for "${searchQuery}"` : "No customers registered yet."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id} className="group hover:bg-gray-50/50 border-gray-100 transition-colors">
                                            <TableCell className={'px-6 py-5'}>
                                                <div className={'flex items-center gap-4'}>
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl shadow-sm">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className={'font-bold text-gray-900 text-lg'}>{customer.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className={'px-6 py-5 font-bold text-gray-700'}>
                                                {customer.phone_number || customer.phone || 'N/A'}
                                            </TableCell>
                                            <TableCell className={'px-6 py-5'}>
                                                <span className={cn(
                                                    'px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center tracking-wider',
                                                    customer.status === 'INACTIVE'
                                                        ? 'bg-red-50 text-red-600 border border-red-100'
                                                        : 'bg-green-50 text-green-600 border border-green-100'
                                                )}>
                                                    <span className={cn("w-1.5 h-1.5 rounded-full mr-2", customer.status === 'INACTIVE' ? 'bg-red-600' : 'bg-green-600')}></span>
                                                    {customer.status || 'ACTIVE'}
                                                </span>
                                            </TableCell>
                                            <TableCell className={'px-6 py-5'}>
                                                <div className="flex items-center justify-end gap-3 text-right">
                                                    <Button
                                                        onClick={() => handleEdit(customer)}
                                                        className={'bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-5 py-2.5 rounded-xl font-bold shadow-none transition-all h-auto'}>
                                                        Edit Client
                                                    </Button>
                                                    <Button
                                                        onClick={() => requestDelete(customer.id)}
                                                        variant="ghost"
                                                        className="p-3 h-auto rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                                    >
                                                        <Trash2 className="w-6 h-6" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>

            <CustomerPopUp
                open={openCustomerModal}
                onOpenChange={setOpenCustomerModal}
                customer={editingCustomer}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold flex items-center gap-3 text-red-600">
                            <AlertCircle className="w-10 h-10" />
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xl text-gray-600 pt-3">
                            This action cannot be undone. This will permanently delete the customer from your database and remove their contact history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-4 pt-8">
                        <AlertDialogCancel className="rounded-2xl px-10 py-7 border-none bg-gray-50 text-xl font-bold hover:bg-gray-100 transition-all">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="rounded-2xl px-12 py-7 bg-red-600 hover:bg-red-700 text-white text-xl font-bold shadow-xl shadow-red-500/20 transition-all"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Customer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
