'use client'
import {useEffect, useState} from "react";
import {CircleCheckBig, CirclePlus, CircleX, ClipboardClock, DollarSign, MoveRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import OrderStatusChart from "@/components/OrderStatusChart";
import {RevenueGraph} from "@/components/RevenueGraph";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import Link from "next/link";
import MainButton from "@/components/MainButton";
import {getDashboardOverview} from "@/lib/dashboard";

const orderTableHeader = ["ORDER ID", "CUSTOMER", "DATE", "STATUS", "TOTAL"]

export default function Home() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardOverview()
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-2xl font-bold">Loading Dashboard...</div>;
    if (!data) return <div className="p-8 text-center text-red-500 font-bold">Failed to load data</div>;

    const cardContents = [
        {
            title: 'Pending Orders',
            number: data.cards.pending_orders,
            icon: ClipboardClock,
            iconColor: "text-gray-400"
        },
        {
            title: 'Fulfilled Orders',
            number: data.cards.fulfilled_orders,
            icon: CircleCheckBig,
            iconColor: "text-green-400"
        },
        {
            title: 'Cancelled Orders',
            number: data.cards.cancelled_orders,
            icon: CircleX,
            iconColor: 'text-red-400'
        },
        {
            title: 'Total Revenue',
            number: `₹ ${data.cards.total_revenue.toLocaleString()}`,
            icon: DollarSign,
            iconColor: "text-gray-400"
        }
    ];

    const orderStatusProps = {
        title: 'Order Status',
        pending: { title: 'Pending', number: data.order_status.pending },
        fulfilled: { title: 'Fulfilled', number: data.order_status.fulfilled },
        canceled: { title: 'Cancelled', number: data.order_status.cancelled },
        total: data.order_status.total,
        totalTitle: 'Total Orders',
    };

    return (
        <>
            <div className={'flex items-center justify-between'}>
                <h1 className={'text-4xl font-bold'}>Dashboard</h1>
                <Link href={'/orders/add-order'}>
                    <MainButton content={'Add New Order'} Icon={CirclePlus}/>
                </Link>
            </div>
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}>
                {cardContents.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className={'flex flex-row items-center justify-between'}>
                                <CardTitle className={'text-lg'}>{card.title}</CardTitle>
                                <Icon className={`${card.iconColor}`}/>
                            </CardHeader>
                            <CardContent>
                                <p className={'text-2xl font-bold'}>{card.number}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-4'}>
                <OrderStatusChart data={orderStatusProps}/>
                <RevenueGraph data={data.revenue_overview}/>
            </div>
            <div className={'space-y-5'}>
                <div className={'flex items-center justify-between'}>
                    <h2 className={'text-2xl font-bold'}>Recent Orders</h2>
                    <Button
                        variant="ghost"
                        className={'bg-gray-200 hover:bg-gray-400 cursor-pointer text-gray-600 hover:text-gray-200 font-medium'}>
                        <Link href={'/orders'} className={'flex items-center gap-2 align-middle'}>
                            View all orders <MoveRight/>
                        </Link>
                    </Button>
                </div>
                <Card className={'p-0 overflow-hidden'}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {orderTableHeader.map((header, index) => (
                                    <TableHead className={'px-4 py-6 text-lg'} key={index}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.recent_orders.map((order, index) => (
                                <TableRow key={index}>
                                    <TableCell className={'px-4 py-6 text-blue-500 font-medium'}>
                                        <Link href={`/orders/${order.order_id}`}>
                                            {order.order_id}
                                        </Link>
                                    </TableCell>
                                    <TableCell className={'px-4 py-6'}>{order.customer_name}</TableCell>
                                    <TableCell className={'px-4 py-6'}>{order.date}</TableCell>
                                    <TableCell className={'px-4 py-6'}>
                                        <span
                                            className={cn(
                                                "px-2 py-1 rounded-full text-xs font-medium uppercase",
                                                order.status === "FULFILLED" && "bg-green-100 text-green-700",
                                                order.status === "PENDING" && "bg-blue-100 text-blue-700",
                                                order.status === "CANCELLED" && "bg-red-100 text-red-700"
                                            )}
                                        >
                                            {order.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className={'px-4 py-6 font-bold'}>{`₹ ${order.total.toLocaleString()}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </>
    );
}
