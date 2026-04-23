'use client'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import MainButton from "@/components/MainButton";
import ProductImageUpload from "./ProductImageUpload";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {productSchema} from "@/lib/validator/schema";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@/lib/auth-context";
import {createProduct, updateProduct} from "@/lib/product";
import {useEffect} from "react";

export default function ProductPopUp({open, onOpenChange, product = null}) {
    const {accessToken} = useAuth();
    const {user} = useAuth();
    const queryClient = useQueryClient();
    const isEdit = !!product;
    const isAdmin = user?.role === "admin";

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: "",
            cost_price_per_kg: "",
            image: undefined
        }
    });

    useEffect(() => {
        if (open) {
            if (product) {
                reset({
                    name: product.name || "",
                    price: product.price || "",
                    cost_price_per_kg: product.cost_price_per_kg ?? "",
                    image: product.image || undefined
                });
            } else {
                reset({
                    name: "",
                    price: "",
                    cost_price_per_kg: "",
                    image: undefined
                });
            }
        }
    }, [open, product, reset]);

    const imageValue = watch("image");

    const mutation = useMutation({
        mutationFn: async (values) => {
            if (!isAdmin) {
                throw new Error("Admin access required");
            }
            if (values.cost_price_per_kg === "" || values.cost_price_per_kg === undefined || values.cost_price_per_kg === null) {
                throw new Error("Cost price is required");
            }

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("price", values.price);
            formData.append("cost_price_per_kg", String(values.cost_price_per_kg));
            
            // Only append image if it's a new File object
            if (values.image instanceof File) {
                formData.append("image", values.image);
            }

            if (isEdit) {
                return updateProduct(accessToken, product.id, formData);
            } else {
                return createProduct(accessToken, formData);
            }
        },
        onSuccess: () => {
            toast.success(isEdit ? "Product updated successfully" : "Product added successfully");
            reset();
            onOpenChange(false);
            queryClient.invalidateQueries({queryKey: ["products"]});
        },
        onError: (error) => {
            toast.error(error.message || `Failed to ${isEdit ? 'update' : 'add'} product`);
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {isEdit ? "Update Product" : "Add a Product"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className={'space-y-6'}>
                    <div className={'space-y-4'}>
                        <div className={'space-y-2'}>
                            <Label htmlFor={'name'}>Product Name</Label>
                            <Input
                                {...register("name")}
                                type={'text'}
                                placeholder={'e.g. Methi Khakhra'}
                                className={errors.name && "border-red-500"}
                            />
                            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                        </div>

                        <div className={'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
                            <div className={'space-y-2'}>
                                <Label htmlFor={'price'}>Selling Price /kg (₹)</Label>
                            <Input
                                {...register("price")}
                                type={'number'}
                                step="0.01"
                                placeholder={'e.g. 200'}
                                className={errors.price && "border-red-500"}
                            />
                            {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price.message}</p>}
                        </div>

                            {isAdmin && (
                                <div className={'space-y-2'}>
                                    <Label htmlFor={'cost_price_per_kg'}>Cost Price /kg (₹)</Label>
                                    <Input
                                        {...register("cost_price_per_kg")}
                                        type={'number'}
                                        step="0.01"
                                        placeholder={'e.g. 150'}
                                        className={errors.cost_price_per_kg && "border-red-500"}
                                    />
                                    {errors.cost_price_per_kg && <p className="text-xs text-red-500 font-medium">{errors.cost_price_per_kg.message}</p>}
                                </div>
                            )}
                        </div>
                    </div>

                    <ProductImageUpload
                        value={imageValue}
                        onChange={(file) => setValue("image", file)}
                        className={errors.image && "animate-shake"}
                    />
                    {errors.image && <p className="text-xs text-red-500 font-medium">{errors.image.message}</p>}

                    <DialogFooter className="pt-4 border-t">
                        <MainButton
                            type="submit"
                            content={mutation.isPending ? 'Saving...' : (isEdit ? 'Update Product' : 'Save Product')}
                            loading={mutation.isPending}
                            className="w-full sm:w-auto"
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
