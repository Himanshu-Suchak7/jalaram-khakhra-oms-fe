'use client'
import {Plus, Search, PackageOpen, Trash2, AlertCircle} from "lucide-react"
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {useState, useMemo} from "react";
import ProductPopUp from "@/app/(dashboard)/products/_components/ProductPopUp";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getProducts, deleteProduct} from "@/lib/product";
import {useAuth} from "@/lib/auth-context";
import {Spinner} from "@/components/ui/spinner";
import MainButton from "@/components/MainButton";
import {toast} from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Products() {
    const {accessToken} = useAuth();
    const queryClient = useQueryClient();
    const [openProductModal, setOpenProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    const {
        data: products = [],
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ["products", accessToken],
        queryFn: async () => {
            const response = await getProducts(accessToken);
            return Array.isArray(response) ? response : (response.products || []);
        },
        enabled: !!accessToken,
    });

    const deleteMutation = useMutation({
        mutationFn: (productId) => deleteProduct(accessToken, productId),
        onSuccess: () => {
            toast.success("Product deleted successfully");
            setIsDeleteDialogOpen(false);
            setDeletingProductId(null);
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete product");
        }
    });

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        return products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [products, searchQuery]);

    const renderProductImage = (product) => {
        if (!product.image) return "/jalaram-bapa-image.png";
        return product.image.startsWith("http") ? product.image : `${API_BASE_URL}${product.image}`;
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setOpenProductModal(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setOpenProductModal(true);
    };

    const requestDelete = (productId) => {
        setDeletingProductId(productId);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (deletingProductId) {
            deleteMutation.mutate(deletingProductId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Spinner className="w-10 h-10"/>
                <p className="text-gray-500 font-medium animate-pulse">Fetching your products...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-red-500 font-medium text-lg">Failed to load products</p>
                <Button onClick={() => refetch()} variant="outline" className="rounded-xl px-8">Retry Connection</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className={'flex items-center justify-between'}>
                <div className="space-y-1">
                    <h1 className={'text-4xl font-bold'}>Products</h1>
                    <p className="text-gray-500">Manage your product catalog and pricing.</p>
                </div>
                <MainButton
                    content={'Add Product'}
                    Icon={Plus}
                    onClick={handleAdd}
                />
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm">
                        <PackageOpen className="w-16 h-16 text-blue-400"/>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-800">Your shelf is empty!</h2>
                        <p className="text-gray-500 max-w-sm">
                            You haven&#39;t added any products yet. Let&#39;s get started and add your first product to the catalog.
                        </p>
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl text-lg font-medium shadow-lg shadow-blue-500/20"
                    >
                        <Plus className="w-5 h-5 mr-2" /> Add My First Product
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className={'w-full relative shadow-sm rounded-xl'}>
                            <Search className={'absolute left-3 top-[50%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                            <Input
                                className={'pl-10 h-14 rounded-xl text-lg border-gray-100 focus:border-blue-400 transition-all'}
                                type={'text'}
                                placeholder={'Search a product by name'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                            <div className="bg-gray-100 p-4 rounded-full">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">No results found</h3>
                                <p className="text-gray-500">We couldn&#39;t find any products matching &#34;{searchQuery}&#34;</p>
                            </div>
                            <Button variant="ghost" onClick={() => setSearchQuery("")} className="text-blue-600">Clear Search</Button>
                        </div>
                    ) : (
                        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                            {filteredProducts.map((product) => (
                                <Card key={product.id} className={'group hover:shadow-xl transition-all duration-300 border-gray-100/60 flex flex-col'}>
                                    <div className={'relative h-56 w-full pt-4'}>
                                        <Image
                                            src={renderProductImage(product)}
                                            alt={product.name}
                                            fill
                                            className={'object-contain group-hover:scale-105 transition-transform duration-500 p-2'}
                                        />
                                    </div>
                                    <CardContent className="pt-6 flex-grow">
                                        <h3 className={'text-2xl font-bold text-black'}>{product.name}</h3>
                                        <p className="text-gray-600 font-medium text-lg mt-1">₹ {product.price}</p>
                                    </CardContent>
                                    <CardFooter className="pt-2 pb-6 flex items-center gap-2 px-6">
                                        <Button
                                            onClick={() => handleEdit(product)}
                                            className={'bg-blue-100 text-blue-700 flex-1 text-lg py-6 rounded-xl hover:bg-blue-200 transition-all shadow-none font-semibold border-none'}>
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => requestDelete(product.id)}
                                            variant="outline"
                                            className="p-4 h-auto rounded-xl text-red-500 border-red-50 hover:bg-red-50 hover:text-red-600 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}

            <ProductPopUp
                open={openProductModal}
                onOpenChange={setOpenProductModal}
                product={editingProduct}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-bold flex items-center gap-3 text-red-600">
                            <AlertCircle className="w-8 h-8" />
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-lg text-gray-600 pt-2">
                            This action cannot be undone. This will permanently delete the product from your catalog and remove its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 pt-6">
                        <AlertDialogCancel className="rounded-xl px-6 py-6 border-gray-200 text-lg font-medium hover:bg-gray-50 transition-all">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="rounded-xl px-8 py-6 bg-red-600 hover:bg-red-700 text-white text-lg font-bold shadow-lg shadow-red-500/20 transition-all"
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Product"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


