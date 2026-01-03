import MainButton from "@/components/MainButton";
import {Plus, Search} from "lucide-react"
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";

const products = [
    {
        imgUrl: '/products/methi-khakhra.png',
        name: 'Methi Khakhra',
        price: 200,
    },
    {
        imgUrl: '/products/jeera-khakhra.png',
        name: 'Jeera Khakhra',
        price: 200,
    },
    {
        imgUrl: '/products/jalaram-patra.png',
        name: 'Jalaram Patra',
        price: 80,
    },
    {
        imgUrl: '/products/methi-khakhra.png',
        name: 'Methi Khakhra',
        price: 200,
    },
    {
        imgUrl: '/products/jeera-khakhra.png',
        name: 'Jeera Khakhra',
        price: 200,
    },
    {
        imgUrl: '/products/jalaram-patra.png',
        name: 'Jalaram Patra',
        price: 80,
    },
    {
        imgUrl: '/products/methi-khakhra.png',
        name: 'Methi Khakhra',
        price: 200,
    },
    {
        imgUrl: '/products/jeera-khakhra.png',
        name: 'Jeera Khakhra',
        price: 200,
    },
    {
        imgUrl: '/products/jalaram-patra.png',
        name: 'Jalaram Patra',
        price: 80,
    },
]

export default function Products() {
    return (
        <>
            <div className={'flex items-center justify-between'}>
                <h1 className={'text-4xl font-bold'}>Products</h1>
                <Dialog>
                    <DialogTrigger>
                        <MainButton content={'Add Product'} Icon={Plus}/>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a Product</DialogTitle>
                        </DialogHeader>
                        <div className={'space-y-8'}>
                            <div className={'flex items-center gap-4'}>
                                <div className={'w-1/2 space-y-2'}>
                                    <Label htmlFor={'name'}>Product Name</Label>
                                    <Input type={'text'} placeholder={'e.g. Methi Khakhra'}/>
                                </div>
                                <div className={'w-1/2 space-y-2'}>
                                    <Label htmlFor={'price'}>Product Price</Label>
                                    <Input type={'text'} placeholder={'e.g. ₹ 200'}/>
                                </div>
                            </div>
                            <div>
                                <Label>Product Image</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <MainButton content={'Save Product'}/>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className={'w-full relative'}>
                <Search className={'absolute left-3 top-[50%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                <Input className={'pl-9'} type={'text'} placeholder={'Search a product by name'}/>
            </div>
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
                {products.map((product, index) => (
                    <Card key={index} className={'pt-0'}>
                        <div className={'relative h-52 w-full'}>
                            <Image src={product.imgUrl} alt={product.name} fill
                                   className={'object-contain rounded-t-xl'}/>
                        </div>
                        <CardContent>
                            <h3 className={'text-xl font-bold'}>{product.name}</h3>
                            <p className={'text-gray-600 font-medium text-lg'}>₹ {product.price}</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className={'bg-blue-100 text-blue-700 cursor-pointer w-full text-lg px-4 py-2 hover:bg-blue-200'}>
                                Edit
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    )
}