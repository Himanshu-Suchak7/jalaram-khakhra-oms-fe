import {useAuth} from "@/lib/auth-context";
import {useQuery} from "@tanstack/react-query";
import {getInventory} from "@/lib/inventory";

export const useInventoryItems = ({ search = "" } = {}) => {
    return useQuery({
        queryKey: ["inventory-items", search],
        queryFn: () => getInventory(search),
    })
}