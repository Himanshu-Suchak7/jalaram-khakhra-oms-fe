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
import {createProduct} from "@/lib/product";

export default function AddProductPopUp({open, onOpenChange}) {
    const {accessToken} = useAuth();
    const queryClient = useQueryClient();

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

    const imageValue = watch("image");

    const mutation = useMutation({
        mutationFn: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("price", values.price);
            if (values.image instanceof File) {
                formData.append("image", values.image);
            }
            return createProduct(accessToken, formData);
        },
        onSuccess: () => {
            toast.success("Product added successfully");
            reset();
            onOpenChange(false);
            queryClient.invalidateQueries({queryKey: ["products"]});
        },
        onError: (error) => {
            toast.error(error.message || "Failed to add product");
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Add a Product</DialogTitle>
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
                            content={mutation.isPending ? 'Saving...' : 'Save Product'}
                            loading={mutation.isPending}
                            className="w-full sm:w-auto"
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
