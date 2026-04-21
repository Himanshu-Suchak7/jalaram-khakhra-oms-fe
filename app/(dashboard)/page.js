'use client'
import {useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import {CircleCheckBig, CirclePlus, CircleX, ClipboardClock, IndianRupee, MoveRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import OrderStatusChart from "@/components/OrderStatusChart";
import {RevenueGraph} from "@/components/RevenueGraph";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import {getDashboardOverview} from "@/lib/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shared/PageHeader";
import SummaryCard from "@/components/shared/SummaryCard";
import StatusBadge from "@/components/shared/StatusBadge";

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

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title="Dashboard" description="Loading your business overview...">
                    <Skeleton className="h-14 w-full sm:w-56 rounded-xl" />
                </PageHeader>
                <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <SummaryCard key={idx} isLoading={true} />
                    ))}
                </div>
                <div className={'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
            </div>
        );
    }
    
    if (!data) return <div className="p-8 text-center text-red-500 font-bold">Failed to load data</div>;

    const cardContents = [
        {
            title: 'Pending Orders',
            number: data.cards.pending_orders,
            icon: ClipboardClock,
            iconColor: "text-amber-500"
        },
        {
            title: 'Fulfilled Orders',
            number: data.cards.fulfilled_orders,
            icon: CircleCheckBig,
            iconColor: "text-emerald-500"
        },
        {
            title: 'Cancelled Orders',
            number: data.cards.cancelled_orders,
            icon: CircleX,
            iconColor: 'text-rose-500'
        },
        {
            title: 'Total Revenue',
            number: `₹ ${data.cards.total_revenue.toLocaleString()}`,
            icon: IndianRupee,
            iconColor: "text-blue-500"
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
        <div className="space-y-8">
            <PageHeader 
                title="Dashboard" 
                description="Welcome back! Here is what's happening with your business today."
                buttonContent="Add New Order"
                buttonIcon={CirclePlus}
                onButtonClick={() => window.location.href = '/orders/add-order'}
            />

            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>
                {cardContents.map((card, index) => (
                    <SummaryCard 
                        key={index}
                        title={card.title}
                        value={card.number}
                        icon={card.icon}
                        iconColor={card.iconColor}
                    />
                ))}
            </div>

            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-8'}>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <OrderStatusChart data={orderStatusProps}/>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <RevenueGraph data={data.revenue_overview}/>
                </div>
            </div>

            <div className={'space-y-6'}>
                <div className={'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'}>
                    <h2 className={'text-3xl font-bold text-gray-900'}>Recent Orders</h2>
                    <Button
                        variant="ghost"
                        asChild
                        className={'bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-bold px-6 py-5 rounded-xl transition-all'}>
                        <Link href={'/orders'} className={'flex items-center gap-2'}>
                            View Orders <MoveRight className="w-5 h-5"/>
                        </Link>
                    </Button>
                </div>
                
                <Card className={'p-0 overflow-hidden border-gray-100 rounded-2xl shadow-sm'}>
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent border-gray-100">
                                {orderTableHeader.map((header, index) => (
                                    <TableHead className={cn(
                                        'px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider',
                                        header === 'TOTAL' && 'text-right'
                                    )} key={index}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.recent_orders.map((order, index) => (
                                <TableRow key={index} className="group hover:bg-gray-50 transition-colors border-gray-100">
                                    <TableCell className={'px-6 py-5 font-bold text-blue-600'}>
                                        <Link href={`/orders/${order.id}/invoice`}>
                                            {order.order_id}
                                        </Link>
                                    </TableCell>
                                    <TableCell className={'px-6 py-5 font-bold text-gray-900'}>{order.customer_name}</TableCell>
                                    <TableCell className={'px-6 py-5 text-gray-500 font-medium'}>{order.date}</TableCell>
                                    <TableCell className={'px-6 py-5'}>
                                        <StatusBadge status={order.status} type="order" />
                                    </TableCell>
                                    <TableCell className={'px-6 py-5 font-bold text-gray-900 text-lg text-right'}>{`₹ ${order.total.toLocaleString()}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
