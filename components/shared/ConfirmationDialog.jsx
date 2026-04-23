import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {AlertCircle} from "lucide-react";

export default function ConfirmationDialog({ 
    open, 
    onOpenChange, 
    onConfirm, 
    title = "Are you absolutely sure?", 
    description = "This action cannot be undone. This will permanently delete the data from our servers.",
    confirmText = "Yes, Delete",
    cancelText = "Cancel",
    isPending = false,
    variant = "danger"
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className={`text-2xl sm:text-3xl font-bold flex flex-col sm:flex-row sm:items-center gap-3 ${variant === 'danger' ? 'text-red-600' : 'text-blue-600'}`}>
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                        <span>{title}</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xl text-muted-foreground pt-3">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-4 pt-8">
                    <AlertDialogCancel className="rounded-2xl px-10 py-7 border-none bg-muted/50 text-xl font-bold hover:bg-muted transition-all">
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={`rounded-2xl px-12 py-7 text-white text-xl font-bold transition-all shadow-xl ${
                            variant === 'danger' 
                                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' 
                                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                        }`}
                    >
                        {isPending ? "Processing..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
