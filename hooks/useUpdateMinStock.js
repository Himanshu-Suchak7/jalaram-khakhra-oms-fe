import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateMinStock} from "@/lib/product";
import {toast} from "sonner";

export const useUpdateMinStock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, data }) => updateMinStock(productId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
            toast.success("Min stock updated successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update min stock");
        }
    });
};
