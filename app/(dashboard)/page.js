import {CircleCheckBig, CirclePlus, CircleX, ClipboardClock, DollarSign, MoveRight} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import OrderStatusChart from "@/components/OrderStatusChart";
import {RevenueGraph} from "@/components/RevenueGraph";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import Link from "next/link";
import MainButton from "@/components/MainButton";

const cardContents = [
    {
        title: 'Pending Orders',
        number: 15,
        icon: ClipboardClock,
        iconColor: "text-gray-400"
    },
    {
        title: 'Fulfilled Orders',
        number: 128,
        icon: CircleCheckBig,
        iconColor: "text-green-400"
    },
    {
        title: 'Cancelled Orders',
        number: 8,
        icon: CircleX,
        iconColor: 'text-red-400'
    },
    {
        title: 'Total Revenue',
        number: '$ 25483.50',
        icon: DollarSign,
        iconColor: "text-gray-400"
    }
]

const orderStatus = {
    title: 'Order Status',
    pending: {
        title: 'Pending',
        number: 15,
        color: 'text-blue-500'
    },
    fulfilled: {
        title: 'Fulfilled',
        number: 128,
        color: 'text-green-500'
    },
    canceled: {
        title: 'Canceled',
        number: 8,
        color: 'text-red-500'
    },
    total: 151,
    totalTitle: 'Total Orders',
}

const revenueGraph = {
    title: 'Revenue Overview',
    days: 30,
    week1: {
        title: 'Week 1',
        number: 30,
    },
    week2: {
        title: 'Week 2',
        number: 40,
    },
    week3: {
        title: 'Week 3',
        number: 20,
    },
    week4: {
        title: 'Week 4',
        number: 60,
    },
}

const orderTableHeader = ["ORDER ID", "CUSTOMER", "DATE", "STATUS", "TOTAL"]
const orderTableData = [
    {
        orderID: "#A583",
        customer: "John Doe",
        date: "25/12/2025",
        status: "Fulfilled",
        total: 250
    },
    {
        orderID: "#A584",
        customer: "Himanshu Suchak",
        date: "20/10/2025",
        status: "Canceled",
        total: 1250
    },
    {
        orderID: "#A585",
        customer: "Om Chandarana",
        date: "22/07/2025",
        status: "Pending",
        total: 350
    },
    {
        orderID: "#A586",
        customer: "Dharmesh Suchak",
        date: "6/5/2025",
        status: "Fulfilled",
        total: 200
    },
    {
        orderID: "#A587",
        customer: "Poonam Suchak",
        date: "20/5/2025",
        status: "Pending",
        total: 120
    },
]

export default function Home() {
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
                <OrderStatusChart data={orderStatus}/>
                <RevenueGraph data={revenueGraph}/>
            </div>
            <div className={'space-y-5'}>
                <div className={'flex items-center justify-between'}>
                    <h2 className={'text-2xl font-bold'}>Recent Orders</h2>
                    <Button
                        className={'bg-gray-200 hover:bg-gray-400 cursor-pointer text-gray-600 hover:text-gray-200 font-medium'}>
                        <Link href={'/orders'} className={'flex items-center gap-2 align-middle'}>
                            View all orders <MoveRight/>
                        </Link>
                    </Button>
                </div>
                <Card className={'p-0'}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {orderTableHeader.map((header, index) => {
                                    return (
                                        <TableHead className={'px-4 py-6 text-lg'} key={index}>{header}</TableHead>
                                    )
                                })}

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderTableData.map((order, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell
                                            className={'px-4 py-6 text-blue-500 font-medium'}>{order.orderID}</TableCell>
                                        <TableCell className={'px-4 py-6'}>{order.customer}</TableCell>
                                        <TableCell className={'px-4 py-6'}>{order.date}</TableCell>
                                        <TableCell className={'px-4 py-6'}>
                                            <span
                                                className={cn(
                                                    "px-2 py-1 rounded-full text-xs font-medium",
                                                    order.status === "Fulfilled" && "bg-green-100 text-green-700",
                                                    order.status === "Pending" && "bg-blue-100 text-blue-700",
                                                    order.status === "Canceled" && "bg-red-100 text-red-700"
                                                )}
                                            >
                                                {order.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className={'px-4 py-6'}>{`$${order.total}`}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </>
    );
}
