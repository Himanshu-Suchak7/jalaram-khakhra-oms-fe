'use client';
import {Plus, TriangleAlert, CircleAlert, Archive, Search, Pencil} from "lucide-react";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Card, CardContent} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHeader, TableRow} from "@/components/ui/table";
import {Skeleton} from "@/components/ui/skeleton";
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
import PageHeader from "@/components/shared/PageHeader";
import SummaryCard from "@/components/shared/SummaryCard";
import StatusBadge from "@/components/shared/StatusBadge";

const userTableHeader = ['PRODUCT', 'STOCK (KG)', 'MIN STOCK', 'STATUS', 'ACTIONS']

export default function Inventory() {
    const {data, isLoading} = useInventorySummary();
    const cardContents = [
        {
            title: 'Total Products',
            number: data?.total_products || 0,
            icon: Archive,
            iconColor: "text-blue-500"
        },
        {
            title: 'Low Stock Products',
            number: data?.low_stock_products || 0,
            icon: TriangleAlert,
            iconColor: "text-amber-500"
        },
        {
            title: 'Out of Stock Products',
            number: data?.out_of_stock_products || 0,
            icon: CircleAlert,
            iconColor: 'text-rose-500'
        },
    ];

    const [search, setSearch] = useState("");
    const {data: itemsData, isLoading: itemsLoading} = useInventoryItems({ search, })
    const items = itemsData?.data || []
    
    const [editingMinStockId, setEditingMinStockId] = useState(null)
    const stockForm = useForm({
        resolver: zodResolver(addStockSchema),
        defaultValues: { quantity_kg: '' },
    })
    const minStockForm = useForm({
        resolver: zodResolver(updateMinStockSchema),
        defaultValues: { min_stock_kg: '' },
    })

    const {mutate: addStock, isPending: isAddingStock} = useAddStock();
    const {mutate: updateMinStockMutate, isPending: isUpdatingMinStock} = useUpdateMinStock();

    const onAddStock = (productId, data) => {
        addStock({ product_id: productId, quantity_kg: data.quantity_kg, action: "add" }, {
            onSuccess: () => stockForm.reset()
        });
    }

    const onUpdateMinStock = (productId, data) => {
        updateMinStockMutate({ productId, data }, {
            onSuccess: () => setEditingMinStockId(null)
        });
    }

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Inventory Management" 
                description="Monitor stock levels, set minimum thresholds, and restock your catalog."
            />
            
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                {cardContents.map((card, index) => (
                    <SummaryCard 
                        key={index}
                        title={card.title}
                        value={card.number}
                        icon={card.icon}
                        iconColor={card.iconColor}
                        isLoading={isLoading}
                    />
                ))}
            </div>

            <Card className="overflow-hidden rounded-2xl border-gray-100/60 shadow-sm p-0 bg-white">
                <div className="p-6">
                    <div className="relative w-full sm:flex-1 sm:max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                        <Input
                            placeholder="Search products..."
                            className="pl-12 h-12 rounded-xl border-gray-100 focus:border-blue-400 shadow-sm text-lg transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50 border-t">
                        <TableRow className="hover:bg-transparent border-gray-100">
                            {userTableHeader.map((header, index) => (
                                <TableCell key={index} className={cn(
                                    'px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-wider',
                                    header === 'ACTIONS' && 'text-right'
                                )}>
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
                                    <TableCell className="px-6 py-5 text-right"><Skeleton className="h-10 w-32 rounded-xl ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-40 text-center py-10 text-gray-400 font-bold">No items found.</TableCell>
                            </TableRow>
                        ) : (
                            items.map((item, index) => (
                                <TableRow key={index} className="group hover:bg-gray-50/50 border-gray-100 transition-colors">
                                    <TableCell className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-gray-50 shadow-sm">
                                                <Image src={item.image} alt={item.product_name} fill className="object-cover" />
                                            </div>
                                            <span className="font-bold text-gray-900 text-lg">{item.product_name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5 font-bold text-gray-700 text-lg">
                                        {item.stock_kg} <span className="text-xs text-gray-400 font-medium">KG</span>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        {editingMinStockId === item.product_id ? (
                                            <div className="flex items-center gap-2">
                                                <Input type="number" {...minStockForm.register("min_stock_kg")} className="w-24 h-10" />
                                                <Button size="sm" className='h-10 px-4 bg-blue-600 hover:bg-blue-700 font-bold' disabled={isUpdatingMinStock}
                                                        onClick={minStockForm.handleSubmit((data) => onUpdateMinStock(item.product_id, data))}>
                                                    {isUpdatingMinStock ? "..." : "Save"}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-700 text-lg">{item.min_stock_kg} <span className="text-xs text-gray-400 font-medium">KG</span></span>
                                                <Button size='icon' variant='ghost' className='h-8 w-8 text-gray-400 hover:text-blue-600'
                                                        onClick={() => { setEditingMinStockId(item.product_id); minStockForm.setValue('min_stock_kg', item.min_stock_kg); }}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <StatusBadge status={item.status} type="inventory" />
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100 h-10 px-4 rounded-xl font-bold shadow-none border-none">
                                                    <Plus className="w-4 h-4 mr-1.5" /> Add Stock
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 p-5 rounded-2xl shadow-2xl border-none outline-none">
                                                <div className="space-y-4">
                                                    <p className="text-sm font-bold">Restock {item.product_name}</p>
                                                    <div className="relative">
                                                        <Input type="number" placeholder="0.00" className="h-12 rounded-xl pr-12 font-bold" {...stockForm.register("quantity_kg")} />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">KG</span>
                                                    </div>
                                                    <Button className="w-full py-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700" disabled={isAddingStock}
                                                            onClick={stockForm.handleSubmit((data) => onAddStock(item.product_id, data))}>
                                                        {isAddingStock ? "Processing..." : "Update Stock"}
                                                    </Button>
                                                </div>
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
