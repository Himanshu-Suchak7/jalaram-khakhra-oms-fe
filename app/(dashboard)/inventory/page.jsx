import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import MainButton from "@/components/MainButton";
import {
    CircleCheckBig,
    CircleX,
    ClipboardClock,
    DollarSign,
    Plus,
    TriangleAlert,
    CircleAlert,
    Archive, Search
} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableFooter, TableHeader, TableRow} from "@/components/ui/table";
import {cn} from "@/lib/utils";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import Image from "next/image";

const cardContents = [
    {
        title: 'Total Products',
        number: 20,
        icon: Archive,
        iconColor: "text-gray-400"
    },
    {
        title: 'Low Stock Products',
        number: 5,
        icon: TriangleAlert,
        iconColor: "text-orange-400"
    },
    {
        title: 'Out of Stock Products',
        number: 2,
        icon: CircleAlert,
        iconColor: 'text-red-400'
    },
]
const userTableHeader = ['PRODUCT', 'STOCK (KG)', 'MIN STOCK', 'STATUS', 'ACTIONS']
const userTableData = [
    {
        name: 'Methi Khakhra',
        stock: 50,
        minStock: 10,
        actions: 'Owner-Cannot modify',
        image: '/products/methi-khakhra.png',
        status: 'OK',
    },
    {
        name: 'Jeera Khakhra',
        stock: 5,
        minStock: 10,
        actions: 'Owner-Cannot modify',
        image: '/products/jeera-khakhra.png',
        status: 'Low Stock',
    },
    {
        name: 'Jalaram Patra',
        stock: 0,
        minStock: 10,
        actions: 'Owner-Cannot modify',
        image: '/products/jalaram-patra.png',
        status: 'Out of Stock',
    },
    {
        name: 'Manchurian Khakhra',
        stock: 8,
        minStock: 10,
        actions: 'Owner-Cannot modify',
        image: '/products/methi-khakhra.png',
        status: 'Low Stock',
    },
    {
        name: 'Pani Puri Khakhra',
        stock: 50,
        minStock: 10,
        actions: 'Owner-Cannot modify',
        image: '/products/jalaram-patra.png',
        status: 'OK',
    }
]

export default function Inventory() {
    return (
        <>
            <div className={'flex items-center'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Inventory Management</h1>
                    <p className={'text-gray-400 text-lg'}>Manage and track your inventory here.</p>
                </div>
            </div>
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
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
            <Card className="overflow-hidden rounded-xl p-0">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            {userTableHeader.map((header, index) => (
                                <TableCell
                                    key={index}
                                    className="px-4 py-6 text-lg font-medium"
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {userTableData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell className="flex items-center gap-3 px-4 py-6">
                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                        <Image
                                            src={row.image}
                                            alt={row.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{row.name}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-6">{row.stock}</TableCell>
                                <TableCell className="px-4 py-6">{row.minStock}</TableCell>
                                <TableCell className="px-4 py-6">
                                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium',
                                        row.status === 'OK' && 'bg-green-100 text-green-700',
                                        row.status === 'Low Stock' && 'bg-orange-100 text-orange-700',
                                        row.status === 'Out of Stock' && 'bg-red-100 text-red-700',
                                    )}>
                                        {row.status}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-6">{row.actions}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </>
    )
}