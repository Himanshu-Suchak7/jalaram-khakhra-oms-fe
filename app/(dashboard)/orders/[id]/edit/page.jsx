'use client'
import { useEffect, useState, use } from "react";
import OrderForm from "@/app/(dashboard)/orders/_components/OrderForm";
import { getOrderDetails } from "@/lib/orders";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditOrder({ params }) {
    const { id } = use(params);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrderDetails(id)
            .then(res => {
                setOrderData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-80 w-full" />
            </div>
        );
    }

    if (!orderData) return <div className="text-center py-20 text-destructive font-bold">Order not found.</div>;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Edit Order</h1>
                <p className="text-muted-foreground">Updating Order #{orderData.order?.order_number}</p>
            </div>
            <OrderForm mode="edit" order={orderData} />
        </div>
    );
}
