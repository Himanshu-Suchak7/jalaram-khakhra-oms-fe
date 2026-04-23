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
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const changePasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirmation password is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function ChangePassword({open, onOpenChange, user}) {
    const {accessToken} = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                    {user && <p className="text-sm text-muted-foreground">Updating password for <b>{user.name}</b></p>}
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input 
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="Enter new password"
                                    className={cn("pr-10", errors.password && "border-red-500")}
                                />
                                <button
                                    type="button"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowPassword((s) => !s)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input 
                                    {...register("confirmPassword")}
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="Confirm new password"
                                    className={cn("pr-10", errors.confirmPassword && "border-red-500")}
                                />
                                <button
                                    type="button"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowConfirmPassword((s) => !s)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
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
