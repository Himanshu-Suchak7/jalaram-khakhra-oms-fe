import MainButton from "@/components/MainButton";
import {Plus, Search} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableFooter, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {cn} from "@/lib/utils";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";

const userTableHeader = ['Name', 'PHONE', 'STATUS', 'ACTIONS']
const userTableData = [
    {
        name: 'Himanshu Suchak',
        phone: '9426112346',
        actions: 'Owner-Cannot modify',
        status: 'ACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        phone: '9825083947',
        actions: 'Reset Password',
        status: 'ACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        phone: '9825083947',
        actions: 'Reset Password',
        status: 'ACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        phone: '9825083947',
        actions: 'Reset Password',
        status: 'INACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        phone: '9825083947',
        actions: 'Reset Password',
        status: 'ACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        phone: '9825083947',
        actions: 'Reset Password',
        status: 'INACTIVE',
    },
]

export default function Customers() {
    return (
        <>
            <div className={'flex items-center justify-between'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>Customer Management</h1>
                    <p className={'text-gray-400 text-lg'}>Manage your customer relationships.</p>
                </div>
                <div className={'flex items-center align-middle'}>
                    <Dialog>
                        <DialogTrigger>
                            <MainButton content={'Add Customer'} Icon={Plus}/>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a Customer</DialogTitle>
                            </DialogHeader>
                            <div className={'space-y-8'}>
                                <div className={'flex items-center gap-4'}>
                                    <div className={'w-1/2 space-y-2'}>
                                        <Label htmlFor={'name'}>Customer Name</Label>
                                        <Input type={'text'} placeholder={'Dharmesh Suchak'}/>
                                    </div>
                                    <div className={'w-1/2 space-y-2'}>
                                        <Label htmlFor={'price'}>Customer Phone Number</Label>
                                        <Input type={'text'} placeholder={'9825083947'}/>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <MainButton content={'Add Customer'}/>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Card className={'pb-0'}>
                <div className={'max-w-[60%] lg:max-w-[45%] w-full px-4 relative'}>
                    <Search className={'absolute left-6 top-[50%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                    <Input className={'pl-9'} type={'text'} placeholder={'Search a customer by name or phone number'}/>
                </div>
                <Table className={'border-t'}>
                    <TableHeader className={'bg-gray-50'}>
                        <TableRow>
                            {userTableHeader.map((header, index) => (
                                <TableCell className={'px-4 py-6 text-lg font-medium'} key={index}>{header}</TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userTableData.map((row, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell className={'flex items-center gap-3 px-4 py-6'} key={index}>
                                            <div className={'flex flex-col'}>
                                                <span className={'font-medium'}>{row.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={'px-4 py-6'}>{row.phone}</TableCell>
                                        <TableCell className={'px-4 py-6'}>
                                            <span
                                                className={cn('px-2 py-1 rounded-full text-xs font-medium',
                                                    row.status === 'ACTIVE'
                                                        ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                )}>
                                                {row.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className={'px-4 py-6'}>{row.actions}</TableCell>
                                    </TableRow>
                                )
                            }
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={2} className={'px-4 py-6'}>Showing 1 to 5 of 5 users</TableCell>
                            <TableCell colSpan={2} className={'px-4 py-6'}>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationPrevious href="#"/>
                                        <PaginationItem>
                                            <PaginationLink href="#">1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#" isActive>
                                                2
                                            </PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="#">3</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationEllipsis/>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext href="#"/>
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Card>
        </>
    )
}