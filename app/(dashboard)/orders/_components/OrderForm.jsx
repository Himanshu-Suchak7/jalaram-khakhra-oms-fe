'use client';
import {Card, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import MainButton from "@/components/MainButton";
import {Check, ChevronDownIcon, Trash2, Pencil, Plus, Search, User, Package} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {useState, useEffect} from "react";
import {Textarea} from "@/components/ui/textarea";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {getCustomers} from "@/lib/customer";
import {getInventory} from "@/lib/inventory";
import {createOrder, updateOrder} from "@/lib/orders";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function OrderForm({mode = 'add', order}) {
    const isEdit = mode === 'edit';
    const isAdd = mode === "add";
    const router = useRouter();

    const [customers, setCustomers] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearch, setCustomerSearch] = useState("");
    const [customerPopoverOpen, setCustomerPopoverOpen] = useState(false);

    const [date, setDate] = useState(new Date());
    const [datePopoverOpen, setDatePopoverOpen] = useState(false);

    const [items, setItems] = useState([{product_id: "", name: "", quantity: "", price: "", image: "", stock: 0}]);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCustomers().then(setCustomers).catch(console.error);
        getInventory().then(res => setAllProducts(res.data)).catch(console.error);

        if (isEdit && order) {
            const o = order.order;
            setSelectedCustomer({
                id: o.customer_id,
                name: o.customer_name,
                phone_number: o.customer_phone_number
            });
            if (o.created_at) setDate(new Date(o.created_at));
            setNotes(o.notes || "");
            
            if (order.items) {
                setItems(order.items.map(i => ({
                    product_id: i.product_id,
                    name: i.product_name,
                    quantity: String(i.quantity_kg),
                    price: String(i.price_per_kg),
                    image: "", 
                    stock: 999 
                })));
            }
        }
    }, [order, isEdit]);

    const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity || 0) * Number(item.price || 0)), 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal * 0.15;
    const grandTotal = subtotal + tax + shipping;

    const addItem = () => {
        if (items.length >= 10) return toast.error("Maximum 10 items allowed");
        setItems([...items, {product_id: "", name: "", quantity: "", price: "", image: "", stock: 0}]);
    };

    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const handleSave = async () => {
        if (!selectedCustomer) return toast.error("Please select a customer");
        if (items.some(i => !i.product_id || !i.quantity)) return toast.error("Please fill all item details");

        setLoading(true);
        try {
            const payload = {
                customer_id: selectedCustomer.id,
                customer_name: selectedCustomer.name,
                customer_phone_number: selectedCustomer.phone_number,
                items: items.map(i => ({
                    product_id: i.product_id,
                    quantity_kg: Number(i.quantity),
                    price_per_kg: Number(i.price)
                })),
                notes
            };
            
            if (isEdit) {
                await updateOrder(order.order.id, payload);
                toast.success("Order updated successfully");
            } else {
                await createOrder(payload);
                toast.success("Order created successfully");
            }
            router.push("/orders");
        } catch (err) {
            console.error(err);
            toast.error(isEdit ? "Failed to update order" : "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-5xl mx-auto">
            <CardHeader className={'border-b bg-gray-50/50'}>
                <CardTitle className={'text-lg'}>Customer & Date</CardTitle>
                <div className={'flex flex-col sm:flex-row sm:items-center gap-4 mt-4'}>
                    <div className={'w-full sm:w-1/2 space-y-2'}>
                        <Label>Customer Name</Label>
                        <Popover open={customerPopoverOpen} onOpenChange={setCustomerPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between font-normal h-12">
                                    {selectedCustomer ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {selectedCustomer.name[0]}
                                            </div>
                                            <span>{selectedCustomer.name}</span>
                                        </div>
                                    ) : "Select Customer"}
                                    <ChevronDownIcon className="h-4 w-4 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[min(400px,calc(100vw-2rem))] p-0" align="start">
                                <div className="p-2 border-b">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                        <Input 
                                            placeholder="Search customer..." 
                                            className="pl-8 h-9"
                                            value={customerSearch}
                                            onChange={(e) => setCustomerSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto p-1">
                                    {(customers || []).filter(c => (c.name || "").toLowerCase().includes((customerSearch || "").toLowerCase())).map(c => (
                                        <div 
                                            key={c.id}
                                            onClick={() => {
                                                setSelectedCustomer(c);
                                                setCustomerPopoverOpen(false);
                                            }}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                                {(c.name || "C")[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium">{c.name}</p>
                                                <p className="text-xs text-gray-500">{c.phone_number}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className={'w-full sm:w-1/2 space-y-2'}>
                        <Label className="px-1">Order Date</Label>
                        <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between font-normal h-12">
                                    {date ? date.toLocaleDateString() : "Select date"}
                                    <ChevronDownIcon className="h-4 w-4 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[min(340px,calc(100vw-2rem))] p-0" align="start">
                                <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setDatePopoverOpen(false); }} />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardHeader>

            <div className={'px-6 py-6 border-b'}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className={'font-semibold text-lg flex items-center gap-2'}><Package className="w-5 h-5 text-blue-500"/> Order Items</h3>
                    <Button variant='outline' size="sm" onClick={addItem} className='cursor-pointer gap-1'>
                        <Plus className="w-4 h-4"/> Add Item
                    </Button>
                </div>

                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-4 items-end bg-gray-50/30 p-4 rounded-xl border border-dashed">
                            <div className="col-span-12 md:col-span-4 space-y-2">
                                <Label>Select Product</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-between font-normal h-11">
                                            {item.product_id ? (
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className="w-6 h-6 flex-shrink-0">
                                                        <img src={item.image || "/placeholder.png"} alt={item.name || "product"} className="w-full h-full object-cover rounded" />
                                                    </div>
                                                    <span className="truncate">{item.name}</span>
                                                </div>
                                            ) : "Choose product..."}
                                            <ChevronDownIcon className="h-4 w-4 opacity-50"/>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[min(350px,calc(100vw-2rem))] p-0" align="start">
                                        <div className="max-h-[300px] overflow-y-auto p-1">
                                            {(allProducts || []).map(p => (
                                                <div 
                                                    key={p.product_id}
                                                    onClick={() => {
                                                        const newItems = [...items];
                                                        newItems[idx] = {
                                                            product_id: p.product_id,
                                                            name: p.product_name,
                                                            price: p.price_per_kg || 0, // Need to make sure price is available
                                                            image: p.image,
                                                            stock: p.stock_kg,
                                                            quantity: ""
                                                        };
                                                        // Fallback check if price is missing in inventory, we might need a separate call or unified endpoint
                                                        // Let's assume for now it's there or handle it
                                                        setItems(newItems);
                                                    }}
                                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                                >
                                                        <img src={p.image || "/placeholder.png"} alt={p.product_name || "product"} className="w-10 h-10 object-cover rounded border" />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{p.product_name}</p>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs text-blue-600 font-bold">₹ {p.stock_kg > 0 ? "In Stock" : "Out of Stock"}</p>
                                                            <p className="text-xs font-medium text-gray-500">Avail: {p.stock_kg} kg</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="col-span-6 md:col-span-2 space-y-2">
                                <Label>Qty (kg) <span className="text-[10px] text-blue-500 font-bold">Max: {item.stock}</span></Label>
                                <Select 
                                    disabled={!item.product_id || item.stock <= 0}
                                    onValueChange={(val) => {
                                        const newItems = [...items];
                                        newItems[idx].quantity = val;
                                        setItems(newItems);
                                    }}
                                    value={item.quantity}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Qty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: Math.min(Math.floor(item.stock), 100) }, (_, i) => i + 1).map(num => (
                                            <SelectItem key={num} value={num.toString()}>
                                                {num} kg
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-6 md:col-span-2 space-y-2">
                                <Label>Price /kg</Label>
                                <Input 
                                    type="number" 
                                    className="h-11"
                                    value={item.price} 
                                    onChange={(e) => {
                                        const newItems = [...items];
                                        newItems[idx].price = e.target.value;
                                        setItems(newItems);
                                    }}
                                />
                            </div>

                            <div className="col-span-12 md:col-span-3 flex items-center justify-between gap-2">
                                <div className="flex flex-col">
                                    <Label className="text-xs text-gray-500">Line Total</Label>
                                    <span className="text-lg font-bold">₹ {(Number(item.quantity || 0) * Number(item.price || 0)).toLocaleString()}</span>
                                </div>
                                {items.length > 1 && (
                                    <Button variant="ghost" size="icon" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="w-5 h-5"/>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={'grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-8'}>
                <div className={'space-y-2 order-2 md:order-1'}>
                    <Label className="flex items-center gap-2"><Pencil className="w-4 h-4"/> Order Notes</Label>
                    <Textarea 
                        placeholder={'Special instructions, delivery notes, etc.'} 
                        className="min-h-[120px]"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>
                <div className={'bg-blue-50/50 p-6 rounded-2xl border border-blue-100 order-1 md:order-2'}>
                    <div className={'border-b border-blue-100 space-y-3 pb-4'}>
                        <div className={'flex items-center justify-between'}>
                            <p className={'text-gray-500 font-medium'}>Subtotal</p>
                            <p className={'font-bold'}>₹ {subtotal.toLocaleString()}</p>
                        </div>
                        <div className={'flex items-center justify-between'}>
                            <p className={'text-gray-500 font-medium'}>Tax (18%)</p>
                            <p className={'font-medium'}>₹ {tax.toLocaleString()}</p>
                        </div>
                        <div className={'flex items-center justify-between'}>
                            <p className={'text-gray-500 font-medium'}>Shipping (15%)</p>
                            <p className={'font-medium'}>₹ {shipping.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className={'flex items-center justify-between pt-4'}>
                        <p className={'text-lg sm:text-xl font-bold text-blue-900'}>Grand Total</p>
                        <p className={'text-xl sm:text-2xl text-blue-600 font-black'}>₹ {grandTotal.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <CardFooter className={'gap-4 border-t bg-gray-50/30 py-6 justify-end'}>
                <Link href={'/orders'}>
                    <Button variant={'outline'} className={'px-8'}>Cancel</Button>
                </Link>
                <MainButton 
                    onClick={handleSave} 
                    loading={loading}
                    content={isAdd ? "Create Order" : "Update Order"} 
                    Icon={isAdd ? Check : Pencil}
                />
            </CardFooter>
        </Card>
    );
}
