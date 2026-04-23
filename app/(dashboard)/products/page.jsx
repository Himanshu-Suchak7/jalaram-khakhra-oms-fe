'use client'
import {Plus, Search, PackageOpen, Trash2} from "lucide-react"
import {Input} from "@/components/ui/input";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {useState, useMemo} from "react";
import ProductPopUp from "@/app/(dashboard)/products/_components/ProductPopUp";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getProducts, deleteProduct} from "@/lib/product";
import {useAuth} from "@/lib/auth-context";
import {toast} from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shared/PageHeader";
import ConfirmationDialog from "@/components/shared/ConfirmationDialog";

export default function Products() {
    const {accessToken, user} = useAuth();
    const queryClient = useQueryClient();
    const isAdmin = user?.role === "admin";
    const [openProductModal, setOpenProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    const {
        data: products = [],
        isLoading: loading,
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

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-red-500 font-bold text-xl">Failed to load products</p>
                <Button onClick={() => refetch()} variant="outline" className="rounded-xl px-8 h-12 text-lg">Retry Connection</Button>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PageHeader 
                title="Products Catalog" 
                description="Manage your product catalog, media assets, and pricing strategy."
                buttonContent={isAdmin ? "Add New Product" : undefined}
                buttonIcon={isAdmin ? Plus : undefined}
                onButtonClick={isAdmin ? handleAdd : undefined}
            />

            {loading ? (
                <>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Skeleton className="h-14 w-full rounded-xl shadow-sm" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <Card key={idx} className="overflow-hidden border-gray-100 rounded-2xl shadow-sm bg-white">
                                <Skeleton className="h-60 w-full" />
                                <div className="p-6 space-y-3">
                                    <Skeleton className="h-7 w-3/4" />
                                    <Skeleton className="h-6 w-1/3" />
                                </div>
                                <CardFooter className="pb-6 pt-2 flex gap-3 px-6">
                                    <Skeleton className="h-12 flex-1 rounded-xl" />
                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl gap-6">
                    <div className="bg-white p-8 rounded-full shadow-sm">
                        <PackageOpen className="w-20 h-20 text-blue-400"/>
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-800">Your shelf is empty!</h2>
                        <p className="text-gray-500 text-lg max-w-sm font-medium">Add your first product to start taking orders.</p>
                    </div>
                    {isAdmin ? (
                        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 rounded-2xl text-xl font-bold shadow-xl shadow-blue-500/20 transition-all">
                            <Plus className="w-6 h-6 mr-2" /> Add My First Product
                        </Button>
                    ) : (
                        <div className="text-gray-500 font-bold">Ask an admin to add products.</div>
                    )}
                </div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className={'w-full relative'}>
                            <Search className={'absolute left-4 top-[50%] -translate-y-1/2 h-5 w-5 text-muted-foreground'}/>
                            <Input
                                className={'pl-12 h-14 rounded-xl text-lg border-gray-100 focus:border-blue-400 shadow-sm transition-all font-medium'}
                                type={'text'}
                                placeholder={'Search in your catalog...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-gray-500 font-bold">No products match your search.</div>
                        ) : filteredProducts.map((product) => (
                            <Card key={product.id} className={'group hover:shadow-2xl transition-all duration-300 border-gray-100/60 rounded-2xl flex flex-col overflow-hidden bg-white'}>
                                <div className={'relative h-60 w-full pt-4 bg-gray-50/30'}>
                                    <Image src={renderProductImage(product)} alt={product.name} fill className={'object-contain group-hover:scale-110 transition-transform duration-500 p-4'} />
                                </div>
                                <CardContent className="pt-6 flex-grow px-6">
                                    <h3 className={'text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors'}>{product.name}</h3>
                                    <p className="text-blue-600 font-bold text-xl mt-2 tracking-tight">₹ {product.price}</p>
                                </CardContent>
                                <CardFooter className="pt-2 pb-6 flex items-center gap-3 px-6">
                                    <Button onClick={() => handleEdit(product)} disabled={!isAdmin} className={'bg-blue-600 text-white flex-1 text-lg py-7 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 font-bold border-none disabled:opacity-50 disabled:cursor-not-allowed'}>
                                        Edit Details
                                    </Button>
                                    <Button onClick={() => requestDelete(product.id)} disabled={!isAdmin} variant="outline" className="p-5 h-auto rounded-xl text-red-500 border-red-50 hover:bg-red-50 hover:text-red-600 transition-all border-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <Trash2 className="w-6 h-6" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {isAdmin && (
                <ProductPopUp open={openProductModal} onOpenChange={setOpenProductModal} product={editingProduct} />
            )}

            <ConfirmationDialog 
                open={isDeleteDialogOpen} 
                onOpenChange={setIsDeleteDialogOpen} 
                onConfirm={confirmDelete}
                isPending={deleteMutation.isPending}
                title="Delete Product?"
                description="This will permanently remove the product and its image from your catalog. This action cannot be reversed."
                confirmText="Yes, Delete Product"
            />
        </div>
    )
}
