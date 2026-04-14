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
    const queryClient = useQueryClient();
    const isEdit = !!product;

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
            image: undefined
        }
    });

    useEffect(() => {
        if (open) {
            if (product) {
                reset({
                    name: product.name || "",
                    price: product.price || "",
                    image: product.image || undefined
                });
            } else {
                reset({
                    name: "",
                    price: "",
                    image: undefined
                });
            }
        }
    }, [open, product, reset]);

    const imageValue = watch("image");

    const mutation = useMutation({
        mutationFn: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("price", values.price);
            
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
                    <div className={'flex flex-col sm:flex-row items-start gap-4'}>
                        <div className={'w-full sm:w-1/2 space-y-2'}>
                            <Label htmlFor={'name'}>Product Name</Label>
                            <Input
                                {...register("name")}
                                type={'text'}
                                placeholder={'e.g. Methi Khakhra'}
                                className={errors.name && "border-red-500"}
                            />
                            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                        </div>
                        <div className={'w-full sm:w-1/2 space-y-2'}>
                            <Label htmlFor={'price'}>Product Price (₹)</Label>
                            <Input
                                {...register("price")}
                                type={'number'}
                                step="0.01"
                                placeholder={'e.g. 200'}
                                className={errors.price && "border-red-500"}
                            />
                            {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price.message}</p>}
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
