import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addInventoryTransaction} from "@/lib/inventory";
import {toast} from "sonner";

export const useAddStock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => addInventoryTransaction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
            queryClient.invalidateQueries({ queryKey: ["inventory-summary"] });
            toast.success("Stock added successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to add stock");
        }
    });
};
