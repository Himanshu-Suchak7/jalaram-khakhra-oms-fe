'use client';
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
    Archive, Search, Pencil
} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableFooter, TableHeader, TableRow} from "@/components/ui/table";
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
    const [minStockValue, setMinStockValue] = useState('')
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
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                    <Input
                        placeholder="Search products..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
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
                        {items.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="flex items-center gap-3 px-4 py-6">
                                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                                        <Image
                                            src={item.image}
                                            alt={item.product_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.product_name}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="px-4 py-6">{item.stock_kg}</TableCell>
                                <TableCell className="px-4 py-6">
                                    {editingMinStockId === item.product_id ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                {...minStockForm.register("min_stock_kg")}
                                                className="w-20 h-8"
                                            />
                                            {minStockForm.formState.errors.min_stock_kg && (
                                                <p className={'text-red-500 text-sm'}>{minStockForm.formState.errors.min_stock_kg.message}</p>
                                            )}
                                            <Button
                                                size="sm"
                                                className={'cursor-pointer'}
                                                disabled={isUpdatingMinStock}
                                                onClick={minStockForm.handleSubmit((data) => onUpdateMinStock(item.product_id, data))}
                                            >
                                                {isUpdatingMinStock ? "..." : "Save"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <span>{item.min_stock_kg}</span>
                                            <Button size={'icon'} variant={'outline'} className={'cursor-pointer text-gray-400 hover:text-blue-500'}
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
                                <TableCell className="px-4 py-6">
                                    <span className={cn('px-2 py-1 rounded-full text-xs font-medium',
                                        item.status === 'OK' && 'bg-green-100 text-green-700',
                                        item.status === 'LOW_STOCK' && 'bg-orange-100 text-orange-700',
                                        item.status === 'OUT_OF_STOCK' && 'bg-red-100 text-red-700',
                                    )}>
                                        {statusMap[item.status]}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-6">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button className="cursor-pointer bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700">
                                                <Plus className="w-4 h-4 mr-1" />
                                                Add Stock
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="w-56 space-y-3">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">Add Stock (kg)</p>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter kg"
                                                    {...stockForm.register("quantity_kg")}
                                                />
                                                {stockForm.formState.errors.quantity_kg && (
                                                    <p className={'text-red-500 text-xs'}>{stockForm.formState.errors.quantity_kg.message}</p>
                                                )}
                                            </div>

                                            <Button
                                                className="w-full"
                                                disabled={isAddingStock}
                                                onClick={stockForm.handleSubmit((data) => onAddStock(item.product_id, data))}
                                            >
                                                {isAddingStock ? "Saving..." : "Save"}
                                            </Button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </>
    )
}