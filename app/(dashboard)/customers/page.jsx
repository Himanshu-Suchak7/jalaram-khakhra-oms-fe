'use client';
import {Plus, Search, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHeader, TableRow, TableHead} from "@/components/ui/table";
import {useState, useMemo} from "react";
import {Button} from "@/components/ui/button";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getCustomers, deleteCustomer} from "@/lib/customer";
import {useAuth} from "@/lib/auth-context";
import {toast} from "sonner";
import CustomerPopUp from "./_components/CustomerPopUp";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

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
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
                <p className="text-red-500 font-bold text-xl">Connection Error</p>
                <p className="text-gray-500 max-w-xs">We couldn't reach the customer database. Please check your connection.</p>
                <Button onClick={() => refetch()} variant="outline" className="rounded-xl px-10 py-7 text-lg font-bold">Retry Load</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Customer Directory" 
                description="Maintain customer profiles, order history, and contact information."
                buttonContent="Register Customer"
                buttonIcon={Plus}
                onButtonClick={handleAdd}
            />

            <Card className="overflow-hidden border-gray-100/60 shadow-sm rounded-2xl bg-white">
                <div className="p-6">
                    <div className={'w-full sm:max-w-md relative'}>
                        <Search className={'absolute left-4 top-[50%] -translate-y-1/2 h-5 w-5 text-muted-foreground'}/>
                        <Input
                            className={'pl-12 h-14 rounded-xl text-lg border-gray-100 focus:border-blue-400 shadow-sm transition-all font-medium'}
                            placeholder={'Search client directory...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border-t border-gray-100">
                    <Table>
                        <TableHeader className={'bg-gray-50/50'}>
                            <TableRow className="hover:bg-transparent border-gray-100">
                                {userTableHeader.map((header) => (
                                    <TableHead key={header} className={cn(
                                        'px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider',
                                        header === 'ACTIONS' && 'text-right'
                                    )}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <TableRow key={idx} className="border-gray-100">
                                        <TableCell className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <Skeleton className="h-12 w-12 rounded-full" />
                                                <Skeleton className="h-5 w-32" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-5"><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell className="px-6 py-5"><Skeleton className="h-8 w-20 rounded-full" /></TableCell>
                                        <TableCell className="px-6 py-5 text-right"><Skeleton className="h-10 w-28 ml-auto rounded-lg" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredCustomers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-60 text-center text-gray-400 font-bold text-lg">
                                        {searchQuery ? `No matches found for "${searchQuery}"` : "Client list is empty."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <TableRow key={customer.id} className="group hover:bg-gray-50/50 border-gray-100 transition-colors">
                                        <TableCell className={'px-6 py-5'}>
                                            <div className={'flex items-center gap-4'}>
                                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 font-bold text-xl shadow-sm border border-blue-100">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className={'font-bold text-gray-900 text-lg'}>{customer.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={'px-6 py-5 font-bold text-gray-700 text-lg'}>
                                            {customer.phone_number || customer.phone || 'N/A'}
                                        </TableCell>
                                        <TableCell className={'px-6 py-5'}>
                                            <StatusBadge status={customer.status || 'ACTIVE'} type="user" />
                                        </TableCell>
                                        <TableCell className={'px-6 py-5'}>
                                            <div className="flex items-center justify-end gap-3">
                                                <Button onClick={() => handleEdit(customer)} className={'bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-6 py-3 rounded-xl font-bold h-auto shadow-none transition-all'}>
                                                    Update Customer Profile
                                                </Button>
                                                <Button onClick={() => requestDelete(customer.id)} variant="ghost" className="p-3 h-auto rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
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
            </Card>

            <CustomerPopUp open={openCustomerModal} onOpenChange={setOpenCustomerModal} customer={editingCustomer} />

            <ConfirmationDialog 
                open={isDeleteDialogOpen} 
                onOpenChange={setIsDeleteDialogOpen} 
                onConfirm={confirmDelete}
                isPending={deleteMutation.isPending}
                confirmText="Yes, Remove Customer"
                description="This will permanently delete the customer profile and remove them from all future order association. This action is irreversible."
            />
        </div>
    )
}
