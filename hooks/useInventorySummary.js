import {useQuery} from "@tanstack/react-query";
import {getInventorySummary} from "@/lib/inventory";

export const useInventorySummary = () => {
    return useQuery({
        queryKey: ['inventory-summary'],
        queryFn: ()=> getInventorySummary(),
    })
}
