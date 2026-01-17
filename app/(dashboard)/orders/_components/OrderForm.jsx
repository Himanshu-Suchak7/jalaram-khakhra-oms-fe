'use client';
import {Card, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import MainButton from "@/components/MainButton";
import {Check, ChevronDownIcon, Trash2, Pencil, Plus} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import Link from "next/link";

export default function OrderForm({mode = 'add', order}) {
    const isEdit = mode === 'edit';
    const isAdd = mode === "add";

    const buttonConfig = {
        content: isAdd ? "Save Order" : "Edit Order",
        Icon: isAdd ? Check : Pencil,
    };

    const [open, setOpen] = useState(false)
    const [date, setDate] = useState(undefined)

    const MAX_PRODUCTS = 10;
    const [products, setProducts] = useState([{name: "", quantity: "", price: ""}]);
    const [productError, setProductError] = useState("");

    const addProduct = () => {
        if (products.length >= MAX_PRODUCTS) {
            setProductError("Maximum 10 products are allowed per order.");
            return;
        }
        setProductError("");
        setProducts([...products, {name: "", quantity: "", price: ""}]);
    }
    const removeProduct = (index) => {
        const updated = products.filter((_, i) => i !== index);
        setProducts(updated);

        if (updated.length < MAX_PRODUCTS) {
            setProductError("");
        }
    };
    return (
        <Card>
            <CardHeader className={'border-b'}>
                <CardTitle className={'text-lg'}>Customer Details</CardTitle>
                <div className={'flex items-center gap-4 mt-4'}>
                    <div className={'w-1/2 space-y-2'}>
                        <Label>Customer Name</Label>
                        {/* TODO Replace with searchable dropdown menu with all customer names in it*/}
                        <Input type={'text'} placeholder={'Enter Customer Name'}/>
                    </div>
                    <div className={'w-1/2 space-y-2'}>
                        <Label htmlFor="date" className="px-1">
                            Order Date
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date"
                                    className="w-full justify-between font-normal"
                                >
                                    {date ? date.toLocaleDateString() : "Select date"}
                                    <ChevronDownIcon/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        setDate(date)
                                        setOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CardHeader>
            <div className={'px-6 pb-6 border-b'}>
                <h3 className={'font-semibold mb-4 text-lg'}>Order Details</h3>
                {products.map((product, index) => {
                    const total =
                        Number(product.quantity || 0) * Number(product.price || 0);

                    return (
                        <div
                            key={index}
                            className="flex items-center gap-4 pb-2"
                        >
                            <div className="w-1/3 space-y-2">
                                {/*TODO Replace with searchable dropdown menu with all product names in it*/}
                                <Label>Product</Label>
                                <Input
                                    value={product.name}
                                    onChange={(e) => {
                                        const updated = [...products];
                                        updated[index].name = e.target.value;
                                        setProducts(updated);
                                    }}
                                    placeholder="Enter Product Name"
                                />
                            </div>

                            <div className="w-1/4 space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    value={product.quantity}
                                    onChange={(e) => {
                                        const updated = [...products];
                                        updated[index].quantity = e.target.value;
                                        setProducts(updated);
                                    }}
                                    placeholder="Enter Product Quantity"
                                />
                            </div>

                            <div className="w-1/4 space-y-2">
                                <Label>Price</Label>
                                <Input
                                    value={product.price}
                                    onChange={(e) => {
                                        const updated = [...products];
                                        updated[index].price = e.target.value;
                                        setProducts(updated);
                                    }}
                                    placeholder="Enter Product Price"
                                />
                            </div>

                            <div className="w-[16.67%] space-y-2">
                                <Label>Total</Label>
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-medium">
                                        ₹ {total}
                                    </div>

                                    {products.length > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={() => removeProduct(index)}
                                            className="text-red-500 border-red-500 hover:bg-red-100 hover:text-red-700"
                                        >
                                            <Trash2 size={18}/>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <Button variant={'outline'} onClick={addProduct} disabled={products.length >= MAX_PRODUCTS}
                        className={'cursor-pointer flex items-center gap-1'}><Plus/> Add Product</Button>
            </div>
            <div className={'flex items-center justify-between px-6'}>
                <div className={'w-1/2 space-y-2'}>
                    <Label>Notes</Label>
                    <Textarea placeholder={'Add Notes about this order...'}/>
                </div>
                <div className={'w-1/4'}>
                    <div className={'border-b space-y-2 pb-2'}>
                        <div className={'flex items-center justify-between'}>
                            <p className={'text-lg text-gray-400 font-medium'}>Subtotal</p>
                            <p className={'font-bold'}>₹ 400</p>
                        </div>
                        <div className={'flex items-center justify-between'}>
                            <p className={'text-lg text-gray-400 font-medium'}>Tax</p>
                            <p className={'font-bold'}>₹ 72</p>
                        </div>
                        <div className={'flex items-center justify-between'}>
                            <p className={'text-lg text-gray-400 font-medium'}>Shipping</p>
                            <p className={'font-bold'}>₹ 50</p>
                        </div>
                    </div>
                    <div className={'flex items-center justify-between py-2'}>
                        <p className={'text-lg font-medium'}>Grand Total</p>
                        <p className={'text-xl text-blue-700 font-bold'}>₹ 522</p>
                    </div>
                </div>
            </div>
            <CardFooter className={'gap-4 border-t justify-end'}>
                <Link href={'/orders'}>
                    <Button variant={'outline'} className={'cursor-pointer'}>Cancel</Button>
                </Link>
                <MainButton content={buttonConfig.content} Icon={buttonConfig.Icon}/>
            </CardFooter>
        </Card>
    )
}