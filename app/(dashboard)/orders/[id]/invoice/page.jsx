"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MainButton from "@/components/MainButton";
import { Download } from "lucide-react";
import { getInvoiceData, downloadInvoicePdf } from "@/lib/orders";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoicePage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (id) {
            getInvoiceData(id)
                .then(res => {
                    setData(res);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await downloadInvoicePdf(id, `${data?.invoice_number || 'invoice'}.pdf`);
        } catch (error) {
            console.error("Failed to download invoice", error);
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className={'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'}>
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-12 w-full sm:w-56" />
                </div>
                <div className="rounded-xl border p-6 space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="pt-4">
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
            </div>
        );
    }
    if (!data) return <div className="p-8 text-center text-red-500 font-bold">Invoice not found</div>;

    return (
        <>
            <div className={'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Invoice</h1>
                </div>
                <div className="w-full sm:w-auto">
                    <MainButton 
                        onClick={handleDownload} 
                        content={'Download Invoice'} 
                        Icon={Download} 
                        loading={downloading}
                    />
                </div>
            </div>
            <InvoiceDocument data={data} />
        </>
    )
}
