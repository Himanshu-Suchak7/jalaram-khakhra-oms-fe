"use client";

import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RUPEE = "\u20B9";

export default function InvoiceDocument({ data }) {
    if (!data) return null;
    const money = (value) => Number(value || 0).toLocaleString("en-IN");

    return (
        <div id="invoice-root">
            <Card>
                <CardHeader className={'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b'}>
                    <div>
                        <h2 className={'text-2xl font-bold mb-1'}>{data.business.name}</h2>
                        <p className={'text-gray-500'}>{data.business.address}</p>
                        <p className={'text-gray-500'}>{data.business.phone} | GSTIN: {data.business.gstin || 'N/A'}</p>
                        <p className={'text-gray-500'}>UPI: {data.business.upi_id}</p>
                    </div>
                    <div className="sm:text-right">
                        <h2 className={'text-2xl font-bold mb-1'}>INVOICE</h2>
                        <p className={'text-gray-500'}>Invoice Number: {data.invoice_number}</p>
                        <p className={'text-gray-500'}>Invoice Date: {data.invoice_date}</p>
                    </div>
                </CardHeader>
                <div className={'p-4 pt-6 sm:p-6 sm:pt-8 border-b'}>
                    <p className={'text-lg font-medium'}>Bill To</p>
                    <div className={'bg-gray-100 p-4 border border-gray-200 rounded-lg mt-2'}>
                        <p className={'text-lg font-medium'}>{data.bill_to.name}</p>
                        <p className={'text-gray-600'}>{data.bill_to.phone}</p>
                    </div>
                    <div className={'border border-gray-200 rounded-lg mt-8'}>
                        <Table>
                            <TableHeader>
                                <TableRow className={'text-lg'}>
                                    <TableHead>PRODUCT</TableHead>
                                    <TableHead className="text-right">QTY (KG)</TableHead>
                                    <TableHead className="text-right">PRICE/KG</TableHead>
                                    <TableHead className="text-right">TOTAL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.items.map((item, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{item.product_name}</TableCell>
                                        <TableCell className="text-right">{item.quantity_kg.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">{RUPEE} {money(item.price_per_kg)}</TableCell>
                                        <TableCell className="text-right font-medium">{RUPEE} {money(item.line_total)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className={'flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mt-6'}>
                        <div>
                            <div className={'flex flex-col items-center'}>
                                <div className="bg-white p-2 border rounded-lg mb-2">
                                    <img src={data.business.upi_qr_image} width={120} height={120} alt={'qr code'}/>
                                </div>
                                <p className={'text-gray-500 font-medium'}>Scan to pay with any UPI App</p>
                            </div>
                        </div>
                        <div className={'w-full sm:w-1/3'}>
                            <div className={'border-b space-y-2 pb-2'}>
                                <div className={'flex items-center justify-between'}>
                                    <p className={'text-lg text-gray-400 font-medium'}>Subtotal</p>
                                    <p className={'font-bold'}>{RUPEE} {money(data.summary.subtotal)}</p>
                                </div>
                                <div className={'flex items-center justify-between'}>
                                    <p className={'text-lg text-gray-400 font-medium'}>Tax ({data.summary.tax_rate}%)</p>
                                    <p className={'font-bold'}>{RUPEE} {money(data.summary.tax)}</p>
                                </div>
                                <div className={'flex items-center justify-between'}>
                                    <p className={'text-lg text-gray-400 font-medium'}>Shipping ({data.summary.shipping_rate}%)</p>
                                    <p className={'font-bold'}>{RUPEE} {money(data.summary.shipping)}</p>
                                </div>
                            </div>
                            <div className={'flex items-center justify-between py-2 mt-2'}>
                                <p className={'text-xl font-bold'}>Grand Total</p>
                                <p className={'text-2xl text-red-600 font-bold'}>{RUPEE} {money(data.summary.grand_total)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <p className={'text-lg font-medium'}>Notes:</p>
                        <p className={'text-gray-500'}>{data.notes}</p>
                    </div> 
                </div>
                <CardFooter className={'justify-center items-center text-lg font-bold py-6'}>
                    Thank you for shopping with Jalaram Khakhra!
                </CardFooter>
            </Card>
        </div>
    )
}
