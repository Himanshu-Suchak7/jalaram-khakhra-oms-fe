import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import MainButton from "@/components/MainButton";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {adminChangePassword} from "@/lib/user";
import {useAuth} from "@/lib/auth-context";
import {toast} from "sonner";

const changePasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirmation password is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function ChangePassword({open, onOpenChange, user}) {
    const {accessToken} = useAuth();
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    });

    const mutation = useMutation({
        mutationFn: (data) => adminChangePassword(accessToken, user.id, data.password),
        onSuccess: () => {
            toast.success("Password changed successfully");
            reset();
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to change password");
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if(!val) reset();
            onOpenChange(val);
        }}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Change Password</DialogTitle>
                    {user && <p className="text-sm text-gray-500">Updating password for <b>{user.name}</b></p>}
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input 
                                {...register("password")}
                                type="password" 
                                placeholder="Enter new password"
                                className={errors.password && "border-red-500"}
                            />
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input 
                                {...register("confirmPassword")}
                                type="password" 
                                placeholder="Confirm new password"
                                className={errors.confirmPassword && "border-red-500"}
                            />
                            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>
                    <DialogFooter className="pt-4 border-t">
                        <MainButton 
                            type="submit"
                            content={mutation.isPending ? "Updating..." : "Change Password"} 
                            loading={mutation.isPending}
                            className="w-full"
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}