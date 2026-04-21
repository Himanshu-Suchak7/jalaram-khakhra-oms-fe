'use client'
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableFooter, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";
import MainButton from "@/components/MainButton";
import OrderActionMenu from "@/app/(dashboard)/orders/_components/OrderActionMenu";
import { getOrders } from "@/lib/orders";
import { Skeleton } from "@/components/ui/skeleton";

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
        getOrders({ search: "" })
            .then(res => setOrders(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearch(val);
        // Basic debounce-like behavior
        const timeoutId = setTimeout(() => fetchOrders(val), 500);
        return () => clearTimeout(timeoutId);
    };

    return (
        <>
            <div className={'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Orders</h1>
                    <p className={'text-gray-400 text-lg'}>Manage and track all your customer orders here.</p>
                </div>
                <div className="w-full sm:w-auto">
                    <Link href="/orders/add-order">
                        <MainButton content={'Add order'} Icon={Plus}/>
                    </Link>
                </div>
            </div>
            <Card className={'pb-0'}>
                <div className="py-4">
                    <div className={'w-full sm:max-w-[60%] lg:max-w-[45%] px-4 relative'}>
                        <Search className={'absolute left-6 top-[50%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                        <Input 
                            className={'pl-9'} 
                            type={'text'}
                            value={search}
                            onChange={handleSearch}
                            placeholder={'Search an order by order number or customer name'}
                        />
                    </div>
                </div>
                <Table className={'border-t'}>
                    <TableHeader className={'bg-gray-50'}>
                        <TableRow>
                            {ordersTableHeader.map((header, index) => (
                                <TableCell className={'px-4 py-6 text-lg font-medium'} key={index}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <TableRow key={`skeleton-${idx}`}>
                                    <TableCell className={'px-4 py-6'}><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className={'px-4 py-6'}><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell className={'px-4 py-6'}><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell className={'px-4 py-6'}><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                    <TableCell className={'px-4 py-6'}><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                    <TableCell className={'px-4 py-6'}><Skeleton className="h-8 w-28" /></TableCell>
                                </TableRow>
                            ))
                        ) : orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">No orders found.</TableCell>
                            </TableRow>
                        ) : (
                            orders.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell className={'px-4 py-6 font-medium text-blue-500'}>
                                        <Link href={`/orders/${row.id}/invoice`}>
                                            {row.order_number}
                                        </Link>
                                    </TableCell>
                                    <TableCell className={'px-4 py-6'}>{row.customer_name}</TableCell>
                                    <TableCell className={'px-4 py-6'}>₹ {row.total_amount.toLocaleString()}</TableCell>
                                    <TableCell className={'px-4 py-6'}>
                                        <span
                                            className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                                                (row.order_status?.toUpperCase() === 'FULFILLED') && 'bg-green-100 text-green-700 border border-green-200',
                                                (row.order_status?.toUpperCase() === 'PENDING') && 'bg-amber-100 text-amber-700 border border-amber-200',
                                                (row.order_status?.toUpperCase() === 'CANCELLED') && 'bg-red-100 text-red-700 border border-red-200',
                                            )}>
                                            {row.order_status}
                                        </span>
                                    </TableCell>
                                    <TableCell className={'px-4 py-6'}>
                                        <span
                                            className={cn('px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                                                (row.payment_status?.toUpperCase() === 'PAID') && 'bg-emerald-100 text-emerald-700 border border-emerald-200',
                                                (row.payment_status?.toUpperCase() === 'PARTIAL') && 'bg-orange-100 text-orange-700 border border-orange-200',
                                                (row.payment_status?.toUpperCase() === 'UNPAID') && 'bg-rose-100 text-rose-700 border border-rose-200',
                                            )}>
                                            {row.payment_status}
                                        </span>
                                    </TableCell>
                                    <TableCell className={'px-4 py-6'}><OrderActionMenu order={row} onMutation={() => fetchOrders(search)}/></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6} className={'px-4 py-6 text-center text-muted-foreground'}>
                                Showing {orders.length} orders
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Card>
        </>
    )
}
