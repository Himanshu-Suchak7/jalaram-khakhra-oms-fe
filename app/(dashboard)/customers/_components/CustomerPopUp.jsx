'use client'
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import MainButton from "@/components/MainButton";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {customerSchema} from "@/lib/validator/schema";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@/lib/auth-context";
import {createCustomer, updateCustomer} from "@/lib/customer";
import {useEffect} from "react";

export default function CustomerPopUp({open, onOpenChange, customer = null}) {
    const {accessToken} = useAuth();
    const queryClient = useQueryClient();
    const isEdit = !!customer;

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            name: "",
            phone_number: "",
            address: "",
            city: ""
        }
    });

    useEffect(() => {
        if (open) {
            if (customer) {
                reset({
                    name: customer.name || "",
                    phone_number: customer.phone_number || customer.phone || "",
                    address: customer.customer_address || customer.address || "",
                    city: customer.customer_city || customer.city || ""
                });
            } else {
                reset({
                    name: "",
                    phone_number: "",
                    address: "",
                    city: ""
                });
            }
        }
    }, [open, customer, reset]);

    const mutation = useMutation({
        mutationFn: async (values) => {
            if (isEdit) {
                return updateCustomer(accessToken, values, customer.id);
            } else {
                return createCustomer(accessToken, values);
            }
        },
        onSuccess: () => {
            toast.success(isEdit ? "Customer updated successfully" : "Customer added successfully");
            reset();
            onOpenChange(false);
            queryClient.invalidateQueries({queryKey: ["customers"]});
        },
        onError: (error) => {
            toast.error(error.message || `Failed to ${isEdit ? 'update' : 'add'} customer`);
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {isEdit ? "Update Customer" : "Add a Customer"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className={'space-y-6 pt-4'}>
                    <div className={'space-y-4'}>
                        <div className={'space-y-2'}>
                            <Label htmlFor={'name'} className="text-sm font-semibold">Customer Name</Label>
                            <Input
                                {...register("name")}
                                type={'text'}
                                placeholder={'e.g. Dharmesh Suchak'}
                                className={cn("h-12 rounded-xl border-border focus:border-blue-400 transition-all", errors.name && "border-red-500")}
                            />
                            {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                        </div>
                        <div className={'space-y-2'}>
                            <Label htmlFor={'phone_number'} className="text-sm font-semibold">Phone Number</Label>
                            <Input
                                {...register("phone_number")}
                                type={'text'}
                                placeholder={'e.g. 9825083947'}
                                className={cn("h-12 rounded-xl border-border focus:border-blue-400 transition-all", errors.phone_number && "border-red-500")}
                            />
                            {errors.phone_number && <p className="text-xs text-red-500 font-medium">{errors.phone_number.message}</p>}
                        </div>
                        <div className={'space-y-2'}>
                            <Label htmlFor={'address'} className="text-sm font-semibold">Address</Label>
                            <Input
                                {...register("address")}
                                type={'text'}
                                placeholder={'e.g. 123 Main St'}
                                className={cn("h-12 rounded-xl border-border focus:border-blue-400 transition-all", errors.address && "border-red-500")}
                            />
                            {errors.address && <p className="text-xs text-red-500 font-medium">{errors.address.message}</p>}
                        </div>
                        <div className={'space-y-2'}>
                            <Label htmlFor={'city'} className="text-sm font-semibold">City</Label>
                            <Input
                                {...register("city")}
                                type={'text'}
                                placeholder={'e.g. Rajkot'}
                                className={cn("h-12 rounded-xl border-border focus:border-blue-400 transition-all", errors.city && "border-red-500")}
                            />
                            {errors.city && <p className="text-xs text-red-500 font-medium">{errors.city.message}</p>}
                        </div>
                    </div>

                    <DialogFooter className="pt-6 border-t mt-6">
                        <MainButton
                            type="submit"
                            content={mutation.isPending ? 'Saving...' : (isEdit ? 'Update Customer' : 'Save Customer')}
                            loading={mutation.isPending}
                            className="w-full sm:w-auto text-lg py-6"
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

import {cn} from "@/lib/utils";
