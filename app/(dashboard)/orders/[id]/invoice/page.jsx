"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MainButton from "@/components/MainButton";
import { Download } from "lucide-react";
import { getInvoiceData, downloadInvoicePdf } from "@/lib/orders";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";

export default function InvoicePage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const handleDownload = () => {
        downloadInvoicePdf(id, `${data?.invoice_number || 'invoice'}.pdf`);
    };

    if (loading) return <div className="p-8 text-center text-2xl font-bold">Loading Invoice...</div>;
    if (!data) return <div className="p-8 text-center text-red-500 font-bold">Invoice not found</div>;

    return (
        <>
            <div className={'flex items-center justify-between mb-6'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Invoice</h1>
                </div>
                <div>
                    <MainButton onClick={handleDownload} content={'Download Invoice'} Icon={Download}/>
                </div>
            </div>
            <InvoiceDocument data={data} />
        </>
    )
}
