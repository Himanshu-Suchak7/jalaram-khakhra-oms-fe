"use client";
import MainButton from "@/components/MainButton";
import {Download} from "lucide-react";
import {Card, CardFooter, CardHeader} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {useRef} from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoicePage() {
    return (
        <>
            <div className={'flex items-center justify-between'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Invoice</h1>
                </div>
                <div>
                    <MainButton content={'Download Invoice '} Icon={Download}/>
                </div>
            </div>
            <Card>
                <CardHeader className={'flex items-center justify-between border-b'}>
                    <div>
                        <h2 className={'text-2xl font-bold mb-1'}>Jalaram Khakhra</h2>
                        <p className={'text-gray-500'}>123, Commerce Street, Ahmedabad, Gujarat 380058</p>
                        <p className={'text-gray-500'}>+91 9876543210 | GSTIN: 24ABCDE1234F1Z5</p>
                        <p className={'text-gray-500'}>UPI: jalaram.khakhra@upi</p>
                    </div>
                    <div>
                        <h2 className={'text-2xl font-bold mb-1'}>INVOICE</h2>
                        <p className={'text-gray-500'}>Invoice Number: INV-2025-005</p>
                        <p className={'text-gray-500'}>Invoice Date: 27 December 2025</p>
                    </div>
                </CardHeader>
                <div className={'p-6 pt-8 border-b'}>
                    <p className={'text-lg font-medium'}>Bill To</p>
                    <div className={'bg-gray-100 p-4 border border-gray-200 rounded-lg mt-2'}>
                        <p className={'text-lg font-medium'}>Customer Name (Here comes the name of the person)</p>
                        <p className={'text-gray-600'}>+91 9876543210</p>
                    </div>
                    <div className={'border border-gray-200 rounded-lg mt-8'}>
                        <Table>
                            <TableHeader>
                                <TableRow className={'text-lg'}>
                                    <TableHead>PRODUCT</TableHead>
                                    <TableHead>QTY (KG)</TableHead>
                                    <TableHead>PRICE/KG</TableHead>
                                    <TableHead>TOTAL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Methi Khakhra</TableCell>
                                    <TableCell>5</TableCell>
                                    <TableCell>₹ 200</TableCell>
                                    <TableCell>₹ 1000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Jeera Khakhra</TableCell>
                                    <TableCell>5</TableCell>
                                    <TableCell>₹ 200</TableCell>
                                    <TableCell>₹ 1000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Jalaram Patra</TableCell>
                                    <TableCell>4</TableCell>
                                    <TableCell>₹ 80</TableCell>
                                    <TableCell>₹ 320</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                    <div className={'flex items-center justify-between mt-6'}>
                        <div>
                            <div className={'flex flex-col items-center'}>
                                <Image src={'/qr-code.png'} width={150} height={150} alt={'qr code'}/>
                                <p className={'text-gray-500 font-medium'}>Scan to pay with any UPI App</p>
                            </div>
                        </div>
                        <div className={'w-1/4'}>
                            <div className={'border-b space-y-2 pb-2'}>
                                <div className={'flex items-center justify-between'}>
                                    <p className={'text-lg text-gray-400 font-medium'}>Subtotal</p>
                                    <p className={'font-bold'}>₹ 400</p>
                                </div>
                                <div className={'flex items-center justify-between'}>
                                    <p className={'text-lg text-gray-400 font-medium'}>Tax</p>
                                    <p className={'font-bold'}>₹ 72</p>
                                </div>
                                <div className={'flex items-center justify-between'}>
                                    <p className={'text-lg text-gray-400 font-medium'}>Shipping</p>
                                    <p className={'font-bold'}>₹ 50</p>
                                </div>
                            </div>
                            <div className={'flex items-center justify-between py-2'}>
                                <p className={'text-lg font-medium'}>Grand Total</p>
                                <p className={'text-xl text-blue-700 font-bold'}>₹ 522</p>
                            </div>
                        </div>
                    </div>
                </div>
                <CardFooter className={'justify-center items-center text-lg font-bold'}>
                    Thank You for your Business!
                </CardFooter>
            </Card>
        </>
    )
}
