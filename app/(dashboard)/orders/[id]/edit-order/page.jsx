'use client'
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getOrderDetails } from "@/lib/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function EditOrderRedirect({ params }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrderDetails(id)
            .then((res) => {
                const orderStatus = String(res?.order?.order_status || "").split(".").pop().toUpperCase();
                if (orderStatus === "CANCELLED") toast.error("Cancelled orders cannot be edited");
                router.replace(`/orders/${id}/edit`);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load order");
                router.replace("/orders");
            })
            .finally(() => setLoading(false));
    }, [id, router]);

    if (!loading) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-80 w-full" />
        </div>
    );
}

