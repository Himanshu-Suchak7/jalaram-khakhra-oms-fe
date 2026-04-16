import {useAuth} from "@/lib/auth-context";
import {useQuery} from "@tanstack/react-query";
import {getInventory} from "@/lib/inventory";

export const useInventoryItems = () => {
    const {accessToken} = useAuth();
    return useQuery({
        queryKey: ["inventory-items"],
        queryFn: () => getInventory(accessToken),
        enabled: !!accessToken,
    })
}