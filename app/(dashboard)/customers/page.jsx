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
import {Spinner} from "@/components/ui/spinner";
import {toast} from "sonner";
import CustomerPopUp from "./_components/CustomerPopUp";
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

const userTableHeader = ['Name', 'PHONE', 'STATUS', 'ACTIONS']


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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Spinner className="w-10 h-10"/>
                <p className="text-gray-500 font-medium animate-pulse">Fetching your customers...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-red-500 font-medium text-lg">Failed to load customers</p>
                <Button onClick={() => refetch()} variant="outline" className="rounded-xl px-8">Retry Connection</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className={'flex items-center justify-between'}>
                <div className="space-y-1">
                    <h1 className={'text-4xl font-bold font-heading'}>Customer Management</h1>
                    <p className="text-gray-500">Manage your customer relationships and contact details.</p>
                </div>
                <MainButton
                    content={'Add Customer'}
                    Icon={Plus}
                    onClick={handleAdd}
                />
            </div>

            <Card className="overflow-hidden border-gray-100/60 shadow-sm rounded-2xl">
                <div className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className={'w-full relative shadow-sm rounded-xl'}>
                            <Search className={'absolute left-4 top-[50%] -translate-y-1/2 h-5 w-5 text-muted-foreground'}/>
                            <Input
                                className={'pl-11 h-14 rounded-xl text-lg border-gray-100 focus:border-blue-400 transition-all font-medium'}
                                type={'text'}
                                placeholder={'Search a customer by name or phone number'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredCustomers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                            <div className="bg-gray-50 p-6 rounded-full">
                                <Search className="w-12 h-12 text-gray-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">No customers found</h3>
                                <p className="text-gray-500">
                                    {searchQuery ? `We couldn't find any customers matching "${searchQuery}"` : "You haven't added any customers yet."}
                                </p>
                            </div>
                            {searchQuery && (
                                <Button variant="ghost" onClick={() => setSearchQuery("")} className="text-blue-600 hover:bg-blue-50">Clear Search</Button>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-gray-100 overflow-hidden">
                            <Table>
                                <TableHeader className={'bg-gray-50/50'}>
                                    <TableRow className="hover:bg-transparent border-gray-100">
                                        <TableHead className={'px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider'}>Customer Name</TableHead>
                                        <TableHead className={'px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider'}>Phone Number</TableHead>
                                        <TableHead className={'px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider'}>Status</TableHead>
                                        <TableHead className={'px-6 py-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-right'}>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id} className="group hover:bg-gray-50/50 border-gray-100 transition-colors">
                                            <TableCell className={'px-6 py-5'}>
                                                <div className={'flex items-center gap-3'}>
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                                        {customer.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className={'font-bold text-gray-900 text-lg'}>{customer.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className={'px-6 py-5 font-medium text-gray-600'}>
                                                {customer.phone_number || customer.phone || 'N/A'}
                                            </TableCell>
                                            <TableCell className={'px-6 py-5'}>
                                                <span className={cn(
                                                    'px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center',
                                                    customer.status === 'INACTIVE'
                                                        ? 'bg-red-50 text-red-600 border border-red-100'
                                                        : 'bg-green-50 text-green-600 border border-green-100'
                                                )}>
                                                    {customer.status || 'ACTIVE'}
                                                </span>
                                            </TableCell>
                                            <TableCell className={'px-6 py-5'}>
                                                <div className="flex items-center justify-end gap-2 transition-opacity">
                                                    <Button
                                                        onClick={() => handleEdit(customer)}
                                                        className={'bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-4 py-2 rounded-lg font-bold shadow-none transition-all h-auto'}>
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => requestDelete(customer.id)}
                                                        variant="ghost"
                                                        className="p-2 h-auto rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </Card>

            <CustomerPopUp
                open={openCustomerModal}
                onOpenChange={setOpenCustomerModal}
                customer={editingCustomer}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold flex items-center gap-3 text-red-600">
                            <AlertCircle className="w-8 h-8" />
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-lg text-gray-600 pt-2">
                            This action cannot be undone. This will permanently delete the customer from your database and remove their contact history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 pt-6">
                        <AlertDialogCancel className="rounded-xl px-6 py-5 bg-gray-50 border-none text-lg font-medium hover:bg-gray-100 transition-all">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="rounded-xl px-8 py-5 bg-red-600 hover:bg-red-700 text-white text-lg font-bold shadow-lg shadow-red-500/20 transition-all"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Customer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}