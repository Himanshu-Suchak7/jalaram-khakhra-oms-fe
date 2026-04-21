'use client'
import { useEffect, useState } from "react";
import {cn} from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import OrderActionMenu from "@/app/(dashboard)/orders/_components/OrderActionMenu";
import { getOrders } from "@/lib/orders";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";

const ordersTableHeader = ['ORDER #', 'CUSTOMER NAME', 'TOTAL AMOUNT', 'STATUS', 'PAYMENT', 'ACTIONS'];

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchOrders = (query = "") => {
        setLoading(true);
        getOrders({ search: query })
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders("");
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        const timeoutId = setTimeout(() => fetchOrders(val), 500);
        return () => clearTimeout(timeoutId);
    };

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Orders" 
                description="Manage and track all your customer orders, fulfillment, and payments."
                buttonContent="Add New Order"
                buttonIcon={Plus}
                onButtonClick={() => window.location.href = '/orders/add-order'}
            />

            <Card className={'p-0 overflow-hidden border-gray-100 rounded-2xl shadow-sm'}>
                <div className="p-6">
                    <div className={'w-full sm:max-w-md relative'}>
                        <Search className={'absolute left-4 top-[50%] -translate-y-1/2 h-5 w-5 text-muted-foreground'}/>
                        <Input 
                            className={'pl-12 h-12 rounded-xl border-gray-100 focus:border-blue-400 text-lg shadow-sm transition-all'} 
                            type={'text'}
                            value={search}
                            onChange={handleSearch}
                            placeholder={'Search by number or name...'}
                        />
                    </div>
                </div>
                
                <Table>
                    <TableHeader className={'bg-gray-50/50'}>
                        <TableRow className="hover:bg-transparent border-gray-100">
                            {ordersTableHeader.map((header, index) => (
                                <TableCell className={cn(
                                    'px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider',
                                    header === 'ACTIONS' && 'text-right'
                                )} key={index}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <TableRow key={`skeleton-${idx}`} className="border-gray-100">
                                    <TableCell className={'px-6 py-5'}><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell className={'px-6 py-5'}><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell className={'px-6 py-5'}><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className={'px-6 py-5'}><Skeleton className="h-7 w-24 rounded-full" /></TableCell>
                                    <TableCell className={'px-6 py-5'}><Skeleton className="h-7 w-24 rounded-full" /></TableCell>
                                    <TableCell className={'px-6 py-5'}><Skeleton className="h-9 w-28 rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-gray-500 font-medium">No orders found.</TableCell>
                            </TableRow>
                        ) : (
                            orders.map((row) => (
                                <TableRow key={row.id} className="group hover:bg-gray-50 transition-colors border-gray-100">
                                    <TableCell className={'px-6 py-5 font-bold text-blue-600'}>
                                        <Link href={`/orders/${row.id}/invoice`}>
                                            {row.order_number}
                                        </Link>
                                    </TableCell>
                                    <TableCell className={'px-6 py-5 font-bold text-gray-900'}>{row.customer_name}</TableCell>
                                    <TableCell className={'px-6 py-5 font-bold text-gray-700 text-lg'}>₹ {row.total_amount.toLocaleString()}</TableCell>
                                    <TableCell className={'px-6 py-5'}>
                                        <StatusBadge status={row.order_status} type="order" />
                                    </TableCell>
                                    <TableCell className={'px-6 py-5'}>
                                        <StatusBadge status={row.payment_status} type="payment" />
                                    </TableCell>
                                    <TableCell className={'px-6 py-5'}>
                                        <OrderActionMenu order={row} onMutation={() => fetchOrders(search)}/>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter className="bg-gray-50/50">
                        <TableRow>
                            <TableCell colSpan={6} className={'px-6 py-5 text-center text-gray-500 font-bold'}>
                                Showing {orders.length} orders
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Card>
        </div>
    )
}
