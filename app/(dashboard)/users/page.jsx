import {Button} from "@/components/ui/button";
import {Plus, Search} from "lucide-react";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableFooter, TableHeader, TableRow} from "@/components/ui/table";
import Image from "next/image";
import {
    Pagination,
    PaginationContent,
    PaginationPrevious,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
    PaginationNext
} from "@/components/ui/pagination";
import MainButton from "@/components/MainButton";

const userTableHeader = ['Name', 'PHONE', 'ROLE', 'STATUS', 'ACTIONS']
const userTableData = [
    {
        name: 'Himanshu Suchak',
        email: 'himanshusuchak.hs@gmail.com',
        phone: '9426112346',
        role: 'ADMIN',
        actions: 'Owner-Cannot modify',
        profile: '/himanshu_image.jpeg',
        status: 'ACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        email: 'dmsuchk@gmail.com',
        phone: '9825083947',
        role: 'USER',
        actions: 'Reset Password',
        profile: '/papa.jpeg',
        status: 'ACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        email: 'dmsuchk@gmail.com',
        phone: '9825083947',
        role: 'USER',
        actions: 'Reset Password',
        profile: '/papa.jpeg',
        status: 'ACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        email: 'dmsuchk@gmail.com',
        phone: '9825083947',
        role: 'USER',
        actions: 'Reset Password',
        profile: '/papa.jpeg',
        status: 'INACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        email: 'dmsuchk@gmail.com',
        phone: '9825083947',
        role: 'USER',
        actions: 'Reset Password',
        profile: '/papa.jpeg',
        status: 'ACTIVE',
    },
    {
        name: 'Dharmesh Suchak',
        email: 'dmsuchk@gmail.com',
        phone: '9825083947',
        role: 'USER',
        actions: 'Reset Password',
        profile: '/papa.jpeg',
        status: 'INACTIVE',
    },
]

export default function Users() {
    return (
        <>
            <div className={'flex items-center justify-between'}>
                <div className={'space-y-2'}>
                    <h1 className={'text-4xl font-bold'}>User Management</h1>
                    <p className={'text-gray-400 text-lg'}>Manage roles and passwords for all users.</p>
                </div>
                <div className={'flex items-center gap-4 align-middle'}>
                    <p className={'bg-blue-100 text-blue-700 rounded-full px-3 py-2'}>Admin Area</p>
                    <MainButton content={'Add User'} Icon={Plus}/>
                </div>
            </div>
            <Card className={'pb-0'}>
                <div className={'max-w-[60%] lg:max-w-[45%] w-full px-4 relative'}>
                    <Search className={'absolute left-6 top-[50%] -translate-y-1/2 h-4 w-4 text-muted-foreground'}/>
                    <Input className={'pl-9'} type={'text'} placeholder={'Search by name or phone number'}/>
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
                                            <div className={'relative w-8 h-8 overflow-hidden rounded-full'}>
                                                <Image src={row.profile} fill className={'object-cover'}
                                                       alt={'papa'}/>
                                            </div>
                                            <div className={'flex flex-col'}>
                                                <span className={'font-medium'}>{row.name}</span>
                                                <span className={'text-sm text-gray-400'}>({row.email})</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={'px-4 py-6'}>{row.phone}</TableCell>
                                        <TableCell className={'px-4 py-6'}>{row.role}</TableCell>
                                        <TableCell className={'px-4 py-6'}>{row.status}</TableCell>
                                        <TableCell className={'px-4 py-6'}>{row.actions}</TableCell>
                                    </TableRow>
                                )
                            }
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colspan={2} className={'px-4 py-6'}>Showing 1 to 5 of 5 users</TableCell>
                            <TableCell colspan={3} className={'px-4 py-6'}>
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