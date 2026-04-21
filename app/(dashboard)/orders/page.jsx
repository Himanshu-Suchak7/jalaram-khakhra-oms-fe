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
        fetchOrders();
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
            <div className={'flex items-center justify-between'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Orders</h1>
                    <p className={'text-gray-400 text-lg'}>Manage and track all your customer orders here.</p>
                </div>
                <div>
                    <Link href="/orders/add-order">
                        <MainButton content={'Add order'} Icon={Plus}/>
                    </Link>
                </div>
            </div>
            <Card className={'pb-0'}>
                <div className="py-4">
                    <div className={'max-w-[60%] lg:max-w-[45%] w-full px-4 relative'}>
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
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">Loading orders...</TableCell>
                            </TableRow>
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
                                            className={cn('px-2 py-1 rounded-full text-xs font-medium uppercase',
                                                row.order_status === 'FULFILLED' && 'bg-green-100 text-green-700',
                                                row.order_status === 'PENDING' && 'bg-orange-100 text-orange-700',
                                                row.order_status === 'CANCELLED' && 'bg-red-100 text-red-700',
                                            )}>
                                            {row.order_status}
                                        </span>
                                    </TableCell>
                                    <TableCell className={'px-4 py-6'}>
                                        <span
                                            className={cn('px-2 py-1 rounded-full text-xs font-medium uppercase',
                                                row.payment_status === 'PAID' && 'bg-green-100 text-green-700',
                                                row.payment_status === 'PARTIAL' && 'bg-orange-100 text-orange-700',
                                                row.payment_status === 'UNPAID' && 'bg-red-100 text-red-700',
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