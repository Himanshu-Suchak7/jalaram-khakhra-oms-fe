"use client";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MainButton from "@/components/MainButton";
import { useAuth } from "@/lib/auth-context";
import { createUser } from "@/lib/user";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema } from "@/lib/validator/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddUserPopUp({ open, onOpenChange, onSuccess }) {
    const { accessToken } = useAuth();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: "",
            phone_number: "",
            role: "",
            password: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (userData) => createUser(accessToken, {
            ...userData,
            role: userData.role.toLowerCase(),
        }),
        onSuccess: () => {
            toast.success("User created successfully");
            reset();
            onOpenChange(false);
            // Invalidate and refetch users
            queryClient.invalidateQueries({ queryKey: ["users"] });
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create user");
        },
    });

    function onSubmit(data) {
        mutation.mutate(data);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a User</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className={"space-y-2"}>
                        <Label>Name</Label>
                        <Input {...register("name")} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div className={"space-y-2"}>
                        <Label>Phone Number</Label>
                        <Input {...register("phone_number")} />
                        {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
                    </div>

                    <div className={"space-y-2"}>
                        <Label>User Role</Label>
                        <Select onValueChange={(val) => setValue("role", val)}>
                            <SelectTrigger className={'w-full'}>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                    </div>

                    <div className={"space-y-2"}>
                        <Label>Password</Label>
                        <Input type="password" {...register("password")} />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <DialogFooter>
                        <MainButton
                            type="submit"
                            content={mutation.isPending ? "Creating..." : "Add User"}
                            disabled={mutation.isPending}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}