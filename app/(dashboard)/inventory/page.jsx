'use client';
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import MainButton from "@/components/MainButton";
import {
    Plus,
    TriangleAlert,
    CircleAlert,
    Archive, Search, Pencil
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useInventorySummary} from "@/hooks/useInventorySummary";
import {useState} from "react";
import {useInventoryItems} from "@/hooks/useInventoryItems";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {addStockSchema, updateMinStockSchema} from "@/lib/validator/schema";
import {useAddStock} from "@/hooks/useAddStock";
import {useUpdateMinStock} from "@/hooks/useUpdateMinStock";

const userTableHeader = ['PRODUCT', 'STOCK (KG)', 'MIN STOCK', 'STATUS', 'ACTIONS']

export default function Inventory() {
    const {data, isLoading} = useInventorySummary();
    const cardContents = [
        {
            title: 'Total Products',
            number: data?.total_products || 0,
            icon: Archive,
            iconColor: "text-gray-400"
        },
        {
            title: 'Low Stock Products',
            number: data?.low_stock_products || 0,
            icon: TriangleAlert,
            iconColor: "text-orange-400"
        },
        {
            title: 'Out of Stock Products',
            number: data?.out_of_stock_products || 0,
            icon: CircleAlert,
            iconColor: 'text-red-400'
        },
    ]
    const [search, setSearch] = useState("");
    const {data: itemsData, isLoading: itemsLoading} = useInventoryItems({ search, })
    const items = itemsData?.data || []
    const statusMap = {
        OK: 'OK',
        LOW_STOCK: 'Low Stock',
        OUT_OF_STOCK: 'Out of Stock',
    }
    const [editingMinStockId, setEditingMinStockId] = useState(null)
    const stockForm = useForm({
        resolver: zodResolver(addStockSchema),
        defaultValues: {
            quantity_kg: '',
        },
    })
    const minStockForm = useForm({
        resolver: zodResolver(updateMinStockSchema),
        defaultValues: {
            min_stock_kg: '',
        },
    })

    const {mutate: addStock, isPending: isAddingStock} = useAddStock();
    const {mutate: updateMinStockMutate, isPending: isUpdatingMinStock} = useUpdateMinStock();

    const onAddStock = (productId, data) => {
        addStock({
            product_id: productId,
            quantity_kg: data.quantity_kg,
            action: "ADD"
        }, {
            onSuccess: () => {
                stockForm.reset();
            }
        });
    }

    const onUpdateMinStock = (productId, data) => {
        updateMinStockMutate({
            productId,
            data
        }, {
            onSuccess: () => {
                setEditingMinStockId(null);
            }
        });
    }

    return (
        <div className="space-y-8">
            <div className={'flex items-center'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Inventory Management</h1>
                    <p className={'text-gray-400 text-lg'}>Manage and track your inventory here.</p>
                </div>
            </div>
            
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <Card key={idx} className="border-gray-100/60 shadow-sm">
                            <CardHeader className={'flex flex-row items-center justify-between'}>
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-5 rounded" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    cardContents.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <Card key={index} className="border-gray-100/60 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className={'flex flex-row items-center justify-between pb-2'}>
                                    <CardTitle className={'text-lg font-bold text-gray-600'}>{card.title}</CardTitle>
                                    <Icon className={`${card.iconColor} w-6 h-6`}/>
                                </CardHeader>
                                <CardContent>
                                    <p className={'text-3xl font-bold text-gray-900'}>{card.number}</p>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative w-full sm:flex-1 sm:max-w-sm">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                    <Input
                        placeholder="Search products..."
                        className="pl-12 h-12 rounded-xl border-gray-100 focus:border-blue-400 shadow-sm text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="overflow-hidden rounded-2xl border-gray-100/60 shadow-sm p-0">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent border-gray-100">
                            {userTableHeader.map((header, index) => (
                                <TableCell
                                    key={index}
                                    className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider"
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {itemsLoading ? (
                            Array.from({ length: 5 }).map((_, idx) => (
                                <TableRow key={`skeleton-${idx}`}>
                                    <TableCell className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <Skeleton className="h-5 w-40" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5"><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell className="px-6 py-5"><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell className="px-6 py-5"><Skeleton className="h-7 w-24 rounded-full" /></TableCell>
                                    <TableCell className="px-6 py-5"><Skeleton className="h-10 w-32 rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center py-10 text-gray-500 font-medium">
                                    No products found in inventory.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item, index) => (
                                <TableRow key={index} className="group hover:bg-gray-50/50 border-gray-100 transition-colors">
                                    <TableCell className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-gray-50 shadow-sm">
                                                <Image
                                                    src={item.image}
                                                    alt={item.product_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-lg">{item.product_name}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell className="px-6 py-5">
                                        <span className="text-lg font-bold text-gray-700">{item.stock_kg} <span className="text-sm font-medium text-gray-400 uppercase">KG</span></span>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        {editingMinStockId === item.product_id ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    {...minStockForm.register("min_stock_kg")}
                                                    className="w-24 h-10 rounded-lg"
                                                />
                                                <Button
                                                    size="sm"
                                                    className={'cursor-pointer h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700'}
                                                    disabled={isUpdatingMinStock}
                                                    onClick={minStockForm.handleSubmit((data) => onUpdateMinStock(item.product_id, data))}
                                                >
                                                    {isUpdatingMinStock ? "..." : "Save"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-gray-700">{item.min_stock_kg} <span className="text-sm font-medium text-gray-400 uppercase">KG</span></span>
                                                <Button size={'icon'} variant={'ghost'} className={'h-8 w-8 cursor-pointer text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg'}
                                                        onClick={() => {
                                                            setEditingMinStockId(item.product_id);
                                                            minStockForm.setValue('min_stock_kg', item.min_stock_kg);
                                                        }}>
                                                    <Pencil
                                                        className="w-4 h-4"
                                                    />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <span className={cn('px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center',
                                            item.status === 'OK' && 'bg-green-50 text-green-700 border border-green-100',
                                            item.status === 'LOW_STOCK' && 'bg-orange-50 text-orange-700 border border-orange-100',
                                            item.status === 'OUT_OF_STOCK' && 'bg-red-50 text-red-700 border border-red-100',
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full mr-2", 
                                                item.status === 'OK' && 'bg-green-600',
                                                item.status === 'LOW_STOCK' && 'bg-orange-600',
                                                item.status === 'OUT_OF_STOCK' && 'bg-red-600',
                                            )}></span>
                                            {statusMap[item.status]}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 h-10 px-4 rounded-xl font-bold shadow-none border-none transition-all">
                                                    <Plus className="w-4 h-4 mr-1.5" />
                                                    Add Stock
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-64 p-5 space-y-4 rounded-2xl shadow-2xl border-none outline-none">
                                                <div className="space-y-2">
                                                    <p className="text-sm font-bold text-gray-800">Add Stock: {item.product_name}</p>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            placeholder="Amount"
                                                            className="h-12 rounded-xl pr-12 font-bold"
                                                            {...stockForm.register("quantity_kg")}
                                                        />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">KG</span>
                                                    </div>
                                                    {stockForm.formState.errors.quantity_kg && (
                                                        <p className={'text-red-500 text-xs font-bold'}>{stockForm.formState.errors.quantity_kg.message}</p>
                                                    )}
                                                </div>

                                                <Button
                                                    className="w-full py-6 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700"
                                                    disabled={isAddingStock}
                                                    onClick={stockForm.handleSubmit((data) => onAddStock(item.product_id, data))}
                                                >
                                                    {isAddingStock ? "Updating..." : "Update Stock"}
                                                </Button>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
