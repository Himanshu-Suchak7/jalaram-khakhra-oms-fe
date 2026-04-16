import {useAuth} from "@/lib/auth-context";
import {useQuery} from "@tanstack/react-query";
import {getInventorySummary} from "@/lib/inventory";

export const useInventorySummary = () => {
    const {accessToken} = useAuth();
    return useQuery({
        queryKey: ['inventory-summary'],
        queryFn: ()=> getInventorySummary(accessToken),
        enabled: !!accessToken,
    })
}