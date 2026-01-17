import {Card} from "@/components/ui/card";
import {Search, Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableFooter, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import Link from "next/link";
import MainButton from "@/components/MainButton";
import OrderActionMenu from "@/app/(dashboard)/orders/_components/OrderActionMenu";

const ordersTableHeader = ['ORDER #', 'CUSTOMER NAME', 'TOTAL AMOUNT', 'STATUS', 'PAYMENT', 'ACTIONS'];
const orderTableData = [
    {
        orderId: '#ORD-001',
        name: 'Himanshu Suchak',
        amount: 500,
        status: 'FULFILLED',
        paymentStatus: 'PAID',
        actions: 'Owner-Cannot modify',
    },
    {
        orderId: '#ORD-002',
        name: 'Dharmesh Suchak',
        amount: 5000,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        actions: 'Owner-Cannot modify',
    },
    {
        orderId: '#ORD-003',
        name: 'Nityam Suchak',
        amount: 200,
        status: 'CANCELLED',
        paymentStatus: 'N/A',
        actions: 'Owner-Cannot modify',
    },
    {
        orderId: '#ORD-004',
        name: 'Tilak Chandarana',
        amount: 600,
        status: 'FULFILLED',
        paymentStatus: 'PARTIAL',
        actions: 'Owner-Cannot modify',
    },
    {
        orderId: '#ORD-005',
        name: 'Nilesh Chandarana',
        amount: 950,
        status: 'CANCELLED',
        paymentStatus: 'N/A',
        actions: 'Owner-Cannot modify',
    },
]

export default function Orders() {
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
                <div>
                    <div className={'max-w-[60%] lg:max-w-[45%] w-full px-4 relative'}>
                        <Search className={'absolute left-6 top-[50%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                        <Input className={'pl-9'} type={'text'}
                               placeholder={'Search a order by order number or custmer name'}/>
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
                        {orderTableData.map((row, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className={'flex items-center gap-3 px-4 py-6'} key={index}>
                                            <div className={'flex flex-col'}>
                                                <span className={'font-medium'}>{row.orderId}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={'px-4 py-6'}>{row.name}</TableCell>
                                        <TableCell className={'px-4 py-6'}>₹ {row.amount}</TableCell>
                                        <TableCell className={'px-4 py-6'}>
                                            <span
                                                className={cn('px-2 py-1 rounded-full text-xs font-medium',
                                                    row.status === 'FULFILLED' && 'bg-green-100 text-green-700',
                                                    row.status === 'PENDING' && 'bg-orange-100 text-orange-700',
                                                    row.status === 'CANCELLED' && 'bg-red-100 text-red-700',
                                                )}>
                                                {row.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className={'px-4 py-6'}>
                                            <span
                                                className={cn('px-2 py-1 rounded-full text-xs font-medium',
                                                    row.paymentStatus === 'PAID' && 'bg-green-100 text-green-700',
                                                    row.paymentStatus === 'PARTIAL' && 'bg-orange-100 text-orange-700',
                                                    row.paymentStatus === 'UNPAID' && 'bg-red-100 text-red-700',
                                                    row.paymentStatus === 'N/A' && 'bg-gray-200 text-gray-700',
                                                )}>
                                                {row.paymentStatus}
                                            </span>
                                        </TableCell>
                                        <TableCell className={'px-4 py-6'}><OrderActionMenu order={row}/></TableCell>
                                    </TableRow>
                                )
                            }
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={2} className={'px-4 py-6'}>Showing 1 to 5 of 5 users</TableCell>
                            <TableCell colSpan={4} className={'px-4 py-6'}>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationPrevious href="#"/>
                                        <PaginationItem>
                                            <PaginationLink href="#">1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#" isActive>
                                                2
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">3</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationEllipsis/>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext href="#"/>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Card>
        </>
    )
}